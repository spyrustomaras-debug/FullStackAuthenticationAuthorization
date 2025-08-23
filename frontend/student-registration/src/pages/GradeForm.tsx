import React, { useState } from "react";
import type { Grade } from "../store/gradesSlice";
import { toast, ToastContainer } from "react-toastify";

interface GradeFormProps {
  formData: Partial<Grade>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseModal: () => void;
  grades: Grade[]; // <-- Add grades prop
}

const GradeForm: React.FC<GradeFormProps> = ({ formData, handleChange, handleSubmit, handleCloseModal, grades }) => {
  
  const [errors, setErrors] = useState<Partial<Record<keyof Grade, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Grade, string>> = {};

    if (!formData.student) newErrors.student = "Student ID is required";
    else if (formData.student <= 0) newErrors.student = "Student ID must be positive";

    if (!formData.course) newErrors.course = "Course ID is required";
    else if (formData.course <= 0) newErrors.course = "Course ID must be positive";

    if (!formData.assessment_type || formData.assessment_type.trim() === "")
      newErrors.assessment_type = "Assessment type is required";

    if (formData.score === undefined || formData.score === null) newErrors.score = "Score is required";
    else if (formData.score < 0 || formData.score > 100) newErrors.score = "Score must be between 0 and 100";

    setErrors(newErrors);

    // Show toast notifications
    Object.values(newErrors).forEach((msg) => toast.error(msg));

    return Object.keys(newErrors).length === 0;
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // First validate
    if (!validate()) return;

    // Check if the grade already exists
    const exists = grades.some(
      (g) =>
        g.student === formData.student &&
        g.course === formData.course &&
        g.assessment_type === formData.assessment_type
    );

    if (exists) {
      toast.error("This grade already exists!");
      return;
    }

    // Submit if validation passes and grade is unique
    handleSubmit(e);
  }
  
  return (
    <form onSubmit={handleFormSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="student">Student ID:</label>
        <input
          id="student"
          type="number"
          name="student"
          value={formData.student || ""}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        {errors.student && <p style={{ color: "red", margin: 0 }}>{errors.student}</p>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="course">Course ID:</label>
        <input
          id="course"
          type="number"
          name="course"
          value={formData.course || ""}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        {errors.course && <p style={{ color: "red", margin: 0 }}>{errors.course}</p>}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="assessment_type">Assessment Type:</label>
        <input
          id="assessment_type"
          type="text"
          name="assessment_type"
          value={formData.assessment_type || ""}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        {errors.assessment_type && (
          <p style={{ color: "red", margin: 0 }}>{errors.assessment_type}</p>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="score">Score:</label>
        <input
          id="score"
          type="number"
          name="score"
          value={formData.score || ""}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem" }}
        />
        {errors.score && <p style={{ color: "red", margin: 0 }}>{errors.score}</p>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleCloseModal}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          Cancel
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default GradeForm;
