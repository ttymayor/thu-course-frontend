import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
    reactCompiler: true,
  }
};

export default nextConfig;
