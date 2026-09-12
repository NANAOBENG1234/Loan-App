const CACHE = "boa-pwa-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api")) return;

  // Network-first for navigations and HTML so users always get fresh pages;
  // cache-first for static assets (fingerprinted builds make this safe).
  const cacheFirst =
    !request.mode.includes("navigate") &&
    !request.destination.includes("document");

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      if (cacheFirst) {
        const hit = await cache.match(request);
        if (hit) return hit;
      }
      try {
        const fresh = await fetch(request);
        if (fresh.ok && cacheFirst) cache.put(request, fresh.clone());
        return fresh;
      } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await cache.match("/");
          if (shell) return shell;
        }
        return new Response("You are offline.", {
          status: 503,
          statusText: "Offline",
        });
      }
    })
  );
});