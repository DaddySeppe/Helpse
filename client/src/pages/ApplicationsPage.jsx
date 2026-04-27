import { useEffect, useState } from "react";
import api from "../api/axios";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/my");
      setApplications(data.applications || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(applicationId, action) {
    await api.patch(`/applications/${applicationId}/${action}`);
    await load();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <h1 className="text-3xl font-black text-brand-900">Aanmeldingen</h1>
      <p className="mt-2 text-brand-700">Volg je reacties en beheer kandidaten.</p>

      {applications.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Geen aanmeldingen"
            subtitle="Hier verschijnen je ingediende of ontvangen aanmeldingen."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-brand-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-brand-900">
                    {application.tasks?.title || `Taak ${application.task_id}`}
                  </p>
                  <p className="text-brand-700">Status: {application.status}</p>
                  {application.message ? (
                    <p className="mt-2 text-sm text-brand-600">Motivatie: {application.message}</p>
                  ) : null}
                </div>
                {application.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <Button variant="accent" onClick={() => setStatus(application.id, "accept")}>
                      Accepteren
                    </Button>
                    <Button variant="danger" onClick={() => setStatus(application.id, "reject")}>
                      Weigeren
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
