const CACHE_NAME = 'clickncook-cache-v2';
const APP_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/icons/*',
  '/sounds/*',
  '/locations/*',
  '/backgrounds/*',
  '*.js',
  '*.css',
];

// установка (кэширование основной версии)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

// активация (удаление старых версий кэша)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// сетевые запросы
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// обновление версии SW
self.addEventListener('updatefound', () => {
  self.registration.onupdatefound = () => {
    const installing = self.registration.installing;
    if (installing) {
      installing.onstatechange = () => {
        if (installing.state === 'installed') {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({type: 'update-available'}));
          });
        }
      };
    }
  };
});
