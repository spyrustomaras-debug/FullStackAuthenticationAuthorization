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
            <th role="columnHeader">ID</th>
            <th role="columnHeader">Name</th>
            <th role="columnHeader">DOB</th>
            <th role="columnHeader">Enrollment</th>
            <th role="columnHeader">Address</th>
            <th role="columnHeader">Phone</th>
            <th role="columnHeader">Grade</th>
          </tr>
        </thead>
        <tbody>
        {sortedStudents.map((s) => (
          <StudentRow key={s.id} student={s} />
        ))}
      </tbody>

      </table>
    </div>
  );
};

export default Students;
