import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

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
import AdminLogin from "./pages/AdminLogin/AdminLogin";

import "./App.css";

function LoadingState() {
  return (
    <main className="shell-page">
      <section className="shell-panel">
        <p>Loading invitation...</p>
      </section>
    </main>
  );
}

function InvitationNotFoundState() {
  return (
    <main className="shell-page">
      <section className="shell-panel">
        <p>Invitation not found.</p>
      </section>
    </main>
  );
}

function AppRoutes() {
  const location = useLocation();
  const inviteId = getInviteIdFromUrl();
  const shouldLoadInvitation = !["/login", "/admin"].includes(location.pathname);

  console.log("Invite ID =", inviteId);

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(shouldLoadInvitation);

  useEffect(() => {
    if (!shouldLoadInvitation) {
      setLoading(false);
      setInvitation(null);
      return;
    }

    let cancelled = false;

    async function initialise() {
      setLoading(true);

      try {
        const loadedInvitation = await loadInvitation(inviteId);

        if (!cancelled) {
          setInvitation(loadedInvitation ?? getDefaultInvitation(inviteId));
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
  }, [inviteId, shouldLoadInvitation]);

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          sessionStorage.getItem("grace-admin-auth") === "true" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <Invitation invitation={invitation} />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route
        path="/cover"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <Cover invitation={invitation} />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route
        path="/invitation"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <Invitation invitation={invitation} />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route
        path="/will-you-attend"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <WillYouAttend invitation={invitation} />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route
        path="/guests"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <YourGuests invitation={invitation} />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route
        path="/thank-you"
        element={
          loading ? (
            <LoadingState />
          ) : invitation ? (
            <ThankYou invitation={invitation} invitationPath="/invitation" />
          ) : (
            <InvitationNotFoundState />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;