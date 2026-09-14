// src/services/aiSupport.js
import { api, setAuthToken } from './api';
import { auth } from './firebase';

/**
 * Send a message to the AI support system
 * @param {string} message - The user's message
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise} - Response from the AI
 */
export const sendAIMessage = async (message, sessionId = null) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in to use the AI support');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.post('/ai/chat', {
            message,
            sessionId
        });

        return response.data;
    } catch (error) {
        // console.error('Error sending AI message:', error);
        throw error;
    }
};

/**
 * Get chat history for a session
 * @param {string} sessionId - The session ID
 * @returns {Promise} - Chat history
 */
export const getChatHistory = async (sessionId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in to view chat history');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get(`/ai/history/${sessionId}`);
        return response.data;
    } catch (error) {
        // console.error('Error fetching chat history:', error);
        return [];
    }
};

/**
 * Check if a human agent is available
 * @returns {Promise<boolean>} - True if human agent is available
 */
export const checkHumanAvailability = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return false;

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get('/ai/human-available');
        return response.data.available || false;
    } catch (error) {
        // console.error('Error checking human availability:', error);
        return false;
    }
};

/**
 * Request a human handoff
 * @param {string} sessionId - The session ID
 * @returns {Promise} - Handoff response
 */
export const requestHumanHandoff = async (sessionId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in to request human support');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.post('/ai/handoff', { sessionId });
        return response.data;
    } catch (error) {
        // console.error('Error requesting human handoff:', error);
        throw error;
    }
};

/**
 * Get all pending handoff requests (admin only)
 * @returns {Promise} - List of pending handoff requests
 */
export const getHandoffRequests = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get('/ai/handoffs');
        return response.data;
    } catch (error) {
        // console.error('Error fetching handoff requests:', error);
        return [];
    }
};

/**
 * Claim a handoff request (admin only)
 * @param {string} handoffId - The handoff request ID
 * @returns {Promise} - Claim response
 */
export const claimHandoff = async (handoffId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.put(`/ai/handoffs/${handoffId}/claim`);
        return response.data;
    } catch (error) {
        // console.error('Error claiming handoff:', error);
        throw error;
    }
};

/**
 * Resolve a handoff request (admin only)
 * @param {string} handoffId - The handoff request ID
 * @param {string} resolution - Resolution notes
 * @returns {Promise} - Resolution response
 */
export const resolveHandoff = async (handoffId, resolution) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.put(`/ai/handoffs/${handoffId}/resolve`, { resolution });
        return response.data;
    } catch (error) {
        // console.error('Error resolving handoff:', error);
        throw error;
    }
};

// ============================================================
// ✅ UPDATED: AGENT CHAT FUNCTIONS (Using /ai/ routes)
// ============================================================

/**
 * Get a chat session by session ID
 * @param {string} sessionId - The session ID
 * @returns {Promise} - Chat session data
 */
export const getChatSession = async (sessionId) => {
    try {
        const user = auth.currentUser;
        if (!user) return null;

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get(`/ai/session/${sessionId}`);
        return response.data;
    } catch (error) {
        // console.error('Error getting chat session:', error);
        return null;
    }
};

/**
 * Send a message to an agent in a chat session
 * @param {string} chatSessionId - The chat session ID
 * @param {string} message - The message to send
 * @returns {Promise} - Message response
 */
export const sendChatMessage = async (chatSessionId, message) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        console.log(`📤 Sending message to session: ${chatSessionId}`);
        console.log(`📤 Message: ${message}`);

        const response = await api.post(`/ai/chat/${chatSessionId}/message`, {
            message
        });

        console.log(`✅ Message sent successfully`);
        return response.data;
    } catch (error) {
        // console.error('❌ Error sending message:', {
        //     status: error.response?.status,
        //     data: error.response?.data,
        //     message: error.message,
        //     sessionId: chatSessionId
        // });
        throw error;
    }
};

/**
 * Get all messages from a chat session
 * @param {string} chatSessionId - The chat session ID
 * @returns {Promise} - List of messages
 */
export const getChatMessages = async (chatSessionId) => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get(`/ai/chat/${chatSessionId}/history`);
        return response.data.messages || [];
    } catch (error) {
        // console.error('Error getting chat messages:', error);
        return [];
    }
};

/**
 * Resolve/end a chat session
 * @param {string} chatSessionId - The chat session ID
 * @returns {Promise} - Resolution response
 */
export const resolveChat = async (chatSessionId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.put(`/ai/chat/${chatSessionId}/resolve`);
        return response.data;
    } catch (error) {
        // console.error('Error resolving chat:', error);
        throw error;
    }
};

/**
 * Get all active chat sessions for the current agent
 * @returns {Promise} - List of active sessions
 */
export const getActiveSessions = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get('/ai/sessions/active');
        return response.data || [];
    } catch (error) {
        // console.error('Error fetching active sessions:', error);
        return [];
    }
};

/**
 * Get all pending handoff requests (agent/admin)
 * @returns {Promise} - List of pending handoffs
 */
export const getPendingHandoffs = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.get('/ai/handoffs/pending');
        return response.data || [];
    } catch (error) {
        // console.error('Error fetching pending handoffs:', error);
        return [];
    }
};

/**
 * Claim a handoff request (agent/admin)
 * @param {string} handoffId - The handoff request ID
 * @returns {Promise} - Claim response
 */

export const claimHandoffRequest = async (handoffId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('You must be logged in');
        }

        const token = await user.getIdToken();
        setAuthToken(token);

        const response = await api.put(`/ai/handoffs/${handoffId}/claim-agent`);
        console.log('✅ Claim response:', response.data);
        return response.data;
    } catch (error) {
        // console.error('❌ Error claiming handoff:', error);
        throw error;
    }
};