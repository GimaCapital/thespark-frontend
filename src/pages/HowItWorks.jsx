import React from 'react';
import { Link } from 'react-router-dom';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Set Your Daily Goal",
            description: "Choose your daily savings target between ₦100 - ₦2,000 (Basic) or up to ₦20,000 (Premium). Start small and grow as your habit strengthens.",
            icon: "🎯",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50"
        },
        {
            number: "02",
            title: "Track Your 21-Day Cycle",
            description: "Each cycle runs for 21 days. Days 1-16 build your momentum. Days 17-21 complete your cycle. Consistency is key to building lasting wealth habits.",
            icon: "🔄",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=500&fit=crop",
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50"
        },
        {
            number: "03",
            title: "Learn Daily Wisdom",
            description: "Each day, you receive an educational message from 'The Richest Man in Babylon'. Master the 7 timeless rules of wealth, one cycle at a time.",
            icon: "📚",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop",
            color: "from-purple-500 to-indigo-500",
            bgColor: "from-purple-50 to-indigo-50"
        },
        {
            number: "04",
            title: "Track Your Progress",
            description: "Your dashboard shows your consistency, cycle progress, and achievements. Watch your wealth habit grow stronger every day.",
            icon: "📊",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
            color: "from-orange-500 to-red-500",
            bgColor: "from-orange-50 to-red-50"
        },
        {
            number: "05",
            title: "Complete 8 Cycles",
            description: "After 8 cycles (6 months), you become a TheSpark Graduate. Unlock advanced learning opportunities and exclusive benefits.",
            icon: "🎓",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop",
            color: "from-yellow-500 to-amber-500",
            bgColor: "from-yellow-50 to-amber-50"
        },
        {
            number: "06",
            title: "Access Advanced Opportunities",
            description: "Graduates gain access to micro-lending education, asset co-ownership training, and skill development programs to accelerate wealth building.",
            icon: "🚀",
            image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=500&fit=crop",
            color: "from-pink-500 to-rose-500",
            bgColor: "from-pink-50 to-rose-50"
        }
    ];

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            {/* FULL WIDTH HERO SECTION WITH UNSPLASH IMAGE */}
            <div className="relative h-[450px] sm:h-[550px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&h=600&fit=crop"
                        alt="How TheSpark Works"
                        className="w-full h-full object-cover"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-spark-900/85 via-spark-800/75 to-spark-900/85"></div> */}
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <div className="text-6xl animate-pulse">⚙️</div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">How TheSpark Works</h1>
                    <div className="w-24 h-1 bg-spark-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                        Your simple path to building lasting wealth habits — one day, one cycle at a time
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
                
                {/* Introduction Text */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Simple Steps. Massive Results.</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-spark-500 to-spark-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        TheSpark transforms complex wealth principles into simple daily actions. 
                        Follow these steps and watch your financial habits transform.
                    </p>
                </div>

                {/* Steps Grid - Alternating Layout with Images */}
                <div className="space-y-16">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center group`}>
                            {/* Image Section */}
                            <div className="flex-1 relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 z-10"></div>
                                <img 
                                    src={step.image} 
                                    alt={step.title}
                                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className={`absolute top-4 left-4 z-20 bg-gradient-to-r ${step.color} text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg`}>
                                    {step.number}
                                </div>
                                <div className="absolute bottom-4 right-4 z-20 text-white text-4xl drop-shadow-lg">
                                    {step.icon}
                                </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className={`flex-1 p-6 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${step.bgColor} rounded-full mb-4`}>
                                    <span className="text-2xl">{step.icon}</span>
                                    <span className={`text-sm font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                        Step {step.number}
                                    </span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base mb-6">
                                    {step.description}
                                </p>
                                <div className="flex items-center gap-2 text-spark-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                    <span>Learn more</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            {/* 8-Cycle Journey - Premium Professional Design */}
<div className="mt-24">
    <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-spark-50 rounded-full mb-6">
            <span className="text-spark-500 text-sm font-semibold">THE PATH</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Your 8-Cycle Journey
        </h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
            8 cycles = 6 months = 168 days of consistent progress
        </p>
        <div className="w-16 h-0.5 bg-spark-500 mx-auto rounded-full mt-6"></div>
    </div>

    {/* Modern Timeline Design */}
    <div className="relative max-w-5xl mx-auto">
        {/* Vertical Line - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-spark-300 via-spark-400 to-spark-500 hidden lg:block"></div>
        
        {[
            { cycle: 1, name: "Pay Yourself First", desc: "The foundation of all wealth. Save before you spend.", icon: "💰", month: "Month 1", side: "left", color: "#10B981" },
            { cycle: 2, name: "Control Your Spending", desc: "Master the difference between needs and wants.", icon: "📊", month: "Month 1", side: "right", color: "#3B82F6" },
            { cycle: 3, name: "Make Your Money Work", desc: "Let consistency and time do the heavy lifting.", icon: "📈", month: "Month 2", side: "left", color: "#8B5CF6" },
            { cycle: 4, name: "Protect Your Wealth", desc: "Guard against losses and bad advice.", icon: "🛡️", month: "Month 2", side: "right", color: "#EC4899" },
            { cycle: 5, name: "Own Your Own Home", desc: "Build assets that grow in value.", icon: "🏠", month: "Month 3", side: "left", color: "#F59E0B" },
            { cycle: 6, name: "Secure Your Future", desc: "Prepare for emergencies and retirement.", icon: "🔒", month: "Month 3", side: "right", color: "#14B8A6" },
            { cycle: 7, name: "Increase Your Ability", desc: "Invest in skills that earn more.", icon: "📚", month: "Month 4", side: "left", color: "#A855F7" },
            { cycle: 8, name: "Graduate & Launch", desc: "Unlock advanced opportunities.", icon: "🎓", month: "Month 5-6", side: "right", color: "#EA580C", isGraduate: true }
        ].map((item, idx) => (
            <div key={item.cycle} className={`relative flex flex-col ${item.side === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center mb-16 last:mb-0`}>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full hidden lg:block z-10" 
                     style={{ backgroundColor: item.color, boxShadow: `0 0 0 4px ${item.color}20` }}></div>
                
                {/* Left Side Content */}
                <div className={`lg:w-1/2 ${item.side === 'left' ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3`}
                         style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                        <span>{item.month}</span>
                        <span>•</span>
                        <span>Cycle {item.cycle}</span>
                    </div>
                    <div className={`flex items-center gap-3 mb-2 ${item.side === 'left' ? 'lg:justify-end' : ''}`}>
                        <div className="text-4xl">{item.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    
                    {/* Learning outcome */}
                    <div className={`mt-4 ${item.side === 'left' ? 'lg:justify-end' : ''}`}>
                        <div className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span>You'll learn to {item.name.toLowerCase()}</span>
                        </div>
                    </div>
                </div>
                
                {/* Right Side Spacer */}
                <div className="lg:w-1/2"></div>
            </div>
        ))}
        
        {/* Graduate Highlight Card */}
        <div className="mt-8 bg-gradient-to-r from-spark-600 to-spark-500 rounded-2xl p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold mb-2">You've Completed All 8 Cycles!</h3>
            <p className="text-white/80 max-w-md mx-auto">
                Congratulations, Graduate! You now unlock advanced learning opportunities and exclusive benefits.
            </p>
            <div className="mt-4 inline-block px-4 py-1 bg-white/20 rounded-full text-sm">
                🏆 Certificate of Completion
            </div>
        </div>
    </div>
    
    <div className="text-center mt-12">
        <p className="text-sm text-gray-400">Each cycle builds on the last. Start Cycle 1 today.</p>
    </div>
</div>

                {/* Benefits Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Why Members Love TheSpark</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-spark-500 to-spark-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-spark-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <div className="text-4xl">🎯</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Simple & Clear</h3>
                            <p className="text-gray-500 text-sm">No complex financial jargon. Just daily actions that build real wealth habits.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-spark-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <div className="text-4xl">💪</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Accountability</h3>
                            <p className="text-gray-500 text-sm">Your dashboard tracks consistency. Plus a dedicated Coach keeps you motivated.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-spark-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <div className="text-4xl">👥</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Community Support</h3>
                            <p className="text-gray-500 text-sm">Join thousands of Nigerians on the same wealth-building journey.</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-spark-600 to-spark-500 rounded-3xl p-10 text-white">
                        <div className="text-5xl mb-4">🔥</div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to Start Your Journey?</h2>
                        <p className="text-white/80 mb-6 max-w-md mx-auto">
                            Join thousands of Nigerians building consistent financial habits — one day at a time.
                        </p>
                        <Link 
                            to="/register" 
                            className="inline-block bg-white text-spark-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            Create Your Free Account 🔥
                        </Link>
                        <p className="text-white/60 text-xs mt-4">
                            Start with just ₦100 daily. Every spark matters.
                        </p>
                    </div>
                </div>

                {/* FAQ Link */}
                <div className="text-center mt-10">
                    <p className="text-gray-500">
                        Still have questions? Visit our <Link to="/faq" className="text-spark-600 font-semibold hover:underline">FAQ page</Link> for more answers.
                    </p>
                </div>
            </div>
        </div>
    );
}