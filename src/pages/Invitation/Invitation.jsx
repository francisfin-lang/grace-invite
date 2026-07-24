import { Link } from 'react-router-dom';

export default function Invitation() {
  return (
    <main className="shell-page invitation-page">
      <section className="shell-panel invitation-panel" aria-labelledby="invitation-title">
        <div className="shell-cross" aria-hidden="true">✝</div>

        <figure className="shell-scripture">
          <blockquote>
            &quot;For this child, we have prayed and the Lord has granted the desire of our hearts.&quot;
          </blockquote>
          <figcaption className="shell-scripture-reference">1 Samuel 1:27</figcaption>
        </figure>

        <div className="invitation-heading">
          <p className="invitation-heading__small">YOU ARE INVITED TO THE</p>
          <p className="invitation-heading__small">HOLY BAPTISM OF OUR</p>
          <h1 id="invitation-title">BABY BOY</h1>
          <p className="invitation-heading__small">WITH JOYFUL HEARTS</p>
        </div>

        <div className="invitation-details" aria-label="Event details">
          <article className="detail-card">
            <p className="detail-card__label">Sunday</p>
            <p className="detail-card__date">16 August 2026</p>
            <p className="detail-card__label detail-card__time-label">Time</p>
            <p className="detail-card__time">10:30 AM</p>
            <p className="detail-card__venue">Our Lady of Salvation Church</p>
            <p className="detail-card__location">Dadar</p>
          </article>

          <article className="detail-card">
            <p className="detail-card__label">Reception</p>
            <p className="detail-card__time">12:00 PM</p>
            <p className="detail-card__venue">Emerald Hall</p>
            <p className="detail-card__location">Dr. Antonio Da&apos;Silva High School</p>
          </article>
        </div>

        <div className="invitation-actions">
          <a className="shell-button shell-button--secondary" href="https://maps.google.com/?q=Our%20Lady%20of%20Salvation%20Church%20Dadar" target="_blank" rel="noreferrer">
            View Church
          </a>
          <a className="shell-button shell-button--secondary" href="https://maps.google.com/?q=Emerald%20Hall%20Dr.%20Antonio%20Da%27Silva%20High%20School" target="_blank" rel="noreferrer">
            View Reception
          </a>
          <Link className="shell-button" to="/guests">Confirm Attendance</Link>
        </div>
      </section>
    </main>
  );
}
