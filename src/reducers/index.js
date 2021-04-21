import { combineReducers } from "redux";

const amcat = (state = null, action) => {
  switch (action.type) {
    case "CREATE_AMCAT_SESSION":
      return action.payload;
    case "DELETE_AMCAT_SESSION":
      return null;
    default:
      return state;
  }
};

const amcatIndex = (state = null, action) => {
  switch (action.type) {
    case "SELECT_AMCAT_INDEX":
      return action.payload;
    default:
      return state;
  }
};

const amcatIndices = (state = null, action) => {
  switch (action.type) {
    case "SET_AMCAT_INDICES":
      return action.payload;
    default:
      return state;
  }
};

const documents = (state = [], action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return action.payload;
    default:
      return state;
  }
};

const document = (state = [], action) => {
  switch (action.type) {
    case "SELECT_DOCUMENTS":
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  amcat,
  amcatIndex,
  amcatIndices,
  document,
  documents,
});

export default rootReducer;
