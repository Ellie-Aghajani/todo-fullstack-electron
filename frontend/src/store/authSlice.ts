import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  uid: string | null;
  email: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  uid: null,
  email: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null }>,
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
