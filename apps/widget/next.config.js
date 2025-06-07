/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: "/",
      destination: "/index.html",
    },
  ]
};

export default nextConfig;
