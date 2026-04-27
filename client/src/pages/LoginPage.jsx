import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Inloggen mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap">
      <section className="form-card">
        <h1 className="text-3xl font-black text-brand-900">Login bij Helpse</h1>
        <p className="mt-2 text-brand-600">Welkom terug. Log in om verder te gaan.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Input
            label="Wachtwoord"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Bezig..." : "Inloggen"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-brand-700">
          Nog geen account? <Link className="font-semibold text-brand-900" to="/register">Registreer hier</Link>
        </p>
      </section>
    </main>
  );
}
