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
 * ✅ Process referral bonus with retry and better auth handling
 */
export const processReferral = async (userId, referralCode) => {
    if (!referralCode) return { success: false, reason: 'No referral code' };
    
    try {
        let retries = 0;
        let token = null;
        
        while (!token && retries < 5) {
            if (auth.currentUser) {
                token = await auth.currentUser.getIdToken();
            } else {
                console.log(`⏳ Waiting for auth... (${retries + 1}/5)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries++;
            }
        }
        
        if (!token) {
            localStorage.setItem('referralFailed', 'true');
            console.warn('⚠️ No auth token available, referral will be retried later');
            return { success: false, reason: 'Auth not ready' };
        }
        
        setAuthToken(token);
        
        const response = await api.post('/users/process-referral', { referralCode });
        const data = response.data;
        
        if (data.success && data.bonus) {
            localStorage.removeItem('pendingReferralCode');
            localStorage.removeItem('pendingReferralCodeTimestamp');
            localStorage.removeItem('referralFailed');
            return { success: true, bonus: data.bonus };
        }
        
        if (data.alreadyReferred) {
            localStorage.removeItem('pendingReferralCode');
            localStorage.removeItem('pendingReferralCodeTimestamp');
            localStorage.removeItem('referralFailed');
            return { success: true, alreadyReferred: true };
        }
        
        localStorage.setItem('referralFailed', 'true');
        return { success: false, reason: data.error || 'Referral failed' };
    } catch (error) {
        console.error('Referral processing error:', error);
        localStorage.setItem('referralFailed', 'true');
        return { success: false, reason: error.message };
    }
};

/**
 * ✅ Send welcome email - FINAL BEST VERSION
 * Uses the same endpoint as admin with improved auth handling
 */
export const sendWelcomeEmail = async (email, fullName) => {
    if (!email) {
        console.log('⚠️ No email provided, skipping welcome email');
        return { success: false, reason: 'No email provided', attempts: 0 };
    }
    
    try {
        // ✅ Wait for auth token (up to 20 seconds)
        let retries = 0;
        let token = null;
        
        console.log('⏳ Waiting for auth token for email...');
        
        while (!token && retries < 20) {
            if (auth.currentUser) {
                try {
                    token = await auth.currentUser.getIdToken(true);
                    if (token) {
                        console.log('✅ Auth token obtained for email');
                        break;
                    }
                } catch (tokenError) {
                    console.log(`⏳ Token error, retry ${retries + 1}/20`);
                }
            } else {
                console.log(`⏳ Waiting for auth.currentUser... (${retries + 1}/20)`);
            }
            
            if (!token) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries++;
            }
        }
        
        if (!token) {
            console.warn('⚠️ Could not get auth token after 20 retries');
            try {
                const userRef = doc(db, 'users', auth.currentUser?.uid || '');
                if (userRef) {
                    await updateDoc(userRef, {
                        welcomeEmailSent: false,
                        welcomeEmailError: 'Auth token not ready - will retry',
                        welcomeEmailAttempts: 0
                    });
                }
            } catch (e) {
                console.warn('Could not update email status:', e);
            }
            return { success: false, reason: 'Auth not ready', attempts: 0 };
        }
        
        // ✅ Set auth token and send email
        setAuthToken(token);
        
        console.log('📧 Sending welcome email to:', email);
        
        const response = await api.post('/users/send-welcome-email', {
            email,
            fullName: fullName || 'Thespark Member'
        });
        
        console.log('✅ Welcome email sent successfully');
        return { success: true, data: response.data, attempts: 1 };
    } catch (error) {
        console.error('❌ Welcome email error:', error);
        return { 
            success: false, 
            reason: error.response?.data?.error || error.message || 'Failed to send email',
            attempts: 1
        };
    }
};

/**
 * ✅ COMPLETE: Setup new user - FINAL BEST VERSION
 * Includes: document creation, referral processing, welcome email with retries
 */
export const setupNewUser = async (userId, userData = {}) => {
    try {
        const { userRef, isNewUser, referrerId } = await ensureUserDocument(userId, userData);
        console.log(`📝 User setup: ${isNewUser ? 'NEW' : 'EXISTING'}`);
        
        let referralResult = null;
        let emailResult = null;
        let emailSent = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        // 1. Process referral if new user
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
        
        // 2. Send welcome email with retries
        if (isNewUser && userData.email) {
            console.log('⏳ Waiting 3 seconds for auth to fully initialize...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            while (!emailSent && attempts < maxAttempts) {
                attempts++;
                console.log(`📧 Email attempt ${attempts}/${maxAttempts}...`);
                
                emailResult = await sendWelcomeEmail(userData.email, userData.fullName);
                
                if (emailResult.success) {
                    emailSent = true;
                    console.log('✅ Welcome email sent successfully');
                } else {
                    console.warn(`⚠️ Email attempt ${attempts} failed:`, emailResult.reason);
                    if (attempts < maxAttempts) {
                        console.log(`⏳ Waiting 3 seconds before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }
            }
            
            // Update user document
            try {
                await updateDoc(userRef, {
                    welcomeEmailSent: emailSent,
                    welcomeEmailSentAt: emailSent ? new Date().toISOString() : null,
                    welcomeEmailError: emailSent ? null : (emailResult?.reason || 'Email failed after 3 attempts'),
                    welcomeEmailAttempts: attempts,
                    welcomeEmailLastAttempt: new Date().toISOString()
                });
            } catch (updateError) {
                console.warn('⚠️ Could not update welcome email status:', updateError);
            }
            
            if (!emailSent) {
                console.warn('⚠️ Welcome email failed after 3 attempts. Admin can retry from dashboard.');
            }
        } else if (isNewUser && !userData.email) {
            console.log('ℹ️ No email provided, skipping welcome email');
            try {
                await updateDoc(userRef, {
                    welcomeEmailSent: true,
                    welcomeEmailError: 'No email provided',
                    welcomeEmailAttempts: 0,
                    welcomeEmailLastAttempt: new Date().toISOString()
                });
            } catch (updateError) {
                console.warn('⚠️ Could not update email status:', updateError);
            }
        }
        
        return {
            success: true,
            isNewUser,
            referral: referralResult,
            email: emailResult,
            emailSent: emailSent,
            emailAttempts: attempts,
            referrerId
        };
    } catch (error) {
        console.error('❌ User setup failed:', error);
        return { success: false, error: error.message };
    }
};