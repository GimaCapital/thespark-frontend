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


// import React, { useState, useEffect } from 'react';

// export default function PWAInstall() {
//     const [deferredPrompt, setDeferredPrompt] = useState(null);
//     const [showInstall, setShowInstall] = useState(false);
//     const [isInstalled, setIsInstalled] = useState(false);

//     useEffect(() => {
//         // Check if app is already installed
//         if (window.matchMedia('(display-mode: standalone)').matches) {
//             setIsInstalled(true);
//             setShowInstall(false);
//             return;
//         }

//         // Listen for beforeinstallprompt event
//         const handleBeforeInstallPrompt = (e) => {
//             e.preventDefault();
//             setDeferredPrompt(e);
//             setShowInstall(true);
//         };

//         window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

//         // Check if the event already fired
//         if (window.deferredPrompt) {
//             setDeferredPrompt(window.deferredPrompt);
//             setShowInstall(true);
//         }

//         // Listen for app installed event
//         const handleAppInstalled = () => {
//             setIsInstalled(true);
//             setShowInstall(false);
//             setDeferredPrompt(null);
//         };

//         window.addEventListener('appinstalled', handleAppInstalled);

//         return () => {
//             window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
//             window.removeEventListener('appinstalled', handleAppInstalled);
//         };
//     }, []);

//     const handleInstall = async () => {
//         if (!deferredPrompt) {
//             alert('To install TheSpark:\n\n' +
//                   'Chrome: Click the ⊕ icon in the address bar\n' +
//                   'Or tap menu → "Install app"\n\n' +
//                   'Safari: Tap Share → "Add to Home Screen"');
//             return;
//         }

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
//         // No localStorage saving - banner will show again on refresh
//     };

//     if (isInstalled) return null;
//     if (!showInstall) return null;

//     return (
//         <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
//             <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 animate-slide-up border border-gray-100">
//                 <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-spark-100 rounded-full flex items-center justify-center flex-shrink-0">
//                          <span className="text-2xl">🔥</span>
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
            setShowInstall(false);
            return;
        }

        // ✅ CHECK: Was the event already captured in HTML?
        if (window.deferredPrompt) {
            console.log('✅ Using pre-captured prompt from HTML!');
            setDeferredPrompt(window.deferredPrompt);
            setShowInstall(true);
        }

        // ✅ LISTEN: For the custom event from HTML
        const handlePromptReady = () => {
            if (window.deferredPrompt) {
                console.log('✅ Custom event: Prompt ready!');
                setDeferredPrompt(window.deferredPrompt);
                setShowInstall(true);
            }
        };
        window.addEventListener('pwaPromptReady', handlePromptReady);

        // ✅ LISTEN: For the regular event (fallback)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            console.log('✅ beforeinstallprompt fired in React!');
            window.deferredPrompt = e;
            setDeferredPrompt(e);
            setShowInstall(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed
        const handleAppInstalled = () => {
            console.log('✅ App installed!');
            setIsInstalled(true);
            setShowInstall(false);
            setDeferredPrompt(null);
            window.deferredPrompt = null;
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        // ✅ FALLBACK: Check again after 2 seconds
        const timer = setTimeout(() => {
            if (!showInstall && window.deferredPrompt) {
                console.log('✅ Fallback: Found prompt after delay!');
                setDeferredPrompt(window.deferredPrompt);
                setShowInstall(true);
            }
        }, 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('pwaPromptReady', handlePromptReady);
            clearTimeout(timer);
        };
    }, []);

    const handleInstall = async () => {
        const prompt = deferredPrompt || window.deferredPrompt;
        
        if (!prompt) {
            alert('To install TheSpark:\n\n' +
                  'Chrome: Click the ⊕ icon in the address bar\n' +
                  'Or tap menu → "Install app"\n\n' +
                  'Safari: Tap Share → "Add to Home Screen"');
            return;
        }

        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted install!');
            setShowInstall(false);
            setIsInstalled(true);
            window.deferredPrompt = null;
        } else {
            console.log('❌ User dismissed install');
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowInstall(false);
    };

    if (isInstalled) return null;
    if (!showInstall) return null;

    return (
        // ✅ FIXED: Higher z-index than bottom tab bar (z-50 vs z-[100])
        <div 
            className="fixed left-0 right-0 px-4"
            style={{ 
                zIndex: 9999,  // ✅ Higher than your bottom tab bar (z-50 = 50)
                bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', // ✅ Above bottom tab bar
                paddingBottom: 'env(safe-area-inset-bottom, 10px)'
            }}
        >
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 animate-slide-up border border-gray-100">
                <div className="flex items-start gap-3">
                    {/* ✅ USING ACTUAL LOGO INSTEAD OF EMOJI */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700">
                        <img 
                            src="/icons/thespark-logo-192x192.png" 
                            alt="TheSpark" 
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                            Install TheSpark App
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Install for faster access, offline support, and daily notifications.
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