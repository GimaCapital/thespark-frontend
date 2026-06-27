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


import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Input, Button, Spin, Skeleton, Alert, Space, Tag, Popover } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

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

// NEW: Use a stable data structure that never changes shape
const DEFAULT_FEE_STATE = {
    data: null,
    isLoading: false,
    error: null,
    lastAmount: 0
};

// NEW: Fee display with visibility control (not conditional rendering)
const FeeDisplay = ({ amount, feeState, currentBalance, numAmount, totalCost }) => {
    const hasError = amount && feeState.data && totalCost > currentBalance;
    const showData = amount && feeState.data && !feeState.isLoading && numAmount > 0;
    const showLoading = amount && feeState.isLoading;
    const showPlaceholder = amount && !feeState.isLoading && !feeState.data;

    return (
        <div className="mt-1.5" style={{ minHeight: '26px' }}>
            {amount ? (
                <div className="flex justify-between text-sm px-1">
                    {/* Always render all states, control visibility with CSS */}
                    <span 
                        className="text-gray-500 flex items-center gap-1"
                        style={{ display: showLoading ? 'flex' : 'none' }}
                    >
                        <Spin size="small" /> Calculating fee...
                    </span>
                    
                    <span 
                        className="text-gray-500"
                        style={{ display: showPlaceholder ? 'inline' : 'none' }}
                    >
                        Calculating fee...
                    </span>
                    
                    <span 
                        className="text-gray-500"
                        style={{ display: showData ? 'inline' : 'none' }}
                    >
                        You'll receive: <span className="font-medium text-green-600">₦{numAmount.toFixed(2)}</span>
                    </span>
                    
                    <span 
                        className="text-gray-500"
                        style={{ display: showData ? 'inline' : 'none' }}
                    >
                        Total: <span className="font-medium text-spark-500">₦{totalCost.toFixed(2)}</span>
                    </span>
                    
                    <span 
                        className="text-gray-300"
                        style={{ display: showPlaceholder ? 'inline' : 'none' }}
                    >
                        —
                    </span>
                </div>
            ) : (
                <div className="text-sm text-gray-300 px-1">Enter amount to see breakdown</div>
            )}
            
            {/* FIX: Reserve space with fixed height, control content visibility */}
            <div style={{ height: '22px', overflow: 'hidden' }}>
                <div 
                    className="text-red-500 text-sm mt-0.5"
                    style={{ 
                        display: hasError ? 'block' : 'none',
                        opacity: hasError ? 1 : 0,
                        visibility: hasError ? 'visible' : 'hidden'
                    }}
                >
                    Insufficient balance. Need ₦{totalCost.toFixed(2)}
                </div>
                {/* Empty placeholder when no error - keeps the space reserved */}
                {!hasError && <div className="text-red-500 text-sm mt-0.5 invisible">Placeholder</div>}
            </div>
        </div>
    );
};

// NEW: Stable popover content with visibility control
const FeePopoverContent = ({ amount, feeState, numAmount, totalCost }) => {
    const showData = amount && feeState.data && !feeState.isLoading && numAmount > 0;
    const showLoading = feeState.isLoading;
    const showPlaceholder = amount && !feeState.isLoading && !feeState.data;

    return (
        <div className="p-2" style={{ minWidth: '170px', minHeight: '90px' }}>
            {/* Always render all states, control visibility */}
            <div 
                className="flex items-center gap-2 justify-center h-full"
                style={{ display: showLoading ? 'flex' : 'none' }}
            >
                <Spin size="small" />
                <span className="text-sm text-gray-500">Calculating...</span>
            </div>
            
            <div 
                className="flex items-center justify-center h-full"
                style={{ display: showPlaceholder ? 'flex' : 'none' }}
            >
                <span className="text-sm text-gray-400">Enter amount to see fee</span>
            </div>
            
            <div 
                className="space-y-1.5"
                style={{ display: showData ? 'block' : 'none' }}
            >
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fee</span>
                    <span className="font-medium">₦{feeState.data?.totalFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">You'll receive</span>
                    <span className="font-medium text-green-600">₦{numAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-spark-500">₦{totalCost.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

// NEW: Custom hook for managing fee state without re-renders
const useFeeCalculation = (amount) => {
    const [feeState, setFeeState] = useState(DEFAULT_FEE_STATE);
    const debounceTimerRef = useRef(null);
    const amountRef = useRef(amount);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        amountRef.current = amount;
        const numAmount = parseFloat(amount);

        // Clear any pending timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        // Reset state if amount is invalid
        if (!numAmount || numAmount <= 0) {
            setFeeState(prev => ({
                ...prev,
                data: null,
                isLoading: false,
                lastAmount: 0
            }));
            return;
        }

        // Set loading state
        setFeeState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            lastAmount: numAmount
        }));

        // Debounce the API call
        debounceTimerRef.current = setTimeout(async () => {
            try {
                const idToken = await auth.currentUser.getIdToken();
                setAuthToken(idToken);
                const response = await api.get(`/withdrawals/fee?amount=${numAmount}`);
                
                if (isMountedRef.current && amountRef.current === amount) {
                    setFeeState(prev => ({
                        ...prev,
                        data: response.data,
                        isLoading: false,
                        error: null
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch fee:', error);
                if (isMountedRef.current && amountRef.current === amount) {
                    setFeeState(prev => ({
                        ...prev,
                        data: null,
                        isLoading: false,
                        error: error.message
                    }));
                }
            } finally {
                if (isMountedRef.current && amountRef.current === amount) {
                    debounceTimerRef.current = null;
                }
            }
        }, 400);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
        };
    }, [amount]);

    return feeState;
};

export default function WithdrawModal({ isOpen, onClose, currentBalance, currentCycle, currentDay, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [bankAccount, setBankAccount] = useState(null);
    const [loadingBank, setLoadingBank] = useState(true);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    
    // Use the custom hook
    const feeState = useFeeCalculation(amount);
    
    const numAmount = parseFloat(amount) || 0;
    const totalCost = numAmount + (feeState.data?.totalFee || 0);
    const hasBankAccount = !!bankAccount;

    const handleClose = () => {
        setAmount('');
        setLoading(false);
        setIsPopoverOpen(false);
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            loadBankAccount();
        }
    }, [isOpen]);

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

        const totalCost = numAmount + (feeState.data?.totalFee || 0);
        if (totalCost > currentBalance) {
            toast.error(`Insufficient balance. Total cost: ₦${totalCost.toFixed(2)}`);
            return;
        }

        setLoading(true);

        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post('/withdrawals/request', { amount: numAmount });
            toast.success('Withdrawal request submitted for approval');
            handleClose();
            onSuccess();
        } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error(error.response?.data?.error || 'Failed to request withdrawal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            width={420}
            centered
            destroyOnHidden={true}
            mask={{
                closable: !loading
            }}
            title={
                <Space className="!gap-2">
                    <span className="text-xl w-9 h-9 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">🔥</span>
                    <span className="text-base font-semibold">Request Withdrawal</span>
                </Space>
            }
            styles={{
                body: {
                    padding: '20px 24px 24px 24px',
                }
            }}
        >
            {/* Balance - Slightly reduced spacing */}
            <div className="card-primary text-center mb-5 py-3">
                <div className="text-sm opacity-90">Available Balance</div>
                <div className="text-2xl font-bold">
                    ₦{currentBalance?.toLocaleString()}
                </div>
            </div>

            {/* Bank Account - Slightly reduced */}
            <div className="mb-3 min-h-[64px]">
                {loadingBank ? (
                    <Skeleton.Input active size="small" block />
                ) : hasBankAccount ? (
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                            {getBankIcon(bankAccount.bankName)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {bankAccount.bankName}
                                <CheckCircleOutlined className="text-green-500 ml-1 text-xs" />
                            </div>
                            <div className="text-xs text-gray-500">
                                {bankAccount.accountNumber}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Alert
                        title="No bank account added"
                        description="Please add a bank account before withdrawing"
                        type="warning"
                        showIcon
                        action={
                            <Button size="small" type="primary" onClick={() => {
                                handleClose();
                                window.location.href = '/bank-account';
                            }}>
                                Add Account
                            </Button>
                        }
                    />
                )}
            </div>

            {/* Amount Input - Slightly reduced */}
            <div className="mb-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Amount (₦)</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        size="large"
                        disabled={!hasBankAccount || loading}
                        prefix="₦"
                        className="flex-1"
                    />
                    {amount && (
                        <Popover
                            content={
                                <FeePopoverContent 
                                    amount={amount}
                                    feeState={feeState}
                                    numAmount={numAmount}
                                    totalCost={totalCost}
                                />
                            }
                            title={<span className="font-semibold">Fee Details</span>}
                            trigger="click"
                            placement="bottomRight"
                            open={isPopoverOpen}
                            onOpenChange={setIsPopoverOpen}
                        >
                            <Button 
                                type="default" 
                                size="large"
                                icon={<InfoCircleOutlined />}
                                className="flex-shrink-0"
                            >
                                Fee
                            </Button>
                        </Popover>
                    )}
                </div>
            </div>

            {/* Fee Display - Always renders, uses visibility control */}
            <FeeDisplay 
                amount={amount}
                feeState={feeState}
                currentBalance={currentBalance}
                numAmount={numAmount}
                totalCost={totalCost}
            />

            {/* Compact Warning - Medium size */}
            <div className="mb-4 mt-2">
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <WarningOutlined className="text-amber-500" />
                    <span>
                        <span className="font-medium">⚠️ Interest Warning:</span> Withdrawing during a cycle earns 0% interest.
                    </span>
                </div>
            </div>

            {/* Buttons - Original size */}
            <div className="flex gap-3">
                <Button
                    size="large"
                    className="flex-1"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    size="large"
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
                    Withdraw
                </Button>
            </div>
        </Modal>
    );
}