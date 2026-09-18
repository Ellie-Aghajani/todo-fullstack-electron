import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Filter = "all" | "active" | "completed";
export type Theme = "light" | "dark";

const AFFIRMATION_KEY = "todo-app-affirmation";

function loadAffirmation(): string {
  return localStorage.getItem(AFFIRMATION_KEY) ?? "Progress, not perfection.";
}

interface UiState {
  filter: Filter;
  theme: Theme;
  affirmation: string;
  selectedCategoryId: number | null;
  isSidebarOpen: boolean;
}

const initialState: UiState = {
  filter: "all",
  theme: "light",
  affirmation: loadAffirmation(),
  selectedCategoryId: null,
  isSidebarOpen: false,
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
    setAffirmation: (state, action: PayloadAction<string>) => {
      state.affirmation = action.payload;
      localStorage.setItem(AFFIRMATION_KEY, action.payload);
    },
    setSelectedCategoryId: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

export const {
  setFilter,
  toggleTheme,
  setAffirmation,
  setSelectedCategoryId,
  toggleSidebar,
  closeSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;