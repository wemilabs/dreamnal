const VERSION = "v1";
const STATIC_CACHE = `dreamnal-static-${VERSION}`;
const PAGES_CACHE = `dreamnal-pages-${VERSION}`;
const CURRENT_CACHES = new Set([STATIC_CACHE, PAGES_CACHE]);

const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/apple-icon.png",
  "/favicon.ico",
];
const STATIC_ASSET_RE = /\/_next\/static\/[^"'()<>\s\\]+/g;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const offlineResponse = await fetch(OFFLINE_URL, { cache: "reload" });
      if (!offlineResponse.ok) {
        throw new Error(`Offline page fetch failed: ${offlineResponse.status}`);
      }
      const pages = await caches.open(PAGES_CACHE);
      await pages.put(OFFLINE_URL, offlineResponse.clone());
      const html = await offlineResponse.text();
      const assets = new Set(html.match(STATIC_ASSET_RE) ?? []);
      const staticCache = await caches.open(STATIC_CACHE);
      for (const url of [...PRECACHE_URLS, ...assets]) {
        // one missing asset must not fail the whole install; runtime caching
        // (cache-first for /_next/static, SWR for icons) fills gaps later
        await staticCache.add(url).catch(() => undefined);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !CURRENT_CACHES.has(name))
          .map((name) => caches.delete(name)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

const handleNavigate = async (event) => {
  try {
    const preload = await event.preloadResponse;
    if (preload) {
      return preload;
    }
    return await fetch(event.request);
  } catch {
    const offline = await caches.match(OFFLINE_URL);
    return offline ?? Response.error();
  }
};

const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  return response;
};

const staleWhileRevalidate = (event) => {
  const fetched = fetch(event.request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  });
  return caches.match(event.request).then((cached) => {
    if (cached) {
      event.waitUntil(fetched.catch(() => undefined));
      return cached;
    }
    return fetched;
  });
};

const isRuntimeAsset = (pathname) =>
  pathname.startsWith("/icons/") ||
  pathname.startsWith("/brand/") ||
  pathname.startsWith("/screenshots/") ||
  pathname === "/favicon.ico" ||
  pathname === "/apple-icon.png";

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(event));
    return;
  }
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (isRuntimeAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event));
  }
});
