import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AmcatIndex } from "amcat4react";
import { RootState } from "../app/store";

const memory_size = 10;

function read_localstorage(): AmcatIndex[] {
  const x = localStorage.getItem("amcat4client_recentIndices");
  if (x == null) return [];
  return JSON.parse(x);
}
function write_localstorage(state: AmcatIndex[]) {
  localStorage.setItem("amcat4client_recentIndices", JSON.stringify(state));
}

export const recentIndicesSlice = createSlice({
  name: "recentIndices",
  initialState: read_localstorage(),
  reducers: {
    addIndexToHistory: (state, action: PayloadAction<AmcatIndex>) => {
      // Remove existing instances of this host+user+index, add current index, slice to size
      const val = action.payload;
      state = state.filter(
        (s) =>
          val.email !== s.email || val.host !== s.host || val.index !== s.index
      );
      state.unshift(val);
      state = state.slice(0, memory_size);
      write_localstorage(state);
      return state;
    },
  },
});

export const { addIndexToHistory } = recentIndicesSlice.actions;
export function selectIndexHistory(state: RootState): AmcatIndex[] {
  return state.recentIndices;
}
export function selectLastIndex(state: RootState): AmcatIndex {
  return state.recentIndices[0];
}
