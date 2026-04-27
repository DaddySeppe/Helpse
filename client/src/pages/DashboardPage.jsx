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
          const [taskRes, appRes] = await Promise.all([
            api.get("/tasks/my"),
            api.get("/applications/my"),
          ]);
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
    <main className="container-page">
      <SubscriptionBanner
        status={user.subscription_status}
        onGoPricing={() => navigate("/pricing")}
      />

      <DashboardHero user={user} access={access} overview={overview} />

      {user.role === "CUSTOMER" ? (
        <CustomerDashboard
          access={access}
          tasks={tasks}
          applications={applications}
          pendingApplications={pendingApplications}
          openTasks={openTasks}
          upcomingTasks={upcomingTasks}
        />
      ) : (
        <StudentDashboard
          access={access}
          openTasks={openTasks}
          applications={applications}
          acceptedApplications={acceptedApplications}
          assignedTasks={upcomingTasks}
        />
      )}
    </main>
  );
}

function DashboardHero({ user, access, overview }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        <div className="bg-brand-900 p-6 text-white md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-100">
              {user.role === "CUSTOMER" ? "Taakgever" : "Student"}
            </span>
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-black text-accent-600">
              {statusLabel(user.subscription_status)}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black md:text-4xl">Welkom, {user.name}</h1>
          <p className="mt-3 max-w-2xl text-brand-100">
            {user.role === "CUSTOMER"
              ? "Beheer je hulpvragen, bekijk kandidaten en zie meteen welke taak aandacht nodig heeft."
              : "Vind lokale jobs, volg je reacties en hou toegewezen werk overzichtelijk bij."}
          </p>
        </div>

        <div className="border-t border-brand-100 bg-brand-50 p-6 lg:border-l lg:border-t-0">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Toegang</p>
          <p className="mt-2 text-2xl font-black text-brand-950">
            {access.mustPay ? "Actie vereist" : "In orde"}
          </p>
          <p className="mt-2 text-sm font-semibold text-brand-700">
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

function CustomerDashboard({ access, tasks, applications, pendingApplications, openTasks, upcomingTasks }) {
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
    <section className="mt-6 space-y-6">
      <NextStepCard nextStep={nextStep} />

      <div className="grid gap-3 md:grid-cols-4">
        <WorkflowItem label="Open" value={openTasks.length} text="zichtbaar" tone="green" />
        <WorkflowItem label="Kandidaten" value={pendingApplications.length} text="te kiezen" tone="amber" />
        <WorkflowItem label="Toegewezen" value={assignedTasks.length} text="bezig" tone="blue" />
        <WorkflowItem label="Klaar" value={completedTasks.length} text="afgerond" tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel
          title="Taken beheren"
          subtitle="Je geplaatste hulpvragen met status, datum, budget en kandidaten."
          action={
            <Link to="/tasks/new">
              <Button disabled={!access.canCreateTask}>Nieuwe taak</Button>
            </Link>
          }
        >
          {sortedTasks.length === 0 ? (
            <EmptyState title="Nog geen taken" subtitle="Plaats je eerste hulpvraag en volg alles hier op." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-brand-100">
              {sortedTasks.map((task) => (
                <CustomerTaskRow
                  key={task.id}
                  task={task}
                  candidateCount={applications.filter((item) => item.task_id === task.id).length}
                />
              ))}
            </div>
          )}
        </Panel>

        <aside className="space-y-6">
          <Panel title="Kandidaten" subtitle="Nieuwe reacties die jouw keuze nodig hebben.">
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
          </Panel>

          <Panel title="Planning" subtitle="Eerstvolgende taken op datum.">
            {upcomingTasks.length === 0 ? (
              <SmallEmpty text="Geen geplande taken." />
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <MiniTaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </section>
  );
}

function StudentDashboard({ access, openTasks, applications, acceptedApplications, assignedTasks }) {
  const nextStep = getStudentNextStep({ access, applications, assignedTasks });

  return (
    <section className="mt-6 space-y-6">
      <NextStepCard nextStep={nextStep} />

      <div className="grid gap-3 md:grid-cols-3">
        <WorkflowItem label="Open jobs" value={openTasks.length} text="beschikbaar" tone="green" />
        <WorkflowItem label="Reacties" value={applications.length} text="verstuurd" tone="blue" />
        <WorkflowItem label="Gekozen" value={assignedTasks.length || acceptedApplications.length} text="lopend werk" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel
          title="Open taken"
          subtitle="Nieuwe lokale jobs waar je op kan reageren."
          action={
            <Link to="/tasks">
              <Button variant="secondary">Alle taken</Button>
            </Link>
          }
        >
          {openTasks.length === 0 ? (
            <EmptyState title="Geen open taken" subtitle="Kom later terug voor nieuwe lokale jobs." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {openTasks.slice(0, 4).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </Panel>

        <aside className="space-y-6">
          <Panel title="Jouw reacties" subtitle="Taken waarop je al gereageerd hebt.">
            {applications.length === 0 ? (
              <SmallEmpty text="Je hebt nog nergens op gereageerd." />
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Toegewezen werk" subtitle="Jobs waarbij jij gekozen bent.">
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
          </Panel>
        </aside>
      </div>
    </section>
  );
}

function NextStepCard({ nextStep }) {
  return (
    <section className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-accent-600">Volgende stap</p>
          <h2 className="mt-1 text-2xl font-black text-brand-950">{nextStep.title}</h2>
          <p className="mt-2 max-w-2xl text-brand-700">{nextStep.text}</p>
        </div>
        <Link to={nextStep.to}>
          <Button className="w-full px-6 py-4 md:w-auto" variant={nextStep.variant}>
            {nextStep.action}
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-brand-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm font-semibold text-brand-600">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function CandidateRow({ application }) {
  return (
    <Link
      to={application.task_id ? `/tasks/${application.task_id}/applications` : "/applications"}
      className="block rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:border-amber-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-black text-brand-950">{application.tasks?.title || "Nieuwe kandidaat"}</p>
          <p className="mt-1 text-sm font-semibold text-amber-800">Wacht op jouw keuze</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-amber-800">
          Bekijken
        </span>
      </div>
      {application.message ? (
        <p className="mt-2 line-clamp-2 text-sm text-brand-700">{application.message}</p>
      ) : null}
    </Link>
  );
}

function PayNotice() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="font-bold text-red-800">Premium is nodig om kandidaten te beheren.</p>
      <p className="mt-1 text-sm text-red-700">
        Je kan blijven kijken, maar acties uitvoeren kan pas na activatie.
      </p>
      <Link to="/pricing" className="mt-4 inline-block">
        <Button>Premium activeren</Button>
      </Link>
    </div>
  );
}

function CustomerTaskRow({ task, candidateCount }) {
  return (
    <article className="border-b border-brand-100 bg-white p-4 last:border-b-0 hover:bg-brand-50/60">
      <div className="grid gap-4 md:grid-cols-[1fr_120px_150px_170px] md:items-center">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-brand-950">{task.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-brand-600">
            <span>{task.location}</span>
            <span>{date(task.task_date)}</span>
            <span>{euro(task.price)}</span>
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
          <Link to={`/tasks/${task.id}`}>
            <Button variant="secondary" className="px-4 py-2 text-sm">
              Details
            </Button>
          </Link>
          <Link to={`/tasks/${task.id}/applications`}>
            <Button className="px-4 py-2 text-sm">Beheren</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

function WorkflowItem({ label, value, text, tone }) {
  const tones = {
    green: "border-accent-100 bg-accent-100/60 text-accent-600",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-brand-200 bg-brand-50 text-brand-700",
    slate: "border-slate-200 bg-white text-slate-700",
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${tones[tone] || tones.blue}`}>
      <p className="text-3xl font-black">{value}</p>
      <h3 className="mt-1 font-black text-brand-950">{label}</h3>
      <p className="mt-1 text-sm font-semibold opacity-80">{text}</p>
    </article>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-brand-100">
      <p className="text-2xl font-black text-brand-950">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide text-brand-500">{label}</p>
    </div>
  );
}

function buildOverview({ user, access, tasks, applications, assignedTasks }) {
  if (user.role === "CUSTOMER") {
    return [
      { label: "taken", value: tasks.length },
      { label: "kandidaten", value: applications.filter((item) => item.status === "PENDING").length },
      { label: "open", value: tasks.filter((task) => task.status === "OPEN").length },
      { label: "toegang", value: access.mustPay ? "pay" : "ok" },
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
      className="block rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 hover:border-brand-200"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-brand-900">{application.tasks?.title || "Taak"}</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700">
          {statusLabel(application.status)}
        </span>
      </div>
      {application.message ? (
        <p className="mt-1 line-clamp-2 text-sm text-brand-600">{application.message}</p>
      ) : null}
    </Link>
  );
}

function MiniTaskRow({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="block rounded-xl border border-brand-100 px-4 py-3 hover:bg-brand-50">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-brand-900">{task.title}</p>
        <span className="text-sm font-semibold text-brand-600">{euro(task.price)}</span>
      </div>
      <p className="mt-1 text-sm text-brand-600">
        {task.location} - {date(task.task_date)} - {statusLabel(task.status)}
      </p>
    </Link>
  );
}

function SmallEmpty({ text }) {
  return <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600">{text}</p>;
}

function StatusBadge({ status }) {
  const tones = {
    OPEN: "bg-accent-100 text-accent-600",
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
