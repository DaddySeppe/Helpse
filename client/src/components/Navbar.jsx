import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/80 bg-white/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to={user ? "/dashboard" : "/"} className="group inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900 text-xs font-black text-white">
            H
          </span>
          <span className="text-2xl font-black tracking-tight text-brand-900 transition group-hover:text-brand-700">
            HELPSE
          </span>
        </Link>

        <nav className="hidden gap-4 md:flex">
          {user ? (
            <>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              {["STUDENT", "ADMIN"].includes(user.role) ? (
                <NavLink to="/tasks" className="nav-link">
                  Taken
                </NavLink>
              ) : null}
              <NavLink to="/my-tasks" className="nav-link">
                Mijn taken
              </NavLink>
              <NavLink to="/applications" className="nav-link">
                Aanmeldingen
              </NavLink>
              <NavLink to="/pricing" className="nav-link">
                Pricing
              </NavLink>
            </>
          ) : isLanding ? null : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Registreren
              </NavLink>
            </>
          )}
        </nav>

        {user ? (
          <Button variant="secondary" onClick={logout}>
            Uitloggen
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:inline">
              <span className="nav-link">Inloggen</span>
            </Link>
            <Link to="/register">
              <Button variant="accent" className="shadow-md">Start gratis</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
