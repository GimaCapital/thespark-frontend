// C:\Users\HP\Desktop\TheSpark\thespark-frontend\src\pages\About.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookPages from '../data/bookPages';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';

export default function About() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [selectedStat, setSelectedStat] = useState(null);
    
    // Interactive Book States
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFlipping, setIsFlipping] = useState(false);
    const totalPages = 155;
    
    const nextPage = () => {
        if (currentPage < totalPages && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const prevPage = () => {
        if (currentPage > 1 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const openBook = () => {
        setIsBookOpen(true);
    };

    const closeBook = () => {
        setIsBookOpen(false);
        setCurrentPage(1);
    };

    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection(null);
        } else {
            setExpandedSection(section);
        }
    };

    const T = {
        charcoal: '#1C1917',
        charcoalMid: '#44403C',
        ink: '#78716C',
        border: '#E7E5E4',
        ivory: '#FAFAF9',
        surface: '#FFFFFF',
        amber: '#B45309',
        amberLight: '#FEF3C7',
        amberMid: '#FCD34D',
        spark: '#EA580C',
        sparkLight: '#FFF7ED',
        sparkMid: '#FB923C',
        green: '#15803D',
        greenLight: '#F0FDF4',
    };
    
    const stories = [
        {
            id: 1,
            title: "The Problem",
            subtitle: "Two Friends in Misery",
            icon: "😢",
            color: "from-amber-500 to-orange-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        In the ancient city of Babylon, there lived two childhood friends: <strong className="text-spark-600">Bansir</strong> the chariot builder — the best in all Babylon — and <strong className="text-spark-600">Kobbi</strong> the musician and lyre player.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Despite their skills, both men worked endlessly yet lived paycheck to paycheck. Bansir sat on his wall feeling defeated, his wife looking at him with worried eyes because there was little food left in the house.
                    </p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-400">
                        <p className="text-amber-800 italic text-sm">
                            "Why have we, who work so hard, never found any measure of wealth?"
                        </p>
                        <p className="text-amber-700 text-sm mt-1">— Bansir and Kobbi</p>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "The Realization",
            subtitle: "We Never Sought It",
            icon: "💡",
            color: "from-green-500 to-emerald-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi shared the same struggle. He was a skilled musician, yet could not get ahead financially. Then came the epiphany:
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 italic text-sm">
                            "We never sought it."
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi realized that just as he had decided to become a skilled lyre player and succeeded, they could decide to become wealthy and succeed as well.
                    </p>
                </div>
            )
        },
        {
            id: 3,
            title: "Remembering Their Friend",
            subtitle: "Arkad, the Richest Man in Babylon",
            icon: "👑",
            color: "from-yellow-500 to-amber-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi remembered their old friend, Arkad, riding in his golden chariot. Unlike others, Arkad did not look over his humble head. Instead, he waved his hand and bestowed his smile of friendship upon Kobbi.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir mused: <em>"He is claimed to be the richest man in all Babylon."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi added: <em>"So rich the king is said to seek his golden aid in affairs of the treasury."</em>
                    </p>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg">
                        <p className="text-amber-800 text-sm">
                            <strong>Bansir joked:</strong> "I fear if I should meet him in the darkness of the night, I should lay my hands upon his fat wallet!"
                        </p>
                        <p className="text-amber-800 text-sm mt-2">
                            <strong>Kobbi wisely replied:</strong> "Nonsense. A man's wealth is not in the purse he carries. A fat purse quickly empties if there be no golden stream to refill it. Arkad has an income that constantly keeps his purse full, no matter how liberally he spends."
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "The Decision",
            subtitle: "Go to Arkad",
            icon: "🎯",
            color: "from-purple-500 to-indigo-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Bansir's eyes lit up: <em>"Income! That is the thing! I wish an income that will keep flowing into my purse whether I sit upon the wall or travel to far lands. Arkad must know how a man can make an income for himself."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Kobbi reminded him: <em>"He did teach his knowledge to his son, Nomasir. Did he not go to Nineveh and become, without aid from his father, one of the richest men in that city?"</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        This gave Bansir hope: <em>"Kobbi, thou bringest to me a rare thought. It costs nothing to ask wise advice from a good friend. Arkad was always that. Let us go to Arkad and ask how we, also, may acquire incomes for ourselves."</em>
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, ever thoughtful of his friends, suggested gathering others who had fared no better, so they too could share in his wisdom.
                    </p>
                </div>
            )
        },
        {
            id: 5,
            title: "The Meeting with Arkad",
            subtitle: "The Secret of Wealth",
            icon: "🤝",
            color: "from-blue-500 to-cyan-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, Kobbi, and their group of childhood friends went to Arkad's house and asked:
                    </p>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-400">
                        <p className="text-amber-800 italic text-sm">
                            "Why has fate favored you so much that you have grown rich while we remained poor, even though we've worked harder than you have?"
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Arkad replied that the reason they had failed to accumulate wealth might be because they had failed to observe the laws that govern wealth — or if they knew them, they had failed to follow them.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Arkad then told them his own story. When he was a young scribe, a rich moneylender named <strong>Algamish</strong> came to him needing a copy of a law. Arkad worked hard and delivered it. In return, Algamish gave him the secret to wealth:
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 italic text-sm">
                            "I found the road to wealth when I decided that a part of all I earned was mine to keep. And so will you."
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "The 7 Cures for a Lean Purse",
            subtitle: "Arkad's Timeless Lessons",
            icon: "📜",
            color: "from-red-500 to-rose-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed mb-3">Arkad then taught the group the same lessons he learned:</p>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { num: 1, title: "Start thy purse to fattening", desc: "Save 10% of everything you earn before spending." },
                            { num: 2, title: "Control thy expenditures", desc: "Budget your expenses. Live on 9/10 of your income." },
                            { num: 3, title: "Make thy gold multiply", desc: "Put your savings to work. Let them earn more for you." },
                            { num: 4, title: "Guard thy treasures from loss", desc: "Seek advice from experienced investors before investing." },
                            { num: 5, title: "Make of thy dwelling a profitable investment", desc: "Own your own home and build assets." },
                            { num: 6, title: "Insure a future income", desc: "Prepare for retirement and protect your family." },
                            { num: 7, title: "Increase thy ability to earn", desc: "Continuously learn and improve your skills." }
                        ].map(rule => (
                            <div key={rule.num} className="flex gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-spark-50 hover:to-spark-100 transition-all duration-300 transform hover:scale-[1.02]">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-spark-500 to-spark-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">{rule.num}</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{rule.title}</h4>
                                    <p className="text-xs text-gray-500">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 7,
            title: "The Three Essential Principles",
            subtitle: "The Foundation of Wealth",
            icon: "🏛️",
            color: "from-teal-500 to-green-500",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">💰</div>
                            <h4 className="font-bold text-gray-800 mb-2">Save 10%</h4>
                            <p className="text-xs text-gray-600">A part of all you earn is yours to keep. Save at least one-tenth of everything you earn.</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">📊</div>
                            <h4 className="font-bold text-gray-800 mb-2">Control Expenses</h4>
                            <p className="text-xs text-gray-600">Live on 9/10 of your income. Distinguish between needs and wants.</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-spark-50 to-spark-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            <div className="text-3xl mb-2">📈</div>
                            <h4 className="font-bold text-gray-800 mb-2">Make Money Work</h4>
                            <p className="text-xs text-gray-600">Put your savings to work. Let them earn more for you through compound interest.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 8,
            title: "The Result",
            subtitle: "Some Understood, Some Walked Away",
            icon: "⚖️",
            color: "from-indigo-500 to-purple-500",
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                        Some of the group understood and applied the lessons. Others walked away with no greater understanding.
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 text-sm">
                            The difference between those who become wealthy and those who stay poor is not luck. It is the decision to <strong>learn, apply, and persist</strong>.
                        </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Bansir, Kobbi, and those who took action began their journey to financial freedom. They learned that wealth is not about how much you earn — it's about how much you keep and how you make it work for you.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            {/* ===== FULL WIDTH MAIN CONTENT ===== */}
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
                
                {/* Hero Section */}

             {/* Hero Section - Light Overlay */}
<div className="relative rounded-3xl overflow-hidden mb-16">
    <div className="absolute inset-0">
        <img 
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Financial Education Background"
            className="w-full h-full object-cover"
        />
        {/* Reduced opacity - image visible, text readable */}
        <div className="absolute inset-0 bg-black/50"></div>
    </div>
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20 sm:py-28">
        <div className="inline-block mb-6">
            <div className="text-8xl sm:text-9xl animate-pulse drop-shadow-2xl">🔥</div>
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            About TheSpark
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-light tracking-wide">
            wealth-building platform
        </p>
        <div className="w-24 h-0.5 bg-spark-500 mx-auto rounded-full mb-6"></div>
        <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6">
            One spark. One fire. One wealthy Nigeria.
        </p>
        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto">
            Teaching timeless wealth principles to reduce poverty in Nigeria
        </p>
    </div>
</div>

                {/* ===== INTERACTIVE BOOK COMPONENT ===== */}
                <div className="mb-20">
                    <div className="max-w-4xl mx-auto">
                        
                        {!isBookOpen ? (
                            <div 
                                onClick={openBook}
                                className="relative group cursor-pointer mx-auto max-w-md"
                            >
                                <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-lg rounded-full"></div>
                                <div className="relative bg-gradient-to-br from-spark-800 to-spark-900 rounded-lg p-8 shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-spark-950 to-spark-800 rounded-l-lg"></div>
                                    <div className="pl-12 text-center">
                                        <div className="text-7xl mb-4 animate-pulse">📖</div>
                                        <h3 className="text-white font-bold text-2xl mb-2">TheSpark</h3>
                                        <p className="text-white/60 text-sm mb-4">A Wealth-Building Journey</p>
                                        <div className="w-16 h-px bg-white/30 mx-auto mb-4"></div>
                                        <p className="text-white/40 text-xs">Click to open the book →</p>
                                    </div>
                                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-lg"></div>
                                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-lg"></div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-spark-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                                    Click to Read →
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute -bottom-4 left-0 right-0 h-8 bg-black/20 blur-lg rounded-full"></div>
                                <div className="relative bg-amber-50 rounded-lg shadow-2xl overflow-hidden">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-700 z-20 hidden md:block"></div>
                                    <button 
                                        onClick={closeBook}
                                        className="absolute top-2 right-2 z-30 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white shadow-md transition"
                                    >
                                        ✕
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
                                        {/* LEFT PAGE */}
                                        <div className={`p-6 md:p-8 bg-gradient-to-br from-amber-50 to-white border-r border-amber-200 transition-all duration-300 ${isFlipping ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                            <div className="text-xs text-amber-500 font-serif italic mb-4">— Page {currentPage} —</div>
                                            <div className="rounded-lg overflow-hidden mb-4 h-40">
                                                <img src={bookPages[currentPage - 1].image} alt={bookPages[currentPage - 1].title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-4xl mb-3">📖</div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{bookPages[currentPage - 1].title}</h3>
                                            <div className="w-12 h-px bg-amber-400 mb-3"></div>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{bookPages[currentPage - 1].content}</p>
                                            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                                                <p className="text-amber-800 text-xs italic">"{bookPages[currentPage - 1].quote}"</p>
                                            </div>
                                        </div>
                                        
                                        {/* RIGHT PAGE */}
                                        <div className={`p-6 md:p-8 bg-gradient-to-br from-amber-50 to-white transition-all duration-300 ${isFlipping ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                            {currentPage < totalPages ? (
                                                <>
                                                    <div className="text-xs text-amber-500 font-serif italic mb-4 text-right">— Page {currentPage + 1} —</div>
                                                    <div className="rounded-lg overflow-hidden mb-4 h-40">
                                                        <img src={bookPages[currentPage].image} alt={bookPages[currentPage].title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-4xl mb-3 text-right">✨</div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-right">{bookPages[currentPage].title}</h3>
                                                    <div className="w-12 h-px bg-amber-400 mb-3 ml-auto"></div>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-3 text-right">{bookPages[currentPage].content}</p>
                                                    <div className="bg-amber-50 rounded-lg p-3 border-r-4 border-amber-400 text-right">
                                                        <p className="text-amber-800 text-xs italic">"{bookPages[currentPage].quote}"</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div className="text-6xl mb-4">🔥</div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Begin?</h3>
                                                    <p className="text-gray-600 text-sm mb-4">Start your wealth-building journey today</p>
                                                    <Link to="/register" className="px-6 py-2 bg-spark-600 text-white rounded-full text-sm font-semibold hover:bg-spark-700 transition">
                                                        Join TheSpark →
                                                    </Link>
                                                    <p className="text-xs text-gray-400 mt-4">Start with just ₦100 daily</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between p-4 bg-amber-100/50 border-t border-amber-200">
                                        <button onClick={prevPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700 hover:bg-amber-50 shadow-sm'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            Previous Page
                                        </button>
                                        <div className="text-sm text-gray-500 font-serif">Page {currentPage} of {totalPages}</div>
                                        <button onClick={nextPage} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-400' : 'bg-white text-gray-700 hover:bg-amber-50 shadow-sm'}`}>
                                            Next Page
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* The Ancient Story */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Ancient Babylon" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-7xl">📖</div>
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-spark-700 to-spark-500 bg-clip-text text-transparent">The Ancient Story</h2>
                                <p className="text-gray-500 text-base mt-1">The ancient wisdom that inspired TheSpark</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <p className="text-gray-700 leading-relaxed text-lg">Over 4,000 years ago in the ancient city of Babylon, two childhood friends sat on a wall feeling defeated.</p>
                                <div className="bg-gradient-to-r from-spark-50 to-amber-50 p-6 rounded-2xl border-l-8 border-spark-500">
                                    <p className="text-gray-700 leading-relaxed"><strong className="text-spark-600 text-lg">Bansir</strong> was the finest chariot builder in all Babylon. <strong className="text-spark-600 text-lg">Kobbi</strong> was a skilled musician. Both worked tirelessly, yet both struggled to feed their families. They had no gold, no savings, no future.</p>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-lg">Then came the question that changed everything: <strong className="text-spark-600">"Why have we, who work so hard, never found any measure of wealth?"</strong></p>
                                <p className="text-gray-700 leading-relaxed text-lg">The answer was simple: <strong className="text-spark-600">"We never sought it."</strong></p>
                                <p className="text-gray-700 leading-relaxed text-lg">They decided to seek wisdom from <strong className="text-spark-600">Arkad</strong> — the richest man in all Babylon.</p>
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
                                    <p className="text-amber-800 text-lg italic">"This moment changed their lives forever. It is the same moment we invite you to take today."</p>
                                </div>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl h-96">
                                <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ancient Babylon city" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Story Sections */}
                <div className="mb-12">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-spark-800 to-spark-600 bg-clip-text text-transparent">The Journey to Wealth</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-spark-500 to-spark-600 mx-auto rounded-full mt-4"></div>
                    </div>
                    <div className="space-y-4">
                        {stories.map((story) => (
                            <div key={story.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                <button onClick={() => toggleSection(story.id)} className="w-full flex justify-between items-center p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-spark-50 transition-all duration-300 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-3xl w-12 h-12 bg-gradient-to-r ${story.color} rounded-full flex items-center justify-center shadow-md`}>{story.icon}</div>
                                        <div>
                                            <div className="text-spark-500 text-sm font-semibold uppercase tracking-wide">{story.subtitle}</div>
                                            <h3 className="font-bold text-gray-800 text-xl">{story.title}</h3>
                                        </div>
                                    </div>
                                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedSection === story.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {expandedSection === story.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-4 bg-gradient-to-b from-white to-gray-50">{story.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modern Story */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Modern financial education" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-spark-800/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-5xl">🔥</div>
                            <h2 className="text-4xl sm:text-5xl font-bold">Our Story</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <p className="text-white/90 leading-relaxed text-lg">TheSpark was born from a simple observation: <strong className="text-spark-300">Over 100 million Nigerians live in poverty</strong> — not because they don't work hard, but because no one taught them how to manage, grow, and preserve their resources.</p>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <p className="leading-relaxed text-lg italic">"We discovered 'The Richest Man in Babylon' — a book written <strong className="text-spark-300">a century ago</strong> that contains timeless wealth principles that have transformed lives across generations."</p>
                                </div>
                                <p className="text-white/90 leading-relaxed text-lg">These principles are simple, proven, and accessible to anyone willing to learn. TheSpark was built to bring these principles to every Nigerian.</p>
                            </div>
                            <div className="rounded-2xl overflow-hidden shadow-xl h-80">
                                <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team working on financial education" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section - Vintage Book Style */}
                <div className="py-20 bg-gradient-to-br from-amber-100 to-orange-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="relative bg-amber-50 rounded-lg shadow-2xl overflow-hidden border border-amber-200">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200 to-transparent rounded-bl-3xl"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                <div className="relative p-8 md:p-10 bg-gradient-to-br from-amber-50 to-amber-100 border-r border-amber-200">
                                    <div className="text-amber-400 text-8xl absolute top-4 left-4 opacity-20">“</div>
                                    <div className="relative z-10">
                                        <div className="text-6xl font-serif text-amber-700 float-left mr-3 leading-none">O</div>
                                        <p className="text-gray-700 italic text-sm leading-relaxed">ur mission is not to make promises we cannot keep, but to share wisdom that has stood for centuries.</p>
                                        <div className="clear-both"></div>
                                        <div className="text-center my-6 text-amber-400 text-sm">❧ ❧ ❧</div>
                                        <p className="text-gray-600 text-sm leading-relaxed font-serif">"The Richest Man in Babylon" was written in 1926. For a century, these principles have transformed lives.</p>
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 bg-gradient-to-br from-amber-50 to-white">
                                    <div className="text-xs text-amber-500 font-serif italic mb-2">— Our Sacred Promise —</div>
                                    <div className="text-5xl mb-4">🎯</div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif">Empowering 1 Million Nigerians</h2>
                                    <p className="text-amber-700 font-medium mb-4">with Timeless Wealth Principles</p>
                                    <div className="w-12 h-px bg-amber-400 mb-5"></div>
                                    <p className="text-gray-600 leading-relaxed mb-3 font-serif">We don't promise you millions. We promise you the <strong className="text-amber-700">knowledge and accountability</strong> to build your own financial freedom.</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">Ensuring 1 million Nigerians have access to the wisdom of "The Richest Man in Babylon" — tools to save, budget, and grow.</p>
                                    <div className="mt-6 pt-4 border-t border-amber-200 text-right">
                                        <p className="text-amber-500 text-xs font-serif italic">— TheSpark Foundation —</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-300 hidden md:block"></div>
                        </div>
                    </div>
                </div>

                {/* What We Believe */}
                <div className="mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">What We Believe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Wealth is a Skill" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">💰</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Wealth is a Skill</h3>
                                <p className="text-gray-500">Financial freedom isn't luck — it's a learnable skill that anyone can master with the right principles and consistent practice.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Small Actions Matter" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">📚</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Small Actions Matter</h3>
                                <p className="text-gray-500">Saving ₦100 daily seems small, but over time it builds momentum and transforms into significant wealth.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Community Lifts All" className="w-full h-48 object-cover" />
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4 inline-block p-3 bg-gradient-to-br from-spark-100 to-spark-200 rounded-full">🤝</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Community Lifts All</h3>
                                <p className="text-gray-500">When one person rises, they lift others. We're building a community of Nigerians committed to financial freedom.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How We Work */}
                <div className="mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">How We Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="21 Day Cycles" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">🔄</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">21-Day Cycles</h3>
                                <p className="text-gray-600">Our program is built around 21-day cycles — a scientifically proven timeframe to build lasting habits. Each cycle teaches one of the 7 wealth principles.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="Progress Tracking" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">📊</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">Progress Tracking</h3>
                                <p className="text-gray-600">Members track their daily savings, monitor their consistency, and see their progress over time. What gets measured gets improved.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="Educational Content" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">📚</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">Educational Content</h3>
                                <p className="text-gray-600">Each cycle delivers bite-sized lessons based on proven wealth principles. Learn as you save.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-spark-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=250&q=80" alt="8 Cycles to Completion" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <div className="text-4xl mb-3">🎓</div>
                                <h3 className="text-2xl font-bold text-spark-600 mb-3">8 Cycles to Completion</h3>
                                <p className="text-gray-600">Complete all 8 cycles (6 months) and unlock graduate-level opportunities, including advanced learning and real-world wealth-building paths.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Principles */}
                <div className="bg-gradient-to-br from-white to-spark-50 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-spark-100">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-4">Our Principles</h2>
                    <p className="text-center text-gray-500 mb-10 text-lg">Everything we do is guided by the 7 timeless rules from "The Richest Man in Babylon"</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: "💰", text: "Pay Yourself First - Save 10% before spending" },
                            { icon: "🎯", text: "Control Your Spending - Need vs Want" },
                            { icon: "📈", text: "Make Your Money Work - Let consistency compound" },
                            { icon: "🛡️", text: "Protect Your Wealth - Avoid get-rich schemes" },
                            { icon: "🏠", text: "Own Your Own Home - Build assets" },
                            { icon: "🔒", text: "Secure Your Future - Prepare for emergencies" },
                            { icon: "📚", text: "Increase Your Ability to Earn - Learn and grow" }
                        ].map((principle, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100">
                                <span className="text-2xl">{principle.icon}</span>
                                <span className="text-sm text-gray-700">{principle.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Spark Difference */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Financial growth" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-spark-800/90"></div>
                    </div>
                    <div className="relative p-8 sm:p-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-10">How TheSpark Brings This to Life</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">💰</span><h3 className="text-xl font-bold text-white">Save 10% First</h3></div>
                                <p className="text-white/80">Just like Arkad taught, we help you save a portion of what you earn before anything else. Start with as little as ₦100 daily.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">📊</span><h3 className="text-xl font-bold text-white">Track Every Naira</h3></div>
                                <p className="text-white/80">Control your expenditures by tracking your daily savings. Watch your consistency grow with each 21-day cycle.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">📈</span><h3 className="text-xl font-bold text-white">Let Consistency Compound</h3></div>
                                <p className="text-white/80">Your daily actions build momentum. The more consistent you are, the more your progress grows.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3"><span className="text-3xl">🎓</span><h3 className="text-xl font-bold text-white">Graduate to Real Opportunities</h3></div>
                                <p className="text-white/80">After 8 cycles (6 months), you unlock graduate benefits — the same next step Arkad offered to those who learned.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Problem We Solve */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl border border-gray-100">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">The Problem We Solve</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        {[
                            { value: "140M+", label: "Nigerians in Poverty", icon: "😢", trend: "63% of population (2025)", detail: "According to the World Bank's Nigeria Development Update (April 2026), poverty in Nigeria rose from 56% in 2023 to 61% in 2024, reaching 63% in 2025 — affecting approximately 140 million Nigerians.", source: "World Bank NDU (Apr 2026)", sourceLink: "https://www.worldbank.org/en/country/nigeria/publication/nigeria-development-update-ndu" },
                            { value: "52.5%", label: "Extreme Poverty Rate", icon: "📉", trend: "$3.00/day poverty line", detail: "The World Bank reports that more than half of all Nigerians (52.5 percent) are estimated to live in poverty in 2025, based on World Bank projections at the international poverty line of $3.00 per day.", source: "World Bank Poverty Brief (Oct 2025)", sourceLink: "https://documents1.worldbank.org/curated/en/099100825010038474/txt/P513192-b0cb6210-6cdc-423f-b0eb-834a44a28494.txt" },
                            { value: "60%", label: "No Emergency Savings", icon: "💔", trend: "6 in 10 Nigerians", detail: "According to the PiggyVest Savings Report 2025, which surveyed over 26,000 Nigerians across all six geopolitical zones, six in ten Nigerians have no funds set aside for emergencies.", source: "PiggyVest Report 2025", sourceLink: "https://blog.piggyvest.com/save/announcement/piggyvest-savings-report-2025/" },
                            { value: "28M", label: "Unbanked Adults", icon: "🏦", trend: "26% of adults excluded", detail: "According to the Central Bank of Nigeria (CBN) and EFInA Access to Finance surveys, 28 million Nigerian adults (approximately 26% of the adult population) remain financially excluded.", source: "CBN/EFInA 2024", sourceLink: "https://www.cbn.gov.ng/" }
                        ].map((stat, i) => (
                            <div key={i} onClick={() => setSelectedStat(stat)} className="group text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="font-bold text-spark-600 text-2xl">{stat.value}</div>
                                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{stat.trend}</div>
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition"><svg className="w-4 h-4 text-spark-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gradient-to-r from-spark-600 to-spark-500 p-8 rounded-2xl text-center">
                        <p className="text-white text-xl">We're not here to blame anyone. We're here to teach. Because the knowledge that builds wealth should be available to everyone — not just the lucky few.</p>
                    </div>
                </div>

                {/* Stat Detail Modal */}
                {selectedStat && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStat(null)}>
                        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-3"><span className="text-4xl">{selectedStat.icon}</span><h3 className="text-2xl font-bold text-gray-800">{selectedStat.label}</h3></div>
                                <button onClick={() => setSelectedStat(null)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                            </div>
                            <div className="mb-6"><div className="text-5xl font-bold text-spark-600 mb-2">{selectedStat.value}</div><div className="text-sm text-gray-500 mb-4">{selectedStat.trend}</div><p className="text-gray-600 leading-relaxed">{selectedStat.detail}</p></div>
                            <div className="bg-spark-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">📖 Source:</p><a href={selectedStat.sourceLink} target="_blank" rel="noopener noreferrer" className="text-sm text-spark-600 hover:underline break-all">{selectedStat.source}</a></div>
                            <button onClick={() => setSelectedStat(null)} className="w-full mt-6 px-5 py-3 bg-spark-600 text-white rounded-xl font-semibold hover:bg-spark-700 transition">Close</button>
                        </div>
                    </div>
                )}

                {/* Who This Is For */}
                <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 rounded-3xl p-8 sm:p-12 mb-12 shadow-xl">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-10">Who This Is For</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div><div className="text-center mb-6"><h3 className="text-2xl font-semibold text-spark-600 inline-block border-b-2 border-spark-400 pb-2">By Profile</h3></div>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🌱</div><h4 className="text-xl font-bold text-gray-800 mb-2">Beginners</h4><p className="text-gray-500">No experience needed. Start with ₦100/day and learn as you go.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">📈</div><h4 className="text-xl font-bold text-gray-800 mb-2">Consistent Savers</h4><p className="text-gray-500">Already saving? Structure your habit and track your progress.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🎯</div><h4 className="text-xl font-bold text-gray-800 mb-2">Goal-Oriented</h4><p className="text-gray-500">Working toward a specific financial target? Let us help you get there.</p></div>
                            <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">👥</div><h4 className="text-xl font-bold text-gray-800 mb-2">Community Builders</h4><p className="text-gray-500">Want to learn and grow alongside others on the same journey.</p></div>
                        </div></div>
                        <div><div className="text-center mb-6"><h3 className="text-2xl font-semibold text-spark-600 inline-block border-b-2 border-spark-400 pb-2">By Mindset</h3></div>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🌱</div><h4 className="text-xl font-bold text-spark-600 mb-2">Bansir & Kobbi</h4><p className="text-gray-500">Hard workers who never learned how to build wealth — until now.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🎯</div><h4 className="text-xl font-bold text-spark-600 mb-2">Arkad's Students</h4><p className="text-gray-500">Those ready to learn, apply, and persist until they succeed.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">📚</div><h4 className="text-xl font-bold text-spark-600 mb-2">Life-Long Learners</h4><p className="text-gray-500">People who understand that wealth is a skill — and skills can be learned.</p></div>
                            <div className="bg-gradient-to-br from-spark-50 to-white rounded-xl p-5 text-center shadow-md hover:shadow-xl transition-all duration-300"><div className="text-4xl mb-3">🔥</div><h4 className="text-xl font-bold text-spark-600 mb-2">The Determined</h4><p className="text-gray-500">Those ready to be the spark that changes their family's financial future.</p></div>
                        </div></div>
                    </div>
                </div>

                {/* The Promise */}
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Commitment" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-spark-900/95 to-charcoal-900/90"></div></div>
                    <div className="relative p-12 text-center text-white"><div className="text-7xl sm:text-8xl mb-6">🤝</div><div className="text-sm uppercase tracking-wider text-white/50 mb-4">Our Commitment</div><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto">We cannot promise you wealth.</h2><p className="text-spark-300 text-xl sm:text-2xl font-semibold mb-8">Only your consistency can do that.</p><div className="w-20 h-0.5 bg-white/30 mx-auto rounded-full mb-8"></div><p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">But we can provide you the same knowledge that turned Arkad into the richest man in Babylon and transformed Bansir and Kobbi from struggling workers into men on the path to wealth.</p></div>
                </div>

                {/* ===== MUTUAL COMMITMENT ===== */}
<div className="py-16 sm:py-20 px-4 bg-gradient-to-br from-spark-50 to-orange-50 rounded-3xl mb-12">
    <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-spark-100 rounded-full mb-4">
                <span className="text-spark-600 text-sm font-semibold">OUR MUTUAL COMMITMENT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                Together, we build wealth <span className="text-spark-600">the right way</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-spark-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Our Commitment */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Our Commitment <span className="text-spark-600">to You</span>
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    What you can expect from TheSpark, every day.
                </p>

                <ul className="space-y-3 mb-6">
                    {[
                        'We provide clear, proven wealth principles',
                        'We track your progress transparently',
                        'We teach how consistency compounds over time',
                        'We prepare you for real opportunities after graduation',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-green-600 text-xs">✓</span>
                            </div>
                            <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-xs text-gray-700">
                        ⚠️ Your results depend on your personal consistency. We provide the tools, you provide the dedication.
                    </p>
                </div>
            </div>

            {/* Your Commitment */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Your Commitment <span className="text-spark-600">to Yourself</span>
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    What you'll practice to build lasting wealth.
                </p>

                <ul className="space-y-3 mb-6">
                    {[
                        'Save something every day even ₦100',
                        'Stay consistent avoid unnecessary withdrawals',
                        'Learn the lessons each cycle',
                        'Teach someone else when you complete',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-green-600 text-xs">✓</span>
                            </div>
                            <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="bg-spark-50 rounded-lg p-4 border border-spark-200">
                    <p className="text-xs text-gray-700 italic">
                        "The secret to getting ahead is getting started. The secret to getting started is breaking your complex overwhelming tasks into small manageable tasks."
                    </p>
                    <p className="text-xs text-gray-500 mt-2 text-right">— Mark Twain</p>
                </div>
            </div>

        </div>
    </div>
</div>

                {/* Call to Action */}
                <div className="relative rounded-3xl overflow-hidden mb-12">
                    <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1532619187608-e5375cab36aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Start your journey" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-spark-600/95 to-spark-500/95"></div></div>
                    <div className="relative p-12 text-center text-white"><h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Ready to Start Your Journey?</h2><p className="text-base sm:text-lg text-white/90 mb-8 max-w-md mx-auto">Join thousands of Nigerians building consistent financial habits one day at a time.</p><Link to="/register" className="inline-block bg-white text-spark-700 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-spark-50">Create Your Free Account 🔥</Link><p className="text-sm text-white/60 mt-6">Start with just ₦100 daily. Every spark matters.</p></div>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-xs text-gray-400 mt-10 pt-6 border-t-2 border-gray-200">
                    <p className="mb-2">TheSpark is a wealth-building platform. We provide financial education and habit-tracking tools based on proven principles from "The Richest Man in Babylon." Individual results depend on personal consistency and commitment.</p>
                    <p>We do not guarantee specific financial outcomes. Wealth-building is a skill that requires time, effort, and discipline. TheSpark is here to guide and support you on your journey, but your success ultimately depends on your actions.</p>
                </div>

                {/* <p style={{ fontSize: 12, color: T.ink, textAlign: 'center', marginTop: 40, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>TheSpark is a wealth-building education platform. Our program is based on proven principles from <em>The Richest Man in Babylon</em>. Individual results depend on personal consistency and commitment. We do not guarantee specific financial outcomes.</p> */}
            </div>
        </div>
    );
}