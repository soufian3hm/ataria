import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stray lockfiles exist in parent folders on this machine
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
