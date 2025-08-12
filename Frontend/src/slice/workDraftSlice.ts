import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IWork } from "../types/IWork";
import { DraftWork } from "../services/userService";
import type { AxiosError } from "axios";


const initialState: IWork = {
    userId: "",
    workerId: "",
    serviceId: "",
    categoryId: "",
    category: "",
    service: "",
    workerName: "",
    userName: "",
    wage: "",
    location: {
        address: "",
        pincode: "",
        lat: 0,
        lng: 0,
    },
    workType: "",
    size: "",
    description: "",
    sheduleDate: "",
    sheduleTime: "",
}

export const WorkDraftThunk = createAsyncThunk('works/create-work',
    async (WorkDetails: IWork, { rejectWithValue }) => {
        try {
            const response = await DraftWork(WorkDetails);
            return response;
        } catch (err) {
            const error = err as AxiosError<{ data: string }>;
            const errorMessage = error.response?.data?.data || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    }
)

const workDraft = createSlice({
    name: "workDraft",
    initialState,
    reducers: {
        workDetails: (state, action) => {
            console.log("Action :", action);
            state.location = action.payload.location;
            state.workType = action.payload.workType;
            state.size = action.payload.taskSize;
            state.description = action.payload.description;
            state.categoryId = action.payload.categoryId;
            state.serviceId = action.payload.serviceId;
            state.wage = action.payload.wage;
            state.service = action.payload.service;
            state.category = action.payload.category;
            return;
        },
        workerDetails: (state, action) => {
            console.log("Action WorkDetail :", action);
            state.workerId = action.payload.workerId;
            state.sheduleDate = action.payload.date;
            state.sheduleTime = action.payload.slot;
            state.workerName = action.payload.workerName;
            state.userName = action.payload.userName;
            return;
        }
    }
});
export const { workDetails, workerDetails } = workDraft.actions;
export default workDraft.reducer;