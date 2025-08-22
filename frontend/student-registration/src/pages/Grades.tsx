import React, { useCallback, useEffect, useState, lazy, Suspense } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { fetchGrades, addGrade, selectGrades, type Grade } from "../store/gradesSlice";
import type { AppDispatch, RootState } from "../store";
import "../style/GradeModal.css";

// Lazy-load GradeForm to reduce initial JS
const GradeForm = lazy(() => import("./GradeForm"));

// Memoize GradesTable to prevent unnecessary re-renders
import GradesTable from "./GradesTable";
const MemoizedGradesTable = React.memo(GradesTable);

const GradesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grades, loading, error } = useSelector(selectGrades, shallowEqual);
  const userRole = useSelector((state: RootState) => state.auth.role);

  const initialFormState: Partial<Grade> = {
    student: undefined,
    course: undefined,
    assessment_type: "",
    score: undefined,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Grade>>(initialFormState);

  // Fetch grades only if user is teacher or student
  useEffect(() => {
    if (userRole === "teacher" || userRole === "student") {
      dispatch(fetchGrades());
    }
  }, [dispatch, userRole]);

  // Memoized handlers
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "score" || name === "student" || name === "course" ? Number(value) : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.student || !formData.course || !formData.assessment_type || formData.score === undefined) {
        alert("Please fill in all required fields.");
        return;
      }

      try {
        await dispatch(addGrade(formData as Grade)).unwrap();
        setFormData(initialFormState);
        handleCloseModal();
      } catch (err) {
        console.error("Failed to add grade:", err);
        alert("Failed to add grade. Check console for details.");
      }
    },
    [formData, dispatch, handleCloseModal]
  );

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

      <MemoizedGradesTable grades={grades} />

      {/* Lazy-loaded modal */}
      {isModalOpen && (
        <Suspense fallback={<div>Loading form...</div>}>
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
        </Suspense>
      )}
    </div>
  );
};

export default GradesPage;
