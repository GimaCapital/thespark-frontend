// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../services/firebase';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import { setupNewUser } from '../utils/userUtils';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// export default function BvnCollection() {
//     const { user, refreshUserData } = useAuth();
//     const navigate = useNavigate();
//     const [bvn, setBvn] = useState('');
//     const [phone, setPhone] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
    
//     // ✅ Real-time validation states
//     const [bvnError, setBvnError] = useState('');
//     const [phoneError, setPhoneError] = useState('');
//     const [bvnValid, setBvnValid] = useState(false);
//     const [phoneValid, setPhoneValid] = useState(false);

//     // ✅ Validate BVN in real-time
//     const validateBvn = (value) => {
//         const cleanValue = value.replace(/\D/g, '');
//         setBvn(cleanValue);
        
//         if (cleanValue.length === 0) {
//             setBvnError('');
//             setBvnValid(false);
//             return;
//         }
        
//         if (cleanValue.length !== 11) {
//             setBvnError(`⚠️ ${cleanValue.length}/11 digits entered`);
//             setBvnValid(false);
//             return;
//         }
        
//         if (!/^\d+$/.test(cleanValue)) {
//             setBvnError('⚠️ Only numbers allowed');
//             setBvnValid(false);
//             return;
//         }
        
//         setBvnError('✅ Valid BVN');
//         setBvnValid(true);
//     };

//     // ✅ Validate Phone in real-time
//     const validatePhone = (value) => {
//         const cleanValue = value.replace(/\D/g, '');
//         setPhone(cleanValue);
        
//         if (cleanValue.length === 0) {
//             setPhoneError('');
//             setPhoneValid(false);
//             return;
//         }
        
//         if (cleanValue.length < 10) {
//             setPhoneError(`⚠️ ${cleanValue.length}/10-11 digits entered`);
//             setPhoneValid(false);
//             return;
//         }
        
//         if (cleanValue.length > 11) {
//             setPhoneError('⚠️ Maximum 11 digits');
//             setPhoneValid(false);
//             return;
//         }
        
//         if (!/^\d+$/.test(cleanValue)) {
//             setPhoneError('⚠️ Only numbers allowed');
//             setPhoneValid(false);
//             return;
//         }
        
//         setPhoneError('✅ Valid phone number');
//         setPhoneValid(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
        
//         // ✅ Final validation before submit
//         if (!bvnValid) {
//             toast.error('Please enter a valid 11-digit BVN');
//             return;
//         }
        
//         if (!phoneValid) {
//             toast.error('Please enter a valid phone number');
//             return;
//         }
        
//         setLoading(true);
        
//         try {
//             // ✅ 1. Ensure user document exists with referral & email
//             const displayName = user?.displayName || user?.fullName || 'Thespark Member';
//             const userEmail = user?.email || '';
            
//             const setupResult = await setupNewUser(user.uid, {
//                 fullName: displayName,
//                 email: userEmail,
//                 phone: phone
//             });
            
//             if (!setupResult.success) {
//                 throw new Error(setupResult.error);
//             }
            
//             console.log('✅ User setup complete:', {
//                 isNewUser: setupResult.isNewUser,
//                 referral: setupResult.referral,
//                 email: setupResult.email
//             });
            
//             // ✅ Show referral bonus toast if successful
//             if (setupResult.referral?.success && setupResult.referral?.bonus) {
//                 toast.success(`🎉 You got ₦${setupResult.referral.bonus} referral bonus!`);
//             }
            
//             // ✅ 2. Save BVN and Phone to Firebase
//             await updateDoc(doc(db, 'users', user.uid), {
//                 bvn: bvn,
//                 phone: phone,
//                 bvnUpdatedAt: new Date().toISOString(),
//                 phoneUpdatedAt: new Date().toISOString()
//             });
            
//             await refreshUserData();
//             toast.success('BVN and Phone saved successfully!');
            
//             // ✅ 3. Create virtual account with phone number
//             console.log('🔄 Creating virtual account automatically...');
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
            
//             const response = await api.post('/flutterwave/create-account', {
//                 email: userEmail,
//                 fullName: displayName,
//                 bvn: bvn,
//                 phone: phone
//             });
            
//             if (response.data.success) {
//                 console.log('✅ Virtual account created:', response.data.accountNumber);
//                 toast.success('Your savings account is ready!');
//                 navigate('/dashboard');
//             } else {
//                 console.warn('⚠️ Virtual account creation failed:', response.data.error);
//                 const errorMsg = response.data.error || 'Please contact support';
//                 setError(`Virtual account creation failed: ${errorMsg}`);
//                 toast.error(`Virtual account creation failed: ${errorMsg}`);
//                 // Still allow user to continue
//                 setTimeout(() => navigate('/dashboard'), 3000);
//             }
            
//         } catch (error) {
//             console.error('Error:', error);
//             const errorMsg = error.response?.data?.error || error.message || 'Failed to setup account';
//             setError(errorMsg);
//             toast.error(errorMsg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const isFormValid = bvnValid && phoneValid && !loading;

//     return (
//         <div className="container flex items-center justify-center min-h-screen">
//             <div className="card max-w-md w-full">
//                 <h2 className="heading-2 text-center mb-4">Verify Your Identity</h2>
//                 <p className="text-body text-center mb-4">
//                     To comply with financial regulations and create your thespark wealth-building account, 
//                     please enter your BVN and phone number.
//                 </p>
                
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
//                         <p className="text-sm text-red-600">❌ {error}</p>
//                     </div>
//                 )}
                
//                 <form onSubmit={handleSubmit}>
//                     {/* BVN Field */}
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">
//                             BVN (Bank Verification Number)
//                         </label>
//                         <input
//                             type="text"
//                             value={bvn}
//                             onChange={(e) => validateBvn(e.target.value)}
//                             placeholder="Enter your 11-digit BVN"
//                             maxLength={11}
//                             className={`input w-full ${
//                                 bvnError.includes('✅') ? 'border-green-500 bg-green-50' :
//                                 bvnError.includes('⚠️') ? 'border-yellow-500 bg-yellow-50' :
//                                 bvn.length > 0 ? 'border-red-500 bg-red-50' : ''
//                             }`}
//                             required
//                         />
//                         {bvnError && (
//                             <p className={`text-xs mt-1 ${
//                                 bvnError.includes('✅') ? 'text-green-600' :
//                                 bvnError.includes('⚠️') ? 'text-yellow-600' : 'text-red-500'
//                             }`}>
//                                 {bvnError}
//                             </p>
//                         )}
//                         <p className="text-xs text-gray-400 mt-1">
//                             Enter exactly 11 digits. Your BVN is safe and encrypted.
//                         </p>
//                     </div>
                    
//                     {/* Phone Field */}
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">
//                             Phone Number
//                         </label>
//                         <input
//                             type="tel"
//                             value={phone}
//                             onChange={(e) => validatePhone(e.target.value)}
//                             placeholder="Enter your phone number (10-11 digits)"
//                             maxLength={11}
//                             className={`input w-full ${
//                                 phoneError.includes('✅') ? 'border-green-500 bg-green-50' :
//                                 phoneError.includes('⚠️') ? 'border-yellow-500 bg-yellow-50' :
//                                 phone.length > 0 ? 'border-red-500 bg-red-50' : ''
//                             }`}
//                             required
//                         />
//                         {phoneError && (
//                             <p className={`text-xs mt-1 ${
//                                 phoneError.includes('✅') ? 'text-green-600' :
//                                 phoneError.includes('⚠️') ? 'text-yellow-600' : 'text-red-500'
//                             }`}>
//                                 {phoneError}
//                             </p>
//                         )}
//                         <p className="text-xs text-gray-400 mt-1">
//                             Enter 10-11 digits (e.g., 08012345678)
//                         </p>
//                     </div>
                    
//                     <button
//                         type="submit"
//                         disabled={!isFormValid}
//                         className={`btn btn-primary w-full ${
//                             !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
//                         }`}
//                     >
//                         {loading ? 'Setting up your account...' : 'Continue to Dashboard'}
//                     </button>
                    
//                     <div className="mt-3 text-center">
//                         <p className="text-xs text-gray-400">
//                             {bvnValid && phoneValid ? '✅ Ready to continue' : '⚠️ Please fill in all fields correctly'}
//                         </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

import React, { useState } from 'react';
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
    
    // ✅ Real-time validation states
    const [bvnError, setBvnError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [bvnValid, setBvnValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);

    // ✅ Validate BVN in real-time
    const validateBvn = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        setBvn(cleanValue);
        
        if (cleanValue.length === 0) {
            setBvnError('');
            setBvnValid(false);
            return;
        }
        
        if (cleanValue.length !== 11) {
            setBvnError(`⚠️ ${cleanValue.length}/11 digits entered`);
            setBvnValid(false);
            return;
        }
        
        if (!/^\d+$/.test(cleanValue)) {
            setBvnError('⚠️ Only numbers allowed');
            setBvnValid(false);
            return;
        }
        
        setBvnError('✅ Valid BVN');
        setBvnValid(true);
    };

    // ✅ Validate Phone in real-time
    const validatePhone = (value) => {
        const cleanValue = value.replace(/\D/g, '');
        setPhone(cleanValue);
        
        if (cleanValue.length === 0) {
            setPhoneError('');
            setPhoneValid(false);
            return;
        }
        
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
        
        if (!/^\d+$/.test(cleanValue)) {
            setPhoneError('⚠️ Only numbers allowed');
            setPhoneValid(false);
            return;
        }
        
        setPhoneError('✅ Valid phone number');
        setPhoneValid(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // ✅ Final validation before submit
        if (!bvnValid) {
            toast.error('Please enter a valid 11-digit BVN');
            return;
        }
        
        if (!phoneValid) {
            toast.error('Please enter a valid phone number');
            return;
        }
        
        setLoading(true);
        
        try {
            const displayName = user?.displayName || user?.fullName || 'Thespark Member';
            const userEmail = user?.email || '';
            
            const setupResult = await setupNewUser(user.uid, {
                fullName: displayName,
                email: userEmail,
                phone: phone
            });
            
            if (!setupResult.success) {
                throw new Error(setupResult.error);
            }
            
            console.log('✅ User setup complete:', {
                isNewUser: setupResult.isNewUser,
                referral: setupResult.referral,
                email: setupResult.email
            });
            
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
            
            console.log('🔄 Creating virtual account automatically...');
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/flutterwave/create-account', {
                email: userEmail,
                fullName: displayName,
                bvn: bvn,
                phone: phone
            });
            
            if (response.data.success) {
                console.log('✅ Virtual account created:', response.data.accountNumber);
                toast.success('Your savings account is ready!');
                navigate('/dashboard');
            } else {
                console.warn('⚠️ Virtual account creation failed:', response.data.error);
                const errorMsg = response.data.error || 'Please contact support';
                setError(`Virtual account creation failed: ${errorMsg}`);
                toast.error(`Virtual account creation failed: ${errorMsg}`);
                setTimeout(() => navigate('/dashboard'), 3000);
            }
            
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to setup account';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = bvnValid && phoneValid && !loading;

    return (
        <div className="container flex items-center justify-center min-h-screen py-8 px-4">
            <div className="card max-w-md w-full">
                <h2 className="heading-2 text-center mb-4">Verify Your Identity</h2>
                <p className="text-body text-center mb-4">
                    To comply with financial regulations and create your TheSpark wealth-building account, 
                    please enter your BVN and phone number.
                </p>
                
                {/* ✅ USSD Helper - Get BVN */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                        <span className="text-xl">💡</span>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Don't know your BVN?</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Dial <strong className="font-mono">*565*0#</strong> on the phone number linked to your bank account 
                                and follow the instructions to get your BVN instantly.
                            </p>
                            <button
                                onClick={() => setShowUssdHelp(!showUssdHelp)}
                                className="text-xs text-blue-600 hover:underline mt-2 font-medium"
                            >
                                {showUssdHelp ? 'Hide steps' : 'Show steps'}
                            </button>
                            
                            {showUssdHelp && (
                                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                                    <p className="text-xs font-medium text-gray-700 mb-2">📱 How to get your BVN:</p>
                                    <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                                        <li>Open your phone's dialer</li>
                                        <li>Dial <strong className="font-mono text-blue-600">*565*0#</strong></li>
                                        <li>Press the call/send button</li>
                                        <li>Follow the on-screen instructions</li>
                                        <li>Your BVN will be displayed on your screen</li>
                                    </ol>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        ⚠️ Make sure you dial from the phone number registered with your bank account.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                        <p className="text-sm text-red-600">❌ {error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* BVN Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            BVN (Bank Verification Number)
                        </label>
                        <input
                            type="text"
                            value={bvn}
                            onChange={(e) => validateBvn(e.target.value)}
                            placeholder="Enter your 11-digit BVN"
                            maxLength={11}
                            className={`input w-full ${
                                bvnError.includes('✅') ? 'border-green-500 bg-green-50' :
                                bvnError.includes('⚠️') ? 'border-yellow-500 bg-yellow-50' :
                                bvn.length > 0 ? 'border-red-500 bg-red-50' : ''
                            }`}
                            required
                        />
                        {bvnError && (
                            <p className={`text-xs mt-1 ${
                                bvnError.includes('✅') ? 'text-green-600' :
                                bvnError.includes('⚠️') ? 'text-yellow-600' : 'text-red-500'
                            }`}>
                                {bvnError}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Enter exactly 11 digits. Your BVN is safe and encrypted.
                        </p>
                    </div>
                    
                    {/* Phone Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => validatePhone(e.target.value)}
                            placeholder="Enter your phone number (10-11 digits)"
                            maxLength={11}
                            className={`input w-full ${
                                phoneError.includes('✅') ? 'border-green-500 bg-green-50' :
                                phoneError.includes('⚠️') ? 'border-yellow-500 bg-yellow-50' :
                                phone.length > 0 ? 'border-red-500 bg-red-50' : ''
                            }`}
                            required
                        />
                        {phoneError && (
                            <p className={`text-xs mt-1 ${
                                phoneError.includes('✅') ? 'text-green-600' :
                                phoneError.includes('⚠️') ? 'text-yellow-600' : 'text-red-500'
                            }`}>
                                {phoneError}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Enter 10-11 digits (e.g., 08012345678)
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`btn btn-primary w-full ${
                            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Setting up your account...' : 'Continue to Dashboard'}
                    </button>
                    
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-400">
                            {bvnValid && phoneValid ? '✅ Ready to continue' : '⚠️ Please fill in all fields correctly'}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}