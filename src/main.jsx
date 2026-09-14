import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles/globals.css';
import 'antd/dist/reset.css';

// ============================================================
// 1. PWA SERVICE WORKER (auto-registered by vite-plugin-pwa)
// ============================================================
const updateSW = registerSW({
    onNeedRefresh() {
        if (
            window.confirm(
                'A new version of TheSpark is available. Reload to update?'
            )
        ) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        // console.log('✅ TheSpark is ready to work offline');
    },
    onRegisteredSW(swUrl, registration) {
        // console.log('✅ PWA Service Worker registered:', swUrl);
        if (registration) {
            setInterval(() => registration.update(), 60 * 60 * 1000);
        }
    },
    onRegisterError(error) {
        // console.error('❌ PWA SW registration failed:', error);
    },
});

// ============================================================
// 2. FCM SERVICE WORKER (push notifications, separate scope)
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const fcmReg = await navigator.serviceWorker.register(
                '/firebase-messaging-sw.js',
                { scope: '/firebase-cloud-messaging-push-scope/' }
            );
            // console.log('✅ FCM Service Worker registered:', fcmReg.scope);
        } catch (error) {
            // console.error('❌ FCM SW registration failed:', error);
        }
    });
}

// Add portal root
const portalRoot = document.createElement('div');
portalRoot.id = 'portal-root';
document.body.appendChild(portalRoot);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);