// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { 
//     auth, 
//     signInWithPopup, 
//     googleProvider,
//     signInWithPhoneNumber,
//     RecaptchaVerifier,
//     signOut,
//     onAuthStateChanged,
//     db,
//     doc,
//     getDoc,
//     setDoc,
//     collection,
//     query,
//     where,
//     getDocs,
//     addDoc
// } from '../services/firebase';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [recaptcha, setRecaptcha] = useState(null);

//     const setupRecaptcha = () => {
//         if (typeof window !== 'undefined' && !recaptcha) {
//             const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//                 size: 'invisible',
//                 callback: () => {}
//             });
//             setRecaptcha(verifier);
//             return verifier;
//         }
//         return recaptcha;
//     };

//     // const signInWithGoogle = async () => {
//     //     try {
//     //         const result = await signInWithPopup(auth, googleProvider);
//     //         const firebaseUser = result.user;
            
//     //         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
//     //         if (!userDoc.exists()) {
//     //             const newUser = {
//     //                 // === EXISTING FIELDS (ALL PRESERVED) ===
//     //                 fullName: firebaseUser.displayName,
//     //                 email: firebaseUser.email,
//     //                 phone: firebaseUser.phoneNumber || '',
//     //                 photoURL: firebaseUser.photoURL || '',
//     //                 joinDate: new Date(),
//     //                 currentCycle: 1,
//     //                 currentDay: 1,
//     //                 cycleStartDate: new Date(),
//     //                 totalPrincipalSaved: 0,
//     //                 totalInterestEarned: 0,
//     //                 currentBalance: 0,
//     //                 lowestBalanceThisCycle: 0,
//     //                 avgDailyBalanceThisCycle: 0,
//     //                 referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//     //                 referredBy: null,
//     //                 isActive: true,
//     //                 createdAt: new Date(),
//     //                 role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//     //                 // === NEW FIELDS FOR OPTION B (Days 1-16 tracking) ===
//     //                 avgDays1to16: 0,
//     //                 days1to16Count: 0,
//     //                 days1to16TotalBalance: 0,
//     //                 totalSavedDays1to16: 0,
//     //                 todaysDeposit: 0,
//     //                  // === ADD BANK ACCOUNT FIELDS HERE ===
//     //                 bankCode: null,
//     //                 accountNumber: null,
//     //                 accountName: null,
//     //                 bankName: null
//     //             };
//     //             await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
//     //         }
            
//     //          const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
        // toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//     //         return true;
//     //     } catch (error) {
//     //         console.error('Google sign in error:', error);
//     //         toast.error(error.message);
//     //         return false;
//     //     }
//     // };






//     const signInWithGoogle = async () => {
//     try {
//         const result = await signInWithPopup(auth, googleProvider);
//         const firebaseUser = result.user;
        
//         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//         let isNewUser = false;
        
//         if (!userDoc.exists()) {
//             isNewUser = true;
//             const newUser = {
//                 fullName: firebaseUser.displayName,
//                 email: firebaseUser.email,
//                 phone: firebaseUser.phoneNumber || '',
//                 photoURL: firebaseUser.photoURL || '',
//                 joinDate: new Date(),
//                 currentCycle: 1,
//                 currentDay: 1,
//                 cycleStartDate: new Date(),
//                 totalPrincipalSaved: 0,
//                 totalInterestEarned: 0,
//                 currentBalance: 0,
//                 lowestBalanceThisCycle: 0,
//                 avgDailyBalanceThisCycle: 0,
//                 referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                 referredBy: null,
//                 isActive: true,
//                 createdAt: new Date(),
//                 role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//                 avgDays1to16: 0,
//                 days1to16Count: 0,
//                 days1to16TotalBalance: 0,
//                 totalSavedDays1to16: 0,
//                 todaysDeposit: 0,
//                 bankCode: null,
//                 accountNumber: null,
//                 accountName: null,
//                 bankName: null,
//                 // Flutterwave fields
//                 flwAccountNumber: null,
//                 flwBankName: null,
//                 flwCustomerId: null
//             };
//             await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            
//             // Create Flutterwave virtual account for new user
//             await createFlutterwaveVirtualAccount(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
//         }
        
//          const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
        // toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//         return true;
//     } catch (error) {
//         console.error('Google sign in error:', error);
//         toast.error(error.message);
//         return false;
//     }
// };



//     const sendOTP = async (phoneNumber) => {
//         try {
//             const verifier = setupRecaptcha();
//             const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
//             return { success: true, confirmationResult };
//         } catch (error) {
//             console.error('Send OTP error:', error);
//             toast.error(error.message);
//             return { success: false, error: error.message };
//         }
//     };

//     // const verifyOTP = async (confirmationResult, code, fullName, referralCode) => {
//     //     try {
//     //         const result = await confirmationResult.confirm(code);
//     //         const firebaseUser = result.user;
            
//     //         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
//     //         if (!userDoc.exists()) {
//     //             const newUser = {
//     //                 // === EXISTING FIELDS (ALL PRESERVED) ===
//     //                 fullName: fullName,
//     //                 email: firebaseUser.email || '',
//     //                 phone: firebaseUser.phoneNumber,
//     //                 photoURL: '',
//     //                 joinDate: new Date(),
//     //                 currentCycle: 1,
//     //                 currentDay: 1,
//     //                 cycleStartDate: new Date(),
//     //                 totalPrincipalSaved: 0,
//     //                 totalInterestEarned: 0,
//     //                 currentBalance: 0,
//     //                 lowestBalanceThisCycle: 0,
//     //                 avgDailyBalanceThisCycle: 0,
//     //                 referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//     //                 referredBy: null,
//     //                 isActive: true,
//     //                 createdAt: new Date(),
//     //                 role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//     //                 // === NEW FIELDS FOR OPTION B (Days 1-16 tracking) ===
//     //                 avgDays1to16: 0,
//     //                 days1to16Count: 0,
//     //                 days1to16TotalBalance: 0,
//     //                 totalSavedDays1to16: 0,
//     //                 todaysDeposit: 0,
//     //                  // === ADD BANK ACCOUNT FIELDS HERE ===
//     //                 bankCode: null,
//     //                 accountNumber: null,
//     //                 accountName: null,
//     //                 bankName: null
//     //             };
                
//     //             if (referralCode) {
//     //                 const usersRef = collection(db, 'users');
//     //                 const q = query(usersRef, where('referralCode', '==', referralCode));
//     //                 const querySnapshot = await getDocs(q);
                    
//     //                 if (!querySnapshot.empty) {
//     //                     const referrer = querySnapshot.docs[0];
//     //                     newUser.referredBy = referrer.id;
                        
//     //                     await addDoc(collection(db, 'referrals'), {
//     //                         referrerId: referrer.id,
//     //                         referredId: firebaseUser.uid,
//     //                         rewardAmount: 500,
//     //                         rewardPaid: false,
//     //                         createdAt: new Date()
//     //                     });
//     //                 }
//     //             }
                
//     //             await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
//     //         }
            
//     //          const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
        // toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//     //         return { success: true };
//     //     } catch (error) {
//     //         console.error('Verify OTP error:', error);
//     //         toast.error('Invalid verification code');
//     //         return { success: false };
//     //     }
//     // };



//     const verifyOTP = async (confirmationResult, code, fullName, referralCode) => {
//     try {
//         const result = await confirmationResult.confirm(code);
//         const firebaseUser = result.user;
        
//         const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//         let isNewUser = false;
        
//         if (!userDoc.exists()) {
//             isNewUser = true;
//             const newUser = {
//                 fullName: fullName,
//                 email: firebaseUser.email || '',
//                 phone: firebaseUser.phoneNumber,
//                 photoURL: '',
//                 joinDate: new Date(),
//                 currentCycle: 1,
//                 currentDay: 1,
//                 cycleStartDate: new Date(),
//                 totalPrincipalSaved: 0,
//                 totalInterestEarned: 0,
//                 currentBalance: 0,
//                 lowestBalanceThisCycle: 0,
//                 avgDailyBalanceThisCycle: 0,
//                 referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                 referredBy: null,
//                 isActive: true,
//                 createdAt: new Date(),
//                 role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//                 avgDays1to16: 0,
//                 days1to16Count: 0,
//                 days1to16TotalBalance: 0,
//                 totalSavedDays1to16: 0,
//                 todaysDeposit: 0,
//                 bankCode: null,
//                 accountNumber: null,
//                 accountName: null,
//                 bankName: null,
//                 flwAccountNumber: null,
//                 flwBankName: null,
//                 flwCustomerId: null
//             };
            
//             if (referralCode) {
//                 const usersRef = collection(db, 'users');
//                 const q = query(usersRef, where('referralCode', '==', referralCode));
//                 const querySnapshot = await getDocs(q);
                
//                 if (!querySnapshot.empty) {
//                     const referrer = querySnapshot.docs[0];
//                     newUser.referredBy = referrer.id;
                    
//                     await addDoc(collection(db, 'referrals'), {
//                         referrerId: referrer.id,
//                         referredId: firebaseUser.uid,
//                         rewardAmount: 500,
//                         rewardPaid: false,
//                         createdAt: new Date()
//                     });
//                 }
//             }
            
//             await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            
//             // Create Flutterwave virtual account for new user
//             await createFlutterwaveVirtualAccount(firebaseUser.uid, firebaseUser.email || fullName, fullName);
//         }
        
//          const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
        // toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//         return { success: true };
//     } catch (error) {
//         console.error('Verify OTP error:', error);
//         toast.error('Invalid verification code');
//         return { success: false };
//     }
// };



//     // Add this function inside AuthProvider (after verifyOTP function)

// const createFlutterwaveVirtualAccount = async (userId, userEmail, userFullName) => {
//     try {
//         const token = await auth.currentUser.getIdToken();
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/flutterwave/create-account`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 userId: userId,
//                 email: userEmail,
//                 fullName: userFullName
//             })
//         });
        
//         const data = await response.json();
//         if (data.success && data.hasAccount) {
//             console.log('✅ Flutterwave virtual account created:', data.accountNumber);
//             return { success: true, accountNumber: data.accountNumber, bankName: data.bankName };
//         }
//         return { success: false };
//     } catch (error) {
//         console.error('Error creating Flutterwave virtual account:', error);
//         return { success: false };
//     }
// };


//     const logout = async () => {
//         try {
//             await signOut(auth);
//             toast.success('Logged out');
//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     const refreshUserData = async () => {
//         if (!user) return;
        
//         try {
//             // Get the current Firebase user (has latest photoURL)
//             const currentUser = auth.currentUser;
            
//             // Get Firestore data
//             const userDoc = await getDoc(doc(db, 'users', user.uid));
//             const firestoreData = userDoc.exists() ? userDoc.data() : {};
            
//             // MERGE: Firebase Auth photoURL has priority
//             const mergedData = {
//                 // === EXISTING FIELDS (ALL PRESERVED) ===
//                 uid: user.uid,
//                 ...firestoreData,
//                 fullName: firestoreData.fullName || currentUser?.displayName || '',
//                 email: firestoreData.email || currentUser?.email || '',
//                 phone: firestoreData.phone || currentUser?.phoneNumber || '',
//                 photoURL: currentUser?.photoURL || firestoreData.photoURL || '',
//                 currentCycle: firestoreData.currentCycle || 1,
//                 currentDay: firestoreData.currentDay || 1,
//                 totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
//                 totalInterestEarned: firestoreData.totalInterestEarned || 0,
//                 currentBalance: firestoreData.currentBalance || 0,
//                 lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
//                 avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
//                 referralCode: firestoreData.referralCode || `SPARK${user.uid.slice(0, 6).toUpperCase()}`,
//                 referredBy: firestoreData.referredBy || null,
//                 isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
//                 joinDate: firestoreData.joinDate || new Date(),
//                 cycleStartDate: firestoreData.cycleStartDate || new Date(),
//                 createdAt: firestoreData.createdAt || new Date(),
//                 role: firestoreData.role || (user.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
//                 graduationDate: firestoreData.graduationDate || null,
//                 premiumPlan: firestoreData.premiumPlan || 'Basic',
//                 premiumInterestRate: firestoreData.premiumInterestRate || 5,
//                 premiumStartDate: firestoreData.premiumStartDate || null,
//                 premiumStatus: firestoreData.premiumStatus || 'inactive',
//                 totalWithdrawn: firestoreData.totalWithdrawn || 0,
//                 // === NEW FIELDS FOR OPTION B (Days 1-16 tracking) ===
//                 avgDays1to16: firestoreData.avgDays1to16 || 0,
//                 days1to16Count: firestoreData.days1to16Count || 0,
//                 days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
//                 totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
//                 todaysDeposit: firestoreData.todaysDeposit || 0,
//                   // === ADD BANK ACCOUNT FIELDS HERE ===
//                 bankCode: firestoreData.bankCode || null,
//                 accountNumber: firestoreData.accountNumber || null,
//                 accountName: firestoreData.accountName || null,
//                 bankName: firestoreData.bankName || null
//             };
            
//             setUserData(mergedData);
//         } catch (error) {
//             console.error('Failed to refresh user data:', error);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//             setUser(firebaseUser);
            
//             if (firebaseUser) {
//                 // Get Firestore data
//                 const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//                 const firestoreData = userDoc.exists() ? userDoc.data() : {};
                
//                 // MERGE: Firebase Auth photoURL has priority
//                 const mergedData = {
//                     // === EXISTING FIELDS (ALL PRESERVED) ===
//                     uid: firebaseUser.uid,
//                     ...firestoreData,
//                     fullName: firestoreData.fullName || firebaseUser.displayName || '',
//                     email: firestoreData.email || firebaseUser.email || '',
//                     phone: firestoreData.phone || firebaseUser.phoneNumber || '',
//                     photoURL: firebaseUser.photoURL || firestoreData.photoURL || '',
//                     currentCycle: firestoreData.currentCycle || 1,
//                     currentDay: firestoreData.currentDay || 1,
//                     totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
//                     totalInterestEarned: firestoreData.totalInterestEarned || 0,
//                     currentBalance: firestoreData.currentBalance || 0,
//                     lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
//                     avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
//                     referralCode: firestoreData.referralCode || `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                     referredBy: firestoreData.referredBy || null,
//                     isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
//                     joinDate: firestoreData.joinDate || new Date(),
//                     cycleStartDate: firestoreData.cycleStartDate || new Date(),
//                     createdAt: firestoreData.createdAt || new Date(),
//                     role: firestoreData.role || (firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
//                     graduationDate: firestoreData.graduationDate || null,
//                     premiumPlan: firestoreData.premiumPlan || 'Basic',
//                     premiumInterestRate: firestoreData.premiumInterestRate || 5,
//                     premiumStartDate: firestoreData.premiumStartDate || null,
//                     premiumStatus: firestoreData.premiumStatus || 'inactive',
//                     totalWithdrawn: firestoreData.totalWithdrawn || 0,
//                     // === NEW FIELDS FOR OPTION B (Days 1-16 tracking) ===
//                     avgDays1to16: firestoreData.avgDays1to16 || 0,
//                     days1to16Count: firestoreData.days1to16Count || 0,
//                     days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
//                     totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
//                     todaysDeposit: firestoreData.todaysDeposit || 0,
//                       // === ADD BANK ACCOUNT FIELDS HERE ===
//                     bankCode: firestoreData.bankCode || null,
//                     accountNumber: firestoreData.accountNumber || null,
//                     accountName: firestoreData.accountName || null,
//                     bankName: firestoreData.bankName || null
//                 };
                
//                 setUserData(mergedData);
//             } else {
//                 setUserData(null);
//             }
            
//             setLoading(false);
//         });
        
//         return () => unsubscribe();
//     }, []);

//     const value = {
//         user,
//         userData,
//         loading,
//         signInWithGoogle,
//         sendOTP,
//         verifyOTP,
//         logout,
//         refreshUserData, 
//         isAdmin: userData?.role === 'admin'
//     };
    
//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//             <div id="recaptcha-container"></div>
//         </AuthContext.Provider>
//     );
// }



// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { 
//     auth, 
//     signInWithPopup, 
//     googleProvider,
//     signInWithPhoneNumber,
//     RecaptchaVerifier,
//     signOut,
//     onAuthStateChanged,
//     db,
//     doc,
//     getDoc,
//     setDoc,
//     collection,
//     query,
//     where,
//     getDocs,
//     addDoc
// } from '../services/firebase';
// import toast from 'react-hot-toast';

// const AuthContext = createContext();

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [recaptcha, setRecaptcha] = useState(null);

//     const setupRecaptcha = () => {
//         if (typeof window !== 'undefined' && !recaptcha) {
//             const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//                 size: 'invisible',
//                 callback: () => {}
//             });
//             setRecaptcha(verifier);
//             return verifier;
//         }
//         return recaptcha;
//     };

//     const createFlutterwaveVirtualAccount = async (userId, userEmail, userFullName, userBvn = null) => {
//         try {
//             const token = await auth.currentUser.getIdToken();
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/flutterwave/create-account`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     userId: userId,
//                     email: userEmail,
//                     fullName: userFullName,
//                     bvn: userBvn
//                 })
//             });
            
//             const data = await response.json();
//             if (data.success && data.hasAccount) {
//                 console.log('✅ Flutterwave virtual account created:', data.accountNumber);
//                 return { success: true, accountNumber: data.accountNumber, bankName: data.bankName };
//             }
//             return { success: false };
//         } catch (error) {
//             console.error('Error creating Flutterwave virtual account:', error);
//             return { success: false };
//         }
//     };

//     const signInWithGoogle = async () => {
//         try {
//             const result = await signInWithPopup(auth, googleProvider);
//             const firebaseUser = result.user;
//              const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
            
//             const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
//             if (!userDoc.exists()) {
//                 const newUser = {
//                     fullName: firebaseUser.displayName,
//                     email: firebaseUser.email,
//                     phone: firebaseUser.phoneNumber || '',
//                     photoURL: firebaseUser.photoURL || '',
//                     joinDate: new Date(),
//                     currentCycle: 0,
//                     currentDay: 0,
//                                     // ✅ NEW: Track if user has started their cycle
//                     hasStartedCycle: false,
//                     // ✅ NEW: Track if Day 0 welcome message was sent
//                     day0MessageSent: false,
//                     day0MessageSentAt: null,
//                     cycleStartDate: null,  // Will be set when they make first deposit
//                     cycleStartDate: new Date(),
//                     totalPrincipalSaved: 0,
//                     totalInterestEarned: 0,
//                     currentBalance: 0,
//                     lowestBalanceThisCycle: 0,
//                     avgDailyBalanceThisCycle: 0,
//                     referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                     referredBy: null,
//                     isActive: true,
//                     createdAt: new Date(),
//                     role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//                     avgDays1to16: 0,
//                     days1to16Count: 0,
//                     days1to16TotalBalance: 0,
//                     totalSavedDays1to16: 0,
//                     todaysDeposit: 0,
//                     bankCode: null,
//                     accountNumber: null,
//                     accountName: null,
//                     bankName: null,
//                     flwAccountNumber: null,
//                     flwBankName: null,
//                     flwCustomerId: null,
//                     bvn: null
//                 };
//                 await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                
//                 // Virtual account will be created when user adds BVN
//             }
            
//             //  const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
//              toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//             return true;
//         } catch (error) {
//             console.error('Google sign in error:', error);
//             toast.error(error.message);
//             return false;
//         }
//     };

//     const sendOTP = async (phoneNumber) => {
//         try {
//             const verifier = setupRecaptcha();
//             const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
//             return { success: true, confirmationResult };
//         } catch (error) {
//             console.error('Send OTP error:', error);
//             toast.error(error.message);
//             return { success: false, error: error.message };
//         }
//     };

//     const verifyOTP = async (confirmationResult, code, fullName, referralCode) => {
//         try {
//             const result = await confirmationResult.confirm(code);
//             const firebaseUser = result.user;
//             const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
            
//             const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
//             if (!userDoc.exists()) {
//                 const newUser = {
//                     fullName: fullName,
//                     email: firebaseUser.email || '',
//                     phone: firebaseUser.phoneNumber,
//                     photoURL: '',
//                     joinDate: new Date(),
//                     currentCycle: 0,
//                     currentDay: 0,
//                      // ✅ NEW: Same fields
//                     hasStartedCycle: false,
//                     day0MessageSent: false,
//                     day0MessageSentAt: null,
//                     cycleStartDate: null,
//                     cycleStartDate: new Date(),
//                     totalPrincipalSaved: 0,
//                     totalInterestEarned: 0,
//                     currentBalance: 0,
//                     lowestBalanceThisCycle: 0,
//                     avgDailyBalanceThisCycle: 0,
//                     referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                     referredBy: null,
//                     isActive: true,
//                     createdAt: new Date(),
//                     role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
//                     avgDays1to16: 0,
//                     days1to16Count: 0,
//                     days1to16TotalBalance: 0,
//                     totalSavedDays1to16: 0,
//                     todaysDeposit: 0,
//                     bankCode: null,
//                     accountNumber: null,
//                     accountName: null,
//                     bankName: null,
//                     flwAccountNumber: null,
//                     flwBankName: null,
//                     flwCustomerId: null,
//                     bvn: null
//                 };
                
//                 if (referralCode) {
//                     const usersRef = collection(db, 'users');
//                     const q = query(usersRef, where('referralCode', '==', referralCode));
//                     const querySnapshot = await getDocs(q);
                    
//                     if (!querySnapshot.empty) {
//                         const referrer = querySnapshot.docs[0];
//                         newUser.referredBy = referrer.id;
                        
//                         await addDoc(collection(db, 'referrals'), {
//                             referrerId: referrer.id,
//                             referredId: firebaseUser.uid,
//                             rewardAmount: 500,
//                             rewardPaid: false,
//                             createdAt: new Date()
//                         });
//                     }
//                 }
                
//                 await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
//             }
            
//             //  const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
//              toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
//             return { success: true };
//         } catch (error) {
//             console.error('Verify OTP error:', error);
//             toast.error('Invalid verification code');
//             return { success: false };
//         }
//     };

//     const logout = async () => {
//         try {
//             await signOut(auth);
//             toast.success('Logged out');
//         } catch (error) {
//             console.error('Logout error:', error);
//         }
//     };

//     const refreshUserData = async () => {
//         if (!user) return;
        
//         try {
//             const currentUser = auth.currentUser;
//             const userDoc = await getDoc(doc(db, 'users', user.uid));
//             const firestoreData = userDoc.exists() ? userDoc.data() : {};
            
//             const mergedData = {
//                 uid: user.uid,
//                 ...firestoreData,
//                 fullName: firestoreData.fullName || currentUser?.displayName || '',
//                 email: firestoreData.email || currentUser?.email || '',
//                 phone: firestoreData.phone || currentUser?.phoneNumber || '',
//                 photoURL: currentUser?.photoURL || firestoreData.photoURL || '',
//                 currentCycle: firestoreData.currentCycle || 0,
//                 currentDay: firestoreData.currentDay || 0,
//                 hasStartedCycle: firestoreData.hasStartedCycle || false,
//                 day0MessageSent: firestoreData.day0MessageSent || false,
//                 day0MessageSentAt: firestoreData.day0MessageSentAt || null,
//                 cycleStartDate: firestoreData.cycleStartDate || null,
//                 totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
//                 totalInterestEarned: firestoreData.totalInterestEarned || 0,
//                 currentBalance: firestoreData.currentBalance || 0,
//                 lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
//                 avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
//                 referralCode: firestoreData.referralCode || `SPARK${user.uid.slice(0, 6).toUpperCase()}`,
//                 referredBy: firestoreData.referredBy || null,
//                 isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
//                 joinDate: firestoreData.joinDate || new Date(),
//                 cycleStartDate: firestoreData.cycleStartDate || new Date(),
//                 createdAt: firestoreData.createdAt || new Date(),
//                 role: firestoreData.role || (user.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
//                 graduationDate: firestoreData.graduationDate || null,
//                 premiumPlan: firestoreData.premiumPlan || 'Basic',
//                 premiumInterestRate: firestoreData.premiumInterestRate || 5,
//                 premiumStartDate: firestoreData.premiumStartDate || null,
//                 premiumStatus: firestoreData.premiumStatus || 'inactive',
//                 totalWithdrawn: firestoreData.totalWithdrawn || 0,
//                 avgDays0to16: firestoreData.avgDays1to16 || 0,
//                 days1to16Count: firestoreData.days1to16Count || 0,
//                 days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
//                 totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
//                 todaysDeposit: firestoreData.todaysDeposit || 0,
//                 bankCode: firestoreData.bankCode || null,
//                 accountNumber: firestoreData.accountNumber || null,
//                 accountName: firestoreData.accountName || null,
//                 bankName: firestoreData.bankName || null,
//                 flwAccountNumber: firestoreData.flwAccountNumber || null,
//                 flwBankName: firestoreData.flwBankName || null,
//                 flwCustomerId: firestoreData.flwCustomerId || null,
//                 bvn: firestoreData.bvn || null
//             };
            
//             setUserData(mergedData);
//         } catch (error) {
//             console.error('Failed to refresh user data:', error);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//             setUser(firebaseUser);
            
//             if (firebaseUser) {
//                 const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
//                 const firestoreData = userDoc.exists() ? userDoc.data() : {};
                
//                 const mergedData = {
//                     uid: firebaseUser.uid,
//                     ...firestoreData,
//                     fullName: firestoreData.fullName || firebaseUser.displayName || '',
//                     email: firestoreData.email || firebaseUser.email || '',
//                     phone: firestoreData.phone || firebaseUser.phoneNumber || '',
//                     photoURL: firebaseUser.photoURL || firestoreData.photoURL || '',
//                     currentCycle: firestoreData.currentCycle || 0,
//                     currentDay: firestoreData.currentDay || 0,
//                     hasStartedCycle: firestoreData.hasStartedCycle || false,
//                     day0MessageSent: firestoreData.day0MessageSent || false,
//                     day0MessageSentAt: firestoreData.day0MessageSentAt || null,
//                     cycleStartDate: firestoreData.cycleStartDate || null,
//                     totalPrincipalSaved: firestoreData.totalPrincipalSaved || 0,
//                     totalInterestEarned: firestoreData.totalInterestEarned || 0,
//                     currentBalance: firestoreData.currentBalance || 0,
//                     lowestBalanceThisCycle: firestoreData.lowestBalanceThisCycle || 0,
//                     avgDailyBalanceThisCycle: firestoreData.avgDailyBalanceThisCycle || 0,
//                     referralCode: firestoreData.referralCode || `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
//                     referredBy: firestoreData.referredBy || null,
//                     isActive: firestoreData.isActive !== undefined ? firestoreData.isActive : true,
//                     joinDate: firestoreData.joinDate || new Date(),
//                     cycleStartDate: firestoreData.cycleStartDate || new Date(),
//                     createdAt: firestoreData.createdAt || new Date(),
//                     role: firestoreData.role || (firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user'),
//                     graduationDate: firestoreData.graduationDate || null,
//                     premiumPlan: firestoreData.premiumPlan || 'Basic',
//                     premiumInterestRate: firestoreData.premiumInterestRate || 5,
//                     premiumStartDate: firestoreData.premiumStartDate || null,
//                     premiumStatus: firestoreData.premiumStatus || 'inactive',
//                     totalWithdrawn: firestoreData.totalWithdrawn || 0,
//                     avgDays1to16: firestoreData.avgDays1to16 || 0,
//                     days1to16Count: firestoreData.days1to16Count || 0,
//                     days1to16TotalBalance: firestoreData.days1to16TotalBalance || 0,
//                     totalSavedDays1to16: firestoreData.totalSavedDays1to16 || 0,
//                     todaysDeposit: firestoreData.todaysDeposit || 0,
//                     bankCode: firestoreData.bankCode || null,
//                     accountNumber: firestoreData.accountNumber || null,
//                     accountName: firestoreData.accountName || null,
//                     bankName: firestoreData.bankName || null,
//                     flwAccountNumber: firestoreData.flwAccountNumber || null,
//                     flwBankName: firestoreData.flwBankName || null,
//                     flwCustomerId: firestoreData.flwCustomerId || null,
//                     bvn: firestoreData.bvn || null
//                 };
                
//                 setUserData(mergedData);
//             } else {
//                 setUserData(null);
//             }
            
//             setLoading(false);
//         });
        
//         return () => unsubscribe();
//     }, []);

//     const value = {
//         user,
//         userData,
//         loading,
//         signInWithGoogle,
//         sendOTP,
//         verifyOTP,
//         logout,
//         refreshUserData, 
//         isAdmin: userData?.role === 'admin'
//     };
    
//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//             <div id="recaptcha-container"></div>
//         </AuthContext.Provider>
//     );
// }

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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/flutterwave/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    email: userEmail,
                    fullName: userFullName,
                    bvn: userBvn
                })
            });
            
            const data = await response.json();
            if (data.success && data.hasAccount) {
                console.log('✅ Flutterwave virtual account created:', data.accountNumber);
                return { success: true, accountNumber: data.accountNumber, bankName: data.bankName };
            }
            return { success: false };
        } catch (error) {
            console.error('Error creating Flutterwave virtual account:', error);
            return { success: false };
        }
    };

    // ✅ UPDATED: Google sign-in with referral code support
    const signInWithGoogle = async (referralCode = null) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
            
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (!userDoc.exists()) {
                const newUser = {
                    fullName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    phone: firebaseUser.phoneNumber || '',
                    photoURL: firebaseUser.photoURL || '',
                    joinDate: new Date(),
                    currentCycle: 0,
                    currentDay: 0,
                    hasStartedCycle: false,
                    day0MessageSent: true,
                    day0MessageSentAt: new Date(),
                    cycleStartDate: null,
                    totalPrincipalSaved: 0,
                    totalInterestEarned: 0,
                    currentBalance: 0,
                    lowestBalanceThisCycle: 0,
                    avgDailyBalanceThisCycle: 0,
                    referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                    referredBy: null,
                    isActive: true,
                    createdAt: new Date(),
                    role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
                    avgDays1to16: 0,
                    days1to16Count: 0,
                    days1to16TotalBalance: 0,
                    totalSavedDays1to16: 0,
                    todaysDeposit: 0,
                    bankCode: null,
                    accountNumber: null,
                    accountName: null,
                    bankName: null,
                    flwAccountNumber: null,
                    flwBankName: null,
                    flwCustomerId: null,
                    bvn: null
                };
                
                // ✅ Handle referral code for Google sign-in
                if (referralCode) {
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where('referralCode', '==', referralCode));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const referrer = querySnapshot.docs[0];
                        newUser.referredBy = referrer.id;
                        
                        await addDoc(collection(db, 'referrals'), {
                            referrerId: referrer.id,
                            referredId: firebaseUser.uid,
                            rewardAmount: 500,
                            rewardPaid: false,
                            createdAt: new Date()
                        });
                        
                        console.log(`✅ Google sign-in: Referral tracked for ${referralCode}`);
                    }
                }
                
                await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            }
            
            toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
            return true;
        } catch (error) {
            console.error('Google sign in error:', error);
            toast.error(error.message);
            return false;
        }
    };

    const sendOTP = async (phoneNumber) => {
        try {
            const verifier = setupRecaptcha();
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
            return { success: true, confirmationResult };
        } catch (error) {
            console.error('Send OTP error:', error);
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    const verifyOTP = async (confirmationResult, code, fullName, referralCode) => {
        try {
            const result = await confirmationResult.confirm(code);
            const firebaseUser = result.user;
            const firstName = firebaseUser.displayName?.split(' ')[0] || 'Saver';
            
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            
            if (!userDoc.exists()) {
                const newUser = {
                    fullName: fullName,
                    email: firebaseUser.email || '',
                    phone: firebaseUser.phoneNumber,
                    photoURL: '',
                    joinDate: new Date(),
                    currentCycle: 0,
                    currentDay: 0,
                    hasStartedCycle: false,
                    day0MessageSent: true,
                    day0MessageSentAt: new Date(),
                    cycleStartDate: null,
                    totalPrincipalSaved: 0,
                    totalInterestEarned: 0,
                    currentBalance: 0,
                    lowestBalanceThisCycle: 0,
                    avgDailyBalanceThisCycle: 0,
                    referralCode: `SPARK${firebaseUser.uid.slice(0, 6).toUpperCase()}`,
                    referredBy: null,
                    isActive: true,
                    createdAt: new Date(),
                    role: firebaseUser.uid === import.meta.env.VITE_ADMIN_UID ? 'admin' : 'user',
                    avgDays1to16: 0,
                    days1to16Count: 0,
                    days1to16TotalBalance: 0,
                    totalSavedDays1to16: 0,
                    todaysDeposit: 0,
                    bankCode: null,
                    accountNumber: null,
                    accountName: null,
                    bankName: null,
                    flwAccountNumber: null,
                    flwBankName: null,
                    flwCustomerId: null,
                    bvn: null
                };
                
                if (referralCode) {
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where('referralCode', '==', referralCode));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const referrer = querySnapshot.docs[0];
                        newUser.referredBy = referrer.id;
                        
                        await addDoc(collection(db, 'referrals'), {
                            referrerId: referrer.id,
                            referredId: firebaseUser.uid,
                            rewardAmount: 500,
                            rewardPaid: false,
                            createdAt: new Date()
                        });
                    }
                }
                
                await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            }
            
            toast.success(`👋 Welcome to TheSpark, ${firstName}!`);
            return { success: true };
        } catch (error) {
            console.error('Verify OTP error:', error);
            toast.error('Invalid verification code');
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out');
        } catch (error) {
            console.error('Logout error:', error);
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
            console.error('Failed to refresh user data:', error);
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