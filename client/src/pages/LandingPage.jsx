import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
  const serviceTiles = [
    {
      title: "Tuin & buiten",
      text: "Gras maaien, bladeren opruimen of planten water geven.",
    },
    {
      title: "Digitaal gemak",
      text: "Hulp bij smartphone, laptop, mail en online afspraken.",
    },
    {
      title: "Rond het huis",
      text: "Kleine herstellingen, hulp bij boodschappen of verplaatsen.",
    },
  ];

  const quickFacts = [
    { value: "24u", label: "gemiddeld tot eerste reactie" },
    { value: "100%", label: "duidelijke stappen op elk scherm" },
    { value: "Lokaal", label: "studenten uit je eigen regio" },
  ];

  const steps = [
    {
      title: "Plaats je vraag",
      text: "Beschrijf kort wat je nodig hebt, in gewone mensentaal.",
    },
    {
      title: "Ontvang reacties",
      text: "Je krijgt voorstellen van studenten en kiest rustig wie bij je past.",
    },
    {
      title: "Spreek af en klaar",
      text: "Plan het moment dat voor jou werkt en laat je met een gerust hart helpen.",
    },
  ];

  const liveExamples = [
    { task: "Hulp met iPhone instellen", area: "Gent", eta: "2 reacties in 35 min" },
    { task: "Onkruid verwijderen in voortuin", area: "Merelbeke", eta: "3 reacties in 1 uur" },
    { task: "Boodschappen dragen naar appartement", area: "Sint-Amandsberg", eta: "1 reactie in 22 min" },
  ];

  const audiences = [
    {
      title: "Voor wie hulp zoekt",
      text: "Snel iemand vinden voor kleine taken, zonder eindeloos te zoeken of te bellen.",
      cta: "Ik zoek hulp",
    },
    {
      title: "Voor studenten",
      text: "Verdien bij op flexibele momenten met taken in je buurt en duidelijke afspraken.",
      cta: "Ik wil bijverdienen",
    },
  ];

  const trustPoints = [
    "Rustige interface met grote klikzones",
    "Leesbare lettergroottes en helder contrast",
    "Geen technisch gedoe of verwarrende stappen",
    "Persoonlijk, lokaal en transparant",
  ];

  return (
    <main className="landing-page relative overflow-hidden pb-24">
      <div className="hero-glow" />
      <div className="hero-grid" />
      <div className="hero-noise" />

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6 md:pb-14 md:pt-18">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            <p className="inline-flex rounded-full border border-brand-200 bg-white/90 px-4 py-2 text-sm font-bold text-brand-800 shadow-sm">
              Menselijke hulp, zonder digitale stress
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Vandaag geholpen, morgen opgelucht
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-800 sm:text-xl">
              Helpse verbindt je met betrouwbare studenten uit de buurt voor kleine taken.
              Duidelijk, rustig en ontworpen zodat ook oudere gebruikers zich meteen zeker voelen.
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

            <div className="grid gap-3 sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <article key={fact.label} className="rounded-2xl border border-brand-200 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-2xl font-black text-brand-900">{fact.value}</p>
                  <p className="text-sm font-semibold text-brand-700">{fact.label}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="landing-feature-card rounded-3xl border border-brand-200/70 bg-white/92 p-7 shadow-2xl md:p-9">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Live in je buurt</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-brand-950">Recente hulpvragen op Helpse</h2>

            <ul className="mt-6 space-y-3 text-base text-brand-800 md:text-lg">
              {liveExamples.map((item) => (
                <li key={item.task} className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
                  <p className="font-bold text-brand-900">{item.task}</p>
                  <p className="mt-1 text-sm text-brand-700">{item.area}</p>
                  <p className="mt-1 text-sm font-semibold text-accent-600">{item.eta}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-brand-200 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-brand-700">Speciaal voor senioren</p>
              <p className="mt-1 text-sm text-brand-700">
                Grote knoppen, rustige schermen en duidelijke taal zonder technische termen.
              </p>
            </div>

            <Link to="/register" className="mt-7 inline-flex">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Start in 2 minuten
              </Button>
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {serviceTiles.map((item, index) => (
            <article
              key={item.title}
              className="landing-tile landing-rise rounded-2xl border border-brand-200/70 bg-white/88 p-6 shadow-lg"
              style={{ animationDelay: `${0.12 + index * 0.08}s` }}
            >
              <h3 className="text-2xl font-bold text-brand-900">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-brand-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {audiences.map((group, index) => (
            <article key={group.title} className="rounded-3xl border border-brand-200 bg-white/90 p-7 shadow-lg">
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">
                {index === 0 ? "Hulp nodig" : "Student"}
              </p>
              <h3 className="mt-2 text-3xl font-black text-brand-950">{group.title}</h3>
              <p className="mt-3 text-lg text-brand-700">{group.text}</p>
              <Link to="/register" className="mt-6 inline-flex">
                <Button variant={index === 0 ? "primary" : "accent"} className="px-6 py-3 text-base">
                  {group.cta}
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-brand-200 bg-white/92 p-7 shadow-xl md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Hoe het werkt</p>
            <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">
              Duidelijk in 3 eenvoudige stappen
            </h2>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
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
            <p className="text-sm font-bold uppercase tracking-wide text-accent-100">Waarom dit werkt</p>
            <ul className="mt-3 space-y-3 text-white/95">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-100" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
