import invitations from "../data/invitations.json";

export function getInvitation(inviteId) {
  return invitations.find(
    (invitation) => invitation.inviteId === inviteId
  );
}

export function getDefaultInvitation() {
  return invitations[0];
}