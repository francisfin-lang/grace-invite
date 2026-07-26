import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { getInvitation, getDefaultInvitation } from "./services/invitationService";
import { getInviteIdFromUrl } from "./utils/url";

import Cover from './pages/Cover';
import Invitation from './pages/Invitation';
import YourGuests from './pages/YourGuests';
import ThankYou from './pages/ThankYou';

import './App.css';

function App() {
  const inviteId = getInviteIdFromUrl();

  const invitation =
    getInvitation(inviteId) || getDefaultInvitation();

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