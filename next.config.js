const withPWA = require("next-pwa");
const path = require("path");
const runtimeCaching = require("next-pwa/cache");
module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    // runtimeCaching,
    // disable: process.env.NODE_ENV === "development",
    disable: true,
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: [
      "fakestoreapi.com",
      "api.lorem.space",
      "picsum.photos",
      "placeimg.com",
      "encrypted-tbn0.gstatic.com",
      "beautibee.dedicateddevelopers.us",
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  productionBrowserSourceMaps: true,
  swcMinify: false,
  compress: true,
  optimizeFonts: true,
  devIndicators: {
    autoPrerender: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
});
