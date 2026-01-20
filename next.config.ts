import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* その他の設定 */

  experimental: {
    // 🟢 TypeScriptが「存在しない」と言う場合は、こちらの中に戻すのが正解です
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;