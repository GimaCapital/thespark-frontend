// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

// export default function Register() {
//     const { signInWithGoogle, sendOTP, verifyOTP } = useAuth();
//     const [searchParams] = useSearchParams();
    
//     const [method, setMethod] = useState('google');
//     const [phone, setPhone] = useState('');
//     const [code, setCode] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [referralCode, setReferralCode] = useState('');
//     const [confirmationResult, setConfirmationResult] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const ref = searchParams.get('ref');
//         if (ref) {
//             setReferralCode(ref);
//             console.log('✅ Referral code loaded from URL:', ref);
//         }
//     }, [searchParams]);

//     const handleGoogleSignIn = async () => {
//         setLoading(true);
//         await signInWithGoogle(referralCode);
//         setLoading(false);
//     };

//     const handleSendOTP = async () => {
//         if (!phone) return;
//         setLoading(true);
//         const result = await sendOTP(phone);
//         if (result.success) {
//             setConfirmationResult(result.confirmationResult);
//         }
//         setLoading(false);
//     };

//     const handleVerifyOTP = async () => {
//         if (!code) return;
//         setLoading(true);
//         await verifyOTP(confirmationResult, code, fullName, referralCode);
//         setLoading(false);
//     };

//     return (
//         <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
//             <HeaderMissionCard />
            
//             <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
                
//                 <div className="py-12">
//                     <div className="max-w-5xl mx-auto px-4">
                        
//                         <div className="absolute left-10 text-4xl opacity-10 animate-bounce hidden lg:block">📝</div>
//                         <div className="absolute right-10 text-4xl opacity-10 animate-pulse hidden lg:block">✨</div>

//                         <div className="relative max-w-5xl mx-auto">
//                             <div className="absolute inset-0 bg-amber-50 rounded-2xl shadow-2xl transform rotate-1"></div>
//                             <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1"></div>

//                             <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

//                                     <div className="relative overflow-hidden min-h-[550px]">
//                                         <img
//                                             src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=600&fit=crop"
//                                             alt="Join TheSpark"
//                                             className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
//                                         />
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
//                                         <div className="absolute bottom-6 left-6 right-6">
//                                             <div className="text-4xl mb-2">🎉</div>
//                                             <p className="text-white text-sm italic leading-relaxed">
//                                                 "Start your journey to financial freedom today."
//                                             </p>
//                                             <p className="text-white/60 text-xs mt-2">— Join TheSpark community —</p>
//                                         </div>
//                                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-2xl"></div>
//                                     </div>

//                                     <div className="p-8 md:p-10 relative">
//                                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-spark-100 to-transparent rounded-bl-2xl"></div>

//                                         <div className="relative">
//                                             <div className="text-5xl mb-4">📖</div>
//                                             <div className="flex items-center gap-2 mb-4">
//                                                 <div className="w-8 h-px bg-spark-400"></div>
//                                                 <span className="text-xs font-semibold text-spark-600 tracking-wider">REGISTER</span>
//                                                 <div className="w-8 h-px bg-spark-400"></div>
//                                             </div>

//                                             <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
//                                                 Join <span className="text-spark-600">TheSpark</span> Today
//                                             </h2>
//                                             <p className="text-gray-500 text-sm mb-6">Create your account and start building consistent wealth habits. Join thousands of Nigerians on the path to financial freedom.</p>
                                            
//                                             {/* ✅ Updated referral message - New user gets ₦50 */}
//                                             {referralCode && (
//                                                 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
//                                                     🎁 Referral code: <strong>{referralCode}</strong> - You get ₦50 bonus instantly!
//                                                 </div>
//                                             )}
                                            
//                                             <div className="flex gap-3 mb-6">
//                                                 <button
//                                                     onClick={() => setMethod('google')}
//                                                     className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
//                                                         method === 'google' 
//                                                             ? 'bg-spark-500 text-white shadow-md' 
//                                                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                     }`}
//                                                 >
//                                                     <div className="flex items-center justify-center gap-2">
//                                                         <svg className="w-4 h-4" viewBox="0 0 24 24">
//                                                             <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l-3.339 3.339a4.2 4.2 0 0 0-2.679-.984c-1.836 0-3.393 1.2-3.96 2.902l-3.175-3.175z"/>
//                                                             <path fill="#34A853" d="M16.5 6.5l3.375-3.375A11.97 11.97 0 0 1 23.5 12c0 1.5-.28 2.94-.78 4.28l-4.22-2.22c.19-.66.31-1.36.31-2.06 0-2.44-.94-4.66-2.5-6.5z"/>
//                                                         </svg>
//                                                         <span>Google</span>
//                                                     </div>
//                                                 </button>
//                                                 <button
//                                                     onClick={() => setMethod('phone')}
//                                                     className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
//                                                         method === 'phone' 
//                                                             ? 'bg-spark-500 text-white shadow-md' 
//                                                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                                                     }`}
//                                                 >
//                                                     <div className="flex items-center justify-center gap-2">
//                                                         <span className="text-lg">📱</span>
//                                                         <span>Phone</span>
//                                                     </div>
//                                                 </button>
//                                             </div>

//                                             {method === 'google' && (
//                                                 <button
//                                                     onClick={handleGoogleSignIn}
//                                                     disabled={loading}
//                                                     className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
//                                                         loading 
//                                                             ? 'bg-gray-300 cursor-not-allowed' 
//                                                             : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-spark-500 hover:text-spark-600'
//                                                     }`}
//                                                 >
//                                                     <svg className="w-5 h-5" viewBox="0 0 24 24">
//                                                         <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l-3.339 3.339a4.2 4.2 0 0 0-2.679-.984c-1.836 0-3.393 1.2-3.96 2.902l-3.175-3.175z"/>
//                                                         <path fill="#34A853" d="M16.5 6.5l3.375-3.375A11.97 11.97 0 0 1 23.5 12c0 1.5-.28 2.94-.78 4.28l-4.22-2.22c.19-.66.31-1.36.31-2.06 0-2.44-.94-4.66-2.5-6.5z"/>
//                                                     </svg>
//                                                     {loading ? 'Loading...' : 'Sign up with Google'}
//                                                 </button>
//                                             )}

//                                             {method === 'phone' && !confirmationResult && (
//                                                 <div className="space-y-4">
//                                                     <input
//                                                         type="tel"
//                                                         value={phone}
//                                                         onChange={(e) => setPhone(e.target.value)}
//                                                         placeholder="+234 801 234 5678"
//                                                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition"
//                                                     />
//                                                     <button
//                                                         onClick={handleSendOTP}
//                                                         disabled={loading || !phone}
//                                                         className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
//                                                             loading || !phone
//                                                                 ? 'bg-gray-300 cursor-not-allowed'
//                                                                 : 'bg-spark-500 text-white hover:bg-spark-600'
//                                                         }`}
//                                                     >
//                                                         {loading ? 'Sending...' : 'Send Verification Code'}
//                                                     </button>
//                                                 </div>
//                                             )}

//                                             {method === 'phone' && confirmationResult && (
//                                                 <div className="space-y-4">
//                                                     <input
//                                                         type="text"
//                                                         value={fullName}
//                                                         onChange={(e) => setFullName(e.target.value)}
//                                                         placeholder="Your full name"
//                                                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition"
//                                                     />
//                                                     <input
//                                                         type="text"
//                                                         value={referralCode}
//                                                         onChange={(e) => setReferralCode(e.target.value)}
//                                                         placeholder="Referral code (optional)"
//                                                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition"
//                                                     />
//                                                     <input
//                                                         type="text"
//                                                         value={code}
//                                                         onChange={(e) => setCode(e.target.value)}
//                                                         placeholder="Enter 6-digit code"
//                                                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-spark-500 focus:ring-2 focus:ring-spark-200 transition"
//                                                     />
//                                                     <button
//                                                         onClick={handleVerifyOTP}
//                                                         disabled={loading || !code}
//                                                         className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
//                                                             loading || !code
//                                                                 ? 'bg-gray-300 cursor-not-allowed'
//                                                                 : 'bg-spark-500 text-white hover:bg-spark-600'
//                                                         }`}
//                                                     >
//                                                         {loading ? 'Verifying...' : 'Complete Registration'}
//                                                     </button>
//                                                 </div>
//                                             )}

//                                             <div className="mt-6 text-center">
//                                                 <p className="text-sm text-gray-500">
//                                                     Already have an account?{' '}
//                                                     <Link to="/login" className="text-spark-600 font-semibold hover:underline">
//                                                         Sign in here
//                                                     </Link>
//                                                 </p>
//                                             </div>

//                                             <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-lg"></div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 hidden md:block"></div>
//                             </div>
//                         </div>

//                         <div className="text-center mt-6 text-sm text-gray-400 font-serif italic">
//                             <span className="inline-block mr-2">◀</span> Start your wealth-building journey today <span className="inline-block ml-2">▶</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { api, setAuthToken } from '../services/api';  // ✅ Static import
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';

export default function Register() {
    const { signInWithGoogle, sendOTP, verifyOTP, refreshUserData } = useAuth();
    const [searchParams] = useSearchParams();
    
    const [method, setMethod] = useState('google');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [referralFailed, setReferralFailed] = useState(false);

    // ============================================================
    // ✅ REFERRAL CODE HANDLING WITH PERSISTENCE
    // ============================================================
    useEffect(() => {
        const REFERRAL_STORAGE_KEY = 'pendingReferralCode';
        const REFERRAL_TIMESTAMP_KEY = 'pendingReferralCodeTimestamp';
        const REFERRAL_EXPIRY_HOURS = 24;
        const EXPIRY_MS = REFERRAL_EXPIRY_HOURS * 60 * 60 * 1000;

        // ✅ Check URL first
        let ref = searchParams.get('ref');

        if (ref) {
            // ✅ User clicked referral link - Store it
            setReferralCode(ref);
            localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
            localStorage.setItem(REFERRAL_TIMESTAMP_KEY, Date.now().toString());
            console.log('✅ Referral code loaded from URL:', ref);
        } else {
            // ✅ Check localStorage for existing code
            const storedRef = localStorage.getItem(REFERRAL_STORAGE_KEY);
            const storedTimestamp = localStorage.getItem(REFERRAL_TIMESTAMP_KEY);

            if (storedRef && storedTimestamp) {
                const age = Date.now() - parseInt(storedTimestamp);
                
                if (age < EXPIRY_MS) {
                    // ✅ Code is still valid (less than 24 hours old)
                    setReferralCode(storedRef);
                    console.log('✅ Referral code loaded from storage:', storedRef);
                    console.log(`⏰ Code age: ${Math.floor(age / (60 * 60 * 1000))} hours`);
                } else {
                    // ❌ Code expired - auto-delete
                    localStorage.removeItem(REFERRAL_STORAGE_KEY);
                    localStorage.removeItem(REFERRAL_TIMESTAMP_KEY);
                    console.log('⏰ Referral code expired and removed');
                }
            }
        }

        // ✅ Check if referral failed previously
        const failed = localStorage.getItem('referralFailed');
        if (failed === 'true') {
            setReferralFailed(true);
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        // ✅ Double-check storage before signup
        let codeToUse = referralCode;
        if (!codeToUse) {
            const storedRef = localStorage.getItem('pendingReferralCode');
            if (storedRef) {
                codeToUse = storedRef;
                setReferralCode(storedRef);
                console.log('✅ Referral code retrieved from storage:', storedRef);
            }
        }

        setLoading(true);
        
        try {
            // ✅ Pass the referral code to signInWithGoogle
            const result = await signInWithGoogle(codeToUse);
            
            // ✅ Check if referral processing failed
            if (result && result.referralFailed) {
                setReferralFailed(true);
                localStorage.setItem('referralFailed', 'true');
            } else {
                setReferralFailed(false);
                localStorage.removeItem('referralFailed');
            }
        } catch (error) {
            console.error('Signup failed, keeping referral code for retry:', error);
            // ✅ KEEP the code if signup fails
        } finally {
            setLoading(false);
        }
    };

    // ✅ Retry referral function
    const retryReferral = async () => {
        if (!referralCode) {
            toast.error('No referral code found');
            return;
        }
        
        setLoading(true);
        try {
            // ✅ Get the current user from auth
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error('Please sign in first');
                setLoading(false);
                return;
            }
            
            const token = await currentUser.getIdToken();
            if (!token) {
                toast.error('Please sign in first');
                setLoading(false);
                return;
            }
            
            // ✅ Set auth token for the API call
            setAuthToken(token);
            
            const response = await api.post('/users/process-referral', { 
                referralCode 
            });
            
            const data = response.data;
            if (data.success && data.bonus) {
                toast.success(`🎉 You got ₦${data.bonus} referral bonus!`);
                setReferralFailed(false);
                localStorage.removeItem('referralFailed');
                localStorage.removeItem('pendingReferralCode');
                localStorage.removeItem('pendingReferralCodeTimestamp');
                // Refresh user data
                await refreshUserData();
            } else if (data.alreadyReferred) {
                toast.info('You already have a referrer');
                setReferralFailed(false);
                localStorage.removeItem('referralFailed');
            } else if (!data.success && data.error) {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Failed to retry referral:', error);
            toast.error('Failed to process referral. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        toast.error('📱 Phone number registration is coming soon! Please use Google to sign up.');
        return;
    };

    const handleVerifyOTP = async () => {
        toast.error('📱 Phone number registration is coming soon! Please use Google to sign up.');
        return;
    };

    const handlePhoneClick = () => {
        toast('📱 Phone number registration is coming soon! Please use Google to sign up.', {
            duration: 4000,
            position: 'top-center',
            icon: '🚀',
        });
    };

    // ✅ Get referral expiry info
    const getReferralStatus = () => {
        if (!referralCode) return null;
        
        const timestamp = localStorage.getItem('pendingReferralCodeTimestamp');
        if (timestamp) {
            const age = Date.now() - parseInt(timestamp);
            const hoursRemaining = Math.max(0, 24 - Math.floor(age / (60 * 60 * 1000)));
            return (
                <div className="text-xs text-gray-400 mt-1">
                    ⏰ Code expires in {hoursRemaining} hours
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-spark-50 via-white to-spark-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-8 sm:py-12">
                <div className="py-12">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="absolute left-10 text-4xl opacity-10 animate-bounce hidden lg:block">📝</div>
                        <div className="absolute right-10 text-4xl opacity-10 animate-pulse hidden lg:block">✨</div>

                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute inset-0 bg-amber-50 rounded-2xl shadow-2xl transform rotate-1"></div>
                            <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1"></div>

                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    <div className="relative overflow-hidden min-h-[550px]">
                                        <img
                                            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=600&fit=crop"
                                            alt="Join TheSpark"
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="text-4xl mb-2">🎉</div>
                                            <p className="text-white text-sm italic leading-relaxed">
                                                "Start your journey to financial freedom today."
                                            </p>
                                            <p className="text-white/60 text-xs mt-2">— Join TheSpark community —</p>
                                        </div>
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-2xl"></div>
                                    </div>

                                    <div className="p-8 md:p-10 relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-spark-100 to-transparent rounded-bl-2xl"></div>

                                        <div className="relative">
                                            <div className="text-5xl mb-4">📖</div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-px bg-spark-400"></div>
                                                <span className="text-xs font-semibold text-spark-600 tracking-wider">REGISTER</span>
                                                <div className="w-8 h-px bg-spark-400"></div>
                                            </div>

                                            <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                                                Join <span className="text-spark-600">TheSpark</span> Today
                                            </h2>
                                            <p className="text-gray-500 text-sm mb-6">Create your account and start building consistent wealth habits. Join thousands of Nigerians on the path to financial freedom.</p>
                                            
                                            {/* ✅ Enhanced Referral Code Display */}
                                            {referralCode && (
                                                <div className={`mb-4 p-3 rounded-xl border ${
                                                    referralFailed 
                                                        ? 'bg-amber-50 border-amber-200' 
                                                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                                }`}>
                                                    <div className={`text-sm ${
                                                        referralFailed ? 'text-amber-700' : 'text-green-700'
                                                    }`}>
                                                        🎁 Referral code: <strong className={referralFailed ? 'text-amber-800' : 'text-green-800'}>{referralCode}</strong>
                                                        <span className="block text-xs mt-1">
                                                            {referralFailed ? (
                                                                <span className="text-amber-600">
                                                                    ⚠️ Referral processing failed. 
                                                                    <button 
                                                                        onClick={retryReferral}
                                                                        disabled={loading}
                                                                        className="ml-2 text-spark-600 font-semibold hover:underline"
                                                                    >
                                                                        Retry
                                                                    </button>
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600">
                                                                    ✅ You get <strong>₦50</strong> bonus instantly!
                                                                </span>
                                                            )}
                                                        </span>
                                                        {!referralFailed && getReferralStatus()}
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
                                                {loading ? 'Loading...' : 'Sign up with Google'}
                                            </button>

                                            <div className="mt-4 text-center">
                                                <p className="text-xs text-gray-400">
                                                    📱 Phone number registration is coming soon! 
                                                    <br />
                                                    Please use Google to sign up.
                                                </p>
                                            </div>

                                            <div className="mt-6 text-center">
                                                <p className="text-sm text-gray-500">
                                                    Already have an account?{' '}
                                                    <Link to="/login" className="text-spark-600 font-semibold hover:underline">
                                                        Sign in here
                                                    </Link>
                                                </p>
                                            </div>

                                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 hidden md:block"></div>
                            </div>
                        </div>

                        <div className="text-center mt-6 text-sm text-gray-400 font-serif italic">
                            <span className="inline-block mr-2">◀</span> Start your wealth-building journey today <span className="inline-block ml-2">▶</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}