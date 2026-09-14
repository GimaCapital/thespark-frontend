// firebase-messaging-sw.js — Firebase Cloud Messaging service worker
// Scope: /firebase-cloud-messaging-push-scope/
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: 'AIzaSyAVfcPq4k6b6OWeTZ3uIgs2ZG1Y3E3wB7E',
    projectId: 'thespark-bc985',
    messagingSenderId: '663116334407',
    appId: '1:663116334407:web:da6118a165e4992a4bddff',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[FCM] Background message:', payload);

    const notificationTitle = payload.notification?.title || 'TheSpark';
    const notificationOptions = {
        body: payload.notification?.body || 'New daily lesson available',
        icon: '/icons/thespark-logo-192x192.png',
        badge: '/icons/thespark-logo-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: payload.fcmOptions?.link || '/dashboard',
            click_action: '/dashboard',
        },
        requireInteraction: true,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});