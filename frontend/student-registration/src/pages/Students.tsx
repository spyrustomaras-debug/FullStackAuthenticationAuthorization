import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchStudents, selectStudents, selectStudentsLoading, selectStudentsError } from "../store/studentSlice";
import "./Student.scss"; // 👈 import SCSS
import { StudentRow } from "./StudentRow";

const Students: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Calculate average grade
  const averageGrade = useMemo(() => {
    if (students.length === 0) return 0;
    // Explicitly convert student.grade_level to a number
    const total = students.reduce((sum, student) => sum + Number(student.grade_level), 0);
    return (total / students.length).toFixed(2); // rounded to 2 decimal places
  }, [students]);

  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1>Students</h1>

      {loading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && students.length === 0 && <p>No students found.</p>}


      <h2>Average Grade: {averageGrade}</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
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
        {students.map((s) => (
          <StudentRow key={s.id} student={s} />
        ))}
      </tbody>

      </table>
    </div>
  );
};

export default Students;
