import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Filter = "all" | "active" | "completed";
export type Theme = "light" | "dark";

interface UiState {
  filter: Filter;
  theme: Theme;
}

const initialState: UiState = {
  filter: "all",
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { setFilter, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;