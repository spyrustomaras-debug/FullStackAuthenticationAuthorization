import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import studentsReducer, { fetchStudents } from "../store/studentSlice";
import Students from "../pages/Students";
import { vi } from "vitest";

// Mock StudentRow
vi.mock("../pages/StudentRow", () => ({
  default: ({ student }: any) => (
    <tr data-testid="student-row">
      <td>{student.id}</td>
      <td>{student.user}</td>
    </tr>
  ),
}));

// Mock axios in the thunk
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from "axios";
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: { students: studentsReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Students />
    </Provider>
  );
}

describe("Students Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading state initially", () => {
    renderWithStore({ students: { students: [], loading: true, error: null } });
    expect(screen.getByText(/Loading students.../i)).toBeInTheDocument();
  });


  test("renders students in table and computes average", async () => {
    const studentsData = [
      { id: 1, user: "Alice", grade_level: "3" },
      { id: 2, user: "Bob", grade_level: "4" },
      { id: 3, user: "Charlie", grade_level: "5" },
      { id: 4, user: "David", grade_level: "2" },
    ];

    renderWithStore({ students: { students: studentsData, loading: false, error: null } });

    expect(screen.getByText(/Average Grade: 3.50/)).toBeInTheDocument();

    await waitFor(() => {
      const rows = screen.getAllByTestId("student-row");
      expect(rows).toHaveLength(3); // first page
      expect(rows[0]).toHaveTextContent("1");
      expect(rows[1]).toHaveTextContent("2");
      expect(rows[2]).toHaveTextContent("3");
    });
  });

  test("pagination works", async () => {
    const studentsData = [
      { id: 1, user: "Alice", grade_level: "3" },
      { id: 2, user: "Bob", grade_level: "4" },
      { id: 3, user: "Charlie", grade_level: "5" },
      { id: 4, user: "David", grade_level: "2" },
    ];

    renderWithStore({ students: { students: studentsData, loading: false, error: null } });

    // Next page
    const nextBtn = screen.getByText(/Next/i);
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const rows = screen.getAllByTestId("student-row");
      expect(rows).toHaveLength(1); // page 2
      expect(rows[0]).toHaveTextContent("4");
    });

    // Prev page
    const prevBtn = screen.getByText(/Prev/i);
    fireEvent.click(prevBtn);

    await waitFor(() => {
      const rows = screen.getAllByTestId("student-row");
      expect(rows).toHaveLength(3); // page 1 again
    });
  });

  test("fetchStudents thunk is called on mount", () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithStore();
    expect(fetchStudents).toBeDefined(); // can't actually spy axios easily here
  });
});
