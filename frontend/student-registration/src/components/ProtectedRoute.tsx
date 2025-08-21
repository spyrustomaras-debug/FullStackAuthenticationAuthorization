// src/components/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: string; // optional: restrict by role (e.g. "teacher")
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user_id, role: userRole } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user_id) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // ❌ Special rule: students cannot access /students page
  if (userRole === "student" && location.pathname === "/students") {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Logged in but wrong role → redirect to home (or unauthorized page)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
