import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import SubscriptionBanner from "../components/SubscriptionBanner";
import { useAuth } from "../context/AuthContext";
import { date, euro } from "../utils/format";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const { user, access } = useAuth();
  const [task, setTask] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTask() {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data.task);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

  async function apply() {
    setBusy(true);
    setFeedback("");
    try {
      await api.post(`/tasks/${id}/apply`, { message });
      setFeedback("Aanmelding succesvol verzonden.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Actie mislukt.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!task) return <main className="container-page">Taak niet gevonden.</main>;

  const canSeeManage = user.role === "CUSTOMER" && user.id === task.customer_id;
  const canStudentApply = user.role === "STUDENT" && task.status === "OPEN";

  return (
    <main className="container-page">
      <SubscriptionBanner
        status={user.subscription_status}
        onGoPricing={() => navigate("/pricing")}
      />

      <article className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">{task.category}</p>
        <h1 className="mt-2 text-3xl font-black text-brand-900">{task.title}</h1>
        <p className="mt-4 text-brand-700">{task.description}</p>

        <div className="mt-6 grid gap-3 text-brand-800 md:grid-cols-2">
          <p>Locatie: {task.location}</p>
          <p>Datum: {date(task.task_date)}</p>
          <p className="font-bold">Budget: {euro(task.price)}</p>
          <p>Status: {task.status}</p>
        </div>

        {canStudentApply ? (
          <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <h2 className="text-xl font-bold text-brand-900">Aanmelden als student</h2>
            <textarea
              className="mt-3 h-28 w-full rounded-xl border border-brand-200 p-3"
              placeholder="Korte motivatie (optioneel)"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <Button className="mt-3" disabled={!access.canApply || busy} onClick={apply}>
              {busy ? "Verzenden..." : "Meld mij aan"}
            </Button>
          </div>
        ) : null}

        {canSeeManage ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate(`/tasks/${id}/applications`)} disabled={!access.canManage}>
              Bekijk aanmeldingen
            </Button>
          </div>
        ) : null}

        {feedback ? <p className="mt-4 text-sm font-medium text-brand-800">{feedback}</p> : null}
      </article>
    </main>
  );
}
