import React, { useEffect, useState } from 'react';

// interface BeforeInstallPromptEvent extends Event {
//   readonly platforms: string[];
//   readonly userChoice: Promise<{
//     outcome: 'accepted' | 'dismissed';
//     platform: string;
//   }>;
//   prompt(): Promise<void>;
// }

export const PWARegistration: React.FC = () => {
  // const [isOnline, setIsOnline] = useState(navigator.onLine); // isOnline is not used
  // const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'unsupported' | 'registering' | 'registered' | 'error'>('unsupported'); // serviceWorkerStatus is not used

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || // isInStandaloneMode is not used
      //                           (window.navigator as any).standalone === true;
      // setIsInstalled(isInStandaloneMode); // isInstalled is not used
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // const promptEvent = e as BeforeInstallPromptEvent; // promptEvent is not used
      // setDeferredPrompt(promptEvent); // deferredPrompt is not used
    };

    // Handle app installed
    const handleAppInstalled = () => {
      // setIsInstalled(true); // isInstalled is not used
      // setDeferredPrompt(null); // deferredPrompt is not used
    };

    // Handle online/offline status
    // const handleOnline = () => setIsOnline(true); // isOnline is not used
    // const handleOffline = () => setIsOnline(false); // isOnline is not used

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    // window.addEventListener('online', handleOnline); // isOnline is not used
    // window.addEventListener('offline', handleOffline); // isOnline is not used

    // Check initial installation status
    checkIfInstalled();

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // setServiceWorkerStatus('registering'); // serviceWorkerStatus is not used
          
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('Service Worker registered successfully:', registration);
          // setServiceWorkerStatus('registered'); // serviceWorkerStatus is not used
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  showUpdateNotification();
                }
              });
            }
          });
          
          // Handle controller change (new service worker activated)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New service worker activated');
            // Optionally reload the page to get the latest version
            // window.location.reload();
          });
          
        } catch (error) {
          console.error('Service Worker registration failed:', error);
          // setServiceWorkerStatus('error'); // serviceWorkerStatus is not used
        }
      } else {
        console.log('Service Worker is not supported');
        // setServiceWorkerStatus('unsupported'); // serviceWorkerStatus is not used
      }
    };

    registerServiceWorker();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      // window.removeEventListener('online', handleOnline); // isOnline is not used
      // window.removeEventListener('offline', handleOffline); // isOnline is not used
    };
  }, []);

  // const handleInstallClick = async () => { // handleInstallClick is not used
  //   if (deferredPrompt) { // deferredPrompt is not used
  //     try {
  //       await deferredPrompt.prompt(); // deferredPrompt is not used
  //       const { outcome } = await deferredPrompt.userChoice; // deferredPrompt is not used
        
  //       if (outcome === 'accepted') {
  //         console.log('User accepted the install prompt');
  //       } else {
  //         console.log('User dismissed the install prompt');
  //       }
        
  //       // setDeferredPrompt(null); // deferredPrompt is not used
  //     } catch (error) {
  //       console.error('Error during install prompt:', error);
  //     }
  //   }
  // };

  const showUpdateNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Update Available', {
        body: 'A new version of CRNMN is available. Click to update.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'update-available'
      });
    }
  };

  // const requestNotificationPermission = async () => { // requestNotificationPermission is not used
  //   if ('Notification' in window) {
  //     const permission = await Notification.requestPermission();
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted');
  //       // Subscribe to push notifications
  //       subscribeToPushNotifications();
  //     }
  //   }
  // };

  // const subscribeToPushNotifications = async () => {
  //   if ('serviceWorker' in navigator && 'PushManager' in window) {
  //     try {
  //       const registration = await navigator.serviceWorker.ready;
  //       const subscription = await registration.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
  //       });
        
  //       console.log('Push notification subscription:', subscription);
  //       // Send subscription to server
  //       await sendSubscriptionToServer(subscription);
  //     } catch (error) {
  //       console.error('Failed to subscribe to push notifications:', error);
  //     }
  //   }
  // };

  // const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  //   const padding = '='.repeat((4 - base64String.length % 4) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, '+')
  //     .replace(/_/g, '/');
    
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);
    
  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
    
  //   return outputArray;
  // };

  // const sendSubscriptionToServer = async (subscription: PushSubscription) => {
  //   // Implement sending subscription to your server
  //   console.log('Sending subscription to server:', subscription);
  // };

  // This component doesn't render anything visible
  return null;
};

// Hook for PWA features
export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'unsupported' | 'registering' | 'registered' | 'error'>('unsupported');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is installed
    const checkInstalled = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                                (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode);
    };

    checkInstalled();

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          setServiceWorkerStatus('registered');
        } else {
          setServiceWorkerStatus('unsupported');
        }
      }).catch(() => {
        setServiceWorkerStatus('error');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isInstalled,
    serviceWorkerStatus,
    // Add more PWA-related functions as needed
  };
};

export default PWARegistration;