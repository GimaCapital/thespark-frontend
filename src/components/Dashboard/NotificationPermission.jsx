import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { requestNotificationPermission, onForegroundMessage } from '../../services/firebase';
import toast from 'react-hot-toast';

// ✅ Add this constant at the top
const TOAST_SHOWN_KEY = 'notificationToastShown';

export default function NotificationPermission() {
    const { user } = useAuth();
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [showPrompt, setShowPrompt] = useState(false);
    const [showBlockedMessage, setShowBlockedMessage] = useState(false);
    const [showGrantedMessage, setShowGrantedMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const checkInterval = useRef(null);
    const grantedTimeoutRef = useRef(null);
    const toastIdRef = useRef(null);
    const grantedShownRef = useRef(false);
    
    // ✅ Check if toast was already shown (persists across refreshes)
    const isToastAlreadyShown = () => {
        return localStorage.getItem(TOAST_SHOWN_KEY) === 'true';
    };

    // ✅ Mark toast as shown in localStorage
    const markToastAsShown = () => {
        localStorage.setItem(TOAST_SHOWN_KEY, 'true');
    };

    // ✅ For existing users: If permission is already granted, set the flag
    const handleExistingUsers = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            // ✅ If user already has notifications enabled, mark toast as shown
            if (!isToastAlreadyShown()) {
                markToastAsShown();
                console.log('✅ Existing user detected - notification toast flagged as shown');
            }
        }
    };

    const checkPermissionStatus = () => {
        if ('Notification' in window) {
            const status = Notification.permission;
            setPermissionStatus(status);
            
            if (status === 'default') {
                setShowPrompt(true);
                setShowBlockedMessage(false);
                setShowGrantedMessage(false);
            } else if (status === 'granted') {
                setShowPrompt(false);
                setShowBlockedMessage(false);
                
                // ✅ For existing users, set the flag so toast doesn't show
                handleExistingUsers();
                
                // ✅ Show granted message only once per browser
                if (!grantedShownRef.current) {
                    setShowGrantedMessage(true);
                    grantedShownRef.current = true;
                    
                    if (grantedTimeoutRef.current) {
                        clearTimeout(grantedTimeoutRef.current);
                    }
                    grantedTimeoutRef.current = setTimeout(() => {
                        setShowGrantedMessage(false);
                    }, 5000);
                } else {
                    setShowGrantedMessage(false);
                }
                setLoading(false);
            } else if (status === 'denied') {
                setShowBlockedMessage(true);
                setShowPrompt(false);
                setShowGrantedMessage(false);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        checkPermissionStatus();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkPermissionStatus();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        onForegroundMessage((payload) => {
            toast.success(payload.notification?.title, {
                id: 'foreground-notification',
                duration: 5000,
                position: 'top-right',
                style: {
                    zIndex: 99999,
                }
            });
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (checkInterval.current) {
                clearInterval(checkInterval.current);
            }
            if (grantedTimeoutRef.current) {
                clearTimeout(grantedTimeoutRef.current);
            }
            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
            }
        };
    }, [user]);

    const showToast = (type, message, options = {}) => {
        // ✅ Check localStorage - if already shown, skip
        if (type === 'success' && message.includes('Notifications enabled')) {
            if (isToastAlreadyShown()) {
                console.log('✅ Toast already shown, skipping duplicate');
                return;
            }
        }
        
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
        }
        
        const toastFn = type === 'success' ? toast.success : 
                       type === 'error' ? toast.error : 
                       toast;
        
        toastIdRef.current = toastFn(message, {
            id: 'notification-toast',
            duration: 3000,
            position: 'top-right',
            style: {
                zIndex: 99999,
            },
            ...options
        });
        
        // ✅ Mark as shown in localStorage
        if (type === 'success' && message.includes('Notifications enabled')) {
            markToastAsShown();
        }
    };

    const saveFcmToken = async (token) => {
        try {
            if (!user) {
                console.error('❌ No user logged in');
                showToast('error', 'Please login first');
                return;
            }
            
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post('/users/save-fcm-token', { fcmToken: token });
            checkPermissionStatus();
            showToast('success', '✅ Notifications enabled successfully!');
        } catch (error) {
            console.error('Failed to save FCM token:', error);
            showToast('error', 'Failed to enable notifications. Please try again.');
        }
    };

    const enableNotifications = async () => {
        setLoading(true);
        
        try {
            if (!user) {
                showToast('error', 'Please login first');
                setLoading(false);
                return;
            }

            if (Notification.permission === 'granted') {
                // ✅ For existing users, set flag here too
                if (!isToastAlreadyShown()) {
                    markToastAsShown();
                    showToast('success', '✅ Notifications already enabled!');
                }
                if (!grantedShownRef.current) {
                    setShowGrantedMessage(true);
                    grantedShownRef.current = true;
                    setTimeout(() => {
                        setShowGrantedMessage(false);
                    }, 5000);
                }
                setShowPrompt(false);
                setLoading(false);
                return;
            }
            
            if (Notification.permission === 'denied') {
                setShowBlockedMessage(true);
                setShowPrompt(false);
                showToast('error', 'Notifications are blocked. Enable them in browser settings.');
                setLoading(false);
                return;
            }
            
            showToast('info', '🔔 Please allow notifications when prompted.', {
                duration: 5000,
            });

            const result = await requestNotificationPermission(user?.uid, saveFcmToken);

            if (result) {
                setShowPrompt(false);
                if (!grantedShownRef.current) {
                    setShowGrantedMessage(true);
                    grantedShownRef.current = true;
                    setTimeout(() => {
                        setShowGrantedMessage(false);
                    }, 5000);
                }
                if (!isToastAlreadyShown()) {
                    showToast('success', '✅ Notifications enabled successfully!');
                }
            } else {
                if (Notification.permission === 'denied') {
                    setShowBlockedMessage(true);
                    setShowPrompt(false);
                } else if (Notification.permission === 'granted') {
                    setShowPrompt(false);
                    if (!grantedShownRef.current) {
                        setShowGrantedMessage(true);
                        grantedShownRef.current = true;
                        setTimeout(() => {
                            setShowGrantedMessage(false);
                        }, 5000);
                    }
                    if (!isToastAlreadyShown()) {
                        showToast('success', '✅ Notifications enabled successfully!');
                    }
                } else {
                    showToast('info', 'Enable notifications anytime from your profile settings.', {
                        duration: 3000,
                    });
                }
            }
        } catch (error) {
            console.error('❌ Notification error:', error);
            showToast('error', 'Failed to enable notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const remindLater = () => {
        setShowPrompt(false);
        showToast('info', 'Enable notifications anytime from your profile settings.', {
            duration: 3000,
        });
    };

    const handleOpenBrowserSettings = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr')) {
            window.open('chrome://settings/content/notifications', '_blank');
        } 
        else if (userAgent.includes('firefox')) {
            window.open('about:preferences#privacy', '_blank');
        } 
        else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            showToast('info', 'Open Safari Preferences > Websites > Notifications', {
                duration: 5000,
            });
        } 
        else if (userAgent.includes('opr') || userAgent.includes('opera')) {
            window.open('opera://settings/content/notifications', '_blank');
        } 
        else if (userAgent.includes('edg')) {
            window.open('edge://settings/content/notifications', '_blank');
        } 
        else if (userAgent.includes('brave')) {
            window.open('brave://settings/content/notifications', '_blank');
        } 
        else {
            showToast('info', 'Check your browser settings for notification permissions.', {
                duration: 5000,
            });
        }
    };

    if (showGrantedMessage) {
        return (
            <div className="fixed top-16 left-0 right-0 z-[99999] px-4 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="bg-green-50 rounded-xl shadow-2xl p-4 border-l-4 border-green-500 animate-slide-down">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0">✅</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-800 text-sm">Notifications Enabled</h4>
                                <p className="text-xs text-green-600 mt-1">
                                    You will receive daily lessons at 6 AM.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowGrantedMessage(false);
                                    grantedShownRef.current = true;
                                }}
                                className="text-green-600 hover:text-green-800 text-sm font-medium flex-shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showBlockedMessage) {
        return (
            <div className="fixed top-16 left-0 right-0 z-[99999] px-4 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-red-500 animate-slide-down">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0">🔕</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 text-sm">Notifications Blocked</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    You blocked notifications. To enable them:
                                </p>
                                <ol className="text-xs text-gray-600 mt-2 space-y-1 list-decimal list-inside">
                                    <li>Click the <strong>🔒 lock icon</strong> in your browser's address bar</li>
                                    <li>Find <strong>Notifications</strong> and change to <strong>Allow</strong></li>
                                    <li>Refresh the page</li>
                                </ol>
                                <button
                                    onClick={handleOpenBrowserSettings}
                                    className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all"
                                >
                                    Open Settings 🔧
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!showPrompt || permissionStatus !== 'default') {
        return null;
    }

    return (
        <div className="fixed top-16 left-0 right-0 z-[99999] px-4 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-spark-500 animate-slide-down">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">🔔</div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm">Get Daily Lessons</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Receive your daily wealth lesson every morning at 6 AM
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                    onClick={enableNotifications}
                                    disabled={loading}
                                    className={`px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all flex-1 min-w-[100px] ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                                            : 'bg-gradient-to-r from-spark-500 to-spark-600 hover:shadow-md'
                                    }`}
                                >
                                    {loading ? '⏳ Enabling...' : 'Enable 🔔'}
                                </button>
                                {!loading && (
                                    <button
                                        onClick={remindLater}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all flex-1 min-w-[80px]"
                                    >
                                        Later
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}