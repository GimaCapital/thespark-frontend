import React from 'react';
import { useLocation } from 'react-router-dom';

// ✅ Industry Standard: Centralized configuration with professional messaging
const PAGE_CONFIG = {
    '/dashboard': {
        icon: '💪',
        title: 'Financial Dashboard',
        subtitle: 'Track your savings, monitor progress, and achieve your financial goals'
    },
    '/profile': {
        icon: '👤',
        title: 'Account Settings',
        subtitle: 'Manage your profile, security, and personal information'
    },
    '/transactions': {
        icon: '📊',
        title: 'Transaction History',
        subtitle: 'Complete audit trail of all your deposits, withdrawals, and earnings'
    },
    '/referral': {
        icon: '👥',
        title: 'Referral Program',
        subtitle: 'Invite friends and earn ₦500 for each successful referral'
    },
    '/premium': {
        icon: '⭐',
        title: 'Premium Membership',
        subtitle: 'Unlock higher interest rates, priority support, and exclusive benefits'
    },
    '/graduation': {
        icon: '🎓',
        title: 'Graduation Ceremony',
        subtitle: 'You\'ve completed 8 cycles — well on your way to financial freedom'
    },
    '/how-it-works': {
        icon: '📖',
        title: 'How It Works',
        subtitle: 'Learn the proven wealth-building framework used by thousands of Nigerians'
    },
    '/faq': {
        icon: '❓',
        title: 'Help Center',
        subtitle: 'Find answers to frequently asked questions about TheSpark platform'
    },
    '/success-stories': {
        icon: '🌟',
        title: 'Success Stories',
        subtitle: 'Real stories from real people transforming their financial lives'
    },
    '/7-rules': {
        icon: '📜',
        title: 'The 7 Rules of Wealth',
        subtitle: 'Timeless principles from "The Richest Man in Babylon" for lasting prosperity'
    },
    '/privacy': {
        icon: '🔐',
        title: 'Privacy Policy',
        subtitle: 'Your data is protected with bank-grade encryption and strict confidentiality'
    },
    '/terms': {
        icon: '📜',
        title: 'Terms of Service',
        subtitle: 'Our commitment to transparency, fairness, and user protection'
    },
    '/login': {
        icon: '🔐',
        title: 'Welcome Back',
        subtitle: 'Sign in securely to continue your wealth-building journey'
    },
    '/register': {
        icon: '✨',
        title: 'Create Your Account',
        subtitle: 'Start building your financial future with TheSpark wealth platform'
    },
    '/about': {
        icon: '📖',
        title: 'About TheSpark',
        subtitle: 'Our mission to empower 1 million Nigerians with timeless wealth principles'
    },
    '/marketplace': {
        icon: '🛒',
        title: 'TheSpark Marketplace',
        subtitle: 'Shop quality food items directly from local producers at wholesale prices'
    },
    '/bank-account': {
        icon: '🏦',
        title: 'Bank Account Management',
        subtitle: 'Securely manage your withdrawal bank account details'
    },
    '/admin': {
        icon: '⚙️',
        title: 'Admin Control Panel',
        subtitle: 'Manage users, monitor platform activity, and oversee operations'
    }
};

// ✅ Industry Standard: Default config
const DEFAULT_CONFIG = {
    icon: '🔥',
    title: 'TheSpark Platform',
    subtitle: 'Build wealth through consistent daily financial education'
};

// ✅ Industry Standard: Hero section config with compelling messaging
const HERO_CONFIG = {
    '/': {
        title: 'TheSpark',
        subtitle: 'Be the spark.',
        description: 'One spark. One fire. One wealthy Nigeria.',
        tagline: 'Join the revolution in financial education'
    },
    '/premium': {
        title: 'Premium Membership',
        subtitle: 'Unlock your full potential',
        description: 'Access higher interest rates, priority support, and advanced wealth-building tools',
        tagline: 'Upgrade today and accelerate your wealth journey'
    },
    '/referral': {
        title: 'Referral Program',
        subtitle: 'Share the wealth, earn rewards',
        description: 'Get ₦500 for every friend who joins and completes their first cycle',
        tagline: 'Build your network, build your wealth'
    },
    '/marketplace': {
        title: 'TheSpark Marketplace',
        subtitle: 'Quality products, wholesale prices',
        description: 'Connect directly with local producers and save money on everyday essentials',
        tagline: 'Support local businesses while saving money'
    },
    '/how-it-works': {
        title: 'How It Works',
        subtitle: 'Simple. Transparent. Life-changing.',
        description: 'Four simple steps to build lasting wealth habits and achieve financial freedom',
        tagline: 'Start your journey today'
    },
    '/7-rules': {
        title: 'The 7 Rules of Wealth',
        subtitle: 'Wisdom for a lifetime',
        description: 'Discover the timeless principles that have transformed lives for generations',
        tagline: 'Learn the rules, build the wealth'
    },
    '/success-stories': {
        title: 'Success Stories',
        subtitle: 'Real people, real results',
        description: 'Hear from Nigerians who are building better financial futures with TheSpark',
        tagline: 'Your story could be next'
    }
};

const DEFAULT_HERO = {
    title: 'TheSpark',
    subtitle: 'Be the spark.',
    description: 'One spark. One fire. One wealthy Nigeria.',
    tagline: 'Join the financial education revolution'
};

export default function HeaderMissionCard({ 
    title: customTitle,
    subtitle: customSubtitle,
    icon: customIcon,
    isHero = false,
    heroTitle: customHeroTitle,
    heroSubtitle: customHeroSubtitle,
    heroDescription: customHeroDescription,
    tagline: customHeroTagline,
    showContent = true,
    className = ''
}) {
    const location = useLocation();
    const currentPath = location.pathname;

    const getConfig = (path, configMap, defaultConfig) => {
        if (configMap[path]) return configMap[path];
        
        const matchedKey = Object.keys(configMap).find(key => 
            path.startsWith(key) && key !== '/'
        );
        
        return matchedKey ? configMap[matchedKey] : defaultConfig;
    };

    const config = getConfig(currentPath, PAGE_CONFIG, DEFAULT_CONFIG);
    const hero = getConfig(currentPath, HERO_CONFIG, DEFAULT_HERO);

    const finalIcon = customIcon ?? config.icon;
    const finalTitle = customTitle ?? config.title;
    const finalSubtitle = customSubtitle ?? config.subtitle;

    const finalHeroTitle = customHeroTitle ?? hero.title;
    const finalHeroSubtitle = customHeroSubtitle ?? hero.subtitle;
    const finalHeroDescription = customHeroDescription ?? hero.description;
    const finalHeroTagline = customHeroTagline ?? hero.tagline;

    if (isHero) {
        return (
            <div className="card-primary spacer-xl" style={{ textAlign: 'center' }}>
                <h1 className="heading-1 text-white mb-4">{finalHeroTitle}</h1>
                <p className="hero-subtitle">{finalHeroSubtitle}</p>
                <p className="hero-description">{finalHeroDescription}</p>
                {finalHeroTagline && (
                    <p className="hero-tagline" style={{ 
                        marginTop: '0.5rem', 
                        opacity: 0.8,
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                    }}>
                        {finalHeroTagline}
                    </p>
                )}
            </div>
        );
    }

    if (!showContent) return null;

    return (
        <div 
            className={`container card-primary ${className}`}
            style={{ 
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}
        >
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{finalIcon}</span>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600', margin: 0, color: 'white' }}>
                        {finalTitle}
                    </p>
                </div>
                <p style={{ fontSize: '0.7rem', margin: '0.25rem 0 0 0', opacity: 0.9, color: 'white' }}>
                    {finalSubtitle}
                </p>
            </div>
        </div>
    );
}