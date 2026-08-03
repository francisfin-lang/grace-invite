const STORAGE_KEY_PREFIX = "grace-invite:rsvp:";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

function storageKey(inviteId) {
  return `${STORAGE_KEY_PREFIX}${inviteId}`;
}

function saveRsvpLocally(inviteId, rsvp) {
  try {
    window.localStorage.setItem(
      storageKey(inviteId),
      JSON.stringify(rsvp)
    );
  } catch (error) {
    console.warn("Unable to save RSVP locally:", error);
  }
}

export async function submitRsvp(
  inviteId,
  {
    attending = true,
    adults = 0,
    children = 0,
    total = 0,
  }
) {
  if (!inviteId) {
    throw new Error(
      "Unable to submit RSVP without a valid invitation."
    );
  }

  const normalizedTotal =
    Number(total) || Number(adults) + Number(children);

  const rsvp = {
    inviteId,
    attending: Boolean(attending),
    adults: Number(adults) || 0,
    children: Number(children) || 0,
    total: normalizedTotal,
  };

  const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rsvp),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.error ||
      payload.message ||
      "Unable to submit RSVP"
    );
  }

  const serverRsvp = {
    ...rsvp,
    ...payload,
  };

  saveRsvpLocally(inviteId, serverRsvp);

  return serverRsvp;
}

export function getRsvp(inviteId) {
  if (!inviteId) return null;

  try {
    const raw = window.localStorage.getItem(
      storageKey(inviteId)
    );
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read RSVP:", error);
    return null;
  }
}

export function hasRsvp(inviteId) {
  return Boolean(getRsvp(inviteId));
}