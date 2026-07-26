export function getInviteIdFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return params.get("invite");
}