import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  loadInvitation,
  getDefaultInvitation,
} from "./services/invitationService";
import { getInviteIdFromUrl } from "./utils/url";

import Cover from "./pages/Cover";
import Invitation from "./pages/Invitation";
import WillYouAttend from "./pages/WillYouAttend";
import YourGuests from "./pages/YourGuests";
import ThankYou from "./pages/ThankYou";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import "./App.css";

function App() {
  const inviteId = getInviteIdFromUrl();
  console.log("Invite ID =", inviteId);

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initialise() {
      setLoading(true);

      try {
        const loadedInvitation = await loadInvitation(inviteId);

        if (!cancelled) {
          setInvitation(
            loadedInvitation ?? getDefaultInvitation(inviteId)
          );
        }
      } catch (error) {
        console.error("Failed to load invitation:", error);

        if (!cancelled) {
          setInvitation(getDefaultInvitation(inviteId));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialise();

    return () => {
      cancelled = true;
    };
  }, [inviteId]);

  if (loading) {
    return (
      <main className="shell-page">
        <section className="shell-panel">
          <p>Loading invitation...</p>
        </section>
      </main>
    );
  }

  if (!invitation) {
    return (
      <main className="shell-page">
        <section className="shell-panel">
          <p>Invitation not found.</p>
        </section>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* New Home Page */}
        <Route
          path="/"
          element={<Invitation invitation={invitation} />}
        />

        {/* Keep Cover Page for future use */}
        <Route
          path="/cover"
          element={<Cover invitation={invitation} />}
        />

        <Route
          path="/invitation"
          element={<Invitation invitation={invitation} />}
        />

        <Route
          path="/will-you-attend"
          element={<WillYouAttend invitation={invitation} />}
        />

        <Route
          path="/guests"
          element={<YourGuests invitation={invitation} />}
        />

        <Route
          path="/thank-you"
          element={
            <ThankYou
              invitation={invitation}
              invitationPath="/invitation"
            />
          }
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;