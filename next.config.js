/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopackを有効にしつつ、エラーを解消する設定
  experimental: {
    turbopack: {}
  }
};

export default nextConfig;