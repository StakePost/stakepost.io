import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices/index";

export default configureStore({
  reducer: rootReducer,
});
