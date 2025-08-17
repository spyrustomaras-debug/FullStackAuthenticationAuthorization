import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchStudents, selectStudents, selectStudentsLoading, selectStudentsError } from "../store/studentSlice";

const Students: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentsLoading);
  const error = useSelector(selectStudentsError);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1>Students</h1>

      {loading && <p>Loading students...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
            <tr key={s.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{s.id}</td>
              <td>{s.user}</td>
              <td>{s.date_of_birth}</td>
              <td>{s.enrollment_number}</td>
              <td>{s.address}</td>
              <td>{s.phone_number}</td>
              <td>{s.grade_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
