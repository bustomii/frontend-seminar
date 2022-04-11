import { createStore } from "redux";
import accessReducer from "./reducers/accessReducer";

function configureStore(state = { access: false }) {
  return createStore(accessReducer,state);
}

export default configureStore;