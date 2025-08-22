import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer, { type AuthState } from "../store/authSlice";
import Login from "../pages/Login";
import axios from "axios";
import { vi } from "vitest";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";


// 🔹 Mock axios globally
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Helper to render Login with store
function renderWithStore(ui: React.ReactElement, preloadedAuthState?: Partial<AuthState>) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        access: null,
        refresh: null,
        role: null,
        user_id: null,
        loading: false,
        error: null,
        ...preloadedAuthState,
      },
    },
  });
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
}

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form", () => {
  renderWithStore(<Login />);
  
  // heading
  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  
  // inputs
  expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  
  // submit button
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("failed login shows modal", async () => {
  // Mock API failure
  mockedAxios.post.mockRejectedValueOnce({
    response: {
      status: 401,
      data: { error: "Invalid username or password" },
    },
  });

  renderWithStore(<Login />);

  fireEvent.change(screen.getByPlaceholderText("Username"), {
    target: { value: "wrongUser" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "wrongPass" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  // Wait until modal appears
  expect(await screen.findByRole("heading", { name: /login failed/i }))
    .toBeInTheDocument();

  // ✅ Match what component actually shows
  expect(
    screen.getByText(/Login failed\. Please try again\./i)
  ).toBeInTheDocument();
});


  test("successful login with teacher11 credentials", async () => {
    // Mock API success
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        user: {
          access: "mockAccess",
          refresh: "mockRefresh",
          role: "teacher",
          id: 42,
        },
      },
    });

    renderWithStore(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "teacher11" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "StrongPassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait until welcome message appears
    await waitFor(() => {
      expect(screen.getByText(/Welcome, teacher/i)).toBeInTheDocument();
      expect(screen.getByText(/You are a teacher user!/i)).toBeInTheDocument();
    });
  });

  it("should change the theme and update background", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByTestId("theme-toggle");

    // Default theme should be light
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Click toggle
    fireEvent.click(button);

    // Now it should switch to dark
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
