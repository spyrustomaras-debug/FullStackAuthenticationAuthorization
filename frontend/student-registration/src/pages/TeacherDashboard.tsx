// src/pages/TeacherDashboard.tsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user); // adjust according to your redux slice

  useEffect(() => {
    // Redirect if user is not teacher
    if (!user || user.role !== "teacher") {
      navigate("/"); // redirect to home or login
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {user?.username}</p>
      <p>Here you can manage your courses and students.</p>
      {/* You can add more dashboard widgets here */}
    </div>
  );
};

export default TeacherDashboard;
