import event from "../../data/event";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CrossEmblem,
  Divider,
  IconBadge,
  Icon,
  PanelCorners,
} from "../../components/Ornaments";
import { submitRsvp } from "../../services/rsvpService";

export default function Invitation({ invitation }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleUnableToAttend = async () => {
    if (!invitation?.inviteId) {
    alert("Invitation details could not be found.");
    return;
  }
    const rsvp = {
      attending: false,
      adults: 0,
      children: 0,
      total: 0,
    };

    try {
      await submitRsvp(invitation?.inviteId, rsvp);

      navigate(
        {
          pathname: "/thank-you",
          search: location.search,
        },
        {
          state: rsvp,
        }
      );
    } catch (error) {
      console.error(error);

alert(
  "Sorry, we couldn't record your response at the moment. Please try again in a few minutes."
);
    }
  };

  return (
    <main className="shell-page invitation-page">
      <section
        className="shell-panel invitation-panel"
        aria-labelledby="invitation-title"
      >
        <PanelCorners />
        <CrossEmblem className="shell-cross" />

        <figure className="shell-scripture">
          <blockquote>
            "{event.verse.text}"
          </blockquote>

          <figcaption className="shell-scripture-reference">
            {event.verse.reference}
          </figcaption>
        </figure>

        <Divider />

        <div className="invitation-parents">
          <p className="invitation-parents__intro">
            <span>WITH GRATEFUL HEARTS</span>
            <span>WE</span>
          </p>

          <p className="invitation-parents__names">
            <span>{event.parents.father}</span>

            <span
              className="invitation-parents__and"
              aria-hidden="true"
            >
              <span className="invitation-parents__and-line" />
              &amp;
              <span className="invitation-parents__and-line" />
            </span>

            <span>{event.parents.mother}</span>
          </p>

          <p className="invitation-parents__request">
            {event.celebration.request}
          </p>
        </div>

        <div
          className="invitation-details"
          aria-label="Event details"
        >
          <article className="detail-card">
            <div className="detail-card__row">
              <IconBadge icon="calendar" />

              <div className="detail-card__copy">
                <p className="detail-card__label">
                  {event.baptism.day}
                </p>

                <p className="detail-card__value">
                  {event.baptism.date}
                </p>
              </div>
            </div>

            <div className="detail-card__row">
              <IconBadge icon="clock" />

              <div className="detail-card__copy">
                <p className="detail-card__label">
                  Time
                </p>

                <p className="detail-card__value">
                  {event.baptism.time}
                </p>
              </div>
            </div>

            <div className="detail-card__row detail-card__row--last">
              <IconBadge icon="church" />

              <div className="detail-card__copy">
                <p className="detail-card__label">
                  Ceremony
                </p>

                <p className="detail-card__value detail-card__value--venue">
                  {event.baptism.church}
                </p>

                <p className="detail-card__meta">
                  {event.baptism.locality}
                </p>
              </div>
            </div>
          </article>

          <article className="detail-card">
            <div className="detail-card__row detail-card__row--last">
              <IconBadge icon="utensils" />

              <div className="detail-card__copy">
                <p className="detail-card__label">
                  Reception
                </p>

                <p className="detail-card__value detail-card__value--venue">
                  {event.reception.venue}
                </p>

                {event.reception.time && (
                  <p className="detail-card__inline-time">
                    <Icon icon="clock" />
                    {event.reception.time}
                  </p>
                )}

                <p className="detail-card__meta">
                  {event.reception.address}
                </p>
              </div>
            </div>

            {event.reception.note && (
              <p className="detail-card__note">
                {event.reception.note}
              </p>
            )}
          </article>
        </div>

        <div className="invitation-actions">
          <a
            className="shell-button shell-button--secondary"
            href="https://maps.google.com/?q=Our%20Lady%20of%20Salvation%20Church%20Dadar"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon="pin" />
            View Church
          </a>

          <a
            className="shell-button shell-button--secondary"
            href="https://maps.google.com/?q=Emerald%20Hall%20Dr.%20Antonio%20Da%27Silva%20High%20School"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon="pin" />
            View Reception
          </a>

          <Link
            className="shell-button shell-button--full"
            to={{
              pathname: "/guests",
              search: location.search,
            }}
          >
            <Icon icon="user" />
            RSVP Now
          </Link>

          <button
            type="button"
            className="invitation-unable-link"
            onClick={handleUnableToAttend}
          >
            Unable to attend? Click here
          </button>
        </div>
      </section>
    </main>
  );
}