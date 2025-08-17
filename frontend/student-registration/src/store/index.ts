import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import authReducer from "./authSlice";
import coursesReducer from "./courseSlice";
import studentsReducer from "./studentSlice";



export const store = configureStore({
  reducer: {
    register: registerReducer,
    auth: authReducer,
    courses: coursesReducer,
    students: studentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
