import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

// Define a type for the grade
export interface Grade {
  id?: number;
  student: number; // or string if your API expects student ID as string
  course?: number; // optional, depending on API
  assessment_type?: string; // optional
  subject?: string;
  score: number;
}

// Async thunk to fetch grades
export const fetchGrades = createAsyncThunk(
  "grades/fetchGrades",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.access;
    const response = await axios.get("http://localhost:8000/api/grades/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// Async thunk to add/create a grade
export const addGrade = createAsyncThunk<
  Grade,
  Grade,
  { state: RootState }
>("grades/addGrade", async (gradeData, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const token = state.auth.access;
  try {
    const response = await axios.post(
      "http://localhost:8000/api/grades/",
      gradeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});

interface GradesState {
  grades: Grade[];
  loading: boolean;
  error: string | null;
}

const initialState: GradesState = {
  grades: [],
  loading: false,
  error: null,
};

export const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGrades
      .addCase(fetchGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrades.fulfilled, (state, action: PayloadAction<Grade[]>) => {
        state.loading = false;
        state.grades = action.payload;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch grades";
      })
      // addGrade
      .addCase(addGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGrade.fulfilled, (state, action: PayloadAction<Grade>) => {
        state.loading = false;
        state.grades.push(action.payload); // add the new grade to state
      })
      .addCase(addGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = JSON.stringify(action.payload) || "Failed to add grade";
      });
  },
});

export const selectGrades = (state: RootState) => state.grades;

export default gradesSlice.reducer;
