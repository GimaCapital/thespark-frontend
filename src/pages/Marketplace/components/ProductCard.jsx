// src/pages/Marketplace/components/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FireOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

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

const ProductImage = ({ product }) => {
    const [imageError, setImageError] = useState(false);

    if (product.image && !imageError) {
        return (
            <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spark-50 to-amber-50">
            <span className="text-5xl">
                {product.emoji || categoryEmojis[product.category] || '📦'}
            </span>
        </div>
    );
};

// Render stars for rating
const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<StarFilled key={i} className="text-yellow-400 text-[10px]" />);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <span key={i} className="relative inline-block">
                    <StarOutlined className="text-yellow-400 text-[10px]" />
                    <span className="absolute inset-0 overflow-hidden w-1/2">
                        <StarFilled className="text-yellow-400 text-[10px]" />
                    </span>
                </span>
            );
        } else {
            stars.push(<StarOutlined key={i} className="text-gray-300 text-[10px]" />);
        }
    }
    return stars;
};

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    const handleCardClick = () => {
        navigate(`/marketplace/product/${product.id}`);
    };

    // Calculate rating (if product has ratings)
    const rating = product.averageRating || 0;
    const ratingCount = product.ratingCount || 0;

    return (
        <div 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
            onClick={handleCardClick}
        >
            {/* Product Image */}
            <div className="relative h-44 bg-gray-100 overflow-hidden">
                <ProductImage product={product} />
                
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{product.discountPercentage}%
                    </div>
                )}
                
                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Only {product.stock} left
                    </div>
                )}
                
                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                {/* Category */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-spark-500 font-medium uppercase tracking-wider">
                        {product.category}
                    </span>
                    {product.isPremium && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                            Premium
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-spark-600 transition line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Rating */}
                {ratingCount > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center gap-0.5">
                            {renderStars(rating)}
                        </div>
                        <span className="text-[10px] text-gray-400">({ratingCount})</span>
                    </div>
                )}

                {/* Price */}
                <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-base font-bold text-spark-600">
                        {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.discountPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}