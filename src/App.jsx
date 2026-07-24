import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cover from './pages/Cover';
import Invitation from './pages/Invitation';
import ThankYou from './pages/ThankYou';
import YourGuests from './pages/YourGuests';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/guests" element={<YourGuests />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
