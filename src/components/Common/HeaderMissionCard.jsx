import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function HeaderMissionCard({ 
    // Custom overrides (optional)
    customTitle = null,
    customSubtitle = null,
    customButtonText = null,
    customButtonLink = null,
    customIcon = null,
    // Hero section overrides
    isHero = false,
    customHeroTitle = null,
    customHeroSubtitle = null,
    customHeroDescription = null,
    customHeroButtonText = null,
    customHeroButtonLink = null,
    // General
    onButtonClick = null,
    showButton = true
}) {
    const location = useLocation();
    const currentPath = location.pathname;
    
    // Intelligent content based on page - ALL using spark colors
    const getPageContent = () => {
        // Dashboard page
        if (currentPath === '/dashboard') {
            return {
                title: "💪 Keep Saving!",
                subtitle: "Stay consistent with daily savings",
                buttonText: "Save Now",
                // buttonLink: "/dashboard",
                icon: "💪"
            };
        }
        
        // Profile page
        if (currentPath === '/profile') {
            return {
                title: "👤 Your Profile",
                subtitle: "Manage your account and savings",
                buttonText: "Edit Profile",
                // buttonLink: "/profile/edit",
                icon: "👤"
            };
        }
        
        // Transactions page
        if (currentPath === '/transactions') {
            return {
                title: "📊 Transaction History",
                subtitle: "Track all your savings and withdrawals",
                buttonText: "Export",
                // buttonLink: "/transactions/export",
                icon: "📊"
            };
        }
        
        // Referral page
        if (currentPath === '/referral') {
            return {
                title: "👥 Invite Friends",
                subtitle: "Get ₦5,00 per referral when they start saving",
                buttonText: "Share Code",
                // buttonLink: "/referral/share",
                icon: "👥"
            };
        }
        
        // Premium page
        if (currentPath === '/premium') {
            return {
                title: "⭐ Upgrade to Premium",
                subtitle: "Get higher interest rates & better benefits",
                buttonText: "View Plans",
                // buttonLink: "",
                icon: "⭐"
            };
        }
        
        // Graduation page
        if (currentPath === '/graduation') {
            return {
                title: "🎓 Congratulations!",
                subtitle: "You've completed a savings cycle",
                buttonText: "View Certificate",
                // buttonLink: "",
                icon: "🎓"
            };
        }
        
        // How It Works page
        if (currentPath === '/how-it-works') {
            return {
                title: "📖 How It Works",
                subtitle: "Learn how to save and earn with TheSpark",
                buttonText: "Get Started",
                // buttonLink: "",
                icon: "📖"
            };
        }
        
        // FAQ page
        if (currentPath === '/faq') {
            return {
                title: "❓ Frequently Asked Questions",
                subtitle: "Find answers to common questions",
                buttonText: "Contact Support",
                // buttonLink: "",
                icon: "❓"
            };
        }
        
        // Success Stories page
        if (currentPath === '/success-stories') {
            return {
                title: "🌟 Success Stories",
                subtitle: "Read inspiring stories from our community",
                buttonText: "Share Your Story",
                // buttonLink: "",
                icon: "🌟"
            };
        }
        
        // 7 Rules page
        if (currentPath === '/7-rules') {
            return {
                title: "📜 The 7 Rules of Wealth",
                subtitle: "Principles for financial freedom",
                buttonText: "Start Learning",
                // buttonLink: "",
                icon: "📜"
            };
        }
        
        // Admin pages
        if (currentPath.startsWith('/admin')) {
            return {
                title: "⚙️ Admin Dashboard",
                subtitle: "Manage users, withdrawals, and settings",
                buttonText: "Settings",
                // buttonLink: "",
                icon: "⚙️"
            };
        }
        
        // Login page
        if (currentPath === '/login') {
            return {
                title: "🔐 Welcome Back",
                subtitle: "Login to continue your savings journey",
                buttonText: "Sign Up",
                // buttonLink: "",
                icon: "🔐"
            };
        }

          if (currentPath === '/privacy') {
            return {
                title: "🔐 Privacy Policy",
                subtitle:"Your privacy matters to us",
                buttonText: "privacy",
                buttonLink: "",
                icon: "🔐"
            };
        }
              
        // Register page
        if (currentPath === '/register') {
            return {
                title: "✨ Join TheSpark",
                subtitle: "Start your savings journey today",
                buttonText: "Login",
                // buttonLink: "",
                icon: "✨"
            };
        }
        
        // Home page (default)
        return {
            title: "🔥 TheSpark",
            subtitle: "Save daily, Grow, build wealth",
            buttonText: "Get Started",
            // buttonLink: "",
            icon: "🔥"
        };
    };
    
    // Hero section content based on page
    const getHeroContent = () => {
        if (currentPath === '/') {
            return {
                title: "TheSpark",
                subtitle: "Be the spark.",
                description: "One spark. One fire. One wealthy Nigeria.",
                buttonText: "Join TheSpark",
                // buttonLink: ""
            };
        }
        
        if (currentPath === '/premium') {
            return {
                title: "Premium Plans",
                subtitle: "Unlock higher earnings",
                description: "Get up to 10% interest per cycle with our premium plans",
                buttonText: "Compare Plans",
                // buttonLink: ""
            };
        }
        
        if (currentPath === '/referral') {
            return {
                title: "Refer & Earn",
                subtitle: "Invite friends, earn rewards",
                description: "Get ₦5,000 for every friend who joins and saves",
                buttonText: "Start Referring",
                // buttonLink: ""
            };
        }
        
        return {
            title: "TheSpark",
            subtitle: "Be the spark.",
            description: "One spark. One fire. One wealthy Nigeria.",
            buttonText: "Join TheSpark",
            // buttonLink: ""
        };
    };
    
    // Use custom values if provided, otherwise use intelligent detection
    const content = getPageContent();
    const heroContent = getHeroContent();
    
    const finalTitle = customTitle !== null ? customTitle : content.title;
    const finalSubtitle = customSubtitle !== null ? customSubtitle : content.subtitle;
    const finalButtonText = customButtonText !== null ? customButtonText : content.buttonText;
    const finalButtonLink = customButtonLink !== null ? customButtonLink : content.buttonLink;
    const finalIcon = customIcon !== null ? customIcon : content.icon;
    
    const finalHeroTitle = customHeroTitle !== null ? customHeroTitle : heroContent.title;
    const finalHeroSubtitle = customHeroSubtitle !== null ? customHeroSubtitle : heroContent.subtitle;
    const finalHeroDescription = customHeroDescription !== null ? customHeroDescription : heroContent.description;
    const finalHeroButtonText = customHeroButtonText !== null ? customHeroButtonText : heroContent.buttonText;
    const finalHeroButtonLink = customHeroButtonLink !== null ? customHeroButtonLink : heroContent.buttonLink;
    
    const ButtonComponent = onButtonClick ? 'button' : Link;
    const buttonProps = onButtonClick 
        ? { onClick: onButtonClick }
        : { to: finalButtonLink };
    
    // Hero section style - using card-primary class
    if (isHero) {
        return (
            <div className="card-primary spacer-xl" style={{ textAlign: 'center' }}>
                <h1 className="heading-1 text-white mb-4">{finalHeroTitle}</h1>
                <p className="hero-subtitle">{finalHeroSubtitle}</p>
                <p className="hero-description">{finalHeroDescription}</p>
                <Link to={finalHeroButtonLink} className="btn bg-white text-spark-500 hover:bg-gray-100">
                    {finalHeroButtonText}
                </Link>
            </div>
        );
    }
    
    // Default card style (compact header) - using card-primary class
    return (
        <div className="container card-primary" style={{ 
            padding: '0.75rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
        }}>
            <div>
                <div className="flex-row" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{finalIcon}</span>
                    <p className="text-white" style={{ fontSize: '0.8rem', fontWeight: '600', margin: 0 }}>
                        {finalTitle}
                    </p>
                </div>
                <p className="text-white" style={{ fontSize: '0.7rem', margin: '0.25rem 0 0 0', opacity: 0.9 }}>
                    {finalSubtitle}
                </p>
            </div>
            {showButton && (
                <ButtonComponent
                    {...buttonProps}
                    className="btn bg-white text-spark-500 hover:bg-gray-100"
                    style={{ 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        borderRadius: '2rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {finalButtonText}
                </ButtonComponent>
            )}
        </div>
    );
}