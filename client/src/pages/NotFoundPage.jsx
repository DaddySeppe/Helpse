import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFoundPage() {
  return (
    <main className="page-wrap">
      <section className="form-card text-center">
        <h1 className="text-4xl font-black text-brand-900">404</h1>
        <p className="mt-2 text-brand-700">Deze pagina bestaat niet.</p>
        <Link to="/" className="mt-6 block">
          <Button className="w-full">Terug naar home</Button>
        </Link>
      </section>
    </main>
  );
}
