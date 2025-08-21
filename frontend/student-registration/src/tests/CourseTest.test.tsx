import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import coursesReducer from "../store/courseSlice";
import Home from "../pages/Home";

const mockCourses = [
  { id: 1, name: "Math", students: [{ id: 1, user: "Alice" }] },
  { id: 2, name: "Science", students: [] },
];

const mockStudents = [
  { id: 1, user: "Alice" },
  { id: 2, user: "Bob" },
];

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { courses: coursesReducer },
    preloadedState: {
      courses: {
        courses: mockCourses,
        students: mockStudents,
        loading: false,
        error: null,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

test("renders courses list", () => {
  renderWithStore(<Home />);
  expect(screen.getByText("Math")).toBeInTheDocument();
  expect(screen.getByText("Science")).toBeInTheDocument();
  expect(screen.getByText(/Alice/)).toBeInTheDocument();
});
