import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAISupport } from '../../contexts/AISupportContext';
import { 
    CloseOutlined, 
    SendOutlined, 
    RobotOutlined, 
    UserOutlined, 
    MoreOutlined 
} from '@ant-design/icons';
import { Modal, Input, Button, Dropdown, Avatar, Badge, Space } from 'antd';
import toast from 'react-hot-toast';

// ✅ MessageContent component with React Router navigation
function MessageContent({ content, className, navigate }) {
    if (!content) return null;
    
    const handleLinkClick = (url) => {
        const cleanUrl = url.replace(/[.,;:!?]+$/, '');
        const path = cleanUrl.replace(/^https?:\/\/[^\/]+/, '');
        navigate(path);
    };
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;
    
    while ((match = urlRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(
                <span key={`text-${keyCounter++}`}>
                    {content.substring(lastIndex, match.index)}
                </span>
            );
        }
        const url = match[0];
        const cleanUrl = url.replace(/[.,;:!?]+$/, '');
        const path = cleanUrl.replace(/^https?:\/\/[^\/]+/, '');
        parts.push(
            <a 
                key={`link-${keyCounter++}`}
                href={path}
                onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(url);
                }}
                className="text-spark-500 underline hover:text-spark-600"
            >
                {cleanUrl}
            </a>
        );
        lastIndex = match.index + url.length;
    }
    
    if (lastIndex < content.length) {
        parts.push(
            <span key={`text-${keyCounter++}`}>
                {content.substring(lastIndex)}
            </span>
        );
    }
    
    if (parts.length === 0) {
        return <div className={className}>{content}</div>;
    }
    
    return <div className={className}>{parts}</div>;
}

export default function AIChatPanel() {
    const navigate = useNavigate();
    
    const { 
        messages, 
        isOpen, 
        isTyping, 
        isHumanMode, 
        isHumanAvailable,
        sendMessage, 
        setIsOpen, 
        clearMessages,
        loadHistory,
        unreadCount,
        setUnreadCount,
        chatSessionId,
        agentName,
        isResolved,
        submitRating,
        startNewChat
    } = useAISupport();
    
    const [newMessage, setNewMessage] = useState('');
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const historyLoadedRef = useRef(false);

    // ✅ Brand Config
    const BRAND = {
        name: 'TheSpark',
        tagline: 'Powered by TheSpark',
        aiName: 'TheSpark AI',
        welcomeMessage: 'Hi! How can we help you?',
        inputPlaceholder: 'Type your message...'
    };

    // Reset unread count when chat opens
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Load history ONLY ONCE when chat first opens
    useEffect(() => {
        if (isOpen && !historyLoadedRef.current) {
            historyLoadedRef.current = true;
            setLoadingHistory(true);
            loadHistory()
                .then(() => setLoadingHistory(false))
                .catch((error) => {
                    console.error('❌ Failed to load history:', error);
                    setLoadingHistory(false);
                });
            if (inputRef.current) inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [messages, isOpen]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleSend = async () => {
        if (isResolved) {
            toast.error('This chat has been resolved. Please start a new chat.');
            return;
        }
        const trimmed = newMessage.trim();
        if (!trimmed) return;
        setNewMessage('');
        await sendMessage(trimmed);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // ✅ Helper to determine message alignment and styling
    const getMessageStyle = (msg) => {
        const sender = msg.sender || 'unknown';
        
        if (sender === 'user') {
            return {
                alignment: 'justify-end',
                bgColor: 'bg-spark-500',
                textColor: 'text-white',
                timeColor: 'text-white/60',
                idColor: 'text-white/40',
                senderColor: 'text-white/80',
                containerClass: 'ml-auto'
            };
        }
        
        if (sender === 'agent') {
            return {
                alignment: 'justify-start',
                bgColor: 'bg-green-500',
                textColor: 'text-white',
                timeColor: 'text-green-200',
                idColor: 'text-green-300',
                senderColor: 'text-green-200',
                containerClass: 'mr-auto'
            };
        }
        
        if (sender === 'ai') {
            return {
                alignment: 'justify-start',
                bgColor: 'bg-white border border-gray-200 shadow-sm',
                textColor: 'text-gray-800',
                timeColor: 'text-gray-400',
                idColor: 'text-gray-400',
                senderColor: 'text-gray-500',
                containerClass: 'mr-auto'
            };
        }
        
        if (msg.isResolved) {
            return {
                alignment: 'justify-center',
                bgColor: 'bg-green-50 border border-green-200',
                textColor: 'text-green-800',
                timeColor: 'text-green-500',
                idColor: 'text-green-400',
                senderColor: 'text-green-600',
                containerClass: 'mx-auto'
            };
        }
        
        if (msg.isRatingPrompt) {
            return {
                alignment: 'justify-center',
                bgColor: 'bg-blue-50 border border-blue-200',
                textColor: 'text-blue-800',
                timeColor: 'text-blue-500',
                idColor: 'text-blue-400',
                senderColor: 'text-blue-600',
                containerClass: 'mx-auto'
            };
        }
        
        return {
            alignment: 'justify-start',
            bgColor: 'bg-gray-200',
            textColor: 'text-gray-800',
            timeColor: 'text-gray-500',
            idColor: 'text-gray-400',
            senderColor: 'text-gray-600',
            containerClass: 'mr-auto'
        };
    };

    const getSenderLabel = (msg) => {
        const sender = msg.sender || 'unknown';
        const senderName = msg.senderName || '';
        
        if (sender === 'user') return 'You';
        if (sender === 'agent') return senderName || 'Agent';
        if (sender === 'ai') return BRAND.aiName;
        if (msg.isResolved) return '✅ Resolved';
        if (msg.isRatingPrompt) return '📊 Rate Your Experience';
        return 'Unknown';
    };

    const handleRatingClick = async (rating) => {
        if (ratingSubmitted) return;
        setRatingSubmitted(true);
        await submitRating(rating);
    };

    const hasRatingPrompt = messages.some(msg => msg.isRatingPrompt === true);
    const showAgentMode = isHumanMode && chatSessionId;

    // ✅ Get agent name from messages for header
    const getAgentNameFromMessages = () => {
        const agentMessages = messages.filter(msg => msg.sender === 'agent' && msg.senderName);
        if (agentMessages.length > 0) {
            return agentMessages[agentMessages.length - 1].senderName;
        }
        return agentName || 'Agent';
    };
    const displayAgentName = getAgentNameFromMessages();

    // ✅ Menu items for Dropdown
    const menuItems = [
        {
            key: 'clear',
            label: '🗑️ Clear Chat',
            onClick: () => {
                if (window.confirm('Clear all messages? This will start a new chat session.')) {
                    clearMessages();
                }
            }
        },
        {
            key: 'new',
            label: '✨ New Chat',
            onClick: () => {
                if (window.confirm('Start a new chat? Your current chat history will be cleared.')) {
                    startNewChat();
                }
            }
        },
        {
            key: 'divider',
            type: 'divider'
        },
        {
            key: 'close',
            label: '✕ Close Chat',
            onClick: () => setIsOpen(false)
        }
    ];

    return (
        <Modal
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            closable={false}
            width={420}
            centered
            className="ai-chat-modal"
            styles={{
                body: {
                    padding: 0,
                    height: 520,
                    display: 'flex',
                    flexDirection: 'column',
                },
                content: {
                    borderRadius: 16,
                    overflow: 'hidden',
                    padding: 0,
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            {/* Header */}
            <div 
                className={`px-4 py-3 flex items-center justify-between flex-shrink-0 ${showAgentMode && !isResolved ? 'bg-gradient-to-r from-green-500 to-green-600' : isResolved ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-spark-400 to-spark-600'}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge dot={!isResolved && isHumanAvailable} color="green" offset={[-2, 2]}>
                        <Avatar 
                            size={40}
                            icon={showAgentMode && !isResolved ? <UserOutlined /> : <RobotOutlined />}
                            className="bg-white/20 text-white"
                            style={{ border: '2px solid rgba(255,255,255,0.3)' }}
                        />
                    </Badge>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">
                            {showAgentMode && !isResolved ? `${displayAgentName || 'Agent'}` : 
                             isResolved ? 'Chat Resolved' : 
                             BRAND.name}
                        </h3>
                        <p className="text-white/70 text-xs truncate">
                            {showAgentMode && !isResolved ? `Session: ${chatSessionId?.slice(0, 8) || 'N/A'}...` : 
                             isResolved ? hasRatingPrompt ? '⭐ Rate us' : 'Click "New Chat" to start fresh' : 
                             '💬 We\'re here to help'}
                        </p>
                        {showAgentMode && !isResolved && (
                            <p className="text-xs text-green-300">✅ Connected</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {isResolved && (
                        <Button
                            type="text"
                            size="small"
                            icon={<span>✨</span>}
                            onClick={() => {
                                if (window.confirm('Start a new chat?')) {
                                    startNewChat();
                                }
                            }}
                            className="text-white hover:text-white/80"
                        >
                            New
                        </Button>
                    )}
                    
                    <Dropdown
                        menu={{ items: menuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button 
                            type="text" 
                            icon={<MoreOutlined />}
                            className="text-white hover:text-white/80"
                        />
                    </Dropdown>

                    <Button 
                        type="text" 
                        icon={<CloseOutlined />}
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-white/80"
                    />
                </div>
            </div>

            {/* Messages - flex-1 takes remaining space */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="flex flex-col space-y-3">
                    {loadingHistory ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-spark-500"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Avatar 
                                icon={<RobotOutlined />} 
                                size={64}
                                className="bg-spark-100 text-spark-500 mb-4"
                            />
                            <p className="text-gray-500 text-sm">
                                {isResolved ? 'Chat has been resolved' : (showAgentMode ? 'Chat with your agent' : BRAND.welcomeMessage)}
                            </p>
                            {isResolved && (
                                <Button
                                    type="primary"
                                    onClick={() => startNewChat()}
                                    className="mt-4 bg-spark-500 hover:bg-spark-600"
                                >
                                    ✨ Start New Chat
                                </Button>
                            )}
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const style = getMessageStyle(msg);
                            const senderLabel = getSenderLabel(msg);
                            const isUser = msg.sender === 'user';
                            const isResolvedMsg = msg.isResolved === true;
                            const isRatingPrompt = msg.isRatingPrompt === true;
                            
                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${style.alignment} w-full`}
                                >
                                    <div className={`max-w-[80%] ${isUser ? 'ml-auto' : isResolvedMsg || isRatingPrompt ? 'mx-auto text-center' : 'mr-auto'}`}>
                                        {!isUser && !isResolvedMsg && !isRatingPrompt && (
                                            <p className={`text-xs font-medium mb-1 px-1 ${style.senderColor}`}>
                                                {senderLabel}
                                            </p>
                                        )}
                                        <div className={`rounded-xl p-3 ${style.bgColor}`}>
                                            <MessageContent 
                                                content={msg.content}
                                                className={`text-sm whitespace-pre-line ${style.textColor}`}
                                                navigate={navigate}
                                            />
                                            {!isResolvedMsg && !isRatingPrompt && (
                                                <div className={`flex items-center justify-between mt-1`}>
                                                    <p className={`text-xs ${style.timeColor}`}>
                                                        {formatTime(msg.timestamp)}
                                                    </p>
                                                    <p className={`text-[10px] font-mono ${style.idColor}`}>
                                                        #{msg.id?.slice(-6) || 'N/A'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {isUser && (
                                            <p className={`text-[10px] text-right mt-1 ${style.senderColor}`}>
                                                You
                                            </p>
                                        )}
                                        
                                        {/* Rating Stars */}
                                        {isRatingPrompt && !ratingSubmitted && (
                                            <div className="flex flex-col items-center gap-2 mt-3">
                                                <p className="text-sm text-gray-600 font-medium">How was your experience?</p>
                                                <div className="flex gap-2 justify-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => handleRatingClick(star)}
                                                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-yellow-400 hover:text-white transition text-sm flex items-center justify-center hover:scale-110 transform"
                                                        >
                                                            ⭐
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-gray-400">Click a star to rate</p>
                                            </div>
                                        )}
                                        {isRatingPrompt && ratingSubmitted && (
                                            <div className="flex flex-col items-center gap-2 mt-3">
                                                <p className="text-sm text-green-600 font-medium">
                                                    ✅ Thank you for your rating!
                                                </p>
                                                <p className="text-xs text-gray-500">Starting new chat...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {isTyping && (
                        <div className="flex justify-start w-full">
                            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm mr-auto">
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-spark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-spark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-spark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input + Footer - flex-shrink-0 keeps it at bottom */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Input
                        ref={inputRef}
                        placeholder={isResolved ? "This conversation has been resolved" : (showAgentMode ? "Type your message..." : BRAND.inputPlaceholder)}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 rounded-lg"
                        disabled={isTyping || isResolved}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isTyping || isResolved}
                        className="bg-spark-500 hover:bg-spark-600 border-spark-500 rounded-lg"
                        style={{ background: '#f97316', borderColor: '#f97316' }}
                    />
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-gray-400">
                        {isResolved ? '💡 Click "New Chat" to start fresh' : 'Press Enter to send'}
                    </p>
                    {chatSessionId && !isResolved && (
                        <p className="text-[10px] text-gray-400 font-mono">
                            📌 {chatSessionId.slice(0, 8)}...
                        </p>
                    )}
                </div>
                <div className="text-center mt-2 pt-1 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">
                        {BRAND.tagline}
                    </p>
                </div>
            </div>
        </Modal>
    );
}