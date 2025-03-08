import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "logoapi.voetbal.nl",
            }
        ]
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            import('./src/server/websocket');
        }
        return config;
    },
};

export default nextConfig;
