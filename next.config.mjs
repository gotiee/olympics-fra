/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gstatic.olympics.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:"upload.wikimedia.org",
        port: "",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
