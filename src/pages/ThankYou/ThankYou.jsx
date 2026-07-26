import { useLocation, useNavigate } from 'react-router-dom';
import InvitationInfoCard from '../../components/InvitationInfoCard';
import { CrossEmblem, Divider, HeartMark, PanelCorners } from '../../components/Ornaments';
import event from '../../data/event';
import { getRsvp } from '../../services/rsvpService';
import './ThankYou.css';

export default function ThankYou({ invitation, invitationPath = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturn = () => {
    navigate(invitationPath);
  };

  // Guest counts arrive via router state right after confirming; if the
  // page is reloaded directly we fall back to whatever was last saved
  // locally for this invitation.
  const rsvp = location.state ?? getRsvp(invitation?.inviteId);

  return (
    <main className="thank-you-page">
      <section className="thank-you-page__panel" aria-labelledby="thank-you-title">
        <PanelCorners />
        <CrossEmblem className="shell-cross" />

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

        {rsvp ? (
          <InvitationInfoCard
            title="GUESTS CONFIRMED"
            value={`${rsvp.total} Guest${rsvp.total === 1 ? '' : 's'}`}
            subtitle={`${rsvp.adults} Adult${rsvp.adults === 1 ? '' : 's'} · ${rsvp.children} Child${rsvp.children === 1 ? '' : 'ren'}`}
          />
        ) : null}

        <Divider />

        <section className="thank-you-page__date" aria-label="Celebration date">
          <p className="thank-you-page__date-day">{event.baptism.day}</p>
          <p className="thank-you-page__date-value">{event.baptism.date}</p>
        </section>

        <button
          className="thank-you-page__return-button"
          type="button"
          onClick={handleReturn}
        >
          Close Invitation
        </button>

        <HeartMark className="invitation-heart invitation-heart--footer" />
      </section>
    </main>
  );
}
