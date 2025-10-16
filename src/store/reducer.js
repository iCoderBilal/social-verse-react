import { combineReducers } from "redux";
import authReducer from "./auth";
import uiReducer from "./ui";
import catReducer from "./cat";
import adminReducer from "./admin";
import profileReducer from "./profile";


export default combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cat: catReducer,
  admin: adminReducer,
  profile: profileReducer
});
