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
                <div className="spinner"></div>
            </div>
        );
    }

    if (!accountDetails) {
        return (
            <div className="card text-center py-8">
                <div className="text-5xl mb-3">🏦</div>
                <p className="text-body text-sm">Setting up your account...</p>
            </div>
        );
    }

    // Format account number with spaces for readability
    const formatAccountNumber = (number) => {
        if (!number) return '';
        return number.replace(/(\d{4})/g, '$1 ').trim();
    };

    return (
        <div className="card">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 mb-0">🏦 Your TheSpark Account</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
            </div>

            {/* Account Details */}
            <div className="space-y-3">
                {/* Bank Name */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Bank Name</span>
                    <span className="text-sm font-medium text-gray-900">{accountDetails.bankName}</span>
                </div>

                {/* Account Number */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-gray-900">
                            {formatAccountNumber(accountDetails.accountNumber)}
                        </span>
                        <button
                            onClick={() => copyToClipboard(accountDetails.accountNumber)}
                            className="text-spark-500 hover:text-spark-600 text-sm font-medium transition"
                        >
                            {copied ? '✅' : '📋 Copy'}
                        </button>
                    </div>
                </div>

                {/* Account Name */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Name</span>
                    <span className="text-sm font-medium text-gray-900">
                        TheSpark / {accountDetails.fullName || 'User'}
                    </span>
                </div>
            </div>
        </div>
    );
}