import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

// Types
interface Student {
  id: number;
  user: string;
}

interface Course {
  id: number;
  name: string;
  students: Student[];
}

interface CoursesState {
  courses: Course[];
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  students: [],
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch courses");
    }
  }
);

// Async thunk to fetch students
export const fetchStudents = createAsyncThunk(
  "courses/fetchStudents",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/students/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch students");
    }
  }
);

// Async thunk to create a course
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (
    courseData: { name: string; description: string; credits: number; student_ids: number[] },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/courses/",
        courseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create course");
    }
  }
);

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch courses
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
      })
      // Fetch students
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCoursesLoading = (state: RootState) => state.courses.loading;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectStudents = (state: RootState) => state.courses.students;

export default coursesSlice.reducer;
