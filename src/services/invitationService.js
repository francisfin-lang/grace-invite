const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://graceinvite-github-io.onrender.com";

let currentInvitation = null;

function normalizeInvitation(invitation) {
  return {
    inviteId:
      invitation.inviteId ||
      invitation.inviteID ||
      invitation.id ||
      "",

    inviteeName:
      invitation.inviteeName ||
      "",

    guestsAllowed: Number(invitation.guestsAllowed || 0),

    confirmed: Boolean(invitation.confirmed),

    adults: Number(invitation.adults || 0),

    children: Number(invitation.children || 0),

    status: invitation.status || "Pending",
  };
}

export function getInvitation(inviteId) {
  if (
    currentInvitation &&
    (!inviteId || currentInvitation.inviteId === inviteId)
  ) {
    return currentInvitation;
  }

  return null;
}

export function getDefaultInvitation(inviteId) {
  return getInvitation(inviteId);
}

export async function loadInvitation(inviteId) {
  if (!inviteId) {
    currentInvitation = null;
    return null;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/invitation/${encodeURIComponent(inviteId)}`
  );

  if (!response.ok) {
    throw new Error("Unable to load invitation");
  }

  const data = await response.json();

  currentInvitation = normalizeInvitation(data);

  return currentInvitation;
}