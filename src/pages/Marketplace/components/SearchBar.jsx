// src/pages/Marketplace/components/SearchBar.jsx
import React from 'react';

export default function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="flex-1 relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search food items (rice, garri, beans, oil...)"
                className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
    );
}