import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthService";
import axios from "axios";
import { API_URL } from "../../http";

export const fetchSignUp = createAsyncThunk(
  "api/fetchSignUp",
  async ({ email, password }) => {
    try {
      const response = await AuthService.signup(email, password);
      localStorage.setItem("token", response.data);
    } catch (error) {
      throw error;
    }
  }
);

export const fetchSignIn = createAsyncThunk(
  "api/fetchSignIn",
  async ({ email, password }) => {
    try {
      const response = await AuthService.signin(email, password);
      localStorage.setItem("token", response.data);
    } catch (error) {
      throw error;
    }
  }
);

export const UserLogout = createAsyncThunk("api/UserLogout", async () => {
  try {
    localStorage.removeItem("token");
    const response = await AuthService.logout();
  } catch (e) {
    console.log(e.response?.data?.message);
  }
});

export const UserChekAuth = createAsyncThunk("api/UserChekAuth ", async () => {
  try {
    const response = await axios.get(`${API_URL}/user/refresh`, {
      withCredentials: true,
    });
    console.log(response);
    localStorage.setItem("token", response.data);
  } catch (e) {
    console.log(e.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isAuth: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSignUp.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(fetchSignUp.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchSignIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSignIn.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(fetchSignIn.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(UserLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
      })
      .addCase(UserLogout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(UserChekAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserChekAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
      })
      .addCase(UserChekAuth.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
