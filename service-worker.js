const CACHE_NAME = 'stopwatch-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/stopwatch.js',
  '/manifest.json',
  '/img1.png',
  '/img2.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      });
    }).catch(() => caches.match('/index.html'))
  );
});

// Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-message') {
    console.log('[Service Worker] Sync triggered');
    // Sync logic would go here (e.g., send form data if offline earlier)
  }
});

// Push
self.addEventListener('push', event => {
    let message = "You have a new notification!";
    try {
      const data = event.data.json();
      if (data && data.message) {
        message = data.message;
      }
    } catch (e) {
      if (event.data) {
        message = event.data.text();
      }
    }
  
    event.waitUntil(
      self.registration.showNotification('PRODIGY Stopwatch', {
        body: message,
        icon: '/img1.png'
      })
    );
  });
  
//   push message in json format

//   navigator.serviceWorker.getRegistration().then(reg => {
//     reg.active.dispatchEvent(new PushEvent('push', {
//       data: new Blob([
//         JSON.stringify({
//           method: "pushMessage",
//           message: "⏱️ This is a test push notification from PWA!"
//         })
//       ], { type: 'application/json' })
//     }));
//   });
  
