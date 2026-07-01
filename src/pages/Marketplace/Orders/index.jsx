// src/pages/Marketplace/Orders/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getOrders } from '../../../services/marketplace';
import { Link } from 'react-router-dom';
import OrderCard from './components/OrderCard';
import OrderStats from './components/OrderStats';
import OrderDetailsModal from './components/OrderDetailsModal';
import RatingModal from './components/RatingModal';
import toast from 'react-hot-toast';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleTrackOrder = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const openRatingModal = (order) => {
        setSelectedOrderForRating(order);
        setShowRatingModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📦 My Orders</h1>
                    <p className="text-sm text-gray-500">Track your food orders and delivery status</p>
                </div>
                <Link 
                    to="/marketplace" 
                    className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition shadow-md hover:shadow-lg"
                >
                    ← Continue Shopping
                </Link>
            </div>

            {/* Order Stats */}
            <OrderStats orders={orders} />

            {/* Orders List */}
            <div className="mt-6 space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <span className="text-6xl block mb-4">📦</span>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-500 mb-4">Start shopping and your orders will appear here</p>
                        <Link 
                            to="/marketplace" 
                            className="inline-block px-6 py-3 bg-spark-500 hover:bg-spark-600 text-white font-medium rounded-xl transition shadow-md hover:shadow-lg"
                        >
                            🛒 Start Shopping
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onTrackClick={handleTrackOrder}
                            onRateClick={openRatingModal}
                        />
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal 
                order={selectedOrder} 
                open={showDetailsModal} 
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                }} 
            />

            {/* Rating Modal */}
            {showRatingModal && selectedOrderForRating && (
                <RatingModal
                    order={selectedOrderForRating}
                    onClose={() => {
                        setShowRatingModal(false);
                        setSelectedOrderForRating(null);
                    }}
                    onSuccess={() => {
                        loadOrders();
                    }}
                />
            )}
        </div>
    );
}