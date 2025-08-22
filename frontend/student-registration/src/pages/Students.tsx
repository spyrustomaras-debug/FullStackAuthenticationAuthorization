import React, { useEffect, useMemo, lazy, Suspense } from "react";
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
            {sortedStudents.map((s) => (
              <StudentRow key={s.id} student={s} />
            ))}
          </Suspense>
        </tbody>
      </table>
    </div>
  );
};

export default Students;
