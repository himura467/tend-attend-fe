import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const calcHash = async (body: string): Promise<string> => {
  const encoder = new TextEncoder().encode(body);
  const hash = await crypto.subtle.digest("SHA-256", encoder);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
};

// Request interceptor to add x-amz-content-sha256 header for POST and PUT requests
axiosInstance.interceptors.request.use(async (config) => {
  if (["POST", "PUT"].includes(config.method?.toUpperCase() || "") && config.data !== undefined) {
    const bodyString = typeof config.data === "string" ? config.data : JSON.stringify(config.data);
    config.headers["x-amz-content-sha256"] = await calcHash(bodyString);
  }
  return config;
});

export default axiosInstance;
