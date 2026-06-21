import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { requestNotificationPermission, onForegroundMessage } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function NotificationPermission() {
    const { user } = useAuth();
    const [permissionStatus, setPermissionStatus] = useState('default');
    const [showPrompt, setShowPrompt] = useState(false);
    
    useEffect(() => {
        // Check current permission status
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
            
            // Show prompt if not granted and not denied
            if (Notification.permission === 'default') {
                setShowPrompt(true);
            }
        }
        
        // Listen for foreground messages
        onForegroundMessage((payload) => {
            toast.success(payload.notification?.title, {
                duration: 5000,
                position: 'top-right'
            });
        });
    }, []);
    
    const saveFcmToken = async (token) => {
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post('/users/save-fcm-token', { fcmToken: token });
            setPermissionStatus('granted');
            setShowPrompt(false);
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
        localStorage.setItem('notificationsReminded', Date.now());
    };
    
    if (!showPrompt || permissionStatus !== 'default') {
        return null;
    }
    
    return (
        // ✅ Fix: Position at top of screen (not bottom)
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