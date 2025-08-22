import React from "react";
import type { Student } from "../store/studentSlice";

export const StudentRow: React.FC<{ student: Student }> = React.memo(({ student }) => (
  <tr className="border-b border-gray-300">
    <th scope="row">{student.id}</th>
    <td>{student.user}</td>
    <td>{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : "—"}</td>
    <td>{student.enrollment_number ?? "—"}</td>
    <td>{student.address ?? "—"}</td>
    <td>{student.phone_number ?? "—"}</td>
    <td>{student.grade_level ?? "—"}</td>
  </tr>
));

export default StudentRow
