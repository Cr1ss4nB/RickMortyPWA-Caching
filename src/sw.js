const CACHE_STATIC_NAME = 'static-v10';
const CACHE_DYNAMIC_NAME = 'dynamic-v10';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

// Este método precachea el App Shell
self.addEventListener('install', event => {

    const cacheStatic = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './js/app.js',
                './img/logo.png',
                './pages/favorites.html',
                './js/favorites.js',
                './pages/offline.html'
            ]);
        });

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cache => {
            return cache.addAll([
                'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
            ]);
        });

    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


// Limpiar caches antiguos
self.addEventListener('activate', event => {

    const cacheWhitelist = [
        CACHE_STATIC_NAME,
        CACHE_DYNAMIC_NAME,
        CACHE_INMUTABLE_NAME
    ];

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});


// Este método intercepta las peticiones y responde con la estrategia adecuada
self.addEventListener('fetch', event => {

    if (event.request.method !== 'GET') return;

    const url = event.request.url;

    // API -> Network First
    if (url.includes('rickandmortyapi.com')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Imágenes -> Stale While Revalidate
    if (event.request.destination === 'image') {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }

    // Navegación (HTML) -> manejar offline fallback aquí
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('./pages/offline.html');
            })
        );
        return;
    }

    // App Shell -> Cache First
    event.respondWith(cacheFirst(event.request));
});


// App Shell -> Cache First + fallback offline
function cacheFirst(req) {
    return caches.match(req).then(res => {
        if (res) return res;

        return fetch(req)
            .then(newRes => {
                return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                    cache.put(req, newRes.clone());
                    return newRes;
                });
            })
            .catch(() => {
                return caches.match('./pages/offline.html');
            });
    });
}


// API -> Network First
function networkFirst(req) {
    return fetch(req)
        .then(res => {
            return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                cache.put(req, res.clone());
                return res;
            });
        })
        .catch(() => {
            return caches.match(req);
        });
}


// Imágenes -> Stale While Revalidate
function staleWhileRevalidate(req) {
    return caches.match(req).then(cachedRes => {

        const fetchPromise = fetch(req).then(networkRes => {
            caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                cache.put(req, networkRes.clone());
            });
            return networkRes;
        });

        return cachedRes || fetchPromise;
    });
}