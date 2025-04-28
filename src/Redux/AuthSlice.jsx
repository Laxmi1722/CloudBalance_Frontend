
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  email: null,
  role: null,
  name: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, email, role, name } = action.payload;
      state.token = token;
      state.email = email;
      state.role = role;
      state.name = name;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.role = null;
      state.name = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
