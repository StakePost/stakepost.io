import { combineReducers } from "redux";

import postsReducer from "./posts";
import alertReducer from "./alert";
import authReducer from "./auth";
import ethReducer from "./eth";
import postReducer from "./post";

const rootReducer = combineReducers({
  posts: postsReducer,
  alert: alertReducer,
  auth: authReducer,
  eth: ethReducer,
  post: postReducer,
});

export default rootReducer;
