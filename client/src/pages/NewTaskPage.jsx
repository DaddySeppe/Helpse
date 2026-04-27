import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";
import SubscriptionBanner from "../components/SubscriptionBanner";
import { useAuth } from "../context/AuthContext";

export default function NewTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Computerhulp",
    location: "",
    price: "",
    task_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { access, user } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/tasks", {
        ...form,
        price: Number(form.price),
      });
      navigate("/my-tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Taak aanmaken mislukt.");
    } finally {
      setLoading(false);
    }
  }

  if (user.role !== "CUSTOMER") {
    return <main className="container-page">Alleen customers kunnen taken posten.</main>;
  }

  return (
    <main className="container-page">
      <SubscriptionBanner
        status={user.subscription_status}
        onGoPricing={() => navigate("/pricing")}
      />

      <section className="rounded-2xl border border-brand-200 bg-white p-6">
        <h1 className="text-3xl font-black text-brand-900">Nieuwe taak plaatsen</h1>
        <p className="mt-2 text-brand-600">Beschrijf duidelijk wat je nodig hebt.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Titel"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-brand-900">Beschrijving</span>
            <textarea
              className="h-28 w-full rounded-xl border border-brand-200 p-3"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              required
            />
          </label>
          <Input
            label="Categorie"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            required
          />
          <Input
            label="Locatie"
            value={form.location}
            onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            required
          />
          <Input
            label="Prijs (EUR)"
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
          <Input
            label="Datum"
            type="date"
            value={form.task_date}
            onChange={(event) => setForm((prev) => ({ ...prev, task_date: event.target.value }))}
            required
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" disabled={!access.canCreateTask || loading}>
            {loading ? "Aanmaken..." : "Taak plaatsen"}
          </Button>
        </form>
      </section>
    </main>
  );
}
