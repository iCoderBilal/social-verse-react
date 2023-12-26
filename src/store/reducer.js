import { combineReducers } from "redux";
import authReducer from "./auth";
import uiReducer from "./ui";
import catReducer from "./cat";

export default combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cat: catReducer,
});
