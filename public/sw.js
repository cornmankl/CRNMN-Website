const CACHE_NAME = 'crnmn-v2.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;
const API_CACHE = `${CACHE_NAME}-api`;

// Cache URLs
const STATIC_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/assets/favicon.ico'
];

const API_URLS = [
  '/api/products',
  '/api/orders',
  '/api/user',
  '/api/cart'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('crnmn-') && !cacheName.includes(CACHE_NAME)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static assets
    if (STATIC_URLS.includes(url.pathname) || 
        url.pathname.startsWith('/assets/') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.webp')) {
      
      event.respondWith(
        caches.match(request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // For images, use image cache
            if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
              return fetch(request).then(response => {
                const responseClone = response.clone();
                caches.open(IMAGE_CACHE).then(cache => {
                  cache.put(request, responseClone);
                });
                return response;
              });
            }
            
            // For other static assets, use static cache
            return fetch(request).then(response => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
              return response;
            });
          })
      );
    }
    
    // API requests
    else if (API_URLS.some(apiUrl => url.pathname.startsWith(apiUrl)) ||
             url.pathname.startsWith('/api/')) {
      
      event.respondWith(
        fetch(request)
          .then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(API_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    }
    
    // Other dynamic requests
    else {
      event.respondWith(
        caches.match(request)
          .then(response => {
            if (response) {
              return response;
            }
            
            return fetch(request)
              .then(response => {
                // Cache successful responses
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(request, responseClone);
                  });
                }
                return response;
              })
              .catch(() => {
                // Return offline page for HTML requests
                if (request.headers.get('accept').includes('text/html')) {
                  return caches.match('/offline.html');
                }
                return new Response('Offline', { status: 503 });
              });
          })
      );
    }
  }
  
  // Handle POST requests (form submissions, API calls)
  else if (request.method === 'POST') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Store POST requests for later sync
          return storeOfflineRequest(request);
        })
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-requests') {
    event.waitUntil(syncOfflineRequests());
  }
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from CRNMN',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icons/explore-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CRNMN', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Store offline requests
function storeOfflineRequest(request) {
  return new Promise((resolve) => {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: null,
      timestamp: Date.now()
    };
    
    // Read request body
    request.clone().text().then(body => {
      requestData.body = body;
      
      // Store in IndexedDB
      const dbRequest = indexedDB.open('CRNMNOfflineDB', 1);
      
      dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offlineRequests')) {
          db.createObjectStore('offlineRequests', { keyPath: 'id', autoIncrement: true });
        }
      };
      
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('offlineRequests', 'readwrite');
        const store = transaction.objectStore('offlineRequests');
        
        store.add(requestData);
        
        // Register for background sync
        self.registration.sync.register('sync-offline-requests');
        
        resolve(new Response('Request stored for offline sync', { status: 202 }));
      };
    });
  });
}

// Sync offline requests
function syncOfflineRequests() {
  return new Promise((resolve) => {
    const dbRequest = indexedDB.open('CRNMNOfflineDB', 1);
    
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('offlineRequests', 'readwrite');
      const store = transaction.objectStore('offlineRequests');
      
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => {
        const requests = getRequest.result;
        
        if (requests.length === 0) {
          resolve();
          return;
        }
        
        // Process each request
        const syncPromises = requests.map(requestData => {
          return fetch(requestData.url, {
            method: requestData.method,
            headers: requestData.headers,
            body: requestData.body
          }).then(response => {
            if (response.ok) {
              // Remove synced request
              store.delete(requestData.id);
            }
            return response;
          }).catch(error => {
            console.error('Failed to sync request:', error);
            throw error;
          });
        });
        
        Promise.all(syncPromises)
          .then(() => resolve())
          .catch(error => {
            console.error('Some requests failed to sync:', error);
            resolve();
          });
      };
    };
  });
}

// Sync orders
function syncOrders() {
  return new Promise((resolve) => {
    // Implement order sync logic
    console.log('Syncing orders...');
    resolve();
  });
}

// Message handling
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_TTL') {
    // Implement cache TTL logic
    console.log('Cache TTL message received');
  }
});
