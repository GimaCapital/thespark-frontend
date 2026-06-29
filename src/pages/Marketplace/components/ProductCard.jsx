// src/pages/Marketplace/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-5xl">{product.image || '📦'}</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        -{product.discount}% OFF
                    </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <p className="text-xs text-gray-400 mt-1">{product.unit}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-lg font-bold text-spark-600">{formatPrice(product.discountPrice)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-500">⭐ {product.rating || 0}</span>
                        <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                    </div>
                    <span className="text-xs text-gray-400">{product.stock} in stock</span>
                </div>
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition ${
                        product.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-spark-500 hover:bg-spark-600 text-white'
                    }`}
                >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>
            </div>
        </div>
    );
}