/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_GATEWAY_API_KEY: process.env.API_GATEWAY_API_KEY,
  },
};

export default nextConfig;
