// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';

// export default function Profile() {
//     const { userData, refreshUserData, logout, isAdmin } = useAuth();
//     const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    
//     // Refresh data when page loads
//     useEffect(() => {
//         refreshUserData();
//     }, []);
    
//     const handleLogout = async () => {
//         await logout();
//         toast.success('Logged out successfully');
//     };
    
//     const copyReferralCode = () => {
//         if (userData?.referralCode) {
//             navigator.clipboard.writeText(userData.referralCode);
//             toast.success('Referral code copied!');
//         }
//     };
    
//     const getInitials = (name) => {
//         if (!name) return '👤';
//         return name.charAt(0).toUpperCase();
//     };
    
//     if (!userData) {
//         return (
//             <div className="flex-center h-64">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }
    
//     const menuItems = [
//         { icon: '📖', label: '7 Rules of Wealth', subtext: 'Learn the principles', link: '/7-rules', showAlways: true },
//         { icon: '🌟', label: 'Success Stories', subtext: 'Read inspiring stories', link: '/success-stories', showAlways: true },
//         { icon: '❓', label: 'FAQ', subtext: 'Frequently asked questions', link: '/faq', showAlways: true },
//         { icon: '⭐', label: 'Premium Plans', subtext: 'Upgrade for better rates', link: '/premium', showWhen: !!userData },
//         { icon: '🎓', label: 'Graduation', subtext: 'View your certificate', link: '/graduation', showWhen: !!userData && isGraduated },
//     ];
    
//     const adminItems = [
//         { icon: '⚙️', label: 'Admin Dashboard', link: '/admin' },
//         { icon: '👥', label: 'Manage Admins', link: '/admin-management' },
//         { icon: '💰', label: 'Hybrid Lending', link: '/hybrid-lending' },
//     ];
    
//     const visibleMenuItems = menuItems.filter(item => 
//         item.showAlways || (item.showWhen !== undefined && item.showWhen)
//     );
    
//     return (
//         <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '5rem' }}>
//             {/* Profile Header */}
//             <div className="profile-header">
//                 <div className="flex-center">
//                     <div className="profile-avatar-large">
//                         {userData?.photoURL ? (
//                             <img src={userData.photoURL} alt={userData.fullName} />
//                         ) : (
//                             <span>{getInitials(userData?.fullName)}</span>
//                         )}
//                     </div>
//                 </div>
//                 <div className="text-center">
//                     <h2 className="profile-name">{userData?.fullName || 'Spark Member'}</h2>
//                     <p className="profile-phone">{userData?.email || userData?.phone}</p>
//                     {userData?.premiumPlan && userData.premiumPlan !== 'Basic' && (
//                         <span className="profile-badge">⭐ {userData.premiumPlan} Member</span>
//                     )}
//                 </div>
//             </div>
            
//             {/* Stats Card */}
//             <div className="profile-stats-card">
//                 <div>
//                     <div className="profile-stat-value">₦{userData?.currentBalance?.toLocaleString() || 0}</div>
//                     <div className="profile-stat-label">Balance</div>
//                 </div>
//                 <div>
//                     <div className="profile-stat-value">Cycle {userData?.currentCycle || 1}</div>
//                     <div className="profile-stat-label">Current Cycle</div>
//                 </div>
//                 <div>
//                     <div className="profile-stat-value">Day {userData?.currentDay || 1}</div>
//                     <div className="profile-stat-label">Current Day</div>
//                 </div>
//             </div>
            
//             <div className="profile-content">
//                 {/* Account Info Section */}
//                 <div className="card" style={{ marginBottom: '1rem' }}>
//                     <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
//                         <span style={{ fontWeight: '600', color: '#1F2937' }}>Account Info</span>
//                         <span style={{ fontSize: '0.7rem', color: '#F97316' }}>Member since {userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString() : 'Recent'}</span>
//                     </div>
//                     <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
//                         <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
//                             <span>Total Saved</span>
//                             <span style={{ fontWeight: '600', color: '#1F2937' }}>₦{userData?.totalPrincipalSaved?.toLocaleString() || 0}</span>
//                         </div>
//                         <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
//                             <span>Interest Earned</span>
//                             <span style={{ fontWeight: '600', color: '#10B981' }}>₦{userData?.totalInterestEarned?.toLocaleString() || 0}</span>
//                         </div>
//                         <div className="flex-between">
//                             <span>Interest Rate</span>
//                             <span style={{ fontWeight: '600', color: '#F97316' }}>{userData?.premiumInterestRate || 5}% per 21 days</span>
//                         </div>
//                     </div>
//                 </div>
                
//                 {/* Referral Code Card */}
//                 <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
//                     <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.5rem' }}>Your Referral Code</div>
//                     <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F97316', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
//                         {userData?.referralCode || 'SPARK'}
//                     </div>
//                     <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.75rem' }}>
//                         Share your code. Get ₦500 when they join!
//                     </div>
//                     <button onClick={copyReferralCode} className="btn btn-primary btn-sm btn-full">
//                         Copy Referral Code
//                     </button>
//                 </div>
                
//                 {/* Menu Items */}
//                 {visibleMenuItems.map((item, index) => (
//                     <Link key={index} to={item.link} style={{ textDecoration: 'none' }}>
//                         <div className="profile-menu-item">
//                             <div className="profile-menu-left">
//                                 <div className="profile-menu-icon">{item.icon}</div>
//                                 <div>
//                                     <div className="profile-menu-text">{item.label}</div>
//                                     {item.subtext && <div className="profile-menu-subtext">{item.subtext}</div>}
//                                 </div>
//                             </div>
//                             <div className="profile-menu-arrow">›</div>
//                         </div>
//                     </Link>
//                 ))}
                
//                 <div className="profile-divider"></div>
                
//                 {/* Admin Section */}
//                 {isAdmin && (
//                     <>
//                         {adminItems.map((item, index) => (
//                             <Link key={index} to={item.link} style={{ textDecoration: 'none' }}>
//                                 <div className="profile-menu-item">
//                                     <div className="profile-menu-left">
//                                         <div className="profile-menu-icon">{item.icon}</div>
//                                         <div>
//                                             <div className="profile-menu-text">{item.label}</div>
//                                         </div>
//                                     </div>
//                                     <div className="profile-menu-arrow">›</div>
//                                 </div>
//                             </Link>
//                         ))}
//                         <div className="profile-divider"></div>
//                     </>
//                 )}
                
//                 {/* Logout Button */}
//                 <div onClick={handleLogout} className="profile-logout">
//                     <span>🚪</span>
//                     <span>Logout</span>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';

// 🎯 COMPLETELY DYNAMIC - No hardcoded bank names!
const getBankIcon = (bankName) => {
    if (!bankName) return '🏛️';
    
    let hash = 0;
    const cleanName = bankName.toLowerCase().replace(/\s/g, '');
    for (let i = 0; i < cleanName.length; i++) {
        hash = (hash + cleanName.charCodeAt(i) * (i + 1)) % 8;
    }
    
    const icons = ['🏛️', '🏦', '💳', '📱', '💰', '🏪', '💼', '📈'];
    return icons[hash];
};

export default function Profile() {
    const { userData, refreshUserData, logout, isAdmin } = useAuth();
    const [bankAccount, setBankAccount] = useState(null);
    const [loadingBank, setLoadingBank] = useState(true);
    const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    
    useEffect(() => {
        refreshUserData();
        loadBankAccount();
    }, []);

    const loadBankAccount = async () => {
        setLoadingBank(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/bank-account');
            if (response.data.hasAccount) {
                setBankAccount(response.data);
            }
        } catch (error) {
            console.error('Failed to load bank account:', error);
        } finally {
            setLoadingBank(false);
        }
    };
    
    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
    };
    
    const copyReferralCode = () => {
        if (userData?.referralCode) {
            navigator.clipboard.writeText(userData.referralCode);
            toast.success('Referral code copied!');
        }
    };

    const handleRemoveBank = async () => {
        if (!window.confirm('Are you sure you want to remove your bank account?')) return;

        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.delete('/users/bank-account');
            toast.success('Bank account removed');
            setBankAccount(null);
        } catch (error) {
            toast.error('Failed to remove bank account');
        }
    };
    
    const getInitials = (name) => {
        if (!name) return '👤';
        return name.charAt(0).toUpperCase();
    };
    
    // Get badge based on premium plan
    const getBadge = () => {
        const plan = userData?.premiumPlan || 'Basic';
        
        switch (plan) {
            case 'Basic':
                return { text: 'Basic Member', icon: '🌟', color: 'bg-green-100 text-green-700' };
            case 'Premium':
                return { text: 'Premium Member', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' };
            case 'Investor':
                return { text: 'Investor Member', icon: '💎', color: 'bg-purple-100 text-purple-700' };
            default:
                return { text: 'Basic Member', icon: '🌟', color: 'bg-green-100 text-green-700' };
        }
    };
    
    const badge = getBadge();
    
    if (!userData) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }
    
    const menuItems = [
        { icon: '📖', label: '7 Rules of Wealth', subtext: 'Learn the principles', link: '/7-rules', showAlways: true },
        { icon: '🌟', label: 'Success Stories', subtext: 'Read inspiring stories', link: '/success-stories', showAlways: true },
        { icon: '❓', label: 'FAQ', subtext: 'Frequently asked questions', link: '/faq', showAlways: true },
        { icon: '⭐', label: 'Premium Plans', subtext: 'Upgrade for better rates', link: '/premium', showWhen: !!userData },
        { icon: '🎓', label: 'Graduation', subtext: 'View your certificate', link: '/graduation', showWhen: !!userData && isGraduated },
        { icon: '📊', label: 'Transaction History', subtext: 'View all your transactions', link: '/transactions', showAlways: true },
        { icon: '📊', label: ' Manage Bank Account →', subtext: 'View your bank account details', link: '/bank-account', showAlways: true },
    ];
    
    const adminItems = [
        { icon: '⚙️', label: 'Admin Dashboard', link: '/admin' },
        { icon: '👥', label: 'Manage Admins', link: '/admin-management' },
        { icon: '💰', label: 'Hybrid Lending', link: '/hybrid-lending' },
    ];
    
    const visibleMenuItems = menuItems.filter(item => 
        item.showAlways || (item.showWhen !== undefined && item.showWhen)
    );
    
    return (
        <div className='container' style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '5rem' }}>

            {/* Profile Header */}
            <div className="profile-header">
                <div className="flex-center">
                    <div className="profile-avatar-large">
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt={userData.fullName} />
                        ) : (
                            <span>{getInitials(userData?.fullName)}</span>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="profile-name">{userData?.fullName || 'Spark Member'}</h2>
                    <p className="profile-phone">{userData?.email || userData?.phone}</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color} mt-2`}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                    </span>
                </div>
            </div>
            
            {/* Stats Card */}
            <div className="profile-stats-card">
                <div>
                    <div className="profile-stat-value">₦{userData?.currentBalance?.toLocaleString() || 0}</div>
                    <div className="profile-stat-label">Balance</div>
                </div>
                <div>
                    <div className="profile-stat-value">Cycle {userData?.currentCycle || 1}</div>
                    <div className="profile-stat-label">Current Cycle</div>
                </div>
                <div>
                    <div className="profile-stat-value">Day {userData?.currentDay || 1}</div>
                    <div className="profile-stat-label">Current Day</div>
                </div>
            </div>
            
            <div className="profile-content">
                {/* ============ BANK ACCOUNT SECTION ============ */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#1F2937' }}>🏦 Bank Account</span>
                        <span style={{ fontSize: '0.7rem', color: bankAccount ? '#10B981' : '#F97316' }}>
                            {loadingBank ? 'Loading...' : (bankAccount ? 'Verified ✓' : 'Not set')}
                        </span>
                    </div>
                    
                    {loadingBank ? (
                        <div className="text-center py-3">
                            <div className="spinner-sm"></div>
                        </div>
                    ) : bankAccount ? (
                        <>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <span>Bank</span>
                                    <span style={{ fontWeight: '600', color: '#1F2937' }}>
                                        {getBankIcon(bankAccount.bankName)} {bankAccount.bankName}
                                    </span>
                                </div>
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <span>Account Number</span>
                                    <span style={{ fontWeight: '600', color: '#1F2937', fontFamily: 'monospace' }}>
                                        {bankAccount.accountNumber}
                                    </span>
                                </div>
                                <div className="flex-between">
                                    <span>Account Name</span>
                                    <span style={{ fontWeight: '600', color: '#1F2937' }}>
                                        {bankAccount.accountName}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                <Link
                                    to="/bank-account"
                                    style={{
                                        flex: 1,
                                        fontSize: '0.75rem',
                                        color: '#F97316',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        padding: '0.4rem 0.5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#FFF7ED',
                                        textAlign: 'center'
                                    }}
                                >
                                    Manage Bank Account →
                                </Link>
                                <button
                                    onClick={handleRemoveBank}
                                    style={{
                                        fontSize: '0.7rem',
                                        color: '#EF4444',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: '#FEE2E2'
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                No bank account added yet
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                                Add your bank account to receive withdrawals
                            </p>
                            <Link
                                to="/bank-account"
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#F97316',
                                    fontWeight: '600',
                                    textDecoration: 'none'
                                }}
                            >
                                + Add Bank Account →
                            </Link>
                        </>
                    )}
                </div>
                
                {/* Account Info Section */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#1F2937' }}>Account Info</span>
                        <span style={{ fontSize: '0.7rem', color: '#F97316' }}>
                            Member since {userData?.joinDate ? formatDate(userData.joinDate) : 'Recent'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span>Total Saved</span>
                            <span style={{ fontWeight: '600', color: '#1F2937' }}>₦{userData?.totalPrincipalSaved?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span>Interest Earned</span>
                            <span style={{ fontWeight: '600', color: '#10B981' }}>₦{userData?.totalInterestEarned?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex-between">
                            <span>Interest Rate</span>
                            <span style={{ fontWeight: '600', color: '#F97316' }}>{userData?.premiumInterestRate || 5}% per cycle</span>
                        </div>
                    </div>
                </div>
                
                {/* Referral Code Card */}
            <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.5rem' }}>Your Referral Code</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F97316', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        {userData?.referralCode || 'SPARK'}
    </div>
    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.75rem' }}>
        Share your code. Get ₦500 when they join!
    </div>
    <button 
        onClick={() => {
            const referralCode = userData?.referralCode || 'SPARK';
            const link = `${window.location.origin}/register?ref=${referralCode}`;
            const message = `🔥 Join me on TheSpark — the wealth-building platform that teaches Nigerians how to save, grow, and achieve financial freedom!

💰 Start with as little as ₦100/day
📈 Track your progress every 21-day cycle
🎓 Graduate in 6 months with real wealth skills
🤝 Earn ₦500 when your friends join

Use my referral link to sign up:
${link}

TheSpark — One spark. One fire. One wealthy Nigeria. 🇳🇬`;
            
            navigator.clipboard.writeText(message);
            toast.success('Referral message copied!');
        }} 
        className="btn btn-primary btn-sm btn-full"
    >
        📋 Copy Referral Code
    </button>
</div>
                
                {/* Menu Items */}
                {visibleMenuItems.map((item, index) => (
                    <Link key={index} to={item.link} style={{ textDecoration: 'none' }}>
                        <div className="profile-menu-item">
                            <div className="profile-menu-left">
                                <div className="profile-menu-icon">{item.icon}</div>
                                <div>
                                    <div className="profile-menu-text">{item.label}</div>
                                    {item.subtext && <div className="profile-menu-subtext">{item.subtext}</div>}
                                </div>
                            </div>
                            <div className="profile-menu-arrow">›</div>
                        </div>
                    </Link>
                ))}
                
                <div className="profile-divider"></div>
                
                {/* Admin Section */}
                {isAdmin && (
                    <>
                        {adminItems.map((item, index) => (
                            <Link key={index} to={item.link} style={{ textDecoration: 'none' }}>
                                <div className="profile-menu-item">
                                    <div className="profile-menu-left">
                                        <div className="profile-menu-icon">{item.icon}</div>
                                        <div>
                                            <div className="profile-menu-text">{item.label}</div>
                                        </div>
                                    </div>
                                    <div className="profile-menu-arrow">›</div>
                                </div>
                            </Link>
                        ))}
                        <div className="profile-divider"></div>
                    </>
                )}
                
                {/* Logout Button */}
                <div onClick={handleLogout} className="profile-logout">
                    <span>🚪</span>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}