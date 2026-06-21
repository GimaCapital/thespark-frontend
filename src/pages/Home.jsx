import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import founderImage from '../assets/20220716_202342.jpg';
import StatModal from '../components/StatModal';

export default function Home() {
    const { user } = useAuth();
    const [successStories, setSuccessStories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mobile carousel states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const autoScrollRef = useRef(null);

    // Desktop carousel state
    const [desktopIndex, setDesktopIndex] = useState(0);
    const [isSliding, setIsSliding] = useState(false);

    const [typedText, setTypedText] = useState('');
    const [currentCycle, setCurrentCycle] = useState(0);
    // Add this state at the top of your component
    const [selectedStat, setSelectedStat] = useState(null);

    // Add this with your other state declarations
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [typedSpark, setTypedSpark] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const fullSparkText = "Be the spark.";

     const handleClose = useCallback(() => {
        // Small delay to let React finish
        requestAnimationFrame(() => {
            setSelectedStat(null);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDeleting) {
                // Typing forward - ONE LETTER AT A TIME
                if (typedSpark.length < fullSparkText.length) {
                    setTypedSpark(fullSparkText.substring(0, typedSpark.length + 1));
                } else {
                    // Pause at the end before deleting
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            } else {
                // Deleting backward - ONE LETTER AT A TIME
                if (typedSpark.length > 0) {
                    setTypedSpark(fullSparkText.substring(0, typedSpark.length - 1));
                } else {
                    setIsDeleting(false);
                }
            }
        }, 150); // 150ms per letter for smooth animation

        return () => clearInterval(interval);
    }, [typedSpark, isDeleting]);

    const images = [
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80",
        "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&fit=crop"

    ];

    // const images = [
    //     "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80",
    //     "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    //     "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    //     "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    //     // "https://images.pexels.com/photos/4427617/pexels-photo-4427617.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    //     "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=600&fit=crop",
    //     "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    //     "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=600&fit=crop",
    //     "https://images.unsplash.com/photo-1553729459-9e3e9d1b7c4b?w=800&h=600&fit=crop"
    // ];



    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const cycles = [
        { number: 1, name: "Pay Yourself First", desc: "The foundation of all wealth. Save before you spend.", icon: "💰", month: "Month 1", color: "#10B981" },
        { number: 2, name: "Control Your Spending", desc: "Master the difference between needs and wants.", icon: "📊", month: "Month 1", color: "#3B82F6" },
        { number: 3, name: "Make Your Money Work", desc: "Let consistency and time do the heavy lifting.", icon: "📈", month: "Month 2", color: "#8B5CF6" },
        { number: 4, name: "Protect Your Wealth", desc: "Guard against losses and bad advice.", icon: "🛡️", month: "Month 2", color: "#EC4899" },
        { number: 5, name: "Own Your Own Home", desc: "Build assets that grow in value.", icon: "🏠", month: "Month 3", color: "#F59E0B" },
        { number: 6, name: "Secure Your Future", desc: "Prepare for emergencies and retirement.", icon: "🔒", month: "Month 3", color: "#14B8A6" },
        { number: 7, name: "Increase Your Ability", desc: "Invest in skills that earn more.", icon: "📚", month: "Month 4", color: "#A855F7" },
        { number: 8, name: "Graduate & Launch", desc: "Unlock advanced opportunities.", icon: "🎓", month: "Month 5-6", color: "#EA580C" }
    ];

    // Typing animation for main heading
    const fullHeading = "Cycle Journey";
    const currentCycleData = cycles[currentCycle];

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i <= fullHeading.length) {
                setTypedText(fullHeading.substring(0, i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
        return () => clearInterval(typingInterval);
    }, []);

    // Auto-flow through cycles
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCycle((prev) => (prev + 1) % cycles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);



    useEffect(() => {
        fetchSuccessStories();
    }, []);

    useEffect(() => {
        setCurrentIndex(0);
        setDesktopIndex(0);
    }, [successStories]);

    const fetchSuccessStories = async () => {
        try {
            const response = await api.get('/success-stories');
            setSuccessStories(response.data);
        } catch (error) {
            console.error('Failed to fetch success stories:', error);
        } finally {
            setLoading(false);
        }
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

    const getBadgeColor = (badgeLevel) => {
        const colors = {
            6: 'bg-purple-100 text-purple-700 border-purple-200',
            5: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            4: 'bg-gray-100 text-gray-700 border-gray-200',
            3: 'bg-orange-100 text-orange-700 border-orange-200',
            2: 'bg-blue-100 text-blue-700 border-blue-200',
            1: 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[badgeLevel] || colors[1];
    };

    const desktopGoToPrev = () => {
        if (desktopIndex === 0 || isSliding) return;
        setIsSliding(true);
        setTimeout(() => {
            setDesktopIndex(desktopIndex - 1);
            setIsSliding(false);
        }, 300);
    };

    const desktopGoToNext = () => {
        if (desktopIndex >= successStories.length - 3 || isSliding) return;
        setIsSliding(true);
        setTimeout(() => {
            setDesktopIndex(desktopIndex + 1);
            setIsSliding(false);
        }, 300);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => {
            return prev - 1 < 0 ? successStories.length - 1 : prev - 1;
        });
    };

    const goToNext = () => {
        setCurrentIndex((prev) => {
            return prev + 1 > successStories.length - 1 ? 0 : prev + 1;
        });
    };

    useEffect(() => {
        if (successStories.length === 0) return;

        const isMobile = window.innerWidth < 768;

        if (!isHovering && isMobile) {
            autoScrollRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    return prev + 1 > successStories.length - 1 ? 0 : prev + 1;
                });
            }, 5000);
        }

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [isHovering, successStories.length]);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            goToNext();
        }
        if (touchStart - touchEnd < -50) {
            goToPrev();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const totalDesktopSlides = Math.max(1, successStories.length - 2);

    return (
        <div className="bg-white min-h-screen">
            {/* FULL WIDTH LAYOUT - NO CONSTRAINTS */}
            <div className="w-full">

                {/* ===== HERO SECTION - FULL BLEED IMAGE WITH ROTATING BACKGROUND ===== */}
                {/* ===== HERO SECTION - FULL BLEED IMAGE WITH ROTATING BACKGROUND ===== */}
                <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                    {/* Rotating Background Images */}
                    <div className="absolute inset-0 z-0">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={image}
                                    alt={`Hero Background ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log(`Image ${index} failed to load`);
                                        e.target.src = "https://picsum.photos/id/20/800/600"; // Fallback
                                    }}
                                />
                            </div>
                        ))}

                        {/* Dark Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                        <div className="inline-block mb-6">
                            <div className="text-8xl sm:text-9xl animate-pulse drop-shadow-2xl">🔥</div>
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
                            TheSpark
                        </h1>
                        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-light tracking-wide">
                            wealth-building platform
                        </p>
                        <div className="w-24 h-0.5 bg-spark-500 mx-auto rounded-full mb-6"></div>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                            {typedSpark}
                            {showCursor && <span className="inline-block w-1 h-8 bg-white ml-1 animate-pulse"></span>}
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6">
                            One spark. One fire. One wealthy Nigeria.
                        </p>
                        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-8">
                            Teaching timeless wealth principles to reduce poverty in Nigeria
                        </p>
                        {!user ? (
                            <Link to="/register" className="inline-block bg-gradient-to-r from-spark-500 to-spark-600 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                Join the Revolution 🚀
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-spark-500 to-spark-600 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                Continue Your Journey 🔥
                            </Link>
                        )}
                    </div>

                    {/* Image Indicator Dots - Shows ALL images */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'w-6 bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* ===== TRUST BADGES - PROFESSIONAL ===== */}
                <div className="bg-gradient-to-r from-spark-50 to-orange-50 -mt-10 relative z-20 rounded-t-2xl max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* CAC Registered */}
                        {/* Gimablockchain - Parent Company */}
                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                {/* Logo from local project folder */}
                                <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                    <img
                                        src="/icons/gimalogo.jpg"
                                        alt="Gimablockchain Logo"
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Gimablockchain</p>
                            <p className="text-xs text-gray-500">CAC Registered BN 3091833</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Parent Company</p>
                        </div>

                        {/* TheSpark - Product */}
                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-spark-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                                <span className="text-2xl">🔥</span>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">TheSpark</p>
                            <p className="text-xs text-gray-500">Wealth-Building Platform</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Product of Gimablockchain</p>
                        </div>
                        {/* Secure Platform */}
                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Secure Platform</p>
                            <p className="text-xs text-gray-500">Bank-level Encryption</p>
                        </div>

                        {/* Proven Principles */}
                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                <span className="text-2xl">📜</span>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Proven Principles</p>
                            <p className="text-xs text-gray-500">Since 1926</p>
                        </div>



                    </div>
                </div>

                {/* ===== MISSION SECTION ===== */}
                {/* ===== MISSION SECTION - OPEN BOOK DYNAMIC ===== */}
                <div className="py-20 bg-gradient-to-br from-spark-50 via-white to-spark-50">
                    <div className="max-w-6xl mx-auto px-6">

                        {/* Floating Decorations */}
                        <div className="absolute left-10 text-4xl opacity-10 animate-bounce hidden lg:block">📖</div>
                        <div className="absolute right-10 text-4xl opacity-10 animate-pulse hidden lg:block">✨</div>

                        {/* Open Book Container */}
                        <div className="relative max-w-5xl mx-auto">
                            {/* Book Background */}
                            <div className="absolute inset-0 bg-amber-50 rounded-2xl shadow-2xl transform rotate-1"></div>
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1"></div>

                            {/* Main Book Content */}
                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                                    {/* Left Page - Image with Quote */}
                                    <div className="relative overflow-hidden min-h-[400px]">
                                        <img
                                            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=500&fit=crop"
                                            alt="Ancient wisdom"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <p className="text-white text-sm italic leading-relaxed">
                                                "A part of all you earn is yours to keep."
                                            </p>
                                            <p className="text-white/60 text-xs mt-2">— The Richest Man in Babylon</p>
                                        </div>
                                    </div>

                                    {/* Right Page - Mission Content */}
                                    <div className="p-8 md:p-10">
                                        {/* Corner Decoration */}
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-spark-100 to-transparent rounded-bl-2xl"></div>

                                        <div className="relative">
                                            <div className="text-5xl mb-4">🎯</div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-px bg-spark-400"></div>
                                                <span className="text-xs font-semibold text-spark-600 tracking-wider">MISSION</span>
                                                <div className="w-8 h-px bg-spark-400"></div>
                                            </div>

                                            <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                                Empowering <span className="text-spark-600">1 Million Nigerians</span>
                                            </h2>
                                            <p className="text-spark-600 font-medium mb-5">with Timeless Wealth Principles</p>

                                            <div className="space-y-4">
                                                <p className="text-gray-600 leading-relaxed">
                                                    We don't promise you millions. We promise you the <strong className="text-spark-600">knowledge and accountability</strong> to build your own financial freedom.
                                                </p>
                                                <p className="text-gray-500 text-sm leading-relaxed bg-spark-50 p-4 rounded-lg italic">
                                                    "Our goal is to ensure 1 million Nigerians have access to the wisdom of 'The Richest Man in Babylon' — giving you the tools to save, budget, and grow, regardless of your current income."
                                                </p>
                                            </div>

                                            {/* Book Corner Fold */}
                                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Spine */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 hidden md:block"></div>
                            </div>
                        </div>

                        {/* Page Turn Hint */}
                        <div className="text-center mt-6 text-sm text-gray-400 font-serif italic">
                            <span className="inline-block mr-2">◀</span> Turn the page to begin your journey <span className="inline-block ml-2">▶</span>
                        </div>
                    </div>
                </div>

                {/* ===== WHAT WE DO - SPLIT LAYOUT WITH WORKING IMAGES ===== */}
                <div className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">What We Are Actually Doing</h2>
                            <p className="text-gray-500 max-w-lg mx-auto">This is not a get rich quick scheme. This is a wealth-building platform.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Wrong Thinking Card */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                                <img
                                    src="https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                                    alt="Wrong thinking"
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-6 sm:p-8">
                                    <div className="text-5xl mb-4">❌</div>
                                    <h3 className="text-2xl font-bold text-red-600 mb-4">What others thought</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">• A business to make profit</li>
                                        <li className="flex items-center gap-2">• Customers are users</li>
                                        <li className="flex items-center gap-2">• Growth is just a feature</li>
                                        <li className="flex items-center gap-2">• After 6 months = monetization</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Thinking Card */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80"
                                    alt="Right thinking"
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-6 sm:p-8">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-4">What TheSpark actually is</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">• A mission to reduce poverty</li>
                                        <li className="flex items-center gap-2">• Customers are students learning wealth</li>
                                        <li className="flex items-center gap-2">• Growth is a teaching tool</li>
                                        <li className="flex items-center gap-2">• After 6 months = real opportunities</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                {/* ===== THE PROBLEM - ENTERPRISE GRADE ===== */}
                <div className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Section Header - Stripe Style */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                THE CRISIS
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                                The harsh reality facing
                                <span className="text-red-600"> millions of Nigerians</span>
                            </h2>
                            <p className="text-xl text-gray-500 leading-relaxed">
                                Over 140 million Nigerians live in poverty — not because they don't work hard,
                                but because no one taught them how to manage, grow, and preserve their resources.
                            </p>
                        </div>

                        {/* Stats Grid - Clickable Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    value: "140M+",
                                    label: "Nigerians in Poverty",
                                    icon: "😢",
                                    trend: "63% of population (2025)",
                                    bg: "from-rose-50 to-rose-100",
                                    border: "border-rose-200",
                                    text: "text-rose-600",
                                    detail: "According to the World Bank's Nigeria Development Update (April 2026), poverty in Nigeria rose from 56% in 2023 to 61% in 2024, reaching 63% in 2025 — affecting approximately 140 million Nigerians.",
                                    source: "World Bank Nigeria Development Update (April 2026)",
                                    sourceLink: "https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu",
                                    impact: "This means nearly 2 out of every 3 Nigerians struggle to afford basic necessities like food, healthcare, and housing.",
                                    clickText: "Click to learn more about poverty in Nigeria"
                                },
                                {
                                    value: "52.5%",
                                    label: "Extreme Poverty Rate",
                                    icon: "📉",
                                    trend: "$3.00/day poverty line",
                                    bg: "from-amber-50 to-amber-100",
                                    border: "border-amber-200",
                                    text: "text-amber-600",
                                    detail: "The World Bank reports that more than half of all Nigerians (52.5 percent) are estimated to live in poverty in 2025, based on World Bank projections at the international poverty line of $3.00 per day.",
                                    source: "World Bank Poverty & Equity Brief (October 2025)",
                                    sourceLink: "https://documents1.worldbank.org/curated/en/099100825010038474/txt/P513192-b0cb6210-6cdc-423f-b0eb-834a44a28494.txt",
                                    impact: "These families cannot afford basic food, clean water, healthcare, or education for their children.",
                                    clickText: "Click to understand extreme poverty in Nigeria"
                                },
                                {
                                    value: "60%",
                                    label: "No Emergency Savings",
                                    icon: "💔",
                                    trend: "6 in 10 Nigerians",
                                    bg: "from-orange-50 to-orange-100",
                                    border: "border-orange-200",
                                    text: "text-orange-600",
                                    detail: "According to the PiggyVest Savings Report 2025, which surveyed over 26,000 Nigerians across all six geopolitical zones, six in ten Nigerians have no funds set aside for emergencies. They have no buffer for hospital bills, sudden job loss, or unexpected expenses.",
                                    source: "PiggyVest Savings Report 2025",
                                    sourceLink: "https://blog.piggyvest.com/save/announcement/piggyvest-savings-report-2025/",
                                    impact: "Without emergency savings, families fall into debt during medical emergencies, job loss, or urgent repairs — creating a cycle of poverty.",
                                    clickText: "Click to see why emergency savings matter"
                                },
                                {
                                    value: "28M",
                                    label: "Unbanked Adults",
                                    icon: "🏦",
                                    trend: "26% of adults excluded",
                                    bg: "from-emerald-50 to-emerald-100",
                                    border: "border-emerald-200",
                                    text: "text-emerald-600",
                                    detail: "According to the Central Bank of Nigeria (CBN) and EFInA Access to Finance (A2F) surveys, 28 million Nigerian adults (approximately 26% of the adult population) remain financially excluded. The North-West (32%) and North-East (27%) have the highest exclusion rates.",
                                    source: "CBN/EFInA Access to Finance Survey (2024)",
                                    sourceLink: "https://www.cbn.gov.ng/",
                                    impact: "Being unbanked limits access to savings accounts, credit, insurance, and other financial tools essential for wealth building.",
                                    clickText: "Click to learn about financial inclusion"
                                }
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedStat(stat)}
                                    className={`relative group bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border ${stat.border} hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                                >
                                    {/* Top Icon */}
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-5xl">{stat.icon}</span>
                                        <span className="text-xs font-medium text-gray-400 bg-white/50 px-2 py-1 rounded-full">{stat.trend}</span>
                                    </div>

                                    {/* Value */}
                                    <div className={`text-5xl font-bold ${stat.text} mb-1`}>{stat.value}</div>

                                    {/* Label */}
                                    <div className="text-base font-semibold text-gray-800 mb-3">{stat.label}</div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-4">
                                        <div className={`h-full w-3/4 bg-gradient-to-r ${stat.text.replace('text-', 'from-')} to-${stat.text.replace('text-', 'to-')} rounded-full`}></div>
                                    </div>

                                    {/* Click Indicator - Text */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition">{stat.clickText}</span>
                                        <div className="flex items-center gap-1 text-gray-400 group-hover:text-spark-600 transition">
                                            <span className="text-xs">Click</span>
                                            <svg className="w-3 h-3 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Source Attribution with EXACT Links */}
                        <div className="text-center mt-16 pt-8 border-t border-gray-200">
                            <div className="inline-flex flex-wrap items-center justify-center gap-2">
                                <span className="text-sm font-medium text-gray-500">📊 Sources:</span>
                                <a
                                    href="https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-spark-600 transition"
                                >
                                    World Bank NDU (Apr 2026)
                                </a>
                                <span className="text-gray-300">•</span>
                                <a
                                    href="https://documents1.worldbank.org/curated/en/099100825010038474/txt/P513192-b0cb6210-6cdc-423f-b0eb-834a44a28494.txt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-spark-600 transition"
                                >
                                    World Bank Poverty Brief (Oct 2025)
                                </a>
                                <span className="text-gray-300">•</span>
                                <a
                                    href="https://blog.piggyvest.com/save/announcement/piggyvest-savings-report-2025/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-spark-600 transition"
                                >
                                    PiggyVest Report 2025
                                </a>
                                <span className="text-gray-300">•</span>
                                <a
                                    href="https://www.cbn.gov.ng/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-spark-600 transition"
                                >
                                    CBN
                                </a>
                                <span className="text-gray-300">•</span>
                                <a
                                    href="https://efina.org.ng/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 hover:text-spark-600 transition"
                                >
                                    EFInA
                                </a>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                                <span className="text-xs text-gray-400">✓ World Bank NDU April 2026</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">✓ World Bank Poverty & Equity Brief October 2025</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">✓ PiggyVest Survey (26,000+ Nigerians)</span>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-400">✓ CBN/EFInA A2F Survey</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat Detail Modal - Full View */}
{/* Stat Detail Modal - With Fixed Close */}

{/* 
{/* {selectedStat && (
    <div 
        className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-[9999] p-3 sm:p-4" 
        onClick={() => {
            setTimeout(() => setSelectedStat(null), 50);  // ✅ FIXED
        }}
    >
        <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl animate-slide-up pb-safe" 
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: '120px' }}
        >
          
            <div className="sticky top-0 bg-white z-10 px-5 sm:px-8 pt-5 sm:pt-8 pb-4 border-b border-gray-100 rounded-t-2xl">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <span className="text-4xl sm:text-5xl flex-shrink-0">{selectedStat.icon}</span>
                        <div className="min-w-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{selectedStat.label}</h3>
                            <p className="text-xs sm:text-sm text-gray-400">{selectedStat.trend}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setTimeout(() => setSelectedStat(null), 50);  // ✅ FIXED
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl leading-none transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

         
            <div className="px-5 sm:px-8 py-5 sm:py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              
                    <div>
                        <div className={`text-5xl sm:text-7xl font-bold ${selectedStat.text} mb-2 sm:mb-3`}>
                            {selectedStat.value}
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full mb-4 sm:mb-6 overflow-hidden">
                            <div className={`h-full w-3/4 bg-gradient-to-r ${selectedStat.text.replace('text-', 'from-')} to-${selectedStat.text.replace('text-', 'to-')} rounded-full`}></div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">📊 What this means:</p>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{selectedStat.detail}</p>
                        </div>
                    </div>

                   
                    <div>
                        <div className="bg-amber-50 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
                            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">⚠️ The Impact:</p>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{selectedStat.impact}</p>
                        </div>

                        <div className="bg-spark-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-2">📖 Source:</p>
                            <a
                                href={selectedStat.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-spark-600 hover:underline break-all"
                            >
                                {selectedStat.source}
                            </a>
                        </div>
                    </div>
                </div>

               
                <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => {
                            setTimeout(() => setSelectedStat(null), 50);  // ✅ FIXED
                        }}
                        className="w-full px-5 py-4 bg-spark-600 text-white rounded-xl font-semibold hover:bg-spark-700 transition text-base active:scale-[0.98] shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
)} */} 

 <StatModal 
                stat={selectedStat}
                isOpen={!!selectedStat}
                onClose={() => setSelectedStat(null)}
            />






                {/* ===== THE 7 RULES OF WEALTH - ENTERPRISE GRADE ===== */}
                <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                                The 7 Rules of
                                <span className="text-amber-600"> Wealth</span>
                            </h2>
                            <p className="text-xl text-gray-500">
                                From "The Richest Man in Babylon" — principles that have transformed lives for nearly a century
                            </p>
                        </div>

                        {/* Rules Grid - All Cards Link to /7-rules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { num: "01", title: "Pay Yourself First", desc: "Set aside a portion of what you earn before spending. This is the foundation of all wealth.", icon: "💰", color: "emerald" },
                                { num: "02", title: "Control Your Spending", desc: "Ask: Do I need this or just want it? Master the difference between necessities and desires.", icon: "📊", color: "blue" },
                                { num: "03", title: "Make Your Money Work", desc: "Let your resources generate more for you. Consistency compounds into extraordinary results.", icon: "📈", color: "purple" },
                                { num: "04", title: "Protect Your Wealth", desc: "Never trust get-rich-quick promises. Guard against losses and bad advice.", icon: "🛡️", color: "rose" },
                                { num: "05", title: "Own Your Own Home", desc: "Stop renting forever. Build assets that grow in value over time.", icon: "🏠", color: "amber" },
                                { num: "06", title: "Secure Your Future", desc: "Prepare for emergencies and later years. Financial freedom requires forward thinking.", icon: "🔒", color: "teal" },
                                { num: "07", title: "Increase Your Ability", desc: "Learn skills. Earn more. Grow. Your earning potential is your greatest asset.", icon: "📚", color: "indigo" }
                            ].map((rule) => (
                                <Link
                                    key={rule.num}
                                    to="/7-rules"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                    }}
                                    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 block"
                                >
                                    {/* Number Badge */}
                                    <div className={`absolute -top-4 left-6 w-10 h-10 bg-gradient-to-br from-${rule.color}-500 to-${rule.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {rule.num}
                                    </div>

                                    {/* Content */}
                                    <div className="mt-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl">{rule.icon}</span>
                                            <h3 className="text-xl font-bold text-gray-900">{rule.title}</h3>
                                        </div>
                                        <p className="text-gray-500 leading-relaxed mb-4">{rule.desc}</p>

                                        {/* Learn More Link */}
                                        <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                                            <span>Learn more</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== FOUNDER SECTION ===== */}
                <div className="py-16 sm:py-20 px-4 max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="h-64 md:h-auto">
                                <img
                                    // src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                                    src={founderImage}
                                    alt="Founder"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-8 sm:p-10">
                                <div className="text-spark-500 text-sm font-semibold mb-2">MEET YOUR GUIDE</div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Behind TheSpark</h2>
                                <div className="w-16 h-0.5 bg-spark-500 rounded-full mb-4"></div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">Gideon Gideon</h3>
                                <p className="text-spark-600 font-semibold mb-4">Founder & Financial Educator</p>
                                <p className="text-gray-600 leading-relaxed">
                                    With a passion for financial literacy and wealth education, Gideon founded TheSpark
                                    to bring ancient wisdom to modern Nigerians. Registered business:
                                    Gimablockchain BN, CAC Number: 3091833. TheSpark is dedicated to teaching timeless wealth principles to reduce poverty in Nigeria.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ===== HOW IT WORKS - 4 STEP VISUAL ===== */}
                <div className="bg-gray-900 py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12 text-white">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
                            <p className="text-white/80">Simple. Transparent. Life-changing.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { step: 1, title: "Set Your Goal", desc: "Choose your daily target", icon: "💰", image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
                                { step: 2, title: "21-Day Cycle", desc: "Complete one cycle", icon: "🔄", image: "https://cdn-icons-png.flaticon.com/512/2972/2972206.png" },
                                { step: 3, title: "Track Progress", desc: "See your consistency grow", icon: "📈", image: "https://cdn-icons-png.flaticon.com/512/3416/3416140.png" },
                                { step: 4, title: "Repeat 8 Times", desc: "6 months = completion", icon: "🎓", image: "https://cdn-icons-png.flaticon.com/512/2838/2838912.png" }
                            ].map(item => (
                                <div key={item.step} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 mx-auto mb-3" />
                                    <div className="text-4xl mb-2">{item.icon}</div>
                                    <div className="text-3xl font-bold text-spark-200 mb-1">{item.step}</div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-white/70 text-sm mb-3">{item.desc}</p>

                                    {/* Arrow Icon - appears on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <svg className="w-5 h-5 text-spark-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block relative mt-8">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-spark-500/20 to-transparent"></div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/how-it-works"
                            onClick={() => window.scrollTo(0, 0)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all duration-300 border border-white/20"
                        >
                            <span>Learn more about the process</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>


                {/* ===== 8-CYCLE JOURNEY - FOUNDER SECTION STYLE ===== */}
                <div className="py-20 bg-gradient-to-br from-spark-50 to-white">
                    <div className="max-w-5xl mx-auto px-4">

                        {/* Section Header - Like Founder Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spark-100 rounded-full mb-4">
                                <span className="text-spark-600 text-sm font-semibold">YOUR JOURNEY</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                {typedText}
                                <span className="inline-block w-1 h-10 bg-spark-500 ml-1 animate-pulse"></span>
                            </h2>
                            <div className="w-16 h-0.5 bg-gradient-to-r from-spark-500 to-orange-500 mx-auto rounded-full mt-4"></div>
                            <p className="text-gray-500 text-base max-w-md mx-auto mt-4">
                                First 168 days of consistent progress
                            </p>
                        </div>

                        {/* Current Cycle Card - Like Founder Grid Layout */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                {/* Left Side - Cycle Visual */}
                                <div className="bg-gradient-to-br from-spark-800 to-orange-900 p-8 flex flex-col items-center justify-center text-center">
                                    <div className="text-sm text-white/70 uppercase tracking-wider mb-2">Currently Showing</div>
                                    <div className="text-7xl mb-4 animate-bounce">{currentCycleData.icon}</div>
                                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold mb-2">
                                        {currentCycleData.month}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">Cycle {currentCycleData.number}</div>
                                    <div className="text-white/80 text-sm max-w-xs">{currentCycleData.desc}</div>
                                </div>

                                {/* Right Side - Cycle Info */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentCycleData.name}</h3>
                                    <div className="w-12 h-0.5 bg-spark-500 rounded-full mb-4"></div>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        This cycle teaches you the fundamental principle of {currentCycleData.name.toLowerCase()}.
                                        Master this rule and you'll build a strong foundation for lasting wealth.
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                                            <span>Progress to Graduation</span>
                                            <span>{Math.round(((currentCycle + 1) / cycles.length) * 100)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-spark-500 to-orange-500 rounded-full transition-all duration-500"
                                                style={{ width: `${((currentCycle + 1) / cycles.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        ⚡ Auto-flowing every 3 seconds • Click any cycle below
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* All Cycles Grid */}
                        <div className="mb-8">
                            <h3 className="text-center text-sm font-semibold text-gray-500 mb-4">← Click any cycle to explore →</h3>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                {cycles.map((cycle, idx) => (
                                    <div
                                        key={cycle.number}
                                        onClick={() => setCurrentCycle(idx)}
                                        className={`text-center p-3 rounded-xl transition-all duration-300 cursor-pointer
                            ${currentCycle === idx
                                                ? `bg-gradient-to-br ${cycle.number === 8 ? 'from-spark-500 to-orange-500 text-white shadow-lg scale-105' : 'from-spark-100 to-orange-100 shadow-md'}`
                                                : 'bg-white border border-gray-100 hover:shadow-md hover:scale-105'
                                            }`}
                                    >
                                        <div className={`text-2xl mb-1 ${currentCycle === idx ? 'animate-bounce' : ''}`}>
                                            {cycle.icon}
                                        </div>
                                        <div className={`text-xs font-bold ${currentCycle === idx && cycle.number !== 8 ? 'text-spark-600' : currentCycle === idx && cycle.number === 8 ? 'text-white' : 'text-gray-600'}`}>
                                            {cycle.number}
                                        </div>
                                        <div className={`text-[9px] leading-tight hidden sm:block ${currentCycle === idx && cycle.number !== 8 ? 'text-spark-500' : currentCycle === idx && cycle.number === 8 ? 'text-white/80' : 'text-gray-400'}`}>
                                            {cycle.name.substring(0, 8)}...
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Graduate Celebration Card - Futuristic Design with Increased Whiteness */}
                        <div className={`mt-4 flex justify-center transition-all duration-500 ${currentCycle === 7 ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`}>
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white via-spark-50 to-orange-50 border border-spark-200 max-w-md w-full shadow-sm">

                                {/* Futuristic Border Glow Effect - Lighter */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-spark-100/30 to-transparent animate-shimmer"></div>

                                {/* Spreading Emoji Effect - Only when Cycle 8 is reached */}
                                {currentCycle === 7 && (
                                    <>
                                        <div className="absolute inset-0 pointer-events-none">
                                            {[...Array(15)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute text-xl animate-float"
                                                    style={{
                                                        left: `${Math.random() * 100}%`,
                                                        top: `${Math.random() * 100}%`,
                                                        animationDelay: `${Math.random() * 1.5}s`,
                                                        animationDuration: `${0.8 + Math.random() * 1.5}s`,
                                                        opacity: 0
                                                    }}
                                                >
                                                    {['🎉', '🎊', '✨', '⭐', '🔥', '💪', '🏆', '🎓', '⚡', '💎'][Math.floor(Math.random() * 10)]}
                                                </div>
                                            ))}
                                        </div>
                                        <style>{`
                    @keyframes float {
                        0% {
                            transform: translateY(0) scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-80px) scale(2);
                            opacity: 0;
                        }
                    }
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-float {
                        animation: float 1.5s ease-out forwards;
                    }
                    .animate-shimmer {
                        animation: shimmer 3s infinite;
                    }
                `}</style>
                                    </>
                                )}

                                {/* Content - Lighter text for white background */}
                                <div className="relative z-10 px-5 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3 flex-wrap">
                                        <div className={`text-3xl ${currentCycle === 7 ? 'animate-pulse' : ''}`}>
                                            {currentCycle === 7 ? '🎓' : '🎉'}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-base ${currentCycle === 7 ? 'text-spark-600' : 'text-gray-700'}`}>
                                                {currentCycle === 7
                                                    ? '🎓 GRADUATION ACHIEVED! 🎓'
                                                    : `Cycle ${cycles[currentCycle].number} Complete`}
                                            </h4>
                                            <p className={`text-xs ${currentCycle === 7 ? 'text-spark-500' : 'text-gray-500'}`}>
                                                {currentCycle === 7
                                                    ? 'You\'ve unlocked advanced opportunities!'
                                                    : `${8 - cycles[currentCycle].number} cycles to graduation`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Futuristic Corner Accents - Lighter */}
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-spark-200 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-spark-200 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-spark-200 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-spark-200 rounded-br-lg"></div>
                            </div>
                        </div>

                        <div className="text-center mt-8 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">Each cycle builds on the last. Start Cycle 1 today and watch your consistency grow.</p>
                        </div>

                    </div>
                </div>



                {/* Benefits Section - Images ON the Cards */}
                {/* Benefits Section - Image on Top with Overlay */}
                <div className="py-20 bg-gradient-to-br from-spark-50 to-white">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spark-100 rounded-full mb-4">
                                <span className="text-spark-600 text-sm font-semibold">WHY MEMBERS LOVE US</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                                Why Members Love <span className="text-spark-600">TheSpark</span>
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-spark-500 to-orange-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100">
                                <div className="relative h-48">
                                    <img
                                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
                                        alt="Simple & Clear"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                </div>
                                <div className="p-5 text-center pt-3">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Simple & Clear</h3>
                                    <p className="text-gray-500 text-sm">No complex financial jargon. Just daily actions that build real wealth habits.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100">
                                <div className="relative h-48">
                                    <img
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
                                        alt="Accountability"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">💪</span>
                                    </div>
                                </div>
                                <div className="p-5 text-center pt-3">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Accountability</h3>
                                    <p className="text-gray-500 text-sm">Your dashboard tracks consistency. Plus a dedicated Coach keeps you motivated.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-100">
                                <div className="relative h-48">
                                    <img
                                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop"
                                        alt="Community Support"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                </div>
                                <div className="p-5 text-center pt-3">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Community Support</h3>
                                    <p className="text-gray-500 text-sm">Join thousands of Nigerians on the same wealth-building journey.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== TESTIMONIALS SECTION - WITH IMAGES ===== */}
                <div className="bg-gray-50 py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Success Stories</h2>
                            <p className="text-gray-500">Real people. Real results. Real transformation.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12"><div className="spinner"></div></div>
                        ) : successStories.length > 0 ? (
                            <>
                                {/* MOBILE CAROUSEL */}
                                <div className="block md:hidden">
                                    <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                                        <div className="overflow-hidden rounded-xl" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                                            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                                {successStories.map((story, index) => (
                                                    <div key={story.id || index} className="w-full flex-shrink-0 p-3">
                                                        <div className="p-6 bg-white rounded-2xl shadow-lg h-full">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spark-500 to-spark-600 flex items-center justify-center text-white text-lg font-bold">
                                                                    {story.name?.charAt(0) || 'U'}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{story.name}</p>
                                                                    <div className="flex items-center gap-1">
                                                                        {renderStars(story.rating || 5)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 italic leading-relaxed mb-4">"{story.story}"</p>
                                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                                <p className="text-sm font-semibold text-spark-600">Saved ₦{story.saved?.toLocaleString() || 0}</p>
                                                                <span className={`${getBadgeColor(story.badgeLevel)} text-xs px-2 py-1 rounded-full`}>
                                                                    {story.badgeText || 'Verified Saver'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-2 mt-6">
                                            {successStories.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentIndex(index)} className={`transition-all duration-300 rounded-full ${currentIndex === index ? 'w-3 h-3 bg-spark-500' : 'w-2 h-2 bg-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* DESKTOP CAROUSEL */}
                                <div className="hidden md:block">
                                    <div className="relative overflow-hidden">
                                        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${desktopIndex * (100 / 3)}%)` }}>
                                            {successStories.map((story, index) => (
                                                <div key={story.id || index} className="flex-shrink-0 p-3" style={{ width: '33.333%' }}>
                                                    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all h-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spark-500 to-spark-600 flex items-center justify-center text-white text-lg font-bold">
                                                                {story.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{story.name}</p>
                                                                <div className="flex items-center gap-1">{renderStars(story.rating || 5)}</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 italic leading-relaxed mb-4 line-clamp-4">"{story.story}"</p>
                                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                            <p className="text-sm font-semibold text-spark-600">Saved ₦{story.saved?.toLocaleString() || 0}</p>
                                                            <span className={`${getBadgeColor(story.badgeLevel)} text-xs px-2 py-1 rounded-full`}>{story.badgeText || 'Verified Saver'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {successStories.length > 3 && (
                                        <div className="flex justify-center gap-4 mt-8">
                                            <button onClick={desktopGoToPrev} disabled={desktopIndex === 0 || isSliding} className={`px-6 py-2 rounded-full font-semibold transition-all ${desktopIndex === 0 || isSliding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-spark-500 text-white hover:bg-spark-600'}`}>← Previous</button>
                                            <button onClick={desktopGoToNext} disabled={desktopIndex >= successStories.length - 3 || isSliding} className={`px-6 py-2 rounded-full font-semibold transition-all ${desktopIndex >= successStories.length - 3 || isSliding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-spark-500 text-white hover:bg-spark-600'}`}>Next →</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl">
                                <p className="text-gray-500">No testimonials yet. Be the first!</p>
                                {user && <Link to="/dashboard" className="inline-block mt-4 text-spark-600">Share your testimonial →</Link>}
                            </div>
                        )}
                    </div>
                </div>


                {/* ===== FAQ SECTION - WITH LINK TO ABOUT PAGE ===== */}
                <div className="py-16 sm:py-20 px-4 max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-3">Frequently Asked Questions</h2>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-spark-500 to-spark-600 mx-auto rounded-full mb-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">How do I start?</h3>
                                </div>
                                <p className="text-gray-600">Create a free account, set your daily goal, and start your first 21-day cycle.</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/6213/6213545.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">Is this platform secure?</h3>
                                </div>
                                <p className="text-gray-600">Yes, we prioritize platform security and data protection for all our members.</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">What happens after 8 cycles?</h3>
                                </div>
                                <p className="text-gray-600">You graduate to advanced wealth-building opportunities and exclusive member benefits.</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/4403/4403692.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">Do I need to be an expert?</h3>
                                </div>
                                <p className="text-gray-600">Not at all. TheSpark is designed for beginners. You learn as you go.</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2972/2972206.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">How does progress tracking work?</h3>
                                </div>
                                <p className="text-gray-600">We provide transparent tracking tools to help you monitor your consistency and growth.</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="FAQ" className="w-6 h-6" />
                                    <h3 className="font-bold text-xl text-spark-600">Is there a fee to join?</h3>
                                </div>
                                <p className="text-gray-600">TheSpark is free to join. We offer premium educational content for graduates.</p>
                            </div>
                        </div>
                    </div>

                    {/* Learn More Button - Links to FAQ Page with scroll to top */}
                    <div className="text-center mt-10">
                        <Link
                            to="/faq"
                            onClick={() => window.scrollTo(0, 0)}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span>Learn More</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* OUR COMMITMENT & YOUR COMMITMENT */}
                {/* ===== OUR MUTUAL COMMITMENT - FULL PAGE BOOK STYLE ===== */}
                <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="max-w-7xl w-full mx-auto">

                        {/* BOOK COVER / TITLE PAGE */}
                        <div className="text-center mb-12">
                            {/* Decorative Book Title Ornament */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
                                <div className="text-amber-400 text-2xl">❦</div>
                                <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
                            </div>

                            {/* Main Title */}
                            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 mb-4 font-serif">
                                Our Mutual Commitment
                            </h2>

                            {/* Subtitle */}
                            <p className="text-xl sm:text-2xl text-spark-600 italic font-serif">
                                Together, we build wealth the right way
                            </p>

                            {/* Decorative Line */}
                            <div className="w-24 h-0.5 bg-gradient-to-r from-spark-500 to-orange-500 mx-auto rounded-full mt-6 mb-4"></div>

                            {/* Small Ornament */}
                            <div className="text-amber-300 text-sm">✦ ✦ ✦</div>
                        </div>

                        {/* Book Container - Opens like a book */}
                        <div className="relative mt-8">
                            {/* Book Spine Effect */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-full bg-gradient-to-r from-amber-800/20 via-amber-900/30 to-amber-800/20 rounded-full z-10"></div>

                            {/* Two Column Layout - Like an Open Book */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden bg-white">

                                {/* LEFT PAGE - Our Commitment */}
                                <div className="relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-white to-amber-50 border-r border-amber-200">
                                    {/* Page Curl Effect */}
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-200/50 to-transparent rounded-bl-3xl"></div>

                                    {/* Decorative Element */}
                                    <div className="absolute top-8 left-8 text-amber-200 text-8xl opacity-20">“</div>

                                    <div className="relative z-10">
                                        {/* Book Page Number */}
                                        <div className="text-sm text-amber-400 mb-6 font-serif italic">Page 01</div>

                                        {/* Icon with Book Style */}
                                        <div className="inline-block p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-md mb-6">
                                            <img src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" alt="Our Commitment" className="w-12 h-12" />
                                        </div>
                                        <div className="text-6xl mb-4">🤝</div>

                                        {/* Chapter Title Style */}
                                        <div className="mb-6">
                                            <div className="text-sm text-spark-500 font-semibold tracking-wider uppercase mb-2">Chapter One</div>
                                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                                                Our Commitment<br />
                                                <span className="text-spark-600">to You</span>
                                            </h3>
                                        </div>

                                        {/* Ornamental Divider */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300"></div>
                                            <div className="text-amber-400">✦</div>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300"></div>
                                        </div>

                                        {/* Content */}
                                        <p className="text-gray-600 leading-relaxed mb-6 font-serif text-lg">
                                            We believe financial freedom is not a privilege — it's a right. And we're committed to making it accessible to every Nigerian.
                                        </p>

                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-start gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                                <span className="text-gray-700">We provide clear, proven wealth principles</span>
                                            </li>
                                            <li className="flex items-start gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                                <span className="text-gray-700">We track your progress transparently</span>
                                            </li>
                                            <li className="flex items-start gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                                <span className="text-gray-700">We teach how consistency compounds over time</span>
                                            </li>
                                            <li className="flex items-start gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                                <span className="text-gray-700">We prepare you for real opportunities after graduation</span>
                                            </li>
                                        </ul>

                                        {/* Highlight Box */}
                                        <div className="bg-amber-50 rounded-xl p-5 border-l-4 border-amber-400">
                                            <div className="flex items-start gap-3">
                                                <span className="text-amber-500 text-xl">⚠️</span>
                                                <p className="text-sm text-gray-600 italic">
                                                    Your results depend on your personal consistency — we provide the tools, you provide the dedication.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Page Number Bottom */}
                                        <div className="text-center text-xs text-amber-300 mt-8 font-serif">— 1 —</div>
                                    </div>
                                </div>

                                {/* RIGHT PAGE - Your Commitment */}
                                <div className="relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-amber-50 to-orange-50">
                                    {/* Decorative Element */}
                                    <div className="absolute top-8 right-8 text-orange-200 text-8xl opacity-20">»</div>

                                    <div className="relative z-10">
                                        {/* Book Page Number */}
                                        <div className="text-sm text-amber-400 mb-6 font-serif italic text-right">Page 02</div>

                                        {/* Icon with Book Style */}
                                        <div className="inline-block p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-md mb-6">
                                            <img src="https://cdn-icons-png.flaticon.com/512/4403/4403794.png" alt="Your Commitment" className="w-12 h-12" />
                                        </div>
                                        <div className="text-6xl mb-4">💪</div>

                                        {/* Chapter Title Style */}
                                        <div className="mb-6">
                                            <div className="text-sm text-spark-500 font-semibold tracking-wider uppercase mb-2 text-right">Chapter Two</div>
                                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight text-right">
                                                Your Commitment<br />
                                                <span className="text-spark-600">to Yourself</span>
                                            </h3>
                                        </div>

                                        {/* Ornamental Divider */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300"></div>
                                            <div className="text-amber-400">✦</div>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300"></div>
                                        </div>

                                        {/* Content */}
                                        <p className="text-gray-600 leading-relaxed mb-6 font-serif text-lg text-right">
                                            Wealth is built one day at a time. Your daily actions determine your financial future.
                                        </p>

                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-start gap-3 justify-end group">
                                                <span className="text-gray-700">Save something every day — even ₦100</span>
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3 justify-end group">
                                                <span className="text-gray-700">Stay consistent — avoid unnecessary withdrawals</span>
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3 justify-end group">
                                                <span className="text-gray-700">Learn the lessons each cycle</span>
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3 justify-end group">
                                                <span className="text-gray-700">Teach someone else when you complete</span>
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            </li>
                                        </ul>

                                        {/* Inspiration Quote */}
                                        <div className="bg-amber-50 rounded-xl p-5 text-right border-r-4 border-amber-400">
                                            <div className="flex items-start gap-3 justify-end">
                                                <p className="text-sm text-gray-600 italic">
                                                    "The secret to getting ahead is getting started. The secret to getting started is breaking your complex overwhelming tasks into small manageable tasks."
                                                </p>
                                                <span className="text-amber-500 text-xl">💡</span>
                                            </div>
                                            <p className="text-xs text-amber-500 mt-2">— Mark Twain</p>
                                        </div>

                                        {/* Page Number Bottom */}
                                        <div className="text-center text-xs text-amber-300 mt-8 font-serif">— 2 —</div>
                                    </div>
                                </div>
                            </div>

                            {/* Book Binding Detail */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-700/50 via-amber-800 to-amber-700/50"></div>
                        </div>

                        {/* Book Navigation Hint */}
                        <div className="text-center mt-8 text-sm text-amber-400 font-serif italic">
                            <span className="inline-block animate-pulse">◀</span> Turn the page to continue your journey <span className="inline-block animate-pulse">▶</span>
                        </div>

                        {/* Decorative Book Closing */}
                        <div className="text-center mt-8">
                            <div className="text-amber-300 text-xs">❦ ❦ ❦</div>
                        </div>
                    </div>
                </div>



                {/* ===== FINAL CTA ===== */}
                <div className="relative py-20 sm:py-28 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Start journey" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                        <div className="text-7xl mb-4 animate-pulse">🔥</div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-base sm:text-lg text-white/80 mb-8">Join thousands of Nigerians building better financial habits</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <div className="bg-white/10 rounded-xl p-4 text-left flex-1 backdrop-blur-sm">
                                <div className="text-2xl mb-1">💰</div>
                                <div className="text-white font-bold">Start with ₦100/day</div>
                                <div className="text-white/60 text-xs">Begin your journey</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-left flex-1 backdrop-blur-sm">
                                <div className="text-2xl mb-1">📈</div>
                                <div className="text-white font-bold">Track your progress</div>
                                <div className="text-white/60 text-xs">Every 21-day cycle</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-left flex-1 backdrop-blur-sm">
                                <div className="text-2xl mb-1">🎓</div>
                                <div className="text-white font-bold">Complete in 6 months</div>
                                <div className="text-white/60 text-xs">Unlock new opportunities</div>
                            </div>
                        </div>

                        {!user ? (
                            <Link to="/register" className="inline-block bg-gradient-to-r from-spark-500 to-spark-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                Create Your Free Account 🔥
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-spark-500 to-spark-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl transition-all hover:scale-105">
                                Go to Your Dashboard 🚀
                            </Link>
                        )}

                        <p className="text-white/50 text-xs mt-6">No hidden fees. Adjust anytime. Your progress is transparent.</p>
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="bg-gray-900 py-12 px-4">
                    <div className="max-w-6xl mx-auto text-center">

                        <p className="text-gray-400 text-sm mb-2">TheSpark — One spark. One fire. One wealthy Nigeria.</p>
                        <p className="text-gray-500 text-xs mb-6">Teaching timeless wealth principles to reduce poverty in Nigeria.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}