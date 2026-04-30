import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
  const benefits = [
    {
      title: "Makkelijk voor iedereen",
      text: "Grote knoppen, duidelijke taal en een overzicht zonder drukte. Ook ideaal voor oudere gebruikers.",
    },
    {
      title: "Snel lokale hulp",
      text: "Plaats je taak en ontvang snel reacties van gemotiveerde studenten uit je buurt.",
    },
    {
      title: "Veilig en transparant",
      text: "Je ziet op voorhand wat je nodig hebt, wat het kost en wie reageert op je taak.",
    },
  ];

  const steps = [
    {
      title: "Vertel wat je nodig hebt",
      text: "Van tuinwerk tot digitale hulp: beschrijf kort je vraag in gewone taal.",
    },
    {
      title: "Kies met vertrouwen",
      text: "Vergelijk reacties rustig en kies iemand die past bij jouw planning.",
    },
    {
      title: "Laat je helpen",
      text: "Spreek af, rond de taak af en geniet van meer tijd en minder stress.",
    },
  ];

  const trustPoints = [
    "Duidelijke stappen en leesbare schermen",
    "Lokale studenten die graag bijverdienen",
    "Transparante prijs en heldere afspraken",
    "Ondersteuning voor jong en oud",
  ];

  return (
    <main className="landing-page relative overflow-hidden pb-20">
      <div className="hero-glow" />
      <div className="hero-grid" />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6 md:pb-14 md:pt-18">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-brand-200 bg-white/85 px-4 py-2 text-sm font-bold text-brand-800 shadow-sm">
              Lokaal platform voor hulp in en rond het huis
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Vind snel betrouwbare hulp, zonder gedoe of kleine lettertjes
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-800 sm:text-xl">
              Helpse brengt mensen met een hulpvraag samen met studenten die willen
              bijverdienen. Eenvoudig, menselijk en duidelijk voor elke leeftijd.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="min-h-13 min-w-52 px-7 py-4 text-lg">Ik zoek hulp</Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" className="min-h-13 min-w-52 px-7 py-4 text-lg">
                  Ik wil bijverdienen
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-brand-700 sm:text-base">
              <span className="rounded-full bg-brand-100 px-4 py-2">Duidelijke stappen</span>
              <span className="rounded-full bg-brand-100 px-4 py-2">Grote knoppen</span>
              <span className="rounded-full bg-brand-100 px-4 py-2">Ook senior-vriendelijk</span>
            </div>
          </div>

          <aside className="landing-feature-card rounded-3xl border border-brand-200/70 bg-white/90 p-7 shadow-2xl md:p-9">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Waarom mensen kiezen voor Helpse</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-brand-950">Rust, vertrouwen en echte hulp</h2>

            <ul className="mt-6 space-y-3 text-base text-brand-800 md:text-lg">
              {trustPoints.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent-500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/register" className="mt-7 inline-flex">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Start in 2 minuten
              </Button>
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3 md:px-6">
        {benefits.map((item, index) => (
          <article
            key={item.title}
            className="landing-rise rounded-2xl border border-brand-200/70 bg-white/85 p-6 shadow-lg"
            style={{ animationDelay: `${0.12 + index * 0.08}s` }}
          >
            <h3 className="text-2xl font-bold text-brand-900">{item.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-brand-700">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-brand-200 bg-white/92 p-7 shadow-xl md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Zo werkt het</p>
            <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">
              Duidelijk in 3 simpele stappen
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5"
              >
                <p className="text-sm font-black text-brand-600">STAP {index + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-brand-900">{step.title}</h3>
                <p className="mt-2 text-brand-700">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 rounded-3xl border border-brand-300/70 bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white shadow-2xl md:grid-cols-[1.2fr_0.8fr] md:p-11">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-4xl">
              Klaar om het jezelf makkelijker te maken?
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-brand-50/90">
              Maak vandaag nog een account en vind snel iemand die je taak met zorg aanpakt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register">
                <Button variant="accent" className="px-7 py-4 text-lg">
                  Gratis registreren
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="secondary" className="px-7 py-4 text-lg">
                  Bekijk prijzen
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-accent-100">Speciaal voor senioren</p>
            <p className="mt-3 text-lg leading-relaxed text-white/95">
              Helpse is ontworpen met extra duidelijke knoppen, leesbare tekst en een rustig scherm.
              Zo voelt online hulp aanvragen vertrouwd en eenvoudig.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
