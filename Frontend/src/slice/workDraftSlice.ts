import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IWork } from "../types/IWork";
import type { AxiosError } from "axios";
import { DraftWork } from "../services/userService";
import { API_ROUTES } from "../constant/api.routes";


export const initialState: IWork = {
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
    platformFee: "",
    commission: "",
    totalAmount: "",
    workType: "",
    size: "",
    description: "",
    sheduleDate: "",
    sheduleTime: "",
}

export const WorkDraftThunk = createAsyncThunk(
    API_ROUTES.USER.DRAFT_WORK,
    async (WorkDetails: IWork, { rejectWithValue }) => {
        try {
            const response = await DraftWork(WorkDetails);
            console.log("workDetails from the state :", WorkDetails);
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
            state.location = action.payload.location;
            state.workType = action.payload.workType;
            state.size = action.payload.taskSize;
            state.description = action.payload.description;
            state.categoryId = action.payload.categoryId;
            state.serviceId = action.payload.serviceId;
            state.wage = action.payload.wage;
            state.totalAmount = action.payload.totalAmount;
            state.service = action.payload.service;
            state.category = action.payload.category;
            console.log("WorkState :", state);
            return;
        },
        workerDetails: (state, action) => {
            state.workerId = action.payload.workerId;
            state.sheduleDate = action.payload.date;
            state.sheduleTime = action.payload.slot;
            state.workerName = action.payload.workerName;
            state.userName = action.payload.userName;
            state.totalAmount = action.payload.totalAmount;
            state.platformFee = action.payload.PlatformFee;
            state.commission = action.payload.commission;
            console.log("WorkState :", state);
            return;
        }
    }
});
export const { workDetails, workerDetails } = workDraft.actions;
export default workDraft.reducer;