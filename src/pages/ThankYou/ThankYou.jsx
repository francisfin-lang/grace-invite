import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

export default function ThankYou({ invitationPath = '/' }) {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(invitationPath);
  };

  return (
    <main className="thank-you-page">
      <section className="thank-you-page__panel" aria-labelledby="thank-you-title">
        <div className="thank-you-page__cross" aria-hidden="true">✝</div>

        <div className="thank-you-page__intro">
          <h1 id="thank-you-title" className="thank-you-page__title">
            Thank You
          </h1>
          <div className="thank-you-page__message">
            <p>Your attendance has been confirmed.</p>
            <p>
              We look forward to celebrating<br />
              this special day with you.
            </p>
            <p>
              May God bless you<br />
              and your family.
            </p>
          </div>
        </div>

        <section className="thank-you-page__request" aria-labelledby="thank-you-request-title">
          <h2 id="thank-you-request-title" className="thank-you-page__request-title">
            WITH GRATITUDE
          </h2>
          <div className="thank-you-page__request-message">
            <p>Your presence, prayers, and blessings are the greatest gift to our child.</p>
            <p>We kindly request no boxed gifts.</p>
          </div>
        </section>

        <section className="thank-you-page__date" aria-label="Celebration date">
          <p className="thank-you-page__date-day">Sunday</p>
          <p className="thank-you-page__date-value">16 August 2026</p>
        </section>

        <button
          className="thank-you-page__return-button"
          type="button"
          onClick={handleReturn}
        >
          Close Invitation
        </button>
      </section>
    </main>
  );
}
