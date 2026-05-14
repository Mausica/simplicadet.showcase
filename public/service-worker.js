const CACHE_NAME = 'simplicadet-v1778750682072';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(c => {
          c.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
             const responseToCache = response.clone();
             caches.open(CACHE_NAME).then((cache) => {
               cache.put(event.request, responseToCache);
             });
          }
          return response;
        })
        .catch(() => {
           return caches.match(event.request)
             .then((response) => {
               if (response) return response;
               return new Response('You are offline. Please check your connection.', { 
                 status: 503,
                 headers: { 'Content-Type': 'text/plain' }
               });
             });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const contentType = response.headers.get('content-type') || '';
          const isDocument = event.request.destination === 'document' || event.request.mode === 'navigate';
          const isJS = contentType.includes('javascript');
          const isCSS = contentType.includes('text/css');
          const isImage = contentType.startsWith('image/');
          const isManifest = event.request.url.endsWith('/manifest.json') || contentType.includes('application/manifest+json') || contentType.includes('application/json');

          const shouldCache = (isDocument && contentType.includes('text/html')) || isJS || isCSS || isImage || isManifest;

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          } else {
          }

          return response;
        });
      })
      .catch(() => {
        return new Response('Offline', { status: 503 });
      })
  );
});
