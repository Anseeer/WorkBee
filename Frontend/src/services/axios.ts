import axios from 'axios';

console.log("AXIOS URL IN THE ENV :", import.meta.env.VITE_API_BASE_URL)

console.log("Axios file imported!");

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
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong!";

    console.error("Response Error:", message);

    switch (status) {
      case 400:
        console.error(message || "Bad request.");
        break;
      case 401:
        console.log("Session expired. Please log in again.");
        break;
      case 403:
        console.error("You are not authorized.");
        break;
      case 404:
        console.error("Resource not found.");
        break;
      case 500:
        console.error("Server error. Please try again later.");
        break;
      default:
        console.error(message);
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
