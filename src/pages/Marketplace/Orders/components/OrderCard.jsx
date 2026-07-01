// src/pages/Marketplace/Orders/components/OrderCard.jsx
import React from 'react';

const statusColors = {
    'pending': { color: 'bg-gray-100 text-gray-700', label: '⏳ Pending' },
    'processing': { color: 'bg-yellow-100 text-yellow-700', label: '⚙️ Processing' },
    'dispatched': { color: 'bg-blue-100 text-blue-700', label: '📦 Dispatched' },
    'out_for_delivery': { color: 'bg-purple-100 text-purple-700', label: '🚚 Out for Delivery' },
    'delivered': { color: 'bg-green-100 text-green-700', label: '✅ Delivered' },
    'cancelled': { color: 'bg-red-100 text-red-700', label: '❌ Cancelled' }
};

export default function OrderCard({ order, onTrackClick, onRateClick }) {
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

    const getOrderStatusProgress = (tracking) => {
        const completed = tracking.filter(t => t.completed).length;
        const total = tracking.length;
        return Math.round((completed / total) * 100);
    };

    const getProductImage = (item) => {
        return item.image || item.productImage || item.product_image || null;
    };

    const status = statusColors[order.status] || statusColors['pending'];
    const progress = getOrderStatusProgress(order.tracking);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <p className="font-semibold text-gray-900">{order.orderId}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.label}
                            </span>
                            {order.rated && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    ⭐ Rated
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                        </div>
                        {order.status === 'delivered' && !order.rated && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRateClick(order);
                                }}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition flex items-center gap-1 whitespace-nowrap"
                            >
                                ⭐ Rate
                            </button>
                        )}
                        <button
                            onClick={() => onTrackClick(order)}
                            className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition"
                        >
                            Track Order
                        </button>
                    </div>
                </div>

                {/* ✅ Items with Images */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                        {order.items.map((item, index) => {
                            const imageUrl = getProductImage(item);
                            return (
                                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    {/* Product Image */}
                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center text-sm bg-gray-100">
                                                            📦
                                                        </div>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-sm bg-gray-100">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {item.quantity}x {item.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Order Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-spark-400 to-spark-600 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}