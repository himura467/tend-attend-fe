/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    API_GATEWAY_API_KEY: process.env.API_GATEWAY_API_KEY,
  },
};

export default nextConfig;
