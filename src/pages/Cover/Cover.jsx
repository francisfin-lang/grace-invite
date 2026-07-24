import { useNavigate } from 'react-router-dom';
import './Cover.css';

export default function Cover() {
  const navigate = useNavigate();

  const handleViewInvitation = () => {
    navigate('/invitation');
  };

  return (
    <main className="cover-page">
      <section className="cover-page__panel" aria-labelledby="cover-title">
        <div className="cover-page__ornament" aria-hidden="true" />
        <div className="cover-page__cross" aria-hidden="true">✝</div>
        <p className="cover-page__eyebrow">Holy Baptism</p>
        <h1 id="cover-title" className="cover-page__title">Welcome</h1>
        <p className="cover-page__subtitle">
          You are invited to celebrate the Holy Baptism
        </p>
        <button
          className="cover-page__button"
          type="button"
          onClick={handleViewInvitation}
        >
          View Invitation
        </button>
      </section>
    </main>
  );
}
