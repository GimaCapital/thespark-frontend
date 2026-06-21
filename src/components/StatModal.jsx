// src/components/StatModal.jsx
import React from 'react';
import { Modal } from 'antd';

export default function StatModal({ stat, isOpen, onClose }) {
    if (!stat) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
            closable={true}
            destroyOnHidden={true}
        >
            {/* Header with Icon, Label, and Trend */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{stat.icon}</span>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{stat.label}</h3>
                    <p className="text-sm text-gray-400">{stat.trend}</p>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div>
                    {/* ✅ Big Value Number */}
                    <div className={`text-6xl font-bold ${stat.text} mb-2`}>
                        {stat.value}
                    </div>

                    {/* ✅ Progress Bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                        <div className={`h-full w-3/4 bg-gradient-to-r ${stat.text.replace('text-', 'from-')} to-${stat.text.replace('text-', 'to-')} rounded-full`}></div>
                    </div>

                    {/* ✅ What this means */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">📊 What this means:</p>
                        <p className="text-sm text-gray-600">{stat.detail}</p>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* ✅ The Impact */}
                    <div className="bg-amber-50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-amber-700 mb-1">⚠️ The Impact:</p>
                        <p className="text-sm text-gray-600">{stat.impact}</p>
                    </div>

                    {/* ✅ Source */}
                    <div className="bg-spark-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">📖 Source:</p>
                        <a 
                            href={stat.sourceLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-spark-600 hover:underline break-all"
                        >
                            {stat.source}
                        </a>
                    </div>

                    {/* ✅ Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-full mt-4 py-3 bg-spark-600 text-white rounded-xl font-semibold hover:bg-spark-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}