import axios from "./axios";

export const login = async (credentials: { email: string, password: string }) => {
    const response = await axios.post("admins/login", credentials, { withCredentials: true });
    return response;
}

export const logoutAdmin = async () => {
    await axios.post('/admins/logout', {}, { withCredentials: true });
};

export const fetchUsers = async () => {
    const response = await axios.get('admins/users');
    return response;
}

export const setIsActiveUsers = async (id: string) => {
    const response = await axios.get(`admins/users/set-status?id=${id}`);
    return response;
}
export const fetchWorkers = async () => {
    const response = await axios.get('admins/workers');
    return response;
}

export const setIsActiveWorkers = async (id: string) => {
    const response = await axios.get(`admins/workers/set-status?id=${id}`);
    return response;
}