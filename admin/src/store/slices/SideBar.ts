import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Option =
  | "Dashboard"
  | "Complaints"
  | "District Admins"
  | "Districts"
  | "Reports"
  | "Settings";

interface SidebarState {
  selectedOption: Option;
}

const initialState: SidebarState = {
  selectedOption: "Dashboard",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSelectedOption: (state, action: PayloadAction<Option>) => {
      state.selectedOption = action.payload;
    },
  },
});

export const { setSelectedOption } = sidebarSlice.actions;
export type { Option };
export default sidebarSlice.reducer;
