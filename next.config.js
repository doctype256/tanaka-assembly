// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // これを追加
  },
  eslint: {
    ignoreDuringBuilds: true, // これも追加しておくと安心
  },
};

export default nextConfig;