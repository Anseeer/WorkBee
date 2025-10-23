/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "../services/axios"
import { fetchUserDataThunk } from "../slice/userSlice";

export const fetchData = async (dispatch: any) => {
    try {
        const { data } = await axios.get("/auth/verify", { withCredentials: true });
        console.log(data)
        const role = data.role;

        if (role == "User") {
            dispatch(fetchUserDataThunk());
        }

    } catch (error) {
        console.log(error);
    }
}