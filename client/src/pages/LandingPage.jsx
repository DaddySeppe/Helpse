import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
  const highlights = [
    { value: "24u", label: "tot eerste reactie" },
    { value: "4.8/5", label: "tevredenheid bij gebruikers" },
    { value: "Lokaal", label: "hulp uit je eigen buurt" },
  ];

  const services = [
    "Tuin en buitenwerk",
    "Digitale hulp thuis",
    "Boodschappen en verplaatsing",
    "Kleine klusjes in huis",
    "Administratie en formulieren",
    "Eenmalige of wekelijkse hulp",
  ];

  const steps = [
    {
      title: "Plaats je hulpvraag",
      text: "Beschrijf kort wat je nodig hebt. Geen ingewikkelde stappen.",
    },
    {
      title: "Ontvang reacties",
      text: "Je krijgt snel voorstellen van studenten uit je regio.",
    },
    {
      title: "Kies en plan",
      text: "Jij kiest wie past en spreekt af op jouw moment.",
    },
  ];

  const reviews = [
    {
      quote: "Eindelijk een website die duidelijk is. Ik vond in 1 dag hulp met mijn smartphone.",
      person: "Gusta, 67 - Gent",
    },
    {
      quote: "Alles voelt veilig en overzichtelijk. Ik kon zonder stress iemand kiezen.",
      person: "Marleen, 61 - Merelbeke",
    },
    {
      quote: "Perfect om lokaal bij te verdienen met heldere afspraken.",
      person: "Lars, student - Sint-Amandsberg",
    },
  ];

  return (
    <main className="landing-page pb-24">
      <div className="landing-accent-orb" aria-hidden="true" />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-14 md:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700">
            Professionele en lokale hulp op maat
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
            Betrouwbare hulp voor thuis, zonder gedoe
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-700 sm:text-xl">
            Helpse verbindt mensen met een hulpvraag aan gemotiveerde studenten in de buurt.
            Duidelijk opgebouwd, rustig design en makkelijk te gebruiken voor jong en oud.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="min-h-13 px-8 py-4 text-lg">Ik zoek hulp</Button>
            </Link>
            <Link to="/register">
              <Button variant="accent" className="min-h-13 px-8 py-4 text-lg">
                Ik wil bijverdienen
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.label} className="landing-surface rounded-2xl px-4 py-4">
                <p className="text-2xl font-black text-brand-900">{item.value}</p>
                <p className="text-sm font-semibold text-brand-700">{item.label}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="landing-surface rounded-3xl p-7 md:p-9">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Waarom Helpse werkt</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-brand-950">Rustig, duidelijk en betrouwbaar</h2>

          <ul className="mt-6 space-y-3 text-base text-brand-800">
            <li className="landing-check">Grote knoppen en heldere schermen</li>
            <li className="landing-check">Makkelijk lezen, ook voor oudere gebruikers</li>
            <li className="landing-check">Lokale studenten met transparante afspraken</li>
            <li className="landing-check">Snelle ondersteuning via een duidelijk proces</li>
          </ul>

          <Link to="/pricing" className="mt-7 inline-flex">
            <Button variant="secondary" className="px-6 py-3">
              Bekijk abonnement
            </Button>
          </Link>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="landing-surface rounded-3xl p-7 md:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Wat je kan laten doen</p>
          <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">Veelgevraagde hulpdiensten</h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service} className="rounded-2xl border border-brand-200 bg-white px-4 py-4 text-brand-800">
                <p className="font-semibold">{service}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-brand-200 bg-white p-7 shadow-lg md:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Hoe het werkt</p>
          <h2 className="mt-2 text-3xl font-black text-brand-950 md:text-4xl">In 3 eenvoudige stappen</h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-brand-100 bg-brand-50/70 p-5">
                <p className="text-sm font-black text-brand-600">STAP {index + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-brand-900">{step.title}</h3>
                <p className="mt-2 text-brand-700">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.person} className="landing-surface rounded-2xl p-6">
              <p className="text-lg leading-relaxed text-brand-800">"{review.quote}"</p>
              <p className="mt-4 text-sm font-bold text-brand-600">{review.person}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-3xl border border-brand-300 bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white shadow-2xl md:p-11">
          <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-4xl">
            Klaar om je eerste hulpvraag te plaatsen?
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-brand-50/90">
            Maak een account en vind snel iemand uit je buurt die je met zorg verder helpt.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register">
              <Button variant="accent" className="px-7 py-4 text-lg">
                Gratis registreren
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary" className="px-7 py-4 text-lg">
                Prijzen bekijken
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
