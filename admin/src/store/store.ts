import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/SideBar";
import statsReucers from './slices/stats'
import authReducres from './slices/auth'
import complaintReducers from './slices/complatint'
import adminReducers from './slices/admin'
import statsReducers from './slices/stats'
export const store = configureStore({
  reducer: {
    sidebar:sidebarReducer,
    states:statsReucers,
    auth:authReducres,
    complaint:complaintReducers,
    admin:adminReducers,
    stats:statsReducers
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type ApiDispatch = typeof store.dispatch;
