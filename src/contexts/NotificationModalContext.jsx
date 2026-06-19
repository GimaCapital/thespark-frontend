// import React, { createContext, useContext, useState } from 'react';

// const NotificationModalContext = createContext();

// export function useNotificationModal() {
//     return useContext(NotificationModalContext);
// }

// export function NotificationModalProvider({ children }) {
//     const [selectedNotification, setSelectedNotification] = useState(null);

//     const openNotificationModal = (notification) => {
//         setSelectedNotification(notification);
//     };

//     const closeNotificationModal = () => {
//         setSelectedNotification(null);
//     };

//     return (
//         <NotificationModalContext.Provider value={{ openNotificationModal, closeNotificationModal, selectedNotification }}>
//             {children}
//             {selectedNotification && (
//                 <NotificationModal 
//                     notification={selectedNotification} 
//                     onClose={closeNotificationModal} 
//                 />
//             )}
//         </NotificationModalContext.Provider>
//     );
// }

// // Modal component
// function NotificationModal({ notification, onClose }) {
//     const formatDate = (timestamp) => {
//         if (!timestamp) return 'Just now';
//         try {
//             const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//             return date.toLocaleString();
//         } catch (e) {
//             return 'Unknown date';
//         }
//     };

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

//     // Prevent body scroll when modal is open
//     React.useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, []);

//     return (
//         <div 
//             className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
//             style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
//             onClick={onClose}
//         >
//             <div 
//                 className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeInUp"
//                 onClick={e => e.stopPropagation()}
//                 style={{
//                     animation: 'fadeInUp 0.3s ease-out'
//                 }}
//             >
//                 {/* Modal Header */}
//                 <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
//                             <span className="text-lg">{getIcon(notification.type)}</span>
//                         </div>
//                         <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
//                     </div>
//                     <button 
//                         onClick={onClose} 
//                         className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//                     >
//                         <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     </button>
//                 </div>
                
//                 {/* Modal Body */}
//                 <div className="p-5 space-y-4">
//                     {/* Full Message */}
//                     <div className="bg-gray-50 rounded-xl p-4">
//                         <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
//                     </div>
                    
//                     {/* Additional Details */}
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                             <span className="text-xs text-gray-500">Status</span>
//                             <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//                                 notification.type === 'deposit_approved' ? 'bg-green-100 text-green-700' :
//                                 notification.type === 'deposit_rejected' ? 'bg-red-100 text-red-700' :
//                                 'bg-orange-100 text-orange-700'
//                             }`}>
//                                 {notification.type === 'deposit_approved' ? 'Approved' :
//                                  notification.type === 'deposit_rejected' ? 'Rejected' : 'Reversed'}
//                             </span>
//                         </div>
                        
//                         {notification.amount && (
//                             <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                                 <span className="text-xs text-gray-500">Amount</span>
//                                 <span className="text-sm font-semibold text-spark-500">₦{notification.amount.toLocaleString()}</span>
//                             </div>
//                         )}
                        
//                         {notification.resolveNote && (
//                             <div className="bg-spark-50 rounded-xl p-3 mt-2">
//                                 <p className="text-xs font-semibold text-spark-600 mb-1">📝 Admin Note</p>
//                                 <p className="text-sm text-gray-700">{notification.resolveNote}</p>
//                             </div>
//                         )}
                        
//                         {notification.flwReference && (
//                             <div className="bg-gray-50 rounded-xl p-3">
//                                 <p className="text-xs font-semibold text-gray-500 mb-1">Transaction Reference</p>
//                                 <p className="text-xs font-mono text-gray-600 break-all">{notification.flwReference}</p>
//                             </div>
//                         )}
                        
//                         <div className="flex justify-between items-center pt-2">
//                             <span className="text-xs text-gray-400">Received</span>
//                             <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
//                         </div>
//                     </div>
                    
//                     {/* Action Button */}
//                     <button
//                         onClick={onClose}
//                         className="w-full py-3 bg-spark-500 hover:bg-spark-600 text-white font-semibold rounded-xl transition-all mt-4"
//                     >
//                         Got it
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Add this to your global CSS or index.css
// const styles = `
//     @keyframes fadeInUp {
//         from {
//             opacity: 0;
//             transform: translateY(30px);
//         }
//         to {
//             opacity: 1;
//             transform: translateY(0);
//         }
//     }
// `;

// // Add styles to document
// if (typeof document !== 'undefined') {
//     const styleSheet = document.createElement("style");
//     styleSheet.textContent = styles;
//     document.head.appendChild(styleSheet);
// }


import React, { createContext, useContext, useState } from 'react';

const NotificationModalContext = createContext();

export function useNotificationModal() {
    return useContext(NotificationModalContext);
}

export function NotificationModalProvider({ children }) {
    const [selectedNotification, setSelectedNotification] = useState(null);

    const openNotificationModal = (notification) => {
        setSelectedNotification(notification);
    };

    const closeNotificationModal = () => {
        setSelectedNotification(null);
    };

    return (
        <NotificationModalContext.Provider value={{ openNotificationModal, closeNotificationModal, selectedNotification }}>
            {children}
            {selectedNotification && (
                <NotificationModal 
                    notification={selectedNotification} 
                    onClose={closeNotificationModal} 
                />
            )}
        </NotificationModalContext.Provider>
    );
}

// Modal component
function NotificationModal({ notification, onClose }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleString();
        } catch (e) {
            return 'Unknown date';
        }
    };

    // ✅ UPDATED: Added withdrawal support
    const getIcon = (type) => {
        if (type === 'deposit_approved') return '✅';
        if (type === 'deposit_rejected') return '❌';
        if (type === 'deposit_reversed') return '🔄';
        // 👇 ADDED: Withdrawal types
        if (type === 'withdrawal_approved') return '💳';
        if (type === 'withdrawal_rejected') return '🚫';
        if (type === 'withdrawal_failed') return '⚠️';
        if (type === 'withdrawal_processing') return '⏳';
        if (type === 'withdrawal_completed') return '✅';
        return '🔔';
    };

    // ✅ UPDATED: Added withdrawal support
    const getIconColor = (type) => {
        if (type === 'deposit_approved') return 'bg-green-100 text-green-600';
        if (type === 'deposit_rejected') return 'bg-red-100 text-red-600';
        if (type === 'deposit_reversed') return 'bg-orange-100 text-orange-600';
        // 👇 ADDED: Withdrawal types
        if (type === 'withdrawal_approved') return 'bg-blue-100 text-blue-600';
        if (type === 'withdrawal_rejected') return 'bg-red-100 text-red-600';
        if (type === 'withdrawal_failed') return 'bg-red-100 text-red-600';
        if (type === 'withdrawal_processing') return 'bg-yellow-100 text-yellow-600';
        if (type === 'withdrawal_completed') return 'bg-green-100 text-green-600';
        return 'bg-gray-100 text-gray-600';
    };

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeInUp"
                onClick={e => e.stopPropagation()}
                style={{
                    animation: 'fadeInUp 0.3s ease-out'
                }}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                            <span className="text-lg">{getIcon(notification.type)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-5 space-y-4">
                    {/* Full Message */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                    </div>
                    
                    {/* Additional Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-xs text-gray-500">Status</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                // ✅ UPDATED: Added withdrawal support
                                notification.type === 'deposit_approved' ? 'bg-green-100 text-green-700' :
                                notification.type === 'deposit_rejected' ? 'bg-red-100 text-red-700' :
                                notification.type === 'deposit_reversed' ? 'bg-orange-100 text-orange-700' :
                                // 👇 ADDED: Withdrawal types
                                notification.type === 'withdrawal_approved' ? 'bg-blue-100 text-blue-700' :
                                notification.type === 'withdrawal_rejected' ? 'bg-red-100 text-red-700' :
                                notification.type === 'withdrawal_failed' ? 'bg-red-100 text-red-700' :
                                notification.type === 'withdrawal_processing' ? 'bg-yellow-100 text-yellow-700' :
                                notification.type === 'withdrawal_completed' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {notification.type === 'deposit_approved' ? 'Approved' :
                                 notification.type === 'deposit_rejected' ? 'Rejected' :
                                 notification.type === 'deposit_reversed' ? 'Reversed' :
                                 // 👇 ADDED: Withdrawal types
                                 notification.type === 'withdrawal_approved' ? 'Approved' :
                                 notification.type === 'withdrawal_rejected' ? 'Rejected' :
                                 notification.type === 'withdrawal_failed' ? 'Failed' :
                                 notification.type === 'withdrawal_processing' ? 'Processing' :
                                 notification.type === 'withdrawal_completed' ? 'Completed' :
                                 'Unknown'}
                            </span>
                        </div>
                        
                        {notification.amount && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-semibold text-spark-500">₦{notification.amount.toLocaleString()}</span>
                            </div>
                        )}
                        
                        {notification.resolveNote && (
                            <div className="bg-spark-50 rounded-xl p-3 mt-2">
                                <p className="text-xs font-semibold text-spark-600 mb-1">📝 Admin Note</p>
                                <p className="text-sm text-gray-700">{notification.resolveNote}</p>
                            </div>
                        )}
                        
                        {notification.flwReference && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Transaction Reference</p>
                                <p className="text-xs font-mono text-gray-600 break-all">{notification.flwReference}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-gray-400">Received</span>
                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                        </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-spark-500 hover:bg-spark-600 text-white font-semibold rounded-xl transition-all mt-4"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

// Add this to your global CSS or index.css
const styles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Add styles to document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}