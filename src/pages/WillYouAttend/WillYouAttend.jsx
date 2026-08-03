import "./WillYouAttend.css";
import { useLocation, useNavigate } from "react-router-dom";
import { submitRsvp } from "../../services/rsvpService";

export default function WillYouAttend({ invitation }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleYes = () => {
    navigate({ pathname: "/guests", search: location.search });
  };

  const handleNo = async () => {
    const rsvp = {
      attending: false,
      adults: 0,
      children: 0,
      total: 0,
    };

    await submitRsvp(invitation?.inviteId, rsvp);

    navigate(
      { pathname: "/thank-you", search: location.search },
      {
        state: rsvp,
      }
    );
  };

  return (
    <main className="shell-page will-you-attend-page">
      <section className="shell-panel will-you-attend-panel">

        <p className="shell-subtitle">
          We would be delighted to celebrate this special day with you.
          <br />
          <br />
          Please let us know if you will be joining us for the reception.
        </p>

        <div className="attendance-actions">

          <button
            className="shell-button shell-button--titlecase"
            onClick={handleYes}
          >
            Yes, We Will Attend
          </button>

          <button
            className="shell-button shell-button--secondary shell-button--titlecase"
            onClick={handleNo}
          >
            Regretfully, We Are Unable to Attend
          </button>

        </div>

      </section>
    </main>
  );
}