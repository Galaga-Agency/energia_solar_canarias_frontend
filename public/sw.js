import { openDB } from "idb";

const CACHE_NAME = "pwa-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/about",
  "/contact",
  "/offline.html",
  "/css/styles.css",
  "/js/scripts.js",
  "/images/logo.png",
];

// IndexedDB setup
const dbPromise = openDB("app-data", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("api-data")) {
      db.createObjectStore("api-data", { keyPath: "id" });
    }
  },
});

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch and Cache Data
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle API requests
  if (request.url.includes("/api/")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const clonedResponse = networkResponse.clone();

          // Save data in IndexedDB
          const db = await dbPromise;
          const data = await clonedResponse.json();
          if (data && Array.isArray(data)) {
            data.forEach((item) => db.put("api-data", item));
          }

          return networkResponse;
        } catch (error) {
          // Serve data from IndexedDB if offline
          const db = await dbPromise;
          const cachedData = await db.getAll("api-data");
          return new Response(JSON.stringify(cachedData), {
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request)
          .then((fetchResponse) => {
            const clonedResponse = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clonedResponse);
            });
            return fetchResponse;
          })
          .catch(() => caches.match("/offline.html"))
      );
    })
  );
});
