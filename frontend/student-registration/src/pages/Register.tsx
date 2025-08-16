import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, reset } from "../store/registerSlice";
import type { AppDispatch, RootState } from "../store/index";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";
import TeacherForm from "../components/TeacherForm";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.register
  );

  const [role, setRole] = useState<"student" | "teacher">("student");

  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as "student" | "teacher");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dynamic validation
    if (role === "student" && (!formData.enrollment_number || !formData.date_of_birth || !formData.grade_level)) {
      alert("Please fill all student fields!");
      return;
    }
    if (role === "teacher" && !formData.employee_id) {
      alert("Please fill all teacher fields!");
      return;
    }
    dispatch(registerUser({ ...formData, role }));
  };

  useEffect(() => {
    if (success) {
      dispatch(reset());
      navigate("/login");
    }
  }, [success, navigate, dispatch]);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Register</h1>

      <select value={role} onChange={handleRoleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <form onSubmit={handleSubmit}>
        {role === "student" ? (
          <StudentForm formData={formData} handleChange={handleChange} />
        ) : (
          <TeacherForm formData={formData} handleChange={handleChange} />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}
      </form>
    </div>
  );
};

export default Register;
