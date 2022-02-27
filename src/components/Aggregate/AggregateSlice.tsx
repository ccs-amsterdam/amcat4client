import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AggregationOptions } from "amcat4react";
import { RootState } from "../app/store";

const initialState: AggregationOptions = {
  display: "linechart",
  axes: [{ field: "date", interval: "week" }],
};

export const aggregateSlice = createSlice({
  name: "aggregate",
  initialState: initialState,
  reducers: {
    setAggregationOptions: (
      _state,
      action: PayloadAction<AggregationOptions>
    ) => {
      return action.payload;
    },
  },
});

export const selectOptions = (state: RootState): AggregationOptions => {
  return state.aggregate;
};

export const { setAggregationOptions } = aggregateSlice.actions;
