import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface AuthState {
  access: string | null;
  refresh: string | null;
  role: string | null;
  user_id: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  access: null,
  refresh: null,
  role: null,
  user_id: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { username: string; password: string }, thunkAPI) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login/", credentials, {
          headers: { "Content-Type": "application/json" },
        });
  
        const { access, refresh, role, id: user_id } = response.data.user;
  
        return {
          access,
          refresh,
          role,
          user_id: user_id.toString(),
        };
      } catch (err: any) {
        console.error("Backend error response:", err.response?.data);
        return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
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
      state.error = JSON.stringify(action.payload);
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
