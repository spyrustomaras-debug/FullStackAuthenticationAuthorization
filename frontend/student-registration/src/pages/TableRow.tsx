import type { Grade } from "../store/gradesSlice";

export const TableRow: React.FC<{ grade: Grade }> = ({ grade }) => (
  <tr>
    <td className="border p-2">{grade.id}</td>
    <td className="border p-2">{grade.student}</td>
    <td className="border p-2">{grade.subject}</td>
    <td className="border p-2">{grade.score}</td>
  </tr>
);

