import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import gradesReducer from "../store/gradesSlice";
import GradesPage from "../pages/Grades";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Correctly mock axios with default export
vi.mock("axios", async () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

import axios from "axios";
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

// Mock auth reducer
const authReducer = (state = { role: "teacher", access: "token" }) => state;

// Helper to render with store
function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { grades: gradesReducer, auth: authReducer },
    preloadedState: {
      grades: { grades: [], loading: false, error: null },
      auth: { role: "teacher", access: "token" },
    },
  });

  return { ...render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>), store };
}


beforeEach(() => {
  vi.clearAllMocks();

  // Adjusted mock data to include 'subject' for TableRow
  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, student: 1, course: 1, assessment_type: "Math", score: 90 },
      { id: 2, student: 2, course: 1, assessment_type: "Science", score: 85 },
    ],
  });

  mockedAxios.post.mockResolvedValue({
    data: { id: 3, student: 1, course: 1, assessment_type: "Assignment", score: 95 },
  });
});

// Tests
test("renders grades list", async () => {
  renderWithStore(<GradesPage />);
  await waitFor(() => {
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });
});

test("opens and closes create grade modal", async () => {
  renderWithStore(<GradesPage />);
  await waitFor(() => screen.getByText("90")); // wait for grades to load

  fireEvent.click(screen.getByRole("button", { name: /create grade/i }));

  // Wait for modal heading to appear
  const modalHeading = await screen.findByRole("heading", { name: /create grade/i });
  expect(modalHeading).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  expect(screen.queryByRole("heading", { name: /create grade/i })).not.toBeInTheDocument();
});

test("creates a new grade through modal", async () => {
  renderWithStore(<GradesPage />);
  await waitFor(() => screen.getByText("90")); // wait for initial grades

  // open modal first
  fireEvent.click(screen.getByRole("button", { name: /create grade/i }));

  // wait for input to appear
  const studentInput = await screen.findByLabelText(/Student ID/i);
  const courseInput = await screen.findByLabelText(/Course ID/i);
  const assessmentInput = await screen.findByLabelText(/Assessment Type/i);
  const scoreInput = await screen.findByLabelText(/Score/i);

  // now fire events
  fireEvent.change(studentInput, { target: { value: "1" } });
  fireEvent.change(courseInput, { target: { value: "1" } });
  fireEvent.change(assessmentInput, { target: { value: "Assignment" } });
  fireEvent.change(scoreInput, { target: { value: "95" } });


  fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));

  // Wait for the new grade to appear in the table
  await waitFor(() => {
    expect(screen.getByText("95")).toBeInTheDocument();        // score
    expect(screen.getByText("Assignment")).toBeInTheDocument(); // subject
  });
});

