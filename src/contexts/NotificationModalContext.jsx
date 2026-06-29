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

// src/contexts/NotificationModalContext.jsx
import React, { createContext, useContext, useState } from 'react';

const NotificationModalContext = createContext();

export function useNotificationModal() {
    return useContext(NotificationModalContext);
}

// Modal component
function NotificationModal({ notification, onClose }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Unknown date';
        }
    };

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

    const getStatusText = (type) => {
        const statuses = {
            // Deposit types
            'deposit_approved': 'Approved',
            'deposit_rejected': 'Rejected',
            'deposit_reversed': 'Reversed',
            // Withdrawal types
            'withdrawal_approved': 'Approved',
            'withdrawal_rejected': 'Rejected',
            'withdrawal_failed': 'Failed',
            'withdrawal_processing': 'Processing',
            'withdrawal_completed': 'Completed',
            // Product types
            'product_approved': 'Approved',
            'product_rejected': 'Rejected',
            'product_submitted': 'Pending',
            'product_updated': 'Updated',
            // Order types
            'order_placed': 'Placed',
            'order_processing': 'Processing',
            'order_dispatched': 'Dispatched',
            'order_out_for_delivery': 'Out for Delivery',
            'order_delivered': 'Delivered',
            'order_cancelled': 'Cancelled',
            'new_order': 'New',
            // Investment types
            'investment_interest': 'New',
            'investment_confirmation': 'Confirmed',
            // Generic
            'email_sent': 'Sent',
            'codes_generated': 'Generated'
        };
        return statuses[type] || 'Unknown';
    };

    const getStatusColor = (type) => {
        const colors = {
            // Deposit types
            'deposit_approved': 'bg-green-100 text-green-700',
            'deposit_rejected': 'bg-red-100 text-red-700',
            'deposit_reversed': 'bg-orange-100 text-orange-700',
            // Withdrawal types
            'withdrawal_approved': 'bg-blue-100 text-blue-700',
            'withdrawal_rejected': 'bg-red-100 text-red-700',
            'withdrawal_failed': 'bg-red-100 text-red-700',
            'withdrawal_processing': 'bg-yellow-100 text-yellow-700',
            'withdrawal_completed': 'bg-green-100 text-green-700',
            // Product types
            'product_approved': 'bg-green-100 text-green-700',
            'product_rejected': 'bg-red-100 text-red-700',
            'product_submitted': 'bg-yellow-100 text-yellow-700',
            'product_updated': 'bg-blue-100 text-blue-700',
            // Order types
            'order_placed': 'bg-blue-100 text-blue-700',
            'order_processing': 'bg-yellow-100 text-yellow-700',
            'order_dispatched': 'bg-purple-100 text-purple-700',
            'order_out_for_delivery': 'bg-indigo-100 text-indigo-700',
            'order_delivered': 'bg-green-100 text-green-700',
            'order_cancelled': 'bg-red-100 text-red-700',
            'new_order': 'bg-spark-100 text-spark-700',
            // Investment types
            'investment_interest': 'bg-purple-100 text-purple-700',
            'investment_confirmation': 'bg-green-100 text-green-700',
            // Generic
            'email_sent': 'bg-blue-100 text-blue-700',
            'codes_generated': 'bg-spark-100 text-spark-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
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
                        {/* Status */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-xs text-gray-500">Status</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(notification.type)}`}>
                                {getStatusText(notification.type)}
                            </span>
                        </div>
                        
                        {/* Amount - if present */}
                        {notification.amount !== undefined && notification.amount !== null && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-xs text-gray-500">Amount</span>
                                <span className="text-sm font-semibold text-spark-500">₦{notification.amount.toLocaleString()}</span>
                            </div>
                        )}
                        
                        {/* Product Name - if present */}
                        {notification.data?.productName && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-xs text-gray-500">Product</span>
                                <span className="text-sm font-medium text-gray-900">{notification.data.productName}</span>
                            </div>
                        )}
                        
                        {/* Order ID - if present */}
                        {notification.data?.orderId && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-xs text-gray-500">Order ID</span>
                                <span className="text-xs font-mono text-gray-600">{notification.data.orderId}</span>
                            </div>
                        )}
                        
                        {/* Admin Note - if present */}
                        {notification.resolveNote && (
                            <div className="bg-spark-50 rounded-xl p-3 mt-2">
                                <p className="text-xs font-semibold text-spark-600 mb-1">📝 Admin Note</p>
                                <p className="text-sm text-gray-700">{notification.resolveNote}</p>
                            </div>
                        )}
                        
                        {/* Transaction Reference - if present */}
                        {notification.flwReference && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Transaction Reference</p>
                                <p className="text-xs font-mono text-gray-600 break-all">{notification.flwReference}</p>
                            </div>
                        )}
                        
                        {/* Timestamp */}
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

// Add styles to document
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

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}