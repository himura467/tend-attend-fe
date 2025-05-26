import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    API_GATEWAY_API_KEY: process.env.API_GATEWAY_API_KEY,
  },
};

export default nextConfig;
