import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import { Link } from 'react-router-dom';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import { formatDate, getFullDate, getDateKey, parseDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

export default function Transactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInterest: 0,
        totalPremiumFees: 0
    });

    useEffect(() => {
        if (user) {
            loadTransactions();
        }
    }, [user]);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/transactions?limit=50');
            const transactionsData = response.data;
            setTransactions(transactionsData);
            
            // Calculate stats
            let deposits = 0;
            let withdrawals = 0;
            let interest = 0;
            let premiumFees = 0;
            
            transactionsData.forEach(tx => {
                if (tx.type === 'deposit') deposits += tx.amount;
                else if (tx.type === 'withdrawal') withdrawals += tx.amount;
                else if (tx.type === 'interest') interest += tx.amount;
                else if (tx.type === 'premium_fee') premiumFees += tx.amount;
            });
            
            setStats({
                totalDeposits: deposits,
                totalWithdrawals: withdrawals,
                totalInterest: interest,
                totalPremiumFees: premiumFees
            });
        } catch (error) {
            console.error('Failed to load transactions:', error);
            toast.error('Failed to load transactions');
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

    const getFilteredTransactions = () => {
        if (filter === 'all') return transactions;
        if (filter === 'credit') return transactions.filter(tx => tx.type === 'deposit' || tx.type === 'interest');
        if (filter === 'debit') return transactions.filter(tx => tx.type === 'withdrawal' || tx.type === 'premium_fee');
        return transactions;
    };

    const getAmountColor = (type) => {
        if (type === 'deposit' || type === 'interest') return '#10B981';
        return '#EF4444';
    };

    const getAmountPrefix = (type) => {
        if (type === 'deposit' || type === 'interest') return '+';
        return '-';
    };

    const getTransactionTitle = (type) => {
        switch (type) {
            case 'deposit': return 'Savings Deposit';
            case 'withdrawal': return 'Withdrawal';
            case 'interest': return 'Interest Earned';
            case 'premium_fee': return 'Premium Plan Fee';
            default: return 'Transaction';
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return '📥';
            case 'withdrawal': return '📤';
            case 'interest': return '💰';
            case 'premium_fee': return '⭐';
            default: return '💳';
        }
    };

    const filteredTransactions = getFilteredTransactions();

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
        let dateKey = '';
        if (transaction.createdAt) {
            if (transaction.createdAt.toDate) {
                dateKey = transaction.createdAt.toDate().toLocaleDateString();
            } else if (transaction.createdAt.seconds) {
                dateKey = new Date(transaction.createdAt.seconds * 1000).toLocaleDateString();
            } else {
                dateKey = new Date(transaction.createdAt).toLocaleDateString();
            }
        }
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(transaction);
        return groups;
    }, {});

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className='container' style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '4rem' }}>
            <HeaderMissionCard />
            {/* Header */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #F0F0F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/dashboard" style={{ fontSize: '1.5rem', textDecoration: 'none', color: '#1F2937' }}>
                        ←
                    </Link>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Transaction History</h1>
                </div>
            </div>

            {/* Stats Cards - Opay Style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', padding: '1rem', backgroundColor: 'white', margin: '0.75rem', borderRadius: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#6B7280', margin: 0 }}>Deposits</p>
                    <p style={{ fontSize: '1rem', fontWeight: '700', color: '#10B981', margin: '0.25rem 0 0 0' }}>₦{stats.totalDeposits?.toLocaleString() || 0}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#6B7280', margin: 0 }}>Withdrawals</p>
                    <p style={{ fontSize: '1rem', fontWeight: '700', color: '#EF4444', margin: '0.25rem 0 0 0' }}>₦{stats.totalWithdrawals?.toLocaleString() || 0}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#6B7280', margin: 0 }}>Interest</p>
                    <p style={{ fontSize: '1rem', fontWeight: '700', color: '#F59E0B', margin: '0.25rem 0 0 0' }}>₦{stats.totalInterest?.toLocaleString() || 0}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: '#6B7280', margin: 0 }}>Fees</p>
                    <p style={{ fontSize: '1rem', fontWeight: '700', color: '#F97316', margin: '0.25rem 0 0 0' }}>₦{stats.totalPremiumFees?.toLocaleString() || 0}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ backgroundColor: 'white', padding: '0.5rem 1rem', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: '1.5rem' }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        fontWeight: filter === 'all' ? '600' : '400',
                        color: filter === 'all' ? '#F97316' : '#6B7280',
                        borderBottom: filter === 'all' ? '2px solid #F97316' : 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('credit')}
                    style={{
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        fontWeight: filter === 'credit' ? '600' : '400',
                        color: filter === 'credit' ? '#F97316' : '#6B7280',
                        borderBottom: filter === 'credit' ? '2px solid #F97316' : 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Credit
                </button>
                <button
                    onClick={() => setFilter('debit')}
                    style={{
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        fontWeight: filter === 'debit' ? '600' : '400',
                        color: filter === 'debit' ? '#F97316' : '#6B7280',
                        borderBottom: filter === 'debit' ? '2px solid #F97316' : 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Debit
                </button>
            </div>

            {/* Transactions List */}
            <div style={{ padding: '1rem' }}>
                {Object.keys(groupedTransactions).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
                        <span style={{ fontSize: '3rem' }}>📭</span>
                        <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>No transactions found</p>
                        <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#F97316', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem' }}>
                            Start Saving
                        </Link>
                    </div>
                ) : (
                    Object.keys(groupedTransactions)
                        .sort((a, b) => new Date(b) - new Date(a))
                        .map(date => (
                            <div key={date} style={{ marginBottom: '1.5rem' }}>
                                {/* Date Header */}
                                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                                    {getFullDate(new Date(date))}
                                </div>
                                
                                {/* Transactions for this date */}
                                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                    {groupedTransactions[date].map((tx, idx) => (
                                        <div 
                                            key={tx.id || idx} 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.875rem 1rem',
                                                borderBottom: idx !== groupedTransactions[date].length - 1 ? '1px solid #F0F0F0' : 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#FFF7ED', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                    {getTransactionIcon(tx.type)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '500', color: '#1F2937', margin: 0 }}>{getTransactionTitle(tx.type)}</p>
                                                    <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: '0.25rem 0 0 0' }}>{formatDate(tx.createdAt)}</p>
                                                </div>
                                            </div>
                                            <p style={{ fontWeight: '600', color: getAmountColor(tx.type), margin: 0 }}>
                                                {getAmountPrefix(tx.type)}₦{tx.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}