// src/utils/userUtils.js
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';

/**
 * ✅ DEFAULT USER DATA - Single source of truth
 */
export const getDefaultUserData = (userId, userEmail, userDisplayName) => ({
    fullName: userDisplayName || 'Thespark Member',
    email: userEmail || '',
    phone: '',
    photoURL: '',
    joinDate: new Date().toISOString(),
    currentCycle: 0,
    currentDay: 0,
    hasStartedCycle: false,
    day0MessageSent: true,
    day0MessageSentAt: new Date().toISOString(),
    cycleStartDate: null,
    totalPrincipalSaved: 0,
    totalInterestEarned: 0,
    currentBalance: 0,
    lowestBalanceThisCycle: 0,
    avgDailyBalanceThisCycle: 0,
    referralCode: `SPARK${userId.slice(0, 6).toUpperCase()}`,
    referredBy: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    role: 'user',
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
    bvn: null,
    welcomeEmailSent: false,
    welcomeEmailAttempts: 0,
    welcomeEmailError: null,
    updatedAt: new Date().toISOString()
});

/**
 * ✅ Find referrer by referral code
 */
export const findReferrer = async (referralCode) => {
    if (!referralCode) return null;
    
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', referralCode));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        }
        return null;
    } catch (error) {
        console.error('Error finding referrer:', error);
        return null;
    }
};

/**
 * ✅ PROFESSIONAL: Idempotent user document creation
 * Always safe to call - will create if missing, update if exists
 */
export const ensureUserDocument = async (userId, userData = {}) => {
    if (!userId) throw new Error('User ID is required');
    
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        let isNewUser = false;
        let referrerId = null;
        
        if (!userSnap.exists()) {
            isNewUser = true;
            console.log(`📝 Creating user document for: ${userId}`);
            
            const defaultData = getDefaultUserData(
                userId, 
                userData.email || '', 
                userData.fullName || 'Thespark Member'
            );
            
            // ✅ Process referral if available
            const referralCode = localStorage.getItem('pendingReferralCode');
            if (referralCode) {
                try {
                    referrerId = await findReferrer(referralCode);
                    if (referrerId) {
                        defaultData.referredBy = referrerId;
                        console.log(`✅ Referrer found: ${referrerId}`);
                    }
                } catch (error) {
                    console.warn('Referral lookup failed:', error);
                }
            }
            
            // ✅ Merge with provided user data
            const finalData = {
                ...defaultData,
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await setDoc(userRef, finalData);
            console.log('✅ User document created');
        } else {
            // ✅ Update existing user if needed
            const existingData = userSnap.data();
            const updates = {
                updatedAt: new Date().toISOString()
            };
            
            // Only update if fields are missing or different
            Object.keys(userData).forEach(key => {
                if (userData[key] !== undefined && existingData[key] !== userData[key]) {
                    updates[key] = userData[key];
                }
            });
            
            if (Object.keys(updates).length > 1) {
                await updateDoc(userRef, updates);
                console.log('✅ User document updated');
            }
        }
        
        return { userRef, isNewUser, referrerId };
    } catch (error) {
        console.error('❌ Failed to ensure user document:', error);
        throw new Error('Failed to setup user account. Please try again.');
    }
};

/**
 * ✅ Process referral bonus
 * Complete with ALL original logic: success, failure, retry, flag
 */
export const processReferral = async (userId, referralCode) => {
    if (!referralCode) return { success: false, reason: 'No referral code' };
    
    try {
        const token = await auth.currentUser.getIdToken();
        setAuthToken(token);
        
        const response = await api.post('/users/process-referral', { referralCode });
        const data = response.data;
        
        if (data.success && data.bonus) {
            // ✅ Clear referral code from storage on success
            localStorage.removeItem('pendingReferralCode');
            localStorage.removeItem('pendingReferralCodeTimestamp');
            localStorage.removeItem('referralFailed');
            
            return { success: true, bonus: data.bonus };
        }
        
        if (data.alreadyReferred) {
            // ✅ Clear on already referred
            localStorage.removeItem('pendingReferralCode');
            localStorage.removeItem('pendingReferralCodeTimestamp');
            localStorage.removeItem('referralFailed');
            return { success: true, alreadyReferred: true };
        }
        
        // ❌ Referral failed - set flag and keep code for retry
        localStorage.setItem('referralFailed', 'true');
        return { success: false, reason: data.error || 'Referral failed' };
    } catch (error) {
        console.error('Referral processing error:', error);
        // ❌ Referral failed - set flag and keep code for retry
        localStorage.setItem('referralFailed', 'true');
        return { success: false, reason: error.message };
    }
};

/**
 * ✅ Send welcome email
 */
export const sendWelcomeEmail = async (email, fullName) => {
    if (!email) return { success: false, reason: 'No email provided' };
    
    try {
        const token = await auth.currentUser.getIdToken();
        setAuthToken(token);
        
        await api.post('/users/send-welcome-email', {
            email,
            fullName: fullName || 'Thespark Member'
        });
        
        return { success: true };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false, reason: error.message };
    }
};

/**
 * ✅ COMPLETE: Setup new user (handles everything)
 * Includes: document creation, referral processing, welcome email
 */
export const setupNewUser = async (userId, userData = {}) => {
    try {
        // 1. Ensure user document exists
        const { userRef, isNewUser, referrerId } = await ensureUserDocument(userId, userData);
        console.log(`📝 User setup: ${isNewUser ? 'NEW' : 'EXISTING'}`);
        
        let referralResult = null;
        let emailResult = null;
        
        // 2. Process referral if new user
        if (isNewUser) {
            const referralCode = localStorage.getItem('pendingReferralCode');
            if (referralCode) {
                referralResult = await processReferral(userId, referralCode);
                if (referralResult.success) {
                    console.log(`✅ Referral bonus processed: ₦${referralResult.bonus || 0}`);
                } else {
                    console.warn('⚠️ Referral failed, code kept for retry');
                }
            }
        }
        
        // 3. Send welcome email (for all new users)
        if (isNewUser) {
            emailResult = await sendWelcomeEmail(userData.email, userData.fullName);
            if (emailResult.success) {
                console.log('✅ Welcome email sent');
                // Update user document to mark email sent
                await updateDoc(userRef, {
                    welcomeEmailSent: true,
                    welcomeEmailSentAt: new Date().toISOString()
                });
            } else {
                console.warn('⚠️ Welcome email failed:', emailResult.reason);
            }
        }
        
        return {
            success: true,
            isNewUser,
            referral: referralResult,
            email: emailResult,
            referrerId
        };
    } catch (error) {
        console.error('❌ User setup failed:', error);
        return { success: false, error: error.message };
    }
};