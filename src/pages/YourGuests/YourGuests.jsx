import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuestCounterCard from "../../components/GuestCounterCard";
import InvitationInfoCard from "../../components/InvitationInfoCard";
import { CrossEmblem, PanelCorners } from "../../components/Ornaments";
import { submitRsvp } from "../../services/rsvpService";
import "./YourGuests.css";

export default function YourGuests({
  invitation,
  onConfirm,
  thankYouPath = "/thank-you",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("========== YOUR GUESTS ==========");
    console.log("Invitation object:", invitation);
    console.log("Invite ID:", invitation?.inviteId);
    console.log("Invitee:", invitation?.inviteeName);
    console.log("Guests Allowed:", invitation?.guestsAllowed);
    console.log("Current URL:", window.location.href);
    console.log("Search:", location.search);
  }, [invitation, location]);

  const INVITED_GUESTS = Number(invitation?.guestsAllowed ?? 0);

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const guestsConfirmed = adults + children;

  const canConfirm =
    guestsConfirmed > 0 &&
    guestsConfirmed <= INVITED_GUESTS;

  const counterActions = useMemo(
    () => ({
      incrementAdults: () => {
        setAdults((currentAdults) =>
          currentAdults + children < INVITED_GUESTS
            ? currentAdults + 1
            : currentAdults
        );
      },

      decrementAdults: () => {
        setAdults((currentAdults) =>
          Math.max(0, currentAdults - 1)
        );
      },

      incrementChildren: () => {
        setChildren((currentChildren) =>
          adults + currentChildren < INVITED_GUESTS
            ? currentChildren + 1
            : currentChildren
        );
      },

      decrementChildren: () => {
        setChildren((currentChildren) =>
          Math.max(0, currentChildren - 1)
        );
      },
    }),
    [adults, children, INVITED_GUESTS]
  );

  const handleConfirm = async () => {
    if (!canConfirm) {
      return;
    }

    try {
      const rsvp = {
        attending: true,
        adults,
        children,
        total: guestsConfirmed,
      };

      await submitRsvp(invitation?.inviteId, rsvp);

      if (onConfirm) {
        onConfirm(rsvp);
        return;
      }

      navigate(
        {
          pathname: thankYouPath,
          search: location.search,
        },
        {
          state: rsvp,
        }
      );
    } catch (error) {
      console.error("RSVP submission failed:", error);
      alert(error.message || "Unable to submit RSVP.");
    }
  };

  return (
    <main className="your-guests-page">
      <section
        className="your-guests-page__panel"
        aria-labelledby="your-guests-title"
      >
        <PanelCorners />

        <CrossEmblem className="shell-cross" />

        <div className="your-guests-page__intro">
          <p className="your-guests-page__eyebrow">
            Reception RSVP
          </p>

          <h1
            id="your-guests-title"
            className="your-guests-page__title"
          >
            Your Guests
          </h1>

          <div className="your-guests-page__message">
            <p>Thank you for accepting our invitation.</p>

            <p>
              We are delighted that you will be joining us in celebrating this
              special day.
            </p>

            <p>
              Please let us know how many guests from your invitation will be
              attending the reception.
            </p>
          </div>
        </div>

        <InvitationInfoCard
          title="YOUR INVITATION INCLUDES"
          value={`${INVITED_GUESTS} Guests`}
          subtitle={invitation?.inviteeName ?? ""}
        />

        <div
          className="your-guests-page__counters"
          aria-label="Guest counters"
        >
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

        <section
          className="your-guests-page__summary"
          aria-live="polite"
        >
          <p className="your-guests-page__summary-label">
            Confirmed
          </p>

          <p className="your-guests-page__summary-value">
            {guestsConfirmed}
          </p>

          <p className="your-guests-page__summary-note">
            Maximum allowed: {INVITED_GUESTS}
          </p>
        </section>

        <button
          className="your-guests-page__confirm-button"
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
        >
          Confirm RSVP
        </button>
      </section>
    </main>
  );
}