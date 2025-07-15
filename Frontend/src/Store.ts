import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import workerReducer from "./slice/workerSlice";
import adminReducer from "./slice/adminSlice";


const Store = configureStore({
    reducer: {
        user: userReducer,
        worker: workerReducer,
        admin: adminReducer
    },
});



export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;