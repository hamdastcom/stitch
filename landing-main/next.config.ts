import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/models/gpt-luna",
        destination: "/tools/models/gpt-luna",
        permanent: true,
      },
      {
        source: "/ai-models/claude-fable-5",
        destination: "/tools/models/claude-fable-5",
        permanent: true,
      },
      {
        source: "/ai-models/kimi-k3",
        destination: "/tools/models/kimi-k3",
        permanent: true,
      },
      {
        source: "/ai-models",
        destination: "/products#models",
        permanent: true,
      },
      {
        source: "/tools/models",
        destination: "/products#models",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
