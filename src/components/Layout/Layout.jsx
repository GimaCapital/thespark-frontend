import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/Common/Footer';
import NotificationBell from '../../components/NotificationBell';

export default function Layout({ children }) {
    const { user, userData, logout, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);
    const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
    const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);
    const [isPlansDropdownOpen, setIsPlansDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    const userPlan = userData?.premiumPlan || 'Basic';

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isLegalDropdownOpen && !event.target.closest('.legal-dropdown')) {
                setIsLegalDropdownOpen(false);
            }
            if (isMarketDropdownOpen && !event.target.closest('.market-dropdown')) {
                setIsMarketDropdownOpen(false);
            }
            if (isLearnDropdownOpen && !event.target.closest('.learn-dropdown')) {
                setIsLearnDropdownOpen(false);
            }
            if (isPlansDropdownOpen && !event.target.closest('.plans-dropdown')) {
                setIsPlansDropdownOpen(false);
            }
            if (isAccountDropdownOpen && !event.target.closest('.account-dropdown')) {
                setIsAccountDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [
        isLegalDropdownOpen,
        isMarketDropdownOpen,
        isLearnDropdownOpen,
        isPlansDropdownOpen,
        isAccountDropdownOpen,
    ]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle scroll for top navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsLegalDropdownOpen(false);
        setIsMarketDropdownOpen(false);
        setIsLearnDropdownOpen(false);
        setIsPlansDropdownOpen(false);
        setIsAccountDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        navigate('/');
        scrollToTop();
    };

    const hideBottomNav = ['/login', '/register'].includes(location.pathname);
    const isActive = (path) => location.pathname === path;

    // ============ NAV GROUPS ============
    const learnLinks = [
        { path: '/about', label: '📖 About Us' },
        { path: '/how-it-works', label: '📚 How It Works' },
        { path: '/7-rules', label: '📚 7 Rules of Wealth' },
        { path: '/success-stories', label: '🌟 Success Stories' },
        { path: '/faq', label: '❓ FAQ' },
    ];

    const marketLinks = [
        { path: '/marketplace', label: '🛒 Marketplace', showAlways: true },
        { path: '/orders', label: '📦 My Orders', showWhen: !!user },
    ];

    const plansLinks = [
        { path: '/premium', label: '💎 Pricing', showAlways: true },
        {
            path: '/premium',
            label: '⬆️ Upgrade Plan',
            showWhen: !!user && userPlan === 'Basic',
        },
        {
            path: '/premium',
            label: '💎 Manage Plan',
            showWhen: !!user && userPlan !== 'Basic',
        },
    ];

    const accountLinks = [
        { path: '/dashboard', label: '📊 Dashboard', showWhen: !!user },
        { path: '/profile', label: '👤 Profile', showWhen: !!user },
        { path: '/orders', label: '📦 My Orders', showWhen: !!user },
        { path: '/graduation', label: '🎓 Graduation', showWhen: !!user && isGraduated },
    ];

    const legalLinks = [
        { path: '/privacy', label: '🔒 Privacy Policy' },
        { path: '/terms', label: '📜 Terms of Service' },
    ];

    const adminLinks = [
        { path: '/admin', label: '⚙️ Admin Dashboard' },
        { path: '/admin-management', label: '👥 Manage Admins' },
        { path: '/hybrid-lending', label: '💰 Hybrid Lending' },
    ];

    const isLearnActive = learnLinks.some((l) => isActive(l.path));
    const isMarketActive = isActive('/marketplace') || isActive('/orders');
    const isPlansActive = isActive('/premium');
    const isAccountActive = accountLinks.some((l) => l.showWhen && isActive(l.path));

    // ============ BOTTOM TAB BAR (Mobile) ============
    const bottomTabs = [
        { path: '/', icon: '🏠', label: 'Home', showAlways: true },
        { path: '/dashboard', icon: '📊', label: 'Dashboard', showWhen: !!user },
        { path: '/how-it-works', icon: '📚', label: 'Learn', showAlways: true },
        { path: '/marketplace', icon: '🛒', label: 'Market', showAlways: true },
        { path: '/profile', icon: '👤', label: 'Profile', showAlways: true },
    ];

    const visibleTabs = bottomTabs.filter(
        (tab) => tab.showAlways || (tab.showWhen !== undefined && tab.showWhen)
    );

    // ============ ANIMATION STYLES ============
    const animationStyles = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes glow {
            0% { text-shadow: 0 0 0px rgba(249, 115, 22, 0); }
            50% { text-shadow: 0 0 10px rgba(249, 115, 22, 0.5); }
            100% { text-shadow: 0 0 0px rgba(249, 115, 22, 0); }
        }
        
        @keyframes activePulse {
            0% { background-color: rgba(234, 88, 12, 0.05); border-color: #ea580c; }
            50% { background-color: rgba(234, 88, 12, 0.15); border-color: #f97316; }
            100% { background-color: rgba(234, 88, 12, 0.05); border-color: #ea580c; }
        }
        
        @keyframes activeGlow {
            0% { box-shadow: 0 0 0px rgba(234, 88, 12, 0.3); }
            50% { box-shadow: 0 0 12px rgba(234, 88, 12, 0.6); }
            100% { box-shadow: 0 0 0px rgba(234, 88, 12, 0.3); }
        }
        
        .nav-link-active {
            background: linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(249, 115, 22, 0.05));
            border-bottom: 2px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite, activeGlow 2s ease-in-out infinite;
            position: relative;
        }
        
        .nav-link-active::before {
            content: '🔥';
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            opacity: 0.7;
            animation: bounce 1s ease-in-out infinite;
        }
        
        .mobile-menu-link-active {
            background: linear-gradient(90deg, rgba(234, 88, 12, 0.1), transparent);
            border-left: 3px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite;
            font-weight: 600;
        }
        
        .bottom-tab-active {
            background: linear-gradient(135deg, #ea580c, #f97316);
            color: white !important;
            animation: activeGlow 2s ease-in-out infinite;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
        }
        
        .bottom-tab-active span:first-child {
            animation: bounce 1s ease-in-out infinite;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .logo-image {
            height: 32px;
            width: auto;
            transition: all 0.3s ease;
        }
        
        .logo-image:hover {
            transform: scale(1.05);
        }
        
        .logo-image-mobile {
            height: 24px;
            width: auto;
            transition: all 0.3s ease;
        }
        
        .logo-image-mobile:hover {
            transform: scale(1.05);
        }
        
        .logo-text {
            animation: glow 3s ease-in-out infinite;
            transition: all 0.3s ease;
        }
        
        .logo-text:hover {
            transform: scale(1.02);
            letter-spacing: 1px;
        }
        
        .logo-container:hover .logo-image {
            animation: spin 0.5s ease-in-out;
        }
        
        @keyframes fireFlicker {
            0% { transform: scale(1); opacity: 1; }
            25% { transform: scale(1.05); opacity: 0.9; }
            50% { transform: scale(1); opacity: 1; }
            75% { transform: scale(1.02); opacity: 0.95; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .logo-image-mobile {
            animation: fireFlicker 2s ease-in-out infinite;
        }
        
        .nav-dropdown {
            position: relative;
        }
        
        .nav-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            min-width: 220px;
            overflow: hidden;
            z-index: 50;
            margin-top: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .nav-dropdown-item {
            display: block;
            padding: 10px 16px;
            color: #374151;
            font-size: 14px;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .nav-dropdown-item:hover {
            background-color: #fef3f2;
            color: #ea580c;
        }
        
        .nav-dropdown-item-active {
            background-color: #fef3f2;
            color: #ea580c;
            font-weight: 500;
            border-left: 3px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite;
        }
        
        .nav-dropdown-divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 4px 12px;
        }
        
        .dropdown-arrow {
            transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.rotated {
            transform: rotate(180deg);
        }
    `;

    // ============ DESKTOP TOP NAVBAR ============
    if (isDesktop) {
        return (
            <div className="min-h-screen bg-gray-50">
                <style>{animationStyles}</style>
                <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
                    <div className="nav-container">
                        <div className="nav-flex">
                            <Link
                                to="/"
                                className="logo-container group"
                                onClick={scrollToTop}
                            >
                                <img
                                    src="/icons/thespark-logo-1024x1024.png"
                                    alt="TheSpark"
                                    className="logo-image"
                                />
                                <span className="logo-text text-xl font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
                                    TheSpark
                                </span>
                            </Link>

                            <div className="nav-desktop">
                                {/* Home */}
                                <Link
                                    to="/"
                                    className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
                                    onClick={scrollToTop}
                                >
                                    Home
                                </Link>

                                {/* Learn Dropdown */}
                                <div className="nav-dropdown learn-dropdown">
                                    <button
                                        onClick={() => setIsLearnDropdownOpen(!isLearnDropdownOpen)}
                                        className={`nav-link inline-flex items-center gap-1 ${isLearnActive ? 'nav-link-active' : ''}`}
                                    >
                                        Learn
                                        <svg
                                            className={`dropdown-arrow w-3 h-3 ${isLearnDropdownOpen ? 'rotated' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isLearnDropdownOpen && (
                                        <div className="nav-dropdown-menu">
                                            {learnLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    className={`nav-dropdown-item ${isActive(link.path) ? 'nav-dropdown-item-active' : ''}`}
                                                    onClick={() => {
                                                        setIsLearnDropdownOpen(false);
                                                        scrollToTop();
                                                    }}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Market Dropdown */}
                                <div className="nav-dropdown market-dropdown">
                                    <button
                                        onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                                        className={`nav-link inline-flex items-center gap-1 ${isMarketActive ? 'nav-link-active' : ''}`}
                                    >
                                        Market
                                        <svg
                                            className={`dropdown-arrow w-3 h-3 ${isMarketDropdownOpen ? 'rotated' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isMarketDropdownOpen && (
                                        <div className="nav-dropdown-menu">
                                            {marketLinks
                                                .filter((l) => l.showAlways || l.showWhen)
                                                .map((link) => (
                                                    <Link
                                                        key={link.path}
                                                        to={link.path}
                                                        className={`nav-dropdown-item ${isActive(link.path) ? 'nav-dropdown-item-active' : ''}`}
                                                        onClick={() => {
                                                            setIsMarketDropdownOpen(false);
                                                            scrollToTop();
                                                        }}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {/* Plans Dropdown */}
                                <div className="nav-dropdown plans-dropdown">
                                    <button
                                        onClick={() => setIsPlansDropdownOpen(!isPlansDropdownOpen)}
                                        className={`nav-link inline-flex items-center gap-1 ${isPlansActive ? 'nav-link-active' : ''}`}
                                    >
                                        Plans
                                        <svg
                                            className={`dropdown-arrow w-3 h-3 ${isPlansDropdownOpen ? 'rotated' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isPlansDropdownOpen && (
                                        <div className="nav-dropdown-menu">
                                            {plansLinks
                                                .filter((l) => l.showAlways || l.showWhen)
                                                .map((link, i) => (
                                                    <Link
                                                        key={`${link.path}-${i}`}
                                                        to={link.path}
                                                        className={`nav-dropdown-item ${isActive(link.path) ? 'nav-dropdown-item-active' : ''}`}
                                                        onClick={() => {
                                                            setIsPlansDropdownOpen(false);
                                                            scrollToTop();
                                                        }}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                {user ? (
                                    <>
                                        {/* Account Dropdown */}
                                        <div className="nav-dropdown account-dropdown">
                                            <button
                                                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                                className={`nav-link inline-flex items-center gap-1 ${isAccountActive ? 'nav-link-active' : ''}`}
                                            >
                                                Account
                                                <svg
                                                    className={`dropdown-arrow w-3 h-3 ${isAccountDropdownOpen ? 'rotated' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {isAccountDropdownOpen && (
                                                <div className="nav-dropdown-menu">
                                                    {accountLinks
                                                        .filter((l) => l.showWhen)
                                                        .map((link) => (
                                                            <Link
                                                                key={link.path}
                                                                to={link.path}
                                                                className={`nav-dropdown-item ${isActive(link.path) ? 'nav-dropdown-item-active' : ''}`}
                                                                onClick={() => {
                                                                    setIsAccountDropdownOpen(false);
                                                                    scrollToTop();
                                                                }}
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        ))}
                                                    <div className="nav-dropdown-divider"></div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="nav-dropdown-item text-red-600 hover:bg-red-50 w-full text-left"
                                                    >
                                                        🚪 Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Notification Bell */}
                                        <div className="ml-2 flex items-center">
                                            <NotificationBell />
                                        </div>
                                    </>
                                ) : (
                                    <div className="nav-buttons">
                                        <Link
                                            to="/login"
                                            className={`nav-link ${isActive('/login') ? 'nav-link-active' : ''}`}
                                            onClick={scrollToTop}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="signup-btn"
                                            onClick={scrollToTop}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="mobile-menu-btn"
                            >
                                <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-1' : ''}`}></span>
                                <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-2' : ''}`}></span>
                                <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-3' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                </nav>

                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
                            {/* Learn */}
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Learn</p>
                                {learnLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Market */}
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Market</p>
                                {marketLinks
                                    .filter((l) => l.showAlways || l.showWhen)
                                    .map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                            </div>

                            {/* Plans */}
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Plans</p>
                                {plansLinks
                                    .filter((l) => l.showAlways || l.showWhen)
                                    .map((link, i) => (
                                        <Link
                                            key={`${link.path}-${i}`}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                            </div>

                            {/* Account (only if logged in) */}
                            {user && (
                                <div className="mobile-menu-section">
                                    <p className="mobile-menu-title">Account</p>
                                    {accountLinks
                                        .filter((l) => l.showWhen)
                                        .map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    scrollToTop();
                                                }}
                                                className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                </div>
                            )}

                            {/* Legal */}
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Legal</p>
                                {legalLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Admin */}
                            {isAdmin && (
                                <div className="mobile-menu-section">
                                    <p className="mobile-menu-title">Admin</p>
                                    {adminLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`mobile-menu-link ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Auth */}
                            {user ? (
                                <div className="mobile-menu-section">
                                    <button onClick={handleLogout} className="mobile-menu-logout">
                                        🚪 Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="mobile-menu-auth">
                                    <Link
                                        to="/login"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`mobile-menu-login ${isActive('/login') ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className="mobile-menu-signup"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <main className="main-content">
                    {children}
                </main>

                <Footer />
            </div>
        );
    }

    // ============ MOBILE ============
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <style>{animationStyles}</style>

            {/* Top bar with hamburger */}
            <div className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-40 flex justify-between items-center">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex flex-col justify-center items-center space-y-1.5 focus:outline-none"
                >
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                <Link
                    to="/"
                    className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2 group"
                    onClick={scrollToTop}
                >
                    <img
                        src="/icons/thespark-logo-1024x1024.png"
                        alt="TheSpark"
                        className="logo-image-mobile"
                    />
                    <span className="logo-text text-lg font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
                        TheSpark
                    </span>
                </Link>

                <div className="w-10 flex items-center justify-center">
                    <NotificationBell />
                </div>
            </div>

            {/* Mobile drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="fixed top-0 left-0 bottom-0 z-30 w-80 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
                        <div className="pt-16 pb-6">
                            {/* User profile */}
                            {user ? (
                                <div className="px-6 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-spark-500 flex items-center justify-center text-white font-bold text-xl">
                                            {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{userData?.fullName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{userData?.email || userData?.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-6 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img
                                            src="/icons/thespark-logo-192x192.png"
                                            alt="TheSpark"
                                            className="h-8 w-auto"
                                        />
                                        <p className="text-gray-700 font-semibold">TheSpark</p>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-3">Welcome to TheSpark</p>
                                    <div className="flex gap-2">
                                        <Link
                                            to="/login"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className="flex-1 text-center py-2 border border-spark-500 text-spark-500 rounded-lg text-sm"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className="flex-1 text-center py-2 bg-spark-500 text-white rounded-lg text-sm"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Learn */}
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Learn</p>
                                {learnLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Market */}
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Market</p>
                                {marketLinks
                                    .filter((l) => l.showAlways || l.showWhen)
                                    .map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                            </div>

                            {/* Plans */}
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Plans</p>
                                {plansLinks
                                    .filter((l) => l.showAlways || l.showWhen)
                                    .map((link, i) => (
                                        <Link
                                            key={`${link.path}-${i}`}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                            </div>

                            {/* Account */}
                            {user && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Account</p>
                                    {accountLinks
                                        .filter((l) => l.showWhen)
                                        .map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    scrollToTop();
                                                }}
                                                className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                </div>
                            )}

                            {/* Legal */}
                            <div className="px-4 py-2">
                                <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Legal</p>
                                {legalLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Admin */}
                            {isAdmin && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Admin</p>
                                    {adminLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(link.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Logout */}
                            {user && (
                                <div className="px-6 pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-3 text-red-600 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <main className="pt-16 pb-2">
                {children}
            </main>

            <Footer />

            {/* Bottom tab bar */}
            {!hideBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
                    {visibleTabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            onClick={scrollToTop}
                            className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                                isActive(tab.path)
                                    ? 'bottom-tab-active'
                                    : 'text-gray-500'
                            }`}
                        >
                            <span className="text-2xl">{tab.icon}</span>
                            <span className="text-xs mt-1">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}