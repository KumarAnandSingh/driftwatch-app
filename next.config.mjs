/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
