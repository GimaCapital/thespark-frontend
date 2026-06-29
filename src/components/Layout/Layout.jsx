// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import Footer from '../../components/Common/Footer';

// export default function Layout({ children }) {
//     const { user, userData, logout, isAdmin } = useAuth();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
//     const navigate = useNavigate();
//     const location = useLocation();
    
//     const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    
//     // Handle window resize
//     useEffect(() => {
//         const handleResize = () => {
//             setIsDesktop(window.innerWidth >= 768);
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
    
//     // Handle scroll for top navbar
//     useEffect(() => {
//         const handleScroll = () => {
//             setScrolled(window.scrollY > 10);
//         };
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);
    
//     // Handle body scroll when mobile menu is open
//     useEffect(() => {
//         if (isMobileMenuOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isMobileMenuOpen]);
    
//     // Close menu when route changes
//     useEffect(() => {
//         setIsMobileMenuOpen(false);
//     }, [location.pathname]);
    
//     const handleLogout = async () => {
//         await logout();
//         setIsMobileMenuOpen(false);
//         navigate('/');
//     };
    
//     // Hide bottom nav on these pages
//     const hideBottomNav = ['/login', '/register'].includes(location.pathname);
    
//     // ============ BOTTOM TAB BAR (Mobile - 5 main tabs) ============
//     const bottomTabs = [
//         { path: '/', icon: '🏠', label: 'Home', showAlways: true },
//         { path: '/dashboard', icon: '📊', label: 'Dashboard', showWhen: !!user },
//         { path: '/how-it-works', icon: '📚', label: 'Learn', showAlways: true },
//         { path: '/premium', icon: '⭐', label: 'Premium', showWhen: !!user },
//         { path: '/profile', icon: '👤', label: 'Profile', showAlways: true },
//     ];
    
//     // Filter tabs that should show
//     const visibleTabs = bottomTabs.filter(tab => 
//         tab.showAlways || (tab.showWhen !== undefined && tab.showWhen)
//     );
    
//     // ============ HAMBURGER MENU PAGES ============
//     const menuPages = [
//         { path: '/about', label: '📖 About Us', section: 'Main', showAlways: true },
//         { path: '/7-rules', label: '📚 7 Rules of Wealth', section: 'Main', showAlways: true },
//         { path: '/success-stories', label: '🌟 Success Stories', section: 'Main', showAlways: true },
//         { path: '/faq', label: '❓ FAQ', section: 'Main', showAlways: true },
//         { path: '/graduation', label: '🎓 Graduation', section: 'Account', showWhen: !!user && isGraduated },
//         { path: '/privacy', label: '🔒 Privacy Policy', section: 'Legal', showAlways: true },
//         { path: '/terms', label: '📜 Terms of Service', section: 'Legal', showAlways: true },
//         { path: '/admin', label: '⚙️ Admin Dashboard', section: 'Admin', showWhen: !!isAdmin },
//         { path: '/admin-management', label: '👥 Manage Admins', section: 'Admin', showWhen: !!isAdmin },
//         { path: '/hybrid-lending', label: '💰 Hybrid Lending', section: 'Admin', showWhen: !!isAdmin },
//     ];
    
//     const visibleMenuPages = menuPages.filter(page => 
//         page.showAlways || (page.showWhen !== undefined && page.showWhen)
//     );
    
//     const mainMenuPages = visibleMenuPages.filter(p => p.section === 'Main');
//     const accountMenuPages = visibleMenuPages.filter(p => p.section === 'Account');
//     const legalMenuPages = visibleMenuPages.filter(p => p.section === 'Legal');
//     const adminMenuPages = visibleMenuPages.filter(p => p.section === 'Admin');
    
//     const isActive = (path) => location.pathname === path;
    
//     // Animation styles
//     const animationStyles = `
//         @keyframes bounce {
//             0%, 100% { transform: translateY(0); }
//             50% { transform: translateY(-3px); }
//         }
        
//         @keyframes pulse {
//             0%, 100% { transform: scale(1); }
//             50% { transform: scale(1.05); }
//         }
        
//         @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//         }
        
//         @keyframes glow {
//             0% { text-shadow: 0 0 0px rgba(249, 115, 22, 0); }
//             50% { text-shadow: 0 0 10px rgba(249, 115, 22, 0.5); }
//             100% { text-shadow: 0 0 0px rgba(249, 115, 22, 0); }
//         }
        
//         .logo-fire {
//             animation: bounce 2s ease-in-out infinite, pulse 3s ease-in-out infinite;
//             display: inline-block;
//         }
        
//         .logo-text {
//             animation: glow 3s ease-in-out infinite;
//             transition: all 0.3s ease;
//         }
        
//         .logo-text:hover {
//             transform: scale(1.02);
//             letter-spacing: 1px;
//         }
        
//         .logo-container:hover .logo-fire {
//             animation: spin 0.5s ease-in-out, bounce 2s ease-in-out infinite;
//         }
        
//         @keyframes fireFlicker {
//             0% { transform: scale(1); opacity: 1; }
//             25% { transform: scale(1.1); opacity: 0.9; }
//             50% { transform: scale(1); opacity: 1; }
//             75% { transform: scale(1.05); opacity: 0.95; }
//             100% { transform: scale(1); opacity: 1; }
//         }
        
//         .mobile-logo-fire {
//             animation: fireFlicker 1.5s ease-in-out infinite;
//             display: inline-block;
//         }
//     `;
    
//     // ============ DESKTOP TOP NAVBAR ============
//     if (isDesktop) {
//         const desktopNavLinks = [
//             { path: '/about', label: 'About' },
//             { path: '/how-it-works', label: 'How It Works' },
//             { path: '/7-rules', label: '7 Rules' },
//             { path: '/success-stories', label: 'Stories' },
//             { path: '/faq', label: 'FAQ' },
//         ];
        
//         const desktopAuthLinks = [
//             { path: '/dashboard', label: 'Dashboard' },
//             { path: '/profile', icon: '👤', label: 'Profile', showAlways: true },
//             ...(isGraduated ? [{ path: '/graduation', label: 'Graduate' }] : []),
//             { path: '/premium', label: 'Premium' },
//             ...(isAdmin ? [
//                 { path: '/admin', label: 'Admin' },
//                 { path: '/admin-management', label: 'Manage' },
//                 { path: '/hybrid-lending', label: 'Lend' }
//             ] : [])
//         ];
        
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <style>{animationStyles}</style>
//                 <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
//                     <div className="nav-container">
//                         <div className="nav-flex">
//                             {/* Animated Logo */}
//                             <Link to="/" className="logo-container flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
//                                 <span className="logo-fire text-2xl transition-all duration-300 group-hover:scale-110">🔥</span>
//                                 <span className="logo logo-text text-xl font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
//                                     TheSpark
//                                 </span>
//                             </Link>
                            
//                             <div className="nav-desktop">
//                                 {desktopNavLinks.map(link => (
//                                     <Link key={link.path} to={link.path} className="nav-link">
//                                         {link.label}
//                                     </Link>
//                                 ))}
                                
//                                 {user ? (
//                                     <div className="nav-buttons">
//                                         {desktopAuthLinks.map(link => (
//                                             <Link key={link.path} to={link.path} className="nav-link">
//                                                 {link.label}
//                                             </Link>
//                                         ))}
//                                         <button onClick={handleLogout} className="nav-link-danger">
//                                             Logout
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <div className="nav-buttons">
//                                         <Link to="/login" className="nav-link">Login</Link>
//                                         <Link to="/register" className="signup-btn">Sign Up</Link>
//                                     </div>
//                                 )}
//                             </div>
                            
//                             <button
//                                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                                 className="mobile-menu-btn"
//                             >
//                                 <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-1' : ''}`}></span>
//                                 <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-2' : ''}`}></span>
//                                 <span className={`mobile-menu-line ${isMobileMenuOpen ? 'mobile-menu-line-open-3' : ''}`}></span>
//                             </button>
//                         </div>
//                     </div>
//                 </nav>
                
//                 {isMobileMenuOpen && (
//                     <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
//                         <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
//                             <div className="mobile-menu-section">
//                                 <p className="mobile-menu-title">Menu</p>
//                                 {desktopNavLinks.map(link => (
//                                     <Link
//                                         key={link.path}
//                                         to={link.path}
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                         className="mobile-menu-link"
//                                     >
//                                         {link.label}
//                                     </Link>
//                                 ))}
//                             </div>
                            
//                             {user ? (
//                                 <div>
//                                     <p className="mobile-menu-title">Account</p>
//                                     {desktopAuthLinks.map(link => (
//                                         <Link
//                                             key={link.path}
//                                             to={link.path}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="mobile-menu-link"
//                                         >
//                                             {link.label}
//                                         </Link>
//                                     ))}
//                                     <button onClick={handleLogout} className="mobile-menu-logout">
//                                         Logout
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="mobile-menu-auth">
//                                     <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-login">
//                                         Login
//                                     </Link>
//                                     <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-signup">
//                                         Sign Up
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
                
//                 <main className="main-content">
//                     {children}
//                 </main>
                
//                 <Footer />
//             </div>
//         );
//     }
    
//     // ============ MOBILE BOTTOM TAB BAR + HAMBURGER MENU ============
//     return (
//         <div className="min-h-screen bg-gray-50 pb-16">
//             <style>{animationStyles}</style>
//             {/* Top Bar with Hamburger Menu */}
//             <div className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-40 flex justify-between items-center">
//                 {/* Hamburger Menu Button */}
//                 <button
//                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                     className="w-10 h-10 flex flex-col justify-center items-center space-y-1.5 focus:outline-none"
//                 >
//                     <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
//                     <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
//                     <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
//                 </button>
                
//                 {/* Animated Logo - Centered */}
//                 <Link to="/" className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2 group" onClick={() => setIsMobileMenuOpen(false)}>
//                     <span className="mobile-logo-fire text-xl transition-all duration-300 group-hover:scale-110">🔥</span>
//                     <span className="logo text-lg font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
//                         TheSpark
//                     </span>
//                 </Link>
                
//                 {/* Empty placeholder for balance */}
//                 <div className="w-10"></div>
//             </div>
            
//             {/* Hamburger Menu Drawer */}
//             {isMobileMenuOpen && (
//                 <>
//                     <div 
//                         className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
//                         onClick={() => setIsMobileMenuOpen(false)}
//                     />
                    
//                     <div className="fixed top-0 left-0 bottom-0 z-30 w-80 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
//                         <div className="pt-16 pb-6">
//                             {/* User Profile Section */}
//                             {user ? (
//                                 <div className="px-6 pb-4 border-b border-gray-100">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-12 h-12 rounded-full bg-spark-500 flex items-center justify-center text-white font-bold text-xl">
//                                             {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold text-gray-800">{userData?.fullName}</p>
//                                             <p className="text-xs text-gray-500 mt-0.5">{userData?.email || userData?.phone}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="px-6 pb-4 border-b border-gray-100">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <span className="text-2xl animate-pulse">🔥</span>
//                                         <p className="text-gray-700 font-semibold">TheSpark</p>
//                                     </div>
//                                     <p className="text-gray-500 text-sm mb-3">Welcome to TheSpark</p>
//                                     <div className="flex gap-2">
//                                         <Link
//                                             to="/login"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="flex-1 text-center py-2 border border-spark-500 text-spark-500 rounded-lg text-sm"
//                                         >
//                                             Login
//                                         </Link>
//                                         <Link
//                                             to="/register"
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="flex-1 text-center py-2 bg-spark-500 text-white rounded-lg text-sm"
//                                         >
//                                             Sign Up
//                                         </Link>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {/* Main Menu Section */}
//                             {mainMenuPages.length > 0 && (
//                                 <div className="px-4 py-2">
//                                     <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Main Menu</p>
//                                     {mainMenuPages.map(page => (
//                                         <Link
//                                             key={page.path}
//                                             to={page.path}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
//                                         >
//                                             {page.label}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             )}
                            
//                             {/* Account Section */}
//                             {accountMenuPages.length > 0 && (
//                                 <div className="px-4 py-2">
//                                     <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Account</p>
//                                     {accountMenuPages.map(page => (
//                                         <Link
//                                             key={page.path}
//                                             to={page.path}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
//                                         >
//                                             {page.label}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             )}
                            
//                             {/* Legal Section */}
//                             {legalMenuPages.length > 0 && (
//                                 <div className="px-4 py-2">
//                                     <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Legal</p>
//                                     {legalMenuPages.map(page => (
//                                         <Link
//                                             key={page.path}
//                                             to={page.path}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
//                                         >
//                                             {page.label}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             )}
                            
//                             {/* Admin Section */}
//                             {adminMenuPages.length > 0 && (
//                                 <div className="px-4 py-2">
//                                     <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Admin</p>
//                                     {adminMenuPages.map(page => (
//                                         <Link
//                                             key={page.path}
//                                             to={page.path}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                             className="block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
//                                         >
//                                             {page.label}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             )}
                            
//                             {/* Logout button */}
//                             {user && (
//                                 <div className="px-6 pt-4 border-t border-gray-100 mt-4">
//                                     <button
//                                         onClick={handleLogout}
//                                         className="w-full text-left px-3 py-3 text-red-600 hover:bg-gray-100 rounded-lg transition"
//                                     >
//                                         Logout
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </>
//             )}
            
//             {/* Main Content */}
//             <main className="pt-16 pb-2">
//                 {children}
//             </main>
             
//             <Footer />
            
//             {/* Bottom Tab Bar */}
//             {!hideBottomNav && (
//                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
//                     {visibleTabs.map(tab => (
//                         <Link
//                             key={tab.path}
//                             to={tab.path}
//                             className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
//                                 isActive(tab.path) 
//                                     ? 'text-spark-500' 
//                                     : 'text-gray-500'
//                             }`}
//                         >
//                             <span className="text-2xl">{tab.icon}</span>
//                             <span className="text-xs mt-1">{tab.label}</span>
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

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
    const navigate = useNavigate();
    const location = useLocation();
    
    const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    
    // Helper function to scroll to top
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
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isLegalDropdownOpen, isMarketDropdownOpen]);
    
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
    }, [location.pathname]);
    
    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        navigate('/');
        scrollToTop();
    };
    
    // Hide bottom nav on these pages
    const hideBottomNav = ['/login', '/register'].includes(location.pathname);
    
    // ============ BOTTOM TAB BAR (Mobile - 5 main tabs) ============
    const bottomTabs = [
        { path: '/', icon: '🏠', label: 'Home', showAlways: true },
        { path: '/dashboard', icon: '📊', label: 'Dashboard', showWhen: !!user },
        { path: '/how-it-works', icon: '📚', label: 'Learn', showAlways: true },
        { path: '/marketplace', icon: '🛒', label: 'Market', showAlways: true },
        { path: '/profile', icon: '👤', label: 'Profile', showAlways: true },
    ];
    
    // Filter tabs that should show
    const visibleTabs = bottomTabs.filter(tab => 
        tab.showAlways || (tab.showWhen !== undefined && tab.showWhen)
    );
    
    // ============ HAMBURGER MENU PAGES ============
    const menuPages = [
        { path: '/about', label: '📖 About Us', section: 'Main', showAlways: true },
        { path: '/how-it-works', label: '📚 How It Works', section: 'Main', showAlways: true },
        { path: '/7-rules', label: '📚 7 Rules of Wealth', section: 'Main', showAlways: true },
        { path: '/success-stories', label: '🌟 Success Stories', section: 'Main', showAlways: true },
        { path: '/faq', label: '❓ FAQ', section: 'Main', showAlways: true },
        { path: '/graduation', label: '🎓 Graduation', section: 'Account', showWhen: !!user && isGraduated },
        { path: '/orders', label: '📦 My Orders', section: 'Account', showWhen: !!user },
        { path: '/privacy', label: '🔒 Privacy Policy', section: 'Legal', showAlways: true },
        { path: '/terms', label: '📜 Terms of Service', section: 'Legal', showAlways: true },
        { path: '/admin', label: '⚙️ Admin Dashboard', section: 'Admin', showWhen: !!isAdmin },
        { path: '/admin-management', label: '👥 Manage Admins', section: 'Admin', showWhen: !!isAdmin },
        { path: '/hybrid-lending', label: '💰 Hybrid Lending', section: 'Admin', showWhen: !!isAdmin },
    ];
    
    const visibleMenuPages = menuPages.filter(page => 
        page.showAlways || (page.showWhen !== undefined && page.showWhen)
    );
    
    const mainMenuPages = visibleMenuPages.filter(p => p.section === 'Main');
    const accountMenuPages = visibleMenuPages.filter(p => p.section === 'Account');
    const legalMenuPages = visibleMenuPages.filter(p => p.section === 'Legal');
    const adminMenuPages = visibleMenuPages.filter(p => p.section === 'Admin');
    
    const isActive = (path) => location.pathname === path;
    const isMarketActive = isActive('/marketplace') || isActive('/orders');
    
    // Animation styles with active live background
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
        
        /* Active Link Animation - Pulsing Background */
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
        
        /* Desktop Active Nav Link */
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
        
        /* Mobile Active Menu Item */
        .mobile-menu-link-active {
            background: linear-gradient(90deg, rgba(234, 88, 12, 0.1), transparent);
            border-left: 3px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite;
            font-weight: 600;
        }
        
        /* Bottom Tab Active */
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
        
        /* Legal Dropdown Styles */
        .legal-dropdown {
            position: relative;
        }
        
        .legal-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            min-width: 200px;
            overflow: hidden;
            z-index: 50;
            margin-top: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .legal-dropdown-item {
            display: block;
            padding: 10px 16px;
            color: #374151;
            font-size: 14px;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .legal-dropdown-item:hover {
            background-color: #fef3f2;
            color: #ea580c;
        }
        
        .legal-dropdown-item-active {
            background-color: #fef3f2;
            color: #ea580c;
            font-weight: 500;
            border-left: 3px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite;
        }
        
        .dropdown-arrow {
            transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.rotated {
            transform: rotate(180deg);
        }
        
        /* Market Dropdown Styles */
        .market-dropdown {
            position: relative;
        }
        
        .market-dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            min-width: 200px;
            overflow: hidden;
            z-index: 50;
            margin-top: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .market-dropdown-item {
            display: block;
            padding: 10px 16px;
            color: #374151;
            font-size: 14px;
            transition: all 0.2s ease;
            text-decoration: none;
        }
        
        .market-dropdown-item:hover {
            background-color: #fef3f2;
            color: #ea580c;
        }
        
        .market-dropdown-item-active {
            background-color: #fef3f2;
            color: #ea580c;
            font-weight: 500;
            border-left: 3px solid #ea580c;
            animation: activePulse 2s ease-in-out infinite;
        }
        
        .market-dropdown-divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 4px 12px;
        }
    `;
    
    // ============ DESKTOP TOP NAVBAR ============
    if (isDesktop) {
        const desktopNavLinks = [
            { path: '/about', label: 'About' },
            { path: '/how-it-works', label: 'How It Works' },
            { path: '/7-rules', label: '7 Rules' },
            { path: '/success-stories', label: 'Stories' },
            { path: '/faq', label: 'FAQ' },
        ];
        
        const desktopAuthLinks = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/profile', icon: '👤', label: 'Profile', showAlways: true },
            ...(isGraduated ? [{ path: '/graduation', label: 'Graduate' }] : []),
            { path: '/premium', label: 'Premium' },
            ...(isAdmin ? [
                { path: '/admin', label: 'Admin' },
                { path: '/admin-management', label: 'Manage' },
                { path: '/hybrid-lending', label: 'Lend' }
            ] : [])
        ];
        
        return (
            <div className="min-h-screen bg-gray-50">
                <style>{animationStyles}</style>
                <nav className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
                    <div className="nav-container">
                        <div className="nav-flex">
                            {/* Animated Logo with Full Image */}
                            <Link 
                                to="/" 
                                className="logo-container group" 
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    scrollToTop();
                                }}
                            >
                                <img 
                                    src="/icons/thespark-logo-full-flame-512x512.png" 
                                    
                                    alt="TheSpark" 
                                    className="logo-image"
                                />
                                <span className="logo-text text-xl font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
                                    TheSpark
                                </span>
                            </Link>
                            
                            <div className="nav-desktop">
                                {desktopNavLinks.map(link => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path} 
                                        className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                                        onClick={scrollToTop}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                
                                {/* Market Dropdown - Marketplace & Orders */}
                                <div className="market-dropdown relative inline-block">
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
                                        <div className="market-dropdown-menu">
                                            <Link 
                                                to="/marketplace" 
                                                className={`market-dropdown-item ${isActive('/marketplace') ? 'market-dropdown-item-active' : ''}`}
                                                onClick={() => {
                                                    setIsMarketDropdownOpen(false);
                                                    scrollToTop();
                                                }}
                                            >
                                                🛒 Marketplace
                                            </Link>
                                            {user && (
                                                <>
                                                    <div className="market-dropdown-divider"></div>
                                                    <Link 
                                                        to="/orders" 
                                                        className={`market-dropdown-item ${isActive('/orders') ? 'market-dropdown-item-active' : ''}`}
                                                        onClick={() => {
                                                            setIsMarketDropdownOpen(false);
                                                            scrollToTop();
                                                        }}
                                                    >
                                                        📦 My Orders
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Legal Dropdown - Privacy & Terms */}
                                <div className="legal-dropdown relative inline-block">
                                    <button
                                        onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
                                        className={`nav-link inline-flex items-center gap-1 ${isActive('/privacy') || isActive('/terms') ? 'nav-link-active' : ''}`}
                                    >
                                        Legal
                                        <svg 
                                            className={`dropdown-arrow w-3 h-3 ${isLegalDropdownOpen ? 'rotated' : ''}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {isLegalDropdownOpen && (
                                        <div className="legal-dropdown-menu">
                                            <Link 
                                                to="/privacy" 
                                                className={`legal-dropdown-item ${isActive('/privacy') ? 'legal-dropdown-item-active' : ''}`}
                                                onClick={() => {
                                                    setIsLegalDropdownOpen(false);
                                                    scrollToTop();
                                                }}
                                            >
                                                🔒 Privacy Policy
                                            </Link>
                                            <Link 
                                                to="/terms" 
                                                className={`legal-dropdown-item ${isActive('/terms') ? 'legal-dropdown-item-active' : ''}`}
                                                onClick={() => {
                                                    setIsLegalDropdownOpen(false);
                                                    scrollToTop();
                                                }}
                                            >
                                                📜 Terms of Service
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                
                                {user ? (
                                    <div className="nav-buttons flex items-center gap-2">
                                        {desktopAuthLinks.map(link => (
                                            <Link 
                                                key={link.path} 
                                                to={link.path} 
                                                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
                                                onClick={scrollToTop}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                        <button onClick={handleLogout} className="nav-link-danger">
                                            Logout
                                        </button>
                                        {/* Notification Bell */}
                                        <NotificationBell />
                                    </div>
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
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Menu</p>
                                {desktopNavLinks.map(link => (
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
                                <Link
                                    to="/marketplace"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className={`mobile-menu-link ${isActive('/marketplace') ? 'mobile-menu-link-active' : ''}`}
                                >
                                    🛒 Marketplace
                                </Link>
                                {user && (
                                    <Link
                                        to="/orders"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className={`mobile-menu-link ${isActive('/orders') ? 'mobile-menu-link-active' : ''}`}
                                    >
                                        📦 My Orders
                                    </Link>
                                )}
                            </div>
                            
                            <div className="mobile-menu-section">
                                <p className="mobile-menu-title">Legal</p>
                                <Link
                                    to="/privacy"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className={`mobile-menu-link ${isActive('/privacy') ? 'mobile-menu-link-active' : ''}`}
                                >
                                    🔒 Privacy Policy
                                </Link>
                                <Link
                                    to="/terms"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className={`mobile-menu-link ${isActive('/terms') ? 'mobile-menu-link-active' : ''}`}
                                >
                                    📜 Terms of Service
                                </Link>
                            </div>
                            
                            {user ? (
                                <div>
                                    <p className="mobile-menu-title">Account</p>
                                    {desktopAuthLinks.map(link => (
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
                                    <button onClick={handleLogout} className="mobile-menu-logout">
                                        Logout
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
    
    // ============ MOBILE BOTTOM TAB BAR + HAMBURGER MENU ============
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <style>{animationStyles}</style>
            {/* Top Bar with Hamburger Menu */}
            <div className="bg-white shadow-sm py-3 px-4 fixed top-0 left-0 right-0 z-40 flex justify-between items-center">
                {/* Hamburger Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex flex-col justify-center items-center space-y-1.5 focus:outline-none"
                >
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
                
                {/* Animated Logo with Full Image - Centered */}
                <Link 
                    to="/" 
                    className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2 group" 
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToTop();
                    }}
                >
                    <img 
                        src="/icons/thespark-logo-full-flame-512x512.png" 
                        alt="TheSpark" 
                        className="logo-image-mobile"
                    />
                    <span className="logo-text text-lg font-bold bg-gradient-to-r from-spark-500 to-spark-700 bg-clip-text text-transparent">
                        TheSpark
                    </span>
                    
                </Link>
                
                {/* Notification Bell for Mobile */}
                <div className="w-10 flex items-center justify-center">
                    <NotificationBell />
                </div>
            </div>
            
            {/* Hamburger Menu Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    <div className="fixed top-0 left-0 bottom-0 z-30 w-80 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
                        <div className="pt-16 pb-6">
                            {/* User Profile Section */}
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
                            
                            {/* Main Menu Section */}
                            {mainMenuPages.length > 0 && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Main Menu</p>
                                    {mainMenuPages.map(page => (
                                        <Link
                                            key={page.path}
                                            to={page.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(page.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {page.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* Legal Section */}
                            {legalMenuPages.length > 0 && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Legal</p>
                                    {legalMenuPages.map(page => (
                                        <Link
                                            key={page.path}
                                            to={page.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(page.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {page.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* Account Section */}
                            {accountMenuPages.length > 0 && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Account</p>
                                    {accountMenuPages.map(page => (
                                        <Link
                                            key={page.path}
                                            to={page.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(page.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {page.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* Admin Section */}
                            {adminMenuPages.length > 0 && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">Admin</p>
                                    {adminMenuPages.map(page => (
                                        <Link
                                            key={page.path}
                                            to={page.path}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className={`block px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition ${isActive(page.path) ? 'mobile-menu-link-active' : ''}`}
                                        >
                                            {page.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            
                            {/* Logout button */}
                            {user && (
                                <div className="px-6 pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-3 text-red-600 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            
            {/* Main Content */}
            <main className="pt-16 pb-2">
                {children}
            </main>
             
            <Footer />
            
            {/* Bottom Tab Bar with Active Animation */}
            {!hideBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
                    {visibleTabs.map(tab => (
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