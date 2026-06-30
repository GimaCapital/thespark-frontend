// src/pages/Marketplace/components/CartModal.jsx
import React, { useState } from 'react';

export default function CartModal({ 
    cart, 
    onClose, 
    onUpdateQuantity, 
    onRemove, 
    onCheckout, 
    balance,
    isProcessing
}) {
    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    };

    const getTotalSavings = () => {
        return cart.reduce((total, item) => 
            total + ((item.originalPrice - item.discountPrice) * item.quantity), 0
        );
    };

    // Category emojis as fallback
    const categoryEmojis = {
        'rice': '🍚',
        'garri': '🌽',
        'beans': '🫘',
        'oil': '🫒',
        'yam': '🍠',
        'grains': '🌾',
        'oils': '🫒',
        'others': '📦'
    };

    const getFallbackImage = (item) => {
        return item.emoji || categoryEmojis[item.category] || '📦';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">🛒 Your Cart</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="flex-1 p-6 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-500">Your cart is empty</p>
                        <p className="text-sm text-gray-400 mt-1">Add some food items to get started</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-2 bg-spark-500 text-white rounded-xl hover:bg-spark-600 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100">
                                    {/* ✅ FIXED: Show actual image or fallback */}
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                        {item.image && item.image !== '📦' ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                                                            ${getFallbackImage(item)}
                                                        </div>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                                                {getFallbackImage(item)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                        <p className="text-sm text-spark-600">{formatPrice(item.discountPrice)}</p>
                                        <p className="text-xs text-gray-400">{item.unit}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Total</span>
                                <span className="text-xl font-bold text-gray-900">{formatPrice(getTotalPrice())}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-500">You Save</span>
                                <span className="text-green-600 font-semibold">{formatPrice(getTotalSavings())}</span>
                            </div>
                            <button
                                onClick={onCheckout}
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                                    isProcessing 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-spark-400 to-spark-600 hover:from-spark-500 hover:to-spark-700'
                                }`}
                            >
                                {isProcessing ? '⏳ Processing...' : '💳 Checkout'}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-2">
                                Balance: {formatPrice(balance)}
                            </p>
                            <p className="text-[10px] text-gray-400 text-center mt-1">
                                📦 Delivery within 24-48 hours
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}