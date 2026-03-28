import type { ApiResponse } from "@/types/Api";
import type { UserResponseDto } from "@/types/User";
import { BACKEN_URL } from "@/utils/constants";
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

interface AdminSlice {
  admins: UserResponseDto[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  loading: boolean;
  deleteLoading: number | null;
  error: string | null;
}

const initialState: AdminSlice = {
  admins: [],
  totalPages: 1,
  totalElements: 0,
  currentPage: 0,
  loading: false,
  deleteLoading: null,
  error: null,
};
export const getAdmins = createAsyncThunk(
  "admin/alladmins",
  async (
    { pagenumber, counts }: { pagenumber: number; counts: number },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get<
        ApiResponse<PageResponse<UserResponseDto>>
      >(
        `${BACKEN_URL}/admin/super-admin/admins?page=${pagenumber}&size=${counts}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admins",
      );
    }
  },
);

export const deleteAdmins = createAsyncThunk(
  "admin/delete",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      await axios.delete(`${BACKEN_URL}/admin/delete/district-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete admin",
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState as AdminSlice,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAdmins.fulfilled,
        (state: AdminSlice, action:any) => {
          state.loading = false;
          state.admins = action.payload;
          state.currentPage = action.meta.arg.pagenumber;
        },
      )
      .addCase(getAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdmins.pending, (state, action) => {
        state.deleteLoading = action.meta.arg.id; 
      })
      .addCase(deleteAdmins.fulfilled, (state, action) => {
        state.deleteLoading = null;
        state.admins = state.admins.filter(
          (admin) => admin.id !== action.payload,
        );
      })
      .addCase(deleteAdmins.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;
