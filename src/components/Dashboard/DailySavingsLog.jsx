// import React, { useState } from 'react';
// import { api, setAuthToken } from '../../services/api';
// import { auth } from '../../services/firebase';
// import toast from 'react-hot-toast';

// export default function DailySavingsLog({ userId, currentCycle, currentDay, onSave }) {
//     const [amount, setAmount] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     const presetAmounts = [100, 200, 500, 1000, 2000];
//     const isDays1to16 = currentDay <= 16;
//     const isDays17to21 = currentDay > 16;
    
//     const handleSave = async () => {
//         const numAmount = parseInt(amount);
        
//         if (isNaN(numAmount) || numAmount < 100 || numAmount > 2000) {
//             toast.error('Amount must be between ₦100 and ₦2,000');
//             return;
//         }
        
//         if (currentDay > 21) {
//             toast.error('Cycle ends today. New deposits start next cycle');
//             return;
//         }
        
//         setLoading(true);
        
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
            
//             await api.post('/deposits', {
//                 amount: numAmount,
//                 cycle: currentCycle,
//                 day: currentDay
//             });
            
//             if (isDays17to21) {
//                 toast.error(`₦${numAmount.toLocaleString()} saved! (NO interest - Days 17-21 earn 0%)`);
//             } else {
//                 toast.success(`₦${numAmount.toLocaleString()} saved! (Will earn interest)`);
//             }
            
//             setAmount('');
//             onSave();
//         } catch (error) {
//             console.error('Deposit error:', error);
//             toast.error(error.response?.data?.error || 'Failed to save');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div className="card spacer-md">
//             <h2 className="heading-3 spacer-sm">Save Today</h2>
//             <p className="text-small spacer-md">
//                 Day {currentDay} of Cycle {currentCycle}
//                 {isDays1to16 && (
//                     <div className="text-success block spacer-sm">
//                         ✅ Days 1-16: Deposits earn 5% interest
//                     </div>
//                 )}
//                 {isDays17to21 && (
//                     <div className="text-error block spacer-sm">
//                         ❌ Days 17-21: Deposits earn 0% interest
//                         <br />
//                         <span className="text-xs">Save early in the cycle (Days 1-16) to earn interest!</span>
//                     </div>
//                 )}
//             </p>
            
//             <div className="grid-5 spacer-md">
//                 {presetAmounts.map(amt => (
//                     <button
//                         key={amt}
//                         onClick={() => setAmount(amt)}
//                         className={`preset-btn ${parseInt(amount) === amt ? 'preset-active' : ''}`}
//                     >
//                         ₦{amt}
//                     </button>
//                 ))}
//             </div>
            
//             <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount (₦100 - ₦2,000)"
//                 className="input spacer-md"
//             />
            
//             <button
//                 onClick={handleSave}
//                 disabled={loading || !amount}
//                 className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
//             >
//                 {loading ? 'Saving...' : 'Save Today'}
//             </button>
            
//             <div className="text-center spacer-sm">
//                 <p className="text-small text-success">💡 Tip: Save ₦100 daily Days 1-16 → Earn ₦42.50 interest!</p>
//                 <p className="text-small text-gray-500">"A part of all you earn is yours to keep."</p>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function DailySavingsLog({ userId, currentCycle, currentDay, onSave, userFullName, userPlan }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [waitingForDeposit, setWaitingForDeposit] = useState(false);
    const [intendedAmount, setIntendedAmount] = useState(null);
    const [totalWithFee, setTotalWithFee] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);
    const [planLimits, setPlanLimits] = useState({ min: 100, max: 2000 });
    const [depositConfirmed, setDepositConfirmed] = useState(false);

    const flutterwaveProcessingFee = 0.02;
    const cbnVAT = 0.075;

    // Calculate total with 4.6% markup (covers Flutterwave fee + VAT + profit)
    const calculateTotal = (amount) => {
        return Math.ceil(amount * 1.046 / 10) * 10;
    };

    // Get plan limits based on user's plan
    useEffect(() => {
        const fetchPlanLimits = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken();
                setAuthToken(idToken);
                const response = await api.get('/users/me');
                const user = response.data;
                const plan = user.premiumPlan || 'Basic';
                
                const limits = {
                    'Basic': { min: 100, max: 2000 },
                    'Premium': { min: 500, max: 5000 },
                    'Investor': { min: 1000, max: 20000 }
                }[plan];
                
                setPlanLimits(limits);
            } catch (error) {
                console.error('Failed to fetch plan limits:', error);
            }
        };
        
        fetchPlanLimits();
        fetchAccountDetails();
    }, []);

    const fetchAccountDetails = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/flutterwave/my-account');
            setAccountDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch account:', error);
        }
    };

    // Poll for deposit confirmation
    useEffect(() => {
        let interval;
        if (waitingForDeposit && !depositConfirmed) {
            interval = setInterval(async () => {
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    setAuthToken(idToken);
                    const response = await api.get('/deposits/check-intent');
                    
                    if (response.data.matched) {
                        // ✅ STANDARD APPROACH: Call confirm-intent IMMEDIATELY
                        // This prevents the intent from being returned again
                        if (response.data.intentId) {
                            await api.post('/deposits/confirm-intent', {
                                intentId: response.data.intentId
                            });
                        }
                        
                        setDepositConfirmed(true);
                        setWaitingForDeposit(false);
                        toast.success('✅ Deposit confirmed! Your wallet has been credited.');
                        setTimeout(() => {
                            setShowModal(false);
                            setDepositConfirmed(false);
                            setAmount('');
                            if (onSave) onSave();
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Failed to check deposit status:', error);
                }
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [waitingForDeposit, depositConfirmed, onSave]);

    const handleSaveClick = async () => {
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount) || numAmount < planLimits.min || numAmount > planLimits.max) {
            toast.error(`Amount must be between ₦${planLimits.min} and ₦${planLimits.max} for your plan`);
            return;
        }

        const total = calculateTotal(numAmount);
        setIntendedAmount(numAmount);
        setTotalWithFee(total);
        
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            // Store deposit intent
            await api.post('/deposits/intent', {
                amount: numAmount,
                cycle: currentCycle,
                day: currentDay
            });
            
            setShowModal(true);
            
            // Auto-close modal after 10 seconds and start waiting
            setTimeout(() => {
                setShowModal(false);
                setWaitingForDeposit(true);
                toast.success('Deposit initiated! Complete the transfer from your banking app.', { icon: '💰' });
            }, 10000);
            
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to initiate deposit');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setWaitingForDeposit(false);
        setDepositConfirmed(false);
        setAmount('');
        if (onSave) onSave();
    };

    return (
        <>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">💰 Daily Savings</h3>
                    <span className="text-xs text-gray-500">
                        Limit: ₦{planLimits.min} - ₦{planLimits.max}
                    </span>
                </div>
                
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Amount (₦${planLimits.min} - ₦${planLimits.max})`}
                        className="input flex-1"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSaveClick}
                        disabled={loading || !amount}
                        className="btn btn-primary"
                    >
                        {loading ? 'Processing...' : 'Initiate Deposit'}
                    </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-2">
                    Initiate deposit first, then transfer the amount shown
                </p>
            </div>

            {/* Deposit Instructions Modal */}
            {showModal && accountDetails && !waitingForDeposit && !depositConfirmed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Complete Deposit</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Amount to Transfer */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 text-center border border-green-200">
                            <p className="text-xs text-green-700 uppercase tracking-wide mb-2">Amount to Transfer</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-4xl font-bold text-green-700">₦{totalWithFee?.toFixed(2)}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`₦${totalWithFee?.toFixed(2)}`);
                                        toast.success('Amount copied!');
                                    }}
                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy
                                </button>
                            </div>
                            <p className="text-sm text-green-600 mt-2">You'll receive <span className="font-semibold">₦{intendedAmount}</span></p>
                        </div>
                        
                        {/* Bank Details */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">Bank</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{accountDetails.bankName}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(accountDetails.bankName);
                                            toast.success('Bank name copied!');
                                        }}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">Account Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-medium text-gray-900">{accountDetails.accountNumber}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(accountDetails.accountNumber);
                                            toast.success('Account number copied!');
                                        }}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Account Name</span>
                                <span className="font-medium text-gray-900">TheSpark - {userFullName || 'User'}</span>
                            </div>
                        </div>
                        
                        {/* Fee breakdown - Dynamic */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-xs font-medium text-gray-700 mb-2">Fee breakdown</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Flutterwave processing fee (2%)</span>
                                    <span>₦{(totalWithFee * flutterwaveProcessingFee).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>CBN VAT (7.5% on fee)</span>
                                    <span>₦{(totalWithFee * flutterwaveProcessingFee * cbnVAT).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200">
                                    <span className="font-medium">Platform fee</span>
                                    <span className="font-medium text-amber-600">
                                        ₦{(totalWithFee - intendedAmount - (totalWithFee * flutterwaveProcessingFee) - (totalWithFee * flutterwaveProcessingFee * cbnVAT)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200">
                                    <span className="font-medium">Total fees</span>
                                    <span className="font-medium text-amber-600">₦{(totalWithFee - intendedAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-amber-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-amber-700">
                                ⏰ This window will close automatically in 10 seconds
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Waiting for Deposit Modal */}
            {waitingForDeposit && !depositConfirmed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <svg className="animate-spin h-8 w-8 text-spark-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Waiting for Deposit</h3>
                            <p className="text-sm text-gray-500 mt-1">We'll confirm your transfer automatically</p>
                        </div>
                        
                        {/* Bank Details - Same as deposit modal */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">Bank</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{accountDetails.bankName}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(accountDetails.bankName);
                                            toast.success('Bank name copied!');
                                        }}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">Account Number</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-medium text-gray-900">{accountDetails.accountNumber}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(accountDetails.accountNumber);
                                            toast.success('Account number copied!');
                                        }}
                                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Account Name</span>
                                <span className="font-medium text-gray-900">TheSpark - {userFullName || 'User'}</span>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Amount to transfer</span>
                                <span className="text-lg font-semibold text-gray-900">₦{totalWithFee?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                <span className="text-sm text-gray-500">You'll receive</span>
                                <span className="text-lg font-semibold text-green-600">₦{intendedAmount}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                <span className="text-sm text-gray-500">Processing fees</span>
                                <span className="text-sm font-medium text-amber-600">₦{(totalWithFee - intendedAmount).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {/* Fee breakdown - Dynamic */}
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-xs font-medium text-blue-800 mb-2">Fee breakdown</p>
                            <div className="space-y-1 text-xs text-blue-700">
                                <div className="flex justify-between">
                                    <span>Flutterwave fee (2%)</span>
                                    <span>₦{(totalWithFee * flutterwaveProcessingFee).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>CBN VAT (7.5%)</span>
                                    <span>₦{(totalWithFee * flutterwaveProcessingFee * cbnVAT).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform fee</span>
                                    <span>₦{(totalWithFee - intendedAmount - (totalWithFee * flutterwaveProcessingFee) - (totalWithFee * flutterwaveProcessingFee * cbnVAT)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={closeModal}
                            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Deposit Confirmed Modal */}
            {depositConfirmed && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Deposit Confirmed!</h3>
                        <p className="text-gray-500 mb-4">
                            Your deposit of <span className="font-semibold text-green-600">₦{intendedAmount}</span> has been credited to your wallet.
                        </p>
                        <button
                            onClick={closeModal}
                            className="w-full py-3 px-4 bg-spark-500 hover:bg-spark-600 text-white font-medium rounded-xl transition duration-200"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}