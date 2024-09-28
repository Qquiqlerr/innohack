import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";

// Configure and type the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
