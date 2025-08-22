import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from ".";

// Async thunk for searching students
// Async thunk for searching students with auth and error handling
export const searchStudents = createAsyncThunk<
  any[], // type of returned data (array of students)
  string, // argument type (search query)
  { state: RootState; rejectValue: string } // thunk API config
>(
  "students/search",
  async (query, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.access;

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search/?q=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ensure an array is returned
      if (!Array.isArray(response.data)) {
        return rejectWithValue("Invalid data format received from server");
      }

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to search students");
    }
  }
);

// State interface
interface SearchState {
  results: any[];        // array of students
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SearchState = {
  results: [],
  loading: false,
  error: null,
};

// Slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.results = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search students";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;

export const selectSearchResults = (state: any) => state.search.results;
export const selectSearchLoading = (state: any) => state.search.loading;
export const selectSearchError = (state: any) => state.search.error;

export default searchSlice.reducer;
