// src/pages/Marketplace/ProductDetail/components/ProductReviews.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../../services/api';
import { StarFilled, StarOutlined } from '@ant-design/icons';

export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/marketplace/products/${productId}/ratings`);
            if (response.data.success) {
                setReviews(response.data.ratings || []);
                setStats({
                    averageRating: response.data.averageRating || 0,
                    totalRatings: response.data.totalRatings || 0,
                    distribution: response.data.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                });
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<StarFilled key={i} className="text-yellow-400 text-sm" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="relative inline-block">
                        <StarOutlined className="text-yellow-400 text-sm" />
                        <span className="absolute inset-0 overflow-hidden w-1/2">
                            <StarFilled className="text-yellow-400 text-sm" />
                        </span>
                    </span>
                );
            } else {
                stars.push(<StarOutlined key={i} className="text-gray-300 text-sm" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-4 text-gray-500">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Customer Reviews</h3>

            {/* Summary */}
            <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                        {stats.totalRatings > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                    </p>
                    <div className="flex gap-0.5 mt-1">
                        {stats.totalRatings > 0 ? (
                            renderStars(stats.averageRating)
                        ) : (
                            <span className="text-gray-300 text-sm">☆☆☆☆☆</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.totalRatings} reviews</p>
                </div>

                {/* Rating Distribution - Only show if there are ratings */}
                {stats.totalRatings > 0 && (
                    <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.distribution[star] || 0;
                            const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-600 w-4">{star}</span>
                                    <StarFilled className="text-yellow-400 text-[10px]" />
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-400 w-6 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-spark-100 flex items-center justify-center text-spark-500 text-sm font-bold">
                                        {review.reviewerName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {review.reviewerName || 'Anonymous'}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            {renderStars(review.rating)}
                                            <span className="text-xs text-gray-400 ml-1">
                                                ({review.rating}/5)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}