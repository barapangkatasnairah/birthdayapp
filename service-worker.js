const CACHE_NAME = 'birthday-gift-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    // Uncomment these once you add your files to the assets folder:
    // './assets/music.mp3',
    // './assets/photo1.jpg',
    // './assets/photo2.jpg',
    // './assets/photo3.jpg',
    // './assets/icon.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch Event (Offline capabilities)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version or fetch from network
            return response || fetch(event.request);
        })
    );
});

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});