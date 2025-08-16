import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav style={{
      position: "fixed",   // stick to top
      top: 0,
      left: 0,
      width: "100%",       // full width
      backgroundColor: "#333",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 0rem",
      zIndex: 1000         // stay on top of other elements
    }}>
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Portal
        </Link>
      </div>
      <div>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/register" style={{ color: "#fff", textDecoration: "none", marginRight: "1rem" }}>
          Register
        </Link>
        <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
