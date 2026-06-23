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
import { Modal, Input, Button, Spin, Typography, Divider, Skeleton, Space, Alert } from 'antd';
import { CheckCircleOutlined, WarningOutlined, LoadingOutlined } from '@ant-design/icons';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

const { Text } = Typography;

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

    const formatNumber = (value) => {
        if (value === undefined || value === null) return '0.00';
        return value.toFixed(2);
    };

    const hasBankAccount = !!bankAccount;

    return (
        <Modal
            title={
                <Space>
                    <span className="text-xl">💰</span>
                    <span className="text-lg font-semibold text-gray-800">Request Withdrawal</span>
                </Space>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={440}
            centered
            destroyOnClose
            maskClosable={!loading}
            className="withdraw-modal"
        >
            <div className="py-1">
                {/* Available Balance - Spark Color Background */}
                <div className="bg-gradient-to-r from-spark-500 to-spark-600 rounded-xl p-6 mb-5 text-center">
                    <span className="text-white/80 text-sm block">Available Balance</span>
                    <span className="text-3xl font-bold text-white">
                        ₦{currentBalance?.toLocaleString()}
                    </span>
                </div>

                {/* Bank Account - Clean Display */}
                {loadingBank ? (
                    <div className="mb-5">
                        <Skeleton.Input active size="small" block className="mb-2" />
                        <Skeleton.Input active size="small" block />
                    </div>
                ) : hasBankAccount ? (
                    <div className="mb-5">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                                {getBankIcon(bankAccount.bankName)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{bankAccount.bankName}</span>
                                    <CheckCircleOutlined className="text-green-500 text-xs" />
                                </div>
                                <span className="text-sm font-mono text-gray-600">{bankAccount.accountNumber}</span>
                                <span className="text-xs text-gray-400 block">{bankAccount.accountName}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-5">
                        <Alert
                            message="No Bank Account Added"
                            description="Please add a bank account before withdrawing"
                            type="warning"
                            showIcon
                            action={
                                <Button
                                    size="small"
                                    type="primary"
                                    className="bg-spark-500 hover:bg-spark-600 border-spark-500"
                                    onClick={() => {
                                        onClose();
                                        window.location.href = '/bank-account';
                                    }}
                                >
                                    Add Account
                                </Button>
                            }
                            className="rounded-xl"
                        />
                    </div>
                )}

                {/* Fee Breakdown - Clean */}
                {feeDetails && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                        <span className="text-xs font-medium text-gray-500 block mb-3">Fee Breakdown</span>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Withdrawal Fee</span>
                                <span>₦{formatNumber(feeDetails.fee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">VAT (7.5%)</span>
                                <span>₦{formatNumber(feeDetails.vat)}</span>
                            </div>
                            <Divider className="my-1" />
                            <div className="flex justify-between font-medium">
                                <span>Total Fee</span>
                                <span className="text-amber-600">₦{formatNumber(feeDetails.totalFee)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>You'll Receive</span>
                                <span className="text-green-600">₦{formatNumber(numAmount)}</span>
                            </div>
                            <Divider className="my-1" />
                            <div className="flex justify-between font-semibold">
                                <span>Total Cost</span>
                                <span className="text-spark-500">₦{formatNumber(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {calculatingFee && amount && (
                    <div className="text-center py-2 mb-3">
                        <Spin indicator={<LoadingOutlined spin />} size="small" />
                        <span className="text-xs text-gray-400 ml-2">Calculating fee...</span>
                    </div>
                )}

                {/* Warning - Clean Alert */}
                <Alert
                    message="⚠️ Interest Warning"
                    description="Money withdrawn during a cycle earns 0% interest for that cycle."
                    type="info"
                    showIcon
                    className="mb-5 rounded-xl bg-yellow-50 border-yellow-200"
                />

                {/* Amount Input */}
                <div className="mb-5">
                    <label className="font-medium text-gray-700 block mb-2 text-sm">Amount (₦)</label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        size="large"
                        disabled={!hasBankAccount || loading}
                        prefix="₦"
                        className="rounded-xl"
                    />
                    {amount && feeDetails && totalCost > currentBalance && (
                        <span className="text-red-500 text-xs block mt-2">
                            Insufficient balance. You need ₦{totalCost.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Action Buttons - Green Withdraw Button */}
                <div className="flex gap-3 mt-2">
                    <Button
                        size="large"
                        className="flex-1 rounded-xl h-12"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className="flex-1 rounded-xl h-12 font-semibold bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                        onClick={handleWithdraw}
                        loading={loading}
                        disabled={
                            loading ||
                            !hasBankAccount ||
                            !amount ||
                            totalCost > currentBalance ||
                            numAmount <= 0
                        }
                    >
                        {loading ? 'Processing...' : 'Withdraw'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}