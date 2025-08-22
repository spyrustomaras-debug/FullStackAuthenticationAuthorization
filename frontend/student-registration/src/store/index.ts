import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import authReducer from "./authSlice";
import coursesReducer from "./courseSlice";
import studentsReducer from "./studentSlice";
import gradesReducer from "./gradesSlice";
import searchReducer from "./searchSlice";


export const store = configureStore({
  reducer: {
    register: registerReducer,
    auth: authReducer,
    courses: coursesReducer,
    students: studentsReducer,
    grades: gradesReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
