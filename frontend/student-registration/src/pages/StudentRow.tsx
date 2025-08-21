import React from "react";
import type { Student } from "../store/studentSlice";

export const StudentRow: React.FC<{ student: Student }> = React.memo(({ student }) => (
  <tr key={student.id} style={{ borderBottom: "1px solid #ccc" }}>
    <td>{student.id}</td>
    <td>{student.user}</td>
    <td>{student.date_of_birth}</td>
    <td>{student.enrollment_number}</td>
    <td>{student.address}</td>
    <td>{student.phone_number}</td>
    <td>{student.grade_level}</td>
  </tr>
));
