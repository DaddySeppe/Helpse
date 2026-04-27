import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get("role");
  const initialRole = requestedRole === "STUDENT" ? "STUDENT" : "CUSTOMER";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Registratie mislukt."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap">
      <section className="form-card">
        <h1 className="text-3xl font-black text-brand-900">Maak je Helpse account</h1>
        <p className="mt-2 text-brand-600">Je krijgt 3 dagen gratis trial om rond te kijken.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            label="Naam"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
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
            minLength={8}
          />

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-900">Ik ben een</span>
            <select
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="CUSTOMER">Customer (ik zoek hulp)</option>
              <option value="STUDENT">Student (ik wil helpen)</option>
            </select>
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Bezig..." : "Registreren"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-brand-700">
          Al een account? <Link className="font-semibold text-brand-900" to="/login">Log hier in</Link>
        </p>
      </section>
    </main>
  );
}
