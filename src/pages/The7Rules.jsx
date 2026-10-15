// C:\Users\HP\Desktop\TheSpark\thespark-frontend\src\pages\The7Rules.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

const rules = [
    {
        number: 1,
        title: "Pay Yourself First",
        quote: "Before you buy anything, first take 10% of your money and save it. That money is yours. Do not touch it.",
        icon: "💰",
        longDesc: "This is the foundation of all wealth. When you pay yourself first, you prioritize your future over your present desires. Every wealthy person started with this rule.",
        image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&fit=crop",
        color: "from-emerald-500 to-green-500",
        bgColor: "from-emerald-50 to-green-50"
    },
    {
        number: 2,
        title: "Control Your Spending",
        quote: "Do not spend money on things you do not need. Ask yourself: 'Do I need this or just want it?'",
        icon: "📊",
        longDesc: "Luxury is a thief of wealth. Learn to distinguish between necessities and desires. The money you save from unnecessary spending compounds over time.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-50 to-cyan-50"
    },
    {
        number: 3,
        title: "Make Your Money Work",
        quote: "Do not keep your money under your bed. Let it earn interest. Let it work for you like a servant.",
        icon: "📈",
        longDesc: "Idle money loses value. Put your resources to work through consistent saving and smart habits. Over time, your money will multiply.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
        color: "from-purple-500 to-indigo-500",
        bgColor: "from-purple-50 to-indigo-50"
    },
    {
        number: 4,
        title: "Protect Your Money From Loss",
        quote: "Before you invest, ask questions. Do not give your money to anyone who promises 'quick double.' If it sounds too good, it is a scam.",
        icon: "🛡️",
        longDesc: "Greed is the enemy of wealth. If someone promises fast returns, run away. Real wealth grows slowly through discipline and patience.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
        color: "from-rose-500 to-pink-500",
        bgColor: "from-rose-50 to-pink-50"
    },
    {
        number: 5,
        title: "Own Your Own Home",
        quote: "If you rent forever, your landlord becomes rich. Save to buy land or build a room. Own something.",
        icon: "🏠",
        longDesc: "Real estate is a proven wealth builder. When you own your home, you stop paying someone else's mortgage and start building your own equity.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
        color: "from-amber-500 to-orange-500",
        bgColor: "from-amber-50 to-orange-50"
    },
    {
        number: 6,
        title: "Insure Your Future",
        quote: "Have savings for emergency. If you lose your job or get sick, your savings will save you.",
        icon: "🔒",
        longDesc: "Life is unpredictable. An emergency fund gives you peace of mind and prevents you from going into debt when unexpected events occur.",
         image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
        color: "from-teal-500 to-green-500",
        bgColor: "from-teal-50 to-green-50"
    },
    {
        number: 7,
        title: "Increase Your Ability to Earn",
        quote: "Learn skills. Learn trade. Learn business. The more you know, the more you can earn.",
        icon: "📚",
        longDesc: "Your earning potential is your greatest asset. Invest in yourself. Learn new skills. Become more valuable. Your income will follow.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop",
        color: "from-indigo-500 to-purple-500",
        bgColor: "from-indigo-50 to-purple-50"
    }
];

export default function The7Rules() {
    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            {/* Hero Section - Clean Classic */}
                         <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg"
                        alt="Ancient book and glasses - The Richest Man in Babylon"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full mb-6">
                        <span className="text-white text-sm font-semibold">📖 TIMELESS WISDOM</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        The 7 Rules of Wealth
                    </h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-spark-400 to-orange-400 mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                        From "The Richest Man in Babylon" — principles that have transformed lives for nearly a century
                    </p>
                </div>
            </div>


            {/* Rules Grid - Clean, No Shadows, No Zoom */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {rules.map((rule) => (
                        <div 
                            key={rule.number}
                            className="bg-white rounded-lg overflow-hidden border border-gray-200"
                        >
                            {/* Image Section - No Zoom */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img 
                                    src={rule.image} 
                                    alt={rule.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                
                                {/* Number Badge - Simple */}
                                <div className="absolute top-4 left-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold text-lg border border-gray-200">
                                        {rule.number}
                                    </div>
                                </div>
                                
                                {/* Icon Badge - Simple */}
                                <div className="absolute bottom-4 right-4">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                                        <span className="text-sm">{rule.icon}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content - Clean Typography */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {rule.title}
                                </h3>
                                
                                {/* Quote Box - Simple */}
                                <div className={`bg-gradient-to-r ${rule.bgColor} rounded-md p-3 mb-3 border-l-3 border-spark-500`}>
                                    <p className="text-gray-700 italic text-sm">
                                        "{rule.quote}"
                                    </p>
                                </div>
                                
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {rule.longDesc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Wisdom Card - Clean, No Glassmorphism */}
                               {/* Wisdom Card - Text Visibility Fixed with Dark Overlay */}
                <div className="relative py-20 overflow-hidden rounded-2xl mt-8">
                    <div className="absolute inset-0">
                        <img 
                            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop"
                            alt="Ancient books library"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full mb-6">
                            <span className="text-2xl">📜</span>
                            <span className="text-amber-200 text-sm font-semibold">ANCIENT WISDOM</span>
                        </div>
                        <p className="text-2xl italic text-white mb-6 leading-relaxed drop-shadow-md">
                            "Wealth grows slowly. Anyone who promises fast wealth is lying to you."
                        </p>
                        <div className="w-16 h-0.5 bg-amber-400/50 mx-auto rounded-full mb-6"></div>
                        <p className="text-amber-100 font-semibold text-lg">
                            Be patient. Be disciplined. You will get there.
                        </p>
                    </div>
                </div>

                {/* Call to Action - Simple Button */}
                <div className="mt-12 text-center">
                    <Link 
                        to="/register" 
                        className="inline-flex items-center gap-2 px-8 py-3 bg-spark-600 text-white rounded-md font-semibold hover:bg-spark-700 transition-colors"
                    >
                        <span>Start Your Wealth Journey Today</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <p className="text-gray-400 text-sm mt-4">Join thousands already building lasting wealth</p>
                </div>
            </div>
        </div>
    );
}