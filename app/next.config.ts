import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@ffmpeg-installer/ffmpeg", "fluent-ffmpeg"],
};

export default nextConfig;
