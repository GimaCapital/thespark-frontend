import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function FlutterwaveVirtualAccount() {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [isScratching, setIsScratching] = useState(false);
    const navigate = useNavigate();

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

    const handleScratch = () => {
        setIsScratching(true);
        setTimeout(() => {
            setShowAccount(true);
            setIsScratching(false);
            toast.success('🎉 Account details revealed!', {
                icon: '✨',
                duration: 2000,
            });
        }, 800);
    };

    const handleInitiateDeposit = () => {
        navigate('/dashboard');
        
        const tryScroll = (attempt = 0) => {
            const depositSection = document.querySelector('.daily-savings-section');
            
            if (depositSection) {
                depositSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                depositSection.style.transition = 'background-color 0.5s';
                depositSection.style.backgroundColor = '#fef3c7';
                setTimeout(() => {
                    depositSection.style.backgroundColor = '';
                }, 1500);
                
                setTimeout(() => {
                    const depositInput = depositSection.querySelector('input[type="number"]');
                    if (depositInput) {
                        depositInput.focus();
                        depositInput.select();
                    }
                }, 600);
                
                toast.success('📍 Scrolled to deposit section!');
            } else if (attempt < 10) {
                setTimeout(() => tryScroll(attempt + 1), 500);
            } else {
                toast('Please click the "Savings" tab to make a deposit', {
                    icon: '💡',
                    duration: 4000,
                });
            }
        };
        
        setTimeout(() => tryScroll(0), 300);
    };

    // ✅ Mask Bank Name - S******** BANK
    const maskBankName = (name) => {
        if (!name) return '••••••••••••••••';
        if (name.length <= 5) return name;
        const first = name.charAt(0);
        const lastPart = name.slice(-4);
        const middle = '*'.repeat(name.length - 5);
        return `${first}${middle} ${lastPart}`;
    };

    // ✅ Mask Account Number - 8******* 16
    const maskAccountNumber = (number) => {
        if (!number) return '••••••••••••••••';
        const digits = number.replace(/\D/g, '');
        if (digits.length <= 3) return digits;
        const first = digits.charAt(0);
        const last = digits.slice(-2);
        const middle = '*'.repeat(digits.length - 3);
        return `${first}${middle} ${last}`;
    };

    // ✅ Mask Account Name - G***********n
    const maskAccountName = (name) => {
        if (!name) return '••••••••••••••••';
        
        if (name.includes('/')) {
            const parts = name.split('/');
            const lastPart = parts[1] ? parts[1].trim() : parts[0].trim();
            
            const maskWord = (word) => {
                if (!word) return '******';
                if (word.length <= 2) return word;
                const first = word.charAt(0);
                const last = word.charAt(word.length - 1);
                const middle = '*'.repeat(word.length - 2);
                return `${first}${middle}${last}`;
            };
            
            const maskFullName = (fullName) => {
                if (!fullName) return '******';
                const words = fullName.split(' ');
                const maskedWords = words.map(word => maskWord(word));
                return maskedWords.join(' ');
            };
            
            return maskFullName(lastPart);
        }
        
        if (name.length <= 3) return name;
        const first = name.charAt(0);
        const last = name.charAt(name.length - 1);
        const middle = '*'.repeat(name.length - 2);
        return `${first}${middle}${last}`;
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

    // ✅ SCRATCH CARD VIEW
    if (!showAccount) {
        return (
            <div className="card relative overflow-hidden" style={{ minHeight: '320px' }}>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 mb-0">🏦 Your TheSpark Account</h4>
                </div>

                <div className="relative">
                    <div className="space-y-3 select-none pointer-events-none">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Bank Name</span>
                            <span className="text-sm font-medium text-gray-900">{maskBankName(accountDetails.bankName)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Account Number</span>
                            <span className="text-sm font-mono font-bold text-gray-900">
                                {maskAccountNumber(accountDetails.accountNumber)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Account Name</span>
                            <span className="text-sm font-medium text-gray-900">{maskAccountName(accountDetails.fullName || 'User')}</span>
                        </div>
                    </div>

                    {/* Scratch Card Overlay */}
                    <div 
                        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-all duration-500 ${
                            isScratching ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                        }`}
                        style={{
                            background: 'linear-gradient(145deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
                            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            minHeight: '180px',
                        }}
                        onClick={handleScratch}
                    >
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute top-0 left-0 w-full h-px bg-white/30" style={{ top: '10%' }}></div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/30" style={{ top: '30%' }}></div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/30" style={{ top: '50%' }}></div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/30" style={{ top: '70%' }}></div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/30" style={{ top: '90%' }}></div>
                            <div className="absolute top-0 left-0 w-px h-full bg-white/20" style={{ left: '20%' }}></div>
                            <div className="absolute top-0 left-0 w-px h-full bg-white/20" style={{ left: '40%' }}></div>
                            <div className="absolute top-0 left-0 w-px h-full bg-white/20" style={{ left: '60%' }}></div>
                            <div className="absolute top-0 left-0 w-px h-full bg-white/20" style={{ left: '80%' }}></div>
                        </div>

                        <div className="relative z-10 text-center p-6">
                            <div className="text-5xl mb-3">🎰</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Scratch to Reveal</h3>
                            <p className="text-sm text-gray-600 mb-3 max-w-xs">
                                Click or tap to reveal your masked account details
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 rounded-full text-xs text-gray-700">
                                <span>🔒</span>
                                <span>Secure</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                <span>🔐</span>
                                <span>Encrypted</span>
                            </div>
                            {isScratching && (
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-spark-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-spark-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-spark-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            )}
                        </div>

                        {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-60 animate-pulse">
                            ✨ Click to scratch ✨
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }

    // ✅ REVEALED VIEW - Clean Professional Design
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 mb-0">🏦 Your TheSpark Account</h4>
                <button
                    onClick={() => {
                        setShowAccount(false);
                        toast.info('Account details hidden', { icon: '🔒', duration: 2000 });
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                    Hide
                </button>
            </div>

            {/* Professional Info Message - Clean design */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Security Note:</span>   Click to initiate deposit and your full account details will be shown during the deposit process on this dashboard.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Bank Name</span>
                    <span className="text-sm font-medium text-gray-900">{maskBankName(accountDetails.bankName)}</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-gray-900">
                            {maskAccountNumber(accountDetails.accountNumber)}
                        </span>
                        <button
                            onClick={() => copyToClipboard(maskAccountNumber(accountDetails.accountNumber))}
                            className="text-spark-500 hover:text-spark-600 text-sm font-medium transition"
                        >
                            {copied ? '✅' : '📋 Copy'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Account Name</span>
                    <span className="text-sm font-medium text-gray-900">{maskAccountName(accountDetails.fullName || 'User')}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleInitiateDeposit}
                        className="w-full py-3 bg-gradient-to-r from-spark-400 to-spark-600 hover:from-spark-500 hover:to-spark-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        💰 Initiate Deposit
                    </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                     It is TheSpark's policy to protect your account
                  </p>
                </div>
            </div>
        </div>
    );
}