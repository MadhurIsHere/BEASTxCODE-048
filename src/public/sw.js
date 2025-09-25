// Learnio Service Worker for Offline Capability
// Optimized for rural Indian students with limited connectivity

const CACHE_NAME = 'learnio-v1.2.0';
const OFFLINE_URL = '/offline.html';

// Essential files to cache for offline functionality
const ESSENTIAL_FILES = [
  '/',
  '/offline.html',
  '/App.tsx',
  '/styles/globals.css',
  // Add other essential assets
];

// Assets that can be cached for better performance
const STATIC_ASSETS = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
  // Add other static assets
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Learnio SW: Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Learnio SW: Caching essential files');
        return cache.addAll(ESSENTIAL_FILES);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Learnio SW: Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Learnio SW: Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Learnio SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, cache it
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try to serve from cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If it's a navigation request and not cached, serve offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a basic response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Learnio SW: Background sync triggered');
    event.waitUntil(syncUserProgress());
  }
});

// Sync user progress when online
async function syncUserProgress() {
  try {
    // Get stored user data
    const userData = await getStoredUserData();
    if (userData && userData.pendingSync) {
      // Send to server when online
      await sendProgressToServer(userData);
      // Clear pending sync flag
      await clearPendingSyncFlag();
    }
  } catch (error) {
    console.error('Learnio SW: Progress sync failed:', error);
  }
}

// Helper functions for offline data management
async function getStoredUserData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/user-progress');
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Learnio SW: Failed to get stored user data:', error);
  }
  return null;
}

async function sendProgressToServer(userData) {
  try {
    await fetch('/api/sync-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Learnio SW: Failed to sync progress:', error);
    throw error;
  }
}

async function clearPendingSyncFlag() {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete('/user-progress');
  } catch (error) {
    console.error('Learnio SW: Failed to clear sync flag:', error);
  }
}

// Push notification handler for engagement
self.addEventListener('push', (event) => {
  console.log('Learnio SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your STEM learning session!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/icons/action-explore.png',
      },
      {
        action: 'close',
        title: 'Later',
        icon: '/icons/action-close.png',
      },
    ],
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification('Learnio - Ready to Explore?', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Learnio SW: Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?utm_source=push_notification&utm_medium=notification&utm_campaign=engagement')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Performance monitoring for low-end devices
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_LOG') {
    console.log('Learnio SW: Performance metrics:', event.data.metrics);
    
    // Cache performance data for analytics
    caches.open(CACHE_NAME)
      .then((cache) => {
        const performanceData = {
          timestamp: Date.now(),
          metrics: event.data.metrics,
          userAgent: navigator.userAgent,
        };
        
        cache.put(
          '/performance-log',
          new Response(JSON.stringify(performanceData), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
      });
  }
});

// Network status monitoring
self.addEventListener('online', () => {
  console.log('Learnio SW: Device is now online');
  // Trigger background sync when connection is restored
  self.registration.sync.register('background-sync');
});

self.addEventListener('offline', () => {
  console.log('Learnio SW: Device is now offline');
  // Could notify the app about offline status
});

console.log('Learnio Service Worker: Ready for offline-first education!');