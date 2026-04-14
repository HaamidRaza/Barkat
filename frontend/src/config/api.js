import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true, // sends cookies on every request automatically
});

export default axiosInstance;