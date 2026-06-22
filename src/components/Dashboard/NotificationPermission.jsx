import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { requestNotificationPermission, onForegroundMessage } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function NotificationPermission() {
    const { user } = useAuth();
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [showPrompt, setShowPrompt] = useState(false);
    const [showBlockedMessage, setShowBlockedMessage] = useState(false);
    
    useEffect(() => {
        // Check current permission status
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
            
            if (Notification.permission === 'default') {
                setShowPrompt(true);
                setShowBlockedMessage(false);
            } else if (Notification.permission === 'denied') {
                // ✅ Show helpful message for blocked users
                setShowBlockedMessage(true);
                setShowPrompt(false);
            }
        }
        
        // Listen for foreground messages
        onForegroundMessage((payload) => {
            toast.success(payload.notification?.title, {
                duration: 5000,
                position: 'top-right'
            });
        });
    }, [user]); // ✅ Re-run when user logs in
    
    const saveFcmToken = async (token) => {
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post('/users/save-fcm-token', { fcmToken: token });
            setPermissionStatus('granted');
            setShowPrompt(false);
            setShowBlockedMessage(false);
            toast.success('Notifications enabled! You will receive daily lessons.');
        } catch (error) {
            console.error('Failed to save FCM token:', error);
        }
    };
    
    const enableNotifications = async () => {
        await requestNotificationPermission(user?.uid, saveFcmToken);
    };
    
    const remindLater = () => {
        setShowPrompt(false);
        toast.info('You can enable notifications anytime from settings.', {
            duration: 3000,
            position: 'top-right'
        });
    };
    
    const handleOpenBrowserSettings = () => {
        if (navigator.userAgent.includes('Chrome')) {
            window.open('chrome://settings/content/notifications', '_blank');
        } else if (navigator.userAgent.includes('Firefox')) {
            window.open('about:preferences#privacy', '_blank');
        } else if (navigator.userAgent.includes('Safari')) {
            toast.info('Open Safari Preferences > Websites > Notifications');
        } else {
            toast.info('Check your browser settings for notification permissions.');
        }
    };
    
    // ✅ Show blocked message
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
                                    className="px-4 py-2 bg-gradient-to-r from-spark-500 to-spark-600 text-white text-sm font-semibold rounded-xl hover:shadow-md transition-all flex-1 min-w-[100px]"
                                >
                                    Enable 🔔
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