import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";
import type { RootState } from "../store";

// Types
interface Student { id: number; user: string; }
interface Course { id: number; name: string; students: Student[]; }
interface NewCourse { name: string; description: string; credits: number; student_ids: number[]; }

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

// Fetch courses
export const fetchCourses = createAsyncThunk<Course[], void, { state: RootState }>(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("courses/");
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Failed to fetch courses";
      return rejectWithValue(message);
    }
  }
);

// Fetch students
export const fetchStudents = createAsyncThunk<Student[], void, { state: RootState }>(
  "courses/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("students/");
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Failed to fetch students";
      return rejectWithValue(message);
    }
  }
);

// Create course
export const createCourse = createAsyncThunk<Course, NewCourse, { state: RootState }>(
  "courses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post("courses/", courseData);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Failed to create course";
      return rejectWithValue(message);
    }
  }
);

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch students
      .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create course
      .addCase(createCourse.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCoursesLoading = (state: RootState) => state.courses.loading;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectStudents = (state: RootState) => state.courses.students;

export const { clearError } = coursesSlice.actions;

export default coursesSlice.reducer;
