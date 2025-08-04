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

export const fetchWorkersNonVerified = async () => {
    const response = await axios.get('admins/workers-nonVerify');
    return response;
}

export const fetchCategory = async () => {
    const response = await axios.get('categories/categories');
    return response;
}

export const fetchService = async () => {
    const response = await axios.get('services/getAll-services');
    return response;
}

export const fetchAvailability = async (id: string | null) => {
    if (!id) {
        throw new Error("Worker Id Not Get")
    }
    const response = await axios.get(`admins/fetch-availability?workerId=${id}`);
    return response;
}

export const setIsActiveWorkers = async (id: string) => {
    const response = await axios.get(`admins/workers/set-status?id=${id}`);
    return response;
}

export const setIsActiveCategory = async (id: string) => {
    const response = await axios.get(`categories/set-active?categoryId=${id}`);
    return response;
}

export const addCategory = async (category: { name: string; description: string; imageUrl?: string }) => {
    return await axios.post('categories/create-category', category);
};

export const updateCategory = async (id: string, category: { name: string; description: string; imageUrl?: string }) => {
    return await axios.post(`categories/update?categoryId=${id}`, category);
};


export const deleteCategory = async (id: string) => {
    const response = await axios.delete(`categories/delete?categoryId=${id}`);
    return response;
}

export const setIsActiveService = async (id: string) => {
    const response = await axios.get(`services/set-active?serviceId=${id}`);
    return response;
}

export const addService = async (service: { name: string, wage: string, category: string }) => {
    const response = await axios.post('services/create-service', service);
    return response;
}

export const deleteService = async (id: string) => {
    const response = await axios.delete(`services/delete?serviceId=${id}`);
    return response;
}


export const updateService = async (id: string, service: { name: string, wage: string, category: string }) => {
    const response = await axios.post(`services/update?serviceId=${id}`, service);
    return response;
}

export const approveWorker = async (id: string) => {
    const response = await axios.get(`admins/approve-worker?workerId=${id}`);
    return response;
}

export const rejectedWorker = async (id: string) => {
    const response = await axios.get(`admins/reject-worker?workerId=${id}`);
    return response;
}


