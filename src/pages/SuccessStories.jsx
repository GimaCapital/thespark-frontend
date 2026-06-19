// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';
// import toast from 'react-hot-toast';

// export default function SuccessStories() {
//     const { user } = useAuth();
//     const [stories, setStories] = useState([]);
//     const [userStory, setUserStory] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editText, setEditText] = useState('');
//     const [editRating, setEditRating] = useState(5);
//     const [showSubmitForm, setShowSubmitForm] = useState(false);
//     const [newStory, setNewStory] = useState('');
//     const [newRating, setNewRating] = useState(5);
//     const [hoverRating, setHoverRating] = useState(0);

//     useEffect(() => {
//         loadStories();
//         if (user) loadUserStory();
//     }, [user]);

//     const loadStories = async () => {
//         try {
//             const response = await api.get('/success-stories');
//             setStories(response.data);
//         } catch (error) {
//             console.error('Failed to load stories:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadUserStory = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/success-stories/my-story');
//             if (response.data.story) {
//                 setUserStory(response.data.story);
//                 setEditText(response.data.story.story);
//                 setEditRating(response.data.story.rating || 5);
//             }
//         } catch (error) {
//             console.error('Failed to load user story:', error);
//         }
//     };

//     // Star Rating Component
//     const StarRating = ({ rating, setRating, hoverRating, setHoverRating, size = 'text-2xl' }) => {
//         return (
//             <div className="flex gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                         key={star}
//                         type="button"
//                         onClick={() => setRating(star)}
//                         onMouseEnter={() => setHoverRating && setHoverRating(star)}
//                         onMouseLeave={() => setHoverRating && setHoverRating(0)}
//                         className={`focus:outline-none transition-transform hover:scale-110 ${size}`}
//                     >
//                         <span className={(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}>
//                             ★
//                         </span>
//                     </button>
//                 ))}
//             </div>
//         );
//     };

//     // Render stars for display
//     const renderStars = (rating) => {
//         const ratingValue = rating || 5;
//         return (
//             <div className="flex gap-0.5">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <span key={star} className={star <= ratingValue ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
//                         ★
//                     </span>
//                 ))}
//             </div>
//         );
//     };

//     // Get badge style from stored badge text
//     const getBadgeStyle = (badgeText) => {
//         const badges = {
//             'Platinum Saver': { color: 'bg-purple-100 text-purple-700', icon: '💎' },
//             'Gold Saver': { color: 'bg-yellow-100 text-yellow-700', icon: '🥇' },
//             'Silver Saver': { color: 'bg-gray-100 text-gray-700', icon: '🥈' },
//             'Bronze Saver': { color: 'bg-orange-100 text-orange-700', icon: '🥉' },
//             'Rising Star': { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
//             'Verified Saver': { color: 'bg-green-100 text-green-700', icon: '✓' }
//         };
//         return badges[badgeText] || badges['Verified Saver'];
//     };

//     const submitStory = async () => {
//         if (!newStory.trim() || newStory.length < 20) {
//             toast.error('Please write a meaningful story (at least 20 characters)');
//             return;
//         }
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.post('/success-stories/submit', { 
//                 story: newStory.trim(),
//                 rating: newRating 
//             });
//             toast.success('Story submitted for admin approval!');
//             setShowSubmitForm(false);
//             setNewStory('');
//             setNewRating(5);
//             loadUserStory();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to submit story');
//         }
//     };

//     const updateStory = async () => {
//         if (!editText.trim() || editText.length < 20) {
//             toast.error('Please write a meaningful story (at least 20 characters)');
//             return;
//         }
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.put(`/success-stories/update/${userStory.id}`, { 
//                 story: editText.trim(),
//                 rating: editRating 
//             });
//             toast.success('Story updated and resubmitted for approval');
//             setIsEditing(false);
//             loadUserStory();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to update story');
//         }
//     };

//     const deleteStory = async () => {
//         if (!window.confirm('Are you sure you want to delete your success story?')) return;
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.delete(`/success-stories/delete/${userStory.id}`);
//             toast.success('Story deleted');
//             setUserStory(null);
//         } catch (error) {
//             toast.error('Failed to delete story');
//         }
//     };

//     if (loading) {
//         return <div className="flex-center h-64"><div className="spinner"></div></div>;
//     }

//     return (
//         <div className="container">
//             <HeaderMissionCard />
//             <h1 className="heading-1 text-center spacer-lg">Success Stories</h1>
//             <p className="text-body text-center spacer-lg">Real people. Real savings. Real wealth.</p>
            
//             {user && (
//                 <div className="card spacer-lg">
//                     <h3 className="heading-3 text-center spacer-md">Your Story</h3>
//                     {userStory ? (
//                         isEditing ? (
//                             <div>
//                                 <div className="spacer-md">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience (1-5 stars)</label>
//                                     <StarRating 
//                                         rating={editRating} 
//                                         setRating={setEditRating} 
//                                         hoverRating={0}
//                                         setHoverRating={() => {}}
//                                         size="text-2xl"
//                                     />
//                                 </div>
//                                 <textarea 
//                                     value={editText} 
//                                     onChange={(e) => setEditText(e.target.value)} 
//                                     className="input spacer-md" 
//                                     rows="4" 
//                                     placeholder="Share your wealth journey..." 
//                                     style={{ resize: 'vertical' }} 
//                                 />
//                                 <div className="btn-group">
//                                     <button onClick={updateStory} className="btn btn-primary btn-sm">Save Changes</button>
//                                     <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div>
//                                 <div className="flex items-center justify-between mb-2">
//                                     {renderStars(userStory.rating || 5)}
//                                     <span className="text-xs text-gray-500">
//                                         {userStory.status === 'pending' ? '⏳ Pending Approval' : '✓ Published'}
//                                     </span>
//                                 </div>
//                                 <div className="bg-gray-50 p-3 spacer-sm" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
//                                     <p className="text-body text-small" style={{ wordWrap: 'break-word' }}>"{userStory.story}"</p>
//                                 </div>
//                                 <div className="flex-between">
//                                     <div className="btn-group">
//                                         <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">Edit Story</button>
//                                         <button onClick={deleteStory} className="btn btn-danger btn-sm">Delete Story</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )
//                     ) : !showSubmitForm ? (
//                         <button onClick={() => setShowSubmitForm(true)} className="btn btn-outline btn-full">Share Your Success Story</button>
//                     ) : (
//                         <div>
//                             <div className="spacer-md">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience (1-5 stars)</label>
//                                 <StarRating 
//                                     rating={newRating} 
//                                     setRating={setNewRating} 
//                                     hoverRating={hoverRating}
//                                     setHoverRating={setHoverRating}
//                                     size="text-2xl"
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     {newRating === 5 && "⭐ Life-changing! Highly recommend"}
//                                     {newRating === 4 && "👍 Great experience"}
//                                     {newRating === 3 && "😐 It was okay"}
//                                     {newRating === 2 && "😕 Needs improvement"}
//                                     {newRating === 1 && "😞 Very disappointed"}
//                                 </p>
//                             </div>
//                             <textarea 
//                                 value={newStory} 
//                                 onChange={(e) => setNewStory(e.target.value)} 
//                                 className="input spacer-md" 
//                                 rows="4" 
//                                 placeholder="Tell us how TheSpark changed your life..." 
//                                 style={{ resize: 'vertical' }} 
//                             />
//                             <div className="btn-group">
//                                 <button onClick={submitStory} className="btn btn-primary btn-sm">Submit Story</button>
//                                 <button onClick={() => setShowSubmitForm(false)} className="btn btn-secondary btn-sm">Cancel</button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
            
//             <h2 className="heading-2 text-center spacer-lg">Graduate Stories</h2>
//             {stories.length === 0 ? (
//                 <div className="card text-center"><p className="text-body">No success stories yet. Be the first to graduate!</p></div>
//             ) : (
//                 stories.map((story) => {
//                     const badgeStyle = getBadgeStyle(story.badgeText);
//                     return (
//                         <div key={story.id} className="card spacer-md">
//                             <div className="flex-between spacer-sm">
//                                 <div>
//                                     <h3 className="heading-3" style={{ wordBreak: 'break-word' }}>{story.name}</h3>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         {renderStars(story.rating || 5)}
//                                         <span className={`${badgeStyle.color} text-xs px-2 py-1 rounded-full flex items-center gap-1`}>
//                                             <span>{badgeStyle.icon}</span>
//                                             <span>{story.badgeText || 'Verified Saver'}</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <span className="text-small text-spark-500">Graduate</span>
//                             </div>
//                             <div className="bg-spark-50 p-3 spacer-sm">
//                                 <div className="flex-between text-small"><span>Total Saved:</span><span className="font-bold">₦{story.saved?.toLocaleString()}</span></div>
//                                 {/* <div className="flex-between text-small"><span>Interest Earned:</span><span className="font-bold text-success">₦{story.interest?.toLocaleString()}</span></div> */}
//                                 {/* <div className="flex-between text-small"><span>Final Balance:</span><span className="font-bold text-spark-500">₦{story.total?.toLocaleString()}</span></div> */}
//                             </div>
//                             <div className="text-body text-small spacer-sm" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
//                                 "{story.story}"
//                             </div>
//                             <p className="text-small text-spark-500 text-right">Be the spark.</p>
//                         </div>
//                     );
//                 })
//             )}
            
//             <div className="message-card spacer-lg">
//                 <p className="message-title">Your Story Could Be Next</p>
//                 <p className="message-text" style={{ wordBreak: 'break-word' }}>
//                     {user ? "Share your wealth journey above. Your story will inspire others!" : "Join TheSpark today. Save daily. Earn interest. Graduate in 6 months. Then share your success story!"}
//                 </p>
//             </div>
//         </div>
//     );
// }

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

  // Add this state at the top of your component
const [typedTitle, setTypedTitle] = useState('');
const [isDeleting, setIsDeleting] = useState(false);
const fullTitle = "Success Stories";

// Add this useEffect for continuous typing animation
useEffect(() => {
    let i = 0;
    let direction = 1; // 1 = typing, -1 = deleting
    
    const typingInterval = setInterval(() => {
        if (direction === 1) {
            // Typing forward
            if (i <= fullTitle.length) {
                setTypedTitle(fullTitle.substring(0, i));
                i++;
            } else {
                direction = -1; // Start deleting
            }
        } else {
            // Deleting backward
            if (i >= 0) {
                setTypedTitle(fullTitle.substring(0, i));
                i--;
            } else {
                direction = 1; // Start typing again
                i = 1;
            }
        }
    }, 150); // Adjust speed here (150ms for natural feel)
    
    return () => clearInterval(typingInterval);
}, []);



    useEffect(() => {
        loadStories();
        if (user) loadUserStory();
    }, [user]);

    const loadStories = async () => {
        try {
            const response = await api.get('/success-stories');
            setStories(response.data);
        } catch (error) {
            console.error('Failed to load stories:', error);
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
            console.error('Failed to load user story:', error);
        }
    };

    // Generate a consistent profile image URL using UI Avatars service
    const getProfileImage = (name) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=EA580C&color=fff&rounded=true&bold=true&size=80`;
    };

    // Get gradient for badge banner based on badge level
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
            {/* <HeaderMissionCard /> */}
            
            {/* Hero Section */}
        {/* Hero Section - Fully Visible Image */}
{/* Hero Section - Full Screen Height */}
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
        {/* <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            Success Stories
        </h1> */}
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
                
                {/* Featured Stories - Grid Layout with Badge Banner (Icon + Text) */}
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
                                
                                return (
                                    <div key={story.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                        {/* Banner with Badge Icon + Badge Text */}
                                        <div className={`relative h-24 bg-gradient-to-r ${badgeGradient} flex flex-col items-center justify-center`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl">{badgeIcon}</span>
                                                <span className="text-white font-semibold text-sm tracking-wide">
                                                    {badgeDisplayText}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                                        </div>
                                        
                                        {/* Avatar - Overlapping the banner */}
                                        <div className="relative px-5">
                                            <div className="absolute -top-8 left-5">
                                                <img 
                                                    src={profileImage}
                                                    alt={story.name}
                                                    className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover bg-white"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="p-5 pt-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{story.name}</h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {renderStars(story.rating || 5)}
                                                    </div>
                                                </div>
                                                {/* Original Badge Position - Kept as is */}
                                                <span className={`${badgeStyle.color} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                                    <span>{badgeStyle.icon}</span>
                                                    <span>{story.badgeText || 'Verified Saver'}</span>
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mt-3 mb-3">
                                                "{story.story}"
                                            </p>
                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
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

                {/* User's Story Section */}
                {user && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-12">
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