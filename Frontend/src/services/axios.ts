import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use((config) => {
  console.log("Sending Request To The URL:", config.request)
  return config;
},
  (error) => {
    console.log("Error in Request :", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use((response) => {
  console.log("Response From :", response.config.url);
  return response;
},
  (error) => {
    console.log("Error in Response :", error.response);
    return Promise.reject(error);
  }
)

export default axiosInstance;
