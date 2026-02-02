
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  email: string | null;
  token: string | null;
};

const initialState: AuthState = {
  email: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ email: string; token: string }>
    ) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.email = null;
      state.token = null;
    }
  }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;