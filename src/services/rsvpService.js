const STORAGE_KEY_PREFIX = "grace-invite:rsvp:";
const API_URL =
  "https://script.google.com/macros/s/AKfycbzBaxpcjl_0FLxi31enpE49mIT_5eE6BZkI10nrGo54lVl_QZNLngFiHbu97MGKFWVX/exec";

function storageKey(inviteId) {
  return `${STORAGE_KEY_PREFIX}${inviteId}`;
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
  if (!inviteId) return null;

  const rsvp = {
    inviteId,
    attending,
    adults,
    children,
    total,
    confirmedAt: new Date().toISOString(),
  };

  // Save locally
  try {
    window.localStorage.setItem(
      storageKey(inviteId),
      JSON.stringify(rsvp)
    );
  } catch (error) {
    console.warn("Unable to save RSVP locally:", error);
  }

  // Send to Google Sheets
  try {
    const form = new FormData();

    form.append("inviteId", inviteId);
    form.append("attending", attending);
    form.append("adults", adults);
    form.append("children", children);
    form.append("total", total);

    await fetch(API_URL, {
      method: "POST",
      body: form,
    });
  } catch (error) {
    console.error("Unable to save RSVP:", error);
  }

  return rsvp;
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