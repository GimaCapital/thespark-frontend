import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { requestNotificationPermission, onForegroundMessage } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function NotificationPermission() {
    const { user } = useAuth();
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [showPrompt, setShowPrompt] = useState(false);
    const [showBlockedMessage, setShowBlockedMessage] = useState(false);
    const [showGrantedMessage, setShowGrantedMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const checkInterval = useRef(null);

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
                setShowGrantedMessage(true);
            } else if (status === 'denied') {
                setShowBlockedMessage(true);
                setShowPrompt(false);
                setShowGrantedMessage(false);
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
                duration: 5000,
                position: 'bottom-right'  // ✅ Changed to bottom-right
            });
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (checkInterval.current) {
                clearInterval(checkInterval.current);
            }
        };
    }, [user]);

    const saveFcmToken = async (token) => {
        try {
            if (!user) {
                console.error('❌ No user logged in');
                toast.error('Please login first', {
                    position: 'bottom-right'  // ✅ Changed to bottom-right
                });
                return;
            }
            
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post('/users/save-fcm-token', { fcmToken: token });
            checkPermissionStatus();
            toast.success('✅ Notifications enabled!', {
                position: 'bottom-right'  // ✅ Changed to bottom-right
            });
        } catch (error) {
            console.error('Failed to save FCM token:', error);
            toast.error('Failed to save notification settings.', {
                position: 'bottom-right'  // ✅ Changed to bottom-right
            });
        }
    };

    const enableNotifications = async () => {
        setLoading(true);
        
        try {
            if (!user) {
                toast.error('Please login first', {
                    position: 'bottom-right'  // ✅ Changed to bottom-right
                });
                setLoading(false);
                return;
            }

            if (Notification.permission === 'granted') {
                toast.success('✅ Already enabled!', {
                    position: 'bottom-right'  // ✅ Changed to bottom-right
                });
                setShowGrantedMessage(true);
                setShowPrompt(false);
                setLoading(false);
                return;
            }
            
            if (Notification.permission === 'denied') {
                setShowBlockedMessage(true);
                setShowPrompt(false);
                toast.error('Notifications are blocked.', {
                    position: 'bottom-right'  // ✅ Changed to bottom-right
                });
                setLoading(false);
                return;
            }
            
            // ✅ Toast at bottom-right so it doesn't hide behind the banner
            toast('🔔 Please allow notifications when prompted.', {
                duration: 5000,
                position: 'bottom-right'  // ✅ Changed from top-center to bottom-right
            });

            const result = await requestNotificationPermission(user?.uid, saveFcmToken);

            if (result) {
                setShowPrompt(false);
                setShowGrantedMessage(true);
                toast.success('✅ Notifications enabled!', {
                    position: 'bottom-right'
                });
            } else {
                if (Notification.permission === 'denied') {
                    setShowBlockedMessage(true);
                    setShowPrompt(false);
                } else {
                    toast('You can enable notifications later.', {
                        duration: 3000,
                        position: 'bottom-right'
                    });
                }
            }
        } catch (error) {
            console.error('❌ Notification error:', error);
            toast.error('Failed to enable notifications.', {
                position: 'bottom-right'
            });
        } finally {
            setLoading(false);
        }
    };

    const remindLater = () => {
        setShowPrompt(false);
        toast('You can enable anytime from settings.', {
            duration: 3000,
            position: 'bottom-right'  // ✅ Changed to bottom-right
        });
    };

    const handleOpenBrowserSettings = () => {
        if (navigator.userAgent.includes('Chrome')) {
            window.open('chrome://settings/content/notifications', '_blank');
        } else if (navigator.userAgent.includes('Firefox')) {
            window.open('about:preferences#privacy', '_blank');
        } else if (navigator.userAgent.includes('Safari')) {
            toast('Open Safari Preferences > Websites > Notifications', {
                duration: 5000,
                position: 'bottom-right'
            });
        } else {
            toast('Check your browser settings.', {
                duration: 5000,
                position: 'bottom-right'
            });
        }
    };

    // Show already granted message
    if (showGrantedMessage) {
        return (
            <div className="fixed bottom-4 left-0 right-0 z-[9999] px-4 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="bg-green-50 rounded-xl shadow-2xl p-4 border-l-4 border-green-500 animate-slide-up">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl flex-shrink-0">✅</div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-800 text-sm">Notifications Enabled</h4>
                                <p className="text-xs text-green-600 mt-1">
                                    You will receive daily lessons at 6 AM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show blocked message
    if (showBlockedMessage) {
        return (
            <div className="fixed top-4 left-0 right-0 z-[9999] px-4 pointer-events-none">
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

    // Show normal prompt
    if (!showPrompt || permissionStatus !== 'default') {
        return null;
    }

    return (
        <div className="fixed top-4 left-0 right-0 z-[9999] px-4 pointer-events-none">
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
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-spark-500 to-spark-600 hover:shadow-md'
                                    }`}
                                >
                                    {loading ? 'Loading...' : 'Enable 🔔'}
                                </button>
                                <button
                                    onClick={remindLater}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all flex-1 min-w-[80px]"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}