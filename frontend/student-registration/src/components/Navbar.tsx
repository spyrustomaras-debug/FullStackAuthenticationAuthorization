import React, { useCallback, memo, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import "../styles/styles.css"
import ThemeToggle from "./ThemeToggle";

// Lazy-load LanguageSwitcher to reduce initial JS parsing
const LanguageSwitcher = React.lazy(() => import("./LanguageSwitcher"));

// Memoized Navbar links to avoid re-renders
const NavLinks: React.FC<{
  userRole: string | null;
  isLoggedIn: boolean;
  onLogout: () => void;
}> = memo(({ userRole, isLoggedIn, onLogout }) => {
  const teacherLinks = useMemo(
    () => (
      <>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/students" className="nav-link">
          Students
        </Link>
      </>
    ),
    []
  );

  return (
    <>
      {userRole === "teacher" && teacherLinks}

      {(userRole === "teacher" || userRole === "student") && (
        <Link to="/grades" className="nav-link">
          Grades
        </Link>
      )}

      {!isLoggedIn && (
        <div className="nav-links">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}

      {isLoggedIn && (
        <button className="nav-logout" onClick={onLogout}>
          Logout
        </button>
      )}
    </>
  );
});

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userRole, isLoggedIn } = useSelector(
    (state: RootState) => ({
      userRole: state.auth.role,
      isLoggedIn: !!state.auth.access,
    }),
    shallowEqual
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Portal</Link>
        <ThemeToggle/>

      </div>

      {/* Lazy-load LanguageSwitcher with Suspense */}
      <React.Suspense fallback={null}>
        <LanguageSwitcher />
      </React.Suspense>

      <div className="navbar-links">
        <NavLinks userRole={userRole} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
