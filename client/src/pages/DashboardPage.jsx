import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import SubscriptionBanner from "../components/SubscriptionBanner";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { getRemainingTrialTime } from "../utils/access";
import { date, euro } from "../utils/format";

export default function DashboardPage() {
  const { user, access } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        if (user.role === "CUSTOMER") {
          const [taskRes, appRes] = await Promise.all([api.get("/tasks/my"), api.get("/applications/my")]);
          setTasks(taskRes.data.tasks || []);
          setApplications(appRes.data.applications || []);
          setAssignedTasks([]);
        } else {
          const [taskRes, appRes, assignedRes] = await Promise.all([
            api.get("/tasks"),
            api.get("/applications/my"),
            api.get("/tasks/my"),
          ]);
          setTasks((taskRes.data.tasks || []).filter((task) => task.status === "OPEN"));
          setApplications(appRes.data.applications || []);
          setAssignedTasks(assignedRes.data.tasks || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user.role]);

  const pendingApplications = applications.filter((item) => item.status === "PENDING");
  const acceptedApplications = applications.filter((item) => item.status === "ACCEPTED");
  const openTasks = tasks.filter((task) => task.status === "OPEN");
  const upcomingTasks = [...(user.role === "STUDENT" ? assignedTasks : tasks)]
    .filter((task) => task.status !== "COMPLETED" && task.status !== "CANCELLED")
    .sort((a, b) => new Date(a.task_date) - new Date(b.task_date))
    .slice(0, 4);

  const overview = useMemo(
    () => buildOverview({ user, access, tasks, applications, assignedTasks }),
    [access, applications, assignedTasks, tasks, user],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <main className="dashboard-page container-page relative pb-10 pt-4 md:pt-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-10rem] h-[22rem] w-[22rem] rounded-full bg-brand-900/6 blur-3xl" />
        <div className="absolute right-[-7rem] top-[6rem] h-[18rem] w-[18rem] rounded-full bg-accent-500/8 blur-3xl" />
      </div>

      <SubscriptionBanner status={user.subscription_status} onGoPricing={() => navigate("/pricing")} />

      <DashboardHero user={user} access={access} overview={overview} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px] xl:items-start">
        <div className="space-y-6">
          {user.role === "CUSTOMER" ? (
            <CustomerPrimaryRail
              access={access}
              tasks={tasks}
              applications={applications}
              pendingApplications={pendingApplications}
              openTasks={openTasks}
              upcomingTasks={upcomingTasks}
            />
          ) : (
            <StudentPrimaryRail openTasks={openTasks} applications={applications} />
          )}
        </div>

        {user.role === "CUSTOMER" ? (
          <CustomerSideRail
            access={access}
            pendingApplications={pendingApplications}
            upcomingTasks={upcomingTasks}
            tasks={tasks}
          />
        ) : (
          <StudentSideRail
            access={access}
            acceptedApplications={acceptedApplications}
            assignedTasks={upcomingTasks}
            applications={applications}
          />
        )}
      </div>
    </main>
  );
}

function DashboardHero({ user, access, overview }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
              {user.role === "CUSTOMER" ? "Ik zoek hulp" : "Ik wil helpen"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600">
              {statusLabel(user.subscription_status)}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">Dag {user.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            {user.role === "CUSTOMER"
              ? "Hier vind je in één oogopslag je taken, kandidaten en volgende stap."
              : "Hier zie je je open jobs, reacties en planning in een rustige zakelijke omgeving."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={user.role === "CUSTOMER" ? "/tasks/new" : "/tasks"}>
              <Button variant="accent" className="px-6 py-3 text-base">
                {user.role === "CUSTOMER" ? "Nieuwe taak" : "Taken bekijken"}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Abonnement bekijken
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-6 lg:border-l lg:border-t-0 lg:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Je toegang</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {access.mustPay ? "Betaling nodig" : "Alles in orde"}
          </p>
          <p className="mt-2 text-base font-medium leading-relaxed text-slate-600">
            {user.subscription_status === "TRIAL"
              ? `${getRemainingTrialTime(user.trial_ends_at)} trial resterend`
              : access.mustPay
                ? "Activeer Premium om verder te werken."
                : "Je hebt volledige toegang."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {overview.map((item) => (
              <MiniMetric key={item.label} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerPrimaryRail({ access, tasks, applications, pendingApplications, openTasks, upcomingTasks }) {
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const assignedTasks = tasks.filter((task) => task.status === "ASSIGNED");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const nextStep = getCustomerNextStep({
    access,
    pendingApplications,
    tasks,
    openTasks,
    assignedTasks,
  });

  return (
    <section className="space-y-6">
      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Acties</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Wat wil je doen?</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm font-medium leading-relaxed text-slate-600 md:block">
            De belangrijkste knoppen staan hier samen, zodat je niet hoeft te zoeken.
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <BigAction
            title="Nieuwe taak plaatsen"
            text="Vraag hulp voor een klus"
            to="/tasks/new"
            disabled={!access.canCreateTask}
            variant="primary"
          />
          <BigAction
            title="Kandidaten bekijken"
            text={pendingApplications.length === 1 ? "1 persoon wacht" : `${pendingApplications.length} personen wachten`}
            to="/applications"
            variant="accent"
          />
          <BigAction title="Mijn taken bekijken" text={`${tasks.length} taken in totaal`} to="/my-tasks" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Overzicht</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">In één oogopslag</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <WorkflowItem label="Open taken" value={openTasks.length} text="studenten kunnen reageren" tone="green" />
          <WorkflowItem label="Te kiezen" value={pendingApplications.length} text="kandidaten wachten" tone="amber" />
          <WorkflowItem label="Bezig" value={assignedTasks.length} text="iemand is gekozen" tone="blue" />
          <WorkflowItem label="Klaar" value={completedTasks.length} text="afgerond" tone="slate" />
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Taken</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Jouw taken</h2>
          </div>
          <p className="hidden text-sm font-medium text-slate-600 md:block">Alles staat hier netjes onder elkaar.</p>
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_340px]">
          <div>
            {sortedTasks.length === 0 ? (
              <EmptyState title="Nog geen taken" subtitle="Plaats je eerste hulpvraag en volg alles hier op." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
                {sortedTasks.map((task) => (
                  <CustomerTaskRow
                    key={task.id}
                    task={task}
                    candidateCount={applications.filter((item) => item.task_id === task.id).length}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <MiniPanel title="Kandidaten" subtitle="Wie op jouw taken reageert.">
              {access.mustPay ? (
                <PayNotice />
              ) : pendingApplications.length > 0 ? (
                <div className="space-y-3">
                  {pendingApplications.slice(0, 5).map((application) => (
                    <CandidateRow key={application.id} application={application} />
                  ))}
                </div>
              ) : (
                <SmallEmpty text="Geen nieuwe kandidaten. Je hoeft nu niets te doen." />
              )}
            </MiniPanel>

            <MiniPanel title="Planning" subtitle="Taken die binnenkort gepland staan.">
              {upcomingTasks.length === 0 ? (
                <SmallEmpty text="Geen geplande taken." />
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <MiniTaskRow key={task.id} task={task} />
                  ))}
                </div>
              )}
            </MiniPanel>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Uitleg</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Hoe werkt dit?</h2>
        </div>
        <div className="mt-4">
          <SimpleGuide role="CUSTOMER" />
        </div>
      </section>
    </section>
  );
}

function StudentPrimaryRail({ openTasks, applications }) {
  return (
    <section className="space-y-6">
      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Acties</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Wat wil je doen?</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm font-medium leading-relaxed text-slate-600 md:block">
            De drie belangrijkste ingangen staan samen en logisch gegroepeerd.
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <BigAction title="Taken zoeken" text="Bekijk jobs in je buurt." to="/tasks" variant="primary" />
          <BigAction title="Mijn reacties" text={`${applications.length} reacties`} to="/applications" variant="accent" />
          <BigAction title="Mijn werk" text={`${openTasks.length} open taken`} to="/my-tasks" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Overzicht</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Waar sta je nu?</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <WorkflowItem label="Open jobs" value={openTasks.length} text="beschikbaar" tone="green" />
          <WorkflowItem label="Reacties" value={applications.length} text="verstuurd" tone="blue" />
          <WorkflowItem label="Volgend" value={applications.length ? applications.length : 0} text="opvolgen" tone="amber" />
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Open jobs</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Nieuwe taken</h2>
          </div>
          <Link to="/tasks">
            <Button variant="secondary">Alle taken</Button>
          </Link>
        </div>

        <div className="mt-4">
          {openTasks.length === 0 ? (
            <EmptyState title="Geen open taken" subtitle="Kom later terug voor nieuwe lokale jobs." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {openTasks.slice(0, 4).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Uitleg</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Hoe werkt dit?</h2>
        </div>
        <div className="mt-4">
          <SimpleGuide role="STUDENT" />
        </div>
      </section>
    </section>
  );
}

function CustomerSideRail({ access, pendingApplications, upcomingTasks, tasks }) {
  const nextStep = getCustomerNextStep({
    access,
    pendingApplications,
    tasks,
    openTasks: tasks.filter((task) => task.status === "OPEN"),
    assignedTasks: tasks.filter((task) => task.status === "ASSIGNED"),
  });

  return (
    <aside className="space-y-6 xl:sticky xl:top-24">
      <NextStepCard nextStep={nextStep} />

      <MiniPanel title="Snel overzicht" subtitle="De belangrijkste cijfers bij elkaar.">
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="Open" value={tasks.filter((task) => task.status === "OPEN").length} />
          <MiniMetric label="Kandidaten" value={pendingApplications.length} />
          <MiniMetric label="Bezig" value={tasks.filter((task) => task.status === "ASSIGNED").length} />
          <MiniMetric label="Klaar" value={tasks.filter((task) => task.status === "COMPLETED").length} />
        </div>
      </MiniPanel>

      <MiniPanel title="Planning" subtitle="Binnenkort op te volgen.">
        {upcomingTasks.length === 0 ? (
          <SmallEmpty text="Geen geplande taken." />
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <MiniTaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </MiniPanel>
    </aside>
  );
}

function StudentSideRail({ access, acceptedApplications, assignedTasks, applications }) {
  const nextStep = getStudentNextStep({ access, applications, assignedTasks });

  return (
    <aside className="space-y-6 xl:sticky xl:top-24">
      <NextStepCard nextStep={nextStep} />

      <MiniPanel title="Snel overzicht" subtitle="Wat je vandaag moet weten.">
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="Reacties" value={applications.length} />
          <MiniMetric label="Gekozen" value={assignedTasks.length || acceptedApplications.length} />
          <MiniMetric label="Open" value={assignedTasks.length} />
          <MiniMetric label="Status" value={access.mustPay ? "Betaal" : "Ok"} />
        </div>
      </MiniPanel>

      <MiniPanel title="Toegewezen werk" subtitle="Werk dat al op jou wacht.">
        {assignedTasks.length === 0 && acceptedApplications.length === 0 ? (
          <SmallEmpty text="Nog geen toegewezen taken." />
        ) : (
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <MiniTaskRow key={task.id} task={task} />
            ))}
            {acceptedApplications.slice(0, 3).map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </div>
        )}
      </MiniPanel>
    </aside>
  );
}

function NextStepCard({ nextStep }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-accent-700">Belangrijkste volgende stap</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{nextStep.title}</h2>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-slate-600">{nextStep.text}</p>
        </div>
        <Link to={nextStep.to}>
          <Button className="w-full px-7 py-5 text-lg md:w-auto" variant={nextStep.variant}>
            {nextStep.action}
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SimpleGuide({ role }) {
  const steps =
    role === "CUSTOMER"
      ? [
          ["1", "Plaats een taak", "Vertel kort welke hulp je nodig hebt."],
          ["2", "Bekijk kandidaten", "Kies rustig wie jou mag helpen."],
          ["3", "Volg alles op", "Datum, budget en status staan hier samen."],
        ]
      : [
          ["1", "Zoek een taak", "Kies een job die bij jou past."],
          ["2", "Reageer duidelijk", "Stuur een kort bericht naar de taakgever."],
          ["3", "Volg je planning", "Als je gekozen bent, staat de job hier klaar."],
        ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map(([number, title, text]) => (
        <article key={number} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-black text-white">
              {number}
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-1 text-base font-medium leading-relaxed text-slate-600">{text}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function MiniPanel({ title, subtitle, children }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">{subtitle}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BigAction({ title, text, to, variant = "secondary", disabled = false }) {
  const content = (
    <article
      className={`h-full rounded-[22px] border p-5 shadow-sm transition duration-200 ${
        disabled
          ? "border-slate-200 bg-slate-100 text-slate-500"
          : variant === "primary"
            ? "border-slate-900 bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-md"
            : variant === "accent"
              ? "border-accent-200 bg-accent-100/70 text-slate-950 hover:-translate-y-0.5 hover:shadow-md"
              : "border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <h3 className="text-xl font-black">{title}</h3>
      <p className={`mt-2 text-base font-medium leading-relaxed ${variant === "primary" && !disabled ? "text-white/80" : "text-slate-600"}`}>
        {disabled ? "Eerst Premium activeren" : text}
      </p>
    </article>
  );

  if (disabled) return content;

  return <Link to={to}>{content}</Link>;
}

function CandidateRow({ application }) {
  return (
    <Link
      to={application.task_id ? `/tasks/${application.task_id}/applications` : "/applications"}
      className="block rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-lg font-black text-slate-950">{application.tasks?.title || "Nieuwe kandidaat"}</p>
          <p className="mt-1 text-sm font-semibold text-amber-900">Wacht op jouw keuze</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-amber-800 shadow-sm">
          Bekijken
        </span>
      </div>
      {application.message ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{application.message}</p> : null}
    </Link>
  );
}

function PayNotice() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold text-slate-900">Premium is nodig om kandidaten te beheren.</p>
      <p className="mt-1 text-sm text-slate-600">Je kan blijven kijken, maar acties uitvoeren kan pas na activatie.</p>
      <Link to="/pricing" className="mt-4 inline-block">
        <Button>Premium activeren</Button>
      </Link>
    </div>
  );
}

function CustomerTaskRow({ task, candidateCount }) {
  return (
    <article className="border-b border-slate-200 bg-white p-5 last:border-b-0 hover:bg-slate-50">
      <div className="grid gap-4 lg:grid-cols-[1fr_140px_170px_190px] lg:items-center">
        <div className="min-w-0">
          <h3 className="text-xl font-black text-slate-950">{task.title}</h3>
          <div className="mt-3 grid gap-2 text-sm font-medium text-slate-600 sm:grid-cols-3">
            <span>Locatie: {task.location}</span>
            <span>Datum: {date(task.task_date)}</span>
            <span>Budget: {euro(task.price)}</span>
          </div>
        </div>

        <StatusBadge status={task.status} />

        <Link
          to={`/tasks/${task.id}/applications`}
          className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-black ${
            candidateCount > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
          }`}
        >
          {candidateCount === 1 ? "1 kandidaat" : `${candidateCount} kandidaten`}
        </Link>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Link to={`/tasks/${task.id}`} className="flex-1 md:flex-none">
            <Button variant="secondary" className="w-full px-5 py-3">
              Details
            </Button>
          </Link>
          <Link to={`/tasks/${task.id}/applications`} className="flex-1 md:flex-none">
            <Button className="w-full px-5 py-3">Beheren</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function WorkflowItem({ label, value, text, tone }) {
  const tones = {
    green: "border-accent-200 bg-accent-100/60 text-accent-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-brand-200 bg-brand-50 text-brand-700",
    slate: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <article className={`rounded-[22px] border p-5 shadow-sm ${tones[tone] || tones.blue}`}>
      <p className="text-4xl font-black tracking-tight text-slate-950">{value}</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">{label}</h3>
      <p className="mt-1 font-medium text-slate-600">{text}</p>
    </article>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function buildOverview({ user, access, tasks, applications, assignedTasks }) {
  if (user.role === "CUSTOMER") {
    return [
      { label: "taken", value: tasks.length },
      { label: "kandidaten", value: applications.filter((item) => item.status === "PENDING").length },
      { label: "open", value: tasks.filter((task) => task.status === "OPEN").length },
      { label: "toegang", value: access.mustPay ? "betalen" : "ok" },
    ];
  }

  return [
    { label: "open", value: tasks.length },
    { label: "reacties", value: applications.length },
    { label: "gekozen", value: assignedTasks.length },
    { label: "budget", value: euro(tasks.reduce((sum, task) => sum + Number(task.price || 0), 0)) },
  ];
}

function getCustomerNextStep({ access, pendingApplications, tasks, openTasks, assignedTasks }) {
  if (access.mustPay) {
    return {
      title: "Activeer Premium om verder te werken",
      text: "Je kan nog kijken, maar taken plaatsen en kandidaten beheren kan pas met een actief abonnement.",
      action: "Premium activeren",
      to: "/pricing",
      variant: "primary",
    };
  }

  if (!access.canCreateTask) {
    return {
      title: "Je zit in je gratis kijkperiode",
      text: "Je kan alles rustig bekijken. Wil je een taak plaatsen of kandidaten beheren? Dan heb je Premium nodig.",
      action: "Premium bekijken",
      to: "/pricing",
      variant: "secondary",
    };
  }

  if (pendingApplications.length > 0) {
    return {
      title: "Bekijk je nieuwe kandidaten",
      text: "Er wachten studenten op jouw antwoord. Kies wie je wil laten helpen of bekijk eerst hun motivatie.",
      action: "Kandidaten bekijken",
      to: "/applications",
      variant: "primary",
    };
  }

  if (tasks.length === 0) {
    return {
      title: "Plaats je eerste taak",
      text: "Maak een korte hulpvraag met locatie, datum en budget. Studenten kunnen daarna reageren.",
      action: "Nieuwe taak plaatsen",
      to: "/tasks/new",
      variant: "primary",
    };
  }

  if (openTasks.length > 0) {
    return {
      title: "Je open taken staan klaar",
      text: "Je taken zijn zichtbaar. Zodra studenten reageren, verschijnen ze bovenaan dit dashboard.",
      action: "Mijn taken bekijken",
      to: "/my-tasks",
      variant: "secondary",
    };
  }

  if (assignedTasks.length > 0) {
    return {
      title: "Volg je toegewezen taken op",
      text: "Er is al iemand gekozen. Hou datum, locatie en status in het oog.",
      action: "Planning bekijken",
      to: "/my-tasks",
      variant: "secondary",
    };
  }

  return {
    title: "Alles is rustig",
    text: "Er vraagt momenteel niets je aandacht. Je kan altijd een nieuwe hulpvraag plaatsen.",
    action: "Nieuwe taak plaatsen",
    to: "/tasks/new",
    variant: "primary",
  };
}

function getStudentNextStep({ access, applications, assignedTasks }) {
  if (access.mustPay) {
    return {
      title: "Activeer Premium om te reageren",
      text: "Je kan taken bekijken, maar reageren kan pas met een actief abonnement.",
      action: "Premium activeren",
      to: "/pricing",
      variant: "primary",
    };
  }

  if (!access.canApply) {
    return {
      title: "Je zit in je gratis kijkperiode",
      text: "Je kan taken rustig bekijken. Wil je reageren op een job? Dan heb je Premium nodig.",
      action: "Premium bekijken",
      to: "/pricing",
      variant: "secondary",
    };
  }

  if (assignedTasks.length > 0) {
    return {
      title: "Volg je toegewezen werk",
      text: "Je bent gekozen voor een taak. Bekijk de details en hou de planning in het oog.",
      action: "Mijn taken",
      to: "/my-tasks",
      variant: "primary",
    };
  }

  if (applications.length > 0) {
    return {
      title: "Je reacties zijn verstuurd",
      text: "Bekijk je aanmeldingen en volg of een taakgever jou kiest.",
      action: "Aanmeldingen bekijken",
      to: "/applications",
      variant: "secondary",
    };
  }

  return {
    title: "Vind je eerste job",
    text: "Bekijk open taken in je buurt en reageer wanneer iets bij je past.",
    action: "Taken bekijken",
    to: "/tasks",
    variant: "primary",
  };
}

function ApplicationRow({ application }) {
  return (
    <Link
      to={application.task_id ? `/tasks/${application.task_id}` : "/applications"}
      className="block rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-slate-950">{application.tasks?.title || "Taak"}</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
          {statusLabel(application.status)}
        </span>
      </div>
      {application.message ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{application.message}</p> : null}
    </Link>
  );
}

function MiniTaskRow({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-slate-950">{task.title}</p>
        <span className="text-sm font-semibold text-slate-600">{euro(task.price)}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {task.location} - {date(task.task_date)} - {statusLabel(task.status)}
      </p>
    </Link>
  );
}

function SmallEmpty({ text }) {
  return <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">{text}</p>;
}

function StatusBadge({ status }) {
  const tones = {
    OPEN: "bg-accent-100 text-accent-700",
    ASSIGNED: "bg-brand-100 text-brand-700",
    COMPLETED: "bg-slate-200 text-slate-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ${tones[status] || "bg-brand-100 text-brand-700"}`}>
      {statusLabel(status)}
    </span>
  );
}

function statusLabel(status) {
  const labels = {
    ACTIVE: "Actief",
    TRIAL: "Trial",
    EXPIRED: "Verlopen",
    OPEN: "Open",
    ASSIGNED: "Toegewezen",
    COMPLETED: "Voltooid",
    CANCELLED: "Geannuleerd",
    PENDING: "Wachtend",
    ACCEPTED: "Geaccepteerd",
    REJECTED: "Geweigerd",
  };

  return labels[status] || status;
}
