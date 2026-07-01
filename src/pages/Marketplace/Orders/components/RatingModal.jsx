// src/pages/Marketplace/Orders/components/RatingModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { api, setAuthToken } from '../../../../services/api';
import toast from 'react-hot-toast';
import { StarFilled, StarOutlined, CloseOutlined, ShopOutlined } from '@ant-design/icons';

export default function RatingModal({ order, onClose, onSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [sellerRating, setSellerRating] = useState(5);
    const [sellerComment, setSellerComment] = useState('');
    const [overallRating, setOverallRating] = useState(0);

    // Initialize ratings for each product
    useEffect(() => {
        if (order && order.items) {
            const initialRatings = order.items.map(item => ({
                productId: item.productId || item.id,
                productName: item.name,
                rating: 5,
                comment: '',
                image: item.image || item.productImage || item.product_image || null, // ✅ Try multiple fields
                emoji: item.emoji || '📦'
            }));
            setRatings(initialRatings);
            calculateOverall(initialRatings);
        }
    }, [order]);

    const calculateOverall = (ratingsList) => {
        const total = ratingsList.reduce((sum, r) => sum + r.rating, 0);
        setOverallRating(ratingsList.length > 0 ? total / ratingsList.length : 0);
    };

    const updateRating = (index, value) => {
        const newRatings = [...ratings];
        newRatings[index].rating = value;
        setRatings(newRatings);
        calculateOverall(newRatings);
    };

    const updateComment = (index, value) => {
        const newRatings = [...ratings];
        newRatings[index].comment = value;
        setRatings(newRatings);
    };

    const handleSubmit = async () => {
        // Check if all products have ratings
        const unrated = ratings.filter(r => r.rating === 0);
        if (unrated.length > 0) {
            toast.error('Please rate all products');
            return;
        }

        if (sellerRating === 0) {
            toast.error('Please rate the seller');
            return;
        }

        setSubmitting(true);
        try {
            const token = await user.getIdToken();
            setAuthToken(token);

            // Submit product ratings
            const response = await api.post(`/marketplace/orders/${order.orderId}/rate`, {
                ratings: ratings.map(r => ({
                    productId: r.productId,
                    rating: r.rating,
                    comment: r.comment
                })),
                sellerRating: sellerRating,
                sellerComment: sellerComment
            });

            if (response.data.success) {
                toast.success('⭐ Thank you for your ratings!');
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error submitting ratings:', error);
            toast.error(error.response?.data?.error || 'Failed to submit ratings');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, onClick, size = 'text-3xl') => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    onClick={() => onClick(i)}
                    className={`${size} focus:outline-none hover:scale-110 transition transform`}
                >
                    {i <= rating ? (
                        <StarFilled className="text-yellow-400" />
                    ) : (
                        <StarOutlined className="text-gray-300" />
                    )}
                </button>
            );
        }
        return stars;
    };

    const getProductImage = (item) => {
        // Check multiple possible image fields
        if (item.image && item.image !== '📦') {
            return item.image;
        }
        if (item.productImage && item.productImage !== '📦') {
            return item.productImage;
        }
        if (item.product_image && item.product_image !== '📦') {
            return item.product_image;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">⭐ Rate Your Order</h3>
                        <p className="text-sm text-gray-500">Rate products and the seller</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseOutlined />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* ========== SELLER RATING ========== */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <ShopOutlined className="text-blue-500 text-xl" />
                            <h4 className="font-semibold text-gray-900">Rate the Seller</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            How was your experience with {order.sellerName || 'this seller'}?
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {renderStars(sellerRating, setSellerRating, 'text-2xl')}
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                {sellerRating}/5
                            </span>
                        </div>
                        <input
                            type="text"
                            value={sellerComment}
                            onChange={(e) => setSellerComment(e.target.value)}
                            placeholder="Share your experience with the seller..."
                            className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* ========== PRODUCT RATINGS ========== */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Rate Each Product</h4>
                        {ratings.map((item, index) => {
                            const imageUrl = getProductImage(item);
                            return (
                                <div key={index} className="border border-gray-200 rounded-xl p-4 mb-3 hover:border-spark-300 transition">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `
                                                            <div class="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                                                                ${item.emoji || '📦'}
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-100">
                                                    {item.emoji || '📦'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">
                                                {item.productName}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex gap-0.5">
                                                    {renderStars(item.rating, (val) => updateRating(index, val), 'text-xl')}
                                                </div>
                                                <span className="text-xs text-gray-400">{item.rating}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.comment}
                                        onChange={(e) => updateComment(index, e.target.value)}
                                        placeholder={`Optional: Share your experience with ${item.productName}...`}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm text-gray-500">
                            {ratings.length} product{ratings.length > 1 ? 's' : ''} + Seller
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
                            >
                                Later
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`px-6 py-2 text-white font-medium rounded-lg transition ${
                                    submitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-spark-500 hover:bg-spark-600 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {submitting ? 'Submitting...' : 'Submit Ratings'}
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        ⭐ Your ratings help other buyers and sellers
                    </p>
                </div>
            </div>
        </div>
    );
}