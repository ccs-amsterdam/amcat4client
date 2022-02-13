import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Amcat, AmcatUser } from "amcat4react";
import { AmcatIndex } from "amcat4react";

const initialState: Partial<AmcatIndex> = {};

export const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    logout: (state, action: PayloadAction) => {
      console.log("Logging out...");
      state.host = undefined;
      state.email = undefined;
      state.token = undefined;
    },
    setLogin: (state, action: PayloadAction<AmcatUser>) => {
      state.host = action.payload.host;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.index = undefined;
    },
    setIndex: (state, action: PayloadAction<AmcatIndex>) => {
      state.host = action.payload.host;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.index = action.payload.index;
    },
    setIndexName: (state, action: PayloadAction<string>) => {
      state.index = action.payload;
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
