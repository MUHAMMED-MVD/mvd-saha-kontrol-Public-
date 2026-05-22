const CACHE = 'mvd-v1';
const ASSETS = ['index.html','manifest.json','app-icon.png','icon-192.png','icon-512.png','screenshot.png'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const { request: r } = e;
  if (r.method !== 'GET') return;
  e.respondWith(
    caches.match(r).then(cached => cached || fetch(r).then(res => {
      if (res.ok && r.url.startsWith(self.location.origin) && !r.url.includes('supabase')) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(r, clone));
      }
      return res;
    }))
  );
});
