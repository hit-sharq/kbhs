/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["v0.blob.com"],
  },
  // This is important for handling hydration issues with certain attributes
  reactStrictMode: true,
}

module.exports = nextConfig

