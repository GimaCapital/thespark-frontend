// src/components/Chat/AIFloatingButton.jsx
import React from 'react';
import { useAISupport } from '../../contexts/AISupportContext';
import { MessageOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';

export default function AIFloatingButton() {
    const { unreadCount, isOpen, toggleChat } = useAISupport();

    return (
        <button
            onClick={toggleChat}
            className="fixed z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
                right: '20px'
            }}
        >
            {isOpen ? (
                <CloseOutlined className="text-white text-2xl" />
            ) : (
                <>
                    <RobotOutlined className="text-white text-2xl group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}