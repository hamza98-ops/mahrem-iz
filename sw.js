/**
 * Mahrem-İz Service Worker
 *
 * Mahremiyet projesi için minimal bir service worker:
 * - Cache-first stratejisi (statik kaynaklar için)
 * - Network-first hiçbir şey için yok (sunucusuz proje, dış istek minimum)
 * - Offline temel kullanım — site internet yoksa son cache'lenen halini gösterir
 *
 * Hiçbir kullanıcı verisi sw tarafında saklanmaz; yalnızca statik dosyalar.
 */

const CACHE_VERSION = 'mahrem-iz-v6';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './assets/og/mahrem-iz-og.jpg',
  './assets/pwa/icon-192.png',
  './assets/pwa/icon-512.png',
  './assets/pwa/apple-touch-icon.png',
  './assets/fonts/fonts.css',
  './kvkk.html',
  './sosyalfest.html',
  './araclar.html',
  './anket.html',
  './etki.html',
  './akademi/fikih.html',
  './akademi/sharenting.html',
  './akademi/nazar.html',
  './akademi/deepfake.html'
];

// Install: ana kaynakları önceden cache'le
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CORE_ASSETS))
      .catch(() => { /* offline kurulum hatası sessiz geçilir */ })
  );
  self.skipWaiting();
});

// Activate: eski cache versiyonlarını temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, sonra network (network başarısızsa cache'den dönüş)
self.addEventListener('fetch', event => {
  const req = event.request;
  // YouTube facade ve harici istekleri sw'den geçirme
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        // Başarılı yanıtları cache'le (HTML + assets)
        if (resp.ok && (req.destination === 'document' || req.destination === 'image' ||
                        req.destination === 'style' || req.destination === 'script')) {
          const clone = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
