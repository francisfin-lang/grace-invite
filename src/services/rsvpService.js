const STORAGE_KEY_PREFIX = "grace-invite:rsvp:";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function storageKey(inviteId) {
  return `${STORAGE_KEY_PREFIX}${inviteId}`;
}

function saveRsvpLocally(inviteId, rsvp) {
  try {
    window.localStorage.setItem(storageKey(inviteId), JSON.stringify(rsvp));
  } catch (error) {
    console.warn("Unable to save RSVP locally:", error);
  }
}

function showFriendlyMessage(message) {
  if (typeof window !== "undefined" && typeof window.alert === "function") {
    window.alert(message);
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
    showFriendlyMessage("Unable to submit RSVP without a valid invitation.");
    return null;
  }

  const normalizedTotal = Number(total) || Number(adults) + Number(children);
  const rsvp = {
    inviteId,
    attending: Boolean(attending),
    adults: Number(adults) || 0,
    children: Number(children) || 0,
    total: normalizedTotal,
    confirmedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inviteId,
        attending: rsvp.attending,
        adults: rsvp.adults,
        children: rsvp.children,
        total: normalizedTotal,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 409) {
      const duplicateRsvp = {
        ...rsvp,
        duplicate: true,
        status: "Already Submitted",
      };
      saveRsvpLocally(inviteId, duplicateRsvp);
      showFriendlyMessage("Thank you — your RSVP has already been received.");
      return duplicateRsvp;
    }

    if (!response.ok) {
      throw new Error(payload?.error || "Unable to submit RSVP");
    }

    const serverRsvp = {
      ...rsvp,
      ...payload,
      confirmedAt: payload?.rsvpTimestamp || rsvp.confirmedAt,
    };

    saveRsvpLocally(inviteId, serverRsvp);
    return serverRsvp;
  } catch (error) {
    console.warn("Unable to submit RSVP via backend; using local fallback:", error);
    saveRsvpLocally(inviteId, rsvp);
    showFriendlyMessage(
      error?.message || "Your RSVP could not be sent right now. Please try again."
    );
    return rsvp;
  }
}

export function getRsvp(inviteId) {
  if (!inviteId) return null;

  try {
    const raw = window.localStorage.getItem(storageKey(inviteId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Unable to read RSVP:", error);
    return null;
  }
}

export function hasRsvp(inviteId) {
  return Boolean(getRsvp(inviteId));
}