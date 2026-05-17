import type { NextConfig } from "next";

const RAW = "https://raw.githubusercontent.com/capframe/capframe/main";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Install script shortcuts — `curl capframe.ai/install | sh`
      {
        source: "/install",
        destination: `${RAW}/install.sh`,
        permanent: false,
      },
      {
        source: "/install.ps1",
        destination: `${RAW}/install.ps1`,
        permanent: false,
      },
      // Marketing aliases
      {
        source: "/github",
        destination: "https://github.com/capframe/capframe",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "https://github.com/capframe/capframe#readme",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
