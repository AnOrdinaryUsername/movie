/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    /*
      If the environment variable NODE_ENV is unassigned, Next.js 
      automatically assigns development when running the next dev command,
      or production for all other commands (so no need to set it).
    */
    backendUrl: process.env.BACKEND_URL,
  },
};

export default nextConfig;