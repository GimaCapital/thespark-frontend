// src/pages/Marketplace/Orders/components/OrderStats.jsx
import React from 'react';

export default function OrderStats({ orders }) {
    const total = orders.length;
    const processing = orders.filter(o => o.status === 'processing' || o.status === 'pending').length;
    const transit = orders.filter(o => o.status === 'dispatched' || o.status === 'out_for_delivery').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-yellow-600">{processing}</p>
                <p className="text-xs text-gray-500">Processing</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-blue-600">{transit}</p>
                <p className="text-xs text-gray-500">In Transit</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-2xl font-bold text-green-600">{delivered}</p>
                <p className="text-xs text-gray-500">Delivered</p>
            </div>
        </div>
    );
}