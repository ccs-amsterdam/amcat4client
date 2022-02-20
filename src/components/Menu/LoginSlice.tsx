import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Amcat, AmcatUser } from "amcat4react";
import { AmcatIndex } from "amcat4react";

const STORE_KEY = "amcat4client_login";

function read_localstorage(): Partial<AmcatIndex> {
  const x = localStorage.getItem(STORE_KEY);
  if (x == null) return {};
  const index = JSON.parse(x);
  return index;
}
function write_localstorage(index: Partial<AmcatIndex>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(index));
}
function remove_localstorage() {
  localStorage.removeItem(STORE_KEY);
}

export const loginSlice = createSlice({
  name: "login",
  initialState: read_localstorage(),
  reducers: {
    logout: (state, action: PayloadAction) => {
      console.log("Logging out...");
      state.host = undefined;
      state.email = undefined;
      state.token = undefined;
      remove_localstorage();
    },
    setLogin: (state, action: PayloadAction<AmcatUser>) => {
      state.host = action.payload.host;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.index = undefined;
      write_localstorage(state);
    },
    setIndex: (state, action: PayloadAction<AmcatIndex>) => {
      state.host = action.payload.host;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.index = action.payload.index;
      write_localstorage(state);
    },
    setIndexName: (state, action: PayloadAction<string>) => {
      state.index = action.payload;
      write_localstorage(state);
    },
  },
});

export const selectAmcatUser = (state: RootState): AmcatUser | undefined => {
  if (
    state.login.email != null &&
    state.login.token != null &&
    state.login.host != null
  )
    return state.login as AmcatUser;
  return undefined;
};
export const selectIndex = (state: RootState): AmcatIndex | undefined => {
  if (
    state.login.email != null &&
    state.login.token != null &&
    state.login.host != null &&
    state.login.index != null
  )
    return state.login as AmcatIndex;
  return undefined;
};

export const { setLogin, logout, setIndex, setIndexName } = loginSlice.actions;
export default loginSlice.reducer;
