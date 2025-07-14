import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IWorker } from "../types/IWorker";
import { register } from "../services/workerService";
import type { AxiosError } from "axios";


interface userState {
    worker: Partial<IWorker> | null,
    error: string | null;
    token: string | null;
}

const initialState: userState = {
    worker: null,
    error: null,
    token: null
}

export const registerWorkerThunk = createAsyncThunk("workers/register",
    async (workerData: Partial<IWorker>, { rejectWithValue }) => {
        try {
            const response = await register(workerData);
            console.log("Response :", response);
            return response.data.data;
        } catch (error: unknown) {
            const err = error as AxiosError<{ data: string }>;
            const errMsg = err.response?.data.data;
            rejectWithValue(errMsg)
        }
    }
)


const workerSlice = createSlice({
    name: "worker",
    initialState,
    reducers: {

    },
    extraReducers:(build)=>{
        build
        .addCase(registerWorkerThunk.pending,(state)=>{
            state.error = null;
        })
        .addCase(registerWorkerThunk.fulfilled,(state,action)=>{
            console.log(action.payload)
            // state.error = null;
            // state.worker = action.payload.worker;
            // state.token = action.payload.token
        })
        .addCase(registerWorkerThunk.rejected,(state,action)=>{
            state.error = action.payload as string
        })
    }
})

export default workerSlice.reducer;