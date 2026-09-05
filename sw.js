// 五分化训练动作库 v2.3 Service Worker
const CACHE_NAME = 'workout-lib-v2.3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './jsx_compiled2.js',
  './manifest.json',
  './favicon.svg',
  './vendor/react.min.js',
  './vendor/react-dom.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) return response;
      return fetch(e.request).then((fetchResponse) => {
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
        return fetchResponse;
      });
    })
  );
});
