self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('roleta-cache').then(cache => {
      return cache.addAll([
        './index.html',
        './style.css',
        './service-worker.js',
        './roleta.mp3',
        './manifest.json',
        './icone.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
