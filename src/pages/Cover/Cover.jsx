import { Link } from 'react-router-dom';
import { CrossEmblem, Divider, PanelCorners } from '../../components/Ornaments';

export default function Cover() {
  return (
    <main className="shell-page cover-page">
      <section className="shell-panel" aria-labelledby="cover-title">
        <PanelCorners />
        <CrossEmblem className="shell-cross" />
        <h1 id="cover-title" className="shell-title">WELCOME</h1>
        <Divider />
        <p className="shell-subtitle">You are invited to celebrate the Holy Baptism of our Son</p>
        <Link className="shell-button" to="/invitation">Open Invitation</Link>
      </section>
    </main>
  );
}
