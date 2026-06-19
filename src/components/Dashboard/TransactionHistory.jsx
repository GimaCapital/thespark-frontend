import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import { formatDate, getFullDate, parseDate } from '../../utils/dateUtils'; 

export default function TransactionHistory({ userId }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadTransactions();
    }, []);
    
    const loadTransactions = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.get('/users/transactions?limit=20');
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Clean date parsing - handles all Firebase timestamp formats
    // const parseDate = (timestamp) => {
    //     if (!timestamp) return null;
    //     if (timestamp.toDate) return timestamp.toDate();
    //     if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
    //     if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
    //     if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    //         const date = new Date(timestamp);
    //         if (!isNaN(date.getTime())) return date;
    //     }
    //     return null;
    // };

    // const formatDate = (timestamp) => {
    //     const date = parseDate(timestamp);
    //     if (!date) return 'Date unavailable';
    //     return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    // };

    // const getFullDate = (timestamp) => {
    //     const date = parseDate(timestamp);
    //     if (!date) return 'Unknown Date';
    //     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    // };
    
    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const dateKey = getFullDate(transaction.createdAt);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {});
    
    // Sort dates (newest first)
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB - dateA;
    });
    
    const getAmountClass = (type) => {
        if (type === 'deposit' || type === 'interest') return 'transaction-amount-positive';
        if (type === 'withdrawal') return 'transaction-amount-negative';
        return '';
    };
    
    const getAmountPrefix = (type) => {
        if (type === 'withdrawal') return '-₦';
        return '+₦';
    };
    
    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return '📥';
            case 'withdrawal': return '📤';
            case 'interest': return '💰';
            default: return '💳';
        }
    };
    
    const getTransactionTitle = (type) => {
        switch (type) {
            case 'deposit': return 'Savings Deposit';
            case 'withdrawal': return 'Withdrawal';
            case 'interest': return 'Interest Earned';
            default: return 'Transaction';
        }
    };
    
    if (loading) {
        return (
            <div className="card">
                <div className="flex-center py-4">
                    <div className="spinner-sm"></div>
                </div>
            </div>
        );
    }
    
    if (transactions.length === 0) {
        return (
            <div className="card">
                <p className="text-small text-center">No transactions yet. Start saving today!</p>
            </div>
        );
    }
    
    return (
        <div className="card spacer-md">
            <h3 className="heading-3 spacer-sm">Recent Activity</h3>
            
            {sortedDates.map(date => (
                <div key={date} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                        {date}
                    </div>
                    <div>
                        {groupedTransactions[date].map(tx => (
                            <div key={tx.id} className="transaction-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '2rem', height: '2rem', backgroundColor: '#FFF7ED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span>{getTransactionIcon(tx.type)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium capitalize" style={{ margin: 0 }}>{getTransactionTitle(tx.type)}</p>
                                        <p className="transaction-date" style={{ margin: '0.25rem 0 0 0' }}>
                                            {formatDate(tx.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className={`${getAmountClass(tx.type)}`} style={{ fontWeight: '600' }}>
                                    {getAmountPrefix(tx.type)}{tx.amount?.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}