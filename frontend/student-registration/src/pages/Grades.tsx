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

  // Filters 
  const [filterText, setFilterText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [gradeFilter, setGradeFilter] = useState<"all" | "high" | "medium" | "low">("all")


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

   // Apply filters
  const filteredGrades = grades.filter((g) => {
    const matchesText =
      g.student?.toString().includes(filterText) ||
      (g.assessment_type?.toLowerCase().includes(filterText.toLowerCase()) ?? false);

    const matchesCourse = filterCourse ? g.course?.toString() === filterCourse : true;

    let matchesGrade = true;
    if (gradeFilter === "high") matchesGrade = g.score > 80;
    else if (gradeFilter === "medium") matchesGrade = g.score >= 50 && g.score <= 80;
    else if (gradeFilter === "low") matchesGrade = g.score < 50;

    return matchesText && matchesCourse && matchesGrade;
  });



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

      {/* Filters */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search student or assessment"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">All Courses</option>
          {[...new Set(grades.map(g => g.course))].map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value as any)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="all">All Grades</option>
          <option value="high">Above 80</option>
          <option value="medium">50 - 80</option>
          <option value="low">Below 50</option>
        </select>
      </div>

      <MemoizedGradesTable grades={filteredGrades} />

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
