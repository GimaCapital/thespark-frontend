import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

export default function FlutterwaveVirtualAccount() {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadAccountDetails();
    }, []);

    const loadAccountDetails = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/flutterwave/my-account');
            
            if (response.data.hasAccount) {
                setAccountDetails(response.data);
            }
        } catch (error) {
            console.error('Failed to load account details:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Account number copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-spark-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-gray-400 mt-2">Loading account details...</p>
                </div>
            </div>
        );
    }

    if (!accountDetails) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🏦</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">No Account Found</h4>
                <p className="text-sm text-gray-500 mb-4">Your virtual account is being set up.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-spark-500 text-white text-sm font-medium rounded-lg hover:bg-spark-600 transition"
                >
                    Refresh
                </button>
            </div>
        );
    }

    // Format account number with spaces for readability
    const formatAccountNumber = (number) => {
        if (!number) return '';
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Bank Card Style Header */}
            <div className="bg-gradient-to-r from-spark-500 to-spark-600 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Virtual Account</p>
                        <p className="text-white font-semibold text-sm mt-0.5">Fund your wallet instantly</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-white/80 text-xs">Active</span>
                    </div>
                </div>
            </div>

            {/* Account Details */}
            <div className="p-5">
                {/* Bank Name */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm">🏛️</span>
                    <span className="text-sm text-gray-600">{accountDetails.bankName}</span>
                </div>

                {/* Account Number - Highlighted */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Account Number</p>
                            <p className="text-2xl font-bold text-gray-900 tracking-wider mt-1">
                                {formatAccountNumber(accountDetails.accountNumber)}
                            </p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(accountDetails.accountNumber)}
                            className="p-2 bg-white rounded-lg border border-gray-200 hover:border-spark-300 hover:bg-spark-50 transition"
                            title="Copy account number"
                        >
                            {copied ? (
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Account Name */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-gray-400">👤</span>
                    <span className="text-gray-600">TheSpark / {accountDetails.fullName || 'User'}</span>
                </div>

                {/* Instruction */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                        <span className="text-blue-500 text-sm mt-0.5">💡</span>
                        <div>
                            <p className="text-xs font-medium text-blue-800">How to deposit</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                                Transfer ₦100 - ₦2,000 to this account. Your wallet will be credited instantly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        🔒 Secured
                    </span>
                    <span className="w-px h-3 bg-gray-200"></span>
                    <span className="flex items-center gap-1">
                        ⚡ Instant
                    </span>
                    <span className="w-px h-3 bg-gray-200"></span>
                    <span className="flex items-center gap-1">
                        🏦 Flutterwave
                    </span>
                </div>
            </div>
        </div>
    );
}