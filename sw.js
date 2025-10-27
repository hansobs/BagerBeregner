// Simple cache-first service worker
const CACHE_NAME = "hansboller-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./hansboller.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => response || fetch(evt.request))
  );
});
