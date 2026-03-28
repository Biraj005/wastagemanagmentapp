import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BACKEN_URL } from "@/utils/constants";
import type { UserResponseDto } from "@/types/User";
import axios from "axios";
import Cookies from "js-cookie";
import type { ApiResponse } from "@/types/Api";
import type { StatsResponseDto } from "@/types/Stats";
type Role = "ADMIN" | "DISTRIC_ADMIN";

type NavItem = {
  label: string;
};

const allNavItems = [
  {  label: "Dashboard" },
  { label: "Complaints" },
  {label: "District Admins" },
];
export interface IAuthState {
  role: Role | null;
  user: UserResponseDto | null;
  stats: StatsResponseDto | null;
  loading: boolean;
  error: any;
  statsloading: boolean;
  statsError: any;
  navItems: NavItem[];
}
const initialState: IAuthState = {
  role: null,
  user: null,
  loading: false,
  error: null,
  stats: null,
  statsloading: false,
  statsError: null,
  navItems: [
    { label: "Dashboard" },
    { label: "Complaints" },
    { label: "District Admins" },
  ],
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get<ApiResponse<UserResponseDto>>(
        `${BACKEN_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      return data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const getStats = createAsyncThunk(
  "auth/states",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      console.log("token", token);
      const { data } = await axios.get<ApiResponse<StatsResponseDto>>(
        `${BACKEN_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch stats",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.error = null;
      Cookies.remove("token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role as Role;
        const role = action.payload.role as Role;

        state.navItems =
          role === "DISTRIC_ADMIN"
            ? allNavItems.filter((item) => item.label !== "District Admins")
            : allNavItems;
            console.log(state.navItems)
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(getStats.pending, (state) => {
        state.statsloading = true;
        state.statsError = null;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.statsloading = false;
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.statsloading = false;
        state.statsError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
