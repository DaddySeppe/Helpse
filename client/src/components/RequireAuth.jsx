import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.subscription_status === "EXPIRED" && !["/pricing", "/success", "/cancel"].includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
}
