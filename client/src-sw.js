const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Asset caching
const urlCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/index.js',
  'images/logo.png',
];

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    })
]
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

//Register the service worker
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/src-sw.js');
    })
  }
}

//Install the servive worker
self.addEventListener('install', (e) => e.waitUntil(
  caches.open(cacheName).then((cache) => cache.addAll(urlCache))
)
);
//Activate the service worker
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((keyList) => Promise.all(
    keyList.map((key) => {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    })
  )
  ))
);

// Claim the service worker
self.addEventListener('activate', (e) => { e.waitUntil(clients.claim());
});

// Cache first
self.addEventListener('fetch', (e) => e.respondWith(caches.match(e.request).then((res) =>
res || fatch(e.request)))
);

registerRoute();
