import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGrades, addGrade, selectGrades, type Grade } from "../store/gradesSlice";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import GradeForm from "./GradeForm";
import GradesTable from "./GradesTable";
import "../style/GradeModal.css";


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

  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.student ||
      !formData.course ||
      !formData.assessment_type ||
      formData.score === undefined
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await dispatch(addGrade(formData as Grade)).unwrap();
      setFormData({
        student: undefined,
        course: undefined,
        assessment_type: "",
        score: undefined,
      });
      handleCloseModal();
    } catch (err) {
      console.error("Failed to add grade:", err);
      alert("Failed to add grade. Check console for details.");
    }
  }, [formData, dispatch, handleCloseModal]); 

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

      <GradesTable grades={grades} />

      {/* Modal */}
      {isModalOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Create Grade</h3>
          <GradeForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCloseModal={handleCloseModal}
          />
        </div>
      </div>
      )}

    </div>
  );
};

export default GradesPage;
