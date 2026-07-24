import './GuestCounterCard.css';

export default function GuestCounterCard({
  title,
  subtitle,
  value,
  onIncrement,
  onDecrement,
}) {
  return (
    <section className="guest-counter-card" aria-label={title}>
      <div className="guest-counter-card__copy">
        <h2 className="guest-counter-card__title">
          {title}
        </h2>
        {subtitle ? (
          <p className="guest-counter-card__subtitle">{subtitle}</p>
        ) : null}
      </div>

      <div className="guest-counter-card__controls" aria-label={title}>
        <button
          className="guest-counter-card__button"
          type="button"
          onClick={onDecrement}
          aria-label={`Decrease ${title}`}
        >
          −
        </button>
        <output className="guest-counter-card__value" aria-live="polite">
          {value}
        </output>
        <button
          className="guest-counter-card__button"
          type="button"
          onClick={onIncrement}
          aria-label={`Increase ${title}`}
        >
          +
        </button>
      </div>
    </section>
  );
}
