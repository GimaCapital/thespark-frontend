import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Register both service workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // 1. Register PWA service worker (offline support, installable app)
            const pwaSW = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ PWA Service Worker registered:', pwaSW.scope);
            
            // 2. Register Firebase Messaging service worker (push notifications)
            const messagingSW = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('✅ Firebase Messaging SW registered:', messagingSW.scope);
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);