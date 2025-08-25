/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "../services/axios"
import { fetchUserDataThunk } from "../slice/userSlice";
import { fetchWorkerDataThunk } from "../slice/workerSlice";

export const fetchData = async (dispatch: any) => {
    try {
        const { data } = await axios.get("/auth/verify", { withCredentials: true });
        console.log(data)
        const role = data.role;

        if (role == "User" || role == "Admin") {
            dispatch(fetchUserDataThunk());
        }

        if (role == "Worker") {
            dispatch(fetchWorkerDataThunk())
        }

    } catch (error) {
        console.log(error);
    }
}