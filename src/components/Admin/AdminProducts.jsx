// src/components/Admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getPendingProducts, 
    approveProduct, 
    rejectProduct,
    getAllOrders,
    updateOrderStatus,
    getMarketplaceStats
} from '../../services/marketplace';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtils';

export default function AdminProducts() {
    const { user } = useAuth();
    const [pendingProducts, setPendingProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [marketplaceOrders, setMarketplaceOrders] = useState([]);
    const [marketplaceStats, setMarketplaceStats] = useState(null);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');
    const [activeTab, setActiveTab] = useState('products');

    useEffect(() => {
        loadPendingProducts();
        loadMarketplaceOrders();
        loadMarketplaceStats();
    }, []);

    const loadPendingProducts = async () => {
        setProductsLoading(true);
        try {
            const data = await getPendingProducts();
            setPendingProducts(data || []);
        } catch (error) {
            console.error('Failed to load pending products:', error);
            toast.error('Failed to load pending products');
            setPendingProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    const loadMarketplaceOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await getAllOrders();
            setMarketplaceOrders(data || []);
        } catch (error) {
            console.error('Failed to load marketplace orders:', error);
            toast.error('Failed to load marketplace orders');
            setMarketplaceOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadMarketplaceStats = async () => {
        try {
            const data = await getMarketplaceStats();
            setMarketplaceStats(data);
        } catch (error) {
            console.error('Failed to load marketplace stats:', error);
        }
    };

    const handleApproveProduct = async (productId) => {
        try {
            await approveProduct(productId);
            toast.success('✅ Product approved!');
            loadPendingProducts();
            loadMarketplaceStats();
        } catch (error) {
            console.error('Failed to approve product:', error);
            toast.error('Failed to approve product');
        }
    };

    const handleRejectProduct = async (productId) => {
        if (!window.confirm('Reject this product?')) return;
        const reason = window.prompt('Enter reason for rejection:');
        if (reason === null) return;
        
        try {
            await rejectProduct(productId, reason);
            toast.success('❌ Product rejected');
            loadPendingProducts();
            loadMarketplaceStats();
        } catch (error) {
            console.error('Failed to reject product:', error);
            toast.error('Failed to reject product');
        }
    };

    const handleUpdateOrderStatus = async (orderId, stage) => {
        try {
            await updateOrderStatus(orderId, stage);
            toast.success(`Order status updated to ${stage}`);
            loadMarketplaceOrders();
            loadMarketplaceStats();
            setShowOrderModal(false);
        } catch (error) {
            console.error('Failed to update order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { color: 'bg-gray-100 text-gray-700', label: '⏳ Pending' },
            'processing': { color: 'bg-yellow-100 text-yellow-700', label: '⚙️ Processing' },
            'dispatched': { color: 'bg-blue-100 text-blue-700', label: '📦 Dispatched' },
            'out_for_delivery': { color: 'bg-purple-100 text-purple-700', label: '🚚 Out for Delivery' },
            'delivered': { color: 'bg-green-100 text-green-700', label: '✅ Delivered' },
            'cancelled': { color: 'bg-red-100 text-red-700', label: '❌ Cancelled' }
        };
        return statusMap[status] || statusMap['pending'];
    };

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            {marketplaceStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{marketplaceStats.totalOrders}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Revenue</p>
                        <p className="text-3xl font-bold text-spark-600 mt-1">{formatPrice(marketplaceStats.totalRevenue)}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Customer Savings</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{formatPrice(marketplaceStats.totalSavings)}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Active Products</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{marketplaceStats.totalProducts}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                        activeTab === 'products' 
                            ? 'text-spark-500 border-b-2 border-spark-500' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📦 Pending Products ({pendingProducts.filter(p => p.status === 'pending').length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                        activeTab === 'orders' 
                            ? 'text-spark-500 border-b-2 border-spark-500' 
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🛒 Orders ({marketplaceOrders.length})
                </button>
            </div>

            {/* Pending Products Tab */}
            {/* Pending Products Tab */}
{activeTab === 'products' && (
    <div>
        {productsLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
        ) : pendingProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Products</h3>
                <p className="text-gray-500">All products have been reviewed</p>
            </div>
        ) : (
            pendingProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all mb-4">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* ✅ FIXED: Show actual product image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {product.image ? (
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '';
                                                e.target.className = 'hidden';
                                                e.target.parentElement.innerHTML = `
                                                    <div class="w-full h-full flex items-center justify-center text-3xl bg-gray-100">
                                                        📦
                                                    </div>
                                                `;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100">
                                            📦
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500">By {product.sellerName || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400">{product.sellerEmail}</p>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                        ⏳ Pending
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApproveProduct(product.id)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all"
                                >
                                    ✅ Approve
                                </button>
                                <button
                                    onClick={() => handleRejectProduct(product.id)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all"
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Original Price</p>
                                <p className="text-lg font-bold text-gray-900 line-through">{formatPrice(product.originalPrice)}</p>
                            </div>
                            <div className="bg-spark-50 rounded-xl p-3 border border-spark-200">
                                <p className="text-xs text-gray-500">Discount Price</p>
                                <p className="text-lg font-bold text-spark-600">{formatPrice(product.discountPrice)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Discount</p>
                                <p className="text-lg font-bold text-green-600">{product.discount}% OFF</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500">Stock</p>
                                <p className="text-lg font-bold text-gray-900">{product.stock || 0}</p>
                            </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500">Description</p>
                            <p className="text-sm text-gray-700">{product.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Unit: {product.unit}</p>
                        </div>
                    </div>
                </div>
            ))
        )}
    </div>
)}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div>
                    {ordersLoading ? (
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                            <p className="text-gray-500 mt-4">Loading orders...</p>
                        </div>
                    ) : marketplaceOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🛒</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No Orders Yet</h3>
                            <p className="text-gray-500">No marketplace orders have been placed</p>
                        </div>
                    ) : (
                        marketplaceOrders.map(order => {
                            const status = getStatusBadge(order.status);
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all mb-4">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="font-semibold text-gray-900">{order.orderId}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Placed on {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setOrderStatus(order.status || 'pending');
                                                    setShowOrderModal(true);
                                                }}
                                                className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Total</p>
                                                <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Items</p>
                                                <p className="text-lg font-bold text-gray-900">{order.items?.length || 0}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Savings</p>
                                                <p className="text-lg font-bold text-green-600">{formatPrice(order.savings)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Customer</p>
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {order.userId?.slice(0, 8) || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500">Items</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {order.items?.map((item, index) => (
                                                    <span key={index} className="text-xs text-gray-600">
                                                        {item.quantity}x {item.name}
                                                        {index < order.items.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Order Status Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                }}>
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                    <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-4">
                                Update status for order <strong>{selectedOrder.orderId}</strong>
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={orderStatus}
                                        onChange={(e) => setOrderStatus(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    >
                                        <option value="pending">⏳ Pending</option>
                                        <option value="processing">⚙️ Processing</option>
                                        <option value="dispatched">📦 Dispatched</option>
                                        <option value="out_for_delivery">🚚 Out for Delivery</option>
                                        <option value="delivered">✅ Delivered</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowOrderModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, orderStatus)}
                                    className="flex-1 text-white font-semibold py-3 rounded-xl transition-all bg-spark-500 hover:bg-spark-600"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}