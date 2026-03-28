import { BACKEN_URL } from "@/utils/constants";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export type Status = "PENDING" | "WORKING" | "COMPLETED";

interface QueryParam {
  pagenumber?: number;
  size?: number;
  status?: Status;
}

export interface IComplaintResponse {
  id: number;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: Status;
  user_id: number;
  districtName: string;
  complaintDate: Date;
}

interface IComplaintStore {
  complaints: IComplaintResponse[] | null;
  query: QueryParam;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  selectedItem: number | null;
  selectedItemStatus: Status | null;
}

const initialState: IComplaintStore = {
  complaints: [],
  query: {
    pagenumber: 0,
    size: 5,
  },
  totalPages: 1,
  totalElements: 0,
  loading: false,
  error: null,
  selectedItem: null,
  selectedItemStatus: null,
};

export const getAllComplaints = createAsyncThunk(
  "complaints/getall",
  async (
    {
      pagenumber,
      size,
      status,
    }: { pagenumber: number; size: number; status?: string },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get("token");
      console.log("token", token);

      const query = new URLSearchParams({
        page: String(pagenumber),
        size: String(size),
        ...(status && status !== "All" ? { status } : {}),
      }).toString();

      console.log(query);

      const { data } = await axios.get(`${BACKEN_URL}/complaint?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      return data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const updateComplaint = createAsyncThunk(
  "complaint/update",
  async (
    { status, id }: { status: Status; id: number },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.put(
        `${BACKEN_URL}/admin/complaint/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.message);
    }
  },
);

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<Status | undefined>) => {
      state.query.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(getAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
