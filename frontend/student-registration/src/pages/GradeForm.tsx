import React from "react";
import type { Grade } from "../store/gradesSlice";

interface GradeFormProps {
  formData: Partial<Grade>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseModal: () => void;
}

const GradeForm: React.FC<GradeFormProps> = ({ formData, handleChange, handleSubmit, handleCloseModal }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="student">Student ID:</label>
      <input
        id="student"
        type="number"
        name="student"
        value={formData.student || ""}
        onChange={handleChange}
        style={{ width: "100%", padding: "0.5rem" }}
        required
      />
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
        required
      />
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
        required
      />
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
        required
      />
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
    </form>
  );
};

export default GradeForm;
