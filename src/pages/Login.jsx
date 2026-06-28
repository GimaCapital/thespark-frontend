// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import HeaderMissionCard from '../components/Common/HeaderMissionCard';

// export default function Login() {
//     const { signInWithGoogle, sendOTP, verifyOTP } = useAuth();
//     const [searchParams] = useSearchParams();
    
//     const [method, setMethod] = useState('google');
//     const [phone, setPhone] = useState('');
//     const [code, setCode] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [referralCode, setReferralCode] = useState('');
//     const [confirmationResult, setConfirmationResult] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // ✅ Read referral code from URL
//     useEffect(() => {
//         const ref = searchParams.get('ref');
//         if (ref) {
//             setReferralCode(ref);
//             console.log('✅ Referral code loaded from URL:', ref);
//         }
//     }, [searchParams]);

//     const handleGoogleSignIn = async () => {
//         setLoading(true);
//         await signInWithGoogle(referralCode);  // ✅ Pass referral code
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
                
//                 {/* Login - Open Book Dynamic Style */}
//                 <div className="py-12">
//                     <div className="max-w-5xl mx-auto px-4">
                        
//                         {/* Floating Decorations */}
//                         <div className="absolute left-10 text-4xl opacity-10 animate-bounce hidden lg:block">🔑</div>
//                         <div className="absolute right-10 text-4xl opacity-10 animate-pulse hidden lg:block">📖</div>

//                         {/* Open Book Container */}
//                         <div className="relative max-w-5xl mx-auto">
//                             {/* Book Background */}
//                             <div className="absolute inset-0 bg-amber-50 rounded-2xl shadow-2xl transform rotate-1"></div>
//                             <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl transform -rotate-1"></div>

//                             {/* Main Book Content */}
//                             <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden z-10">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

//                                     {/* Left Page - Welcome Image with Quote */}
//                                     <div className="relative overflow-hidden min-h-[500px]">
//                                         <img
//                                             src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=600&fit=crop"
//                                             alt="Welcome back"
//                                             className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
//                                         />
//                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
//                                         <div className="absolute bottom-6 left-6 right-6">
//                                             <p className="text-white text-sm italic leading-relaxed">
//                                                 "Welcome back to your wealth-building journey."
//                                             </p>
//                                             <p className="text-white/60 text-xs mt-2">— Continue where you left off —</p>
//                                         </div>
//                                         {/* Page Curl Effect */}
//                                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-2xl"></div>
//                                     </div>

//                                     {/* Right Page - Login Form */}
//                                     <div className="p-8 md:p-10 relative">
//                                         {/* Corner Decoration */}
//                                         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-spark-100 to-transparent rounded-bl-2xl"></div>

//                                         <div className="relative">
//                                             <div className="text-5xl mb-4">👋</div>
//                                             <div className="flex items-center gap-2 mb-4">
//                                                 <div className="w-8 h-px bg-spark-400"></div>
//                                                 <span className="text-xs font-semibold text-spark-600 tracking-wider">LOGIN</span>
//                                                 <div className="w-8 h-px bg-spark-400"></div>
//                                             </div>

//                                             <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
//                                                 Welcome Back to <span className="text-spark-600">TheSpark</span>
//                                             </h2>
//                                             <p className="text-gray-500 text-sm mb-6">Access your dashboard and continue building wealth.</p>
                                            
//                                             {/* ✅ Show referral code if present */}
//                                             {referralCode && (
//                                                 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
//                                                     🎁 Referral code: <strong>{referralCode}</strong> - Share this code with friends!
//                                                 </div>
//                                             )}

//                                             {/* Method Selection - Book Style Tabs */}
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

//                                             {/* Google Sign In */}
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
//                                                     {loading ? 'Loading...' : 'Continue with Google'}
//                                                 </button>
//                                             )}

//                                             {/* Phone Sign In */}
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

//                                             {/* OTP Verification */}
//                                             {method === 'phone' && confirmationResult && (
//                                                 <div className="space-y-4">
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
//                                                         {loading ? 'Verifying...' : 'Verify & Login'}
//                                                     </button>
//                                                 </div>
//                                             )}

//                                             {/* Register Link */}
//                                             <div className="mt-6 text-center">
//                                                 <p className="text-sm text-gray-500">
//                                                     Don't have an account?{' '}
//                                                     <Link to="/register" className="text-spark-600 font-semibold hover:underline">
//                                                         Create an account
//                                                     </Link>
//                                                 </p>
//                                             </div>

//                                             {/* Book Corner Fold */}
//                                             <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-lg"></div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Center Spine */}
//                                 <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 hidden md:block"></div>
//                             </div>
//                         </div>

//                         {/* Page Turn Hint */}
//                         <div className="text-center mt-6 text-sm text-gray-400 font-serif italic">
//                             <span className="inline-block mr-2">◀</span> Secure login to continue your journey <span className="inline-block ml-2">▶</span>
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
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';

export default function Login() {
    const { signInWithGoogle, sendOTP, verifyOTP } = useAuth();
    const [searchParams] = useSearchParams();
    
    const [method, setMethod] = useState('google');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferralCode(ref);
            // ✅ Store in localStorage for persistence
            localStorage.setItem('pendingReferralCode', ref);
            localStorage.setItem('pendingReferralCodeTimestamp', Date.now().toString());
            console.log('✅ Referral code loaded from URL:', ref);
        } else {
            // ✅ Check localStorage for existing code
            const storedRef = localStorage.getItem('pendingReferralCode');
            if (storedRef) {
                setReferralCode(storedRef);
                console.log('✅ Referral code loaded from storage:', storedRef);
            }
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        await signInWithGoogle(referralCode);
        setLoading(false);
    };

    const handleSendOTP = async () => {
        toast.error('📱 Phone number login is coming soon! Please use Google to sign in.');
        return;
    };

    const handleVerifyOTP = async () => {
        toast.error('📱 Phone number login is coming soon! Please use Google to sign in.');
        return;
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
                        <div className="absolute left-10 text-4xl opacity-10 animate-bounce hidden lg:block">🔑</div>
                        <div className="absolute right-10 text-4xl opacity-10 animate-pulse hidden lg:block">📖</div>

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
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-2xl"></div>
                                    </div>

                                    <div className="p-8 md:p-10 relative">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-spark-100 to-transparent rounded-bl-2xl"></div>

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
                                            
                                            {referralCode && (
                                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                                                    🎁 Referral code: <strong>{referralCode}</strong> - Share this code with friends!
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

                                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 hidden md:block"></div>
                            </div>
                        </div>

                        <div className="text-center mt-6 text-sm text-gray-400 font-serif italic">
                            <span className="inline-block mr-2">◀</span> Secure login to continue your journey <span className="inline-block ml-2">▶</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}