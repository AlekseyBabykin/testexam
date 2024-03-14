// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Создаем действие для сохранения токена
export const setToken = createSlice({
  name: "auth/setToken",
  initialState: null,
  reducers: {
    setToken(state, action) {
      return action.payload;
    },
  },
});

export const fetchSignUp = createAsyncThunk(
  "api/fetchSignUp",
  async ({ email, password }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/user/signup`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      return jwtDecode(token);
    } catch (error) {
      throw error;
    }
  }
);

export const fetchSignIn = createAsyncThunk(
  "api/fetchSignIn",
  async ({ email, password }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/user/signin`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      return jwtDecode(token);
    } catch (error) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    token: null, // Добавляем поле для хранения токена
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSignUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSignUp.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.token = action.payload.token; // Сохраняем токен в состоянии
    });
    builder.addCase(fetchSignUp.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
    builder.addCase(fetchSignIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSignIn.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.token = action.payload.token; // Сохраняем токен в состоянии
    });
    builder.addCase(fetchSignIn.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectLoading = (state) => state.auth.loading;

export default authSlice.reducer;
