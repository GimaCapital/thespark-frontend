// import React, { useState } from 'react';
// import { api, setAuthToken } from '../../services/api';
// import { auth } from '../../services/firebase';
// import toast from 'react-hot-toast';

// export default function WithdrawModal({ isOpen, onClose, currentBalance, currentCycle, currentDay, onSuccess }) {
//     const [amount, setAmount] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     if (!isOpen) return null;
    
//     const handleWithdraw = async () => {
//         const numAmount = parseInt(amount);
        
//         if (isNaN(numAmount) || numAmount <= 0) {
//             toast.error('Please enter a valid amount');
//             return;
//         }
        
//         if (numAmount > currentBalance) {
//             toast.error(`Insufficient balance. Your balance is ₦${currentBalance.toLocaleString()}`);
//             return;
//         }
        
//         setLoading(true);
        
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
            
//             await api.post('/withdrawals/request', {
//                 amount: numAmount,
//                 cycle: currentCycle,
//                 day: currentDay
//             });
            
//             toast.success('Withdrawal request submitted for approval');
//             setAmount('');
//             onSuccess();
//             onClose();
//         } catch (error) {
//             console.error('Withdrawal error:', error);
//             toast.error(error.response?.data?.error || 'Failed to request withdrawal');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <h2 className="modal-header">Request Withdrawal</h2>
//                 <div className="modal-body">
//                     <p className="text-body spacer-sm">
//                         Your current balance: <strong>₦{currentBalance?.toLocaleString()}</strong>
//                     </p>
//                     <p className="text-warning text-small spacer-md">
//                         ⚠️ Money withdrawn during a cycle earns 0% interest for that cycle.
//                     </p>
//                     <input
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="Enter amount"
//                         className="input"
//                     />
//                 </div>
//                 <div className="modal-footer">
//                     <button onClick={onClose} className="btn btn-secondary flex-1">
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleWithdraw}
//                         disabled={loading}
//                         className={`btn btn-danger flex-1 ${loading ? 'btn-disabled' : ''}`}
//                     >
//                         {loading ? 'Processing...' : 'Request Withdrawal'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

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

export default function WithdrawModal({ isOpen, onClose, currentBalance, currentCycle, currentDay, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [bankAccount, setBankAccount] = useState(null);
    const [loadingBank, setLoadingBank] = useState(true);
    const [feeDetails, setFeeDetails] = useState(null);
    const [calculatingFee, setCalculatingFee] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadBankAccount();
        }
    }, [isOpen]);

    // Fetch fee when amount changes
    useEffect(() => {
        const fetchFee = async () => {
            const numAmount = parseFloat(amount);
            if (!numAmount || numAmount <= 0) {
                setFeeDetails(null);
                return;
            }

            setCalculatingFee(true);
            try {
                const idToken = await auth.currentUser.getIdToken();
                setAuthToken(idToken);
                const response = await api.get(`/withdrawals/fee?amount=${numAmount}`);
                setFeeDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch fee:', error);
                setFeeDetails(null);
            } finally {
                setCalculatingFee(false);
            }
        };

        const debounceTimer = setTimeout(fetchFee, 400);
        return () => clearTimeout(debounceTimer);
    }, [amount]);

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

    if (!isOpen) return null;

    const handleWithdraw = async () => {
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!bankAccount) {
            toast.error('Please add a bank account first');
            return;
        }

        const totalCost = numAmount + (feeDetails?.totalFee || 0);
        if (totalCost > currentBalance) {
            toast.error(`Insufficient balance. Total cost: ₦${totalCost.toFixed(2)} (withdrawal + fee)`);
            return;
        }

        setLoading(true);

        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);

            await api.post('/withdrawals/request', {
                amount: numAmount
            });

            toast.success('Withdrawal request submitted for approval');
            setAmount('');
            setFeeDetails(null);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error(error.response?.data?.error || 'Failed to request withdrawal');
        } finally {
            setLoading(false);
        }
    };

    const numAmount = parseFloat(amount);
    const totalCost = numAmount + (feeDetails?.totalFee || 0);

    // Safely format numbers with fallback
    const formatNumber = (value) => {
        if (value === undefined || value === null) return '0.00';
        return value.toFixed(2);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-header">Request Withdrawal</h2>
                <div className="modal-body">
                    <p className="text-body spacer-sm">
                        Available Balance: <strong>₦{currentBalance?.toLocaleString()}</strong>
                    </p>

                    {/* DYNAMIC BANK ACCOUNT DISPLAY */}
                    {loadingBank ? (
                        <div className="text-center py-3">
                            <div className="spinner-sm"></div>
                        </div>
                    ) : bankAccount ? (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
                            <p className="text-xs text-gray-500 font-medium mb-2">💰 Money will be sent to:</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <span className="text-xl">{getBankIcon(bankAccount.bankName)}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{bankAccount.bankName}</p>
                                    <p className="text-sm font-mono text-gray-600">{bankAccount.accountNumber}</p>
                                    <p className="text-xs text-gray-500">{bankAccount.accountName}</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs text-green-600">Verified account</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⚠️</span>
                                <div>
                                    <p className="text-sm font-medium text-amber-800">No Bank Account Added</p>
                                    <p className="text-xs text-amber-700">Please add a bank account before withdrawing</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/bank-account';
                                }}
                                className="mt-2 text-xs bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 transition"
                            >
                                Add Bank Account →
                            </button>
                        </div>
                    )}

                    {/* Fee Breakdown - with safe checks */}
                    {feeDetails && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Fee Breakdown</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Withdrawal Fee</span>
                                    <span>₦{formatNumber(feeDetails.fee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>VAT (7.5%)</span>
                                    <span>₦{formatNumber(feeDetails.vat)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200 font-medium">
                                    <span>Total Fee</span>
                                    <span className="text-amber-600">₦{formatNumber(feeDetails.totalFee)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200 font-medium">
                                    <span>You'll Receive</span>
                                    <span className="text-green-600">₦{formatNumber(numAmount)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-200 font-semibold">
                                    <span>Total Cost</span>
                                    <span className="text-spark-500">₦{formatNumber(totalCost)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {calculatingFee && amount && (
                        <div className="text-center py-2">
                            <div className="spinner-sm"></div>
                            <p className="text-xs text-gray-400 mt-1">Calculating fee...</p>
                        </div>
                    )}

                    <p className="text-warning text-small spacer-md">
                        ⚠️ Money withdrawn during a cycle earns 0% interest for that cycle.
                    </p>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="input"
                        disabled={!bankAccount || loading}
                    />

                    {amount && feeDetails && totalCost > currentBalance && (
                        <p className="text-xs text-red-500 mt-2">
                            Insufficient balance. You need ₦{totalCost.toFixed(2)} (withdrawal + fee)
                        </p>
                    )}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary flex-1">
                        Cancel
                    </button>
                    <button
                        onClick={handleWithdraw}
                        disabled={loading || !bankAccount || !amount || totalCost > currentBalance}
                        className={`btn btn-danger flex-1 ${loading || !bankAccount || !amount || totalCost > currentBalance ? 'btn-disabled' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Request Withdrawal'}
                    </button>
                </div>
            </div>
        </div>
    );
}