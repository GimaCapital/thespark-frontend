import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Investor() {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [step, setStep] = useState('code');
    const [accessCode, setAccessCode] = useState('');
    const [investorName, setInvestorName] = useState('');
    const [sessionToken, setSessionToken] = useState('');
    const [sessionExpiry, setSessionExpiry] = useState(0);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpTimer, setOtpTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    // ✅ Admin check
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsScrolled, setTermsScrolled] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        investmentAmount: '',
        customAmount: '',
        agreeTerms: false
    });
    const timerRef = useRef(null);
    const otpInputRefs = useRef([]);

    // Load user data if logged in
    useEffect(() => {
        if (user || userData) {
            setFormData(prev => ({
                ...prev,
                fullName: userData?.fullName || user?.displayName || prev.fullName,
                email: userData?.email || user?.email || prev.email,
                phone: userData?.phone || user?.phone || userData?.phoneNumber || user?.phoneNumber || prev.phone,
            }));
        }
    }, [user, userData]);

    // ✅ Check if user is admin - if so, bypass all security
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    setAuthToken(idToken);
                    const response = await api.get('/admin/check-admin');
                    if (response.data.isAdmin) {
                        setIsAdminUser(true);
                        // ✅ Admin bypass - go directly to details
                        setStep('details');
                        // Pre-fill with admin's data
                        setFormData(prev => ({
                            ...prev,
                            fullName: userData?.fullName || user?.displayName || 'Admin User',
                            email: user?.email || '',
                            phone: userData?.phone || '',
                            agreeTerms: true,
                            investmentAmount: 200000,
                            customAmount: '200000'
                        }));
                        toast.info('👑 Admin access granted - Security bypassed');
                    }
                } catch (error) {
                    console.log('Not an admin user');
                }
            }
            setCheckingAdmin(false);
        };
        checkAdminStatus();
    }, [user, userData]);

    // Clean up timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // ============ STEP 1: VERIFY CODE (Regular Users Only) ============
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!accessCode || accessCode.length < 4) {
            toast.error('Please enter a valid access code');
            return;
        }

        setVerifying(true);
        try {
            const response = await api.post('/investment/verify-code', { 
                accessCode: accessCode.toUpperCase() 
            });
            
            if (response.data.success) {
                setInvestorName(response.data.investorName || '');
                setStep('form');
                toast.success('✅ Access code verified! Please fill in your details.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            const errorMsg = error.response?.data?.error || 'Invalid or expired access code';
            toast.error(errorMsg);
            
            if (error.response?.status === 429) {
                toast.error('Too many attempts. Please wait 1 hour.');
            }
        } finally {
            setVerifying(false);
        }
    };

    // ============ STEP 2: REQUEST OTP (Regular Users Only) ============
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        
        if (!formData.agreeTerms) {
            toast.error('Please read and agree to the terms and conditions');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (formData.phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/investment/request-otp', {
                accessCode: accessCode.toUpperCase(),
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            });
            
            if (response.data.success) {
                setStep('otp');
                setOtpTimer(response.data.expiresIn || 5);
                setCanResend(false);
                startTimer(response.data.expiresIn || 5);
                toast.success(`✅ OTP sent to ${formData.email}. Please check your inbox.`);
                
                setTimeout(() => {
                    if (otpInputRefs.current[0]) {
                        otpInputRefs.current[0].focus();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            const errorMsg = error.response?.data?.error || 'Failed to send OTP';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ============ OTP TIMER ============
    const startTimer = (minutes) => {
        let timeLeft = minutes * 60;
        
        if (timerRef.current) clearInterval(timerRef.current);
        
        timerRef.current = setInterval(() => {
            timeLeft--;
            setOtpTimer(Math.floor(timeLeft / 60));
            
            if (timeLeft <= 0) {
                clearInterval(timerRef.current);
                setCanResend(true);
            }
        }, 1000);
    };

    // ============ HANDLE OTP INPUT ============
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
        
        if (value && index === 5 && newOtp.every(d => d)) {
            handleVerifyOTP(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            const otpValue = otp.join('');
            if (otpValue.length === 6) {
                handleVerifyOTP(otpValue);
            }
        }
    };

    // ============ STEP 3: VERIFY OTP (Regular Users Only) ============
    const handleVerifyOTP = async (otpValue) => {
        if (otpValue.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/investment/verify-otp', {
                accessCode: accessCode.toUpperCase(),
                email: formData.email,
                otp: otpValue
            });
            
            if (response.data.success) {
                setSessionToken(response.data.sessionToken);
                setSessionExpiry(response.data.expiresIn || 60);
                setStep('details');
                toast.success('✅ OTP verified! View the investment details below.');
                
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            const errorMsg = error.response?.data?.error || 'Invalid OTP';
            toast.error(errorMsg);
            
            if (errorMsg.includes('attempts')) {
                setOtp(['', '', '', '', '', '']);
                otpInputRefs.current[0]?.focus();
            }
        } finally {
            setLoading(false);
        }
    };

    // ============ RESEND OTP ============
    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const response = await api.post('/investment/request-otp', {
                accessCode: accessCode.toUpperCase(),
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            });
            
            if (response.data.success) {
                setOtp(['', '', '', '', '', '']);
                setOtpTimer(response.data.expiresIn || 5);
                setCanResend(false);
                startTimer(response.data.expiresIn || 5);
                toast.success(`✅ New OTP sent to ${formData.email}`);
                
                setTimeout(() => {
                    if (otpInputRefs.current[0]) {
                        otpInputRefs.current[0].focus();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error(error.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // ============ SUBMIT INTEREST ============
    const handleSubmitInterest = async (investmentAmount) => {
        // ✅ Admin bypass - submit directly
        if (isAdminUser) {
            setLoading(true);
            try {
                const idToken = await user.getIdToken();
                setAuthToken(idToken);
                
                const response = await api.post('/investment/interest', {
                    accessCode: 'ADMIN-' + Date.now(),
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    investmentAmount: parseInt(investmentAmount),
                    sessionToken: 'admin-' + Date.now(),
                    agreeTerms: true
                });
                
                if (response.data.success) {
                    setStep('submitted');
                    toast.success('🎉 Interest submitted successfully! (Admin)');
                }
            } catch (error) {
                console.error('Error submitting interest:', error);
                const errorMsg = error.response?.data?.error || 'Failed to submit interest';
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
            return;
        }

        // ✅ Regular user flow - check session token
        if (!sessionToken) {
            toast.error('Session expired. Please verify your email again.');
            setStep('otp');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/investment/interest', {
                accessCode: accessCode.toUpperCase(),
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                investmentAmount: parseInt(investmentAmount),
                sessionToken: sessionToken,
                agreeTerms: formData.agreeTerms
            });
            
            if (response.data.success) {
                setStep('submitted');
                toast.success('🎉 Interest submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting interest:', error);
            const errorMsg = error.response?.data?.error || 'Failed to submit interest';
            toast.error(errorMsg);
            
            if (errorMsg.includes('Session expired') || errorMsg.includes('session')) {
                setStep('otp');
                toast.error('Session expired. Please verify your email again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // ============ TERMS MODAL HANDLERS ============
    const handleTermsScroll = (e) => {
        const element = e.target;
        const isScrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
        if (isScrolledToBottom && !termsScrolled) {
            setTermsScrolled(true);
        }
    };

    const handleAgreeTerms = () => {
        if (!termsScrolled) {
            toast.error('Please scroll to the bottom of the terms to read them fully');
            return;
        }
        setTermsAgreed(true);
        setFormData({...formData, agreeTerms: true});
        setShowTermsModal(false);
        toast.success('✅ Terms accepted!');
    };

    // ============================================================
    // ✅ ADMIN VIEW - Full page with admin bypass (No security)
    // ============================================================
    if (isAdminUser && step === 'details') {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Admin Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">👑</span>
                                <div>
                                    <p className="font-medium text-blue-800">Admin Mode</p>
                                    <p className="text-sm text-blue-600">Security bypassed - Full access</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            investmentAmount: '',
                                            customAmount: ''
                                        }));
                                        toast.info('🔄 Form reset');
                                    }}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-xl transition-all"
                                >
                                    🔄 Reset Form
                                </button>
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-xl transition-all"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Investment Page - Full Content */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            👑 Admin Access
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Investment Opportunity</h1>
                        <p className="text-gray-500 mt-2">Join us in scaling financial literacy across Nigeria</p>
                        <p className="text-sm text-spark-600 mt-2">Welcome, {formData.fullName || 'Admin'}!</p>
                        <div className="inline-block mt-3 px-3 py-1 bg-spark-50 text-spark-600 rounded-full text-sm font-medium">
                            Private Invitation Only
                        </div>
                        <p className="text-xs text-blue-600 mt-3">
                            🔓 Admin Mode - Security bypassed
                        </p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">₦5M</div>
                            <div className="text-xs text-gray-500">Total Target</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">50</div>
                            <div className="text-xs text-gray-500">Investors</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">5 Yrs</div>
                            <div className="text-xs text-gray-500">Term</div>
                        </div>
                    </div>

                    {/* Investment Structure */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">1</div>
                                <div>
                                    <p className="font-medium text-gray-900">Phase 1: Return Capital (Years 1-2)</p>
                                    <p className="text-sm text-gray-500">100% of profits go to investors until they get their full investment back</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-spark-100 rounded-full flex items-center justify-center text-spark-600 font-bold text-sm flex-shrink-0">2</div>
                                <div>
                                    <p className="font-medium text-gray-900">Phase 2: Share Profits (Years 3-5)</p>
                                    <p className="text-sm text-gray-500">After capital is returned, 30% of profits go to investors</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">3</div>
                                <div>
                                    <p className="font-medium text-gray-900">Your Investment</p>
                                    <p className="text-sm text-gray-500">Invest ₦100,000 or more. The more you invest, the more you earn.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investment Amount Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Choose Your Investment Amount</h3>
                        <p className="text-sm text-gray-500 mb-4">Minimum investment: ₦100,000</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {[100000, 200000, 300000, 500000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setFormData({...formData, investmentAmount: amount, customAmount: amount.toString()})}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                                        formData.investmentAmount === amount
                                            ? 'border-spark-500 bg-spark-50 text-spark-600'
                                            : 'border-gray-200 hover:border-spark-300 text-gray-700'
                                    }`}
                                >
                                    <div className="font-semibold">₦{amount / 1000}K</div>
                                    <div className="text-xs text-gray-400">
                                        {amount === 100000 ? 'Minimum' :
                                         amount === 200000 ? 'Popular' :
                                         amount === 300000 ? 'Best Value' : 'Maximum'}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</div>
                            <input
                                type="text"
                                name="customAmount"
                                value={formData.customAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setFormData({
                                            ...formData,
                                            customAmount: value,
                                            investmentAmount: value ? parseInt(value) : ''
                                        });
                                    }
                                }}
                                placeholder="Enter any amount (e.g. 250000)"
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                            />
                        </div>
                        {formData.customAmount && parseInt(formData.customAmount) < 100000 && (
                            <p className="text-red-500 text-sm mt-2">Minimum investment is ₦100,000</p>
                        )}
                        {formData.customAmount && parseInt(formData.customAmount) >= 100000 && (
                            <p className="text-green-500 text-sm mt-2">✅ You're investing ₦{parseInt(formData.customAmount).toLocaleString()}</p>
                        )}
                    </div>

                    {/* Expected Returns */}
                    {formData.investmentAmount && parseInt(formData.investmentAmount) >= 100000 && (
                        <div className="bg-spark-50 rounded-xl p-4 border border-spark-200 mb-8">
                            <h4 className="font-semibold text-spark-800 mb-2">Your Expected Return</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Your Investment</p>
                                    <p className="font-bold text-gray-900">₦{parseInt(formData.investmentAmount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Estimated Return (5 Years)</p>
                                    <p className="font-bold text-spark-600">₦{Math.round(parseInt(formData.investmentAmount) * 1.72).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Profit</p>
                                    <p className="font-bold text-green-600">₦{Math.round(parseInt(formData.investmentAmount) * 0.72).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Return on Investment</p>
                                    <p className="font-bold text-spark-600">72%</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Risk Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                        <p className="text-sm text-amber-700">
                            ⚠️ This is a private profit-sharing investment. All information is confidential.
                            <br />
                            <span className="font-medium">Investment is at risk. No guaranteed returns.</span>
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 text-lg mb-4">Express Interest</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This is a private invitation. All information will be kept strictly confidential.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-400 mt-1">We'll use this to contact you about the investment</p>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => {
                                        if (!formData.agreeTerms) {
                                            setShowTermsModal(true);
                                        } else {
                                            setFormData({...formData, agreeTerms: e.target.checked});
                                        }
                                    }}
                                    className="mt-1"
                                />
                                <div>
                                    <label className="text-sm text-gray-600">
                                        I confirm that this is a private investment invitation and I understand the profit-sharing terms.
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            Investment is at risk. No guaranteed returns.
                                        </span>
                                        <br />
                                        <button
                                            type="button"
                                            onClick={() => setShowTermsModal(true)}
                                            className="text-xs text-spark-500 hover:underline mt-1"
                                        >
                                            📄 View full terms and conditions
                                        </button>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={() => handleSubmitInterest(formData.investmentAmount)}
                                disabled={loading || !formData.investmentAmount || parseInt(formData.investmentAmount) < 100000 || !formData.phone}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                                    loading || !formData.investmentAmount || parseInt(formData.investmentAmount) < 100000 || !formData.phone
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-spark-500 hover:bg-spark-600'
                                }`}
                            >
                                {loading ? 'Submitting...' : '💰 Submit Interest'}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-2">
                                👑 Admin Mode - Security bypassed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms Modal */}
                {showTermsModal && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            if (formData.agreeTerms) {
                                setShowTermsModal(false);
                            }
                        }}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📄</span>
                                        <h3 className="text-xl font-bold text-gray-900">Terms and Conditions</h3>
                                    </div>
                                    {formData.agreeTerms && (
                                        <button
                                            onClick={() => setShowTermsModal(false)}
                                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div 
                                className="flex-1 overflow-y-auto p-6 space-y-4"
                                onScroll={handleTermsScroll}
                            >
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-700 font-medium">⚠️ Please read all terms carefully before agreeing</p>
                                </div>

                                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                                    <h4 className="text-lg font-semibold text-gray-900">1. Investment Structure</h4>
                                    <p>
                                        This is a <strong>private profit-sharing investment</strong> opportunity. The investment structure consists of two phases:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>
                                            <strong>Phase 1 (Years 1-2):</strong> 100% of profits go to investors until they receive their full initial investment back.
                                        </li>
                                        <li>
                                            <strong>Phase 2 (Years 3-5):</strong> After capital is returned, 30% of profits are distributed to investors.
                                        </li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">2. Risk Disclosure</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-700 font-medium">⚠️ IMPORTANT RISK WARNING</p>
                                        <ul className="list-disc pl-6 space-y-1 text-red-600 mt-2">
                                            <li>Investment is <strong>at risk</strong>. There are <strong>no guaranteed returns</strong>.</li>
                                            <li>Past performance does not guarantee future results.</li>
                                            <li>You may lose some or all of your investment.</li>
                                            <li>This is a <strong>private</strong> investment opportunity, not a public offering.</li>
                                        </ul>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">3. Confidentiality</h4>
                                    <p>
                                        All information provided about this investment opportunity is <strong>strictly confidential</strong>. 
                                        You agree not to share any details, documents, or information with any third party without explicit written consent.
                                    </p>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">4. Investment Amount</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Minimum investment: <strong>₦100,000</strong></li>
                                        <li>Maximum investment: <strong>₦500,000</strong></li>
                                        <li>Investment amount must be in multiples of ₦10,000</li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">5. Term and Return</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Investment term: <strong>5 Years</strong></li>
                                        <li>Target return: <strong>72%</strong> over 5 years</li>
                                        <li>Returns are based on actual business performance</li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">6. Privacy</h4>
                                    <p>
                                        We collect and process your personal information (name, email, phone) solely for the purpose of 
                                        managing your investment interest. Your data will not be shared with third parties without your consent.
                                    </p>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">7. Acknowledgment</h4>
                                    <p>
                                        By agreeing to these terms, you acknowledge that:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>You have read and understood all terms and conditions</li>
                                        <li>You accept the risks associated with this investment</li>
                                        <li>You are making this investment voluntarily</li>
                                        <li>You understand that this is a private invitation only</li>
                                    </ul>

                                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                        <p className="text-xs text-gray-500">
                                            Last updated: June 24, 2026
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${termsScrolled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xs text-gray-500">
                                            {termsScrolled ? '✅ Terms read' : '⚠️ Please scroll to bottom'}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        {!formData.agreeTerms && (
                                            <button
                                                onClick={() => setShowTermsModal(false)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAgreeTerms}
                                            disabled={!termsScrolled || formData.agreeTerms}
                                            className={`px-6 py-2 text-white text-sm font-medium rounded-xl transition-all ${
                                                !termsScrolled || formData.agreeTerms
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-spark-500 hover:bg-spark-600'
                                            }`}
                                        >
                                            {formData.agreeTerms ? '✅ Already Agreed' : '📝 I Agree to Terms'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ============================================================
    // REGULAR USER FLOW (Full security)
    // ============================================================

    // Show access code screen if not verified
    if (step === 'code') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">🔐</div>
                        <h1 className="text-2xl font-bold text-gray-900">Private Investment</h1>
                        <p className="text-gray-500 mt-2">Enter your access code to continue</p>
                        <p className="text-xs text-gray-400 mt-1">Code expires in 24 hours • One-time use</p>
                        {user && (
                            <p className="text-xs text-green-600 mt-2">
                                ✅ Logged in as: <span className="font-medium">{user.email}</span>
                            </p>
                        )}
                        {!user && (
                            <p className="text-xs text-blue-600 mt-2">
                                💡 No account needed! Just enter your code below.
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                                placeholder="Enter your access code (e.g. A3F7B9C2)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-center text-xl font-mono tracking-widest uppercase"
                                autoFocus
                            />
                            <p className="text-xs text-amber-600 mt-2">
                                ⚠️ This code can only be used once and expires in 24 hours
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={verifying || !accessCode}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                                verifying || !accessCode
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-spark-500 hover:bg-spark-600'
                            }`}
                        >
                            {verifying ? 'Verifying...' : '🔓 Verify & Continue'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            This is a private investment opportunity. 
                            <br />Contact Gideon for your access code.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // STEP 2: FORM (Name, Email, Phone) - Regular Flow
    if (step === 'form') {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-3">📝</div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
                            <p className="text-gray-500 mt-2">
                                Please provide your information to verify your identity
                            </p>
                            {investorName && (
                                <p className="text-sm text-spark-600 mt-1">Welcome, {investorName}!</p>
                            )}
                            <p className="text-xs text-gray-400 mt-3">
                                🔒 Your information is encrypted and secure
                            </p>
                        </div>

                        <form onSubmit={handleRequestOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    placeholder="Enter your email address"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    We'll send a verification code to this email
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                    placeholder="Enter your phone number (e.g. 08012345678)"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-400 mt-1">We'll use this to contact you about the investment</p>
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => {
                                        if (!formData.agreeTerms) {
                                            setShowTermsModal(true);
                                        } else {
                                            setFormData({...formData, agreeTerms: e.target.checked});
                                        }
                                    }}
                                    className="mt-1 w-5 h-5 text-spark-500 rounded border-gray-300 focus:ring-spark-500"
                                />
                                <div>
                                    <label className="text-sm text-gray-600">
                                        I confirm that this is a private investment invitation and I understand the profit-sharing terms.
                                        <br />
                                        <span className="text-xs text-gray-400">
                                            Investment is at risk. No guaranteed returns.
                                        </span>
                                        <br />
                                        <button
                                            type="button"
                                            onClick={() => setShowTermsModal(true)}
                                            className="text-xs text-spark-500 hover:underline mt-1"
                                        >
                                            📄 View full terms and conditions
                                        </button>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !formData.agreeTerms || !formData.fullName || !formData.email || !formData.phone}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                                    loading || !formData.agreeTerms || !formData.fullName || !formData.email || !formData.phone
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-spark-500 hover:bg-spark-600'
                                }`}
                            >
                                {loading ? 'Sending...' : '📧 Send Verification Code'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Terms Modal */}
                {showTermsModal && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => {
                            if (formData.agreeTerms) {
                                setShowTermsModal(false);
                            }
                        }}
                    >
                        <div 
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📄</span>
                                        <h3 className="text-xl font-bold text-gray-900">Terms and Conditions</h3>
                                    </div>
                                    {formData.agreeTerms && (
                                        <button
                                            onClick={() => setShowTermsModal(false)}
                                            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div 
                                className="flex-1 overflow-y-auto p-6 space-y-4"
                                onScroll={handleTermsScroll}
                            >
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-700 font-medium">⚠️ Please read all terms carefully before agreeing</p>
                                </div>

                                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                                    <h4 className="text-lg font-semibold text-gray-900">1. Investment Structure</h4>
                                    <p>
                                        This is a <strong>private profit-sharing investment</strong> opportunity. The investment structure consists of two phases:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>
                                            <strong>Phase 1 (Years 1-2):</strong> 100% of profits go to investors until they receive their full initial investment back.
                                        </li>
                                        <li>
                                            <strong>Phase 2 (Years 3-5):</strong> After capital is returned, 30% of profits are distributed to investors.
                                        </li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">2. Risk Disclosure</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-red-700 font-medium">⚠️ IMPORTANT RISK WARNING</p>
                                        <ul className="list-disc pl-6 space-y-1 text-red-600 mt-2">
                                            <li>Investment is <strong>at risk</strong>. There are <strong>no guaranteed returns</strong>.</li>
                                            <li>Past performance does not guarantee future results.</li>
                                            <li>You may lose some or all of your investment.</li>
                                            <li>This is a <strong>private</strong> investment opportunity, not a public offering.</li>
                                        </ul>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">3. Confidentiality</h4>
                                    <p>
                                        All information provided about this investment opportunity is <strong>strictly confidential</strong>. 
                                        You agree not to share any details, documents, or information with any third party without explicit written consent.
                                    </p>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">4. Investment Amount</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Minimum investment: <strong>₦100,000</strong></li>
                                        <li>Maximum investment: <strong>₦500,000</strong></li>
                                        <li>Investment amount must be in multiples of ₦10,000</li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">5. Term and Return</h4>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Investment term: <strong>5 Years</strong></li>
                                        <li>Target return: <strong>72%</strong> over 5 years</li>
                                        <li>Returns are based on actual business performance</li>
                                    </ul>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">6. Privacy</h4>
                                    <p>
                                        We collect and process your personal information (name, email, phone) solely for the purpose of 
                                        managing your investment interest. Your data will not be shared with third parties without your consent.
                                    </p>

                                    <h4 className="text-lg font-semibold text-gray-900 pt-4">7. Acknowledgment</h4>
                                    <p>
                                        By agreeing to these terms, you acknowledge that:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>You have read and understood all terms and conditions</li>
                                        <li>You accept the risks associated with this investment</li>
                                        <li>You are making this investment voluntarily</li>
                                        <li>You understand that this is a private invitation only</li>
                                    </ul>

                                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                        <p className="text-xs text-gray-500">
                                            Last updated: June 24, 2026
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${termsScrolled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xs text-gray-500">
                                            {termsScrolled ? '✅ Terms read' : '⚠️ Please scroll to bottom'}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        {!formData.agreeTerms && (
                                            <button
                                                onClick={() => setShowTermsModal(false)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAgreeTerms}
                                            disabled={!termsScrolled || formData.agreeTerms}
                                            className={`px-6 py-2 text-white text-sm font-medium rounded-xl transition-all ${
                                                !termsScrolled || formData.agreeTerms
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-spark-500 hover:bg-spark-600'
                                            }`}
                                        >
                                            {formData.agreeTerms ? '✅ Already Agreed' : '📝 I Agree to Terms'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // STEP 3: OTP VERIFICATION
    if (step === 'otp') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📧</div>
                        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                        <p className="text-gray-500 mt-2">
                            We sent a 6-digit code to
                        </p>
                        <p className="font-medium text-gray-900">{formData.email}</p>
                        <p className="text-xs text-gray-400 mt-3">
                            Code expires in {otpTimer} minute{otpTimer !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mb-8">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                                key={index}
                                ref={(el) => (otpInputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-spark-500 focus:ring-2 focus:ring-spark-500 focus:outline-none"
                                disabled={loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => handleVerifyOTP(otp.join(''))}
                        disabled={loading || otp.some(d => !d)}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                            loading || otp.some(d => !d)
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-spark-500 hover:bg-spark-600'
                        }`}
                    >
                        {loading ? 'Verifying...' : '✅ Verify OTP'}
                    </button>

                    <div className="mt-4 text-center">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="text-sm text-spark-500 hover:text-spark-600 font-medium"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="text-sm text-gray-400">
                                Resend available in {otpTimer} minute{otpTimer !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 text-center border-t border-gray-100 pt-4">
                        <button
                            onClick={() => setStep('form')}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← Back to form
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // STEP 4: INVESTMENT DETAILS + SUBMIT (Regular User)
    if (step === 'details' && !isAdminUser) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-block mb-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✅ Verified & Authenticated
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Investment Opportunity</h1>
                        <p className="text-gray-500 mt-2">Join us in scaling financial literacy across Nigeria</p>
                        <p className="text-sm text-spark-600 mt-2">Welcome, {formData.fullName}!</p>
                        <div className="inline-block mt-3 px-3 py-1 bg-spark-50 text-spark-600 rounded-full text-sm font-medium">
                            Private Invitation Only
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            🔒 Session expires in {sessionExpiry} minutes
                        </p>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">₦5M</div>
                            <div className="text-xs text-gray-500">Total Target</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">50</div>
                            <div className="text-xs text-gray-500">Investors</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className="text-2xl font-bold text-spark-600">5 Yrs</div>
                            <div className="text-xs text-gray-500">Term</div>
                        </div>
                    </div>

                    {/* Investment Structure */}
                    {/* Investment Structure */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">1</div>
                                <div>
                                    <p className="font-medium text-gray-900">Phase 1: Return Capital (Years 1-2)</p>
                                    <p className="text-sm text-gray-500">100% of profits go to investors until they get their full investment back</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-spark-100 rounded-full flex items-center justify-center text-spark-600 font-bold text-sm flex-shrink-0">2</div>
                                <div>
                                    <p className="font-medium text-gray-900">Phase 2: Share Profits (Years 3-5)</p>
                                    <p className="text-sm text-gray-500">After capital is returned, 30% of profits go to investors</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">3</div>
                                <div>
                                    <p className="font-medium text-gray-900">Your Investment</p>
                                    <p className="text-sm text-gray-500">Invest ₦100,000 or more. The more you invest, the more you earn.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ ADD THIS SECTION HERE */}
                    <div className="bg-gradient-to-r from-spark-50 to-amber-50 rounded-xl shadow-sm border border-spark-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">🌟 Investor Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Referral Bonus</p>
                                    <p className="text-xs text-gray-500">Earn ₦1,000 per referred investor</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">📊</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Monthly Reports</p>
                                    <p className="text-xs text-gray-500">Private performance reports</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">👑</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">VIP Status</p>
                                    <p className="text-xs text-gray-500">Special investor badge</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">🎯</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Early Access</p>
                                    <p className="text-xs text-gray-500">First access to new rounds</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">📞</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Direct Access</p>
                                    <p className="text-xs text-gray-500">Direct contact with the team</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Investor Certificate</p>
                                    <p className="text-xs text-gray-500">Official certificate of investment</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">🔄</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Priority Withdrawals</p>
                                    <p className="text-xs text-gray-500">Faster withdrawal processing</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-2xl">👥</span>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Private Community</p>
                                    <p className="text-xs text-gray-500">Exclusive investor group</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investment Amount Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Choose Your Investment Amount</h3>
                        <p className="text-sm text-gray-500 mb-4">Minimum investment: ₦100,000</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {[100000, 200000, 300000, 500000].map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setFormData({...formData, investmentAmount: amount, customAmount: amount.toString()})}
                                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                                        formData.investmentAmount === amount
                                            ? 'border-spark-500 bg-spark-50 text-spark-600'
                                            : 'border-gray-200 hover:border-spark-300 text-gray-700'
                                    }`}
                                >
                                    <div className="font-semibold">₦{amount / 1000}K</div>
                                    <div className="text-xs text-gray-400">
                                        {amount === 100000 ? 'Minimum' :
                                         amount === 200000 ? 'Popular' :
                                         amount === 300000 ? 'Best Value' : 'Maximum'}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</div>
                            <input
                                type="text"
                                name="customAmount"
                                value={formData.customAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '');
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setFormData({
                                            ...formData,
                                            customAmount: value,
                                            investmentAmount: value ? parseInt(value) : ''
                                        });
                                    }
                                }}
                                placeholder="Enter any amount (e.g. 250000)"
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                            />
                        </div>
                        {formData.customAmount && parseInt(formData.customAmount) < 100000 && (
                            <p className="text-red-500 text-sm mt-2">Minimum investment is ₦100,000</p>
                        )}
                        {formData.customAmount && parseInt(formData.customAmount) >= 100000 && (
                            <p className="text-green-500 text-sm mt-2">✅ You're investing ₦{parseInt(formData.customAmount).toLocaleString()}</p>
                        )}
                    </div>

                    {/* Expected Returns */}
                    {formData.investmentAmount && parseInt(formData.investmentAmount) >= 100000 && (
                        <div className="bg-spark-50 rounded-xl p-4 border border-spark-200 mb-8">
                            <h4 className="font-semibold text-spark-800 mb-2">Your Expected Return</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Your Investment</p>
                                    <p className="font-bold text-gray-900">₦{parseInt(formData.investmentAmount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Estimated Return (5 Years)</p>
                                    <p className="font-bold text-spark-600">₦{Math.round(parseInt(formData.investmentAmount) * 1.72).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Profit</p>
                                    <p className="font-bold text-green-600">₦{Math.round(parseInt(formData.investmentAmount) * 0.72).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Return on Investment</p>
                                    <p className="font-bold text-spark-600">72%</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Risk Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                        <p className="text-sm text-amber-700">
                            ⚠️ This is a private profit-sharing investment. All information is confidential.
                            <br />
                            <span className="font-medium">Investment is at risk. No guaranteed returns.</span>
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={() => handleSubmitInterest(formData.investmentAmount)}
                        disabled={loading || !formData.investmentAmount || parseInt(formData.investmentAmount) < 100000}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                            loading || !formData.investmentAmount || parseInt(formData.investmentAmount) < 100000
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-spark-500 hover:bg-spark-600'
                        }`}
                    >
                        {loading ? 'Submitting...' : '💰 Submit Interest'}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        By submitting, you agree to our terms and confirm this is a private investment invitation.
                    </p>
                </div>
            </div>
        );
    }

    // STEP 5: SUBMITTED - Thank You
    if (step === 'submitted') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-4">
                        We will contact you within 48 hours with more details about the investment opportunity.
                    </p>
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-green-700">
                            ✅ Your interest has been recorded for ₦{parseInt(formData.investmentAmount).toLocaleString()}
                        </p>
                    </div>
                    {isAdminUser && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-700">
                                👑 Admin submission completed.
                                <br />
                                <button
                                    onClick={() => {
                                        setStep('details');
                                        setFormData(prev => ({
                                            ...prev,
                                            investmentAmount: '',
                                            customAmount: '',
                                            agreeTerms: true
                                        }));
                                        toast.info('🔄 Starting new test submission');
                                    }}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Click here to test again
                                </button>
                            </p>
                        </div>
                    )}
                    {!user && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-700">
                                💡 Want to track your investment? 
                                <br />
                                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                                    Create a free account
                                </Link>
                                {' '}with the same email address.
                            </p>
                        </div>
                    )}
                    <Link to="/" className="inline-block px-6 py-3 bg-spark-500 text-white rounded-xl hover:bg-spark-600 transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return null;
}