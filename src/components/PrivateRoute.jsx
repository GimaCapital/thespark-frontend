import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return user ? children : <Navigate to="/login" />;
}