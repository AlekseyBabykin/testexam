import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token");

const salesUserId = token ? jwtDecode(token).id : null;

const headers = token ? { Authorization: `Bearer ${token}` } : {};

export const fetchCompanyInfo = createAsyncThunk(
  "api/fetchCompanyInfo",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/company/info`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchCompanyCreate = createAsyncThunk(
  "api/fetchCompanyCreate",
  async ({ name, info }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/company/create`,
        { name, info },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUpdateCompany = createAsyncThunk(
  "api/fetchUpdateCompany",
  async ({ companyId, name, info }) => {
    console.log(companyId, name, info);
    try {
      const response = await axios.put(
        `${apiUrl}/api/company/update/${companyId}`,
        {
          name,
          info,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchDeleteCompany = createAsyncThunk(
  "api/fetchDeleteCompany",
  async (companyId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/company/delete/${companyId}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload.companies;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCompanyCreate.fulfilled, (state, action) => {
        state.companies.push(action.payload.company);
      })
      .addCase(fetchUpdateCompany.fulfilled, (state, action) => {
        const updatedCompany = action.payload.company;
        const existingCompanyIndex = state.companies.findIndex(
          (company) => company.id === updatedCompany.id
        );
        if (existingCompanyIndex !== -1) {
          state.companies[existingCompanyIndex] = updatedCompany;
        }
      })
      .addCase(fetchDeleteCompany.fulfilled, (state, action) => {
        const deletedCompanyId = action.payload?.company?.id;
        if (deletedCompanyId) {
          state.companies = state.companies.filter(
            (company) => company.id !== deletedCompanyId
          );
        }
      });
  },
});

export default companySlice.reducer;
