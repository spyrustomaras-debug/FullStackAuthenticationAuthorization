import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  access: string | null;
  refresh: string | null;
  role: string | null;
  user_id: string | null;
  loading: boolean;
  error: string | null;
}

// Initialize state from localStorage if available
const initialState: AuthState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  role: localStorage.getItem("role"),
  user_id: localStorage.getItem("user_id"),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh, role, id: user_id } = response.data.user;

      // Save to localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id.toString());

      return { access, refresh, role, user_id: user_id.toString() };
    } catch (err: any) {
      console.error("Backend error response:", err.response?.data);

      // 🟢 Directly map backend error messages
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400 && data.error) {
          return thunkAPI.rejectWithValue(data.error); // "Username and password are required"
        }

        if (status === 401 && data.error) {
          return thunkAPI.rejectWithValue(data.error); // "Invalid username or password"
        }
      }

      // fallback if backend doesn’t send expected format
      return thunkAPI.rejectWithValue("Login failed. Please try again.");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.access = null;
      state.refresh = null;
      state.role = null;
      state.user_id = null;
      state.error = null;
      // Remove from localStorage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.role = action.payload.role;
      state.user_id = action.payload.user_id;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Unknown error occurred";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
