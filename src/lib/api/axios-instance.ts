import { SHA256_HEADER, getPayloadHash } from "@/lib/utils/aws-sig-v4";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add x-amz-content-sha256 header for POST and PUT requests
axiosInstance.interceptors.request.use(async (config) => {
  if (["POST", "PUT"].includes(config.method?.toUpperCase() || "") && config.data !== undefined) {
    const bodyString = typeof config.data === "string" ? config.data : JSON.stringify(config.data);
    config.headers[SHA256_HEADER] = await getPayloadHash(bodyString);
  }
  return config;
});

export default axiosInstance;
