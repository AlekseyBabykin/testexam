import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token");

const salesUserId = token ? jwtDecode(token).id : null;

const headers = token ? { Authorization: `Bearer ${token}` } : {};

export const fetchMeetingsInfo = createAsyncThunk(
  "api/fetchMeetingsInfo",
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/meeting/info`, {
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

export const fetchMeetingCreate = createAsyncThunk(
  "api/fetchMeetingCreate",
  async ({
    details,
    date,
    location,
    business_name,
    summary,
    companyBusinessId,
  }) => {
    const token = localStorage.getItem("token");
    const salesUserId = token ? jwtDecode(token).id : null;
    try {
      const response = await axios.post(
        `${apiUrl}/api/meeting/create`,
        {
          details,
          date,
          location,
          business_name,
          summary,
          companyBusinessId,
          salesUserId,
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

export const fetchUpdateMeeting = createAsyncThunk(
  "api/fetchUpdateMeeting",
  async ({ meetingId, details, date, location, summary }) => {
    const token = localStorage.getItem("token");
    const salesUserId = token ? jwtDecode(token).id : null;
    try {
      const response = await axios.put(
        `${apiUrl}/api/meeting/update/${meetingId}`,
        {
          details,
          date,
          location,
          summary,
          salesUserId,
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

export const fetchDeleteMeeting = createAsyncThunk(
  "api/fetchDeleteMeeting",
  async (meetingId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/meeting/delete/${meetingId}`,
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

const meetingsSlice = createSlice({
  name: "meeting",
  initialState: {
    meetings: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetingsInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMeetingsInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meetings = action.payload.meetings;
      })
      .addCase(fetchMeetingsInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMeetingCreate.fulfilled, (state, action) => {
        state.meetings.push(action.payload.meeting);
      })
      .addCase(fetchUpdateMeeting.fulfilled, (state, action) => {
        const updatedMeeting = action.payload.meeting;
        const existingMeetingIndex = state.meetings.findIndex(
          (meeting) => meeting.id === updatedMeeting.id
        );
        if (existingMeetingIndex !== -1) {
          state.meetings[existingMeetingIndex] = updatedMeeting;
        }
      })
      .addCase(fetchDeleteMeeting.fulfilled, (state, action) => {
        const deletedMeetingId = action.payload.meeting.id;
        state.meetings = state.meetings.filter(
          (meeting) => meeting.id !== deletedMeetingId
        );
      });
  },
});

export default meetingsSlice.reducer;
