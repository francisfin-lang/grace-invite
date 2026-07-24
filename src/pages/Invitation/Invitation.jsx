import { useNavigate } from 'react-router-dom';
import './Invitation.css';

export default function Invitation() {
  const navigate = useNavigate();

  const handleConfirmAttendance = () => {
    navigate('/guests');
  };

  return (
    <main className="invitation-page">
      <section className="invitation-page__panel" aria-labelledby="invitation-title">
        <div className="invitation-page__cross" aria-hidden="true">✝</div>

        <header className="invitation-page__header">
          <p className="invitation-page__kicker">
            You are invited to the<br />
            Holy Baptism of our
          </p>
          <h1 id="invitation-title" className="invitation-page__title">
            Baby Boy
          </h1>
          <p className="invitation-page__joy">With joyful hearts</p>
        </header>

        <figure className="invitation-page__verse">
          <blockquote>
            “For this child, we have prayed and the Lord has granted the desire of our hearts.”
          </blockquote>
          <figcaption>1 Samuel 1:27</figcaption>
        </figure>

        <section className="invitation-page__details-card" aria-label="Ceremony information">
          <div className="invitation-page__date-block">
            <p className="invitation-page__label">Sunday</p>
            <p className="invitation-page__date">16 August 2026</p>
          </div>
          <div className="invitation-page__detail-grid">
            <div>
              <p className="invitation-page__label">Time</p>
              <p className="invitation-page__detail-value">10:30 AM</p>
            </div>
            <div>
              <p className="invitation-page__label">Ceremony</p>
              <p className="invitation-page__detail-value">
                Our Lady of Salvation Church<br />
                <span>Dadar</span>
              </p>
            </div>
          </div>
        </section>

        <section className="invitation-page__reception-card" aria-label="Reception information">
          <p className="invitation-page__label">Reception</p>
          <p className="invitation-page__reception-time">12:00 PM</p>
          <p className="invitation-page__reception-place">Emerald Hall</p>
          <p className="invitation-page__reception-address">
            Dr. Antonio Da&apos;Silva High School
          </p>
        </section>

        <div className="invitation-page__actions">
          <a
            className="invitation-page__button invitation-page__button--secondary"
            href="https://www.google.com/maps/search/?api=1&query=Our%20Lady%20of%20Salvation%20Church%20Dadar"
            target="_blank"
            rel="noreferrer"
          >
            View Church
          </a>
          <a
            className="invitation-page__button invitation-page__button--secondary"
            href="https://www.google.com/maps/search/?api=1&query=Emerald%20Hall%20Dr.%20Antonio%20Da%27Silva%20High%20School"
            target="_blank"
            rel="noreferrer"
          >
            View Reception
          </a>
          <button
            className="invitation-page__button invitation-page__button--primary"
            type="button"
            onClick={handleConfirmAttendance}
          >
            Confirm Attendance
          </button>
        </div>
      </section>
    </main>
  );
}
