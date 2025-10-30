// Simple cache-first service worker
const CACHE_VERSION = "v5"; // ⬅️ bump this each time you upload new files
const CACHE_NAME = `hansboller-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  "./",
  "./index.html",   
  "https://bager.bohnsvendsen.dk/hansboller.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  // ✅ ensures new SW activates immediately
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  // ✅ makes sure pages use the new version right away
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
