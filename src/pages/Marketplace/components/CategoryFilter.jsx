// src/pages/Marketplace/components/CategoryFilter.jsx
import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
    const getCategoryIcon = (cat) => {
        const icons = {
            'all': '📦',
            'grains': '🌾',
            'garri': '🌽',
            'beans': '🫘',
            'oils': '🫒',
            'others': '🧂'
        };
        return icons[cat] || '📦';
    };

    const getCategoryLabel = (cat) => {
        if (cat === 'all') return 'All';
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                        selectedCategory === category
                            ? 'bg-spark-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    <span>{getCategoryIcon(category)}</span>
                    {getCategoryLabel(category)}
                </button>
            ))}
        </div>
    );
}