import express from "express";
import cors from "cors";
import { google } from "googleapis";
import { readFile } from "node:fs/promises";
import path from "node:path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SPREADSHEET_ID = "10StpKpL63zZff29D30KeIW_S967zpm3VmM1xSZeB8xk";
const SHEET_NAME = "Invitations";
const CREDENTIALS_PATH = path.resolve(process.cwd(), "service-account.json");
const SHEET_RANGE = `${SHEET_NAME}!A:J`;

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

  const credentials = JSON.parse(await readFile(CREDENTIALS_PATH, "utf8"));
  authClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await authClient.authorize();
  sheetsClient = google.sheets({ version: "v4", auth: authClient });
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
    const adults = parseNumber(req.body?.adults ?? 0);
    const children = parseNumber(req.body?.children ?? req.body?.total ?? 0);
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

app.listen(PORT, () => {
  console.log(`Grace Invite API listening on ${PORT}`);
});