// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
    domains: ["v0-host-image-on-vercel.vercel.app"],
  },
};

module.exports = nextConfig;
