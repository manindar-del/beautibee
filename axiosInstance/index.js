import axios from "axios";
import { baseURL } from "@/api/Endpoints/apiEndPoints";
import { Cookies } from "react-cookie";
const cookie = new Cookies();

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = cookie.get("token");
    if (token !== null && token !== undefined) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosInstance;
