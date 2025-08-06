import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Sending Request To URL:", config.url);
    return config;
  },
  (error) => {
    console.log("Error in Request:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error in Response:", error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
