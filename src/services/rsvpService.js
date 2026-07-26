const STORAGE_KEY_PREFIX = "grace-invite:rsvp:";

function storageKey(inviteId) {
  return `${STORAGE_KEY_PREFIX}${inviteId}`;
}

/**
 * Persists an RSVP for a given invitation to localStorage so that the
 * confirmation survives a page refresh or a return visit on the same device.
 */
export function submitRsvp(inviteId, { adults, children, total }) {
  if (!inviteId) return null;

  const rsvp = {
    inviteId,
    adults,
    children,
    total,
    confirmedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(storageKey(inviteId), JSON.stringify(rsvp));
  } catch (error) {
    console.warn("Unable to save RSVP locally:", error);
  }

  return rsvp;
}

/**
 * Returns a previously submitted RSVP for an invitation, if one exists.
 */
export function getRsvp(inviteId) {
  if (!inviteId) return null;

  try {
    const raw = window.localStorage.getItem(storageKey(inviteId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read saved RSVP:", error);
    return null;
  }
}

export function hasRsvp(inviteId) {
  return Boolean(getRsvp(inviteId));
}
