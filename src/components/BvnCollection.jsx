import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import { setupNewUser } from '../utils/userUtils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BvnCollection() {
    const { user, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [bvn, setBvn] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showUssdHelp, setShowUssdHelp] = useState(false);
    const [bvnError, setBvnError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [bvnValid, setBvnValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateBvn = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        setBvn(cleanValue);

        if (cleanValue.length === 0) { setBvnError(''); setBvnValid(false); return; }
        if (cleanValue.length !== 11) {
            setBvnError(`⚠️ ${cleanValue.length}/11 digits entered`);
            setBvnValid(false);
            return;
        }
        setBvnError('✅ Valid BVN');
        setBvnValid(true);
    };

    const validatePhone = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        setPhone(cleanValue);

        if (cleanValue.length === 0) { setPhoneError(''); setPhoneValid(false); return; }
        if (cleanValue.length < 10) {
            setPhoneError(`⚠️ ${cleanValue.length}/10-11 digits entered`);
            setPhoneValid(false);
            return;
        }
        if (cleanValue.length > 11) {
            setPhoneError('⚠️ Maximum 11 digits');
            setPhoneValid(false);
            return;
        }
        setPhoneError('✅ Valid phone number');
        setPhoneValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!bvnValid) { toast.error('Please enter a valid 11-digit BVN'); return; }
        if (!phoneValid) { toast.error('Please enter a valid phone number'); return; }

        setLoading(true);

        try {
            const displayName = user?.displayName || user?.fullName || 'Thespark Member';
            const userEmail = user?.email || '';

            const setupResult = await setupNewUser(user.uid, {
                fullName: displayName,
                email: userEmail,
                phone: phone
            });

            if (!setupResult.success) throw new Error(setupResult.error);

            if (setupResult.referral?.success && setupResult.referral?.bonus) {
                toast.success(`🎉 You got ₦${setupResult.referral.bonus} referral bonus!`);
            }

            await updateDoc(doc(db, 'users', user.uid), {
                bvn: bvn,
                phone: phone,
                bvnUpdatedAt: new Date().toISOString(),
                phoneUpdatedAt: new Date().toISOString()
            });

            await refreshUserData();
            toast.success('BVN and Phone saved successfully!');

            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);

            const response = await api.post('/flutterwave/create-account', {
                email: userEmail,
                fullName: displayName,
                bvn: bvn,
                phone: phone
            });

            if (response.data.success) {
                toast.success('Your savings account is ready!');
                navigate('/dashboard');
            } else {
                const errorMsg = response.data.error || 'Please contact support';
                setError(`Account activation failed: ${errorMsg}`);
                toast.error(`Account activation failed: ${errorMsg}`);
                setTimeout(() => navigate('/dashboard'), 3000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Failed to setup account';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = bvnValid && phoneValid && !loading;

    return (
        <>
            {/* Inline styles for the button spring + shimmer (no extra CSS file needed) */}
            <style>{`
                @keyframes bvn-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .bvn-btn {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
                                box-shadow 0.25s ease,
                                filter 0.2s ease;
                    will-change: transform;
                }
                .bvn-btn:not(:disabled):hover {
                    transform: translateY(-2px) scale(1.015);
                    box-shadow: 0 12px 24px -8px rgba(234, 88, 12, 0.45);
                    filter: brightness(1.05);
                }
                .bvn-btn:not(:disabled):active {
                    transform: translateY(0) scale(0.965);
                    box-shadow: 0 4px 10px -4px rgba(234, 88, 12, 0.35);
                    transition-duration: 0.08s;
                }
                .bvn-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 40%;
                    height: 100%;
                    background: linear-gradient(
                        120deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.35) 50%,
                        transparent 100%
                    );
                    transform: translateX(-100%);
                    pointer-events: none;
                }
                .bvn-btn:not(:disabled):hover::after {
                    animation: bvn-shimmer 0.9s ease;
                }
                .bvn-btn:disabled {
                    filter: saturate(0.6) brightness(1.02);
                    cursor: not-allowed;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-b from-spark-50 via-white to-white flex items-start justify-center px-4 pt-10 pb-16">
                <div className="w-full max-w-md">

                    {/* Card */}
                    <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(234,88,12,0.25)] border border-gray-100 p-6 sm:p-8">

                        {/* Decorative top accent */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-spark-400 via-spark-500 to-spark-600" />

                        {/* Header */}
                        <div className="text-center mb-6 pt-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-spark-100 to-orange-100 shadow-inner mb-4">
                                <span className="text-3xl">🔐</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                Verify Your Identity
                            </h1>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                To comply with financial regulations and activate your TheSpark savings account,
                                we need to verify your identity with your BVN and phone number. Once verified,
                                you can start depositing and begin your 21-day cycle.
                            </p>
                            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                                🔒 Your BVN is encrypted and used only for verification. It is never shared or stored in plain text.
                            </p>
                        </div>

                        {/* USSD Helper */}
                        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 mb-5">
                            <div className="flex items-start gap-3">
                                <span className="text-lg leading-none mt-0.5">💡</span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900">Don't know your BVN?</p>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                        Dial <strong className="font-mono">*565*0#</strong> from the phone number linked to your bank account to get it instantly.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowUssdHelp(!showUssdHelp)}
                                        className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 mt-2 font-medium transition"
                                    >
                                        {showUssdHelp ? 'Hide steps' : 'Show steps'}
                                    </button>
                                    {showUssdHelp && (
                                        <div className="mt-3 p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">📱 How to get your BVN:</p>
                                            <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                                                <li>Open your phone's dialer</li>
                                                <li>Dial <strong className="font-mono text-blue-600">*565*0#</strong></li>
                                                <li>Press the call/send button</li>
                                                <li>Follow the on-screen instructions</li>
                                                <li>Your BVN will be displayed on your screen</li>
                                            </ol>
                                            <p className="text-xs text-gray-500 mt-2 italic">
                                                ⚠️ Use the phone number registered with your bank account.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
                                <p className="text-sm text-red-600">❌ {error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* BVN */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    BVN (Bank Verification Number)
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={bvn}
                                    onChange={(e) => validateBvn(e.target.value)}
                                    placeholder="Enter your 11-digit BVN"
                                    maxLength={11}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        bvnError.includes('✅')
                                            ? 'border-green-400 bg-green-50 focus:ring-green-200'
                                            : bvnError.includes('⚠️')
                                            ? 'border-yellow-400 bg-yellow-50 focus:ring-yellow-200'
                                            : bvn.length > 0
                                            ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                            : 'border-gray-200 bg-gray-50 focus:ring-spark-200 focus:border-spark-400'
                                    }`}
                                    required
                                />
                                {bvnError && (
                                    <p className={`text-xs mt-1.5 font-medium ${
                                        bvnError.includes('✅') ? 'text-green-600'
                                        : bvnError.includes('⚠️') ? 'text-yellow-600'
                                        : 'text-red-500'
                                    }`}>
                                        {bvnError}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Enter exactly 11 digits. Your BVN is safe and encrypted.
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={(e) => validatePhone(e.target.value)}
                                    placeholder="Enter your phone number (10-11 digits)"
                                    maxLength={11}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        phoneError.includes('✅')
                                            ? 'border-green-400 bg-green-50 focus:ring-green-200'
                                            : phoneError.includes('⚠️')
                                            ? 'border-yellow-400 bg-yellow-50 focus:ring-yellow-200'
                                            : phone.length > 0
                                            ? 'border-red-400 bg-red-50 focus:ring-red-200'
                                            : 'border-gray-200 bg-gray-50 focus:ring-spark-200 focus:border-spark-400'
                                    }`}
                                    required
                                />
                                {phoneError && (
                                    <p className={`text-xs mt-1.5 font-medium ${
                                        phoneError.includes('✅') ? 'text-green-600'
                                        : phoneError.includes('⚠️') ? 'text-yellow-600'
                                        : 'text-red-500'
                                    }`}>
                                        {phoneError}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Enter 10-11 digits (e.g. 08012345678).
                                </p>
                            </div>

                            {/* Submit button — spring + shimmer */}
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`
                                    bvn-btn
                                    w-full flex items-center justify-center gap-2
                                    py-3.5 rounded-xl font-bold text-white text-base tracking-wide
                                    bg-gradient-to-r from-spark-500 via-spark-600 to-orange-600
                                    shadow-lg shadow-spark-500/30
                                    focus:outline-none focus:ring-2 focus:ring-spark-300 focus:ring-offset-2
                                    disabled:shadow-md
                                `}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Activating…</span>
                                    </>
                                ) : (
                                    <span>Activate my savings account</span>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-400 pt-1">
                                {bvnValid && phoneValid
                                    ? '✅ Ready to continue'
                                    : '⚠️ Please fill in all fields correctly'}
                            </p>
                        </form>
                    </div>

                    {/* Footer note */}
                    <p className="text-[11px] text-center text-gray-400 mt-5 leading-relaxed px-4">
                        Your data is protected with bank-level encryption. TheSpark will never ask for your BVN over email, phone, or chat.
                    </p>
                </div>
            </div>
        </>
    );
}