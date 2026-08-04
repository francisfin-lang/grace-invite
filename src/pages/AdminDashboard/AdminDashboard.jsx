import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

function normalizeStatus(value) {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "accepted") return "accepted";
  if (normalized === "declined") return "declined";
  return "pending";
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function buildInvitationUrl(inviteId) {
  return `https://graceinvite.github.io/?invite=${encodeURIComponent(inviteId || "")}`;
}

function buildInvitationMessage(invitation) {
  const inviteeName = invitation?.inviteeName || "Guest";
  const inviteId = invitation?.inviteId || "";

  return `Dear ${inviteeName},\n\nWith grateful hearts we invite you and your family to the Holy Baptism of our beloved son.\n\nPlease view your invitation here:\n${buildInvitationUrl(inviteId)}\n\nWe look forward to celebrating with you.`;
}

function buildReminderMessage(invitation) {
  const inviteeName = invitation?.inviteeName || "Guest";
  const inviteId = invitation?.inviteId || "";

  return `Dear ${inviteeName},\n\nThis is a gentle reminder of our invitation to the Holy Baptism of our beloved son.\n\nPlease view your invitation here:\n${buildInvitationUrl(inviteId)}\n\nWe would be delighted to celebrate with you.`;
}

function buildWhatsAppUrl(mobile, message) {
  return `https://web.whatsapp.com/send?phone=${encodeURIComponent(mobile)}&text=${encodeURIComponent(message)}`;
}

const FILTERS = ["All", "Pending", "Accepted", "Declined", "Opened", "Not Opened"];

export default function AdminDashboard() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [copiedInviteId, setCopiedInviteId] = useState("");
  const [copiedMessageInviteId, setCopiedMessageInviteId] = useState("");

  async function loadInvitations() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/invitations");

      if (!response.ok) {
        throw new Error("Unable to load invitations");
      }

      const payload = await response.json();
      setInvitations(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.message || "Unable to load invitations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isMounted) {
        return;
      }

      await loadInvitations();
    }

    loadData();
    const intervalId = window.setInterval(() => {
      if (isMounted) {
        loadInvitations();
      }
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredInvitations = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const values = [
        invitation.inviteeName,
        invitation.mobile,
        invitation.inviteId,
        invitation.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !needle || values.includes(needle);
      const status = normalizeStatus(invitation.status);
      const matchesFilter = (() => {
        switch (activeFilter) {
          case "Pending":
            return status === "pending";
          case "Accepted":
            return status === "accepted";
          case "Declined":
            return status === "declined";
          case "Opened":
            return Boolean(invitation.invitationOpened);
          case "Not Opened":
            return !invitation.invitationOpened;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, invitations, searchTerm]);

  const stats = useMemo(() => {
    const accepted = invitations.filter(
      (invitation) => normalizeStatus(invitation.status) === "accepted"
    ).length;
    const declined = invitations.filter(
      (invitation) => normalizeStatus(invitation.status) === "declined"
    ).length;
    const pending = invitations.filter(
      (invitation) => normalizeStatus(invitation.status) === "pending"
    ).length;
    const opened = invitations.filter((invitation) => Boolean(invitation.invitationOpened)).length;
    const guestsConfirmed = invitations.reduce((total, invitation) => {
      if (!invitation.confirmed) {
        return total;
      }

      return total + Number(invitation.adults || 0) + Number(invitation.children || 0);
    }, 0);
    const seatsRemaining = invitations.reduce((total, invitation) => {
      const guestsAllowed = Number(invitation.guestsAllowed || 0);
      const acceptedGuests = Number(invitation.adults || 0) + Number(invitation.children || 0);
      return total + Math.max(0, guestsAllowed - acceptedGuests);
    }, 0);

    return {
      invitations: invitations.length,
      opened,
      accepted,
      declined,
      pending,
      guestsConfirmed,
      seatsRemaining,
    };
  }, [invitations]);

  async function handleCopyLink(invitation) {
    const inviteUrl = buildInvitationUrl(invitation.inviteId);

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedInviteId(invitation.inviteId);
      window.setTimeout(() => setCopiedInviteId(""), 1600);
    } catch (error) {
      window.prompt("Copy invitation link", inviteUrl);
    }
  }

  async function handleCopyMessage(invitation) {
    const message = buildInvitationMessage(invitation);

    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageInviteId(invitation.inviteId);
      window.setTimeout(() => setCopiedMessageInviteId(""), 1600);
    } catch (error) {
      window.prompt("Copy invitation message", message);
    }
  }

  async function handlePrimaryAction(invitation) {
    const status = normalizeStatus(invitation.status);

    if (status === "accepted") {
      window.open(buildInvitationUrl(invitation.inviteId), "_blank", "noopener,noreferrer");
      return;
    }

    if (status === "declined") {
      window.open(buildInvitationUrl(invitation.inviteId), "_blank", "noopener,noreferrer");
      return;
    }

    const hasInviteSent = Boolean(invitation.inviteSent);
    const hasReminderSent = Boolean(invitation.reminderSent);
    const endpoint = hasInviteSent ? "/api/invitation/reminder" : "/api/invitation/send";
    const message = hasInviteSent ? buildReminderMessage(invitation) : buildInvitationMessage(invitation);

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteId: invitation.inviteId,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to process invitation action");
      }

      await loadInvitations();
      window.open(buildWhatsAppUrl(String(invitation.mobile || "").trim(), message), "_blank", "noopener,noreferrer");
    } catch (error) {
      window.alert(error.message || "Unable to complete invitation action");
    }
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div>
            <p className="admin-dashboard-eyebrow">Grace Invite</p>
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <p className="admin-dashboard-subtitle">
              Monitor invitations, RSVP activity, and guest confirmations in one place.
            </p>
          </div>
          <div className="admin-dashboard-pill">Live invitation data</div>
        </header>

        <section className="admin-dashboard-stats" aria-label="Invitation statistics">
          <article className="stat-card">
            <span className="stat-card__label">Invitations</span>
            <strong className="stat-card__value">{stats.invitations}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Opened</span>
            <strong className="stat-card__value">{stats.opened}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Accepted</span>
            <strong className="stat-card__value">{stats.accepted}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Declined</span>
            <strong className="stat-card__value">{stats.declined}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Pending</span>
            <strong className="stat-card__value">{stats.pending}</strong>
          </article>
          <article className="stat-card stat-card--accent">
            <span className="stat-card__label">Guests Confirmed</span>
            <strong className="stat-card__value">{stats.guestsConfirmed}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Seats Remaining</span>
            <strong className="stat-card__value">{stats.seatsRemaining}</strong>
          </article>
        </section>

        <section className="admin-dashboard-controls">
          <div className="admin-dashboard-filter-row">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-chip ${activeFilter === filter ? "filter-chip--active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="admin-dashboard-search" htmlFor="invitation-search">
            <span className="admin-dashboard-search__label">Search</span>
            <input
              id="invitation-search"
              type="text"
              placeholder="Search by name, mobile, invite ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
        </section>

        <section className="admin-dashboard-table-card">
          {loading ? (
            <p className="admin-dashboard-state">Loading invitations...</p>
          ) : error ? (
            <p className="admin-dashboard-state admin-dashboard-state--error">{error}</p>
          ) : (
            <div className="admin-dashboard-table-wrapper">
              <table className="admin-dashboard-table">
                <thead>
                  <tr>
                    <th>Invitee</th>
                    <th>Mobile</th>
                    <th>Guests Allowed</th>
                    <th>Status</th>
                    <th>Invitation Opened</th>
                    <th>RSVP Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((invitation) => {
                    const inviteUrl = buildInvitationUrl(invitation.inviteId);
                    const status = normalizeStatus(invitation.status);
                    const hasInviteSent = Boolean(invitation.inviteSent);
                    const hasReminderSent = Boolean(invitation.reminderSent);
                    const statusClass = `status-pill status-pill--${status}`;
                    const rowClass = `admin-dashboard-row admin-dashboard-row--${status}`;

                    return (
                      <tr key={invitation.inviteId || invitation.mobile || Math.random()} className={rowClass}>
                        <td>
                          <div className="table-cell-primary">
                            <strong>{invitation.inviteeName || "—"}</strong>
                            <span>{invitation.inviteId || ""}</span>
                          </div>
                        </td>
                        <td>{invitation.mobile || "—"}</td>
                        <td>{invitation.guestsAllowed ?? 0}</td>
                        <td>
                          <span className={statusClass}>{invitation.status || "Pending"}</span>
                        </td>
                        <td>{formatDate(invitation.invitationOpened)}</td>
                        <td>{formatDate(invitation.rsvpTimestamp)}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="table-action-button"
                              onClick={() => handlePrimaryAction(invitation)}
                            >
                              {status === "accepted"
                                ? "👁 View RSVP"
                                : status === "declined"
                                  ? "👁 View Response"
                                  : hasInviteSent
                                    ? hasReminderSent
                                      ? "🔁 Send Reminder Again"
                                      : "🔁 Send Reminder"
                                    : "📨 Send Invite"}
                            </button>
                            <button
                              type="button"
                              className="table-action-button"
                              onClick={() => window.open(inviteUrl, "_blank", "noopener,noreferrer")}
                            >
                              👁 Preview
                            </button>
                            <button
                              type="button"
                              className="table-action-button"
                              onClick={() => handleCopyLink(invitation)}
                            >
                              {copiedInviteId === invitation.inviteId ? "✓ Copied" : "📋 Copy Link"}
                            </button>
                            <button
                              type="button"
                              className="table-action-button"
                              onClick={() => handleCopyMessage(invitation)}
                            >
                              {copiedMessageInviteId === invitation.inviteId ? "✓ Message Copied" : "📝 Copy Message"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
