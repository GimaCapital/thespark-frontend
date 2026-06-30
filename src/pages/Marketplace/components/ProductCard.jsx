// // src/pages/Marketplace/components/ProductCard.jsx
// import React from 'react';

// export default function ProductCard({ product, onAddToCart }) {
//     const formatPrice = (price) => {
//         return '₦' + price.toLocaleString();
//     };

//     return (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
//             <div className="p-4">
//                 <div className="flex items-center justify-between mb-2">
//                     <span className="text-5xl">{product.image || '📦'}</span>
//                     <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
//                         -{product.discount}% OFF
//                     </span>
//                 </div>
//                 <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
//                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
//                 <p className="text-xs text-gray-400 mt-1">{product.unit}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                     <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
//                     <span className="text-lg font-bold text-spark-600">{formatPrice(product.discountPrice)}</span>
//                 </div>
//                 <div className="flex items-center justify-between mt-2">
//                     <div className="flex items-center gap-1">
//                         <span className="text-xs text-yellow-500">⭐ {product.rating || 0}</span>
//                         <span className="text-xs text-gray-400">({product.reviews || 0})</span>
//                     </div>
//                     <span className="text-xs text-gray-400">{product.stock} in stock</span>
//                 </div>
//                 <button
//                     onClick={() => onAddToCart(product)}
//                     disabled={product.stock === 0}
//                     className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition ${
//                         product.stock === 0
//                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                             : 'bg-spark-500 hover:bg-spark-600 text-white'
//                     }`}
//                 >
//                     {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
//                 </button>
//             </div>
//         </div>
//     );
// }

// src/pages/Marketplace/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';

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

    // If product has image and no error, show the image
    if (product.image && !imageError) {
        return (
            <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"  // ✅ REMOVED: group-hover:scale-110 transition duration-500
                loading="lazy"
                onError={() => setImageError(true)}
            />
        );
    }

    // Fallback to emoji
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spark-50 to-amber-50">
            <span className="text-6xl">
                {product.emoji || categoryEmojis[product.category] || '📦'}
            </span>
        </div>
    );
};

export default function ProductCard({ product, onAddToCart }) {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group">
            {/* Product Image - No zoom */}
            <div className="relative h-56 bg-gray-100 overflow-hidden">
                <ProductImage product={product} />
                
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        <FireOutlined className="mr-1" />
                        -{product.discountPercentage}%
                    </div>
                )}
                
                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                        Only {product.stock} left
                    </div>
                )}
                
                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-spark-500 font-medium uppercase tracking-wider">
                        {product.category}
                    </span>
                    {product.isPremium && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            ⭐ Premium
                        </span>
                    )}
                </div>

                <Link to={`/marketplace/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-spark-600 transition line-clamp-2 min-h-[3rem]">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-spark-600">
                        {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0 || !isAuthenticated}
                    className={`mt-3 w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                        product.stock === 0 || !isAuthenticated
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-spark-500 hover:bg-spark-600 text-white hover:shadow-lg'
                    }`}
                >
                    <ShoppingCartOutlined />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}