// src/pages/SuccessStories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';

export default function SuccessStories() {
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [userStory, setUserStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState(5);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [newStory, setNewStory] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);

    // track which cards are expanded
    const [expandedStories, setExpandedStories] = useState({});

    // Typing animation
    const [typedTitle, setTypedTitle] = useState('');
    const fullTitle = "Success Stories";

    useEffect(() => {
        let i = 0;
        let direction = 1;
        const typingInterval = setInterval(() => {
            if (direction === 1) {
                if (i <= fullTitle.length) {
                    setTypedTitle(fullTitle.substring(0, i));
                    i++;
                } else {
                    direction = -1;
                }
            } else {
                if (i >= 0) {
                    setTypedTitle(fullTitle.substring(0, i));
                    i--;
                } else {
                    direction = 1;
                    i = 1;
                }
            }
        }, 150);
        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        loadStories();
        if (user) loadUserStory();
    }, [user]);

    // ✅ Auto-open the submit form + scroll if URL has #submit
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.location.hash !== '#submit') return;
        if (!user) return;
        if (loading) return;      // wait for data to load first
        if (userStory) return;    // already has a story — don't auto-open

        // Auto-open the form
        setShowSubmitForm(true);

        // Scroll after the DOM settles
        setTimeout(() => {
            const el = document.getElementById('submit');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }, [user, userStory, loading]);

    const loadStories = async () => {
        try {
            const response = await api.get('/success-stories');
            setStories(response.data);
        } catch (error) {
            // console.error('Failed to load stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserStory = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/success-stories/my-story');
            if (response.data.story) {
                setUserStory(response.data.story);
                setEditText(response.data.story.story);
                setEditRating(response.data.story.rating || 5);
            }
        } catch (error) {
            // console.error('Failed to load user story:', error);
        }
    };

    const getProfileImage = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=EA580C&color=fff&rounded=true&bold=true&size=80`;
    };

    const getBadgeGradient = (badgeLevel) => {
        const gradients = {
            6: 'from-purple-600 to-purple-700',
            5: 'from-yellow-500 to-amber-600',
            4: 'from-gray-500 to-gray-600',
            3: 'from-orange-600 to-orange-700',
            2: 'from-blue-500 to-blue-600',
            1: 'from-green-500 to-green-600'
        };
        return gradients[badgeLevel] || 'from-spark-600 to-orange-500';
    };

    const StarRating = ({ rating, setRating, hoverRating, setHoverRating, size = 'text-2xl' }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating && setHoverRating(star)}
                        onMouseLeave={() => setHoverRating && setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <span className={`${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'} ${size}`}>
                            ★
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const renderStars = (rating) => {
        const ratingValue = rating || 5;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= ratingValue ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const getBadgeStyle = (badgeText) => {
        const badges = {
            'Platinum Saver': { color: 'bg-purple-100 text-purple-700', icon: '💎' },
            'Gold Saver': { color: 'bg-yellow-100 text-yellow-700', icon: '🥇' },
            'Silver Saver': { color: 'bg-gray-100 text-gray-700', icon: '🥈' },
            'Bronze Saver': { color: 'bg-orange-100 text-orange-700', icon: '🥉' },
            'Rising Star': { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
            'Verified Saver': { color: 'bg-green-100 text-green-700', icon: '✓' }
        };
        return badges[badgeText] || badges['Verified Saver'];
    };

    const submitStory = async () => {
        if (!newStory.trim() || newStory.length < 20) {
            toast.error('Please write a meaningful story (at least 20 characters)');
            return;
        }
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post('/success-stories/submit', {
                story: newStory.trim(),
                rating: newRating
            });
            toast.success('Story submitted for admin approval!');
            setShowSubmitForm(false);
            setNewStory('');
            setNewRating(5);
            loadUserStory();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit story');
        }
    };

    const updateStory = async () => {
        if (!editText.trim() || editText.length < 20) {
            toast.error('Please write a meaningful story (at least 20 characters)');
            return;
        }
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.put(`/success-stories/update/${userStory.id}`, {
                story: editText.trim(),
                rating: editRating
            });
            toast.success('Story updated and resubmitted for approval');
            setIsEditing(false);
            loadUserStory();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update story');
        }
    };

    const deleteStory = async () => {
        if (!window.confirm('Are you sure you want to delete your success story?')) return;
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.delete(`/success-stories/delete/${userStory.id}`);
            toast.success('Story deleted');
            setUserStory(null);
        } catch (error) {
            toast.error('Failed to delete story');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
                <HeaderMissionCard />
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-spark-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000&h=1000&fit=crop"
                        alt="Success Stories"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-gray-200">
                        <span className="text-2xl">🌟</span>
                        <span className="text-gray-700 text-sm font-semibold">REAL SUCCESS STORIES</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                        {typedTitle}
                        <span className="inline-block w-1 h-12 bg-white ml-1 animate-pulse"></span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-spark-400 to-orange-400 mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        Real people. Real savings. Real transformation.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Featured Stories */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Featured Stories</h2>
                            <div className="w-12 h-0.5 bg-spark-500 mt-2"></div>
                        </div>
                    </div>

                    {stories.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                            <div className="text-6xl mb-4">🌟</div>
                            <p className="text-gray-500 text-lg">No success stories yet. Be the first to graduate!</p>
                            {!user && (
                                <Link to="/register" className="inline-block mt-4 px-6 py-2 bg-spark-600 text-white rounded-lg font-medium hover:bg-spark-700 transition">
                                    Start Your Journey →
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stories.map((story) => {
                                const badgeStyle = getBadgeStyle(story.badgeText);
                                const badgeGradient = getBadgeGradient(story.badgeLevel);
                                const badgeIcon = story.badgeIcon || badgeStyle.icon;
                                const badgeDisplayText = story.badgeText || 'Verified Saver';
                                const profileImage = getProfileImage(story.name);
                                const isExpanded = !!expandedStories[story.id];
                                const isLong = (story.story || '').length > 150;

                                return (
                                    <div key={story.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                                        <div className={`relative h-24 bg-gradient-to-r ${badgeGradient} flex flex-col items-center justify-center`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">{badgeIcon}</span>
                                                <span className="text-white font-semibold text-sm tracking-wide">
                                                    {badgeDisplayText}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                                        </div>

                                        <div className="relative px-5">
                                            <div className="absolute -top-8 left-5">
                                                <img
                                                    src={profileImage}
                                                    alt={story.name}
                                                    className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-5 pt-10 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{story.name}</h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {renderStars(story.rating || 5)}
                                                    </div>
                                                </div>
                                                <span className={`${badgeStyle.color} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                                    <span>{badgeIcon}</span>
                                                    <span>L{story.badgeLevel} · {badgeDisplayText}</span>
                                                </span>
                                            </div>

                                            <p className={`text-gray-600 text-sm leading-relaxed mt-3 mb-2 flex-1 ${
                                                isExpanded ? '' : 'line-clamp-3'
                                            }`}>
                                                "{story.story}"
                                            </p>

                                            {isLong && (
                                                <button
                                                    onClick={() => setExpandedStories(prev => ({
                                                        ...prev,
                                                        [story.id]: !prev[story.id]
                                                    }))}
                                                    className="text-spark-600 text-xs font-semibold hover:underline text-left mb-3"
                                                >
                                                    {isExpanded ? 'Show less ▲' : 'Read more ▼'}
                                                </button>
                                            )}

                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                                                <span className="text-xs text-gray-400">Graduate</span>
                                                <span className="text-sm font-semibold text-spark-600">₦{story.saved?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* User's Story Section — ✅ anchor target */}
                {user && (
                    <div id="submit" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
                            <img
                                src={getProfileImage(user.email || user.displayName || 'User')}
                                alt="Your avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-bold text-gray-800">Your Story</h3>
                                <p className="text-xs text-gray-500">Share your journey with the community</p>
                            </div>
                        </div>

                        {userStory ? (
                            isEditing ? (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience</label>
                                        <StarRating
                                            rating={editRating}
                                            setRating={setEditRating}
                                            hoverRating={0}
                                            setHoverRating={() => {}}
                                            size="text-2xl"
                                        />
                                    </div>
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition mb-4"
                                        rows="4"
                                        placeholder="Share your wealth journey..."
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={updateStory} className="px-5 py-2 bg-spark-600 text-white rounded-xl font-medium hover:bg-spark-700 transition">
                                            Save Changes
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                        {renderStars(userStory.rating || 5)}
                                        <span className={`text-xs px-3 py-1 rounded-full ${userStory.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                            {userStory.status === 'pending' ? 'Pending Approval' : 'Published'}
                                        </span>
                                    </div>
                                    <div className="bg-spark-50 rounded-xl p-4 mb-4">
                                        <p className="text-gray-700 text-sm leading-relaxed">"{userStory.story}"</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-spark-600 text-white rounded-xl font-medium hover:bg-spark-700 transition">
                                            Edit Story
                                        </button>
                                        <button onClick={deleteStory} className="px-5 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
                                            Delete Story
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : !showSubmitForm ? (
                            <button onClick={() => setShowSubmitForm(true)} className="w-full py-3 border-2 border-spark-500 text-spark-600 rounded-xl font-semibold hover:bg-spark-50 transition">
                                ✍️ Share Your Success Story
                            </button>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience</label>
                                    <StarRating
                                        rating={newRating}
                                        setRating={setNewRating}
                                        hoverRating={hoverRating}
                                        setHoverRating={setHoverRating}
                                        size="text-2xl"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {newRating === 5 && "⭐ Life-changing! Highly recommended"}
                                        {newRating === 4 && "👍 Great experience"}
                                        {newRating === 3 && "😐 It was okay"}
                                        {newRating === 2 && "😕 Needs improvement"}
                                        {newRating === 1 && "😞 Very disappointed"}
                                    </p>
                                </div>
                                <textarea
                                    value={newStory}
                                    onChange={(e) => setNewStory(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition mb-4"
                                    rows="4"
                                    placeholder="Tell us how TheSpark changed your life..."
                                />
                                <div className="flex gap-3">
                                    <button onClick={submitStory} className="px-5 py-2 bg-spark-600 text-white rounded-xl font-medium hover:bg-spark-700 transition">
                                        Submit Story
                                    </button>
                                    <button onClick={() => setShowSubmitForm(false)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Call to Action */}
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=300&fit=crop"
                            alt="Community"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-spark-900/80 to-spark-800/80"></div>
                    </div>
                    <div className="relative z-10 py-12 px-6 text-center text-white">
                        <div className="text-5xl mb-4">🌟</div>
                        <h3 className="text-2xl font-bold mb-2">Your Story Could Be Next</h3>
                        <p className="text-white/80 max-w-md mx-auto">
                            {user
                                ? "Share your wealth journey above. Your story will inspire thousands!"
                                : "Join TheSpark today. Build consistent habits. Graduate in 6 months. Then share your success story!"}
                        </p>
                        {!user && (
                            <Link to="/register" className="inline-block mt-6 px-6 py-2 bg-white text-spark-700 rounded-xl font-semibold hover:bg-spark-50 transition">
                                Start Your Journey →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}