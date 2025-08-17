import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

// Type for Course
interface Course {
  id: number;
  name: string;
  students: { id: number; user: string }[];
}

// Slice state
interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
};

// Async thunk to fetch courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/courses/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch courses");
    }
  }
);

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCoursesLoading = (state: RootState) => state.courses.loading;
export const selectCoursesError = (state: RootState) => state.courses.error;

export default coursesSlice.reducer;
