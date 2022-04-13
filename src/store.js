import { createStore } from "redux";
import accessReducer from "./reducers/accessReducer";

function configureStore(state = {access: false, user : { id:null, display_name:null } }) {
  return createStore(accessReducer, state);
}

export default configureStore;