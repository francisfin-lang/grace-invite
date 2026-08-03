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
        <Route
          path="/"
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
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;