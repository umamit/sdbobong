const CACHE_NAME = 'sdn-bobong-cache-v2.0.0';

// List of core assets to cache on install (Cache-First)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/css/style.css',
  '/images/logo_sekolah.png',
  '/favicon.png',
  '/favicon.ico'
];

// List of page routes that we want to attempt network-first, with fallback to cache
const NAV_ROUTES = [
  '/',
  '/profil',
  '/akademik',
  '/kesiswaan',
  '/hubungi-kami',
  '/ppdb',
  '/berita'
];

// Install Event - Pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core assets...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle intercepting requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Avoid caching or intercepting admin page, API routes, or Supabase real-time sync endpoints
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api') || url.pathname.includes('/realtime/')) {
    return;
  }

  // Network-First with Cache-Fallback Strategy for pages and key navigation routes
  const isNavRoute = NAV_ROUTES.some(route => url.pathname === route || url.pathname.startsWith(route));
  if (isNavRoute || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful network response, clone it and put it in cache
          if (response.ok && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails (e.g. offline on pesisir Pulau Taliabu), serve from cache
          console.log('[Service Worker] Offline detected, fetching route from cache:', url.pathname);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the route is not in cache, fallback to homepage
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Cache-First with Network-Fallback Strategy for static assets (CSS, JS, Images, Fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Only cache valid standard successful responses
        if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Silent fallback for images
        if (request.destination === 'image') {
          return caches.match('/images/logo_sekolah.png');
        }
      });
    })
  );
});
