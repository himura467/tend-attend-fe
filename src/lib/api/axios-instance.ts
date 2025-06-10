import { getPayloadHash, prepareBody, SHA256_HEADER } from "@/lib/utils/aws-sig-v4";
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
    const contentType = config.headers["Content-Type"] || config.headers["content-type"] || "";
    const bodyToHash = prepareBody(config.data, contentType);
    config.headers[SHA256_HEADER] = await getPayloadHash(bodyToHash);
  }
  return config;
});

export default axiosInstance;
