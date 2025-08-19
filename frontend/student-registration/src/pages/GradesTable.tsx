import React from "react";
import type { Grade } from "../store/gradesSlice";
import { TableRow } from "./TableRow";
import "../style/GradesTable.css"; // import CSS file

interface GradesTableProps {
  grades: Grade[];
}

const GradesTable: React.FC<GradesTableProps> = React.memo(({ grades }) => {
  return (
    <div className="table-container">
      <table className="grades-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((grade) => <TableRow key={grade.id} grade={grade} />)
          ) : (
            <tr>
              <td colSpan={4} className="no-data">
                No grades available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default GradesTable;
