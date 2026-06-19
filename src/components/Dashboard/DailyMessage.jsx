import React from 'react';

export default function DailyMessage({ message }) {
    return (
        <div className="message-card spacer-md">
            <p className="message-title">📖 {message.principle}</p>
            <p className="message-text">{message.message}</p>
            <p className="text-small text-spark-600 mt-3">Be the spark.</p>
        </div>
    );
}