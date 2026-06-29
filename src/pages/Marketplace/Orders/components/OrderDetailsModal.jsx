// src/pages/Marketplace/Orders/components/OrderDetailsModal.jsx
import React from 'react';

const statusColors = {
    'pending': { color: 'bg-gray-100 text-gray-700', label: '⏳ Pending' },
    'processing': { color: 'bg-yellow-100 text-yellow-700', label: '⚙️ Processing' },
    'dispatched': { color: 'bg-blue-100 text-blue-700', label: '📦 Dispatched' },
    'out_for_delivery': { color: 'bg-purple-100 text-purple-700', label: '🚚 Out for Delivery' },
    'delivered': { color: 'bg-green-100 text-green-700', label: '✅ Delivered' },
    'cancelled': { color: 'bg-red-100 text-red-700', label: '❌ Cancelled' }
};

export default function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Pending';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const status = statusColors[order.status] || statusColors['pending'];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                        <p className="text-sm text-gray-500">{order.orderId}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                            {status.label}
                        </span>
                        <span className="text-xs text-gray-400">
                            Order placed {formatDate(order.createdAt)}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">📋 Tracking Timeline</h4>
                        <div className="space-y-4">
                            {order.tracking.map((track, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${
                                            track.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                        {index < order.tracking.length - 1 && (
                                            <div className={`w-0.5 h-full min-h-[20px] ${
                                                track.completed ? 'bg-green-500' : 'bg-gray-300'
                                            }`} />
                                        )}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${
                                            track.completed ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                            {track.stage}
                                        </p>
                                        {track.time && (
                                            <p className="text-xs text-gray-400">
                                                {formatDate(track.time)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">🛒 Items</h4>
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                            {order.savings > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>You Saved</span>
                                    <span>{formatPrice(order.savings)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">📍 Delivery Address</h4>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}