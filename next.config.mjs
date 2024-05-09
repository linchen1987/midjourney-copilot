/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
