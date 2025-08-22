// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar should stay eager (always used)
import Loader from "./components/Loader"; // 🔥 import new loader
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const Students = lazy(() => import("./pages/Students"));
const Grades = lazy(() => import("./pages/Grades"));

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar will appear on all pages */}
      <div style={{ paddingTop: "3.5rem" }}>
        {/* Wrap routes in Suspense for lazy loading */}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/grades" element={
              <ProtectedRoute>
                <Grades />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
