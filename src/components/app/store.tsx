import { configureStore } from "@reduxjs/toolkit";
import { aggregateSlice } from "../Aggregate/AggregateSlice";
import { loginSlice } from "../Menu/LoginSlice";
import { recentIndicesSlice } from "../Menu/RecentIndicesSlice";
import { querySlice } from "../Query/QuerySlice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    query: querySlice.reducer,
    recentIndices: recentIndicesSlice.reducer,
    aggregate: aggregateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
