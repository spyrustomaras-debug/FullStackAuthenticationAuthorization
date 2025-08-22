// import { fireEvent, render, screen } from "@testing-library/react";
// import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
// import coursesReducer from "../store/courseSlice";
// import searchReducer from "../store/searchSlice";

// import Home from "../pages/Home";
// import api from "../store/api";
// import { vi } from "vitest"; // 👈 import vi
// import axios from "axios";

// // 🔹 Mock the api module with Vitest
// vi.mock("../store/api");

// vi.mock("../store/searchSlice", async() => {
//   const actual = await vi.importActual("../store/searchSlice");
//   return {
//     ...actual,
//     searchStudents: vi.fn(() => ({type: "searchStudents/mock"})),
//   };
// });

// // Mock axios to avoid real network requests
// // At the top of your test file
// vi.mock("../store/api", () => ({
//   default: {
//     get: vi.fn(),
//     post: vi.fn(),
//     interceptors: { request: { use: vi.fn() } },
//   },
// }));
// const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

// const mockedApi = api as unknown as {
//   post: ReturnType<typeof vi.fn>;
//   get: ReturnType<typeof vi.fn>;
// };

// mockedAxios.get = vi.fn().mockResolvedValue({
//   data: [{ id: 1, user: "John", enrollment_number: "1234" }],
// });

// const mockCourses = [
//   { id: 1, name: "Math", students: [{ id: 1, user: "Alice" }] },
//   { id: 2, name: "Science", students: [] },
// ];

// const mockStudents = [
//   { id: 1, user: "Alice" },
//   { id: 2, user: "Bob" },
// ];

// function renderWithStore(ui: React.ReactElement) {
//   const store = configureStore({
//     reducer: { courses: coursesReducer, search:searchReducer },
//     preloadedState: {
//       courses: {
//         courses: mockCourses,
//         students: mockStudents,
//         loading: false,
//         error: null,
//       },
//       search: { results: [], loading: false, error: null },

//     },
//   });

//   return { ...render(<Provider store={store}>{ui}</Provider>), store };
// }


// beforeEach(() => {
//   let store: ReturnType<typeof configureStore>;

//   const rendered = renderWithStore(<Home />);
//   store = rendered.store;
// });




// test("renders courses list", () => {
//   expect(screen.getByText("Math")).toBeInTheDocument();
//   expect(screen.getByText("Science")).toBeInTheDocument();
//   expect(screen.getByText(/Alice/)).toBeInTheDocument();
// });

// test("opens and closes create course modal", () => {
//   expect(screen.queryByRole("heading", { name: /create course/i })).not.toBeInTheDocument();

//   fireEvent.click(screen.getByRole("button", { name: /create course/i }));

//   expect(screen.getByRole("heading", { name: /create course/i })).toBeInTheDocument();

//   fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

//   expect(screen.queryByRole("heading", { name: /create course/i })).not.toBeInTheDocument();
// });

// test("creates a new course through modal", async () => {
//   // mock API response
//   (mockedApi.post as any).mockResolvedValueOnce({
//     data: {
//       id: 3,
//       name: "History",
//       description: "World history course",
//       credits: 3,
//       students: [{ id: 2, user: "Bob" }],
//     },
//   });

//   fireEvent.click(screen.getByRole("button", { name: /create course/i }));

//   fireEvent.change(screen.getByPlaceholderText(/name/i), {
//     target: { value: "History" },
//   });
//   fireEvent.change(screen.getByPlaceholderText(/description/i), {
//     target: { value: "World history course" },
//   });
//   fireEvent.change(screen.getByPlaceholderText(/credits/i), {
//     target: { value: 3 },
//   });

//   fireEvent.change(screen.getByRole("listbox"), {
//     target: { value: "2" },
//   });

//   fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

//   expect(await screen.findByText("History")).toBeInTheDocument();
//   expect(await screen.findByText(/Bob/)).toBeInTheDocument();
// });
