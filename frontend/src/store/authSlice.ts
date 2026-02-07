import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  email: string | null;
  token: string | null;
  role: string | null;
};

const initialState: AuthState = {
  email: null,
  token: null,
  role: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ email: string; token: string; role: string }>
    ) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearAuth: (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
    }
  }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
