/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Prisma to work correctly with Next.js bundling
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {},
};

export default nextConfig;
