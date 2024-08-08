import { combineReducers } from "redux";
import authReducer from "./auth";
import uiReducer from "./ui";
import catReducer from "./cat";
import adminReducer from "./admin";


export default combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cat: catReducer,
  admin : adminReducer
});
