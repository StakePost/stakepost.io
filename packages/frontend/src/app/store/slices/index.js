import { combineReducers } from "redux";

import postsReducer from "./posts";
import alertReducer from "./alert";
import authReducer from "./auth";
import ethReducer from "./eth";

const rootReducer = combineReducers({
  posts: postsReducer,
  alert: alertReducer,
  auth: authReducer,
  eth: ethReducer,
});

export default rootReducer;
