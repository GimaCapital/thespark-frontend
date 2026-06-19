import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';

export default function Terms() {
    const [activeSection, setActiveSection] = useState('section-1');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            
            const sections = document.querySelectorAll('[data-section]');
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    setActiveSection(section.id);
                }
            });
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
        { id: 'section-1', title: 'Acceptance of Terms', number: '01' },
        { id: 'section-2', title: 'Eligibility', number: '02' },
        { id: 'section-3', title: 'How It Works', number: '03' },
        { id: 'section-4', title: 'Your Account', number: '04' },
        { id: 'section-5', title: 'Savings Program', number: '05' },
        { id: 'section-6', title: 'Accountability', number: '06' },
        { id: 'section-7', title: 'Referral Program', number: '07' },
        { id: 'section-8', title: 'Prohibited Activities', number: '08' },
        { id: 'section-9', title: 'Account Termination', number: '09' },
        { id: 'section-10', title: 'Limitation of Liability', number: '10' },
        { id: 'section-11', title: 'Dispute Resolution', number: '11' },
        { id: 'section-12', title: 'Changes to Terms', number: '12' },
        { id: 'section-13', title: 'Contact', number: '13' },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId);
        }
    };

    // Image mapping for each section
    const sectionImages = {
        'section-1': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
        'section-2': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
        'section-3': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
        'section-4': 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=300&fit=crop',
        'section-5': 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=300&fit=crop',
        'section-6': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
        'section-7': 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop',
        'section-8': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        'section-9': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
        'section-10': 'https://images.unsplash.com/photo-1554224154-26032ffc0f07?w=400&h=300&fit=crop',
        'section-11': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
        'section-12': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
        'section-13': 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop',
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderMissionCard />
            
            {/* Sticky Navigation Bar */}
            <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-spark-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">TS</span>
                            </div>
                            <span className="text-gray-700 font-medium group-hover:text-spark-600 transition">TheSpark</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-1">
                            {sections.slice(0, 6).map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                        activeSection === section.id
                                            ? 'bg-spark-50 text-spark-600'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 ">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop')] bg-cover bg-center "></div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-spark-400 animate-pulse"></span>
                            <span className="text-white/90 text-xs font-medium tracking-wide">LEGAL DOCUMENT</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
                            Please read these terms carefully. By using TheSpark, you agree to be bound by these Terms of Service.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-spark-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white/60 text-sm">Legally Binding</span>
                            </div>
                            <div className="w-px h-4 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-spark-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white/60 text-sm">wealth-building platform</span>
                            </div>
                            <div className="w-px h-4 bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-spark-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white/60 text-sm">Be the spark.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Navigation */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-24 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                                <div className="w-8 h-8 bg-spark-100 rounded-lg flex items-center justify-center">
                                    <span className="text-sm">⚖️</span>
                                </div>
                                <span className="font-semibold text-gray-900">On this page</span>
                            </div>
                            <nav className="space-y-1">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                            activeSection === section.id
                                                ? 'bg-spark-50 text-spark-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className={`text-xs font-mono ${activeSection === section.id ? 'text-spark-500' : 'text-gray-400'}`}>
                                            {section.number}
                                        </span>
                                        <span>{section.title}</span>
                                        {activeSection === section.id && (
                                            <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Executive Summary */}
                        <div className="bg-gradient-to-r from-spark-50 via-white to-orange-50 rounded-2xl p-6 border border-spark-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-spark-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-white text-xl">⚖️</span>
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-spark-100 rounded-full text-xs font-medium text-spark-600 mb-2">
                                        <span className="w-1 h-1 rounded-full bg-spark-500"></span>
                                        AGREEMENT
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Terms at a Glance</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        TheSpark is a <strong className="text-spark-600">wealth-building platform</strong>. 
                                        By using our services, you agree to these terms. 
                                        We do not provide financial advice or guarantees. 
                                        Your success depends on your consistency and commitment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <div id="section-1" data-section className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow scroll-mt-24">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                <div className="md:col-span-1 h-48 md:h-auto">
                                    <img 
                                        src={sectionImages['section-1']}
                                        alt="Acceptance of Terms"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="md:col-span-2 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-lg">01</span>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
                                            <p className="text-gray-600 leading-relaxed mb-3">
                                                By accessing or using TheSpark, you agree to be bound by these Terms of Service. 
                                                If you do not agree to these terms, please do not use our services.
                                            </p>
                                            <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                                                <p className="text-amber-700 text-sm">
                                                    ⚠️ These terms constitute a legally binding agreement between you and TheSpark.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div id="section-2" data-section className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow scroll-mt-24">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                <div className="md:col-span-1 h-48 md:h-auto">
                                    <img 
                                        src={sectionImages['section-2']}
                                        alt="Eligibility"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="md:col-span-2 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-lg">02</span>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-3">Eligibility</h2>
                                            <p className="text-gray-600 mb-3">To use TheSpark, you must:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {[
                                                    "Be at least 18 years old",
                                                    "Have legal capacity to enter into contracts",
                                                    "Provide accurate and complete information",
                                                    "Not be prohibited by law from using our services"
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-gray-600 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 - Highlighted */}
                        <div id="section-3" data-section className="bg-gradient-to-r from-spark-600 to-orange-600 rounded-2xl overflow-hidden scroll-mt-24">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                <div className="md:col-span-1 h-48 md:h-auto">
                                    <img 
                                        src={sectionImages['section-3']}
                                        alt="How It Works"
                                        className="w-full h-full object-cover opacity-70"
                                    />
                                </div>
                                <div className="md:col-span-2 p-6 text-white">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                            <span className="text-white font-bold text-lg">03</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium mb-3">
                                                <span className="w-1 h-1 rounded-full bg-white"></span>
                                                wealth-building platform
                                            </div>
                                            <h2 className="text-2xl font-bold mb-4">How TheSpark Works</h2>
                                            <p className="text-white/90 mb-4">TheSpark helps you build consistent wealth habits through education and accountability:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[
                                                    "Set your daily savings goal",
                                                    "Track consistency over 21-day cycles",
                                                    "Complete 8 cycles to graduate",
                                                    "Unlock advanced learning opportunities"
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-white/90 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 p-3 bg-white/10 rounded-lg">
                                                <p className="text-white/80 text-xs">
                                                    🔥 TheSpark is an educational platform. We do not provide financial advice or guarantees.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sections 4-13 with images in 3-column grid for compact sections */}
                        {[
                            { id: 'section-4', num: '04', title: 'Your Account', desc: 'You are responsible for maintaining the security of your account. Keep credentials confidential and notify us of unauthorized access.', icon: '🔐', image: sectionImages['section-4'] },
                            { id: 'section-5', num: '05', title: 'Savings Program', desc: 'Set daily goals and track consistency. Complete 21-day cycles to build lasting wealth habits.', icon: '💰', image: sectionImages['section-5'] },
                            { id: 'section-6', num: '06', title: 'Accountability', desc: 'We provide tracking tools to monitor your consistency. Your commitment determines your success.', icon: '📊', image: sectionImages['section-6'] },
                            { id: 'section-7', num: '07', title: 'Referral Program', desc: 'Share your code. Earn rewards when referred friends complete their first cycle. No abuse permitted.', icon: '👥', image: sectionImages['section-7'] },
                            { id: 'section-8', num: '08', title: 'Prohibited Activities', desc: 'No illegal use, multiple accounts, harassment, bots, or reverse engineering.', icon: '🚫', image: sectionImages['section-8'] },
                            { id: 'section-9', num: '09', title: 'Account Termination', desc: 'We may suspend accounts for violations, fraud, inactivity, or at our discretion.', icon: '⚠️', image: sectionImages['section-9'] },
                            { id: 'section-10', num: '10', title: 'Limitation of Liability', desc: 'We are not liable for service interruptions, data breaches beyond control, or force majeure.', icon: '🔒', image: sectionImages['section-10'] },
                            { id: 'section-11', num: '11', title: 'Dispute Resolution', desc: 'Disputes resolved through binding arbitration in Port Harcourt, Nigeria.', icon: '⚖️', image: sectionImages['section-11'] },
                            { id: 'section-12', num: '12', title: 'Changes to Terms', desc: 'We may modify terms. Continued use constitutes acceptance.', icon: '📝', image: sectionImages['section-12'] },
                            { id: 'section-13', num: '13', title: 'Contact', desc: 'Email: legal@thespark.money • Phone: +234 703 883 0301 • Address: Port Harcourt', icon: '📞', image: sectionImages['section-13'] }
                        ].map(section => (
                            <div key={section.id} id={section.id} data-section className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow scroll-mt-24">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                                    <div className="md:col-span-1 h-40 md:h-auto">
                                        <img 
                                            src={section.image}
                                            alt={section.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="md:col-span-3 p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-gray-700 font-bold text-sm">{section.num}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{section.icon}</span>
                                                    <h3 className="font-semibold text-gray-800">{section.title}</h3>
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed">{section.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Footer Acknowledgment */}
                        <div className="bg-gray-900 rounded-2xl p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-2xl">⚖️</span>
                                <span className="text-white font-medium">By using TheSpark, you agree to these Terms of Service</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-white/40 text-xs mb-4">
                                <span>wealth-building platform</span>
                                <span>•</span>
                                <span>Be the spark.</span>
                                <span>•</span>
                                <span>One spark. One fire. One wealthy Nigeria.</span>
                            </div>
                            <Link to="/" className="inline-flex items-center gap-1 text-white/50 hover:text-white transition text-sm">
                                ← Return to TheSpark
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}