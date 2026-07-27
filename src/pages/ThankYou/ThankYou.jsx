import { useLocation, useNavigate } from "react-router-dom";
import InvitationInfoCard from "../../components/InvitationInfoCard";
import {
  CrossEmblem,
  Divider,
  HeartMark,
  PanelCorners,
} from "../../components/Ornaments";
import event from "../../data/event";
import { getRsvp } from "../../services/rsvpService";
import "./ThankYou.css";

export default function ThankYou({ invitation, invitationPath = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturn = () => {
    // Attempt to close the browser tab/window (works only if opened by JavaScript)
    if (window.opener) {
      window.close();
      return;
    }

    // Fallback for normal browser tabs
    navigate("/", { replace: true });
  };

  // Read RSVP from navigation state.
  // If the page is refreshed, fall back to the locally saved RSVP.
  const rsvp = location.state ?? getRsvp(invitation?.inviteId);

  const attending = rsvp?.attending ?? true;
  const confirmed = rsvp?.total ?? 0;
  const adults = rsvp?.adults ?? 0;
  const children = rsvp?.children ?? 0;

  return (
    <main className="thank-you-page">
      <section
        className="thank-you-page__panel"
        aria-labelledby="thank-you-title"
      >
        <PanelCorners />

        <CrossEmblem className="shell-cross" />

        <div className="thank-you-page__intro">
          <h1 id="thank-you-title" className="thank-you-page__title">
            {attending
              ? "Thank You for Your RSVP"
              : "Thank You for Your Response"}
          </h1>

          <div className="thank-you-page__message">
            {attending ? (
              <>
                <p>
                  We are delighted that you will be joining us for this special
                  celebration.
                </p>

                <p>
                  We look forward to celebrating this joyous occasion with you
                  and your family.
                </p>
              </>
            ) : (
              <>
                <p>Thank you for letting us know.</p>

                <p>
                  Although we will miss celebrating with you, we truly
                  appreciate your prayers, blessings, and warm wishes for our
                  child.
                </p>
              </>
            )}
          </div>
        </div>

        <InvitationInfoCard
          title="CONFIRMED"
          value={`${confirmed}`}
          subtitle={
            attending
              ? `${adults} Adult${adults === 1 ? "" : "s"} · ${children} ${
                  children === 1 ? "Child" : "Children"
                }`
              : "We appreciate your response."
          }
        />

        {attending && (
          <>
            <Divider />

            <section className="thank-you-page__gratitude">
              <h3>WITH GRATITUDE</h3>

              <p>
                Your presence and blessings are the greatest gift to our child.
              </p>

              <p>
                Kindly, no boxed gifts.
              </p>
            </section>

            <Divider />
          </>
        )}

        <section
          className="thank-you-page__date"
          aria-label="Celebration date"
        >
          <p className="thank-you-page__date-day">
            {event.baptism.day}
          </p>

          <p className="thank-you-page__date-value">
            {event.baptism.date}
          </p>
        </section>

        <button
          className="thank-you-page__return-button"
          type="button"
          onClick={handleReturn}
        >
          Finish
        </button>

        <HeartMark className="invitation-heart invitation-heart--footer" />
      </section>
    </main>
  );
}