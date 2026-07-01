// src/pages/Marketplace/components/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}