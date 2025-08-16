// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; // make sure you have this page
import TeacherDashboard from "./pages/TeacherDashboard";
import Navbar from "./components/Navbar"; // import your Navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar will appear on all pages */}
      <div style={{ paddingTop: "3.5rem" }}> {/* add padding to prevent overlap with fixed Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<TeacherDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
