import { Link, useLocation } from 'react-router-dom';
import { CrossEmblem, Divider, PanelCorners } from '../../components/Ornaments';

export default function Cover() {
  const location = useLocation();

  return (
    <main className="shell-page cover-page">
      <section className="shell-panel" aria-labelledby="cover-title">
        <PanelCorners />
        <CrossEmblem className="shell-cross" />
        <h1 id="cover-title" className="shell-title">WELCOME</h1>
        <Divider />
        <p className="shell-subtitle">You are invited to celebrate the Holy Baptism of our Son</p>
        <Link className="shell-button" to={{ pathname: "/invitation", search: location.search }}>Open Invitation</Link>
      </section>
    </main>
  );
}
