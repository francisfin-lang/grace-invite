const API_URL =
  "https://script.google.com/macros/s/AKfycbzBaxpcjl_0FLxi31enpE49mIT_5eE6BZkI10nrGo54lVl_QZNLngFiHbu97MGKFWVX/exec";

export async function getInvitation(inviteId) {
  const response = await fetch(`${API_URL}?id=${inviteId}`);
  return await response.json();
}

export async function submitRsvp(rsvp) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rsvp),
  });

  return await response.json();
}