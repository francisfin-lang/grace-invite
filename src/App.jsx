import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cover from './pages/Cover';
import Invitation from './pages/Invitation';
import YourGuests from './pages/YourGuests';
import ThankYou from './pages/ThankYou';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/guests" element={<YourGuests />} />
        <Route path="/thank-you" element={<ThankYou invitationPath="/invitation" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
