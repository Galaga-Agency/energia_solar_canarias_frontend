import withPWAInit from "next-pwa";

const cacheFirstOptions = {
  cacheableResponse: {
    statuses: [0, 200],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    // Cache static assets (JS, CSS, etc.)
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
        ...cacheFirstOptions,
      },
    },
    // Cache images (png, jpg, etc.)
    {
      urlPattern: /.*\.(?:png|jpg|ico|jpeg|svg|gif|webp)/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
        ...cacheFirstOptions,
      },
    },
    // Cache fonts
    {
      urlPattern: /\.(?:ttf|woff|woff2)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "font-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
        },
        ...cacheFirstOptions,
      },
    },
    // Cache Next.js dynamic images
    {
      urlPattern: /^\/_next\/image\?url=.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        ...cacheFirstOptions,
      },
    },
    // Cache CSS files
    {
      urlPattern: /[.](css)/,
      handler: "CacheFirst",
      options: {
        cacheName: "css-cache",
        ...cacheFirstOptions,
      },
    },
    // Cache HTTP requests (NetworkFirst for dynamic content)
    {
      urlPattern: /^http.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "http-cache",
      },
    },
    // Cache the homepage (NetworkFirst strategy)
    {
      urlPattern: new RegExp("^/$"),
      handler: "NetworkFirst",
      options: {
        cacheName: "home-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
        },
        ...cacheFirstOptions,
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "app-energiasolarcanarias-backend.com",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);
