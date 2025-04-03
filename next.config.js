/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["yusupxdqvrkxrwpipdef.supabase.co"], // Supabase Storage 도메인
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
