// import React, { useState, useEffect } from 'react';
// import { api, setAuthToken } from '../../services/api';
// import { auth } from '../../services/firebase';
// import toast from 'react-hot-toast';

// export default function DailySavingsLog({ userId, currentCycle, currentDay, onSave, userFullName, userPlan }) {
//     const [amount, setAmount] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//     const [waitingForDeposit, setWaitingForDeposit] = useState(false);
//     const [intendedAmount, setIntendedAmount] = useState(null);
//     const [totalWithFee, setTotalWithFee] = useState(null);
//     const [accountDetails, setAccountDetails] = useState(null);
//     const [planLimits, setPlanLimits] = useState({ min: 100, max: 2000 });
//     const [depositConfirmed, setDepositConfirmed] = useState(false);

//     const flutterwaveProcessingFee = 0.02;
//     const cbnVAT = 0.075;

//     // Calculate total with 4.6% markup (covers Flutterwave fee + VAT + profit)
//     const calculateTotal = (amount) => {
//         return Math.ceil(amount * 1.046 / 10) * 10;
//     };

//     // Get plan limits based on user's plan
//     useEffect(() => {
//         const fetchPlanLimits = async () => {
//             try {
//                 const idToken = await auth.currentUser.getIdToken();
//                 setAuthToken(idToken);
//                 const response = await api.get('/users/me');
//                 const user = response.data;
//                 const plan = user.premiumPlan || 'Basic';
                
//                 const limits = {
//                     'Basic': { min: 100, max: 2000 },
//                     'Premium': { min: 500, max: 5000 },
//                     'Investor': { min: 1000, max: 20000 }
//                 }[plan];
                
//                 setPlanLimits(limits);
//             } catch (error) {
//                 console.error('Failed to fetch plan limits:', error);
//             }
//         };
        
//         fetchPlanLimits();
//         fetchAccountDetails();
//     }, []);

//     const fetchAccountDetails = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/flutterwave/my-account');
//             setAccountDetails(response.data);
//         } catch (error) {
//             console.error('Failed to fetch account:', error);
//         }
//     };

//     // Poll for deposit confirmation
//     useEffect(() => {
//         let interval;
//         if (waitingForDeposit && !depositConfirmed) {
//             interval = setInterval(async () => {
//                 try {
//                     const idToken = await auth.currentUser.getIdToken();
//                     setAuthToken(idToken);
//                     const response = await api.get('/deposits/check-intent');
                    
//                     if (response.data.matched) {
//                         // ✅ STANDARD APPROACH: Call confirm-intent IMMEDIATELY
//                         // This prevents the intent from being returned again
//                         if (response.data.intentId) {
//                             await api.post('/deposits/confirm-intent', {
//                                 intentId: response.data.intentId
//                             });
//                         }
                        
//                         setDepositConfirmed(true);
//                         setWaitingForDeposit(false);
//                         toast.success('✅ Deposit confirmed! Your wallet has been credited.');
//                         setTimeout(() => {
//                             setShowModal(false);
//                             setDepositConfirmed(false);
//                             setAmount('');
//                             if (onSave) onSave();
//                         }, 3000);
//                     }
//                 } catch (error) {
//                     console.error('Failed to check deposit status:', error);
//                 }
//             }, 5000);
//         }
//         return () => {
//             if (interval) clearInterval(interval);
//         };
//     }, [waitingForDeposit, depositConfirmed, onSave]);

//     const handleSaveClick = async () => {
//         const numAmount = parseFloat(amount);
        
//         if (isNaN(numAmount) || numAmount < planLimits.min || numAmount > planLimits.max) {
//             toast.error(`Amount must be between ₦${planLimits.min} and ₦${planLimits.max} for your plan`);
//             return;
//         }

//         const total = calculateTotal(numAmount);
//         setIntendedAmount(numAmount);
//         setTotalWithFee(total);
        
//         setLoading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
            
//             // Store deposit intent
//             await api.post('/deposits/intent', {
//                 amount: numAmount,
//                 cycle: currentCycle,
//                 day: currentDay
//             });
            
//             setShowModal(true);
            
//             // Auto-close modal after 10 seconds and start waiting
//             setTimeout(() => {
//                 setShowModal(false);
//                 setWaitingForDeposit(true);
//                 toast.success('Deposit initiated! Complete the transfer from your banking app.', { icon: '💰' });
//             }, 10000);
            
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to initiate deposit');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setWaitingForDeposit(false);
//         setDepositConfirmed(false);
//         setAmount('');
//         if (onSave) onSave();
//     };

//     return (
//         <>
//             <div className="p-4">
//                 <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-lg font-semibold text-gray-900">💰 Daily Savings</h3>
//                     <span className="text-xs text-gray-500">
//                         Limit: ₦{planLimits.min} - ₦{planLimits.max}
//                     </span>
//                 </div>
                
//                 <div className="flex gap-3">
//                     <input
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder={`Amount (₦${planLimits.min} - ₦${planLimits.max})`}
//                         className="input flex-1"
//                         disabled={loading}
//                     />
//                     <button
//                         onClick={handleSaveClick}
//                         disabled={loading || !amount}
//                         className="btn btn-primary"
//                     >
//                         {loading ? 'Processing...' : 'Initiate Deposit'}
//                     </button>
//                 </div>
                
//                 <p className="text-xs text-gray-400 mt-2">
//                     Initiate deposit first, then transfer the amount shown
//                 </p>
//             </div>

//             {/* Deposit Instructions Modal */}
//             {showModal && accountDetails && !waitingForDeposit && !depositConfirmed && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//                     <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-xl font-semibold text-gray-900">Complete Deposit</h3>
//                             <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>
                        
//                         {/* Amount to Transfer */}
//                         <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 text-center border border-green-200">
//                             <p className="text-xs text-green-700 uppercase tracking-wide mb-2">Amount to Transfer</p>
//                             <div className="flex items-center justify-center gap-3">
//                                 <span className="text-4xl font-bold text-green-700">₦{totalWithFee?.toFixed(2)}</span>
//                                 <button
//                                     onClick={() => {
//                                         navigator.clipboard.writeText(`₦${totalWithFee?.toFixed(2)}`);
//                                         toast.success('Amount copied!');
//                                     }}
//                                     className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
//                                 >
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                                     </svg>
//                                     Copy
//                                 </button>
//                             </div>
//                             <p className="text-sm text-green-600 mt-2">You'll receive <span className="font-semibold">₦{intendedAmount}</span></p>
//                         </div>
                        
//                         {/* Bank Details */}
//                         <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
//                             <div className="flex items-center justify-between mb-3">
//                                 <span className="text-sm text-gray-500">Bank</span>
//                                 <div className="flex items-center gap-2">
//                                     <span className="font-medium text-gray-900">{accountDetails.bankName}</span>
//                                     <button
//                                         onClick={() => {
//                                             navigator.clipboard.writeText(accountDetails.bankName);
//                                             toast.success('Bank name copied!');
//                                         }}
//                                         className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                                         </svg>
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between mb-3">
//                                 <span className="text-sm text-gray-500">Account Number</span>
//                                 <div className="flex items-center gap-2">
//                                     <span className="font-mono font-medium text-gray-900">{accountDetails.accountNumber}</span>
//                                     <button
//                                         onClick={() => {
//                                             navigator.clipboard.writeText(accountDetails.accountNumber);
//                                             toast.success('Account number copied!');
//                                         }}
//                                         className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                                         </svg>
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm text-gray-500">Account Name</span>
//                                 <span className="font-medium text-gray-900">TheSpark - {userFullName || 'User'}</span>
//                             </div>
//                         </div>
                        
//                         {/* Fee breakdown - Dynamic */}
//                         <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                             <p className="text-xs font-medium text-gray-700 mb-2">Fee breakdown</p>
//                             <div className="space-y-1 text-xs text-gray-600">
//                                 <div className="flex justify-between">
//                                     <span>Flutterwave processing fee (2%)</span>
//                                     <span>₦{(totalWithFee * flutterwaveProcessingFee).toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>CBN VAT (7.5% on fee)</span>
//                                     <span>₦{(totalWithFee * flutterwaveProcessingFee * cbnVAT).toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between pt-1 border-t border-gray-200">
//                                     <span className="font-medium">Platform fee</span>
//                                     <span className="font-medium text-amber-600">
//                                         ₦{(totalWithFee - intendedAmount - (totalWithFee * flutterwaveProcessingFee) - (totalWithFee * flutterwaveProcessingFee * cbnVAT)).toFixed(2)}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between pt-1 border-t border-gray-200">
//                                     <span className="font-medium">Total fees</span>
//                                     <span className="font-medium text-amber-600">₦{(totalWithFee - intendedAmount).toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="bg-amber-50 rounded-xl p-3 text-center">
//                             <p className="text-xs text-amber-700">
//                                 ⏰ This window will close automatically in 10 seconds
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Waiting for Deposit Modal */}
//             {waitingForDeposit && !depositConfirmed && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//                     <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
//                         <div className="text-center mb-6">
//                             <div className="w-16 h-16 mx-auto mb-4">
//                                 <svg className="animate-spin h-8 w-8 text-spark-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900">Waiting for Deposit</h3>
//                             <p className="text-sm text-gray-500 mt-1">We'll confirm your transfer automatically</p>
//                         </div>
                        
//                         {/* Bank Details - Same as deposit modal */}
//                         <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
//                             <div className="flex items-center justify-between mb-3">
//                                 <span className="text-sm text-gray-500">Bank</span>
//                                 <div className="flex items-center gap-2">
//                                     <span className="font-medium text-gray-900">{accountDetails.bankName}</span>
//                                     <button
//                                         onClick={() => {
//                                             navigator.clipboard.writeText(accountDetails.bankName);
//                                             toast.success('Bank name copied!');
//                                         }}
//                                         className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                                         </svg>
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between mb-3">
//                                 <span className="text-sm text-gray-500">Account Number</span>
//                                 <div className="flex items-center gap-2">
//                                     <span className="font-mono font-medium text-gray-900">{accountDetails.accountNumber}</span>
//                                     <button
//                                         onClick={() => {
//                                             navigator.clipboard.writeText(accountDetails.accountNumber);
//                                             toast.success('Account number copied!');
//                                         }}
//                                         className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
//                                     >
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                                         </svg>
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm text-gray-500">Account Name</span>
//                                 <span className="font-medium text-gray-900">TheSpark - {userFullName || 'User'}</span>
//                             </div>
//                         </div>
                        
//                         <div className="bg-gray-50 rounded-xl p-4 mb-6">
//                             <div className="flex justify-between items-center py-2">
//                                 <span className="text-sm text-gray-500">Amount to transfer</span>
//                                 <span className="text-lg font-semibold text-gray-900">₦{totalWithFee?.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between items-center py-2 border-t border-gray-200">
//                                 <span className="text-sm text-gray-500">You'll receive</span>
//                                 <span className="text-lg font-semibold text-green-600">₦{intendedAmount}</span>
//                             </div>
//                             <div className="flex justify-between items-center py-2 border-t border-gray-200">
//                                 <span className="text-sm text-gray-500">Processing fees</span>
//                                 <span className="text-sm font-medium text-amber-600">₦{(totalWithFee - intendedAmount).toFixed(2)}</span>
//                             </div>
//                         </div>
                        
//                         {/* Fee breakdown - Dynamic */}
//                         <div className="bg-blue-50 rounded-xl p-4 mb-6">
//                             <p className="text-xs font-medium text-blue-800 mb-2">Fee breakdown</p>
//                             <div className="space-y-1 text-xs text-blue-700">
//                                 <div className="flex justify-between">
//                                     <span>Flutterwave fee (2%)</span>
//                                     <span>₦{(totalWithFee * flutterwaveProcessingFee).toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>CBN VAT (7.5%)</span>
//                                     <span>₦{(totalWithFee * flutterwaveProcessingFee * cbnVAT).toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>Platform fee</span>
//                                     <span>₦{(totalWithFee - intendedAmount - (totalWithFee * flutterwaveProcessingFee) - (totalWithFee * flutterwaveProcessingFee * cbnVAT)).toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <button
//                             onClick={closeModal}
//                             className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-200"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Deposit Confirmed Modal */}
//             {depositConfirmed && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//                     <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl text-center">
//                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                         </div>
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">Deposit Confirmed!</h3>
//                         <p className="text-gray-500 mb-4">
//                             Your deposit of <span className="font-semibold text-green-600">₦{intendedAmount}</span> has been credited to your wallet.
//                         </p>
//                         <button
//                             onClick={closeModal}
//                             className="w-full py-3 px-4 bg-spark-500 hover:bg-spark-600 text-white font-medium rounded-xl transition duration-200"
//                         >
//                             Continue
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

import React, { useState, useEffect, useRef } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import { getPlanLimits } from '../../utils/planLimits';
import { calculateTotal, calculateFeeBreakdown } from '../../utils/feeUtils';
import toast from 'react-hot-toast';

// Fee display with visibility control
const FeeDisplay = ({ amount, totalWithFee, intendedAmount, feeBreakdown, isCalculating }) => {
    const hasAmount = amount && parseFloat(amount) > 0;
    const showData = hasAmount && feeBreakdown && !isCalculating;
    const showLoading = hasAmount && isCalculating;
    const showPlaceholder = hasAmount && !isCalculating && !feeBreakdown;

    return (
        <div className="mt-1.5" style={{ minHeight: '24px' }}>
            {hasAmount ? (
                <div className="flex justify-between text-xs px-1">
                    <span 
                        className="text-gray-500 flex items-center gap-1"
                        style={{ display: showLoading ? 'flex' : 'none' }}
                    >
                        <svg className="animate-spin h-3 w-3 text-spark-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating fee...
                    </span>
                    
                    <span 
                        className="text-gray-400"
                        style={{ display: showPlaceholder ? 'inline' : 'none' }}
                    >
                        Calculating fee...
                    </span>
                    
                    <span 
                        className="text-gray-500"
                        style={{ display: showData ? 'inline' : 'none' }}
                    >
                        You'll send: <span className="font-medium text-amber-600">₦{totalWithFee?.toFixed(2)}</span>
                    </span>
                    
                    <span 
                        className="text-gray-500"
                        style={{ display: showData ? 'inline' : 'none' }}
                    >
                        Receive: <span className="font-medium text-green-600">₦{intendedAmount?.toFixed(2)}</span>
                    </span>
                    
                    <span 
                        className="text-gray-300"
                        style={{ display: showPlaceholder ? 'inline' : 'none' }}
                    >
                        —
                    </span>
                </div>
            ) : (
                <div className="text-xs text-gray-300 px-1">Enter amount to see breakdown</div>
            )}
            
            <div style={{ height: '18px', overflow: 'hidden' }}>
                <div 
                    className="text-amber-600 text-[10px] mt-0.5 px-1"
                    style={{ 
                        display: showData ? 'block' : 'none',
                        opacity: showData ? 1 : 0,
                        visibility: showData ? 'visible' : 'hidden'
                    }}
                >
                    Fee: ₦{feeBreakdown?.totalFees?.toFixed(2)} (includes platform fee & VAT)
                </div>
                {!showData && <div className="text-amber-600 text-[10px] mt-0.5 px-1 invisible">Placeholder</div>}
            </div>
        </div>
    );
};

// Fee popover for detailed breakdown
const FeePopover = ({ feeBreakdown, isCalculating, totalWithFee, intendedAmount, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const showData = feeBreakdown && !isCalculating;
    const showLoading = isCalculating;

    return (
        <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[200px]">
            <div style={{ minHeight: '80px' }}>
                <div 
                    className="flex items-center gap-2 justify-center h-full"
                    style={{ display: showLoading ? 'flex' : 'none' }}
                >
                    <svg className="animate-spin h-4 w-4 text-spark-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-500">Calculating fee...</span>
                </div>
                
                <div 
                    className="flex items-center justify-center h-full"
                    style={{ display: !showData && !showLoading ? 'flex' : 'none' }}
                >
                    <span className="text-sm text-gray-400">Enter amount to see fee</span>
                </div>
                
                <div 
                    className="space-y-1.5"
                    style={{ display: showData ? 'block' : 'none' }}
                >
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">You'll send</span>
                        <span className="font-medium text-amber-600">₦{totalWithFee?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">You'll receive</span>
                        <span className="font-medium text-green-600">₦{intendedAmount?.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Flutterwave fee (2%)</span>
                            <span>₦{feeBreakdown?.flutterwaveFee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>CBN VAT (7.5%)</span>
                            <span>₦{feeBreakdown?.vat?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-amber-600 border-t border-gray-200 pt-1 mt-1">
                            <span>Total fees</span>
                            <span>₦{feeBreakdown?.totalFees?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DailySavingsLog({ currentCycle, currentDay, onSave, userFullName }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [waitingForDeposit, setWaitingForDeposit] = useState(false);
    const [intendedAmount, setIntendedAmount] = useState(null);
    const [totalWithFee, setTotalWithFee] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);
    const [planLimits, setPlanLimits] = useState({ min: 100, max: 2000 });
    const [depositConfirmed, setDepositConfirmed] = useState(false);
    const [feeBreakdown, setFeeBreakdown] = useState(null);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);
    const [showFeePopover, setShowFeePopover] = useState(false);
    const debounceTimerRef = useRef(null);

    useEffect(() => {
        const fetchPlanLimits = async () => {
            try {
                const idToken = await auth.currentUser.getIdToken();
                setAuthToken(idToken);
                const response = await api.get('/users/me');
                const user = response.data;
                const plan = user.premiumPlan || 'Basic';
                
                const limits = getPlanLimits(plan);
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

    useEffect(() => {
        const numAmount = parseFloat(amount);
        
        if (!numAmount || numAmount <= 0) {
            setFeeBreakdown(null);
            setIsCalculatingFee(false);
            setTotalWithFee(null);
            setIntendedAmount(null);
            return;
        }

        setIsCalculatingFee(true);
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const total = calculateTotal(numAmount);
            const fees = calculateFeeBreakdown(total, numAmount);
            setFeeBreakdown(fees);
            setTotalWithFee(total);
            setIntendedAmount(numAmount);
            setIsCalculatingFee(false);
            debounceTimerRef.current = null;
        }, 400);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [amount]);

    useEffect(() => {
        let interval;
        if (waitingForDeposit && !depositConfirmed) {
            interval = setInterval(async () => {
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    setAuthToken(idToken);
                    const response = await api.get('/deposits/check-intent');
                    
                    if (response.data.matched) {
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
        const fees = calculateFeeBreakdown(total, numAmount);
        
        setIntendedAmount(numAmount);
        setTotalWithFee(total);
        setFeeBreakdown(fees);
        
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            await api.post('/deposits/intent', {
                amount: numAmount,
                cycle: currentCycle,
                day: currentDay
            });
            
            setShowModal(true);
            
            setTimeout(() => {
                setShowModal(false);
                setWaitingForDeposit(true);
                toast.success('Deposit initiated! Complete the transfer from your banking app.', { icon: '💰' });
            }, 30000);
            
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
        setShowFeePopover(false);
        if (onSave) onSave();
    };

    const renderModal = (children) => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] px-3 py-4 sm:py-0">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-auto shadow-2xl max-h-[92vh] overflow-y-auto animate-slide-up">
                {children}
            </div>
        </div>
    );

    const CloseButton = ({ onClose }) => (
        <button 
            onClick={onClose} 
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
            aria-label="Close"
        >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );

    // Copy function
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    return (
        <>
            <div className="p-4 daily-savings-section">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">💰 Daily Savings</h3>
                    <span className="text-xs text-gray-500">
                        Limit: ₦{planLimits.min} - ₦{planLimits.max}
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Amount (₦${planLimits.min} - ₦${planLimits.max})`}
                            className="input w-full"
                            disabled={loading}
                        />
                        {amount && parseFloat(amount) > 0 && (
                            <button
                                onClick={() => setShowFeePopover(!showFeePopover)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition"
                            >
                                Fee Info
                            </button>
                        )}
                        <FeePopover 
                            feeBreakdown={feeBreakdown}
                            isCalculating={isCalculatingFee}
                            totalWithFee={totalWithFee}
                            intendedAmount={intendedAmount}
                            isOpen={showFeePopover}
                            onClose={() => setShowFeePopover(false)}
                        />
                    </div>
                    <button
                        onClick={handleSaveClick}
                        disabled={loading || !amount}
                        className="btn btn-primary w-full sm:w-auto"
                    >
                        {loading ? 'Processing...' : 'Initiate Deposit'}
                    </button>
                </div>
                
                <FeeDisplay 
                    amount={amount}
                    totalWithFee={totalWithFee}
                    intendedAmount={intendedAmount}
                    feeBreakdown={feeBreakdown}
                    isCalculating={isCalculatingFee}
                />
                
                <p className="text-xs text-gray-400 mt-2">
                    Initiate deposit first, then transfer the amount shown
                </p>
            </div>

            {/* Deposit Instructions Modal */}
            {showModal && accountDetails && !waitingForDeposit && !depositConfirmed && (
                renderModal(
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">💳 Complete Deposit</h3>
                            <CloseButton onClose={closeModal} />
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-4 text-center border-2 border-green-200 shadow-md">
                            <p className="text-xs text-green-700 uppercase tracking-wider font-bold mb-1">
                                ⭐ You Must Transfer This Amount ⭐
                            </p>
                            <p className="text-4xl sm:text-5xl font-bold text-green-700 tracking-tight">
                                ₦{totalWithFee?.toFixed(2)}
                            </p>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <button
                                    onClick={() => copyToClipboard(`₦${totalWithFee?.toFixed(2)}`, 'Amount')}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copy Amount
                                </button>
                            </div>
                            <p className="text-sm text-green-600 mt-3 font-medium">
                                You will receive <span className="font-bold">₦{intendedAmount?.toFixed(2)}</span> in your wallet
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-2.5 mb-3 border border-blue-100">
                            <p className="text-xs text-blue-700 text-center">
                                💡 <span className="font-semibold">Why this amount?</span> The extra ₦{((totalWithFee || 0) - (intendedAmount || 0)).toFixed(2)} covers payment processing fees.
                            </p>
                        </div>

                        {/* UPDATED: Transfer to Account Header with Brand Color (spark) */}
                        <div className="bg-gradient-to-r from-spark-50 to-spark-100 rounded-xl p-3 mb-3 border-2 border-spark-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-spark-700">🏦 Transfer to Your Thespark Account</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Bank</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{accountDetails.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountDetails.bankName, 'Bank name')}
                                            className="text-xs bg-spark-100 hover:bg-spark-200 text-spark-700 px-2 py-1 rounded transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-gray-900 text-base">{accountDetails.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountDetails.accountNumber, 'Account number')}
                                            className="text-xs bg-spark-100 hover:bg-spark-200 text-spark-700 px-2 py-1 rounded transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Account Name</span>
                                    <span className="font-medium text-gray-900 text-sm">TheSpark - {userFullName || 'User'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-2 text-center">
                            <p className="text-xs text-amber-700">
                                ⏰ This window will close automatically in 30 seconds
                            </p>
                        </div>
                    </div>
                )
            )}

            {/* Waiting for Deposit Modal */}
            {waitingForDeposit && !depositConfirmed && (
                renderModal(
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">⏳ Waiting for Deposit</h3>
                            <CloseButton onClose={closeModal} />
                        </div>

                        <div className="text-center mb-3">
                            <div className="w-12 h-12 mx-auto mb-2">
                                <svg className="animate-spin h-8 w-8 text-spark-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Waiting for your transfer confirmation</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-3 text-center border-2 border-green-200">
                            <p className="text-xs text-green-700 uppercase tracking-wider font-bold mb-0.5">
                                Send This Amount
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                                ₦{totalWithFee?.toFixed(2)}
                            </p>
                            <button
                                onClick={() => copyToClipboard(`₦${totalWithFee?.toFixed(2)}`, 'Amount')}
                                className="mt-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                            >
                                Copy Amount
                            </button>
                            
                            <div className="mt-2 pt-2 border-t border-green-200 flex justify-center items-center gap-4 text-xs">
                                <span className="text-green-700">
                                    Receive: <span className="font-bold">₦{intendedAmount?.toFixed(2)}</span>
                                </span>
                                <span className="text-green-700">
                                    Fees: <span className="font-medium text-amber-600">₦{feeBreakdown?.totalFees?.toFixed(2)}</span>
                                </span>
                            </div>
                        </div>

                        {/* UPDATED: Transfer to Account Header with Brand Color (spark) */}
                        <div className="bg-gradient-to-r from-spark-50 to-spark-100 rounded-xl p-3 mb-3 border-2 border-spark-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-spark-700">🏦 Transfer to Your Thespark Account</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Bank</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{accountDetails?.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountDetails?.bankName, 'Bank name')}
                                            className="text-xs bg-spark-100 hover:bg-spark-200 text-spark-700 px-2 py-1 rounded transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-gray-900 text-base">{accountDetails?.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(accountDetails?.accountNumber, 'Account number')}
                                            className="text-xs bg-spark-100 hover:bg-spark-200 text-spark-700 px-2 py-1 rounded transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/70 rounded-lg p-2">
                                    <span className="text-xs text-gray-600">Account Name</span>
                                    <span className="font-medium text-gray-900 text-sm">TheSpark - {userFullName || 'User'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition duration-200 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                )
            )}

            {/* Deposit Confirmed Modal */}
            {depositConfirmed && (
                renderModal(
                    <div className="p-5 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Deposit Confirmed! 🎉</h3>
                        <p className="text-gray-500 mb-6">
                            Your deposit of <span className="font-semibold text-green-600">₦{intendedAmount?.toFixed(2)}</span> has been credited to your wallet.
                        </p>
                        <button
                            onClick={closeModal}
                            className="w-full py-3 px-4 bg-spark-500 hover:bg-spark-600 text-white font-medium rounded-xl transition duration-200"
                        >
                            Continue
                        </button>
                    </div>
                )
            )}
        </>
    );
}