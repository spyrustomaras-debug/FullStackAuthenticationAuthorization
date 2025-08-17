import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGrades, addGrade, selectGrades, type Grade } from "../store/gradesSlice";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";

const GradesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { grades, loading, error } = useSelector(selectGrades);
  const userRole = useSelector((state: RootState) => state.auth.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Grade>>({
    student: undefined,
    course: undefined,
    assessment_type: "",
    score: undefined,
  });

  useEffect(() => {
    if (userRole === "teacher" || userRole === "student") {
      dispatch(fetchGrades());
    }
  }, [dispatch, userRole]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" || name === "student" || name === "course" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student || !formData.course || !formData.assessment_type || formData.score === undefined) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await dispatch(addGrade(formData as Grade)).unwrap();
      setFormData({ student: undefined, course: undefined, assessment_type: "", score: undefined });
      handleCloseModal();
    } catch (err) {
      console.error("Failed to add grade:", err);
      alert("Failed to add grade. Check console for details.");
    }
  };

  if (loading) return <p>Loading grades...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Grades</h2>

      {userRole === "teacher" && (
        <button
          onClick={handleOpenModal}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Grade
        </button>
      )}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>ID</th>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Student</th>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Subject</th>
            <th style={{ border: "1px solid black", padding: "0.5rem" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id}>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{grade.id}</td>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{grade.student}</td>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{grade.subject}</td>
              <td style={{ border: "1px solid black", padding: "0.5rem" }}>{grade.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", width: "400px" }}>
            <h3>Create Grade</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label>Student ID:</label>
                <input
                  type="number"
                  name="student"
                  value={formData.student || ""}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Course ID:</label>
                <input
                  type="number"
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Assessment Type:</label>
                <input
                  type="text"
                  name="assessment_type"
                  value={formData.assessment_type}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Score:</label>
                <input
                  type="number"
                  name="score"
                  value={formData.score || ""}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.5rem" }}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}>
                  Submit
                </button>
                <button type="button" onClick={handleCloseModal} style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesPage;
