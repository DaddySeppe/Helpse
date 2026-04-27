import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function SuccessPage() {
  return (
    <main className="page-wrap">
      <section className="form-card text-center">
        <h1 className="text-3xl font-black text-brand-900">Betaling geslaagd</h1>
        <p className="mt-2 text-brand-700">
          Bedankt. Je abonnement wordt geactiveerd via Stripe webhook.
        </p>
        <Link to="/dashboard" className="mt-6 block">
          <Button className="w-full">Ga naar dashboard</Button>
        </Link>
      </section>
    </main>
  );
}
