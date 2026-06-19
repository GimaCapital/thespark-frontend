// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import toast from 'react-hot-toast';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

// export default function PremiumPlans() {
//     const { user, userData, refreshUserData } = useAuth();
//     const [plans, setPlans] = useState([]);
//     const [upgrading, setUpgrading] = useState(false);
    
//     useEffect(() => {
//         loadPlans();
//     }, []);
    
//     const loadPlans = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/graduation/premium-plans');
//             setPlans(response.data);
//         } catch (error) {
//             console.error('Failed to load plans:', error);
//             // Fallback to hardcoded plans if API fails
//             setPlans([
//                 {
//                     name: 'Basic',
//                     monthlyFee: 0,
//                     interestRate: 5,
//                     dailyMin: 100,
//                     dailyMax: 2000,
//                     bestFor: 'Perfect for beginners',
//                     features: [
//                         'Graduate certificate after 8 cycles',
//                         'Save ₦100 - ₦2,000 per day',
//                         '5% interest every 21 days',
//                         'Full access to wealth education',
//                         'Daily messages from The Richest Man in Babylon',
//                         'Referral program access'
//                     ]
//                 },
//                 {
//                     name: 'Premium',
//                     monthlyFee: 1000,
//                     interestRate: 4,
//                     dailyMin: 500,
//                     dailyMax: 10000,
//                     bestFor: 'For serious savers',
//                     features: [
//                         'Graduate certificate after 8 cycles',
//                         'Save ₦500 - ₦10,000 per day (5x more!)',
//                         '4% interest every 21 days',
//                         'Priority withdrawals (less than 1 hour)',
//                         'Private investor network',
//                         'Weekly training & coaching (every Saturday)',
//                         'All Basic features included'
//                     ]
//                 },
//                 {
//                     name: 'Investor',
//                     monthlyFee: 2500,
//                     interestRate: 3,
//                     dailyMin: 1000,
//                     dailyMax: 20000,
//                     bestFor: 'For wealth builders',
//                     features: [
//                         'Graduate certificate after 8 cycles',
//                         'Save ₦1,000 - ₦20,000 per day (10x more!)',
//                         '3% interest every 21 days',
//                         'Priority withdrawals (less than 1 hour)',
//                         'Private investor network',
//                         'Weekly training & coaching (every Saturday)',
//                         'Exclusive investment opportunities',
//                         'All Premium features included'
//                     ]
//                 }
//             ]);
//         }
//     };
    
//     const getCurrentPlanLevel = () => {
//         const current = userData?.premiumPlan || 'Basic';
//         if (current === 'Investor') return 3;
//         if (current === 'Premium') return 2;
//         return 1;
//     };
    
//     const getButtonText = (planName, planLevel) => {
//         const currentPlan = userData?.premiumPlan || 'Basic';
//         const currentLevel = getCurrentPlanLevel();
        
//         if (currentPlan === planName) {
//             return 'Current Plan';
//         }
//         if (planLevel > currentLevel) {
//             return `Upgrade to ${planName}`;
//         }
//         if (planLevel < currentLevel) {
//             return `Downgrade to ${planName}`;
//         }
//         return `Switch to ${planName}`;
//     };
    
//     const getButtonClass = (planName, planLevel) => {
//         const currentPlan = userData?.premiumPlan || 'Basic';
//         const currentLevel = getCurrentPlanLevel();
        
//         if (currentPlan === planName) {
//             return 'btn-secondary btn-full';
//         }
//         if (planLevel > currentLevel) {
//             return 'btn-primary btn-full';
//         }
//         if (planLevel < currentLevel) {
//             return 'btn-outline btn-full';
//         }
//         return 'btn-primary btn-full';
//     };
    
//     const upgradePlan = async (planName, planLevel) => {
//         const currentPlan = userData?.premiumPlan || 'Basic';
//         const currentLevel = getCurrentPlanLevel();
        
//         let confirmMessage = '';
//         if (planLevel > currentLevel) {
//             const fee = planName === 'Premium' ? '1,000' : '2,500';
//             confirmMessage = `Upgrade to ${planName} plan for ₦${fee}/month? You will get higher savings limits (up to ₦${planName === 'Premium' ? '10,000' : '20,000'}/day).`;
//         } else if (planLevel < currentLevel) {
//             confirmMessage = `Downgrade to ${planName} plan? You will lose premium features and your savings limit will decrease.`;
//         }
        
//         if (confirmMessage && !window.confirm(confirmMessage)) {
//             return;
//         }
        
//         setUpgrading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.post('/graduation/premium/upgrade', { planName });
//             toast.success(response.data.message);
//             await refreshUserData();
//             setTimeout(() => {
//                 window.location.reload();
//             }, 500);
//         } catch (error) {
//             console.error('Upgrade error:', error);
//             toast.error(error.response?.data?.error || 'Failed to update plan');
//         } finally {
//             setUpgrading(false);
//         }
//     };
    
//     const currentPlan = userData?.premiumPlan || 'Basic';
//     const currentLevel = getCurrentPlanLevel();
    
//     return (
//         <div className="container">
//             <HeaderMissionCard />
//             <h1 className="heading-1 text-center spacer-lg">Premium Savings Plans</h1>
//             <p className="text-body text-center spacer-lg">
//                 As your wealth grows, you can access better tools.
//             </p>
            
//             <div className="grid-2">
//                 {plans.map((plan, idx) => {
//                     const planLevel = plan.name === 'Basic' ? 1 : plan.name === 'Premium' ? 2 : 3;
//                     const buttonText = getButtonText(plan.name, planLevel);
//                     const buttonClass = getButtonClass(plan.name, planLevel);
//                     const isCurrent = currentPlan === plan.name;
                    
//                     return (
//                         <div key={idx} className={`card text-center ${isCurrent ? 'border-2 border-spark-500' : ''}`}>
//                             {isCurrent && (
//                                 <div className="bg-spark-500 text-white text-xs py-1 rounded-t-lg -mt-6 -mx-6 mb-4">
//                                     CURRENT PLAN
//                                 </div>
//                             )}
//                             <h2 className="heading-2 text-spark-500 spacer-sm">{plan.name}</h2>
//                             {plan.monthlyFee === 0 ? (
//                                 <p className="text-success font-bold spacer-sm">FREE</p>
//                             ) : (
//                                 <p className="text-success font-bold spacer-sm">₦{plan.monthlyFee.toLocaleString()}/month</p>
//                             )}
//                             <p className="text-3xl font-bold text-spark-500 spacer-sm">{plan.interestRate}%</p>
//                             <p className="text-small text-gray-500 spacer-md">per 21 days</p>
//                             <p className="text-body text-small spacer-md">{plan.bestFor}</p>
//                             <div className="text-left spacer-md">
//                                 {plan.features.map((feature, fIdx) => (
//                                     <p key={fIdx} className="text-small spacer-sm">✓ {feature}</p>
//                                 ))}
//                             </div>
//                             {isCurrent ? (
//                                 <button className="btn btn-secondary btn-full" disabled>
//                                     Current Plan
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={() => upgradePlan(plan.name, planLevel)}
//                                     disabled={upgrading}
//                                     className={`btn ${buttonClass} ${upgrading ? 'btn-disabled' : ''}`}
//                                 >
//                                     {upgrading ? 'Processing...' : buttonText}
//                                 </button>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
            
//             <div className="message-card spacer-lg">
//                 <p className="message-title">Teaching</p>
//                 <p className="message-text">
//                     "As your wealth grows, you can access better tools. But never pay fees you do not understand."
//                 </p>
//             </div>
//         </div>
//     );
// }



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

export default function PremiumPlans() {
    const { user, userData, refreshUserData } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [billingInterval, setBillingInterval] = useState('monthly');
    
    useEffect(() => {
        loadPlans();
    }, []);
    
    const loadPlans = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/graduation/premium-plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Failed to load plans:', error);
            toast.error('Failed to load premium plans. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };
    
    const getCurrentPlanLevel = () => {
        const current = userData?.premiumPlan || 'Basic';
        if (current === 'Investor') return 3;
        if (current === 'Premium') return 2;
        return 1;
    };
    
    const getButtonText = (planName, planLevel) => {
        const currentPlan = userData?.premiumPlan || 'Basic';
        const currentLevel = getCurrentPlanLevel();
        
        if (currentPlan === planName) {
            return 'Current Plan';
        }
        if (planLevel > currentLevel) {
            return `Upgrade to ${planName}`;
        }
        if (planLevel < currentLevel) {
            return `Downgrade to ${planName}`;
        }
        return `Switch to ${planName}`;
    };
    
    const getButtonClass = (planName, planLevel) => {
        const currentPlan = userData?.premiumPlan || 'Basic';
        const currentLevel = getCurrentPlanLevel();
        
        if (currentPlan === planName) {
            return 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200';
        }
        if (planLevel > currentLevel) {
            return 'bg-gradient-to-r from-spark-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300';
        }
        if (planLevel < currentLevel) {
            return 'bg-white border-2 border-gray-300 text-gray-700 hover:border-spark-500 hover:text-spark-600 transition-all duration-300';
        }
        return 'bg-gradient-to-r from-spark-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300';
    };
    
    const upgradePlan = async (planName, planLevel) => {
        const currentPlan = userData?.premiumPlan || 'Basic';
        const currentLevel = getCurrentPlanLevel();
        
        let confirmMessage = '';
        if (planLevel > currentLevel) {
            const fee = planName === 'Premium' ? '1,000' : '2,500';
            confirmMessage = `Upgrade to ${planName} plan for ₦${fee}/month? You will get higher daily limits and exclusive educational content.`;
        } else if (planLevel < currentLevel) {
            confirmMessage = `Downgrade to ${planName} plan? You will lose premium features and your daily limit will decrease.`;
        }
        
        if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }
        
        setUpgrading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.post('/graduation/premium/upgrade', { planName });
            toast.success(response.data.message);
            await refreshUserData();
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Upgrade error:', error);
            toast.error(error.response?.data?.error || 'Failed to update plan');
        } finally {
            setUpgrading(false);
        }
    };
    
    const currentPlan = userData?.premiumPlan || 'Basic';
    
    // Loading state
    if (loading) {
        return (
            <div className="bg-white min-h-screen">
                {/* <HeaderMissionCard /> */}
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="w-12 h-12 border-3 border-spark-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading premium plans...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* <HeaderMissionCard /> */}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                
                {/* Header Section - Enterprise Style */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spark-50 text-spark-600 text-sm font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-spark-500"></span>
                        PRICING
                    </div> */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
                        Simple, transparent<br />
                        <span className="text-spark-600">pricing for everyone</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Choose the plan that fits your goals. Upgrade or downgrade anytime.
                    </p>
                </div>
                
                {/* Billing Toggle - Enterprise Style */}
                <div className="flex justify-center mb-12">
                    <div className="bg-gray-100 rounded-full p-1 inline-flex">
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                billingInterval === 'monthly' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Monthly billing
                        </button>
                        <button
                            onClick={() => setBillingInterval('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                billingInterval === 'yearly' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Yearly billing
                            <span className="ml-1.5 text-xs text-spark-500 font-semibold">Save 17%</span>
                        </button>
                    </div>
                </div>
                
                {/* Plans Grid - Enterprise Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
                    {plans.map((plan, idx) => {
                        const planLevel = plan.name === 'Basic' ? 1 : plan.name === 'Premium' ? 2 : 3;
                        const buttonText = getButtonText(plan.name, planLevel);
                        const buttonClass = getButtonClass(plan.name, planLevel);
                        const isCurrent = currentPlan === plan.name;
                        const isPopular = plan.name === 'Premium';
                        const yearlyPrice = plan.monthlyFee * 12 * 0.83; // 17% discount
                        
                        return (
                            <div 
                                key={idx} 
                                className={`relative rounded-2xl transition-all duration-300 ${
                                    isCurrent ? 'ring-2 ring-spark-500 shadow-xl scale-105 z-10' : 'hover:shadow-xl'
                                }`}
                            >
                                {/* Popular Badge */}
                                {isPopular && !isCurrent && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                        <span className="bg-gradient-to-r from-spark-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}
                                
                                <div className={`bg-white rounded-2xl overflow-hidden h-full border ${
                                    isCurrent ? 'border-spark-300' : 'border-gray-200'
                                }`}>
                                    
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-4xl">{plan.icon}</div>
                                            {isCurrent && (
                                                <span className="text-xs font-medium text-spark-600 bg-spark-50 px-2 py-1 rounded-full">
                                                    CURRENT PLAN
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                                        <p className="text-sm text-gray-500">{plan.bestFor}</p>
                                        
                                        {/* Price */}
                                        <div className="mt-4">
                                            {plan.monthlyFee === 0 ? (
                                                <div className="text-3xl font-bold text-gray-900">Free</div>
                                            ) : (
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-4xl font-bold text-gray-900">
                                                            ₦{billingInterval === 'monthly' ? plan.monthlyFee.toLocaleString() : Math.round(yearlyPrice).toLocaleString()}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            /{billingInterval === 'monthly' ? 'month' : 'year'}
                                                        </span>
                                                    </div>
                                                    {billingInterval === 'yearly' && plan.monthlyFee > 0 && (
                                                        <div className="text-sm text-gray-400 line-through">
                                                            ₦{(plan.monthlyFee * 12).toLocaleString()}/year
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Daily Limit Highlight */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Daily goal limit</div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                ₦{plan.dailyMin?.toLocaleString()} - ₦{plan.dailyMax?.toLocaleString()}
                                            </div>
                                            {plan.dailyMax > 2000 && (
                                                <div className="mt-1 text-xs font-semibold text-spark-500">
                                                    {plan.dailyMax === 10000 ? '5x higher than Basic' : '10x higher than Basic'}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Features List */}
                                        <div className="space-y-3 mb-8">
                                            <p className="text-sm font-semibold text-gray-900 mb-3">What's included:</p>
                                            {plan.features?.map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-spark-100 flex items-center justify-center mt-0.5">
                                                        <svg className="w-3 h-3 text-spark-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* CTA Button */}
                                        <button
                                            onClick={() => upgradePlan(plan.name, planLevel)}
                                            disabled={upgrading || isCurrent}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${buttonClass} ${upgrading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {upgrading ? 'Processing...' : buttonText}
                                        </button>
                                        
                                        {/* Fine Print */}
                                        {plan.monthlyFee > 0 && (
                                            <p className="text-xs text-gray-400 text-center mt-4">
                                                Cancel anytime • No hidden fees
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Features Comparison Table - Enterprise Style */}
                <div className="mt-20 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Compare all features</h3>
                        <p className="text-sm text-gray-500 mt-1">Everything you need to build lasting wealth habits</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Basic</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Investor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Daily goal limit', basic: '₦2,000', premium: '₦10,000', investor: '₦20,000' },
                                    { name: 'Graduate certificate', basic: '✓', premium: '✓', investor: '✓' },
                                    { name: 'Wealth education library', basic: '✓', premium: '✓', investor: '✓' },
                                    { name: 'Daily educational messages', basic: '✓', premium: '✓', investor: '✓' },
                                    { name: 'Referral program', basic: '✓', premium: '✓', investor: '✓' },
                                    { name: 'Priority support', basic: '—', premium: '✓', investor: '✓' },
                                    { name: 'Private community', basic: '—', premium: '✓', investor: '✓' },
                                    { name: 'Weekly coaching calls', basic: '—', premium: '✓', investor: '✓' },
                                    { name: 'Exclusive video lessons', basic: '—', premium: '✓', investor: '✓' },
                                    { name: 'One-on-one coaching', basic: '—', premium: '—', investor: '✓' },
                                    { name: 'Investment education', basic: '—', premium: '—', investor: '✓' },
                                    { name: 'Asset-building workshops', basic: '—', premium: '—', investor: '✓' },
                                ].map((feature, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-3 px-6 font-medium text-gray-900">{feature.name}</td>
                                        <td className="text-center py-3 px-6 text-gray-600">{feature.basic}</td>
                                        <td className="text-center py-3 px-6 text-gray-600">{feature.premium}</td>
                                        <td className="text-center py-3 px-6 text-gray-600">{feature.investor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* FAQ Section - Enterprise Style */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500">
                        Have questions about our plans? <a href="/faq" className="text-spark-600 font-semibold hover:underline">Visit our FAQ</a>
                    </p>
                </div>
                
                {/* Navigation */}
                <div className="text-center mt-8">
                    <Link 
                        to="/dashboard" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-spark-600 transition-colors duration-300 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}