import './InvitationInfoCard.css';

export default function InvitationInfoCard({ title, value, subtitle }) {
  return (
    <section className="invitation-info-card" aria-label={title}>
      <p className="invitation-info-card__title">{title}</p>
      <div className="invitation-info-card__value">{value}</div>
      {subtitle ? (
        <p className="invitation-info-card__subtitle">{subtitle}</p>
      ) : null}
    </section>
  );
}
