import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import ApplicationsPage from "./pages/ApplicationsPage";
import CancelPage from "./pages/CancelPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MyTasksPage from "./pages/MyTasksPage";
import NewTaskPage from "./pages/NewTaskPage";
import NotFoundPage from "./pages/NotFoundPage";
import PricingPage from "./pages/PricingPage";
import RegisterPage from "./pages/RegisterPage";
import SuccessPage from "./pages/SuccessPage";
import TaskApplicationsPage from "./pages/TaskApplicationsPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import TasksPage from "./pages/TasksPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/tasks/:id/applications" element={<TaskApplicationsPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
