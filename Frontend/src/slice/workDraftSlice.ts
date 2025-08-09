import { createSlice } from "@reduxjs/toolkit";

interface workDraf {
    userId: string,
    workerId: string,
    serviceId: string,
    categoryId: string,
    wage: string,
    location: {
        address: string,
        pincode: string,
        lat: number,
        lng: number
    },
    workType: string,
    size: string,
    description: string,
    sheduleDate: string,
    sheduleTime: string,
}

const initialState: workDraf = {
    userId: "",
    workerId: "",
    serviceId: "",
    categoryId: "",
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

const workDraft = createSlice({
    name: "workDraft",
    initialState,
    reducers: {
        workDetails: (state, action) => {
            console.log("Action :",action);
            state.location = action.payload.location;
            state.workType = action.payload.workType;
            state.size = action.payload.taskSize;
            state.description = action.payload.description;
            state.categoryId = action.payload.categoryId;
            state.serviceId = action.payload.serviceId;
            return;
        },
        workerDetails: (state, action) => {
            console.log(action.payload);
        },
        confirmWorkDetails: (state, action) => {
            console.log(action.payload);
        }
    },
});
export const { workDetails, workerDetails, confirmWorkDetails } = workDraft.actions;
export default workDraft.reducer;