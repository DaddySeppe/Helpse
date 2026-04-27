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

  const stats = useMemo(() => getDashboardStats(user, tasks, applications, assignedTasks, access), [
    access,
    applications,
    assignedTasks,
    tasks,
    user,
  ]);

  const pendingApplications = applications.filter((item) => item.status === "PENDING");
  const acceptedApplications = applications.filter((item) => item.status === "ACCEPTED");
  const newestTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);
  const upcomingTasks = [...(user.role === "STUDENT" ? assignedTasks : tasks)]
    .filter((task) => task.status !== "COMPLETED" && task.status !== "CANCELLED")
    .sort((a, b) => new Date(a.task_date) - new Date(b.task_date))
    .slice(0, 3);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <SubscriptionBanner
        status={user.subscription_status}
        onGoPricing={() => navigate("/pricing")}
      />

      <section className="grid gap-5 rounded-2xl bg-brand-900 p-6 text-white md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-100">
            {user.role === "CUSTOMER" ? "Customer dashboard" : "Student dashboard"}
          </p>
          <h1 className="mt-2 text-3xl font-black">Welkom, {user.name}</h1>
          <p className="mt-2 max-w-2xl text-brand-100">
            {user.role === "CUSTOMER"
              ? "Volg je geplaatste taken, bekijk nieuwe kandidaten en plaats snel een nieuwe hulpvraag."
              : "Vind open taken, volg je aanmeldingen en hou toegewezen werk in het oog."}
          </p>
        </div>
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-sm font-semibold text-brand-100">Abonnement</p>
          <p className="mt-1 text-2xl font-black">{statusLabel(user.subscription_status)}</p>
          <p className="mt-2 text-sm text-brand-100">
            {user.subscription_status === "TRIAL"
              ? `${getRemainingTrialTime(user.trial_ends_at)} trial resterend`
              : access.mustPay
                ? "Betaling nodig om acties te gebruiken"
                : "Volledige toegang actief"}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {user.role === "STUDENT" ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <QuickAction
            title="Taken bekijken"
            text="Zoek een job die bij je past."
            to="/tasks"
          />
          <QuickAction
            title="Aanmeldingen"
            text="Volg waar je al reageerde."
            to="/applications"
          />
          <QuickAction
            title={access.mustPay ? "Premium activeren" : "Mijn taken"}
            text={access.mustPay ? "Ontgrendel alle acties." : "Bekijk je lopende taken."}
            to={access.mustPay ? "/pricing" : "/my-tasks"}
          />
        </section>
      ) : null}

      {user.role === "CUSTOMER" ? (
        <CustomerDashboard
          tasks={tasks}
          applications={applications}
          pendingApplications={pendingApplications}
          upcomingTasks={upcomingTasks}
          access={access}
        />
      ) : (
        <StudentDashboard
          openTasks={newestTasks}
          applications={applications}
          acceptedApplications={acceptedApplications}
          assignedTasks={upcomingTasks}
        />
      )}
    </main>
  );
}

function CustomerDashboard({ tasks, applications, pendingApplications, upcomingTasks, access }) {
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const openTasks = tasks.filter((task) => task.status === "OPEN");
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
    <section className="mt-8 space-y-6">
      <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-accent-600">
              Volgende stap
            </p>
            <h2 className="mt-1 text-2xl font-black text-brand-950">{nextStep.title}</h2>
            <p className="mt-2 max-w-2xl text-brand-700">{nextStep.text}</p>
          </div>
          <Link to={nextStep.to}>
            <Button className="w-full px-6 py-4 md:w-auto" variant={nextStep.variant}>
              {nextStep.action}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <WorkflowItem label="Open taken" value={openTasks.length} text="wachten op reacties" tone="green" />
        <WorkflowItem label="Kandidaten" value={pendingApplications.length} text="moeten bekeken worden" tone="amber" />
        <WorkflowItem label="Toegewezen" value={assignedTasks.length} text="iemand is gekozen" tone="blue" />
        <WorkflowItem label="Voltooid" value={completedTasks.length} text="klaar of afgerond" tone="slate" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <DashboardPanel title="Taken beheren">
          <p className="mb-4 text-sm font-semibold text-brand-600">
            Alles wat je geplaatst hebt, met kandidaten en status op één rij.
          </p>
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
        </DashboardPanel>

        <aside className="space-y-6">
          <DashboardPanel title="Kandidaten">
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
          </DashboardPanel>

          <section className="rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-brand-900">Snelle acties</h2>
            <div className="mt-4 grid gap-3">
              <Link to="/tasks/new" className="block">
                <Button className="w-full" disabled={!access.canCreateTask}>
                  Nieuwe taak plaatsen
                </Button>
              </Link>
              <Link to="/applications" className="block">
                <Button variant="secondary" className="w-full">
                  Alle aanmeldingen
                </Button>
              </Link>
            </div>
          </section>

          <DashboardPanel title="Planning">
            {upcomingTasks.length === 0 ? (
              <SmallEmpty text="Geen geplande taken." />
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <MiniTaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </DashboardPanel>
        </aside>
      </div>
    </section>
  );
}

function StudentDashboard({ openTasks, applications, acceptedApplications, assignedTasks }) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-brand-900">Open kansen</h2>
          <Link to="/tasks">
            <Button variant="secondary">Alle taken</Button>
          </Link>
        </div>
        {openTasks.length === 0 ? (
          <EmptyState title="Geen open taken" subtitle="Kom later terug voor nieuwe lokale jobs." />
        ) : (
          <div className="grid gap-4">
            {openTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <DashboardPanel title="Jouw aanmeldingen">
          {applications.length === 0 ? (
            <SmallEmpty text="Je hebt nog nergens op gereageerd." />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Toegewezen werk">
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
        </DashboardPanel>
      </div>
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
      <div className="grid gap-4 md:grid-cols-[1fr_140px_150px_180px] md:items-center">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-brand-950">{task.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-brand-600">
            <span>{task.location}</span>
            <span>{date(task.task_date)}</span>
            <span>{euro(task.price)}</span>
          </div>
        </div>

        <div>
          <StatusBadge status={task.status} />
        </div>

        <div>
          <Link
            to={`/tasks/${task.id}/applications`}
            className={`inline-flex rounded-full px-3 py-1 text-sm font-black ${
              candidateCount > 0
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {candidateCount === 1 ? "1 kandidaat" : `${candidateCount} kandidaten`}
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Link to={`/tasks/${task.id}`}>
            <Button variant="secondary" className="px-4 py-2 text-sm">
              Details
            </Button>
          </Link>
          <Link to={`/tasks/${task.id}/applications`}>
            <Button className="px-4 py-2 text-sm">
              Beheren
            </Button>
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

function getDashboardStats(user, tasks, applications, assignedTasks, access) {
  if (user.role === "CUSTOMER") {
    return [
      { label: "Taken geplaatst", value: tasks.length, detail: "jouw hulpvragen" },
      { label: "Open taken", value: tasks.filter((task) => task.status === "OPEN").length, detail: "zichtbaar voor studenten" },
      { label: "Kandidaten", value: applications.filter((item) => item.status === "PENDING").length, detail: "wachten op keuze" },
      { label: "Toegang", value: access.mustPay ? "Beperkt" : "OK", detail: statusLabel(user.subscription_status) },
    ];
  }

  const openBudget = tasks.reduce((sum, task) => sum + Number(task.price || 0), 0);
  return [
    { label: "Open taken", value: tasks.length, detail: "beschikbaar" },
    { label: "Aangemeld", value: applications.length, detail: "reacties" },
    { label: "Geaccepteerd", value: assignedTasks.length || applications.filter((item) => item.status === "ACCEPTED").length, detail: "lopend werk" },
    { label: "Mogelijk budget", value: euro(openBudget), detail: "in open taken" },
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

function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-brand-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-brand-950">{value}</p>
      <p className="mt-1 text-sm text-brand-500">{detail}</p>
    </article>
  );
}

function QuickAction({ title, text, to, disabled = false }) {
  const content = (
    <article className={`h-full rounded-xl border p-4 shadow-sm ${disabled ? "border-slate-200 bg-slate-100" : "border-brand-200 bg-white hover:border-brand-300"}`}>
      <h3 className="text-lg font-bold text-brand-900">{title}</h3>
      <p className="mt-1 text-sm text-brand-600">{text}</p>
    </article>
  );

  if (disabled) return content;

  return <Link to={to}>{content}</Link>;
}

function DashboardPanel({ title, children }) {
  return (
    <section className="rounded-xl border border-brand-200 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-bold text-brand-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ApplicationRow({ application }) {
  return (
    <Link
      to={application.task_id ? `/tasks/${application.task_id}` : "/applications"}
      className="block rounded-xl border border-brand-100 bg-brand-50 px-4 py-3"
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
    <Link to={`/tasks/${task.id}`} className="block rounded-xl border border-brand-100 px-4 py-3">
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
    <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[status] || "bg-brand-100 text-brand-700"}`}>
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
