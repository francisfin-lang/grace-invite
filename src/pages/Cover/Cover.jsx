import { Link, useLocation } from "react-router-dom";
import { CrossEmblem, PanelCorners } from "../../components/Ornaments";

export default function Cover() {
  const location = useLocation();

  return (
    <main className="shell-page cover-page">
      <section className="shell-panel" aria-labelledby="cover-title">
        <PanelCorners />

        <CrossEmblem className="shell-cross" />

        <h1 id="cover-title" className="cover-title">
          <span>BAPTISM</span>
          <span>INVITATION</span>
        </h1>

        <Link
          className="shell-button"
          to={{
            pathname: "/invitation",
            search: location.search,
          }}
        >
          Open Invitation
        </Link>
      </section>
    </main>
  );
}