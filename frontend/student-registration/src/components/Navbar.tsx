import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import { LanguageSwitcher } from "./LanguageSwitcher";
import "../styles/styles.css"

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userRole = useSelector((state: RootState) => state.auth.role);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.access);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // redirect to login after logout
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Portal
        </Link>
      </div>
      <div>
        <LanguageSwitcher/>
      </div>

      <div>
        {/* Only show Home and Students if user is a teacher */}
        {userRole === "teacher" && (
          <>
            <Link
              to="/"
              style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}
            >
              Home
            </Link>
            <Link
              to="/students"
              style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}
            >
              Students
            </Link>
          </>
        )}

        {/* Show Grades if user is teacher or student */}
        {(userRole === "teacher" || userRole === "student") && (
          <Link
            to="/grades"
            style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}
          >
            Grades
          </Link>
        )}

        {/* Show Register/Login only if not logged in */}
        {!isLoggedIn && (
          <div className="nav-links">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        )}

        {/* Show Logout if logged in */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              marginLeft: "1rem",
              fontSize: "1rem",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
