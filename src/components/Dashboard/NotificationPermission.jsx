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
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-spark-500">
                <div className="flex items-start gap-3">
                    <div className="text-2xl">🔔</div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">Get Daily Lessons</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Receive your daily wealth lesson every morning at 6 AM
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={enableNotifications}
                                className="btn btn-primary btn-sm"
                            >
                                Enable Notifications
                            </button>
                            <button
                                onClick={remindLater}
                                className="btn btn-secondary btn-sm"
                            >
                                Remind Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}