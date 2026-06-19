// import React from 'react';
// import { Link } from 'react-router-dom';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

// const rules = [
//     {
//         number: 1,
//         title: "Pay Yourself First",
//         quote: "Before you buy anything, first take 10% of your money and save it. That money is yours. Do not touch it.",
//         icon: "💰",
//         color: "emerald",
//         longDesc: "This is the foundation of all wealth. When you pay yourself first, you prioritize your future over your present desires. Every wealthy person started with this rule.",
//         image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&fit=crop"
//     },
//     {
//         number: 2,
//         title: "Control Your Spending",
//         quote: "Do not spend money on things you do not need. Ask yourself: 'Do I need this or just want it?'",
//         icon: "📊",
//         color: "blue",
//         longDesc: "Luxury is a thief of wealth. Learn to distinguish between necessities and desires. The money you save from unnecessary spending compounds over time.",
//         image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop"
//     },
//     {
//         number: 3,
//         title: "Make Your Money Work",
//         quote: "Do not keep your money under your bed. Let it earn interest. Let it work for you like a servant.",
//         icon: "📈",
//         color: "purple",
//         longDesc: "Idle money loses value. Put your resources to work through consistent saving and smart habits. Over time, your money will multiply.",
//         image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop"
//     },
//     {
//         number: 4,
//         title: "Protect Your Money From Loss",
//         quote: "Before you invest, ask questions. Do not give your money to anyone who promises 'quick double.' If it sounds too good, it is a scam.",
//         icon: "🛡️",
//         color: "rose",
//         longDesc: "Greed is the enemy of wealth. If someone promises fast returns, run away. Real wealth grows slowly through discipline and patience.",
//         image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop"
//     },
//     {
//         number: 5,
//         title: "Own Your Own Home",
//         quote: "If you rent forever, your landlord becomes rich. Save to buy land or build a room. Own something.",
//         icon: "🏠",
//         color: "amber",
//         longDesc: "Real estate is a proven wealth builder. When you own your home, you stop paying someone else's mortgage and start building your own equity.",
//         image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop"
//     },
//     {
//         number: 6,
//         title: "Insure Your Future",
//         quote: "Have savings for emergency. If you lose your job or get sick, your savings will save you.",
//         icon: "🔒",
//         color: "teal",
//         longDesc: "Life is unpredictable. An emergency fund gives you peace of mind and prevents you from going into debt when unexpected events occur.",
//         image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=800&h=500&fit=crop"
//     },
//     {
//         number: 7,
//         title: "Increase Your Ability to Earn",
//         quote: "Learn skills. Learn trade. Learn business. The more you know, the more you can earn.",
//         icon: "📚",
//         color: "indigo",
//         longDesc: "Your earning potential is your greatest asset. Invest in yourself. Learn new skills. Become more valuable. Your income will follow.",
//         image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop"
//     }
// ];

// export default function The7Rules() {
//     return (
//         <div className="bg-black min-h-screen">
//             <HeaderMissionCard />
            
//             {/* Futuristic Hero Section */}
//             <div className="relative py-28 overflow-hidden">
//                 {/* Animated Background */}
//                 <div className="absolute inset-0">
//                     <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-black"></div>
//                     <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
//                     <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
//                 </div>
                
//                 <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
//                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-6 backdrop-blur-sm border border-amber-500/20">
//                         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
//                         <span className="text-amber-400 text-sm font-semibold tracking-wide">TIMELESS WISDOM</span>
//                     </div>
//                     <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
//                         The 7 Rules of
//                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Wealth</span>
//                     </h1>
//                     <div className="w-24 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6"></div>
//                     <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//                         From "The Richest Man in Babylon" — principles that have transformed lives for nearly a century
//                     </p>
//                 </div>
//             </div>

//             {/* Futuristic Rules Grid */}
//             <div className="max-w-7xl mx-auto px-6 py-16">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {rules.map((rule) => (
//                         <div 
//                             key={rule.number}
//                             className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-500 hover:transform hover:-translate-y-2"
//                         >
//                             {/* Glassmorphism Effect */}
//                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            
//                             {/* Image Section */}
//                             <div className="relative h-48 overflow-hidden">
//                                 <img 
//                                     src={rule.image} 
//                                     alt={rule.title}
//                                     className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                
//                                 {/* Number Badge */}
//                                 <div className="absolute top-4 left-4">
//                                     <div className={`w-12 h-12 bg-gradient-to-br from-${rule.color}-500 to-${rule.color}-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg backdrop-blur-sm`}>
//                                         {rule.number}
//                                     </div>
//                                 </div>
                                
//                                 {/* Icon Overlay */}
//                                 <div className="absolute bottom-4 right-4">
//                                     <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
//                                         <span className="text-2xl">{rule.icon}</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Content */}
//                             <div className="p-6">
//                                 <h3 className="text-2xl font-bold text-white mb-3">
//                                     {rule.title}
//                                 </h3>
                                
//                                 {/* Quote Box */}
//                                 <div className="bg-amber-500/10 rounded-xl p-4 mb-4 border-l-4 border-amber-400">
//                                     <p className="text-gray-300 italic text-base">
//                                         "{rule.quote}"
//                                     </p>
//                                 </div>
                                
//                                 <p className="text-gray-400 text-sm leading-relaxed">
//                                     {rule.longDesc}
//                                 </p>
                                
//                                 {/* Futuristic Divider */}
//                                 <div className="mt-4 pt-3 flex items-center gap-2">
//                                     <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent"></div>
//                                     <span className="text-xs text-amber-400/60">✦ PRINCIPLE {rule.number} ✦</span>
//                                     <div className="h-px flex-1 bg-gradient-to-l from-amber-400/50 to-transparent"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Futuristic Wisdom Card */}
//                 <div className="mt-16 relative overflow-hidden rounded-2xl">
//                     <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600"></div>
//                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-10"></div>
//                     <div className="relative z-10 p-10 text-center">
//                         <div className="inline-block p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
//                             <div className="text-4xl">📜</div>
//                         </div>
//                         <p className="text-2xl italic text-white mb-4 max-w-2xl mx-auto">
//                             "Wealth grows slowly. Anyone who promises fast wealth is lying to you."
//                         </p>
//                         <div className="w-16 h-0.5 bg-white/30 mx-auto rounded-full mb-4"></div>
//                         <p className="text-amber-100 font-semibold">
//                             Be patient. Be disciplined. You will get there.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Futuristic Call to Action */}
//                 <div className="mt-12 text-center">
//                     <div className="inline-block p-[1px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
//                         <Link 
//                             to="/register" 
//                             className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition-all group"
//                         >
//                             <span>Start Your Wealth Journey Today</span>
//                             <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                             </svg>
//                         </Link>
//                     </div>
//                     <p className="text-gray-500 text-sm mt-4">Join thousands already building lasting wealth</p>
//                 </div>
//             </div>
//         </div>
//     );
// }



// import React from 'react';
// import { Link } from 'react-router-dom';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

// const rules = [
//     {
//         number: 1,
//         title: "Pay Yourself First",
//         quote: "Before you buy anything, first take 10% of your money and save it. That money is yours. Do not touch it.",
//         icon: "💰",
//         longDesc: "This is the foundation of all wealth. When you pay yourself first, you prioritize your future over your present desires. Every wealthy person started with this rule.",
//         image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=500&fit=crop",
//         color: "from-emerald-500 to-green-500",
//         bgColor: "from-emerald-50 to-green-50"
//     },
//     {
//         number: 2,
//         title: "Control Your Spending",
//         quote: "Do not spend money on things you do not need. Ask yourself: 'Do I need this or just want it?'",
//         icon: "📊",
//         longDesc: "Luxury is a thief of wealth. Learn to distinguish between necessities and desires. The money you save from unnecessary spending compounds over time.",
//         image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
//         color: "from-blue-500 to-cyan-500",
//         bgColor: "from-blue-50 to-cyan-50"
//     },
//     {
//         number: 3,
//         title: "Make Your Money Work",
//         quote: "Do not keep your money under your bed. Let it earn interest. Let it work for you like a servant.",
//         icon: "📈",
//         longDesc: "Idle money loses value. Put your resources to work through consistent saving and smart habits. Over time, your money will multiply.",
//         image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
//         color: "from-purple-500 to-indigo-500",
//         bgColor: "from-purple-50 to-indigo-50"
//     },
//     {
//         number: 4,
//         title: "Protect Your Money From Loss",
//         quote: "Before you invest, ask questions. Do not give your money to anyone who promises 'quick double.' If it sounds too good, it is a scam.",
//         icon: "🛡️",
//         longDesc: "Greed is the enemy of wealth. If someone promises fast returns, run away. Real wealth grows slowly through discipline and patience.",
//         image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
//         color: "from-rose-500 to-pink-500",
//         bgColor: "from-rose-50 to-pink-50"
//     },
//     {
//         number: 5,
//         title: "Own Your Own Home",
//         quote: "If you rent forever, your landlord becomes rich. Save to buy land or build a room. Own something.",
//         icon: "🏠",
//         longDesc: "Real estate is a proven wealth builder. When you own your home, you stop paying someone else's mortgage and start building your own equity.",
//         image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
//         color: "from-amber-500 to-orange-500",
//         bgColor: "from-amber-50 to-orange-50"
//     },
//     {
//         number: 6,
//         title: "Insure Your Future",
//         quote: "Have savings for emergency. If you lose your job or get sick, your savings will save you.",
//         icon: "🔒",
//         longDesc: "Life is unpredictable. An emergency fund gives you peace of mind and prevents you from going into debt when unexpected events occur.",
//         image: "https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=800&h=500&fit=crop",
//         color: "from-teal-500 to-green-500",
//         bgColor: "from-teal-50 to-green-50"
//     },
//     {
//         number: 7,
//         title: "Increase Your Ability to Earn",
//         quote: "Learn skills. Learn trade. Learn business. The more you know, the more you can earn.",
//         icon: "📚",
//         longDesc: "Your earning potential is your greatest asset. Invest in yourself. Learn new skills. Become more valuable. Your income will follow.",
//         image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop",
//         color: "from-indigo-500 to-purple-500",
//         bgColor: "from-indigo-50 to-purple-50"
//     }
// ];

// export default function The7Rules() {
//     return (
//         <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
//             <HeaderMissionCard />
            
//             {/* Hero Section - Fixed Text Visibility */}
//                <div className="relative py-24 overflow-hidden">
//                 <div className="absolute inset-0">
//                     <img 
//                         src="https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg"
//                         alt="Ancient book and glasses - The Richest Man in Babylon"
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
                
//                 <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
//                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full mb-6">
//                         <span className="text-white text-sm font-semibold">📖 TIMELESS WISDOM</span>
//                     </div>
//                     <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
//                         The 7 Rules of Wealth
//                     </h1>
//                     <div className="w-20 h-1 bg-gradient-to-r from-spark-400 to-orange-400 mx-auto rounded-full mb-6"></div>
//                     <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
//                         From "The Richest Man in Babylon" — principles that have transformed lives for nearly a century
//                     </p>
//                 </div>
//             </div>

//             {/* Rules Grid */}
//             <div className="max-w-7xl mx-auto px-6 py-16">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {rules.map((rule) => (
//                         <div 
//                             key={rule.number}
//                             className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
//                         >
//                             {/* Image Section */}
//                             <div className="relative h-56 overflow-hidden">
//                                 <img 
//                                     src={rule.image} 
//                                     alt={rule.title}
//                                     className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                
//                                 {/* Number Badge */}
//                                 <div className="absolute top-4 left-4">
//                                     <div className={`w-12 h-12 bg-gradient-to-br ${rule.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
//                                         {rule.number}
//                                     </div>
//                                 </div>
                                
//                                 {/* Icon Badge */}
//                                 <div className="absolute bottom-4 right-4">
//                                     <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
//                                         <span className="text-xl">{rule.icon}</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Content */}
//                             <div className="p-6">
//                                 <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                                     {rule.title}
//                                 </h3>
                                
//                                 {/* Quote Box */}
//                                 <div className={`bg-gradient-to-r ${rule.bgColor} rounded-xl p-4 mb-4 border-l-4 border-spark-400`}>
//                                     <p className="text-gray-700 italic text-sm">
//                                         "{rule.quote}"
//                                     </p>
//                                 </div>
                                
//                                 <p className="text-gray-500 text-sm leading-relaxed">
//                                     {rule.longDesc}
//                                 </p>
                                
//                                 {/* Learn More Link */}
//                                 <div className="mt-4 pt-3 flex items-center gap-2 text-spark-600 text-sm group-hover:gap-3 transition-all duration-300">
//                                     <span className="text-xs font-semibold tracking-wider">LEARN MORE</span>
//                                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Wisdom Card - Clean Design */}
//                    {/* Wisdom Card - Text Visibility Fixed with Dark Overlay */}
//                 <div className="relative py-20 overflow-hidden rounded-2xl mt-8">
//                     <div className="absolute inset-0">
//                         <img 
//                             src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop"
//                             alt="Ancient books library"
//                             className="w-full h-full object-cover"
//                         />
//                         <div className="absolute inset-0 bg-black/50"></div>
//                     </div>
                    
//                     <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full mb-6">
//                             <span className="text-2xl">📜</span>
//                             <span className="text-amber-200 text-sm font-semibold">ANCIENT WISDOM</span>
//                         </div>
//                         <p className="text-2xl italic text-white mb-6 leading-relaxed drop-shadow-md">
//                             "Wealth grows slowly. Anyone who promises fast wealth is lying to you."
//                         </p>
//                         <div className="w-16 h-0.5 bg-amber-400/50 mx-auto rounded-full mb-6"></div>
//                         <p className="text-amber-100 font-semibold text-lg">
//                             Be patient. Be disciplined. You will get there.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Call to Action */}
//                 <div className="mt-12 text-center">
//                     <div className="inline-block p-[1px] bg-gradient-to-r from-spark-500 to-orange-500 rounded-full">
//                         <Link 
//                             to="/register" 
//                             className="inline-flex items-center gap-2 px-8 py-3 bg-white text-spark-700 rounded-full font-semibold hover:bg-spark-50 transition-all group"
//                         >
//                             <span>Start Your Wealth Journey Today</span>
//                             <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                             </svg>
//                         </Link>
//                     </div>
//                     <p className="text-gray-500 text-sm mt-4">Join thousands already building lasting wealth</p>
//                 </div>
//             </div>
//         </div>
//     );
// }



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