const CACHE_NAME = 'pulse-v1'; 
const urlsToCache = [ 
  '/pulse7/', 
  '/pulse7/index.html', 
  '/pulse7/manifest.json' 
]; 
 
self.addEventListener('install', event =
  event.waitUntil( 
    caches.open(CACHE_NAME) 
      .then(cache =
  ); 
}); 
 
self.addEventListener('fetch', event =
  event.respondWith( 
    caches.match(event.request) 
  ); 
}); 
