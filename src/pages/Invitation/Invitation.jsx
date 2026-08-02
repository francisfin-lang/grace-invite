import event from "../../data/event";
import { Link, useLocation } from "react-router-dom";
import { CrossEmblem, Divider, HeartMark, IconBadge, Icon, PanelCorners } from "../../components/Ornaments";

export default function Invitation() {
  const location = useLocation();

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
            {event.celebration.intro}
          </p>

          <p className="invitation-parents__names">
            <span>{event.parents.father}</span>
            <span className="invitation-parents__and" aria-hidden="true">
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

        <HeartMark className="invitation-heart" />

        <div className="invitation-details" aria-label="Event details">
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
                {event.reception.time ? (
                  <p className="detail-card__inline-time">
                    <Icon icon="clock" />
                    {event.reception.time}
                  </p>
                ) : null}
                <p className="detail-card__meta">
                  {event.reception.address}
                </p>
              </div>
            </div>

            {event.reception.note ? (
              <p className="detail-card__note">
                {event.reception.note}
              </p>
            ) : null}
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
            to={{ pathname: "/will-you-attend", search: location.search }}
          >
            <Icon icon="user" />
            RSVP Now
          </Link>
        </div>

        <Divider />

        <p className="invitation-closing">
          {event.closing}
        </p>

        <HeartMark className="invitation-heart invitation-heart--footer" />
      </section>
    </main>
  );
}
