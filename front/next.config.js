/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

rewrites: async () => [
  {
    source: "/public/map.html",
    destination: "/pages/api/map.js",
  },
],

module.exports = nextConfig
