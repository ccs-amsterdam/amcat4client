import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { AmcatQuery } from "amcat4react";

const initialState: AmcatQuery = {};

export const querySlice = createSlice({
  name: "query",
  initialState: initialState,
  reducers: {
    setQuery: (_state, action: PayloadAction<AmcatQuery>) => {
      return action.payload;
    },
  },
});

export const selectQuery = (state: RootState): AmcatQuery => {
  return state.query;
};

export const { setQuery } = querySlice.actions;
