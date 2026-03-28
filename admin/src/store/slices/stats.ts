import { createSlice } from "@reduxjs/toolkit";

export interface IStats {
  total: number;
  pending: number;
  resolved: number;
}

const initialState: IStats = {
  total: 120,
  pending: 45,
  resolved: 75,
};


const statsSlice = createSlice({
    name:'stats',
    initialState,
    reducers:{

    }
})


export  default statsSlice.reducer;