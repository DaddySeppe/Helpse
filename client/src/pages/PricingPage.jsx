import { useState } from "react";
import api from "../api/axios";
import Button from "../components/Button";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/payments/create-checkout-session");
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Kon checkout niet starten.");
      setLoading(false);
    }
  }

  return (
    <main className="container-page">
      <section className="mx-auto max-w-2xl rounded-3xl border border-brand-200 bg-white p-8 text-center shadow-xl">
        <p className="inline-flex rounded-full bg-accent-100 px-4 py-1 text-sm font-bold text-accent-700">
          Premium abonnement
        </p>
        <h1 className="mt-4 text-4xl font-black text-brand-950">€2,99 / maand</h1>
        <p className="mt-3 text-brand-700">
          Activeer Premium om taken te posten, je aan te melden en alles te beheren.
        </p>

        <ul className="mt-6 space-y-2 text-left text-brand-800">
          <li>Onbeperkt taken posten en beheren</li>
          <li>Aanmelden als student op alle open taken</li>
          <li>Duidelijke statusupdates op elke actie</li>
        </ul>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <Button className="mt-6 w-full py-4 text-lg" onClick={startCheckout} disabled={loading}>
          {loading ? "Doorsturen..." : "Activeer nu"}
        </Button>
      </section>
    </main>
  );
}
