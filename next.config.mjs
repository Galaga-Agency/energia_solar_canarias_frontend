import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern:
        /^https?:\/\/(localhost:3000|app-energiasolarcanarias\.com)\/api\/.*$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:ttf|woff|woff2)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "font-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^\/_next\/image\?url=.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache main app routes
    {
      urlPattern: new RegExp("^/$"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "home-cache",
      },
    },
  ],
});

const nextConfig = {};

export default withPWA(nextConfig);
