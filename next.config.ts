import type { NextConfig } from "next";
import {
  HSTS_HEADER,
  SECURITY_HEADER_MAP,
} from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    const headers = Object.entries(SECURITY_HEADER_MAP).map(([key, value]) => ({
      key,
      value,
    }));

    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: HSTS_HEADER,
      });
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export default nextConfig;
