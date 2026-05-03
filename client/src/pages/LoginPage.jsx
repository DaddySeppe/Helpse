import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Inloggen mislukt."));
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
          <div className="relative">
            <Input
              label="Wachtwoord"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              className="pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 bottom-3 text-brand-500 hover:text-brand-900"
              aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

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
