import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AmcatUser } from "amcat4react";
import { addUserToHistory } from "../../lib/login";
import { RootState } from "../app/store";

export const loginSlice = createSlice({
  name: "login",
  initialState: {} as Partial<AmcatUser>,
  reducers: {
    logout: (state, action: PayloadAction) => {
      state.host = undefined;
      state.email = undefined;
      state.token = undefined;
    },
    setLogin: (state, action: PayloadAction<AmcatUser>) => {
      state.host = action.payload.host;
      state.email = action.payload.email;
      state.token = action.payload.token;
      addUserToHistory(action.payload);
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

export const { setLogin, logout } = loginSlice.actions;
export default loginSlice.reducer;
