import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: []
  },
  outputFileTracingRoot: path.resolve(__dirname)
};

export default nextConfig;
