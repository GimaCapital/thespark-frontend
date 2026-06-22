// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import BalanceCard from '../components/Dashboard/BalanceCard';
// import DailySavingsLog from '../components/Dashboard/DailySavingsLog';
// import CycleTracker from '../components/Dashboard/CycleTracker';
// import DailyMessage from '../components/Dashboard/DailyMessage';
// import WithdrawModal from '../components/Dashboard/WithdrawModal';
// import ReferralCard from '../components/Dashboard/ReferralCard';
// import InterestCalculator from '../components/Dashboard/InterestCalculator';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// export default function Dashboard() {
//     const { user, userData, refreshUserData } = useAuth();
//     const [todayMessage, setTodayMessage] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//     const [balanceData, setBalanceData] = useState(null);
//     const [showBalance, setShowBalance] = useState(true);

//     // FIXED: Removed userData from dependencies
//     useEffect(() => {
//         if (user) {
//             loadData();
//         }
//     }, [user]);  // ✅ Only runs when user logs in/out, not when userData changes

//     const loadData = async () => {
//         setLoading(true);
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/users/me');
//             setTodayMessage(response.data.todayMessage);
//             setBalanceData(response.data);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//             toast.error('Failed to load data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const refreshData = async () => {
//         await loadData();
//         if (refreshUserData) await refreshUserData();
//     };

//     const toggleBalanceVisibility = () => {
//         setShowBalance(!showBalance);
//     };

//     if (loading) {
//         return (
//             <div className="flex-center h-64">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     if (!balanceData) {
//         return (
//             <div className="container text-center">
//                 <p className="text-error">Failed to load data.</p>
//                 <button onClick={loadData} className="btn btn-primary mt-4">Retry</button>
//             </div>
//         );
//     }

//     const isPremium = balanceData.premiumPlan && balanceData.premiumPlan !== 'Basic';
//     const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '👤';

//     return (
//         <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '5rem' }}>
//             {/* Header with greeting and private mode */}
//                 <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #F0F0F0' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div>
//                         <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
//                         <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0.25rem 0 0 0' }}>
//                             {userData?.fullName?.split(' ')[0] || 'Spark Member'}
//                         </h1>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                         <button
//                             onClick={toggleBalanceVisibility}
//                             style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}
//                         >
//                             {showBalance ? '👁️' : '🙈'}
//                         </button>
//                         <Link to="/profile" style={{ textDecoration: 'none' }}>
//                             <div style={{
//                                 width: '2.5rem',
//                                 height: '2.5rem',
//                                 borderRadius: '9999px',
//                                 backgroundColor: '#F97316',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 fontSize: '1rem',
//                                 overflow: 'hidden'
//                             }}>
//                                 {userData?.photoURL ? (
//                                     <img src={userData.photoURL} alt={userData.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                                 ) : (
//                                     <span>{getInitials(userData?.fullName)}</span>
//                                 )}
//                             </div>
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             {/* Balance Card */}
//             <div className="container" style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
//                 <BalanceCard 
//                     balance={showBalance ? balanceData.currentBalance : '••••••'}
//                     totalSaved={showBalance ? balanceData.totalPrincipalSaved : '••••••'}
//                     totalInterest={showBalance ? balanceData.totalInterestEarned : '••••••'}
//                 />
//             </div>

//             {/* Quick Actions */}
//             <div className="container">
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
//                     <button 
//                         onClick={() => document.querySelector('.preset-btn')?.scrollIntoView({ behavior: 'smooth' })}
//                         style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
//                     >
//                         <span style={{ fontSize: '1.5rem', display: 'block' }}>📥</span>
//                         <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>Deposit</span>
//                     </button>
//                     <button 
//                         onClick={() => setShowWithdrawModal(true)}
//                         style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
//                     >
//                         <span style={{ fontSize: '1.5rem', display: 'block' }}>📤</span>
//                         <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>Withdraw</span>
//                     </button>
//                     <Link to="/transactions" style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                         <span style={{ fontSize: '1.5rem', display: 'block' }}>📊</span>
//                         <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>History</span>
//                     </Link>
//                     <Link to="/premium" style={{ textAlign: 'center', backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                         <span style={{ fontSize: '1.5rem', display: 'block' }}>⭐</span>
//                         <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>Upgrade</span>
//                     </Link>
//                 </div>
//             </div>

//             {/* Daily Savings Log */}
//             <div className="container">
//                 <DailySavingsLog 
//                     userId={balanceData.userId}
//                     currentCycle={balanceData.currentCycle}
//                     currentDay={balanceData.currentDay}
//                     onSave={refreshData}
//                 />
//             </div>

//             {/* Cycle Tracker */}
//             <div className="container">
//                 <CycleTracker 
//                     currentCycle={balanceData.currentCycle}
//                     currentDay={balanceData.currentDay}
//                 />
//             </div>

//             {/* Interest Calculator */}
//             <div className="container">
//                 <InterestCalculator 
//                     currentBalance={balanceData.currentBalance}
//                     lowestBalance={balanceData.lowestBalanceThisCycle}
//                     avgBalance={balanceData.avgDailyBalanceThisCycle}
//                     currentDay={balanceData.currentDay}
//                     interestRate={balanceData.premiumInterestRate || 5}
//                 />
//             </div>

//             {/* Today's Message */}
//             <div className="container">
//                 {todayMessage ? (
//                     <DailyMessage message={todayMessage} />
//                 ) : (
//                     <div className="card text-center">
//                         <p className="text-body">Loading daily message...</p>
//                     </div>
//                 )}
//             </div>

//             {/* Referral Card */}
//             <div className="container">
//                 <ReferralCard referralCode={balanceData.referralCode} />
//             </div>

//             {/* Withdraw Modal */}
//             <WithdrawModal 
//                 isOpen={showWithdrawModal}
//                 onClose={() => setShowWithdrawModal(false)}
//                 currentBalance={balanceData.currentBalance}
//                 currentCycle={balanceData.currentCycle}
//                 currentDay={balanceData.currentDay}
//                 onSuccess={refreshData}
//             />
//         </div>
//     );
// }





import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import BalanceCard from '../components/Dashboard/BalanceCard';
import DailySavingsLog from '../components/Dashboard/DailySavingsLog';
import CycleTracker from '../components/Dashboard/CycleTracker';
import DailyMessage from '../components/Dashboard/DailyMessage';
import WithdrawModal from '../components/Dashboard/WithdrawModal';
import ReferralCard from '../components/Dashboard/ReferralCard';
import InterestCalculator from '../components/Dashboard/InterestCalculator';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import { formatDate } from '../utils/dateUtils'; 
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user, userData, refreshUserData } = useAuth();
    const [todayMessage, setTodayMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [balanceData, setBalanceData] = useState(null);
    const [showBalance, setShowBalance] = useState(true);
    const [withdrawalRequests, setWithdrawalRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('savings');

    const dailySavingsRef = useRef(null);

    useEffect(() => {
        if (user) {
            loadData();
            loadWithdrawalRequests();
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/me');
            setTodayMessage(response.data.todayMessage);
            setBalanceData(response.data);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadWithdrawalRequests = async () => {
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/withdrawals/requests');
            setWithdrawalRequests(response.data);
        } catch (error) {
            console.error('Failed to load withdrawal requests:', error);
        }
    };

    const refreshData = async () => {
        await loadData();
        await loadWithdrawalRequests();
        if (refreshUserData) await refreshUserData();
    };

    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };

    // const scrollToDeposit = () => {
    //     if (activeTab !== 'savings') {
    //         setActiveTab('savings');
    //         setTimeout(() => {
    //             if (dailySavingsRef.current) {
    //                 dailySavingsRef.current.scrollIntoView({ 
    //                     behavior: 'smooth', 
    //                     block: 'start' 
    //                 });
    //             }
    //         }, 100);
    //     } else {
    //         if (dailySavingsRef.current) {
    //             dailySavingsRef.current.scrollIntoView({ 
    //                 behavior: 'smooth', 
    //                 block: 'start' 
    //             });
    //         }
    //     }
    // };


 const scrollToDeposit = () => {
    const navbarHeight = 70; // Adjust based on your navbar height
    
    const scrollToElement = () => {
        if (dailySavingsRef.current) {
            const element = dailySavingsRef.current;
            const elementRect = element.getBoundingClientRect();
            const elementHeight = elementRect.height;
            const viewportHeight = window.innerHeight;
            
            // Center the element in the viewport, accounting for navbar
            const elementPosition = elementRect.top + window.pageYOffset;
            const offsetPosition = elementPosition - (viewportHeight / 2) + (elementHeight / 2) - navbarHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (activeTab !== 'savings') {
        setActiveTab('savings');
        setTimeout(scrollToElement, 150);
    } else {
        scrollToElement();
    }
};

    const handleShare = async () => {
        const referralCode = balanceData?.referralCode;
        const shareData = {
            title: 'Join me on Spark Savings',
            text: `Use my referral code ${referralCode} to get started on Spark Savings and earn bonuses!`,
            url: `${window.location.origin}/signup?ref=${referralCode}`
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success('Thanks for sharing!');
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                toast.success('Referral link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if (error.name !== 'AbortError') {
                toast.error('Failed to share. Please try again.');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { color: '#FF8A00', text: 'Pending', bg: '#FFF4E6' };
            case 'approved':
                return { color: '#00B341', text: 'Approved', bg: '#E6F9EF' };
            case 'rejected':
                return { color: '#FF3B30', text: 'Rejected', bg: '#FFEBEE' };
            default:
                return { color: '#6B7280', text: 'Unknown', bg: '#F3F4F6' };
        }
    };

    if (loading) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!balanceData) {
        return (
            <div className="container text-center">
                <p className="text-error">Failed to load data.</p>
                <button onClick={loadData} className="btn btn-primary mt-4">Retry</button>
            </div>
        );
    }

    const isPremium = balanceData.premiumPlan && balanceData.premiumPlan !== 'Basic';
    const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '👤';
    const pendingCount = withdrawalRequests.filter(r => r.status === 'pending').length;

    return (
        <div className="bg-spark-50" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
             <HeaderMissionCard />
            {/* Header with greeting */}
            <div className="container" style={{ backgroundColor: 'white', padding: '0.5rem 1rem 1rem', borderBottom: '1px solid #F0F0F0' }}>
                <div className="container" style={{ padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '0.7rem', color: '#999', margin: 0 }}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0.25rem 0 0 0', color: '#1A1A1A' }}>
                                {userData?.fullName?.split(' ')[0] || 'thespark User'}
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={toggleBalanceVisibility}
                                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0.25rem' }}
                            >
                                {showBalance ? '👁️' : '🙈'}
                            </button>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '50%',
                                    backgroundColor: '#FF8A00',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    overflow: 'hidden'
                                }}>
                                    {userData?.photoURL ? (
                                        <img 
                                            src={userData.photoURL} 
                                            alt={userData.fullName} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentElement;
                                                parent.style.backgroundColor = '#FF8A00';
                                                parent.innerHTML = `<span style="color:white; font-weight:bold;">${getInitials(userData?.fullName)}</span>`;
                                            }}
                                        />
                                    ) : (
                                        <span>{getInitials(userData?.fullName)}</span>
                                    )}
                                </div>
                            </Link>
                           
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Container */}
            <div className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
                {/* Promo Banner with Share Button */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #FF8A00 0%, #FF6B00 100%)', 
                    borderRadius: '0.75rem', 
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: '600', margin: 0, color: 'white' }}>🎉 Invite Friends</p>
                        <p style={{ fontSize: '0.65rem', margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Get ₦500 per referral</p>
                    </div>
                    <button 
                        onClick={handleShare}
                        style={{ 
                            backgroundColor: 'white', 
                            color: '#FF8A00', 
                            padding: '0.35rem 0.75rem', 
                            borderRadius: '1rem', 
                            fontSize: '0.7rem', 
                            fontWeight: '600', 
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Share
                    </button>
                </div>

                {/* Balance Card */}
                <div style={{ marginBottom: '1rem' }}>
                    <BalanceCard 
                        balance={showBalance ? balanceData.currentBalance : '••••••'}
                        totalSaved={showBalance ? balanceData.totalPrincipalSaved : '••••••'}
                        totalInterest={showBalance ? balanceData.totalInterestEarned : '••••••'}
                    />
                </div>

                {/* Quick Actions Grid - Updated to 5 columns with Bank link */}
                {/* Quick Actions Grid - Updated to 5 columns with Bank link */}
                <div className="grid grid-cols-5 gap-3 mb-4">
                    <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="bg-white rounded-xl py-3 px-2 text-center border-none cursor-pointer flex flex-col items-center w-full"
                        style={{ border: '1px solid #F0F0F0' }}
                    >
                        <div className="text-2xl mb-1">💸</div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Withdraw</span>
                    </button>
                    <button 
                        onClick={scrollToDeposit}
                        className="bg-white rounded-xl py-3 px-2 text-center border-none cursor-pointer flex flex-col items-center w-full"
                        style={{ border: '1px solid #F0F0F0' }}
                    >
                        <div className="text-2xl mb-1">➕</div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Deposit</span>
                    </button>
                    <Link to="/transactions" className="bg-white rounded-xl py-3 px-2 text-center no-underline flex flex-col items-center w-full" style={{ border: '1px solid #F0F0F0' }}>
                        <div className="text-2xl mb-1">📋</div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">History</span>
                    </Link>
                    <Link to="/referral" className="bg-white rounded-xl py-3 px-2 text-center no-underline flex flex-col items-center w-full" style={{ border: '1px solid #F0F0F0' }}>
                        <div className="text-2xl mb-1">👥</div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Refer</span>
                    </Link>
                    <Link to="/bank-account" className="bg-white rounded-xl py-3 px-2 text-center no-underline flex flex-col items-center w-full" style={{ border: '1px solid #F0F0F0' }}>
                        <div className="text-2xl mb-1">🏦</div>
                        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Bank</span>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white rounded-xl p-3 text-center" style={{ border: '1px solid #F0F0F0' }}>
                        <p className="text-xs text-gray-500 mb-1">Total Saved</p>
                        <h3 className="text-base font-bold text-gray-900 mt-1 mb-0">
                            ₦{showBalance ? balanceData.totalPrincipalSaved?.toLocaleString() : '****'}
                        </h3>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center" style={{ border: '1px solid #F0F0F0' }}>
                        <p className="text-xs text-gray-500 mb-1">Interest Earned</p>
                        <h3 className="text-base font-bold text-gray-900 mt-1 mb-0">
                            ₦{showBalance ? balanceData.totalInterestEarned?.toLocaleString() : '****'}
                        </h3>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center" style={{ border: '1px solid #F0F0F0' }}>
                        <p className="text-xs text-gray-500 mb-1">Referral Bonus</p>
                        <h3 className="text-base font-bold text-gray-900 mt-1 mb-0">
                            ₦{showBalance ? (balanceData.referralEarnings || 0).toLocaleString() : '****'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="container bg-white" style={{ borderBottom: '1px solid #F0F0F0' }}>
                <div className="flex" style={{ padding: 0 }}>
                    <button 
                        onClick={() => setActiveTab('savings')}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${
                            activeTab === 'savings' 
                                ? 'text-spark-500 border-b-2 border-spark-500' 
                                : 'text-gray-500'
                        }`}
                    >
                        Savings
                    </button>
                    <button 
                        onClick={() => setActiveTab('withdrawals')}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${
                            activeTab === 'withdrawals' 
                                ? 'text-spark-500 border-b-2 border-spark-500' 
                                : 'text-gray-500'
                        }`}
                    >
                        Withdrawals
                        {pendingCount > 0 && (
                            <span className="ml-2 bg-orange-100 text-spark-500 text-xs px-2 py-0.5 rounded-full">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${
                            activeTab === 'stats' 
                                ? 'text-spark-500 border-b-2 border-spark-500' 
                                : 'text-gray-500'
                        }`}
                    >
                        Statistics
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container py-4">
                {/* SAVINGS TAB */}
                {activeTab === 'savings' && (
                    <>
                        <div ref={dailySavingsRef}>
                            <div className="mb-4" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
                                <DailySavingsLog 
                                    userId={balanceData.userId}
                                    currentCycle={balanceData.currentCycle}
                                    currentDay={balanceData.currentDay}
                                    onSave={refreshData}
                                    accountNumber={balanceData.flwAccountNumber}
                                    bankName={balanceData.flwBankName}
                                    userFullName={balanceData.fullName}
                                    userPlan={balanceData.premiumPlan || 'Basic'}
                                />
                            </div>
                        </div>

                        <div className="mb-4" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
                            <CycleTracker 
                                currentCycle={balanceData.currentCycle}
                                currentDay={balanceData.currentDay}
                            />
                        </div>

                        {todayMessage && (
                            <DailyMessage message={todayMessage} />
                        )}
                    </>
                )}

                {/* WITHDRAWALS TAB */}
                {activeTab === 'withdrawals' && (
                    <>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #F0F0F0', marginBottom: '1rem' }}>
                            <div className="flex-between mb-4">
                                <h3 className="heading-3 mb-0">All Withdrawal Requests</h3>
                                {pendingCount > 0 && (
                                    <span className="bg-orange-100 text-spark-500 text-xs px-3 py-1 rounded-full">
                                        {pendingCount} Pending
                                    </span>
                                )}
                            </div>
                            
                            {withdrawalRequests.length > 0 ? (
                                <div>
                                    {withdrawalRequests.map((req, idx) => {
                                        const status = getStatusBadge(req.status);
                                        return (
                                            <div key={req.id || idx} className="transaction-item" style={{ borderBottom: idx !== withdrawalRequests.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                                                <div>
                                                    <p className="font-medium text-sm mb-0">₦{req.amount?.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400 mt-1 mb-0">
                                                        {formatDate(req.createdAt)}
                                                    </p>
                                                </div>
                                                <span 
                                                    className="text-xs px-3 py-1 rounded-full"
                                                    style={{ backgroundColor: status.bg, color: status.color }}
                                                >
                                                    {status.text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-8">No withdrawal requests yet</p>
                            )}
                            
                            <Link to="/transactions" className="block text-center text-spark-500 text-sm mt-4 no-underline">
                                View transaction history →
                            </Link>
                        </div>

                        <button 
                            onClick={() => setShowWithdrawModal(true)} 
                            className="btn btn-primary btn-full mt-4"
                            style={{ backgroundColor: '#FF8A00', color: 'white', padding: '1rem', borderRadius: '0.75rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                        >
                            Request New Withdrawal
                        </button>
                    </>
                )}

                {/* STATISTICS TAB */}
                {activeTab === 'stats' && (
                    <>
                        <div className="mb-4" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
                            <InterestCalculator 
                                currentBalance={balanceData.currentBalance}
                                avgDays1to16={balanceData.avgDays1to16}
                                currentDay={balanceData.currentDay}
                            />
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #F0F0F0', marginBottom: '1rem' }}>
                            <h3 className="heading-3 mb-3">Your Savings Info</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Current Cycle:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1A1A1A' }}>{balanceData.currentCycle || 1}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Current Day:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#1A1A1A' }}>{balanceData.currentDay || 0} / 21</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Days 1-16 Average:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#FF8A00' }}>₦{balanceData.avgDays1to16?.toLocaleString() || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Projected Interest (5%):</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#10B981' }}>
                                    ₦{((balanceData.avgDays1to16 || 0) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Interest Rate:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#FF8A00' }}>5% per cycle (Days 1-16 only)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>Member Type:</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: isPremium ? '#FF8A00' : '#666' }}>
                                    {isPremium ? `⭐ ${balanceData.premiumPlan}` : 'Basic Member'}
                                </span>
                            </div>
                            <div className="mt-3 pt-2 text-center">
                                <p className="text-xs text-gray-400">
                                    ℹ️ Days 17-21 deposits earn 0% interest. Save early!
                                </p>
                            </div>
                        </div>

                        {!isPremium && (
                            <Link to="/premium" className="block no-underline">
                                <div style={{ background: 'linear-gradient(135deg, #FF8A00 0%, #FF6B00 100%)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div className="text-2xl mb-2">⭐</div>
                                        <h3 className="text-white font-bold text-sm mb-1">Upgrade to Premium</h3>
                                        <p className="text-white text-xs opacity-90 mb-0">Get higher interest rates & better benefits</p>
                                    </div>
                                    <span className="text-white text-xl">→</span>
                                </div>
                            </Link>
                        )}

                        {isPremium && (
                            <div style={{ backgroundColor: '#FFF4E6', borderRadius: '12px', padding: '16px', border: '1px solid #FFE0B3' }}>
                                <h3 className="text-sm font-bold mb-2" style={{ color: '#FF8A00' }}>✨ Premium Benefits Active</h3>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>✓ Higher interest rate ({balanceData.premiumInterestRate || 5}% p.a.)</p>
                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>✓ Priority withdrawals</p>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>✓ Exclusive support</p>
                            </div>
                        )}
                    </>
                )}

                {/* Referral Card */}
                <div className="mt-4">
                    <ReferralCard referralCode={balanceData.referralCode} />
                </div>
            </div>

            {/* Withdraw Modal */}
            <WithdrawModal 
                isOpen={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                currentBalance={balanceData.currentBalance}
                currentCycle={balanceData.currentCycle}
                currentDay={balanceData.currentDay}
                onSuccess={refreshData}
            />
        </div>
    );
}