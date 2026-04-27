import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="hero-glow" />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
              Lokaal en betrouwbaar platform
            </p>
            <h1 className="text-4xl font-black leading-tight text-brand-950 md:text-6xl">
              Vind snel hulp of verdien geld met kleine jobs
            </h1>
            <p className="max-w-xl text-lg text-brand-700">
              Helpse verbindt mensen die hulp nodig hebben met studenten die willen
              bijverdienen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="px-7 py-4 text-lg">Ik zoek hulp</Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" className="px-7 py-4 text-lg">
                  Ik wil geld verdienen
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-200 bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-brand-900">Waarom Helpse?</h2>
            <ul className="mt-5 space-y-3 text-brand-700">
              <li>Grote, duidelijke knoppen en simpele stappen</li>
              <li>Snel overzicht van taken in je buurt</li>
              <li>Veilige toegang met abonnement en heldere regels</li>
              <li>Perfect voor jong en oud</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
