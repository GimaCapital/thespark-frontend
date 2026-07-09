// // // src/components/Admin/AgentDashboard.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { api, setAuthToken } from '../../services/api';
// import { db } from '../../services/firebase';
// import { 
//     collection, 
//     query, 
//     where, 
//     onSnapshot, 
//     doc, 
//     orderBy 
// } from 'firebase/firestore';
// import {
//     getPendingHandoffs,
//     claimHandoffRequest,
//     getChatMessages,
//     sendChatMessage,
//     resolveChat,
//     getActiveSessions
// } from '../../services/aiSupport';
// import toast from 'react-hot-toast';

// export default function AgentDashboard() {
//     const { user } = useAuth();
//     const [pendingHandoffs, setPendingHandoffs] = useState([]);
//     const [activeSessions, setActiveSessions] = useState([]);
//     const [selectedSession, setSelectedSession] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [agentName, setAgentName] = useState('');
//     const [userName, setUserName] = useState('');
    
//     // Refs for cleanup
//     const unsubscribeHandoffsRef = useRef(null);
//     const unsubscribeSessionsRef = useRef(null);
//     const unsubscribeMessagesRef = useRef(null);
//     const dataLoadedRef = useRef(false);

//     // ✅ Load user data once
//     useEffect(() => {
//         if (user && !dataLoadedRef.current) {
//             dataLoadedRef.current = true;
//             loadUserData();
//         }
//     }, [user]);

//     // ✅ INDUSTRY STANDARD: Real-time listeners (NO POLLING!)
//     useEffect(() => {
//         if (!user) return;

//         console.log('📡 Setting up real-time Firestore listeners...');
//         console.log('👤 Current user UID:', user.uid);

//         // 1. Listen for pending handoffs (real-time)
//         const handoffsQuery = query(
//             collection(db, 'handoffRequests'),
//             where('status', '==', 'pending'),
//             orderBy('createdAt', 'desc')
//         );

//         unsubscribeHandoffsRef.current = onSnapshot(
//             handoffsQuery,
//             (snapshot) => {
//                 console.log('✅ Handoffs snapshot received!');
//                 const handoffs = [];
//                 snapshot.forEach(doc => {
//                     const data = doc.data();
//                     handoffs.push({ 
//                         id: doc.id, 
//                         ...data,
//                         createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
//                     });
//                 });
//                 setPendingHandoffs(handoffs);
//                 console.log(`📩 Real-time update: ${handoffs.length} pending handoffs`);
//             },
//             (error) => {
//                 console.error('❌ Handoffs listener error:', error);
//                 console.error('❌ Error code:', error.code);
//                 console.error('❌ Error message:', error.message);
//             }
//         );

//         // 2. Listen for active sessions (real-time)
//         const sessionsQuery = query(
//             collection(db, 'chatSessions'),
//             where('agentId', '==', user.uid),
//             where('status', '==', 'active'),
//             orderBy('updatedAt', 'desc')
//         );

//         unsubscribeSessionsRef.current = onSnapshot(
//             sessionsQuery,
//             (snapshot) => {
//                 console.log('✅ Sessions snapshot received!');
//                 const sessions = [];
//                 snapshot.forEach(doc => {
//                     const data = doc.data();
//                     sessions.push({ 
//                         id: doc.id, 
//                         ...data,
//                         updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
//                     });
//                 });
//                 setActiveSessions(sessions);
//                 console.log(`📩 Real-time update: ${sessions.length} active sessions`);
//             },
//             (error) => {
//                 console.error('❌ Sessions listener error:', error);
//                 console.error('❌ Error code:', error.code);
//                 console.error('❌ Error message:', error.message);
//             }
//         );

//         return () => {
//             console.log('📡 Cleaning up Firestore listeners...');
//             if (unsubscribeHandoffsRef.current) {
//                 unsubscribeHandoffsRef.current();
//                 unsubscribeHandoffsRef.current = null;
//             }
//             if (unsubscribeSessionsRef.current) {
//                 unsubscribeSessionsRef.current();
//                 unsubscribeSessionsRef.current = null;
//             }
//         };
//     }, [user]);

//     // ✅ Listen for messages in selected chat (real-time)
//     useEffect(() => {
//         // Clean up previous listener
//         if (unsubscribeMessagesRef.current) {
//             unsubscribeMessagesRef.current();
//             unsubscribeMessagesRef.current = null;
//         }

//         if (!selectedSession) {
//             setMessages([]);
//             return;
//         }

//         console.log(`📡 Listening for messages in session: ${selectedSession.id}`);

//         const sessionRef = doc(db, 'chatSessions', selectedSession.id);
        
//         unsubscribeMessagesRef.current = onSnapshot(
//             sessionRef,
//             (docSnapshot) => {
//                 if (docSnapshot.exists()) {
//                     const data = docSnapshot.data();
//                     const newMessages = data?.messages || [];
                    
//                     const sortedMessages = [...newMessages].sort((a, b) => {
//                         return new Date(a.timestamp) - new Date(b.timestamp);
//                     });
                    
//                     setMessages(sortedMessages);
//                     console.log(`📩 Real-time update: ${sortedMessages.length} messages`);
                    
//                     setActiveSessions(prev => prev.map(session => {
//                         if (session.id === selectedSession.id) {
//                             return {
//                                 ...session,
//                                 messages: sortedMessages,
//                                 updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
//                             };
//                         }
//                         return session;
//                     }));
//                 }
//             },
//             (error) => {
//                 console.error('❌ Messages listener error:', error);
//             }
//         );

//         return () => {
//             if (unsubscribeMessagesRef.current) {
//                 unsubscribeMessagesRef.current();
//                 unsubscribeMessagesRef.current = null;
//             }
//         };
//     }, [selectedSession]);

//     const loadUserData = async () => {
//         if (!user) return;
        
//         try {
//             const token = await user.getIdToken(true);
//             setAuthToken(token);
            
//             const response = await api.get('/users/me');
            
//             if (!response.data) {
//                 throw new Error('No user data received');
//             }
            
//             const userData = response.data;
//             const name = userData.fullName || userData.name || userData.displayName || 'Agent';
//             setAgentName(name);
//             console.log('✅ Agent loaded:', name);
            
//         } catch (error) {
//             console.error('❌ Error loading agent data:', error);
//             setAgentName('Agent');
//         }
//     };

//     // ✅ Fetch user names for sessions
//     useEffect(() => {
//         const fetchUserNames = async () => {
//             if (!user || activeSessions.length === 0) return;
            
//             const updatedSessions = await Promise.all(
//                 activeSessions.map(async (session) => {
//                     if (session.userId && !session.userName) {
//                         try {
//                             const token = await user.getIdToken();
//                             setAuthToken(token);
//                             const response = await api.get(`/users/${session.userId}`);
//                             session.userName = response.data?.fullName || response.data?.name || response.data?.displayName || 'User';
//                         } catch (error) {
//                             session.userName = 'User';
//                         }
//                     }
//                     return session;
//                 })
//             );
            
//             setActiveSessions(updatedSessions);
//         };
        
//         fetchUserNames();
//     }, [activeSessions.length]);

//     // ✅ FIXED: Claim handoff with better state management
//     const claimHandoff = async (handoffId) => {
//         setLoading(true);
//         try {
//             const response = await claimHandoffRequest(handoffId);
            
//             if (!response || !response.success) {
//                 throw new Error(response?.message || 'Failed to claim handoff');
//             }
            
//             toast.success('Handoff claimed!');
            
//             const chatSessionId = response.sessionId;
//             console.log('✅ Chat session created:', chatSessionId);
            
//             setUserName(response.agentName || 'Agent');
            
//             if (chatSessionId) {
//                 // ✅ Find the session in active sessions
//                 let session = activeSessions.find(s => s.id === chatSessionId);
                
//                 if (session) {
//                     // Session exists, select it
//                     setSelectedSession(session);
//                     setUserName(session.userName || 'User');
//                 } else {
//                     // Session not yet in active sessions, wait for it
//                     toast.success('Waiting for chat session to load...');
                    
//                     // ✅ Set up a temporary listener to wait for the session
//                     const waitForSession = setInterval(() => {
//                         const foundSession = activeSessions.find(s => s.id === chatSessionId);
//                         if (foundSession) {
//                             clearInterval(waitForSession);
//                             setSelectedSession(foundSession);
//                             setUserName(foundSession.userName || 'User');
//                             toast.success('Chat session loaded!');
//                         }
//                     }, 1000);
                    
//                     // ✅ Timeout after 10 seconds
//                     setTimeout(() => {
//                         clearInterval(waitForSession);
//                     }, 10000);
//                 }
//             }
            
//         } catch (error) {
//             console.error('❌ Error claiming handoff:', error);
//             toast.error(error.response?.data?.error || error.message || 'Failed to claim handoff');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadChatSession = async (sessionId) => {
//         if (!sessionId) return;
        
//         try {
//             console.log(`📤 Loading chat session: ${sessionId}`);
            
//             const session = activeSessions.find(s => s.id === sessionId);
//             if (session) {
//                 setSelectedSession(session);
//                 setUserName(session.userName || 'User');
//             }
            
//         } catch (error) {
//             console.error('❌ Error loading chat session:', error);
//             toast.error(error.response?.data?.error || error.message || 'Failed to load chat');
//         }
//     };

//     const sendMessage = async () => {
//         if (!newMessage.trim() || !selectedSession) {
//             toast.error('No message to send');
//             return;
//         }
        
//         try {
//             const response = await sendChatMessage(selectedSession.id, newMessage.trim());
            
//             if (!response || !response.success) {
//                 throw new Error(response?.message || 'Failed to send message');
//             }
            
//             setNewMessage('');
            
//         } catch (error) {
//             console.error('❌ Error sending message:', error);
//             toast.error(error.response?.data?.error || error.message || 'Failed to send message');
//         }
//     };

//     const handleResolveChat = async () => {
//         if (!selectedSession) {
//             toast.error('No chat selected');
//             return;
//         }
        
//         try {
//             const response = await resolveChat(selectedSession.id);
            
//             if (!response || !response.success) {
//                 throw new Error(response?.message || 'Failed to resolve chat');
//             }
            
//             toast.success('Chat resolved');
//             setSelectedSession(null);
//             setMessages([]);
            
//         } catch (error) {
//             console.error('❌ Error resolving chat:', error);
//             toast.error(error.response?.data?.error || error.message || 'Failed to resolve chat');
//         }
//     };

//     // ✅ Handle Firebase timestamps
//     const formatTime = (timestamp) => {
//         if (!timestamp) return '';
//         let date;
//         if (timestamp?.toDate) {
//             date = timestamp.toDate();
//         } else if (typeof timestamp === 'string') {
//             date = new Date(timestamp);
//         } else if (typeof timestamp === 'number') {
//             date = new Date(timestamp);
//         } else {
//             return '';
//         }
//         return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//     };

//     const formatDate = (timestamp) => {
//         if (!timestamp) return '';
//         let date;
//         if (timestamp?.toDate) {
//             date = timestamp.toDate();
//         } else if (typeof timestamp === 'string') {
//             date = new Date(timestamp);
//         } else if (typeof timestamp === 'number') {
//             date = new Date(timestamp);
//         } else {
//             return '';
//         }
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="max-w-7xl mx-auto px-4 py-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">👤 Agent Dashboard</h1>
//                         <p className="text-sm text-gray-500">Manage support requests and chat with users</p>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                         <span className="font-medium text-gray-700">Agent:</span> {agentName || 'Loading...'}
//                     </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <p className="text-sm text-gray-500">Pending Requests</p>
//                         <p className="text-2xl font-bold text-spark-600">{pendingHandoffs.length}</p>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <p className="text-sm text-gray-500">Active Chats</p>
//                         <p className="text-2xl font-bold text-blue-600">{activeSessions.length}</p>
//                     </div>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//                         <p className="text-sm text-gray-500">Resolved Today</p>
//                         <p className="text-2xl font-bold text-green-600">0</p>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-6">
//                     {/* Left: Pending Handoffs */}
//                     <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
//                         <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                             📋 Pending Requests
//                             {pendingHandoffs.length > 0 && (
//                                 <span className="bg-spark-100 text-spark-600 text-xs px-2 py-0.5 rounded-full">
//                                     {pendingHandoffs.length}
//                                 </span>
//                             )}
//                         </h2>
//                         {pendingHandoffs.length === 0 ? (
//                             <p className="text-gray-400 text-sm text-center py-8">No pending requests</p>
//                         ) : (
//                             <div className="space-y-3">
//                                 {pendingHandoffs.map((handoff) => (
//                                     <div key={handoff.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
//                                         <p className="font-medium text-sm text-gray-900">
//                                             {handoff.userName || 'Unknown User'}
//                                         </p>
//                                         <p className="text-xs text-gray-500 mt-1 line-clamp-2">
//                                             {handoff.message || 'Requesting support'}
//                                         </p>
//                                         <p className="text-xs text-gray-400 mt-1">
//                                             {formatDate(handoff.createdAt)} • {formatTime(handoff.createdAt)}
//                                         </p>
//                                         <button
//                                             onClick={() => claimHandoff(handoff.id)}
//                                             disabled={loading}
//                                             className="mt-2 px-4 py-1.5 bg-spark-500 hover:bg-spark-600 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
//                                         >
//                                             {loading ? 'Claiming...' : 'Claim & Chat'}
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Middle: Active Chats */}
//                     <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
//                         <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                             💬 Active Chats
//                             {activeSessions.length > 0 && (
//                                 <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
//                                     {activeSessions.length}
//                                 </span>
//                             )}
//                         </h2>
//                         {activeSessions.length === 0 ? (
//                             <p className="text-gray-400 text-sm text-center py-8">No active chats</p>
//                         ) : (
//                             <div className="space-y-2">
//                                 {activeSessions.map((session) => {
//                                     const messageCount = session.messages?.length || 0;
//                                     const isSelected = selectedSession?.id === session.id;
//                                     return (
//                                         <div
//                                             key={session.id}
//                                             onClick={() => loadChatSession(session.id)}
//                                             className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition ${
//                                                 isSelected ? 'border-spark-300 bg-spark-50' : 'border-gray-100'
//                                             }`}
//                                         >
//                                             <p className="font-medium text-sm text-gray-900">
//                                                 {session.userName || 'User'}
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 {messageCount} messages
//                                             </p>
//                                             <p className="text-xs text-gray-400 mt-1">
//                                                 Last: {formatTime(session.updatedAt)}
//                                             </p>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>

//                     {/* Right: Chat Window */}
//                     <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-[500px]">
//                         {selectedSession ? (
//                             <>
//                                 <div className="flex items-center justify-between border-b pb-3 mb-3">
//                                     <div>
//                                         <h2 className="font-semibold text-gray-900 text-sm">Chat with {userName || 'User'}</h2>
//                                         <p className="text-xs text-gray-500">
//                                             Session: {selectedSession.id?.slice(0, 8)}...
//                                         </p>
//                                     </div>
//                                     <button
//                                         onClick={handleResolveChat}
//                                         className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition"
//                                     >
//                                         Resolve
//                                     </button>
//                                 </div>

//                                 <div className="flex-1 overflow-y-auto space-y-2 mb-3">
//                                     {messages.length === 0 ? (
//                                         <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                                             No messages yet
//                                         </div>
//                                     ) : (
//                                         messages.map((msg) => (
//                                             <div key={msg.id} className={`flex ${msg.isAgent ? 'justify-end' : 'justify-start'}`}>
//                                                 <div className={`max-w-[80%] rounded-lg p-2.5 ${
//                                                     msg.isAgent
//                                                         ? 'bg-spark-500 text-white'
//                                                         : 'bg-gray-100 text-gray-800'
//                                                 }`}>
//                                                     <p className="text-xs font-medium">
//                                                         {msg.senderName || (msg.isAgent ? agentName : userName)}
//                                                     </p>
//                                                     <p className="text-sm mt-0.5">{msg.content}</p>
//                                                     <div className="flex items-center justify-between mt-1">
//                                                         <p className="text-xs opacity-60">
//                                                             {formatTime(msg.timestamp)}
//                                                         </p>
//                                                         {/* ✅ Show message ID (chat session ID) */}
//                                                         <p className="text-[10px] opacity-40 font-mono ml-2">
//                                                             ID: {msg.id?.slice(-6) || 'N/A'}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>

//                                 <div className="flex gap-2 border-t pt-3">
//                                     <input
//                                         type="text"
//                                         value={newMessage}
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                                         placeholder="Type a message..."
//                                         className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spark-500"
//                                     />
//                                     <button
//                                         onClick={sendMessage}
//                                         className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg text-sm transition"
//                                     >
//                                         Send
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
//                                 Select a chat to start
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/components/Admin/AgentDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { db } from '../../services/firebase';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    getDoc,
    orderBy 
} from 'firebase/firestore';
import {
    getPendingHandoffs,
    claimHandoffRequest,
    getChatMessages,
    sendChatMessage,
    resolveChat,
    getActiveSessions
} from '../../services/aiSupport';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
    const { user } = useAuth();
    const [pendingHandoffs, setPendingHandoffs] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [agentName, setAgentName] = useState('');
    const [userName, setUserName] = useState('');
    
    // ✅ Resolution state
    const [isResolving, setIsResolving] = useState(false);
    const resolveTimeoutRef = useRef(null);
    const resolveMessageSentRef = useRef(false);
    
    // Refs for cleanup
    const unsubscribeHandoffsRef = useRef(null);
    const unsubscribeSessionsRef = useRef(null);
    const unsubscribeMessagesRef = useRef(null);
    const dataLoadedRef = useRef(false);

    // ✅ Load user data once
    useEffect(() => {
        if (user && !dataLoadedRef.current) {
            dataLoadedRef.current = true;
            loadUserData();
        }
    }, [user]);

    // ✅ INDUSTRY STANDARD: Real-time listeners (NO POLLING!)
    useEffect(() => {
        if (!user) return;

        console.log('📡 Setting up real-time Firestore listeners...');
        console.log('👤 Current user UID:', user.uid);

        // 1. Listen for pending handoffs (real-time)
        const handoffsQuery = query(
            collection(db, 'handoffRequests'),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );

        unsubscribeHandoffsRef.current = onSnapshot(
            handoffsQuery,
            (snapshot) => {
                console.log('✅ Handoffs snapshot received!');
                const handoffs = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    handoffs.push({ 
                        id: doc.id, 
                        ...data,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
                    });
                });
                setPendingHandoffs(handoffs);
                console.log(`📩 Real-time update: ${handoffs.length} pending handoffs`);
            },
            (error) => {
                console.error('❌ Handoffs listener error:', error);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error message:', error.message);
            }
        );

        // 2. Listen for active sessions (real-time)
        const sessionsQuery = query(
            collection(db, 'chatSessions'),
            where('agentId', '==', user.uid),
            where('status', '==', 'active'),
            orderBy('updatedAt', 'desc')
        );

        unsubscribeSessionsRef.current = onSnapshot(
            sessionsQuery,
            (snapshot) => {
                console.log('✅ Sessions snapshot received!');
                const sessions = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    sessions.push({ 
                        id: doc.id, 
                        ...data,
                        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
                    });
                });
                setActiveSessions(sessions);
                console.log(`📩 Real-time update: ${sessions.length} active sessions`);
            },
            (error) => {
                console.error('❌ Sessions listener error:', error);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error message:', error.message);
            }
        );

        return () => {
            console.log('📡 Cleaning up Firestore listeners...');
            if (unsubscribeHandoffsRef.current) {
                unsubscribeHandoffsRef.current();
                unsubscribeHandoffsRef.current = null;
            }
            if (unsubscribeSessionsRef.current) {
                unsubscribeSessionsRef.current();
                unsubscribeSessionsRef.current = null;
            }
        };
    }, [user]);

    // ✅ Listen for messages in selected chat (real-time)
    useEffect(() => {
        // Clean up previous listener
        if (unsubscribeMessagesRef.current) {
            unsubscribeMessagesRef.current();
            unsubscribeMessagesRef.current = null;
        }

        if (!selectedSession) {
            setMessages([]);
            return;
        }

        console.log(`📡 Listening for messages in session: ${selectedSession.id}`);

        const sessionRef = doc(db, 'chatSessions', selectedSession.id);
        
        unsubscribeMessagesRef.current = onSnapshot(
            sessionRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const newMessages = data?.messages || [];
                    
                    const sortedMessages = [...newMessages].sort((a, b) => {
                        return new Date(a.timestamp) - new Date(b.timestamp);
                    });
                    
                    setMessages(sortedMessages);
                    console.log(`📩 Real-time update: ${sortedMessages.length} messages`);
                    
                    setActiveSessions(prev => prev.map(session => {
                        if (session.id === selectedSession.id) {
                            return {
                                ...session,
                                messages: sortedMessages,
                                updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
                            };
                        }
                        return session;
                    }));
                }
            },
            (error) => {
                console.error('❌ Messages listener error:', error);
            }
        );

        return () => {
            if (unsubscribeMessagesRef.current) {
                unsubscribeMessagesRef.current();
                unsubscribeMessagesRef.current = null;
            }
        };
    }, [selectedSession]);

    const loadUserData = async () => {
        if (!user) return;
        
        try {
            const token = await user.getIdToken(true);
            setAuthToken(token);
            
            const response = await api.get('/users/me');
            
            if (!response.data) {
                throw new Error('No user data received');
            }
            
            const userData = response.data;
            const name = userData.fullName || userData.name || userData.displayName || 'Agent';
            setAgentName(name);
            console.log('✅ Agent loaded:', name);
            
        } catch (error) {
            console.error('❌ Error loading agent data:', error);
            setAgentName('Agent');
        }
    };

    // ✅ Fetch user names for sessions
    useEffect(() => {
        const fetchUserNames = async () => {
            if (!user || activeSessions.length === 0) return;
            
            const updatedSessions = await Promise.all(
                activeSessions.map(async (session) => {
                    if (session.userId && !session.userName) {
                        try {
                            const token = await user.getIdToken();
                            setAuthToken(token);
                            const response = await api.get(`/users/${session.userId}`);
                            session.userName = response.data?.fullName || response.data?.name || response.data?.displayName || 'User';
                        } catch (error) {
                            session.userName = 'User';
                        }
                    }
                    return session;
                })
            );
            
            setActiveSessions(updatedSessions);
        };
        
        fetchUserNames();
    }, [activeSessions.length]);

    // ✅ Claim handoff with better state management
    const claimHandoff = async (handoffId) => {
        setLoading(true);
        try {
            const response = await claimHandoffRequest(handoffId);
            
            if (!response || !response.success) {
                throw new Error(response?.message || 'Failed to claim handoff');
            }
            
            toast.success('Handoff claimed!');
            
            const chatSessionId = response.sessionId;
            console.log('✅ Chat session created:', chatSessionId);
            
            setUserName(response.agentName || 'Agent');
            
            if (chatSessionId) {
                // ✅ Find the session in active sessions
                let session = activeSessions.find(s => s.id === chatSessionId);
                
                if (session) {
                    // Session exists, select it
                    setSelectedSession(session);
                    setUserName(session.userName || 'User');
                } else {
                    // Session not yet in active sessions, wait for it
                    toast.success('Waiting for chat session to load...');
                    
                    // ✅ Set up a temporary listener to wait for the session
                    const waitForSession = setInterval(() => {
                        const foundSession = activeSessions.find(s => s.id === chatSessionId);
                        if (foundSession) {
                            clearInterval(waitForSession);
                            setSelectedSession(foundSession);
                            setUserName(foundSession.userName || 'User');
                            toast.success('Chat session loaded!');
                        }
                    }, 1000);
                    
                    // ✅ Timeout after 10 seconds
                    setTimeout(() => {
                        clearInterval(waitForSession);
                    }, 10000);
                }
            }
            
        } catch (error) {
            console.error('❌ Error claiming handoff:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to claim handoff');
        } finally {
            setLoading(false);
        }
    };

    const loadChatSession = async (sessionId) => {
        if (!sessionId) return;
        
        try {
            console.log(`📤 Loading chat session: ${sessionId}`);
            
            const session = activeSessions.find(s => s.id === sessionId);
            if (session) {
                setSelectedSession(session);
                setUserName(session.userName || 'User');
            }
            
        } catch (error) {
            console.error('❌ Error loading chat session:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to load chat');
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedSession) {
            toast.error('No message to send');
            return;
        }
        
        try {
            const response = await sendChatMessage(selectedSession.id, newMessage.trim());
            
            if (!response || !response.success) {
                throw new Error(response?.message || 'Failed to send message');
            }
            
            setNewMessage('');
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to send message');
        }
    };

    // ✅ CLOSE CHAT - IMMEDIATE (Independent - No wait)
    const handleCloseChat = async () => {
        if (!selectedSession) {
            toast.error('No chat selected');
            return;
        }
        
        // ✅ Prevent double-clicks
        if (isResolving) {
            toast.success('Already processing...');
            return;
        }
        
        // ✅ Check if already resolved
        try {
            const sessionRef = doc(db, 'chatSessions', selectedSession.id);
            const sessionDoc = await getDoc(sessionRef);
            if (sessionDoc.exists() && sessionDoc.data().status === 'resolved') {
                toast.success('This chat is already resolved');
                return;
            }
        } catch (error) {
            console.error('Error checking session status:', error);
        }
        
        // ✅ Ask for confirmation
        const userConfirmed = window.confirm(
            'Close this chat immediately? The user will be asked to rate their experience.'
        );
        
        if (!userConfirmed) return;
        
        setIsResolving(true);
        
        try {
            // ✅ Send final message
            await sendChatMessage(selectedSession.id, 
                "✅ This chat has been closed. Thank you for contacting us!"
            );
            
            // ✅ Immediately resolve the chat
            const response = await resolveChat(selectedSession.id);
            
            if (!response || !response.success) {
                throw new Error(response?.message || 'Failed to close chat');
            }
            
            toast.success('✅ Chat closed successfully!');
            setSelectedSession(null);
            setMessages([]);
            setIsResolving(false);
            
        } catch (error) {
            console.error('❌ Error closing chat:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to close chat');
            setIsResolving(false);
        }
    };

    // ✅ RESOLVE WITH WAIT - 60 second wait for user response
    const handleResolveWithWait = async () => {
        if (!selectedSession) {
            toast.error('No chat selected');
            return;
        }
        
        // ✅ Prevent double-clicks
        if (isResolving) {
            toast.success('Already processing resolve...');
            return;
        }
        
        // ✅ Check if already resolved
        try {
            const sessionRef = doc(db, 'chatSessions', selectedSession.id);
            const sessionDoc = await getDoc(sessionRef);
            if (sessionDoc.exists() && sessionDoc.data().status === 'resolved') {
                toast.success('This chat is already resolved');
                return;
            }
        } catch (error) {
            console.error('Error checking session status:', error);
        }
        
        // ✅ Ask for confirmation
        const userConfirmed = window.confirm(
            'Resolve this chat? The user will be asked if they need more help. (60 second wait)'
        );
        
        if (!userConfirmed) return;
        
        setIsResolving(true);
        resolveMessageSentRef.current = false;
        
        try {
            // ✅ Send final message to user
            if (!resolveMessageSentRef.current) {
                await sendChatMessage(selectedSession.id, 
                    "✅ I've resolved your issue. Is there anything else I can help you with? If not, I'll close this chat."
                );
                resolveMessageSentRef.current = true;
                toast.success('⏳ Waiting for user response...');
            }
            
            // ✅ Clear any existing timeout
            if (resolveTimeoutRef.current) {
                clearTimeout(resolveTimeoutRef.current);
            }
            
            // ✅ Wait 60 seconds for user response
            resolveTimeoutRef.current = setTimeout(async () => {
                try {
                    // ✅ Check if user responded
                    const updatedSessionRef = doc(db, 'chatSessions', selectedSession.id);
                    const updatedSessionDoc = await getDoc(updatedSessionRef);
                    const latestMessages = updatedSessionDoc.data()?.messages || [];
                    const lastMessage = latestMessages[latestMessages.length - 1];
                    
                    // ✅ If user responded, check what they said
                    if (lastMessage && lastMessage.sender === 'user') {
                        const userResponse = lastMessage.content?.toLowerCase() || '';
                        
                        // ✅ If user said "yes", "close", "ok" - CLOSE CHAT
                        if (userResponse.includes('yes') || 
                            userResponse.includes('close') ||
                            userResponse.includes('ok') ||
                            userResponse.includes('okay') ||
                            userResponse.includes('fine') ||
                            userResponse.includes('good') ||
                            userResponse.includes('thanks') ||
                            userResponse.includes('thank you')) {
                            
                            toast.success('✅ User confirmed resolution. Closing chat...');
                            const response = await resolveChat(selectedSession.id);
                            if (!response || !response.success) {
                                throw new Error(response?.message || 'Failed to resolve chat');
                            }
                            setSelectedSession(null);
                            setMessages([]);
                            setIsResolving(false);
                            resolveMessageSentRef.current = false;
                            return;
                        }
                        
                        // ✅ If user said "no" or "that's all" - CLOSE CHAT
                        if (userResponse.includes('no') || 
                            userResponse.includes('nothing') ||
                            userResponse.includes('that\'s all') ||
                            userResponse.includes('all good')) {
                            
                            toast.success('✅ User confirmed resolution. Closing chat...');
                            const response = await resolveChat(selectedSession.id);
                            if (!response || !response.success) {
                                throw new Error(response?.message || 'Failed to resolve chat');
                            }
                            setSelectedSession(null);
                            setMessages([]);
                            setIsResolving(false);
                            resolveMessageSentRef.current = false;
                            return;
                        }
                        
                        // ✅ If user asked for more help - CONTINUE CHAT
                        if (userResponse.includes('help') || 
                            userResponse.includes('still') ||
                            userResponse.includes('not resolved') ||
                            userResponse.includes('problem') ||
                            userResponse.includes('issue')) {
                            
                            toast.success('💬 User needs more help. Continuing chat...');
                            setIsResolving(false);
                            resolveMessageSentRef.current = false;
                            return;
                        }
                        
                        // ✅ If user said something else, continue chat
                        toast.success('💬 User responded. Continuing chat...');
                        setIsResolving(false);
                        resolveMessageSentRef.current = false;
                        return;
                    }
                    
                    // ✅ No response, close chat
                    toast.success('✅ No response from user. Closing chat...');
                    const response = await resolveChat(selectedSession.id);
                    if (!response || !response.success) {
                        throw new Error(response?.message || 'Failed to resolve chat');
                    }
                    setSelectedSession(null);
                    setMessages([]);
                    setIsResolving(false);
                    resolveMessageSentRef.current = false;
                    
                } catch (error) {
                    console.error('Error in resolve timeout:', error);
                    toast.error('Failed to resolve chat');
                    setIsResolving(false);
                    resolveMessageSentRef.current = false;
                }
            }, 60000);
            
        } catch (error) {
            console.error('❌ Error resolving chat:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to resolve chat');
            setIsResolving(false);
            resolveMessageSentRef.current = false;
        }
    };

    // ✅ Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (resolveTimeoutRef.current) {
                clearTimeout(resolveTimeoutRef.current);
            }
        };
    }, []);

    // ✅ Handle Firebase timestamps
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        let date;
        if (timestamp?.toDate) {
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            date = new Date(timestamp);
        } else if (typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else {
            return '';
        }
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        let date;
        if (timestamp?.toDate) {
            date = timestamp.toDate();
        } else if (typeof timestamp === 'string') {
            date = new Date(timestamp);
        } else if (typeof timestamp === 'number') {
            date = new Date(timestamp);
        } else {
            return '';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👤 Agent Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage support requests and chat with users</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Agent:</span> {agentName || 'Loading...'}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Pending Requests</p>
                        <p className="text-2xl font-bold text-spark-600">{pendingHandoffs.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Active Chats</p>
                        <p className="text-2xl font-bold text-blue-600">{activeSessions.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Resolved Today</p>
                        <p className="text-2xl font-bold text-green-600">0</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Pending Handoffs */}
                    <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            📋 Pending Requests
                            {pendingHandoffs.length > 0 && (
                                <span className="bg-spark-100 text-spark-600 text-xs px-2 py-0.5 rounded-full">
                                    {pendingHandoffs.length}
                                </span>
                            )}
                        </h2>
                        {pendingHandoffs.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No pending requests</p>
                        ) : (
                            <div className="space-y-3">
                                {pendingHandoffs.map((handoff) => (
                                    <div key={handoff.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
                                        <p className="font-medium text-sm text-gray-900">
                                            {handoff.userName || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {handoff.message || 'Requesting support'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(handoff.createdAt)} • {formatTime(handoff.createdAt)}
                                        </p>
                                        <button
                                            onClick={() => claimHandoff(handoff.id)}
                                            disabled={loading}
                                            className="mt-2 px-4 py-1.5 bg-spark-500 hover:bg-spark-600 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                                        >
                                            {loading ? 'Claiming...' : 'Claim & Chat'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Middle: Active Chats */}
                    <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            💬 Active Chats
                            {activeSessions.length > 0 && (
                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                                    {activeSessions.length}
                                </span>
                            )}
                        </h2>
                        {activeSessions.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No active chats</p>
                        ) : (
                            <div className="space-y-2">
                                {activeSessions.map((session) => {
                                    const messageCount = session.messages?.length || 0;
                                    const isSelected = selectedSession?.id === session.id;
                                    return (
                                        <div
                                            key={session.id}
                                            onClick={() => loadChatSession(session.id)}
                                            className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition ${
                                                isSelected ? 'border-spark-300 bg-spark-50' : 'border-gray-100'
                                            }`}
                                        >
                                            <p className="font-medium text-sm text-gray-900">
                                                {session.userName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {messageCount} messages
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Last: {formatTime(session.updatedAt)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right: Chat Window */}
                    <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-[500px]">
                        {selectedSession ? (
                            <>
                                <div className="flex items-center justify-between border-b pb-3 mb-3">
                                    <div>
                                        <h2 className="font-semibold text-gray-900 text-sm">Chat with {userName || 'User'}</h2>
                                        <p className="text-xs text-gray-500">
                                            Session: {selectedSession.id?.slice(0, 8)}...
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* ✅ Close Chat - IMMEDIATE (Independent) */}
                                        <button
                                            onClick={handleCloseChat}
                                            disabled={isResolving}
                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition"
                                            title="Close chat immediately"
                                        >
                                            {isResolving ? '⏳ Closing...' : 'Close Chat'}
                                        </button>
                                        
                                        {/* ✅ Resolve with Wait - 60 second wait */}
                                        <button
                                            onClick={handleResolveWithWait}
                                            disabled={isResolving}
                                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition"
                                            title="Resolve with 60 second wait"
                                        >
                                            {isResolving ? '⏳ Resolving...' : 'Resolve'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                                    {messages.length === 0 ? (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                            No messages yet
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            // ✅ Check if this is an AI message from the history
                                            const isAI = msg.isAI === true;
                                            const isUser = !msg.isAgent && !isAI;
                                            
                                            return (
                                                <div key={msg.id} className={`flex ${msg.isAgent ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-lg p-2.5 ${
                                                        msg.isAgent
                                                            ? 'bg-spark-500 text-white'
                                                            : isAI
                                                            ? 'bg-purple-100 border border-purple-200 text-gray-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        <p className="text-xs font-medium">
                                                            {msg.isAgent 
                                                                ? agentName 
                                                                : isAI 
                                                                ? '🤖 AI Assistant' 
                                                                : userName || 'User'
                                                            }
                                                            {isAI && (
                                                                <span className="ml-1 text-[10px] text-purple-500">(previous chat)</span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm mt-0.5">{msg.content}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <p className="text-xs opacity-60">
                                                                {formatTime(msg.timestamp)}
                                                            </p>
                                                            <p className="text-[10px] font-mono opacity-40">
                                                                #{msg.id?.slice(-6) || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {isResolving && (
                                        <div className="flex justify-center">
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-700">
                                                ⏳ Waiting for user response...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 border-t pt-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a message..."
                                        disabled={isResolving}
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spark-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim() || isResolving}
                                        className="px-4 py-2 bg-spark-500 hover:bg-spark-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm transition"
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                Select a chat to start
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}