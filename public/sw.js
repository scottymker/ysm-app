// very small cache-first for same-origin GETs
const CACHE = "ysm-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    const res = await fetch(e.request);
    const cache = await caches.open(CACHE);
    cache.put(e.request, res.clone());
    return res;
  })());
});
