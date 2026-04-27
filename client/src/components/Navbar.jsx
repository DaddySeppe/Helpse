import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-2xl font-black tracking-tight text-brand-900">
          HELPSE
        </Link>

        <nav className="hidden gap-4 md:flex">
          {user ? (
            <>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className="nav-link">
                Taken
              </NavLink>
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
          ) : (
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
          <Link to="/login">
            <Button>Start nu</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
