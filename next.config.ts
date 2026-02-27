import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb', // Устанавливаем лимит 10 МБ (хватит для любой презы)
    },
  },
};

export default nextConfig;