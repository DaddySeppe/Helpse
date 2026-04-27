import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TaskApplicationsPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/${id}/applications`);
      setApplications(data.applications || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function setStatus(applicationId, action) {
    await api.patch(`/applications/${applicationId}/${action}`);
    await load();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <h1 className="text-3xl font-black text-brand-900">Aanmeldingen voor taak</h1>

      {applications.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nog geen kandidaten" subtitle="Wacht op reacties van studenten." />
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {applications.map((application) => (
            <article key={application.id} className="rounded-2xl border border-brand-200 bg-white p-4">
              <p className="font-bold text-brand-900">Student: {application.student_id}</p>
              <p className="mt-1 text-brand-700">Status: {application.status}</p>
              {application.message ? <p className="mt-2 text-sm text-brand-700">{application.message}</p> : null}
              {application.status === "PENDING" ? (
                <div className="mt-3 flex gap-2">
                  <Button variant="accent" onClick={() => setStatus(application.id, "accept")}>Accepteren</Button>
                  <Button variant="danger" onClick={() => setStatus(application.id, "reject")}>Weigeren</Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
