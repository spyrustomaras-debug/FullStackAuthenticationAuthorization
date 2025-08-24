import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import authReducer from "./authSlice";
import coursesReducer from "./courseSlice";
import studentsReducer from "./studentSlice";
import gradesReducer from "./gradesSlice";
import searchReducer from "./searchSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
// Configure redux-persist
const studentsPersistConfig = {
  key: "students",
  storage,
  whitelist: ["students"], // only persist the students array
};

const gradesPersistConfig = {
  key: "grades",
  storage,
  whitelist: ["grades"], // only persist the grades array from the state
};


// Wrap the reducer
const persistedStudentsReducer = persistReducer(studentsPersistConfig, studentsReducer);
const persistedGradesReducer = persistReducer(gradesPersistConfig, gradesReducer);



export const store = configureStore({
  reducer: {
    register: registerReducer,
    auth: authReducer,
    courses: coursesReducer,
    students: persistedStudentsReducer,
    grades: persistedGradesReducer, // ✅ use persisted version
    search: searchReducer,
  },
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
