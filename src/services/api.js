const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://graceinvite-github-io.onrender.com";

export async function getInvitation(inviteId) {
  const response = await fetch(
    `${API_URL}/api/invitation/${encodeURIComponent(inviteId)}`
  );

  if (!response.ok) {
    throw new Error("Invitation not found");
  }

  return await response.json();
}

export async function submitRsvp(inviteId, rsvp) {
  const response = await fetch(`${API_URL}/api/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inviteId,
      ...rsvp,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to submit RSVP");
  }

  return data;
}