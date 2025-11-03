/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "../services/axios"
import { fetchUserDataThunk } from "../slice/userSlice";

export const fetchData = async (dispatch: any) => {
    try {
        const { data } = await axios.get("/auth/verify", { withCredentials: true });
        console.log("Verified user:", data);

        if (data.role === "User") {
            dispatch(fetchUserDataThunk());
        }
    } catch (error: any) {
        if (error.response?.status === 400) {
            console.log("No valid session — user not logged in yet.");
        } else {
            console.error("Error verifying user:", error);
        }
    }
};
