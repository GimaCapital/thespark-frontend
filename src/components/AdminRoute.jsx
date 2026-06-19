import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
    const { user, userData, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return user && userData?.role === 'admin' ? children : <Navigate to="/dashboard" />;
}