const CACHE = "ysm-v2";
const OFFLINE_URL = "/offline";
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(["/", "/offline"]);
  })());
  self.skipWaiting();
});
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // App shell navigations → network first, fallback to offline page
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put(req, fresh.clone());
        return fresh;
      } catch {
        const c = await caches.open(CACHE);
        const cached = await c.match(req);
        return cached || c.match(OFFLINE_URL);
      }
    })());
    return;
  }
  // Other GETs → cache first
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const fresh = await fetch(req);
    const c = await caches.open(CACHE);
    c.put(req, fresh.clone());
    return fresh;
  })());
});
