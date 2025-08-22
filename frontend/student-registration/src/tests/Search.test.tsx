import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import searchReducer, { searchStudents, clearSearchResults } from "../store/searchSlice";
import coursesReducer from "../store/courseSlice";
import Home from "../pages/Home";
import axios from "axios";

// Mock axios completely
vi.mock("axios", async () => {
  const mock = {
    get: vi.fn(),
    post: vi.fn(),
    create: vi.fn(() => mock),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mock };
});

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  interceptors: { request: { use: any }; response: { use: any } };
};

// Mock auth reducer
const authReducer = (state = { access: "fake-token" }, action: any) => state;
const preloadedCoursesState = {
  courses: [
    {
      id: 1,
      name: "Math 101",
      students: [
        { id: 1, user: "John", enrollment_number: "1234" }, // match Student type
      ],
    },
  ],
  students: [],
  loading: false,
  error: null,
};


// Helper to create store
function createTestStore() {
  const store = configureStore({
    reducer: {
      search: searchReducer,
      courses: coursesReducer,
      auth: authReducer,
    },
    preloadedState: {
      search: { results: [], loading: false, error: null },
      courses: preloadedCoursesState,
      auth: { access: "fake-token" },
    },
  });

  return { store };
}

// Mock search results
const fakeStudents = [
  { id: 1, user: "John", enrollment_number: "1234" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

test("searchSlice > should have initial state", () => {
  const { store } = createTestStore();
  const state = store.getState().search;
  expect(state.results).toEqual([]);
  expect(state.loading).toBe(false);
  expect(state.error).toBeNull();
});

test("searchSlice > dispatches searchStudents and sets results", async () => {
  const { store } = createTestStore();

  mockedAxios.get.mockResolvedValue({ data: fakeStudents });

  // Dispatch async thunk; cast as any to bypass TS dispatch typing
  await store.dispatch(searchStudents("John") as any);

  const state = store.getState().search;
  expect(state.results).toEqual(fakeStudents);
  expect(state.loading).toBe(false);
  expect(state.error).toBeNull();
});

test("Home component > displays search results in the DOM", async () => {
  const { store } = createTestStore();

  // Mock API response
  mockedAxios.get.mockResolvedValue({ data: fakeStudents });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

  // Find the search input (make sure your input has data-testid="search-input")
  const input = screen.getByTestId("search-input");

  // Simulate typing into search
  fireEvent.change(input, { target: { value: "John" } });

  // Wait for the API response to be rendered in the DOM
  await waitFor(() => {
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent(/John/);
    expect(listItems[0]).toHaveTextContent(/1234/);
  });

});


