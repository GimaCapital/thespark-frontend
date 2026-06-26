// import React, { useState, useEffect } from 'react';

// export default function PWAInstall() {
//     const [deferredPrompt, setDeferredPrompt] = useState(null);
//     const [showInstall, setShowInstall] = useState(false);
//     const [isInstalled, setIsInstalled] = useState(false);

//     useEffect(() => {
//         // Check if app is already installed
//         if (window.matchMedia('(display-mode: standalone)').matches) {
//             setIsInstalled(true);
//             return;
//         }

//         // Listen for beforeinstallprompt event
//         const handleBeforeInstallPrompt = (e) => {
//             e.preventDefault();
//             setDeferredPrompt(e);
//             setShowInstall(true);
//         };

//         window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

//         // Listen for app installed event
//         window.addEventListener('appinstalled', () => {
//             setIsInstalled(true);
//             setShowInstall(false);
//             setDeferredPrompt(null);
//         });

//         return () => {
//             window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//         };
//     }, []);

//     const handleInstall = async () => {
//         if (!deferredPrompt) return;

//         deferredPrompt.prompt();
//         const { outcome } = await deferredPrompt.userChoice;
        
//         if (outcome === 'accepted') {
//             setShowInstall(false);
//             setIsInstalled(true);
//         }
//         setDeferredPrompt(null);
//     };

//     const handleDismiss = () => {
//         setShowInstall(false);
//         // Hide for 7 days
//         localStorage.setItem('pwaDismissed', Date.now());
//     };

//     // Check if user dismissed recently
//     useEffect(() => {
//         const dismissed = localStorage.getItem('pwaDismissed');
//         if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
//             setShowInstall(false);
//         }
//     }, []);

//     if (!showInstall || isInstalled) return null;

//     return (
//         <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
//             <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 animate-slide-up border border-gray-100">
//                 <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-spark-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-2xl">📱</span>
//                     </div>
//                     <div className="flex-1">
//                         <h4 className="font-bold text-gray-800">Install TheSpark App</h4>
//                         <p className="text-xs text-gray-500 mt-1">
//                             Install on your device for faster access, offline support, and daily notifications.
//                         </p>
//                         <div className="flex gap-2 mt-3">
//                             <button
//                                 onClick={handleInstall}
//                                 className="bg-gradient-to-r from-spark-500 to-spark-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition"
//                             >
//                                 Install App
//                             </button>
//                             <button
//                                 onClick={handleDismiss}
//                                 className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2"
//                             >
//                                 Maybe Later
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';

export default function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user dismissed recently
        const dismissed = localStorage.getItem('pwaDismissed');
        if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
            setShowInstall(false);
            return;
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstall(false);
            setDeferredPrompt(null);
            localStorage.removeItem('pwaDismissed');
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            alert('To install TheSpark, click the install icon in your browser address bar.');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowInstall(false);
            setIsInstalled(true);
            localStorage.removeItem('pwaDismissed');
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstall(false);
        localStorage.setItem('pwaDismissed', Date.now());
    };

    if (!showInstall || isInstalled) return null;

    return (
        // ✅ All padding is here:
        // - bottom: safe area + padding
        // - horizontal: responsive
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe md:px-6">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 animate-slide-up border border-gray-100">
                <div className="flex items-start gap-3">
                    {/* ✅ NEW ICON - Fire logo for TheSpark */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl">🔥</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                            Install TheSpark App
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Install on your device for faster access, offline support, and daily notifications.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button
                                onClick={handleInstall}
                                className="bg-gradient-to-r from-spark-500 to-spark-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
                            >
                                Install App
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2 transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}