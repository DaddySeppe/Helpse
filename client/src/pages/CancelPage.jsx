import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function CancelPage() {
  return (
    <main className="page-wrap">
      <section className="form-card text-center">
        <h1 className="text-3xl font-black text-brand-900">Betaling geannuleerd</h1>
        <p className="mt-2 text-brand-700">Je kan opnieuw proberen wanneer je wil.</p>
        <Link to="/pricing" className="mt-6 block">
          <Button className="w-full">Terug naar pricing</Button>
        </Link>
      </section>
    </main>
  );
}
