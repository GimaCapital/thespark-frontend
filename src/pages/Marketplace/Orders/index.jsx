// // src/pages/Marketplace/Orders/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getOrders } from '../../../services/marketplace';
import HeaderMissionCard from '../../../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import OrderCard from './components/OrderCard';
import OrderStats from './components/OrderStats';
import OrderDetailsModal from './components/OrderDetailsModal';

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

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
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTrackClick = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
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
        <div className="bg-gray-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📦 My Orders</h1>
                        <p className="text-sm text-gray-500">Track your food orders and delivery status</p>
                    </div>
                    <Link to="/marketplace" className="text-spark-500 hover:text-spark-600 text-sm font-medium">
                        ← Continue Shopping
                    </Link>
                </div>

                <OrderStats orders={orders} />

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center mt-6">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-500">Start shopping to place your first order</p>
                        <Link to="/marketplace" className="inline-block mt-4 px-6 py-2 bg-spark-500 text-white rounded-xl hover:bg-spark-600 transition">
                            🛒 Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 mt-6">
                        {orders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onTrackClick={handleTrackClick}
                            />
                        ))}
                    </div>
                )}
            </div>

           <OrderDetailsModal 
                order={selectedOrder} 
                open={!!selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        </div>
    );
}