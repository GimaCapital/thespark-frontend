// // src/contexts/AISupportContext.jsx
// import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
// import { useAuth } from './AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { db } from '../services/firebase';
// import { 
//     collection, 
//     query, 
//     where, 
//     onSnapshot, 
//     doc,
//     orderBy 
// } from 'firebase/firestore';
// import { 
//     sendAIMessage, 
//     getChatHistory, 
//     checkHumanAvailability,
//     requestHumanHandoff,
//     sendChatMessage,
//     resolveChat
// } from '../services/aiSupport';
// import toast from 'react-hot-toast';

// const AISupportContext = createContext();

// export function AISupportProvider({ children }) {
//     const { user } = useAuth();
//     const [messages, setMessages] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);
//     const [sessionId, setSessionId] = useState(null);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [isHumanMode, setIsHumanMode] = useState(false);
//     const [isHumanAvailable, setIsHumanAvailable] = useState(false);
//     const [handoffShown, setHandoffShown] = useState(false);
//     const [chatSessionId, setChatSessionId] = useState(null);
//     const [agentName, setAgentName] = useState(null);
//     const [isAgentTyping, setIsAgentTyping] = useState(false);
    
//     const handoffListenerRef = useRef(null);
//     const messagesListenerRef = useRef(null);
//     const lastProcessedHandoffRef = useRef(null);

//     // Initialize session
//     useEffect(() => {
//         if (user && !sessionId) {
//             setSessionId(`session-${user.uid}-${Date.now()}`);
//         }
//     }, [user]);

//     // Check human availability on mount
//     useEffect(() => {
//         if (user) {
//             checkHumanAvailability().then(setIsHumanAvailable);
//         }
//     }, [user]);

//     // Load history when chat opens
//     useEffect(() => {
//         if (user && sessionId && isOpen) {
//             loadHistory();
//         }
//     }, [user, sessionId, isOpen]);

//     // Load chat session history when chatSessionId changes (human mode)
//     useEffect(() => {
//         if (chatSessionId && isOpen && isHumanMode) {
//             console.log('📤 Loading chat session history for:', chatSessionId);
//             loadChatSessionHistory();
            
//             // ✅ Set up real-time listener when chat is open
//             listenToMessages(chatSessionId);
//         }
        
//         // ✅ Cleanup listener when chat closes or session changes
//         return () => {
//             if (messagesListenerRef.current) {
//                 console.log('🧹 Cleaning up messages listener');
//                 messagesListenerRef.current();
//                 messagesListenerRef.current = null;
//             }
//         };
//     }, [chatSessionId, isOpen, isHumanMode]);

//     // ✅ FIXED: Listen for handoffs - only set human mode when chat is active and open
//     useEffect(() => {
//         if (!user) {
//             console.log('❌ No user, skipping handoff listener');
//             return;
//         }

//         console.log('📡 Setting up real-time handoff listener for user:', user.uid);

//         const handoffsQuery = query(
//             collection(db, 'handoffRequests'),
//             where('userId', '==', user.uid),
//             orderBy('createdAt', 'desc')
//         );

//         handoffListenerRef.current = onSnapshot(
//             handoffsQuery,
//             (snapshot) => {
//                 console.log(`📩 Handoff snapshot received: ${snapshot.size} documents`);
                
//                 const handoffs = [];
//                 snapshot.forEach((doc) => {
//                     const data = doc.data();
//                     handoffs.push({ 
//                         id: doc.id, 
//                         ...data,
//                         createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
//                     });
//                 });

//                 // ✅ Find the MOST RECENT claimed handoff
//                 const claimedHandoffs = handoffs
//                     .filter(h => h.status === 'claimed' && h.chatSessionId)
//                     .sort((a, b) => b.createdAt - a.createdAt);

//                 if (claimedHandoffs.length > 0) {
//                     const latestClaimed = claimedHandoffs[0];
//                     const chatId = latestClaimed.chatSessionId;
//                     const agent = latestClaimed.agentName || 'Agent';
                    
//                     const handoffKey = `${latestClaimed.id}-${chatId}`;
//                     if (lastProcessedHandoffRef.current !== handoffKey) {
//                         lastProcessedHandoffRef.current = handoffKey;
                        
//                         console.log('🔄 PROCESSING NEW HANDOFF:', {
//                             from: chatSessionId || 'none',
//                             to: chatId,
//                             handoffId: latestClaimed.id
//                         });
                        
//                         // ✅ Store the chat session and agent name
//                         setChatSessionId(chatId);
//                         setAgentName(agent);
                        
//                         // ✅ Only set human mode if the chat is open
//                         if (isOpen) {
//                             setIsHumanMode(true);
                            
//                             setMessages([]);
                            
//                             const connectedMessage = {
//                                 id: `msg-${Date.now()}`,
//                                 sender: 'ai',
//                                 content: `👤 ${agent} has joined the chat. They can help you with your questions.`,
//                                 timestamp: new Date().toISOString()
//                             };
//                             setMessages([connectedMessage]);
                            
//                             toast.success(`👤 ${agent} connected!`, {
//                                 duration: 3000,
//                                 icon: '👤'
//                             });
                            
//                             if (chatId) {
//                                 if (messagesListenerRef.current) {
//                                     messagesListenerRef.current();
//                                     messagesListenerRef.current = null;
//                                 }
                                
//                                 setTimeout(async () => {
//                                     console.log('📤 Loading messages for new session:', chatId);
//                                     await loadChatSessionHistory();
//                                     listenToMessages(chatId);
//                                 }, 500);
//                             }
//                         } else {
//                             // ✅ Store the session but don't switch to human mode until chat opens
//                             console.log('💾 Stored chat session for later:', chatId);
//                         }
//                     }
//                 } else {
//                     // ✅ Check if there's any pending handoff
//                     const pendingHandoffs = handoffs
//                         .filter(h => h.status === 'pending')
//                         .sort((a, b) => b.createdAt - a.createdAt);

//                     if (pendingHandoffs.length > 0 && isOpen) {
//                         console.log('⏳ Handoff pending, waiting for agent...');
//                         const hasWaitingMessage = messages.some(m => 
//                             m.content && m.content.includes('Connecting you to a human agent')
//                         );
//                         if (!hasWaitingMessage && !isHumanMode) {
//                             const waitingMessage = {
//                                 id: `msg-${Date.now()}`,
//                                 sender: 'ai',
//                                 content: '👤 Connecting you to a human agent. Please wait...',
//                                 timestamp: new Date().toISOString()
//                             };
//                             setMessages(prev => [...prev, waitingMessage]);
//                         }
//                     }
//                 }
//             },
//             (error) => {
//                 console.error('❌ Handoff listener error:', error);
//             }
//         );

//         return () => {
//             console.log('🧹 Cleaning up handoff listener');
//             if (handoffListenerRef.current) {
//                 handoffListenerRef.current();
//                 handoffListenerRef.current = null;
//             }
//         };
//     }, [user, isOpen]); // ✅ Add isOpen as dependency

//     // ✅ FIXED: Listen to messages - NO FALLBACKS, use sender directly
//     const listenToMessages = (sessionId) => {
//         if (!sessionId) {
//             console.warn('⚠️ No sessionId provided to listenToMessages');
//             return;
//         }

//         console.log('📡 Setting up real-time messages listener for session:', sessionId);

//         const sessionRef = doc(db, 'chatSessions', sessionId);
        
//         if (messagesListenerRef.current) {
//             console.log('🧹 Cleaning up old messages listener');
//             messagesListenerRef.current();
//             messagesListenerRef.current = null;
//         }

//         messagesListenerRef.current = onSnapshot(
//             sessionRef,
//             (docSnapshot) => {
//                 if (docSnapshot.exists()) {
//                     const data = docSnapshot.data();
//                     const newMessages = data?.messages || [];
                    
//                     console.log(`📩 Real-time update: ${newMessages.length} messages in session ${sessionId}`);
                    
//                     // ✅ NO FALLBACKS - Use sender directly from Firestore
//                     const formattedMessages = newMessages.map(msg => ({
//                         id: msg.id || `msg-${Date.now()}`,
//                         content: msg.content || '',
//                         timestamp: msg.timestamp || new Date().toISOString(),
//                         senderName: msg.senderName || (msg.sender === 'user' ? 'You' : 'Agent'),
//                         sender: msg.sender, // ✅ Use sender directly, NO FALLBACK
//                         isAgent: msg.isAgent || false,
//                         senderId: msg.senderId || null
//                     }));
                    
//                     const sortedMessages = formattedMessages.sort((a, b) => {
//                         return new Date(a.timestamp) - new Date(b.timestamp);
//                     });
                    
//                     console.log('📩 Senders:', sortedMessages.map(m => ({ id: m.id, sender: m.sender })));
                    
//                     setMessages(sortedMessages);
                    
//                     const currentIds = new Set(messages.map(m => m.id));
//                     const newAgentMessages = sortedMessages.filter(m => 
//                         m.sender === 'agent' && !currentIds.has(m.id)
//                     );
                    
//                     if (newAgentMessages.length > 0 && !isOpen) {
//                         setUnreadCount(prev => prev + newAgentMessages.length);
//                     }
//                 } else {
//                     console.warn(`⚠️ Session ${sessionId} does not exist or has been deleted`);
//                 }
//             },
//             (error) => {
//                 console.error('❌ Messages listener error:', error);
//             }
//         );
//     };

//     // ✅ FIXED: Load chat session history - NO FALLBACKS
//     const loadChatSessionHistory = async () => {
//         if (!chatSessionId || !user) {
//             console.warn('⚠️ No chatSessionId or user');
//             return;
//         }
        
//         try {
//             console.log('📤 Fetching chat session messages for:', chatSessionId);
//             const token = await user.getIdToken();
//             setAuthToken(token);
//             const response = await api.get(`/ai/chat/${chatSessionId}/history`);
            
//             console.log('📤 API Response success:', response.data.success);
//             console.log('📤 Messages count:', response.data.messages?.length || 0);
            
//             if (response.data.success && response.data.messages && response.data.messages.length > 0) {
//                 console.log(`📤 Received ${response.data.messages.length} messages from API`);
                
//                 const chatMessages = response.data.messages.map(msg => ({
//                     id: msg.id || `chat-${Date.now()}`,
//                     content: msg.content || '',
//                     timestamp: msg.timestamp || new Date().toISOString(),
//                     senderName: msg.senderName || (msg.sender === 'user' ? 'You' : 'Agent'),
//                     sender: msg.sender, // ✅ Use sender directly, NO FALLBACK
//                     isAgent: msg.isAgent || false,
//                     senderId: msg.senderId || null
//                 }));
                
//                 const sortedMessages = chatMessages.sort((a, b) => {
//                     return new Date(a.timestamp) - new Date(b.timestamp);
//                 });
                
//                 console.log('📩 Loaded senders:', sortedMessages.map(m => ({ id: m.id, sender: m.sender })));
                
//                 setMessages(sortedMessages);
//                 console.log('✅ Chat session history loaded:', sortedMessages.length, 'messages');
//             } else {
//                 console.log('ℹ️ No messages found in chat session');
//                 setMessages([{
//                     id: 'human-mode',
//                     sender: 'ai',
//                     content: '👤 You are now chatting with a human agent. They will respond shortly.',
//                     timestamp: new Date().toISOString()
//                 }]);
//             }
//         } catch (error) {
//             console.error('❌ Error loading chat session history:', error);
//         }
//     };

//     // ✅ UPDATED: Load history - only set human mode if chat is open
//     const loadHistory = async () => {
//         if (!user || !sessionId) {
//             console.warn('⚠️ User or session ID missing');
//             return;
//         }
        
//         console.log('📤 Fetching chat history...');
        
//         try {
//             // ✅ FIRST: Check if we have a chatSessionId and the user is in human mode
//             if (chatSessionId && isHumanMode && isOpen) {
//                 console.log('👤 Using existing chat session:', chatSessionId);
//                 await loadChatSessionHistory();
//                 listenToMessages(chatSessionId);
//                 return;
//             }
            
//             // ✅ SECOND: Check for any pending or active chat sessions for this user
//             console.log('🔍 Checking for existing chat sessions...');
//             const token = await user.getIdToken();
//             setAuthToken(token);
            
//             const sessionsResponse = await api.get('/ai/sessions/active');
//             const sessions = sessionsResponse.data || [];
            
//             const userSession = sessions.find(s => s.userId === user.uid);
            
//             if (userSession) {
//                 console.log('✅ Found existing chat session:', userSession.id);
//                 setChatSessionId(userSession.id);
//                 // ✅ Only set human mode if the chat is open
//                 if (isOpen) {
//                     setIsHumanMode(true);
//                     await loadChatSessionHistory();
//                     listenToMessages(userSession.id);
//                 } else {
//                     // ✅ Store session but don't switch to human mode yet
//                     console.log('💾 Stored session for later:', userSession.id);
//                 }
//                 return;
//             }
            
//             // ✅ THIRD: Try AI chat history
//             const history = await getChatHistory(sessionId);
            
//             if (history.length > 0) {
//                 const formattedHistory = history.map(item => ({
//                     id: item.id || `hist-${Date.now()}`,
//                     sender: 'user',
//                     content: item.message || item.content,
//                     timestamp: item.createdAt || item.timestamp || new Date().toISOString()
//                 }));
//                 setMessages(formattedHistory);
//                 console.log('✅ AI History loaded:', formattedHistory.length, 'messages');
//                 return;
//             }
            
//             setMessages([{
//                 id: 'welcome',
//                 sender: 'ai',
//                 content: "👋 Hello! Welcome to TheSpark.\n\nI can help you with:\n💰 Balance & Wallet\n📚 Wealth Building Education\n🛠️ Wealth Building Tools\n🛍️ Marketplace & Orders\n\nWhat can I help you with today?",
//                 timestamp: new Date().toISOString()
//             }]);
//             console.log('✅ No history found, showing welcome message');
            
//         } catch (error) {
//             console.error('❌ Error loading history:', error);
//             setMessages([{
//                 id: 'welcome',
//                 sender: 'ai',
//                 content: "👋 Hello! Welcome to TheSpark.\n\nI can help you with:\n💰 Balance & Wallet\n📚 Wealth Building Education\n🛠️ Wealth Building Tools\n🛍️ Marketplace & Orders\n\nWhat can I help you with today?",
//                 timestamp: new Date().toISOString()
//             }]);
//         }
//     };

//     // ✅ UPDATED: Send message to AI or Agent
//     const sendMessage = async (content) => {
//         if (!user) {
//             toast.error('Please login to chat');
//             return;
//         }

//         const userMessage = {
//             id: `msg-${Date.now()}`,
//             sender: 'user',
//             content: content,
//             timestamp: new Date().toISOString()
//         };
//         setMessages(prev => [...prev, userMessage]);

//         if (isHumanMode && chatSessionId) {
//             try {
//                 const token = await user.getIdToken();
//                 setAuthToken(token);
//                 const response = await api.post(`/ai/chat/${chatSessionId}/message`, {
//                     message: content
//                 });
//                 if (response.data.success) {
//                     console.log('✅ Message sent to agent');
//                     toast.success('Message sent to agent');
//                 }
//             } catch (error) {
//                 console.error('Error sending to agent:', error);
//                 toast.error('Failed to send message to agent');
//             }
//             return;
//         }

//         setIsTyping(true);
//         setHandoffShown(false);

//         try {
//             const response = await sendAIMessage(content, sessionId);

//             if (!response.success) {
//                 toast.error(response.error || 'Failed to send message');
//                 setIsTyping(false);
//                 return;
//             }

//             if (response.needsHuman) {
//                 const lowerContent = content.toLowerCase();
//                 const askedForHuman = lowerContent.includes('human') || 
//                                      lowerContent.includes('agent') || 
//                                      lowerContent.includes('person') ||
//                                      lowerContent.includes('real person') ||
//                                      lowerContent.includes('speak to') ||
//                                      lowerContent.includes('talk to') ||
//                                      lowerContent.includes('support agent');
                
//                 if (askedForHuman && !handoffShown) {
//                     const availability = await checkHumanAvailability();
                    
//                     if (!availability) {
//                         const noAgentMessage = {
//                             id: `msg-${Date.now() + 1}`,
//                             sender: 'ai',
//                             content: "I'm sorry, no human agents are currently available. I'm here to help you instead. What would you like to know?",
//                             timestamp: new Date().toISOString()
//                         };
//                         setMessages(prev => [...prev, noAgentMessage]);
//                         setIsTyping(false);
//                         return;
//                     }
                    
//                     setHandoffShown(true);
//                     setIsHumanMode(true);
                    
//                     const connectingMessage = {
//                         id: `msg-${Date.now() + 1}`,
//                         sender: 'ai',
//                         content: '👤 Connecting you to a human agent. Please wait...',
//                         timestamp: new Date().toISOString()
//                     };
//                     setMessages(prev => [...prev, connectingMessage]);
                    
//                     const handoffResponse = await requestHumanHandoff(sessionId);
                    
//                     if (!handoffResponse.success) {
//                         setIsHumanMode(false);
//                         setHandoffShown(false);
//                         const failedMessage = {
//                             id: `msg-${Date.now() + 2}`,
//                             sender: 'ai',
//                             content: "I'm having trouble connecting you to a human agent. I'm here to help you instead. What would you like to know?",
//                             timestamp: new Date().toISOString()
//                         };
//                         setMessages(prev => [...prev, failedMessage]);
//                     }
//                 }
                
//                 setIsTyping(false);
//                 return;
//             }

//             const aiMessage = {
//                 id: `msg-${Date.now() + 1}`,
//                 sender: 'ai',
//                 content: response.response,
//                 timestamp: new Date().toISOString()
//             };
//             setMessages(prev => [...prev, aiMessage]);
            
//         } catch (error) {
//             console.error('Error sending message:', error);
//             toast.error(error.message || 'Failed to send message');
//         } finally {
//             setIsTyping(false);
//         }
//     };

//     const toggleChat = () => {
//         const newIsOpen = !isOpen;
//         setIsOpen(newIsOpen);
//         if (newIsOpen) {
//             // When opening chat, check if there's a stored session
//             if (chatSessionId && !isHumanMode) {
//                 setIsHumanMode(true);
//                 loadChatSessionHistory();
//                 listenToMessages(chatSessionId);
//             }
//         }
//         if (!newIsOpen) {
//             setUnreadCount(0);
//         }
//     };

//     const clearMessages = () => {
//         setMessages([]);
//         setSessionId(`session-${user?.uid}-${Date.now()}`);
//         setIsHumanMode(false);
//         setHandoffShown(false);
//         setChatSessionId(null);
//         setAgentName(null);
//         lastProcessedHandoffRef.current = null;
        
//         if (handoffListenerRef.current) {
//             handoffListenerRef.current();
//             handoffListenerRef.current = null;
//         }
//         if (messagesListenerRef.current) {
//             messagesListenerRef.current();
//             messagesListenerRef.current = null;
//         }
//     };

//     const resolveCurrentChat = async () => {
//         if (!chatSessionId) {
//             throw new Error('No active chat session to resolve');
//         }
        
//         try {
//             const token = await user.getIdToken();
//             setAuthToken(token);
//             const response = await api.put(`/ai/chat/${chatSessionId}/resolve`);
            
//             if (!response.data.success) {
//                 throw new Error(response.data.error || 'Failed to resolve chat');
//             }
            
//             toast.success('✅ Chat resolved');
//             setIsHumanMode(false);
//             setChatSessionId(null);
//             setAgentName(null);
//             lastProcessedHandoffRef.current = null;
            
//             if (messagesListenerRef.current) {
//                 messagesListenerRef.current();
//                 messagesListenerRef.current = null;
//             }
//         } catch (error) {
//             console.error('Error resolving chat:', error);
//             toast.error(error.message || 'Failed to resolve chat');
//             throw error;
//         }
//     };

//     return (
//         <AISupportContext.Provider value={{
//             messages,
//             isOpen,
//             isTyping,
//             unreadCount,
//             isHumanMode,
//             isHumanAvailable,
//             sessionId,
//             chatSessionId,
//             agentName,
//             isAgentTyping,
//             sendMessage,
//             toggleChat,
//             clearMessages,
//             setIsOpen,
//             setUnreadCount,
//             loadHistory,
//             resolveCurrentChat
//         }}>
//             {children}
//         </AISupportContext.Provider>
//     );
// }

// export function useAISupport() {
//     const context = useContext(AISupportContext);
//     if (!context) {
//         throw new Error('useAISupport must be used within an AISupportProvider');
//     }
//     return context;
// }



import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { api, setAuthToken } from '../services/api';
import { db } from '../services/firebase';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc,
    getDoc,
    limit, 
    orderBy 
} from 'firebase/firestore';
import { 
    sendAIMessage, 
    getChatHistory, 
    checkHumanAvailability,
    requestHumanHandoff,
    sendChatMessage,
    resolveChat
} from '../services/aiSupport';
import toast from 'react-hot-toast';

const AISupportContext = createContext();

export function AISupportProvider({ children }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isHumanMode, setIsHumanMode] = useState(false);
    const [isHumanAvailable, setIsHumanAvailable] = useState(false);
    const [handoffShown, setHandoffShown] = useState(false);
    const [chatSessionId, setChatSessionId] = useState(null);
    const [agentName, setAgentName] = useState(null);
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const [isResolved, setIsResolved] = useState(false);
    
    const handoffListenerRef = useRef(null);
    const messagesListenerRef = useRef(null);
    const lastProcessedHandoffRef = useRef(null);
    const resolutionListenerRef = useRef(null);

    // ✅ Helper function to check if session has messages
    const sessionHasMessages = async (sessionId) => {
        try {
            const sessionRef = doc(db, 'chatSessions', sessionId);
            const sessionDoc = await getDoc(sessionRef);
            if (sessionDoc.exists()) {
                const data = sessionDoc.data();
                const messages = data.messages || [];
                return messages.length > 0;
            }
            return false;
        } catch (error) {
            console.log('⚠️ Error checking session messages:', error.message);
            return false;
        }
    };

    // Initialize session
    useEffect(() => {
        if (user && !sessionId) {
            setSessionId(`session-${user.uid}-${Date.now()}`);
        }
    }, [user]);

    // Check human availability on mount
    useEffect(() => {
        if (user) {
            checkHumanAvailability().then(setIsHumanAvailable);
        }
    }, [user]);

    // Load history when chat opens
    useEffect(() => {
        if (user && sessionId && isOpen) {
            loadHistory();
        }
    }, [user, sessionId, isOpen]);

    // Load chat session history when chatSessionId changes (human mode)
    useEffect(() => {
        if (chatSessionId && isOpen && isHumanMode) {
            console.log('📤 Loading chat session history for:', chatSessionId);
            loadChatSessionHistory();
            
            // ✅ Set up real-time listener when chat is open
            listenToMessages(chatSessionId);
        }
        
        // ✅ Cleanup listener when chat closes or session changes
        return () => {
            if (messagesListenerRef.current) {
                console.log('🧹 Cleaning up messages listener');
                messagesListenerRef.current();
                messagesListenerRef.current = null;
            }
        };
    }, [chatSessionId, isOpen, isHumanMode]);

    // Resolution listener
    useEffect(() => {
        if (!chatSessionId || !user) return;

        console.log('📡 Setting up resolution listener for session:', chatSessionId);

        const sessionRef = doc(db, 'chatSessions', chatSessionId);

        resolutionListenerRef.current = onSnapshot(
            sessionRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const status = data.status;
                    
                    console.log('📩 Chat status update:', status);
                    
                    if (status === 'resolved' && !isResolved) {
                        console.log('✅ Chat has been resolved');
                        setIsResolved(true);
                        toast.success('✅ Chat has been resolved. Please rate your experience!');
                    }
                }
            },
            (error) => {
                console.error('❌ Resolution listener error:', error);
            }
        );

        return () => {
            if (resolutionListenerRef.current) {
                resolutionListenerRef.current();
                resolutionListenerRef.current = null;
            }
        };
    }, [chatSessionId, user]);

    // ✅ FIXED: Listen for handoffs - only set human mode when chat is active and open
    useEffect(() => {
        if (!user) {
            console.log('❌ No user, skipping handoff listener');
            return;
        }

        console.log('📡 Setting up real-time handoff listener for user:', user.uid);

        const handoffsQuery = query(
            collection(db, 'handoffRequests'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        handoffListenerRef.current = onSnapshot(
            handoffsQuery,
            async (snapshot) => {
                console.log(`📩 Handoff snapshot received: ${snapshot.size} documents`);
                
                const handoffs = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    handoffs.push({ 
                        id: doc.id, 
                        ...data,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
                    });
                });

                // ✅ Find the MOST RECENT claimed handoff
                const claimedHandoffs = handoffs
                    .filter(h => h.status === 'claimed' && h.chatSessionId)
                    .sort((a, b) => b.createdAt - a.createdAt);

                if (claimedHandoffs.length > 0) {
                    const latestClaimed = claimedHandoffs[0];
                    const chatId = latestClaimed.chatSessionId;
                    const agent = latestClaimed.agentName || 'Agent';
                    
                    // ✅ CHECK: Skip if this chat is already resolved
                    try {
                        const sessionRef = doc(db, 'chatSessions', chatId);
                        const sessionDoc = await getDoc(sessionRef);
                        if (sessionDoc.exists() && sessionDoc.data().status === 'resolved') {
                            console.log(`⏭️ Skipping resolved handoff: ${chatId}`);
                            return;
                        }
                    } catch (error) {
                        console.log('ℹ️ Could not check session status:', error.message);
                    }
                    
                    const handoffKey = `${latestClaimed.id}-${chatId}`;
                    if (lastProcessedHandoffRef.current !== handoffKey) {
                        lastProcessedHandoffRef.current = handoffKey;
                        
                        console.log('🔄 PROCESSING NEW HANDOFF:', {
                            from: chatSessionId || 'none',
                            to: chatId,
                            handoffId: latestClaimed.id
                        });
                        
                        // ✅ Store the chat session and agent name
                        setChatSessionId(chatId);
                        setAgentName(agent);
                        setIsResolved(false);
                        
                        // ✅ Only set human mode if the chat is open AND has messages
                        if (isOpen) {
                            // Check if session has messages before switching
                            const hasMessages = await sessionHasMessages(chatId);
                            if (hasMessages) {
                                setIsHumanMode(true);
                                
                                setMessages([]);
                                
                                const connectedMessage = {
                                    id: `msg-${Date.now()}`,
                                    sender: 'ai',
                                    content: `👤 ${agent} has joined the chat. They can help you with your questions.`,
                                    timestamp: new Date().toISOString()
                                };
                                setMessages([connectedMessage]);
                                
                                toast.success(`👤 ${agent} connected!`, {
                                    duration: 3000,
                                    icon: '👤'
                                });
                                
                                if (chatId) {
                                    if (messagesListenerRef.current) {
                                        messagesListenerRef.current();
                                        messagesListenerRef.current = null;
                                    }
                                    
                                    setTimeout(async () => {
                                        console.log('📤 Loading messages for new session:', chatId);
                                        await loadChatSessionHistory();
                                        listenToMessages(chatId);
                                    }, 500);
                                }
                            } else {
                                console.log('ℹ️ Session has no messages, not switching to human mode');
                            }
                        } else {
                            // ✅ Store the session but don't switch to human mode until chat opens
                            console.log('💾 Stored chat session for later:', chatId);
                        }
                    }
                } else {
                    // ✅ Check if there's any pending handoff
                    const pendingHandoffs = handoffs
                        .filter(h => h.status === 'pending')
                        .sort((a, b) => b.createdAt - a.createdAt);

                    if (pendingHandoffs.length > 0 && isOpen) {
                        console.log('⏳ Handoff pending, waiting for agent...');
                        const hasWaitingMessage = messages.some(m => 
                            m.content && m.content.includes('Connecting you to a human agent')
                        );
                        if (!hasWaitingMessage && !isHumanMode) {
                            const waitingMessage = {
                                id: `msg-${Date.now()}`,
                                sender: 'ai',
                                content: '👤 Connecting you to a human agent. Please wait...',
                                timestamp: new Date().toISOString()
                            };
                            setMessages(prev => [...prev, waitingMessage]);
                        }
                    }
                }
            },
            (error) => {
                console.error('❌ Handoff listener error:', error);
            }
        );

        return () => {
            console.log('🧹 Cleaning up handoff listener');
            if (handoffListenerRef.current) {
                handoffListenerRef.current();
                handoffListenerRef.current = null;
            }
        };
    }, [user, isOpen]);

    // ✅ Listen to messages
    const listenToMessages = (sessionId) => {
        if (!sessionId) {
            console.warn('⚠️ No sessionId provided to listenToMessages');
            return;
        }

        console.log('📡 Setting up real-time messages listener for session:', sessionId);

        const sessionRef = doc(db, 'chatSessions', sessionId);
        
        if (messagesListenerRef.current) {
            console.log('🧹 Cleaning up old messages listener');
            messagesListenerRef.current();
            messagesListenerRef.current = null;
        }

        messagesListenerRef.current = onSnapshot(
            sessionRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const newMessages = data?.messages || [];
                    
                    console.log(`📩 Real-time update: ${newMessages.length} messages in session ${sessionId}`);
                    
                    const formattedMessages = newMessages.map(msg => {
                        const isAI = msg.isAI === true || msg.sender === 'ai';
                        let senderName = msg.senderName;
                        
                        if (isAI) {
                            senderName = 'AI Assistant';
                        } else if (msg.sender === 'user') {
                            senderName = msg.senderName || 'You';
                        } else if (msg.sender === 'agent') {
                            senderName = msg.senderName || 'Agent';
                        }
                        
                        return {
                            id: msg.id || `msg-${Date.now()}`,
                            content: msg.content || '',
                            timestamp: msg.timestamp || new Date().toISOString(),
                            senderName: senderName,
                            sender: msg.sender,
                            isAgent: msg.isAgent || false,
                            isAI: isAI,
                            isResolved: msg.isResolved || false,
                            isRatingPrompt: msg.isRatingPrompt || false,
                            senderId: msg.senderId || null
                        };
                    });
                    
                    const sortedMessages = formattedMessages.sort((a, b) => {
                        return new Date(a.timestamp) - new Date(b.timestamp);
                    });
                    
                    console.log('📩 Senders:', sortedMessages.map(m => ({ 
                        id: m.id, 
                        sender: m.sender, 
                        senderName: m.senderName,
                        isAI: m.isAI,
                        isResolved: m.isResolved,
                        isRatingPrompt: m.isRatingPrompt
                    })));
                    
                    setMessages(sortedMessages);
                    
                    const currentIds = new Set(messages.map(m => m.id));
                    const newAgentMessages = sortedMessages.filter(m => 
                        m.sender === 'agent' && !currentIds.has(m.id)
                    );
                    
                    if (newAgentMessages.length > 0 && !isOpen) {
                        setUnreadCount(prev => prev + newAgentMessages.length);
                    }
                } else {
                    console.warn(`⚠️ Session ${sessionId} does not exist or has been deleted`);
                }
            },
            (error) => {
                console.error('❌ Messages listener error:', error);
            }
        );
    };

    // ✅ Load chat session history
    const loadChatSessionHistory = async () => {
        if (!chatSessionId || !user) {
            console.warn('⚠️ No chatSessionId or user');
            return;
        }
        
        try {
            console.log('📤 Fetching chat session messages for:', chatSessionId);
            const token = await user.getIdToken();
            setAuthToken(token);
            const response = await api.get(`/ai/chat/${chatSessionId}/history`);
            
            console.log('📤 API Response success:', response.data.success);
            console.log('📤 Messages count:', response.data.messages?.length || 0);
            
            if (response.data.success && response.data.messages && response.data.messages.length > 0) {
                console.log(`📤 Received ${response.data.messages.length} messages from API`);
                
                const chatMessages = response.data.messages.map(msg => {
                    const isAI = msg.isAI === true || msg.sender === 'ai';
                    let sender = msg.sender;
                    let senderName = msg.senderName;
                    
                    if (isAI) {
                        sender = 'ai';
                        senderName = 'AI Assistant';
                    } else if (msg.sender === 'user') {
                        sender = 'user';
                        senderName = msg.senderName || 'You';
                    } else if (msg.sender === 'agent') {
                        sender = 'agent';
                        senderName = msg.senderName || 'Agent';
                    }
                    
                    return {
                        id: msg.id || `chat-${Date.now()}`,
                        content: msg.content || '',
                        timestamp: msg.timestamp || new Date().toISOString(),
                        senderName: senderName,
                        sender: sender,
                        isAgent: sender === 'agent',
                        isAI: isAI,
                        isResolved: msg.isResolved || false,
                        isRatingPrompt: msg.isRatingPrompt || false,
                        senderId: msg.senderId || null
                    };
                });
                
                const sortedMessages = chatMessages.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });
                
                setMessages(sortedMessages);
                console.log('✅ Chat session history loaded:', sortedMessages.length, 'messages');
            } else {
                console.log('ℹ️ No messages found in chat session');
                setMessages([{
                    id: 'human-mode',
                    sender: 'ai',
                    content: '👤 You are now chatting with a human agent. They will respond shortly.',
                    timestamp: new Date().toISOString()
                }]);
            }
        } catch (error) {
            console.error('❌ Error loading chat session history:', error);
        }
    };

    // ✅ Load history - UPDATED to only switch to human mode if messages exist
    const loadHistory = async () => {
        if (!user || !sessionId) {
            console.warn('⚠️ User or session ID missing');
            return;
        }
        
        console.log(`📤 Fetching chat history for user: ${user.uid}`);
        console.log(`📤 Current chatSessionId: ${chatSessionId}`);
        console.log(`📤 isHumanMode: ${isHumanMode}`);
        
        try {
            // ✅ FIRST: Check if we have a chatSessionId
            if (chatSessionId) {
                try {
                    const sessionRef = doc(db, 'chatSessions', chatSessionId);
                    const sessionDoc = await getDoc(sessionRef);
                    
                    if (sessionDoc.exists()) {
                        const data = sessionDoc.data();
                        console.log('📋 Session data:', data);
                        
                        if (data.status === 'resolved') {
                            console.log('ℹ️ Chat session is resolved, clearing it');
                            setChatSessionId(null);
                            setIsHumanMode(false);
                            setIsResolved(false);
                            setAgentName(null);
                        } else {
                            // ✅ Chat is active - ONLY use if it has messages
                            const messages = data.messages || [];
                            if (messages.length > 0) {
                                console.log(`👤 Using existing active chat session with ${messages.length} messages:`, chatSessionId);
                                setIsHumanMode(true);
                                await loadChatSessionHistory();
                                listenToMessages(chatSessionId);
                                return;
                            } else {
                                console.log('ℹ️ Chat session exists but has no messages, clearing');
                                setChatSessionId(null);
                                setIsHumanMode(false);
                                setAgentName(null);
                            }
                        }
                    } else {
                        console.log('ℹ️ Chat session does not exist, clearing');
                        setChatSessionId(null);
                        setIsHumanMode(false);
                        setAgentName(null);
                    }
                } catch (error) {
                    console.log('ℹ️ Could not check session status:', error.message);
                    setChatSessionId(null);
                    setIsHumanMode(false);
                    setAgentName(null);
                }
            }
            
            // ✅ SECOND: Try AI chat history from supportInteractions
            console.log('🔍 Fetching AI chat history from supportInteractions...');
            
            const response = await api.get(`/ai/history/${sessionId}`);
            
            console.log('📤 History response:', response.data);
            
            if (response.data && response.data.length > 0) {
                console.log(`✅ Found ${response.data.length} AI chat interactions`);
                
                const allMessages = [];
                response.data.forEach((item, index) => {
                    if (item.message) {
                        allMessages.push({
                            id: item.id || `msg-${Date.now()}-${index}`,
                            sender: 'user',
                            senderName: 'You',
                            content: item.message,
                            timestamp: item.createdAt || new Date().toISOString(),
                            isRatingPrompt: false,
                            isResolved: false
                        });
                    }
                    if (item.response) {
                        allMessages.push({
                            id: item.id ? `${item.id}-response` : `resp-${Date.now()}-${index}`,
                            sender: 'ai',
                            senderName: 'AI Assistant',
                            content: item.response,
                            timestamp: item.createdAt || new Date().toISOString(),
                            isAI: true,
                            isRatingPrompt: false,
                            isResolved: false
                        });
                    }
                });
                
                const sortedMessages = allMessages.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });
                
                if (sortedMessages.length > 0) {
                    setMessages(sortedMessages);
                    console.log('✅ Chat history loaded:', sortedMessages.length, 'messages');
                    setIsResolved(false);
                    setChatSessionId(null);
                    setIsHumanMode(false);
                    setAgentName(null);
                    return;
                }
            }
            
            // ✅ No history found - show welcome
            console.log('ℹ️ No history found for user');
            setMessages([{
                id: 'welcome',
                sender: 'ai',
                senderName: 'AI Assistant',
                content: "👋 Hello! Welcome to TheSpark.\n\nI can help you with:\n💰 Balance & Wallet\n📚 Wealth Building Education\n🛠️ Wealth Building Tools\n🛍️ Marketplace & Orders\n\nWhat can I help you with today?",
                timestamp: new Date().toISOString(),
                isRatingPrompt: false,
                isResolved: false
            }]);
            
            setIsResolved(false);
            setChatSessionId(null);
            setIsHumanMode(false);
            setAgentName(null);
            
        } catch (error) {
            console.error('❌ Error loading history:', error);
            setMessages([{
                id: 'welcome',
                sender: 'ai',
                senderName: 'AI Assistant',
                content: "👋 Hello! Welcome to TheSpark.\n\nI can help you with:\n💰 Balance & Wallet\n📚 Wealth Building Education\n🛠️ Wealth Building Tools\n🛍️ Marketplace & Orders\n\nWhat can I help you with today?",
                timestamp: new Date().toISOString(),
                isRatingPrompt: false,
                isResolved: false
            }]);
            setIsResolved(false);
            setChatSessionId(null);
            setIsHumanMode(false);
            setAgentName(null);
        }
    };

    // ✅ Start New Chat
    const startNewChat = () => {
        console.log('🔄 Starting new chat...');
        
        setMessages([]);
        const newSessionId = `session-${user?.uid}-${Date.now()}`;
        setSessionId(newSessionId);
        setIsHumanMode(false);
        setHandoffShown(false);
        setChatSessionId(null);
        setAgentName(null);
        setIsResolved(false);
        setUnreadCount(0);
        lastProcessedHandoffRef.current = null;
        
        if (handoffListenerRef.current) {
            handoffListenerRef.current();
            handoffListenerRef.current = null;
        }
        if (messagesListenerRef.current) {
            messagesListenerRef.current();
            messagesListenerRef.current = null;
        }
        if (resolutionListenerRef.current) {
            resolutionListenerRef.current();
            resolutionListenerRef.current = null;
        }
        
        setMessages([{
            id: 'welcome',
            sender: 'ai',
            content: "👋 Hello! Welcome to TheSpark.\n\nI can help you with:\n💰 Balance & Wallet\n📚 Wealth Building Education\n🛠️ Wealth Building Tools\n🛍️ Marketplace & Orders\n\nWhat can I help you with today?",
            timestamp: new Date().toISOString()
        }]);
        
        toast.success('✅ Started new chat session');
        setIsOpen(true);
    };

    // ✅ Send message - Backend handles everything
    const sendMessage = async (content) => {
        if (!user) {
            toast.error('Please login to chat');
            return;
        }

        if (isResolved) {
            toast.error('This chat has been resolved. Please start a new chat.');
            return;
        }

        console.log(`📤 Sending message: ${content?.substring(0, 30)}...`);
        console.log(`📤 Current session ID: ${sessionId}`);
        console.log(`📤 Current messages count: ${messages.length}`);

        const userMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            content: content,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        if (isHumanMode && chatSessionId) {
            try {
                const token = await user.getIdToken();
                setAuthToken(token);
                const response = await api.post(`/ai/chat/${chatSessionId}/message`, {
                    message: content
                });
                if (response.data.success) {
                    console.log('✅ Message sent to agent');
                    toast.success('Message sent to agent');
                }
            } catch (error) {
                console.error('Error sending to agent:', error);
                toast.error('Failed to send message to agent');
            }
            return;
        }

        setIsTyping(true);

        try {
            const response = await sendAIMessage(content, sessionId);

            console.log('📤 AI Response:', response);
            console.log(`📤 needsHuman: ${response.needsHuman}`);

            if (!response.success) {
                toast.error(response.error || 'Failed to send message');
                setIsTyping(false);
                return;
            }

            const aiMessage = {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                content: response.response,
                timestamp: new Date().toISOString(),
                isAI: true
            };
            setMessages(prev => [...prev, aiMessage]);
            console.log('✅ AI response added to chat');

            setIsTyping(false);

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.message || 'Failed to send message');
            setIsTyping(false);
        }
    };

    // ✅ Handle rating submission
    const submitRating = async (rating) => {
        if (!chatSessionId || !user) {
            toast.error('Unable to submit rating');
            return;
        }

        try {
            const token = await user.getIdToken();
            setAuthToken(token);
            
            await api.post(`/ai/chat/${chatSessionId}/rating`, {
                rating: rating,
                userId: user.uid,
                timestamp: new Date().toISOString()
            });
            
            toast.success(`Thank you for your ${rating}-star rating! ⭐`);
            
            setTimeout(() => {
                startNewChat();
            }, 2000);
            
        } catch (error) {
            console.error('Error saving rating:', error);
            toast.error('Failed to save rating');
        }
    };

    // ✅ Toggle chat - UPDATED to check for messages
    const toggleChat = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        
        if (newIsOpen) {
            if (chatSessionId && !isHumanMode) {
                const checkSession = async () => {
                    try {
                        const sessionRef = doc(db, 'chatSessions', chatSessionId);
                        const sessionDoc = await getDoc(sessionRef);
                        if (sessionDoc.exists()) {
                            const data = sessionDoc.data();
                            const messages = data.messages || [];
                            if (messages.length > 0) {
                                console.log(`👤 Session has ${messages.length} messages, switching to human mode`);
                                setIsHumanMode(true);
                                loadChatSessionHistory();
                                listenToMessages(chatSessionId);
                            } else {
                                console.log('ℹ️ Session has no messages, staying in AI mode');
                                setChatSessionId(null);
                                setAgentName(null);
                            }
                        }
                    } catch (error) {
                        console.log('⚠️ Error checking session:', error.message);
                    }
                };
                checkSession();
            }
        }
        if (!newIsOpen) {
            setUnreadCount(0);
        }
    };

    const clearMessages = () => {
        setMessages([]);
        setSessionId(`session-${user?.uid}-${Date.now()}`);
        setIsHumanMode(false);
        setHandoffShown(false);
        setChatSessionId(null);
        setAgentName(null);
        setIsResolved(false);
        lastProcessedHandoffRef.current = null;
        
        if (handoffListenerRef.current) {
            handoffListenerRef.current();
            handoffListenerRef.current = null;
        }
        if (messagesListenerRef.current) {
            messagesListenerRef.current();
            messagesListenerRef.current = null;
        }
        if (resolutionListenerRef.current) {
            resolutionListenerRef.current();
            resolutionListenerRef.current = null;
        }
    };

    // ✅ Resolve current chat
    const resolveCurrentChat = async () => {
        if (!chatSessionId) {
            throw new Error('No active chat session to resolve');
        }
        
        try {
            console.log('✅ resolveCurrentChat called for session:', chatSessionId);
            
            const token = await user.getIdToken();
            setAuthToken(token);
            const response = await api.put(`/ai/chat/${chatSessionId}/resolve`);
            
            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to resolve chat');
            }
            
            console.log('✅ Chat resolved successfully');
            toast.success('✅ Chat resolved');
            setIsResolved(true);
            
            const resolvedMessage = {
                id: `resolved-${Date.now()}`,
                sender: 'ai',
                content: '✅ This conversation has been resolved. Thank you for contacting us!',
                timestamp: new Date().toISOString(),
                isResolved: true
            };
            setMessages(prev => [...prev, resolvedMessage]);
            
            const ratingMessage = {
                id: `rating-${Date.now()}`,
                sender: 'ai',
                content: '📊 How was your experience with our support?',
                timestamp: new Date().toISOString(),
                isRatingPrompt: true
            };
            setMessages(prev => {
                console.log('📊 Adding rating prompt from resolveCurrentChat. Current count:', prev.length);
                return [...prev, ratingMessage];
            });
            
            setIsHumanMode(false);
            setChatSessionId(null);
            setAgentName(null);
            lastProcessedHandoffRef.current = null;
            
            if (messagesListenerRef.current) {
                messagesListenerRef.current();
                messagesListenerRef.current = null;
            }
            if (resolutionListenerRef.current) {
                resolutionListenerRef.current();
                resolutionListenerRef.current = null;
            }
        } catch (error) {
            console.error('Error resolving chat:', error);
            toast.error(error.message || 'Failed to resolve chat');
            throw error;
        }
    };

    return (
        <AISupportContext.Provider value={{
            messages,
            isOpen,
            isTyping,
            unreadCount,
            isHumanMode,
            isHumanAvailable,
            sessionId,
            chatSessionId,
            agentName,
            isAgentTyping,
            isResolved,
            sendMessage,
            toggleChat,
            clearMessages,
            setIsOpen,
            setUnreadCount,
            loadHistory,
            resolveCurrentChat,
            submitRating,
            startNewChat
        }}>
            {children}
        </AISupportContext.Provider>
    );
}

export function useAISupport() {
    const context = useContext(AISupportContext);
    if (!context) {
        throw new Error('useAISupport must be used within an AISupportProvider');
    }
    return context;
}