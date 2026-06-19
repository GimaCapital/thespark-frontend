import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function BvnCollection() {
    const { user, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [bvn, setBvn] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!bvn || bvn.length !== 11) {
            toast.error('Please enter a valid 11-digit BVN');
            return;
        }
        
        setLoading(true);
        
        try {
            // 1. Save BVN to Firebase
            await updateDoc(doc(db, 'users', user.uid), {
                bvn: bvn
            });
            
            await refreshUserData();
            toast.success('BVN saved successfully!');
            
            // 2. AUTOMATICALLY create virtual account (no button needed)
            console.log('🔄 Creating virtual account automatically...');
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/flutterwave/create-account', {
                email: user.email,
                fullName: user.displayName
            });
            
            if (response.data.success) {
                console.log('✅ Virtual account created:', response.data.accountNumber);
                toast.success('Your savings account is ready!');
            } else {
                console.warn('⚠️ Virtual account creation failed:', response.data.error);
                // Don't block user - they can try again later
            }
            
            // 3. Redirect to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to setup account. Please try again.');
            // Still redirect? Or stay on page?
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen">
            <div className="card max-w-md w-full">
                <h2 className="heading-2 text-center mb-4">Verify Your Identity</h2>
                <p className="text-body text-center mb-4">
                    To comply with financial regulations and create your savings account, 
                    please enter your Bank Verification Number (BVN).
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            BVN (Bank Verification Number)
                        </label>
                        <input
                            type="text"
                            value={bvn}
                            onChange={(e) => setBvn(e.target.value)}
                            placeholder="Enter your 11-digit BVN"
                            maxLength={11}
                            className="input w-full"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Your BVN is safe and encrypted. Required for regulatory compliance.
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? 'Setting up your account...' : 'Continue to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}