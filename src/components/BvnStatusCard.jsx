import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';

export default function BvnStatusCard() {
    const { user, refreshUserData } = useAuth();
    const [status, setStatus] = useState({
        hasBvn: false,
        hasVirtualAccount: false,
        bvn: null,
        flwAccountNumber: null,
        flwBankName: null
    });
    const [loading, setLoading] = useState(false);
    const [showBvnInput, setShowBvnInput] = useState(false);
    const [newBvn, setNewBvn] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            loadStatus();
        }
    }, [user]);

    const loadStatus = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.get('/users/bvn-status');
            if (response.data.success) {
                setStatus(response.data.data);
            }
        } catch (error) {
            console.error('Error loading BVN status:', error);
        }
    };

    // ✅ Validate BVN
    const validateBvn = (value) => {
        const cleanBvn = value.replace(/\D/g, '');
        if (cleanBvn.length !== 11) {
            return { valid: false, message: 'BVN must be exactly 11 digits' };
        }
        return { valid: true, cleanBvn };
    };

    // ✅ Delete BVN
    const handleDeleteBvn = async () => {
        if (!window.confirm('Are you sure you want to delete your BVN?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.delete('/users/delete-bvn');
            if (response.data.success) {
                toast.success('BVN removed successfully!');
                await loadStatus();
                await refreshUserData();
                setShowBvnInput(false);
                setNewBvn('');
            } else {
                toast.error(response.data.error || 'Failed to remove BVN');
            }
        } catch (error) {
            console.error('Error deleting BVN:', error);
            toast.error('Failed to remove BVN');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Update BVN
    const handleUpdateBvn = async () => {
        setError('');
        
        const validation = validateBvn(newBvn);
        if (!validation.valid) {
            setError(validation.message);
            toast.error(validation.message);
            return;
        }

        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/users/update-bvn', {
                bvn: validation.cleanBvn
            });
            
            if (response.data.success) {
                toast.success('BVN updated successfully!');
                setShowBvnInput(false);
                setNewBvn('');
                setError('');
                await loadStatus();
                await refreshUserData();
                
                const vaResponse = await api.post('/flutterwave/create-account', {
                    email: user.email,
                    fullName: user.displayName || user.fullName
                });
                
                if (vaResponse.data.success) {
                    toast.success('Virtual account created successfully!');
                    await loadStatus();
                } else {
                    toast.error('Virtual account creation failed: ' + vaResponse.data.error);
                }
            } else {
                setError(response.data.error || 'Failed to update BVN');
                toast.error(response.data.error || 'Failed to update BVN');
            }
        } catch (error) {
            console.error('Error updating BVN:', error);
            const errorMsg = error.response?.data?.error || 'Failed to update BVN';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Retry VA
    const handleRetryVA = async () => {
        setLoading(true);
        setError('');
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/flutterwave/create-account', {
                email: user.email,
                fullName: user.displayName || user.fullName
            });
            
            if (response.data.success) {
                toast.success('Virtual account created successfully!');
                await loadStatus();
                await refreshUserData();
            } else {
                toast.error('Virtual account creation failed: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error retrying VA:', error);
            toast.error('Failed to create virtual account');
        } finally {
            setLoading(false);
        }
    };

    const handleBvnChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNewBvn(value);
        setError('');
    };

    // ✅ HIDE THE CARD IF EVERYTHING IS GOOD
    if (status.hasBvn && status.hasVirtualAccount) {
        return null;
    }

    return (
        <div className="card bg-yellow-50 border border-yellow-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">🔐 BVN Management</h4>
                    
                    {/* Show Status */}
                    {status.hasBvn && !status.hasVirtualAccount ? (
                        <div>
                            <p className="text-sm text-yellow-700 mt-1">
                                ⚠️ BVN saved but virtual account creation failed
                            </p>
                            <button
                                onClick={handleRetryVA}
                                disabled={loading}
                                className="mt-2 text-xs text-spark-500 hover:text-spark-600 font-medium"
                            >
                                🔄 Retry Virtual Account Creation
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 mt-1">
                            Please add your BVN to create your savings account.
                        </p>
                    )}
                </div>
                
                {/* Actions */}
                {status.hasBvn && (
                    <button
                        onClick={handleDeleteBvn}
                        disabled={loading}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                        🗑️ Delete BVN
                    </button>
                )}
            </div>

            {/* Add/Update BVN Section */}
            {showBvnInput ? (
                <div className="mt-3">
                    {error && (
                        <p className="text-xs text-red-500 mb-2">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newBvn}
                            onChange={handleBvnChange}
                            placeholder="Enter 11-digit BVN"
                            maxLength={11}
                            className={`input flex-1 ${error ? 'border-red-500' : ''}`}
                        />
                        <button
                            onClick={handleUpdateBvn}
                            disabled={loading || newBvn.length !== 11}
                            className="btn btn-primary btn-sm"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowBvnInput(false);
                                setNewBvn('');
                                setError('');
                            }}
                            className="btn btn-secondary btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                    {newBvn && newBvn.length > 0 && newBvn.length !== 11 && (
                        <p className="text-xs text-red-500 mt-1">
                            ⚠️ {newBvn.length}/11 digits entered
                        </p>
                    )}
                    {newBvn && newBvn.length === 11 && (
                        <p className="text-xs text-green-500 mt-1">
                            ✅ 11 digits entered
                        </p>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setShowBvnInput(true)}
                    className="mt-3 btn btn-primary btn-sm"
                    disabled={loading}
                >
                    {status.hasBvn ? '✏️ Update BVN' : '➕ Add BVN'}
                </button>
            )}
        </div>
    );
}