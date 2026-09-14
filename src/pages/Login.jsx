import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { api, setAuthToken } from '../services/api';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';

export default function Login() {
    const { signInWithGoogle, refreshUserData, user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [method, setMethod] = useState('google');
    const [referralCode, setReferralCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [referralFailed, setReferralFailed] = useState(false);
    const [referralProcessing, setReferralProcessing] = useState(false);

    const REFERRAL_STORAGE_KEY = 'pendingReferralCode';
    const REFERRAL_TIMESTAMP_KEY = 'pendingReferralCodeTimestamp';

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferralCode(ref);
            localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
            localStorage.setItem(REFERRAL_TIMESTAMP_KEY, Date.now().toString());
            // console.log('✅ Referral code loaded from URL:', ref);
        } else {
            const storedRef = localStorage.getItem(REFERRAL_STORAGE_KEY);
            if (storedRef) {
                setReferralCode(storedRef);
                // console.log('✅ Referral code loaded from storage:', storedRef);
            }
        }
        
        // ✅ Check if referral failed
        const failed = localStorage.getItem('referralFailed');
        if (failed === 'true') {
            setReferralFailed(true);
        }
    }, [searchParams]);

    // ✅ Auto-retry referral when user logs in
    useEffect(() => {
        if (user && referralFailed && referralCode) {
            // console.log('🔄 User logged in, auto-retrying referral...');
            retryReferral();
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle(referralCode);
            if (result && result.referralFailed) {
                setReferralFailed(true);
                localStorage.setItem('referralFailed', 'true');
                toast.error('Referral processing failed. Will retry automatically.');
            } else if (result && result.referralSuccess) {
                setReferralFailed(false);
                localStorage.removeItem(REFERRAL_STORAGE_KEY);
                localStorage.removeItem(REFERRAL_TIMESTAMP_KEY);
                localStorage.removeItem('referralFailed');
                toast.success(`🎉 You got ₦${result.bonusAmount || 50} referral bonus!`);
                navigate('/dashboard');
            } else if (result && result.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            // console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Retry referral function
    const retryReferral = async () => {
        // ✅ Check if user is logged in
        if (!user) {
            // console.log('⏳ User not logged in yet, waiting...');
            return;
        }
        
        if (!referralCode) {
            toast.error('No referral code found');
            return;
        }
        
        if (referralProcessing) return;
        
        setReferralProcessing(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error('Please login first');
                setReferralProcessing(false);
                return;
            }
            
            const token = await currentUser.getIdToken();
            setAuthToken(token);
            
            const response = await api.post('/users/retry-referral', { 
                referralCode 
            });
            
            const data = response.data;
            if (data.success && data.bonus) {
                toast.success(`🎉 You got ₦${data.bonus} referral bonus!`);
                setReferralFailed(false);
                localStorage.removeItem(REFERRAL_STORAGE_KEY);
                localStorage.removeItem(REFERRAL_TIMESTAMP_KEY);
                localStorage.removeItem('referralFailed');
                await refreshUserData();
                navigate('/dashboard');
            } else if (data.alreadyReferred) {
                toast.info('You already have a referrer');
                setReferralFailed(false);
                localStorage.removeItem(REFERRAL_STORAGE_KEY);
                localStorage.removeItem(REFERRAL_TIMESTAMP_KEY);
                localStorage.removeItem('referralFailed');
                navigate('/dashboard');
            } else {
                toast.error(data.error || 'Failed to process referral');
            }
        } catch (error) {
            // console.error('Failed to retry referral:', error);
            toast.error('Failed to process referral. Please try again.');
        } finally {
            setReferralProcessing(false);
        }
    };

    const handlePhoneClick = () => {
        toast('📱 Phone number login is coming soon! Please use Google to sign in.', {
            duration: 4000,
            position: 'top-center',
            icon: '🚀',
        });
    };

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
                <div className="py-12">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute inset-0 bg-amber-50 rounded-2xl shadow-2xl transform rotate-1"></div>
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1"></div>

                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    <div className="relative overflow-hidden min-h-[500px]">
                                        <img
                                            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=600&fit=crop"
                                            alt="Welcome back"
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <p className="text-white text-sm italic leading-relaxed">
                                                "Welcome back to your wealth-building journey."
                                            </p>
                                            <p className="text-white/60 text-xs mt-2">— Continue where you left off —</p>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-10 relative">
                                        <div className="relative">
                                            <div className="text-5xl mb-4">👋</div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-px bg-spark-400"></div>
                                                <span className="text-xs font-semibold text-spark-600 tracking-wider">LOGIN</span>
                                                <div className="w-8 h-px bg-spark-400"></div>
                                            </div>

                                            <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                                Welcome Back to <span className="text-spark-600">TheSpark</span>
                                            </h2>
                                            <p className="text-gray-500 text-sm mb-6">Access your dashboard and continue building wealth.</p>
                                            
                                            {/* ✅ Referral Code Display with Retry */}
                                            {referralCode && (
                                                <div className={`mb-4 p-3 rounded-xl border ${
                                                    referralFailed 
                                                        ? 'bg-amber-50 border-amber-200' 
                                                        : 'bg-green-50 border-green-200'
                                                }`}>
                                                    <div className={`text-sm ${
                                                        referralFailed ? 'text-amber-700' : 'text-green-700'
                                                    }`}>
                                                        🎁 Referral code: <strong className={referralFailed ? 'text-amber-800' : 'text-green-800'}>{referralCode}</strong>
                                                        <span className="block text-xs mt-1">
                                                            {referralFailed ? (
                                                                <span className="text-amber-600">
                                                                    ⚠️ Referral processing failed.
                                                                    {user ? (
                                                                        <button 
                                                                            onClick={retryReferral}
                                                                            disabled={referralProcessing}
                                                                            className="ml-2 text-spark-600 font-semibold hover:underline"
                                                                        >
                                                                            {referralProcessing ? 'Processing...' : 'Retry'}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="ml-2 text-gray-500">
                                                                            Will retry after sign in
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600">
                                                                    ✅ You get <strong>₦50</strong> bonus instantly!
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3 mb-6">
                                                <button
                                                    onClick={() => setMethod('google')}
                                                    className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                                                        method === 'google' 
                                                            ? 'bg-spark-500 text-white shadow-md' 
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l-3.339 3.339a4.2 4.2 0 0 0-2.679-.984c-1.836 0-3.393 1.2-3.96 2.902l-3.175-3.175z"/>
                                                            <path fill="#34A853" d="M16.5 6.5l3.375-3.375A11.97 11.97 0 0 1 23.5 12c0 1.5-.28 2.94-.78 4.28l-4.22-2.22c.19-.66.31-1.36.31-2.06 0-2.44-.94-4.66-2.5-6.5z"/>
                                                        </svg>
                                                        <span>Google</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={handlePhoneClick}
                                                    className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 relative ${
                                                        method === 'phone' 
                                                            ? 'bg-spark-500 text-white shadow-md' 
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-lg">📱</span>
                                                        <span>Phone</span>
                                                    </div>
                                                    <span className="absolute -top-2 -right-2 bg-spark-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                                        SOON
                                                    </span>
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleGoogleSignIn}
                                                disabled={loading}
                                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                                                    loading 
                                                        ? 'bg-gray-300 cursor-not-allowed' 
                                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-spark-500 hover:text-spark-600'
                                                }`}
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l-3.339 3.339a4.2 4.2 0 0 0-2.679-.984c-1.836 0-3.393 1.2-3.96 2.902l-3.175-3.175z"/>
                                                    <path fill="#34A853" d="M16.5 6.5l3.375-3.375A11.97 11.97 0 0 1 23.5 12c0 1.5-.28 2.94-.78 4.28l-4.22-2.22c.19-.66.31-1.36.31-2.06 0-2.44-.94-4.66-2.5-6.5z"/>
                                                </svg>
                                                {loading ? 'Loading...' : 'Continue with Google'}
                                            </button>

                                            <div className="mt-4 text-center">
                                                <p className="text-xs text-gray-400">
                                                    📱 Phone number login is coming soon! 
                                                    <br />
                                                    Please use Google to sign in.
                                                </p>
                                            </div>

                                            <div className="mt-6 text-center">
                                                <p className="text-sm text-gray-500">
                                                    Don't have an account?{' '}
                                                    <Link to="/register" className="text-spark-600 font-semibold hover:underline">
                                                        Create an account
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}