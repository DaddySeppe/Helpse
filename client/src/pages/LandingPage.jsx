import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
  const values = [
    "Voor wie hulp zoekt",
    "Voor wie wil helpen",
    "Duidelijke afspraken",
  ];

  const services = [
    {
      title: "Kleine klusjes",
      text: "Bijvoorbeeld iets ophangen, opruimen, tuinwerk of iets verplaatsen.",
    },
    {
      title: "Digitale hulp",
      text: "Hulp met gsm, computer, apps, e-mail, documenten of online formulieren.",
    },
    {
      title: "Praktische hulp",
      text: "Bijvoorbeeld boodschappen, administratie of begeleiding.",
    },
  ];

  const steps = [
    {
      title: "Plaats een hulpvraag",
      text: "Schrijf kort waarvoor je hulp zoekt.",
    },
    {
      title: "Krijg reacties",
      text: "Helpers uit de buurt kunnen reageren.",
    },
    {
      title: "Maak een afspraak",
      text: "Kies iemand en spreek samen een moment af.",
    },
  ];

  return (
    <main className="landing-page">
      <section className="landing-hero mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="space-y-7">
          <p className="landing-kicker">Helpse</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
            Hulp zoeken of hulp aanbieden in je buurt
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-700 sm:text-xl">
            Op Helpse kan je een hulpvraag plaatsen. Helpers uit de buurt kunnen reageren, waarna
            je samen een afspraak maakt.
          </p>

          <blockquote className="landing-quote max-w-2xl">
            "Hulp vragen moet duidelijk en eenvoudig zijn."
          </blockquote>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="min-h-13 w-full px-8 py-4 text-lg sm:w-auto">
                Hulpvraag plaatsen
              </Button>
            </Link>
            <a href="#hoe-het-werkt">
              <Button variant="secondary" className="min-h-13 w-full px-8 py-4 text-lg sm:w-auto">
                Bekijk de stappen
              </Button>
            </a>
          </div>
        </div>

        <aside className="landing-preview" aria-label="Voorbeeld van een hulpvraag op Helpse">
          <div className="landing-preview-header">
            <div>
              <p>Voorbeeld</p>
              <strong>Zo kan een hulpvraag eruitzien</strong>
            </div>
            <span>Stap 1</span>
          </div>

          <p className="landing-preview-intro">
            Je vult kort in waarvoor je hulp zoekt. Zo weet een helper meteen of die kan helpen.
          </p>

          <div className="landing-request-card">
            <span>Digitale hulp</span>
            <h2>Hulp nodig met smartphone en foto's</h2>
            <p>
              Ik zoek iemand die rustig kan helpen om mijn smartphone in te stellen en foto's over
              te zetten.
            </p>

            <dl>
              <div>
                <dt>Waar</dt>
                <dd>Gentbrugge</dd>
              </div>
              <div>
                <dt>Wanneer</dt>
                <dd>Deze week</dd>
              </div>
              <div>
                <dt>Soort hulp</dt>
                <dd>Eenmalig</dd>
              </div>
            </dl>
          </div>

          <div className="landing-preview-footer">
            <Link to="/register">Plaats hulpvraag</Link>
          </div>
        </aside>
      </section>

      <section className="landing-trust-row mx-auto w-full max-w-6xl px-4 md:px-6">
        {values.map((value) => (
          <article key={value}>
            <span aria-hidden="true" />
            <p>{value}</p>
          </article>
        ))}
      </section>

      <section className="landing-band">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-18">
          <p className="landing-section-label">Wat we doen</p>
          <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">
            Waarvoor kan je Helpse gebruiken?
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-700">
            Helpse is bedoeld voor eenvoudige taken waarbij iemand uit de buurt kan helpen.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="landing-service">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="hoe-het-werkt" className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-18">
        <div className="landing-section-heading landing-section-center">
          <p className="landing-section-label">Hoe het werkt</p>
          <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">
            Zo werkt het
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-700">
            Een hulpvraag plaatsen gaat in enkele eenvoudige stappen.
          </p>
        </div>

        <div className="landing-steps mt-8">
          {steps.map((step, index) => (
            <article key={step.title} className="landing-step">
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-section">
        <div className="landing-cta mx-auto w-full max-w-6xl">
          <div>
            <p className="landing-cta-label">Helpse gebruiken</p>
            <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-4xl">
              Klaar om te starten?
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-white/90">
              Plaats een hulpvraag of kijk welke hulpvragen er in je buurt openstaan.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button variant="accent" className="w-full px-7 py-4 text-lg sm:w-auto">
                Starten
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full px-7 py-4 text-lg sm:w-auto">
                Inloggen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
          <div className="landing-footer-main">
            <div>
              <div className="landing-footer-brand">
                <span>H</span>
                <strong>Helpse</strong>
              </div>
              <p>Hulp zoeken en aanbieden in je buurt.</p>
            </div>

            <nav aria-label="Footer navigatie">
              <Link to="/">Home</Link>
              <Link to="/login">Inloggen</Link>
              <Link to="/register">Registreren</Link>
            </nav>
          </div>

          <div className="landing-footer-bottom">
            <p>© 2026 Helpse. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
