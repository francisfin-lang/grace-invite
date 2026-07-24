import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestCounterCard from '../../components/GuestCounterCard';
import InvitationInfoCard from '../../components/InvitationInfoCard';
import './YourGuests.css';

const INVITED_GUESTS = 4;

export default function YourGuests({ onConfirm, thankYouPath = '/thank-you' }) {
  const navigate = useNavigate();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const guestsConfirmed = adults + children;
  const isComplete = guestsConfirmed === INVITED_GUESTS;

  const counterActions = useMemo(() => ({
    incrementAdults: () => {
      setAdults((currentAdults) => (
        currentAdults + children < INVITED_GUESTS ? currentAdults + 1 : currentAdults
      ));
    },
    decrementAdults: () => {
      setAdults((currentAdults) => Math.max(0, currentAdults - 1));
    },
    incrementChildren: () => {
      setChildren((currentChildren) => (
        adults + currentChildren < INVITED_GUESTS ? currentChildren + 1 : currentChildren
      ));
    },
    decrementChildren: () => {
      setChildren((currentChildren) => Math.max(0, currentChildren - 1));
    },
  }), [adults, children]);

  const handleConfirm = () => {
    if (!isComplete) {
      return;
    }

    if (onConfirm) {
      onConfirm({ adults, children, total: guestsConfirmed });
      return;
    }

    navigate(thankYouPath);
  };

  return (
    <main className="your-guests-page">
      <section className="your-guests-page__panel" aria-labelledby="your-guests-title">
        <div className="your-guests-page__intro">
          <p className="your-guests-page__eyebrow">Reception RSVP</p>
          <h1 id="your-guests-title" className="your-guests-page__title">
            Your Guests
          </h1>
          <div className="your-guests-page__message">
            <p>Thank you for accepting our invitation.</p>
            <p>
              We are delighted that you will be joining us in celebrating this special day.
            </p>
            <p>
              Please let us know how many guests from your invitation will be attending the reception.
            </p>
          </div>
        </div>

        <InvitationInfoCard title="YOUR INVITATION INCLUDES" value="4 Guests" />

        <div className="your-guests-page__counters" aria-label="Guest counters">
          <GuestCounterCard
            title="Adults"
            subtitle="(13 years & above)"
            value={adults}
            onIncrement={counterActions.incrementAdults}
            onDecrement={counterActions.decrementAdults}
          />
          <GuestCounterCard
            title="Children"
            subtitle="(12 years & below)"
            value={children}
            onIncrement={counterActions.incrementChildren}
            onDecrement={counterActions.decrementChildren}
          />
        </div>

        <section className="your-guests-page__summary" aria-live="polite">
          <p className="your-guests-page__summary-label">Guests Confirmed</p>
          <p className="your-guests-page__summary-value">
            {guestsConfirmed} of {INVITED_GUESTS}
          </p>
        </section>

        <button
          className="your-guests-page__confirm-button"
          type="button"
          onClick={handleConfirm}
          disabled={!isComplete}
        >
          Confirm Guests
        </button>
      </section>
    </main>
  );
}
