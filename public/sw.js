// Service worker simples: cache do app (offline) + imagens de exercícios
const CACHE = 'personal-v2';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'api.anthropic.com') return;
  const sameOrigin = url.origin === self.location.origin;
  const isExerciseImg = url.hostname === 'raw.githubusercontent.com';
  if (!sameOrigin && !isExerciseImg) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      if (isExerciseImg) {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }
      // network-first para o app
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch {
        const hit = await cache.match(req);
        return hit || cache.match(new URL('./', self.registration.scope).href);
      }
    })
  );
});
