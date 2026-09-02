import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@duckdb/node-api", "@duckdb/node-bindings"],
  // Standalone tracing misses libduckdb.so (loaded via dlopen), so include the native package wholesale.
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/@duckdb/node-bindings-linux-x64/**", "./node_modules/@duckdb/node-bindings-linux-arm64/**"],
  },
  poweredByHeader: false,
  images: { remotePatterns: [] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
