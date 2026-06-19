// src/utils/dateUtils.js

/**
 * Parse date from various Firebase timestamp formats
 * @param {Object|string|number} timestamp - Firebase timestamp or date string/number
 * @returns {Date|null} - JavaScript Date object or null
 */
export const parseDate = (timestamp) => {
    if (!timestamp) return null;
    
    // Handle Firebase Timestamp with toDate()
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
    }
    // Handle {seconds, nanoseconds} format
    if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000);
    }
    // Handle {_seconds, _nanoseconds} format
    if (timestamp._seconds !== undefined) {
        return new Date(timestamp._seconds * 1000);
    }
    // Handle string
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) return date;
    }
    // Handle number
    if (typeof timestamp === 'number') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) return date;
    }
    // Handle Date object
    if (timestamp instanceof Date) {
        return timestamp;
    }
    return null;
};

/**
 * Format date for display (short format)
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {string} - Formatted date like "Jan 15 • 2:30 PM"
 */
export const formatDate = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return 'Date unavailable';
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

/**
 * Get full date for grouping (long format)
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {string} - Full date like "January 15, 2024"
 */
export const getFullDate = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return 'Unknown Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Get date key for grouping (YYYY-MM-DD format)
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {string} - Date key like "2024-01-15"
 */
export const getDateKey = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return 'unknown';
    return date.toISOString().split('T')[0];
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return 'Unknown';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return formatDate(timestamp);
};

/**
 * Check if date is today
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {boolean} - True if date is today
 */
export const isToday = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

/**
 * Check if date is this week
 * @param {Object|string|number} timestamp - Firebase timestamp
 * @returns {boolean} - True if date is within current week
 */
export const isThisWeek = (timestamp) => {
    const date = parseDate(timestamp);
    if (!date) return false;
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    return date >= weekAgo;
};