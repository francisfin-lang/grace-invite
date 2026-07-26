import "./WillYouAttend.css";
import { useNavigate } from "react-router-dom";

export default function WillYouAttend() {
  const navigate = useNavigate();

  const handleYes = () => {
    navigate("/guests");
  };

  const handleNo = () => {
    navigate("/thank-you", {
      state: {
        attending: false,
        adults: 0,
        children: 0,
        total: 0,
      },
    });
  };

  return (
    <main className="shell-page">
      <section className="shell-panel">

        <p className="shell-kicker">
          Reception RSVP
        </p>

        <h1 className="shell-title">
          Will You Be Joining Us
          <br />
          for the Reception?
        </h1>

        <p className="shell-subtitle">
          We would be delighted to celebrate this special day with you.
          <br /><br />
          Kindly let us know if you will be joining us for the reception.
        </p>

        <div className="attendance-actions">

          <button
            className="shell-button"
            onClick={handleYes}
          >
            Yes, We Will Attend
          </button>

          <button
            className="shell-button shell-button--secondary"
            onClick={handleNo}
          >
            Regretfully, We Are Unable To Attend
          </button>

        </div>

      </section>
    </main>
  );
}