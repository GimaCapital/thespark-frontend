import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);

export { 
    signInWithPopup, 
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut,
    onAuthStateChanged,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    addDoc
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId, saveTokenCallback) => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
    }
    
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return null;
        }
        
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY
        });
        
        if (token && saveTokenCallback) {
            await saveTokenCallback(token);
        }
        
        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
    onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        if (callback) callback(payload);
    });
};