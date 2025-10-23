import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./slice/userSlice";
import userReducer from "./slice/userSlice"
import workerReducer from "./slice/workerSlice";
import adminReducer from "./slice/adminSlice";
import workDraft from "./slice/workDraftSlice";

const Store = configureStore({
    reducer: {
        user: userReducer,
        worker: workerReducer,
        admin: adminReducer,
        work: workDraft,
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;