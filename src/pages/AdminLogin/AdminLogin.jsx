import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("grace-admin-auth") === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || "";

    setIsSubmitting(true);
    setError("");

    if (password === expectedPassword) {
      sessionStorage.setItem("grace-admin-auth", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setError("Incorrect password");
    setIsSubmitting(false);
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <p className="admin-login-eyebrow">Grace Invite</p>
          <h1 className="admin-login-title">Admin Access</h1>
          <p className="admin-login-subtitle">
            Enter the admin password to continue to the dashboard.
          </p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field" htmlFor="admin-password">
              <span>Password</span>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </label>

            {error ? <p className="admin-login-error">{error}</p> : null}

            <button className="admin-login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Checking..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
