import { Link } from 'react-router-dom';

export default function Cover() {
  return (
    <main className="shell-page cover-page">
      <section className="shell-panel" aria-labelledby="cover-title">
        <div className="shell-cross" aria-hidden="true">✝</div>
        <h1 id="cover-title" className="shell-title">WELCOME</h1>
        <p className="shell-subtitle">You are invited to celebrate the Holy Baptism</p>
        <Link className="shell-button" to="/invitation">View Invitation</Link>
      </section>
    </main>
  );
}
