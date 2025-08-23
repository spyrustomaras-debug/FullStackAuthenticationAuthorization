import React, { useEffect, useMemo, lazy, Suspense, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import type { AppDispatch } from "../store";
import {
  fetchStudents,
  selectStudents,
  selectStudentsLoading,
  selectStudentsError,
} from "../store/studentSlice";
import "./Student.scss"; // SCSS

// Lazy-load StudentRow to reduce initial JS parsing and execution
const StudentRow = lazy(() => import("./StudentRow"));

const Students: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Use shallowEqual to prevent unnecessary re-renders
  const students = useSelector(selectStudents, shallowEqual);
  const loading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);

  // Fetch students on mount
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Memoized computations
  const averageGrade = useMemo(() => {
    if (students.length === 0) return "0.00";
    const total = students.reduce((sum, student) => sum + Number(student.grade_level), 0);
    return (total / students.length).toFixed(2);
  }, [students]);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.user.localeCompare(b.user));
  }, [students]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 3;

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const handlePageChange = (page:number) => {
    if(page >= 1 && page <= totalPages){
      setCurrentPage(page);
    }
  }

  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1>Students</h1>

      {loading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && students.length === 0 && <p>No students found.</p>}

      <h2>Average Grade: {averageGrade}</h2>

      <table role="table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr role="row">
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Enrollment</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <Suspense fallback={<tr><td colSpan={7}>Loading students...</td></tr>}>
            {currentStudents.map((s) => (
              <StudentRow key={s.id} student={s} />
            ))}
          </Suspense>
        </tbody>
        {totalPages > 1 && (
          <div style={{marginTop:"1rem", display:"flex", gap:"0.5rem"}}>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  fontWeight: currentPage === i + 1 ? "bold" : "normal",
                }}
              >
                {i + 1}
              </button>
            ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
          </div>
        )

        }
      </table>
    </div>
  );
};

export default Students;
