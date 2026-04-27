import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import SubscriptionBanner from "../components/SubscriptionBanner";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import { getRemainingTrialTime } from "../utils/access";

export default function DashboardPage() {
  const { user, access } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        if (user.role === "CUSTOMER") {
          const { data } = await api.get("/tasks/my");
          setTasks(data.tasks || []);
        } else {
          const [taskRes, appRes] = await Promise.all([
            api.get("/tasks"),
            api.get("/applications/my"),
          ]);
          setTasks((taskRes.data.tasks || []).filter((task) => task.status === "OPEN"));
          setApplications(appRes.data.applications || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user.role]);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <SubscriptionBanner
        status={user.subscription_status}
        onGoPricing={() => navigate("/pricing")}
      />

      <section className="rounded-2xl bg-brand-900 p-6 text-white">
        <h1 className="text-3xl font-black">Welkom, {user.name}</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Info label="Rol" value={user.role} />
          <Info label="Status" value={user.subscription_status} />
          <Info
            label="Trial resterend"
            value={
              user.subscription_status === "TRIAL"
                ? getRemainingTrialTime(user.trial_ends_at)
                : "-"
            }
          />
          <Info label="Toegang" value={access.mustPay ? "Betalen vereist" : "In orde"} />
        </div>
      </section>

      <section className="mt-8">
        {user.role === "CUSTOMER" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-900">Jouw taken</h2>
              <Link to="/tasks/new">
                <Button disabled={!access.canCreateTask}>Nieuwe taak</Button>
              </Link>
            </div>
            {tasks.length === 0 ? (
              <EmptyState
                title="Nog geen taken"
                subtitle="Maak je eerste taak aan om hulp te vinden."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-brand-900">Open taken voor jou</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {tasks.slice(0, 4).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            <h3 className="mt-8 text-xl font-bold text-brand-900">Jouw aanmeldingen</h3>
            {applications.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  title="Nog geen aanmeldingen"
                  subtitle="Meld je aan op een taak om hier updates te zien."
                />
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-brand-200 bg-white p-4">
                <ul className="space-y-3">
                  {applications.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <p className="font-medium text-brand-900">{item.tasks?.title || "Taak"}</p>
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="text-xs uppercase tracking-wide text-brand-100">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
