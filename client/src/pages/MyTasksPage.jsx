import { useEffect, useState } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskCard from "../components/TaskCard";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/tasks/my");
        setTasks(data.tasks || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <h1 className="text-3xl font-black text-brand-900">Mijn taken</h1>

      {tasks.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Geen resultaten"
            subtitle="Hier verschijnen taken die jij plaatste of kreeg toegewezen."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </main>
  );
}
