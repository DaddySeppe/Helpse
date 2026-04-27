import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data.tasks || []);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  if (user.role === "CUSTOMER") {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) return <LoadingSpinner />;

  return (
    <main className="container-page">
      <h1 className="text-3xl font-black text-brand-900">Alle taken</h1>
      <p className="mt-2 text-brand-700">Bekijk lokale jobs en open hulpvragen.</p>

      {tasks.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Geen taken gevonden"
            subtitle="Er zijn momenteel nog geen taken beschikbaar."
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
