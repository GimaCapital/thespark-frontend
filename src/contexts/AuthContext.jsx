import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
    auth, 
    signInWithPopup, 
    googleProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
    onAuthStateChanged,
    db,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc
} from '../services/firebase';
import { api, setAuthToken } from '../services/api'; 
import { setupNewUser } from '../utils/userUtils';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recaptcha, setRecaptcha] = useState(null);

    const setupRecaptcha = () => {
        if (typeof window !== 'undefined' && !recaptcha) {
            const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {}
            });
            setRecaptcha(verifier);
            return verifier;
        }
        return recaptcha;
    };

    const createFlutterwaveVirtualAccount = async (userId, userEmail, userFullName, userBvn = null) => {
        try {
            const token = await auth.currentUser.getIdToken();
            setAuthToken(token);
            
            const response = await api.post('/flutterwave/create-account', {
                userId: userId,
                email: userEmail,
                fullName: userFullName,
                bvn: userBvn
            });
            
            const data = response.data;
            if (data.success && data.hasAccount) {
                // console.log('✅ Flutterwave virtual account created:', data.accountNumber);
                return { success: true, accountNumber: data.accountNumber, bankName: data.bankName };
            }
            return { success: false };
        } catch (error) {
            // console.error('Error creating Flutterwave virtual account:', error);
            return { success: false };
        }
    };

    const signInWithGoogle = async (referralCode = null) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const firstName = firebaseUser.displayName?.split(' ')[0] || 'Thespark Member';
            
            // ✅ Store referral code in localStorage if provided
            if (referralCode) {
                localStorage.setItem('pendingReferralCode', referralCode);
                localStorage.setItem('pendingReferralCodeTimestamp', Date.now().toString());
                // console.log('✅ Referral code stored in localStorage:', referralCode);
            }
            
            // ✅ Use setupNewUser (handles everything)
            const setupResult = await setupNewUser(firebaseUser.uid, {
                fullName: firebaseUser.displayName || 'Thespark Member',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || '',
                photoURL: firebaseUser.photoURL || ''
            });
            
            if (!setupResult.success) {
                throw new Error(setupResult.error);
            }
            
            // console.log('✅ User setup complete:', {
            //     isNewUser: setupResult.isNewUser,
            //     referral: setupResult.referral,
            //     email: setupResult.email
            // });
            
            // ✅ Determine referral status
            let referralFailed = false;
            let referralSuccess = false;
            let bonusAmount = 0;
            
            if (setupResult.referral?.success && setupResult.referral?.bonus) {
                referralSuccess = true;
                bonusAmount = setupResult.referral.bonus;
                toast.success(`🎉 You got ₦${bonusAmount} referral bonus!`);
                // ✅ Clear referral data on success
                localStorage.removeItem('pendingReferralCode');
                localStorage.removeItem('pendingReferralCodeTimestamp');
                localStorage.removeItem('referralFailed');
            } else if (setupResult.referral?.alreadyReferred) {
                // console.log('User already has a referrer');
                localStorage.removeItem('pendingReferralCode');
                localStorage.removeItem('pendingReferralCodeTimestamp');
                localStorage.removeItem('referralFailed');
            } else if (setupResult.referral && !setupResult.referral.success) {
                referralFailed = true;
                // console.warn('Referral failed, code kept for retry');
                // ✅ Keep the code for retry
                localStorage.setItem('referralFailed', 'true');
            }
            
            // ✅ Welcome email status
            if (setupResult.email?.success) {
                // console.log('✅ Welcome email sent');
            }
            
            // ✅ Refresh user data
            await refreshUserData();
            
            toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
            
            // ✅ Return full referral status
            return { 
                success: true, 
                referralFailed: referralFailed,
                referralSuccess: referralSuccess,
                bonusAmount: bonusAmount
            };
        } catch (error) {
            // console.error('Google sign in error:', error);
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    const sendOTP = async (phoneNumber) => {
        try {
            const verifier = setupRecaptcha();
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
            return { success: true, confirmationResult };
        } catch (error) {
            // console.error('Send OTP error:', error);
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    const verifyOTP = async (confirmationResult, code, fullName, referralCode) => {
        try {
            const result = await confirmationResult.confirm(code);
            const firebaseUser = result.user;
            const firstName = firebaseUser.displayName?.split(' ')[0] || 'Thespark Member';
            
            // ✅ Store referral code in localStorage if provided
            if (referralCode) {
                localStorage.setItem('pendingReferralCode', referralCode);
                localStorage.setItem('pendingReferralCodeTimestamp', Date.now().toString());
                // console.log('✅ Referral code stored in localStorage:', referralCode);
            }
            
            // ✅ Use setupNewUser (handles everything)
            const setupResult = await setupNewUser(firebaseUser.uid, {
                fullName: fullName || 'Thespark Member',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || '',
                photoURL: ''
            });
            
            if (!setupResult.success) {
                throw new Error(setupResult.error);
            }
            
            // ✅ Show referral bonus toast if successful
            if (setupResult.referral?.success && setupResult.referral?.bonus) {
                toast.success(`🎉 You got ₦${setupResult.referral.bonus} referral bonus!`);
                localStorage.removeItem('pendingReferralCode');
                localStorage.removeItem('pendingReferralCodeTimestamp');
                localStorage.removeItem('referralFailed');
            }
            
            await refreshUserData();
            
            toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
            return { success: true };
        } catch (error) {
            // console.error('Verify OTP error:', error);
            toast.error('Invalid verification code');
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out');
        } catch (error) {
            // console.error('Logout error:', error);
        }
    };

    const refreshUserData = async () => {
        if (!user) return;
        
        try {
            const currentUser = auth.currentUser;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const firestoreData = userDoc.exists() ? userDoc.data() : {};
            
            const mergedData = {
                uid: user.uid,
                ...firestoreData,
                fullName: firestoreData.fullName || currentUser?.displayName || '',
                email: firestoreData.email || currentUser?.email || '',
                phone: firestoreData.phone || currentUser?.phoneNumber || '',
                photoURL: currentUser?.photoURL || firestoreData.photoURL || '',
                currentCycle: firestoreData.currentCycle || 0,
                currentDay: firestoreData.currentDay || 0,
                hasStartedCycle: firestoreData.hasStartedCycle || false,
                day0MessageSent: firestoreData.day0MessageSent || true,
                day0MessageSentAt: firestoreData.day0MessageSentAt || null,
                cycleStartDate: firestoreData.cycleStartDate || null,
                totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
                totalInterestEarned: firestoreData.totalInterestEarned || 0,
                currentBalance: firestoreData.currentBalance || 0,
                lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
                avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
                referralCode: firestoreData.referralCode || `SPARK${user.uid.slice(0, 6).toUpperCase()}`,
                referredBy: firestoreData.referredBy || null,
                isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
                joinDate: firestoreData.joinDate || new Date(),
                createdAt: firestoreData.createdAt || new Date(),
                role: firestoreData.role || (user.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
                graduationDate: firestoreData.graduationDate || null,
                premiumPlan: firestoreData.premiumPlan || 'Basic',
                premiumInterestRate: firestoreData.premiumInterestRate || 5,
                premiumStartDate: firestoreData.premiumStartDate || null,
                premiumStatus: firestoreData.premiumStatus || 'inactive',
                totalWithdrawn: firestoreData.totalWithdrawn || 0,
                avgDays0to16: firestoreData.avgDays1to16 || 0,
                days1to16Count: firestoreData.days1to16Count || 0,
                days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
                totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
                todaysDeposit: firestoreData.todaysDeposit || 0,
                bankCode: firestoreData.bankCode || null,
                accountNumber: firestoreData.accountNumber || null,
                accountName: firestoreData.accountName || null,
                bankName: firestoreData.bankName || null,
                flwAccountNumber: firestoreData.flwAccountNumber || null,
                flwBankName: firestoreData.flwBankName || null,
                flwCustomerId: firestoreData.flwCustomerId || null,
                bvn: firestoreData.bvn || null
            };
            
            setUserData(mergedData);
        } catch (error) {
            // console.error('Failed to refresh user data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                const firestoreData = userDoc.exists() ? userDoc.data() : {};
                
                const mergedData = {
                    uid: firebaseUser.uid,
                    ...firestoreData,
                    fullName: firestoreData.fullName || firebaseUser.displayName || '',
                    email: firestoreData.email || firebaseUser.email || '',
                    phone: firestoreData.phone || firebaseUser.phoneNumber || '',
                    photoURL: firebaseUser.photoURL || firestoreData.photoURL || '',
                    currentCycle: firestoreData.currentCycle || 0,
                    currentDay: firestoreData.currentDay || 0,
                    hasStartedCycle: firestoreData.hasStartedCycle || false,
                    day0MessageSent: firestoreData.day0MessageSent || true,
                    day0MessageSentAt: firestoreData.day0MessageSentAt || null,
                    cycleStartDate: firestoreData.cycleStartDate || null,
                    totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
                    totalInterestEarned: firestoreData.totalInterestEarned || 0,
                    currentBalance: firestoreData.currentBalance || 0,
                    lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
                    avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
                    referralCode: firestoreData.referralCode || `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                    referredBy: firestoreData.referredBy || null,
                    isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
                    joinDate: firestoreData.joinDate || new Date(),
                    createdAt: firestoreData.createdAt || new Date(),
                    role: firestoreData.role || (firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
                    graduationDate: firestoreData.graduationDate || null,
                    premiumPlan: firestoreData.premiumPlan || 'Basic',
                    premiumInterestRate: firestoreData.premiumInterestRate || 5,
                    premiumStartDate: firestoreData.premiumStartDate || null,
                    premiumStatus: firestoreData.premiumStatus || 'inactive',
                    totalWithdrawn: firestoreData.totalWithdrawn || 0,
                    avgDays1to16: firestoreData.avgDays1to16 || 0,
                    days1to16Count: firestoreData.days1to16Count || 0,
                    days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
                    totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
                    todaysDeposit: firestoreData.todaysDeposit || 0,
                    bankCode: firestoreData.bankCode || null,
                    accountNumber: firestoreData.accountNumber || null,
                    accountName: firestoreData.accountName || null,
                    bankName: firestoreData.bankName || null,
                    flwAccountNumber: firestoreData.flwAccountNumber || null,
                    flwBankName: firestoreData.flwBankName || null,
                    flwCustomerId: firestoreData.flwCustomerId || null,
                    bvn: firestoreData.bvn || null
                };
                
                setUserData(mergedData);
            } else {
                setUserData(null);
            }
            
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        userData,
        loading,
        signInWithGoogle,
        sendOTP,
        verifyOTP,
        logout,
        refreshUserData, 
        isAdmin: userData?.role === 'admin'
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
            <div id="recaptcha-container"></div>
        </AuthContext.Provider>
    );
}