import express from "express";
import cors from "cors";
import { google } from "googleapis";
import { readFile } from "node:fs/promises";
import path from "node:path";

const app = express();
console.log("****************************************");
console.log("Grace Invite Backend v1.0.0");
console.log("****************************************");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SPREADSHEET_ID =
  process.env.SPREADSHEET_ID ||
  "10StpKpL63zZff29D30KeIW_S967zpm3VmM1xSZeB8xk";
const SHEET_NAME = "Invitations";
const SHEET_RANGE = `${SHEET_NAME}!A:L`;

console.log(
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? "Running with Render credentials"
    : "Running with local credentials"
);

let sheetsClient;
let authClient;

function normalizeInviteId(value) {
  return String(value || "").trim().toLowerCase();
}

function isTruthy(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["yes", "true", "1", "accepted", "y"].includes(normalized);
  }
  return false;
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseConfirmed(value) {
  return isTruthy(value);
}

function parseStatus(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "accepted") return "Accepted";
  if (normalized === "declined") return "Declined";
  if (normalized === "pending") return "Pending";
  return value || "Pending";
}

function mapRowToInvitation(row) {
  return {
    inviteId: row[0] || "",
    inviteeName: row[1] || "",
    mobile: row[2] || "",
    guestsAllowed: parseNumber(row[3]),
    confirmed: parseConfirmed(row[4]),
    adults: parseNumber(row[5]),
    children: parseNumber(row[6]),
    status: parseStatus(row[7]),
    invitationOpened: row[8] || "",
    rsvpTimestamp: row[9] || "",
    inviteSent: row[10] || "",
    reminderSent: row[11] || "",
  };
}

function buildPublicInvitation(invitation) {
  return {
    inviteId: invitation.inviteId,
    inviteeName: invitation.inviteeName,
    guestsAllowed: invitation.guestsAllowed,
    confirmed: invitation.confirmed,
    adults: invitation.adults,
    children: invitation.children,
    status: invitation.status,
  };
}

async function getSheetsApi() {
  if (sheetsClient) {
    return sheetsClient;
  }

  let credentials;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.log("Using Google credentials from Render environment.");

    credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    );
  } else {
    console.log("Using local service-account.json");

    const credentialsPath = path.resolve(
      process.cwd(),
      "service-account.json"
    );

    credentials = JSON.parse(
      await readFile(credentialsPath, "utf8")
    );
  }

  authClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  await authClient.authorize();

  sheetsClient = google.sheets({
    version: "v4",
    auth: authClient,
  });

  return sheetsClient;
}

async function getInvitationRow(inviteId) {
  const sheets = await getSheetsApi();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
  });

  const rows = response.data.values || [];
  const normalizedInviteId = normalizeInviteId(inviteId);

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row || row.length === 0) continue;

    if (normalizeInviteId(row[0]) === normalizedInviteId) {
      return {
        rowIndex: index + 1,
        invitation: mapRowToInvitation(row),
      };
    }
  }

  return null;
}

async function updateSheetCell(rowIndex, columnLetter, value) {
  const sheets = await getSheetsApi();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${columnLetter}${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[value]],
    },
  });
}

async function updateSheetCells(rowIndex, updates) {
  const sheets = await getSheetsApi();
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "RAW",
      data: updates.map(({ columnLetter, value }) => ({
        range: `${SHEET_NAME}!${columnLetter}${rowIndex}`,
        values: [[value]],
      })),
    },
  });
}

async function updateInvitationTimestamp(inviteId, columnLetter, responseField) {
  const rowData = await getInvitationRow(inviteId);
  if (!rowData) {
    return null;
  }

  const timestamp = new Date().toISOString();
  await updateSheetCell(rowData.rowIndex, columnLetter, timestamp);

  return {
    success: true,
    [responseField]: timestamp,
  };
}

function hasExistingRsvp(invitation) {
  const status = String(invitation.status || "").trim().toLowerCase();
  const confirmedValue = String(invitation.confirmed || "").trim().toLowerCase();
  const rsvpTimestamp = String(invitation.rsvpTimestamp || "").trim();

  return (
    status === "accepted" ||
    status === "declined" ||
    ["yes", "no", "true", "false", "1", "0"].includes(confirmedValue) ||
    Boolean(rsvpTimestamp)
  );
}

app.get("/", (req, res) => {
  res.json({ message: "Grace Invite API Running" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Grace Invite API" });
});

app.post("/api/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  console.log(req.body);

  res.json({
    success: true,
    body: req.body,
  });
});

app.get("/api/invitation/:inviteId", async (req, res) => {
  try {
    const rowData = await getInvitationRow(req.params.inviteId);
    if (!rowData) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const { rowIndex, invitation } = rowData;

    if (!invitation.invitationOpened) {
      const timestamp = new Date().toISOString();
      await updateSheetCell(rowIndex, "I", timestamp);
      invitation.invitationOpened = timestamp;
    }

    return res.json(buildPublicInvitation(invitation));
  } catch (error) {
    console.error("Failed to load invitation", error);
    return res.status(500).json({ error: "Unable to load invitation" });
  }
});

app.post("/api/rsvp", async (req, res) => {
  try {
    const inviteId = String(req.body?.inviteId || "").trim();
    if (!inviteId) {
      return res.status(400).json({ error: "inviteId is required" });
    }

    const rowData = await getInvitationRow(inviteId);
    if (!rowData) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const { rowIndex, invitation } = rowData;

    if (hasExistingRsvp(invitation)) {
      return res.status(409).json({ error: "RSVP already submitted" });
    }

    const attending = Boolean(req.body?.attending ?? req.body?.confirmed ?? true);
    const adults = parseNumber(req.body?.adults);
    const children = parseNumber(req.body?.children);
    const totalGuests = adults + children;

    if (totalGuests > invitation.guestsAllowed) {
      return res.status(400).json({ error: "Guest count exceeds the allowed number" });
    }

    const status = attending ? "Accepted" : "Declined";
    const confirmedValue = attending ? "YES" : "NO";
    const timestamp = new Date().toISOString();

    await updateSheetCells(rowIndex, [
      { columnLetter: "E", value: confirmedValue },
      { columnLetter: "F", value: adults },
      { columnLetter: "G", value: children },
      { columnLetter: "H", value: status },
      { columnLetter: "J", value: timestamp },
    ]);

    return res.status(200).json({
      inviteId,
      inviteeName: invitation.inviteeName,
      guestsAllowed: invitation.guestsAllowed,
      confirmed: attending,
      adults,
      children,
      status,
      rsvpTimestamp: timestamp,
    });
  } catch (error) {
    console.error("Failed to submit RSVP", error);
    return res.status(500).json({ error: "Unable to submit RSVP" });
  }
});

app.post("/api/invitation/send", async (req, res) => {
  console.log("====================================");
  console.log("SEND ROUTE HIT");
  console.log("Request Body:", req.body);
  console.log("====================================");

  try {
    const inviteId = String(req.body?.inviteId || "").trim();

    if (!inviteId) {
      return res.status(400).json({
        error: "inviteId is required",
      });
    }

    const result = await updateInvitationTimestamp(
      inviteId,
      "K",
      "inviteSent"
    );

    if (!result) {
      return res.status(404).json({
        error: "Invitation not found",
      });
    }

    console.log("Invite marked as sent");

    return res.json(result);
  } catch (error) {
    console.error("SEND ROUTE ERROR");
    console.error(error);

    return res.status(500).json({
      error: "Unable to mark invitation as sent",
    });
  }
});

app.post("/api/invitation/reminder", async (req, res) => {
  try {
    const inviteId = String(req.body?.inviteId || "").trim();
    if (!inviteId) {
      return res.status(400).json({ error: "inviteId is required" });
    }

    const result = await updateInvitationTimestamp(inviteId, "L", "reminderSent");
    if (!result) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Failed to mark reminder as sent", error);
    return res.status(500).json({ error: "Unable to mark reminder as sent" });
  }
});

app.put("/api/invitation/:inviteId", async (req, res) => {
  try {
    const inviteId = String(req.params.inviteId || "").trim();
    if (!inviteId) {
      return res.status(400).json({ error: "inviteId is required" });
    }

    const rowData = await getInvitationRow(inviteId);
    if (!rowData) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const { rowIndex } = rowData;
    const inviteeName = String(req.body?.inviteeName || "").trim();
    const mobile = String(req.body?.mobile || "").trim();
    const guestsAllowed = parseNumber(req.body?.guestsAllowed);

    if (!inviteeName) {
      return res.status(400).json({ error: "inviteeName is required" });
    }

    if (!mobile) {
      return res.status(400).json({ error: "mobile is required" });
    }

    await updateSheetCells(rowIndex, [
      { columnLetter: "B", value: inviteeName },
      { columnLetter: "C", value: mobile },
      { columnLetter: "D", value: guestsAllowed },
    ]);

    return res.json({
      success: true,
      inviteId,
      inviteeName,
      mobile,
      guestsAllowed,
    });
  } catch (error) {
    console.error("Failed to update invitation", error);
    return res.status(500).json({ error: "Unable to update invitation" });
  }
});

app.post("/api/invitation/:inviteId/reset-rsvp", async (req, res) => {
  try {
    const inviteId = String(req.params.inviteId || "").trim();
    if (!inviteId) {
      return res.status(400).json({ error: "inviteId is required" });
    }

    const rowData = await getInvitationRow(inviteId);
    if (!rowData) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    const { rowIndex } = rowData;

    await updateSheetCells(rowIndex, [
      { columnLetter: "E", value: "" },
      { columnLetter: "F", value: 0 },
      { columnLetter: "G", value: 0 },
      { columnLetter: "H", value: "Pending" },
      { columnLetter: "J", value: "" },
    ]);

    return res.json({ success: true, inviteId });
  } catch (error) {
    console.error("Failed to reset RSVP", error);
    return res.status(500).json({ error: "Unable to reset RSVP" });
  }
});

app.get("/api/invitations", async (req, res) => {

  try {
    const sheets = await getSheetsApi();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = response.data.values || [];

    const invitations = [];

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i] || rows[i].length === 0) continue;

      invitations.push(mapRowToInvitation(rows[i]));
    }

    res.json(invitations);
  } catch (error) {
    console.error("Failed to load invitations", error);
    res.status(500).json({
      error: "Unable to load invitations",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Grace Invite API listening on ${PORT}`);
});