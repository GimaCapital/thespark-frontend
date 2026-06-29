// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebase';
// import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
// import { useAuth } from '../contexts/AuthContext';
// import { useNotificationModal } from '../contexts/NotificationModalContext';

// export default function NotificationBell() {
//     const { user } = useAuth();
//     const { openNotificationModal } = useNotificationModal();
//     const [notifications, setNotifications] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//         if (!user) return;

//         const q = query(
//             collection(db, 'notifications'),
//             where('userId', '==', user.uid)
//         );

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const notifs = [];
//             snapshot.forEach(doc => {
//                 notifs.push({ id: doc.id, ...doc.data() });
//             });
//             notifs.sort((a, b) => {
//                 const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//                 const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//                 return dateB - dateA;
//             });
//             setNotifications(notifs);
//         });

//         return () => unsubscribe();
//     }, [user]);

//     const markAsRead = async (id) => {
//         try {
//             await updateDoc(doc(db, 'notifications', id), { read: true });
//         } catch (error) {
//             console.error('Error marking as read:', error);
//         }
//     };

//     const markAllAsRead = async () => {
//         const unreadNotifs = notifications.filter(n => !n.read);
//         for (const notif of unreadNotifs) {
//             await markAsRead(notif.id);
//         }
//     };

//     const handleNotificationClick = (notif) => {
//         if (!notif.read) {
//             markAsRead(notif.id);
//         }
//         setIsOpen(false);
//         openNotificationModal(notif);
//     };

//     const unreadCount = notifications.filter(n => !n.read).length;

//     const getIcon = (type) => {
//         if (type === 'deposit_approved') return '✅';
//         if (type === 'deposit_rejected') return '❌';
//         if (type === 'deposit_reversed') return '🔄';
//         return '🔔';
//     };

//     const getIconColor = (type) => {
//         if (type === 'deposit_approved') return 'bg-green-100 text-green-600';
//         if (type === 'deposit_rejected') return 'bg-red-100 text-red-600';
//         if (type === 'deposit_reversed') return 'bg-orange-100 text-orange-600';
//         return 'bg-gray-100 text-gray-600';
//     };

//     const formatDate = (timestamp) => {
//         if (!timestamp) return 'Just now';
//         try {
//             const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//             return date.toLocaleString();
//         } catch (e) {
//             return 'Unknown date';
//         }
//     };

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//                 <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
//                         {unreadCount > 99 ? '99+' : unreadCount}
//                     </span>
//                 )}
//             </button>

//             {isOpen && (
//                 <>
//                     <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
//                     <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
//                         <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
//                             <div>
//                                 <h3 className="font-semibold text-gray-900">Notifications</h3>
//                                 <p className="text-xs text-gray-500">{notifications.length} total</p>
//                             </div>
//                             {unreadCount > 0 && (
//                                 <button
//                                     onClick={markAllAsRead}
//                                     className="text-xs text-spark-500 hover:text-spark-600 font-medium"
//                                 >
//                                     Mark all read
//                                 </button>
//                             )}
//                         </div>

//                         {notifications.length === 0 ? (
//                             <div className="p-8 text-center">
//                                 <div className="text-5xl mb-3">🔔</div>
//                                 <p className="text-gray-500 font-medium">No notifications</p>
//                                 <p className="text-xs text-gray-400 mt-1">When you get notifications, they'll appear here</p>
//                             </div>
//                         ) : (
//                             <div className="divide-y divide-gray-100">
//                                 {notifications.map(notif => (
//                                     <div
//                                         key={notif.id}
//                                         onClick={() => handleNotificationClick(notif)}
//                                         className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
//                                             !notif.read ? 'bg-spark-50' : 'bg-white'
//                                         }`}
//                                     >
//                                         <div className="flex gap-3">
//                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notif.type)}`}>
//                                                 <span className="text-sm">{getIcon(notif.type)}</span>
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
//                                                 <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
//                                                 <p className="text-xs text-gray-400 mt-2">{formatDate(notif.createdAt)}</p>
//                                             </div>
//                                             {!notif.read && (
//                                                 <div className="w-2 h-2 bg-spark-500 rounded-full flex-shrink-0 mt-2"></div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }


// src/components/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationModal } from '../contexts/NotificationModalContext';

export default function NotificationBell() {
    const { user } = useAuth();
    const { openNotificationModal } = useNotificationModal();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = [];
            snapshot.forEach(doc => {
                notifs.push({ id: doc.id, ...doc.data() });
            });
            notifs.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });
            setNotifications(notifs);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await updateDoc(doc(db, 'notifications', id), { read: true });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const unreadNotifs = notifications.filter(n => !n.read);
        for (const notif of unreadNotifs) {
            await markAsRead(notif.id);
        }
    };

    const handleNotificationClick = (notif) => {
        if (!notif.read) {
            markAsRead(notif.id);
        }
        setIsOpen(false);
        openNotificationModal(notif);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // ✅ COMPLETE: All notification types supported
    const getIcon = (type) => {
        const icons = {
            // Deposit types
            'deposit_approved': '✅',
            'deposit_rejected': '❌',
            'deposit_reversed': '🔄',
            // Withdrawal types
            'withdrawal_approved': '💳',
            'withdrawal_rejected': '🚫',
            'withdrawal_failed': '⚠️',
            'withdrawal_processing': '⏳',
            'withdrawal_completed': '✅',
            // Product types
            'product_approved': '✅',
            'product_rejected': '❌',
            'product_submitted': '📦',
            'product_updated': '🔄',
            // Order types
            'order_placed': '📦',
            'order_processing': '⚙️',
            'order_dispatched': '🚚',
            'order_out_for_delivery': '🚚',
            'order_delivered': '✅',
            'order_cancelled': '❌',
            'new_order': '🛒',
            // Investment types
            'investment_interest': '📈',
            'investment_confirmation': '✅',
            // Generic
            'email_sent': '📧',
            'codes_generated': '🔑'
        };
        return icons[type] || '🔔';
    };

    const getIconColor = (type) => {
        const colors = {
            // Deposit types
            'deposit_approved': 'bg-green-100 text-green-600',
            'deposit_rejected': 'bg-red-100 text-red-600',
            'deposit_reversed': 'bg-orange-100 text-orange-600',
            // Withdrawal types
            'withdrawal_approved': 'bg-blue-100 text-blue-600',
            'withdrawal_rejected': 'bg-red-100 text-red-600',
            'withdrawal_failed': 'bg-red-100 text-red-600',
            'withdrawal_processing': 'bg-yellow-100 text-yellow-600',
            'withdrawal_completed': 'bg-green-100 text-green-600',
            // Product types
            'product_approved': 'bg-green-100 text-green-600',
            'product_rejected': 'bg-red-100 text-red-600',
            'product_submitted': 'bg-yellow-100 text-yellow-600',
            'product_updated': 'bg-blue-100 text-blue-600',
            // Order types
            'order_placed': 'bg-blue-100 text-blue-600',
            'order_processing': 'bg-yellow-100 text-yellow-600',
            'order_dispatched': 'bg-purple-100 text-purple-600',
            'order_out_for_delivery': 'bg-indigo-100 text-indigo-600',
            'order_delivered': 'bg-green-100 text-green-600',
            'order_cancelled': 'bg-red-100 text-red-600',
            'new_order': 'bg-spark-100 text-spark-600',
            // Investment types
            'investment_interest': 'bg-purple-100 text-purple-600',
            'investment_confirmation': 'bg-green-100 text-green-600',
            // Generic
            'email_sent': 'bg-blue-100 text-blue-600',
            'codes_generated': 'bg-spark-100 text-spark-600'
        };
        return colors[type] || 'bg-gray-100 text-gray-600';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Unknown date';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <p className="text-xs text-gray-500">{notifications.length} total</p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-spark-500 hover:text-spark-600 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-5xl mb-3">🔔</div>
                                <p className="text-gray-500 font-medium">No notifications</p>
                                <p className="text-xs text-gray-400 mt-1">When you get notifications, they'll appear here</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                                            !notif.read ? 'bg-spark-50' : 'bg-white'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notif.type)}`}>
                                                <span className="text-sm">{getIcon(notif.type)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                                                <p className="text-xs text-gray-400 mt-2">{formatDate(notif.createdAt)}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-spark-500 rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}