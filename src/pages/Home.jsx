// src/pages/Home.jsx
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import founderImage from '../assets/20220716_202342.jpg';
import StatModal from '../components/StatModal';

export default function Home() {
    const { user } = useAuth();
    const [successStories, setSuccessStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const autoScrollRef = useRef(null);
    const [desktopIndex, setDesktopIndex] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [expandedStories, setExpandedStories] = useState({});

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [typedSpark, setTypedSpark] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const fullSparkText = "Be the spark.";

    const [selectedStat, setSelectedStat] = useState(null);
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [quickNavAtEnd, setQuickNavAtEnd] = useState(false);
    const quickNavRef = useRef(null);

    // Memoize hero images — never re-create
    const images = useMemo(() => [
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80",
        "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&fit=crop"
    ], []);

    // Memoize the crisis stats — never re-create
    const crisisStats = useMemo(() => [
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
    ], []);

    // Memoize the 7 rules
    const rules = useMemo(() => [
        { num: "01", title: "Pay Yourself First", icon: "💰" },
        { num: "02", title: "Control Your Spending", icon: "📊" },
        { num: "03", title: "Make Your Money Work", icon: "📈" },
        { num: "04", title: "Protect Your Wealth", icon: "🛡️" },
        { num: "05", title: "Own Your Own Home", icon: "🏠" },
        { num: "06", title: "Secure Your Future", icon: "🔒" },
        { num: "07", title: "Increase Your Ability", icon: "📚" }
    ], []);

    // Memoize the how-it-works steps
    const howItWorksSteps = useMemo(() => [
        { step: 1, title: "Set Your Goal", desc: "Choose your daily target", icon: "💰", image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
        { step: 2, title: "21-Day Cycle", desc: "Complete one cycle", icon: "🔄", image: "https://cdn-icons-png.flaticon.com/512/2972/2972206.png" },
        { step: 3, title: "Track Progress", desc: "See your consistency grow", icon: "📈", image: "https://cdn-icons-png.flaticon.com/512/3416/3416140.png" },
        { step: 4, title: "Repeat 8 Times", desc: "6 months = completion", icon: "🎓", image: "https://cdn-icons-png.flaticon.com/512/2838/2838912.png" }
    ], []);

    // Typing animation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isDeleting) {
                if (typedSpark.length < fullSparkText.length) {
                    setTypedSpark(fullSparkText.substring(0, typedSpark.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            } else {
                if (typedSpark.length > 0) {
                    setTypedSpark(fullSparkText.substring(0, typedSpark.length - 1));
                } else {
                    setIsDeleting(false);
                }
            }
        }, 150);
        return () => clearInterval(interval);
    }, [typedSpark, isDeleting]);

    // Hero image cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    // Sticky CTA on scroll
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setShowStickyCTA(y > 700);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Quick Nav scroll-end detection (mobile)
    useEffect(() => {
        const el = quickNavRef.current;
        if (!el) return;
        const checkScroll = () => {
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
            setQuickNavAtEnd(atEnd);
        };
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    useEffect(() => {
        setCurrentIndex(0);
        setDesktopIndex(0);
    }, [successStories]);

    const fetchSuccessStories = useCallback(async () => {
        try {
            const response = await api.get('/success-stories');
            setSuccessStories(response.data);
        } catch (error) {
            console.error('Failed to fetch success stories:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoize star renderer
    const renderStars = useCallback((rating) => {
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
    }, []);

    // Memoize badge helpers
    const getBadgeColor = useCallback((badgeLevel) => {
        const colors = {
            6: 'bg-purple-100 text-purple-700 border-purple-200',
            5: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            4: 'bg-gray-100 text-gray-700 border-gray-200',
            3: 'bg-orange-100 text-orange-700 border-orange-200',
            2: 'bg-blue-100 text-blue-700 border-blue-200',
            1: 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[badgeLevel] || colors[1];
    }, []);

    const getBadgeGradient = useCallback((badgeLevel) => {
        const gradients = {
            6: 'from-purple-600 to-purple-700',
            5: 'from-yellow-500 to-amber-600',
            4: 'from-gray-500 to-gray-600',
            3: 'from-orange-600 to-orange-700',
            2: 'from-blue-500 to-blue-600',
            1: 'from-green-500 to-green-600'
        };
        return gradients[badgeLevel] || 'from-spark-600 to-orange-500';
    }, []);

    const getMemberLabel = useCallback((level) => {
        const labels = {
            6: 'Platinum Member',
            5: 'Gold Member',
            4: 'Silver Member',
            3: 'Bronze Member',
            2: 'Rising Member',
            1: 'New Saver',
        };
        return labels[level] || 'Member';
    }, []);

    // Memoize scroll-to-section
    const scrollToSection = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    // Memoize carousel controls
    const desktopGoToPrev = useCallback(() => {
        if (desktopIndex === 0 || isSliding) return;
        setIsSliding(true);
        setTimeout(() => {
            setDesktopIndex((prev) => prev - 1);
            setIsSliding(false);
        }, 300);
    }, [desktopIndex, isSliding]);

    const desktopGoToNext = useCallback(() => {
        if (desktopIndex >= successStories.length - 3 || isSliding) return;
        setIsSliding(true);
        setTimeout(() => {
            setDesktopIndex((prev) => prev + 1);
            setIsSliding(false);
        }, 300);
    }, [desktopIndex, successStories.length, isSliding]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? successStories.length - 1 : prev - 1));
    }, [successStories.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1 > successStories.length - 1 ? 0 : prev + 1));
    }, [successStories.length]);

    // Auto-scroll carousel
    useEffect(() => {
        if (successStories.length === 0) return;
        const isMobile = window.innerWidth < 768;
        if (!isHovering && isMobile) {
            autoScrollRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1 > successStories.length - 1 ? 0 : prev + 1));
            }, 5000);
        }
        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, [isHovering, successStories.length]);

    const handleTouchStart = useCallback((e) => setTouchStart(e.targetTouches[0].clientX), []);
    const handleTouchMove = useCallback((e) => setTouchEnd(e.targetTouches[0].clientX), []);
    const handleTouchEnd = useCallback(() => {
        if (touchStart - touchEnd > 50) goToNext();
        if (touchStart - touchEnd < -50) goToPrev();
        setTouchStart(0);
        setTouchEnd(0);
    }, [touchStart, touchEnd, goToNext, goToPrev]);

    return (
        <div className="bg-white min-h-screen">
            <div className="w-full">

                {/* ===== 1. HERO ===== */}
                <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={image}
                                    alt={`Hero Background ${index + 1}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://picsum.photos/id/20/800/600";
                                    }}
                                />
                            </div>
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                        <div className="inline-block mb-6">
                            <img
                                src="/icons/thespark-logo-512x512.png"
                                alt="TheSpark"
                                loading="eager"
                                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto drop-shadow-2xl"
                            />
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
                            <span className="inline-block w-1 h-8 bg-white ml-1 animate-pulse"></span>
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

                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? 'w-6 bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* ===== 2. TRUST ROW ===== */}
                <div className="bg-gradient-to-r from-spark-50 to-orange-50 -mt-10 relative z-20 rounded-t-2xl max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                <img src="/icons/gimalogo.jpg" alt="Gimablockchain Logo" loading="lazy" className="w-8 h-8 object-contain" />
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Gimablockchain</p>
                            <p className="text-xs text-gray-500">CAC Registered BN 3091833</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Parent Company</p>
                        </div>

                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-spark-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-sm">
                                <img src="/icons/thespark-logo-512x512.png" alt="TheSpark" loading="lazy" className="text-2xl" />
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">TheSpark</p>
                            <p className="text-xs text-gray-500">Wealth-Building Platform</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Product of Gimablockchain</p>
                        </div>

                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Secure Platform</p>
                            <p className="text-xs text-gray-500">Bank-level Encryption</p>
                        </div>

                        <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/50 group">
                            <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center group-hover:bg-spark-100 transition shadow-sm">
                                <span className="text-2xl">📜</span>
                            </div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-spark-600 transition">Proven Principles</p>
                            <p className="text-xs text-gray-500">Since 1926</p>
                        </div>
                    </div>
                </div>

                {/* ===== QUICK NAV ===== */}
                {/* ===== QUICK NAV — MOBILE (sticky, unchanged) ===== */}
                <div className="md:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-gray-100 py-3 shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 relative">
                        {!quickNavAtEnd && (
                            <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-10 flex items-center justify-end pr-3">
                                <span className="text-spark-500 text-lg animate-pulse">→</span>
                            </div>
                        )}

                        <div
                            ref={quickNavRef}
                            className="flex items-center gap-2 overflow-x-auto pb-1 sm:justify-center scrollbar-hide"
                        >
                            {[
                                { id: 'crisis', label: 'The Crisis' },
                                { id: 'how-it-works', label: 'How It Works' },
                                { id: 'stories', label: 'Success Stories' },
                                { id: 'team', label: 'The Team' },
                                { id: 'rules', label: 'The 7 Rules' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-600 hover:text-spark-600 hover:bg-spark-50 rounded-full transition-all duration-200"
                                >
                                    {item.label}
                                </button>
                            ))}
                            {!user && (
                                <Link
                                    to="/register"
                                    className="whitespace-nowrap md:ml-auto px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-spark-500 to-spark-600 rounded-full shadow-md hover:shadow-lg transition-all"
                                >
                                    Start Free →
                                </Link>
                            )}
                            <div className="md:hidden w-8 flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* ===== QUICK NAV — DESKTOP (static, scrolls with page) ===== */}
                <div className="hidden md:block bg-white border-y border-gray-100 py-4">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-center gap-2">
                            {[
                                { id: 'crisis', label: 'The Crisis' },
                                { id: 'how-it-works', label: 'How It Works' },
                                { id: 'stories', label: 'Success Stories' },
                                { id: 'team', label: 'The Team' },
                                { id: 'rules', label: 'The 7 Rules' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-600 hover:text-spark-600 hover:bg-spark-50 rounded-full transition-all duration-200"
                                >
                                    {item.label}
                                </button>
                            ))}
                            {!user && (
                                <Link
                                    to="/register"
                                    className="whitespace-nowrap px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-spark-500 to-spark-600 rounded-full shadow-md hover:shadow-lg transition-all"
                                >
                                    Start Free →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== 3. THE CRISIS ===== */}
                <div id="crisis" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {crisisStats.map((stat, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedStat(stat)}
                                    className={`relative group bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border ${stat.border} hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-5xl">{stat.icon}</span>
                                        <span className="text-xs font-medium text-gray-400 bg-white/50 px-2 py-1 rounded-full">{stat.trend}</span>
                                    </div>
                                    <div className={`text-5xl font-bold ${stat.text} mb-1`}>{stat.value}</div>
                                    <div className="text-base font-semibold text-gray-800 mb-3">{stat.label}</div>
                                    <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-4">
                                        <div className={`h-full w-3/4 bg-gradient-to-r ${stat.text.replace('text-', 'from-')} to-${stat.text.replace('text-', 'to-')} rounded-full`}></div>
                                    </div>
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

                        <div className="text-center mt-16 pt-8 border-t border-gray-200">
                            <div className="inline-flex flex-wrap items-center justify-center gap-2">
                                <span className="text-sm font-medium text-gray-500">📊 Sources:</span>
                                <a href="https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-spark-600 transition">World Bank NDU (Apr 2026)</a>
                                <span className="text-gray-300">•</span>
                                <a href="https://documents1.worldbank.org/curated/en/099100825010038474/txt/P513192-b0cb6210-6cdc-423f-b0eb-834a44a28494.txt" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-spark-600 transition">World Bank Poverty Brief (Oct 2025)</a>
                                <span className="text-gray-300">•</span>
                                <a href="https://blog.piggyvest.com/save/announcement/piggyvest-savings-report-2025/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-spark-600 transition">PiggyVest Report 2025</a>
                                <span className="text-gray-300">•</span>
                                <a href="https://www.cbn.gov.ng/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-spark-600 transition">CBN</a>
                                <span className="text-gray-300">•</span>
                                <a href="https://efina.org.ng/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-spark-600 transition">EFInA</a>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link to="/about" className="inline-flex items-center gap-2 text-spark-600 font-semibold hover:underline">
                                Learn how we're fixing this →
                            </Link>
                        </div>
                    </div>
                </div>

                <StatModal stat={selectedStat} isOpen={!!selectedStat} onClose={() => setSelectedStat(null)} />

                {/* ===== 4. HOW IT WORKS ===== */}
                <div id="how-it-works" className="bg-gray-900 py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12 text-white">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
                            <p className="text-white/80">Simple. Transparent. Life-changing.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {howItWorksSteps.map(item => (
                                <div key={item.step} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300">
                                    <img src={item.image} alt={item.title} loading="lazy" className="w-16 h-16 mx-auto mb-3" />
                                    <div className="text-4xl mb-2">{item.icon}</div>
                                    <div className="text-3xl font-bold text-spark-200 mb-1">{item.step}</div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-white/70 text-sm mb-3">{item.desc}</p>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <svg className="w-5 h-5 text-spark-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                to="/how-it-works"
                                onClick={() => window.scrollTo(0, 0)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all duration-300 border border-white/20"
                            >
                                <span>See the full 8-cycle journey</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ===== 5. SUCCESS STORIES ===== */}
                <div id="stories" className="bg-gray-50 py-16 sm:py-20">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Success Stories</h2>
                            <p className="text-gray-500">Real people. Real results. Real transformation.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12"><div className="spinner"></div></div>
                        ) : successStories.length > 0 ? (
                            <>
                                <div className="block md:hidden">
                                    <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                                        <div className="overflow-hidden rounded-xl" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                                            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                                {successStories.map((story, index) => {
                                                    const badgeGradient = getBadgeGradient(story.badgeLevel);
                                                    const badgeIcon = story.badgeIcon || '';
                                                    const badgeDisplayText = story.badgeText || 'Verified Saver';
                                                    const profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name || 'User')}&background=EA580C&color=fff&rounded=true&bold=true&size=80`;
                                                    const isExpanded = !!expandedStories[story.id];
                                                    const isLong = (story.story || '').length > 150;

                                                    return (
                                                        <div key={story.id || index} className="w-full flex-shrink-0 p-3">
                                                            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                                                                <div className={`relative h-24 bg-gradient-to-r ${badgeGradient} flex flex-col items-center justify-center`}>
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span className="text-3xl">{badgeIcon}</span>
                                                                        <span className="text-white font-semibold text-sm tracking-wide">LV {story.badgeLevel} · {badgeDisplayText}</span>
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                                                                </div>

                                                                <div className="relative px-5">
                                                                    <div className="absolute -top-8 left-5">
                                                                        <img src={profileImage} alt={story.name} loading="lazy" className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                                                                    </div>
                                                                </div>

                                                                <div className="p-5 pt-10 flex-1 flex flex-col">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div>
                                                                            <h3 className="font-bold text-gray-800 text-lg">{story.name}</h3>
                                                                            <div className="flex items-center gap-1 mt-1">{renderStars(story.rating || 5)}</div>
                                                                        </div>
                                                                        <span className={`${getBadgeColor(story.badgeLevel)} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                                                            <span>{badgeIcon}</span>
                                                                            <span>LV {story.badgeLevel} · {badgeDisplayText}</span>
                                                                        </span>
                                                                    </div>

                                                                    <p className={`text-gray-600 text-sm leading-relaxed mt-3 mb-2 flex-1 ${isExpanded ? '' : 'line-clamp-3'}`}>
                                                                        "{story.story}"
                                                                    </p>

                                                                    {isLong && (
                                                                        <button
                                                                            onClick={() => setExpandedStories(prev => ({ ...prev, [story.id]: !prev[story.id] }))}
                                                                            className="text-spark-600 text-xs font-semibold hover:underline text-left mb-3"
                                                                        >
                                                                            {isExpanded ? 'Show less ▲' : 'Read more ▼'}
                                                                        </button>
                                                                    )}

                                                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                                                                        <span className="text-xs text-gray-400">{getMemberLabel(story.badgeLevel)}</span>
                                                                        <span className="text-sm font-semibold text-spark-600">₦{story.saved?.toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex justify-center gap-2 mt-6">
                                            {successStories.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentIndex(index)} className={`transition-all duration-300 rounded-full ${currentIndex === index ? 'w-3 h-3 bg-spark-500' : 'w-2 h-2 bg-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <div className="relative overflow-hidden">
                                        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${desktopIndex * (100 / 3)}%)` }}>
                                            {successStories.map((story, index) => {
                                                const badgeGradient = getBadgeGradient(story.badgeLevel);
                                                const badgeIcon = story.badgeIcon || '';
                                                const badgeDisplayText = story.badgeText || 'Verified Saver';
                                                const profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name || 'User')}&background=EA580C&color=fff&rounded=true&bold=true&size=80`;
                                                const isExpanded = !!expandedStories[story.id];
                                                const isLong = (story.story || '').length > 150;

                                                return (
                                                    <div key={story.id || index} className="flex-shrink-0 p-3" style={{ width: '33.333%' }}>
                                                        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                                                            <div className={`relative h-24 bg-gradient-to-r ${badgeGradient} flex flex-col items-center justify-center`}>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <span className="text-3xl">{badgeIcon}</span>
                                                                    <span className="text-white font-semibold text-sm tracking-wide">LV {story.badgeLevel} · {badgeDisplayText}</span>
                                                                </div>
                                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                                                            </div>

                                                            <div className="relative px-5">
                                                                <div className="absolute -top-8 left-5">
                                                                    <img src={profileImage} alt={story.name} loading="lazy" className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                                                                </div>
                                                            </div>

                                                            <div className="p-5 pt-10 flex-1 flex flex-col">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div>
                                                                        <h3 className="font-bold text-gray-800 text-lg">{story.name}</h3>
                                                                        <div className="flex items-center gap-1 mt-1">{renderStars(story.rating || 5)}</div>
                                                                    </div>
                                                                    <span className={`${getBadgeColor(story.badgeLevel)} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                                                                        <span>{badgeIcon}</span>
                                                                        <span>LV {story.badgeLevel} · {badgeDisplayText}</span>
                                                                    </span>
                                                                </div>

                                                                <p className={`text-gray-600 text-sm leading-relaxed mt-3 mb-2 flex-1 ${isExpanded ? '' : 'line-clamp-3'}`}>
                                                                    "{story.story}"
                                                                </p>

                                                                {isLong && (
                                                                    <button
                                                                        onClick={() => setExpandedStories(prev => ({ ...prev, [story.id]: !prev[story.id] }))}
                                                                        className="text-spark-600 text-xs font-semibold hover:underline text-left mb-3"
                                                                    >
                                                                        {isExpanded ? 'Show less ▲' : 'Read more ▼'}
                                                                    </button>
                                                                )}

                                                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                                                                    <span className="text-xs text-gray-400">{getMemberLabel(story.badgeLevel)}</span>
                                                                    <span className="text-sm font-semibold text-spark-600">₦{story.saved?.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {successStories.length > 3 && (
                                        <div className="flex justify-center gap-4 mt-8">
                                            <button onClick={desktopGoToPrev} disabled={desktopIndex === 0 || isSliding} className={`px-6 py-2 rounded-full font-semibold transition-all ${desktopIndex === 0 || isSliding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-spark-500 text-white hover:bg-spark-600'}`}>← Previous</button>
                                            <button onClick={desktopGoToNext} disabled={desktopIndex >= successStories.length - 3 || isSliding} className={`px-6 py-2 rounded-full font-semibold transition-all ${desktopIndex >= successStories.length - 3 || isSliding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-spark-500 text-white hover:bg-spark-600'}`}>Next →</button>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mt-10">
                                    {user ? (
                                        <Link to="/success-stories#submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            ✍️ Share Your Story
                                        </Link>
                                    ) : (
                                        <Link to="/login" state={{ redirectTo: '/success-stories#submit' }} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            ✍️ Share Your Story
                                        </Link>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl">
                                <p className="text-gray-500">No testimonials yet. Be the first!</p>
                                {user ? (
                                    <Link to="/success-stories#submit" className="inline-block mt-4 text-spark-600 font-semibold hover:underline">Share your testimonial →</Link>
                                ) : (
                                    <Link to="/login" state={{ redirectTo: '/success-stories#submit' }} className="inline-block mt-4 text-spark-600 font-semibold hover:underline">Share your testimonial →</Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== 6. TEAM BOOK (Founder + CMO) ===== */}
                <div id="team" className="flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent to-slate-400"></div>
                                <div className="text-slate-400 text-2xl">❦</div>
                                <div className="w-16 h-px bg-gradient-to-l from-transparent to-slate-400"></div>
                            </div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-3 font-serif">
                                Meet the Team
                            </h2>
                            <p className="text-lg sm:text-xl text-spark-600 italic font-serif">
                                The hands behind the mission
                            </p>
                            <div className="w-24 h-0.5 bg-gradient-to-r from-spark-500 to-orange-500 mx-auto rounded-full mt-4 mb-3"></div>
                            <div className="text-slate-400 text-sm">✦ ✦ ✦</div>
                        </div>

                        <div className="relative mt-8">
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-full bg-gradient-to-r from-slate-300/30 via-slate-400/40 to-slate-300/30 rounded-full z-10 hidden lg:block"></div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
                                {/* FOUNDER PAGE */}
                                <div className="relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white to-slate-50 lg:border-r border-slate-200">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-3xl"></div>
                                    <div className="absolute top-8 left-8 text-slate-200 text-8xl opacity-20 font-serif">"</div>

                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-400 mb-4 font-serif italic">Page 01</div>

                                        <div className="relative mb-4 rounded-xl overflow-hidden shadow-md h-40 sm:h-48">
                                            <img
                                                src={founderImage}
                                                alt="Gideon Gideon"
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-block px-2.5 py-1 bg-spark-500 rounded-full text-[10px] font-bold tracking-wider text-white shadow-md">
                                                    FOUNDER
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-5">
                                            <div className="text-[10px] text-spark-500 font-semibold tracking-widest uppercase mb-2">
                                                A Word From The Founder
                                            </div>
                                            <p className="text-gray-800 italic leading-relaxed font-serif text-base">
                                                "I grew up watching hardworking people stay poor — not because they lacked effort, but because no one taught them how money works. TheSpark is my answer to that."
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 mb-0.5">Gideon Gideon</h3>
                                            <p className="text-sm text-spark-600 font-medium">Founder & Financial Educator</p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300"></div>
                                            <div className="text-slate-400 text-xs">✦</div>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300"></div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mb-1">Chapter One</div>
                                            <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                                The <span className="text-spark-600">Vision</span>
                                            </h4>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed mb-4 text-xs">
                                            Frustrated by watching hardworking Nigerians struggle with money, he set out to bring the
                                            timeless wisdom of <em>"The Richest Man in Babylon"</em> to a modern audience. Under
                                            Gimablockchain (CAC BN 3091833), the mission is simple: help 1 million Nigerians build real
                                            wealth habits, one day at a time.
                                        </p>

                                        <div className="grid grid-cols-3 gap-2">
                                            <a
                                                href="tel:2348029955942"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-amber-50 rounded-lg px-1 py-1.5 border border-amber-200 hover:bg-amber-100 hover:border-amber-400 transition text-center"
                                            >
                                                <span className="text-lg">📞</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Call</p>
                                                <p className="text-[9px] text-gray-400 font-mono leading-tight">+234 802 995 5942</p>
                                            </a>
                                            <a
                                                href="https://wa.me/2347038830301"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-green-50 rounded-lg px-1 py-1.5 border border-green-200 hover:bg-green-100 hover:border-green-500 transition text-center"
                                            >
                                                <span className="text-lg">💬</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">WhatsApp</p>
                                            </a>
                                            <a
                                                href="https://t.me/gima_capital"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-sky-50 rounded-lg px-1 py-1.5 border border-sky-200 hover:bg-sky-100 hover:border-sky-500 transition text-center"
                                            >
                                                <span className="text-lg">✈️</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Telegram</p>
                                            </a>
                                        </div>

                                        <div className="text-center text-[10px] text-slate-400 mt-4 font-serif">— 1 —</div>
                                    </div>
                                </div>

                                {/* CMO PAGE */}
                                <div className="relative p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
                                    <div className="absolute top-8 right-8 text-slate-200 text-8xl opacity-20 font-serif">»</div>

                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-400 mb-4 font-serif italic text-right">Page 02</div>

                                        <div className="relative mb-4 rounded-xl overflow-hidden shadow-md h-40 sm:h-48 bg-gradient-to-br from-spark-500 to-orange-500">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mx-auto">
                                                        <span className="text-4xl">👨‍💼</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-block px-2.5 py-1 bg-white/25 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider text-white border border-white/30">
                                                    CMO
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-5">
                                            <div className="text-[10px] text-spark-500 font-semibold tracking-widest uppercase mb-2">
                                                A Word From The CMO
                                            </div>
                                            <p className="text-gray-800 italic leading-relaxed font-serif text-base">
                                                "Every movement needs a voice. I want every Nigerian to know that wealth isn't reserved for the lucky few — it's a habit anyone can build."
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 mb-0.5">Nsima Owoedem</h3>
                                            <p className="text-sm text-spark-600 font-medium">Chief Marketing Officer</p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300"></div>
                                            <div className="text-slate-400 text-xs">✦</div>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300"></div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mb-1">Chapter Two</div>
                                            <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                                The <span className="text-spark-600">Voice</span>
                                            </h4>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed mb-4 text-xs">
                                            Leading growth, community, and storytelling, Nsima makes sure the mission reaches the
                                            people who need it most. From partnerships to member conversations, he's the reason new
                                            savers feel at home from day one, and the reason they keep coming back.
                                        </p>

                                        <div className="grid grid-cols-3 gap-2">
                                            <a
                                                href="tel:2347035292653"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-amber-50 rounded-lg px-1 py-1.5 border border-amber-200 hover:bg-amber-100 hover:border-amber-400 transition text-center"
                                            >
                                                <span className="text-lg">📞</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Call</p>
                                                <p className="text-[9px] text-gray-400 font-mono leading-tight">+234 70 3529 2653</p>
                                            </a>
                                            <a
                                                href="https://wa.me/2347035292653"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-green-50 rounded-lg px-1 py-1.5 border border-green-200 hover:bg-green-100 hover:border-green-500 transition text-center"
                                            >
                                                <span className="text-lg">💬</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">WhatsApp</p>
                                            </a>
                                            <a
                                                href="https://t.me/Nsimacarson"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center justify-center gap-0.5 min-h-[68px] bg-sky-50 rounded-lg px-1 py-1.5 border border-sky-200 hover:bg-sky-100 hover:border-sky-500 transition text-center"
                                            >
                                                <span className="text-lg">✈️</span>
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Telegram</p>
                                            </a>
                                        </div>

                                        <div className="text-center text-[10px] text-slate-400 mt-4 font-serif">— 2 —</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-400/60 via-slate-500 to-slate-400/60 hidden lg:block"></div>
                        </div>

                        <div className="text-center mt-6 text-sm text-slate-500 font-serif italic">
                            <span className="inline-block animate-pulse">◀</span> One team. One mission. One wealthy Nigeria <span className="inline-block animate-pulse">▶</span>
                        </div>

                        <div className="text-center mt-4">
                            <div className="text-slate-400 text-xs">❦ ❦ ❦</div>
                        </div>
                    </div>
                </div>

                {/* ===== 7. 7 RULES TEASER ===== */}
                <div id="rules" className="py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                                The 7 Rules of
                                <span className="text-amber-600"> Wealth</span>
                            </h2>
                            <p className="text-xl text-gray-500">
                                From "The Richest Man in Babylon" — principles that have transformed lives for nearly a century
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
                            {rules.map((rule) => (
                                <Link
                                    key={rule.num}
                                    to="/7-rules"
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="group bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-spark-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="text-3xl mb-2">{rule.icon}</div>
                                    <div className="text-xs font-bold text-spark-500 mb-1">RULE {rule.num}</div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">{rule.title}</h3>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                to="/7-rules"
                                onClick={() => window.scrollTo(0, 0)}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-spark-500 to-spark-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <span>Read all 7 rules in depth</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ===== 8. FINAL CTA ===== */}
                <div className="relative py-20 sm:py-28 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Start journey" loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                        <div className="inline-block mb-6">
                            <img src="/icons/thespark-logo-512x512.png" alt="TheSpark" loading="lazy" className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto drop-shadow-2xl" />
                        </div>
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

                {/* ===== 9. FOOTER ===== */}
                <div className="bg-gray-900 py-12 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-gray-400 text-sm mb-2">TheSpark — One spark. One fire. One wealthy Nigeria.</p>
                        <p className="text-gray-500 text-xs mb-6">Teaching timeless wealth principles to reduce poverty in Nigeria.</p>
                    </div>
                </div>
            </div>

            {/* ===== STICKY CTA BAR ===== */}
            {showStickyCTA && !user && (
                <div className="hidden md:block fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl py-3 px-4 transition-transform duration-300">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800">Start your wealth journey today</p>
                            <p className="text-xs text-gray-500">From ₦100/day. No card required.</p>
                        </div>
                        <div className="flex items-center gap-3 ml-auto">
                            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-spark-600 px-4 py-2">
                                Log in
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-spark-500 to-spark-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                Get Started Free →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}