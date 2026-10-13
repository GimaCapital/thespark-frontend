// src/pages/Transactions.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { Link } from 'react-router-dom';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';

// ============================================================
// LOCAL DATE HELPERS — handle every Firebase timestamp shape
// ============================================================
const parseAnyDate = (timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp.toDate === 'function') {
        try { return timestamp.toDate(); } catch { /* fall through */ }
    }
    if (typeof timestamp.seconds === 'number') return new Date(timestamp.seconds * 1000);
    if (typeof timestamp._seconds === 'number') return new Date(timestamp._seconds * 1000);
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) return d;
    }
    return null;
};

const formatTime = (timestamp) => {
    const d = parseAnyDate(timestamp);
    if (!d || isNaN(d.getTime())) return 'Unknown time';
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatFullDate = (dateObjOrTimestamp) => {
    const d = dateObjOrTimestamp instanceof Date
        ? dateObjOrTimestamp
        : parseAnyDate(dateObjOrTimestamp);
    if (!d || isNaN(d.getTime())) return 'Unknown Date';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const PAGE_SIZE = 20;

export default function Transactions() {
    const { user } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalInterest: 0,
        totalPremiumFees: 0,
    });
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);          // initial load
    const [loadingMore, setLoadingMore] = useState(false); // pagination
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    const sentinelRef = useRef(null);

    // ============================================================
    // FETCH (initial or more)
    // ============================================================
    const fetchPage = useCallback(async (cursorToUse, filterToUse, isInitial) => {
        if (!user) return;
        if (isInitial) setLoading(true); else setLoadingMore(true);

        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);

            const params = new URLSearchParams();
            params.set('limit', String(PAGE_SIZE));
            params.set('filter', filterToUse);
            if (cursorToUse) params.set('cursor', cursorToUse);

            const { data } = await api.get(`/users/transactions?${params.toString()}`);

            const newItems = data.transactions || [];

            setTransactions((prev) => {
                if (isInitial) return newItems;
                // Dedupe by id — protects against rare same-timestamp collisions
                const existingIds = new Set(prev.map((tx) => tx.id));
                const uniqueNew = newItems.filter((tx) => !existingIds.has(tx.id));
                return [...prev, ...uniqueNew];
            });

            setNextCursor(data.nextCursor || null);
            setHasMore(!!data.nextCursor);

            if (data.stats) setStats(data.stats);

            setError(null);
        } catch (err) {
            console.error('Failed to load transactions:', err);
            setError(err.response?.data?.error || 'Failed to load transactions');
            if (isInitial) toast.error('Failed to load transactions');
        } finally {
            if (isInitial) setLoading(false); else setLoadingMore(false);
        }
    }, [user]);

    // Initial load + reset when filter changes
    useEffect(() => {
        fetchPage(null, filter, true);
        // scroll to top when switching filters
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchPage, filter]);

    // ============================================================
    // INFINITE SCROLL
    // ============================================================
    useEffect(() => {
        if (!hasMore || loading || loadingMore) return;
        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    fetchPage(nextCursor, filter, false);
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, nextCursor, filter, fetchPage]);

    // ============================================================
    // DISPLAY HELPERS
    // ============================================================
    const isCredit = (type) => type === 'deposit' || type === 'interest';
    const getAmountColor = (type) => (isCredit(type) ? '#10B981' : '#EF4444');
    const getAmountPrefix = (type) => (isCredit(type) ? '+' : '-');

    const getTransactionTitle = (tx) => {
        switch (tx.type) {
            case 'deposit': return 'Savings Deposit';
            case 'withdrawal': return 'Withdrawal';
            case 'interest': return 'Interest Earned';
            case 'withdrawal_refund': return 'Withdrawal Refund';
            case 'referral': return 'Referral Bonus';
            case 'premium_fee':
            case 'premium_plan_fee':
            case 'plan_change':
                return tx.description || 'Plan Change';
            default:
                return tx.description || 'Transaction';
        }
    };

    const getTransactionIcon = (tx) => {
        switch (tx.type) {
            case 'deposit': return '📥';
            case 'withdrawal': return '📤';
            case 'interest': return '💰';
            case 'withdrawal_refund': return '🔄';
            case 'referral': return '🎁';
            case 'premium_fee':
            case 'premium_plan_fee':
            case 'plan_change': {
                const desc = (tx.description || '').toLowerCase();
                const toMatch = desc.match(/to\s+(\w+)\s+plan/);
                if (toMatch) {
                    const target = toMatch[1];
                    if (target === 'investor') return '💎';
                    if (target === 'premium') return '⭐';
                    if (target === 'basic') return '🌱';
                }
                return '⭐';
            }
            default: return '💳';
        }
    };

    // Group by date — data is already sorted desc by the server
    const groupedTransactions = transactions.reduce((groups, tx) => {
        const d = parseAnyDate(tx.createdAt);
        const dateKey = d && !isNaN(d.getTime())
            ? d.toLocaleDateString('en-US')
            : 'unknown-date';
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(tx);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
        if (a === 'unknown-date') return 1;
        if (b === 'unknown-date') return -1;
        return new Date(b) - new Date(a);
    });

    // ============================================================
    // RENDER
    // ============================================================
    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '4rem' }}>
            <HeaderMissionCard />

            {/* Header */}
            <div style={{
                backgroundColor: 'white',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid #F0F0F0',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <Link
                        to="/dashboard"
                        style={{
                            fontSize: '1.25rem',
                            textDecoration: 'none',
                            color: '#1F2937',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        ←
                    </Link>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Transaction History</h1>
                </div>
            </div>

            {/* Stats Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    margin: '0.75rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: 0, letterSpacing: '0.02em' }}>Deposits</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10B981', margin: '0.15rem 0 0 0' }}>
                        ₦{stats.totalDeposits?.toLocaleString() || 0}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: 0, letterSpacing: '0.02em' }}>Withdrawals</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#EF4444', margin: '0.15rem 0 0 0' }}>
                        ₦{stats.totalWithdrawals?.toLocaleString() || 0}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: 0, letterSpacing: '0.02em' }}>Interest</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F59E0B', margin: '0.15rem 0 0 0' }}>
                        ₦{stats.totalInterest?.toLocaleString() || 0}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: 0, letterSpacing: '0.02em' }}>Fees</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F97316', margin: '0.15rem 0 0 0' }}>
                        ₦{stats.totalPremiumFees?.toLocaleString() || 0}
                    </p>
                </div>
            </div>

            {/* Filter Pills */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0 0.75rem',
                    marginBottom: '0.5rem',
                }}
            >
                {['all', 'credit', 'debit'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.375rem 0.875rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: filter === f ? 'white' : '#6B7280',
                            backgroundColor: filter === f ? '#F97316' : 'white',
                            border: '1px solid',
                            borderColor: filter === f ? '#F97316' : '#E5E7EB',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.15s',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Transactions List */}
            <div style={{ padding: '0.5rem 0.75rem' }}>
                {sortedDates.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '3rem 1rem',
                            backgroundColor: 'white',
                            borderRadius: '0.75rem',
                        }}
                    >
                        <span style={{ fontSize: '3rem' }}>📭</span>
                        <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>No transactions found</p>
                        <Link
                            to="/dashboard"
                            style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#F97316',
                                color: 'white',
                                borderRadius: '0.5rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                            }}
                        >
                            Start Saving
                        </Link>
                    </div>
                ) : (
                    <>
                        {sortedDates.map((date) => (
                            <div key={date} style={{ marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        color: '#6B7280',
                                        marginBottom: '0.375rem',
                                        paddingLeft: '0.5rem',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {date === 'unknown-date' ? 'Unknown Date' : formatFullDate(new Date(date))}
                                </div>

                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    {groupedTransactions[date].map((tx, idx) => (
                                        <div
                                            key={tx.id || idx}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'auto 1fr auto',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.625rem 0.875rem',
                                                borderBottom:
                                                    idx !== groupedTransactions[date].length - 1
                                                        ? '1px solid #F3F4F6'
                                                        : 'none',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '2.25rem',
                                                    height: '2.25rem',
                                                    backgroundColor: '#FFF7ED',
                                                    borderRadius: '9999px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.1rem',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {getTransactionIcon(tx)}
                                            </div>

                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    style={{
                                                        fontWeight: '500',
                                                        color: '#1F2937',
                                                        margin: 0,
                                                        fontSize: '0.8rem',
                                                        lineHeight: '1.25',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {getTransactionTitle(tx)}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '0.65rem',
                                                        color: '#9CA3AF',
                                                        margin: '0.15rem 0 0 0',
                                                        lineHeight: 1.1,
                                                    }}
                                                >
                                                    {formatTime(tx.createdAt)}
                                                </p>
                                            </div>

                                            <p
                                                style={{
                                                    fontWeight: '600',
                                                    color: getAmountColor(tx.type),
                                                    margin: 0,
                                                    fontSize: '0.8rem',
                                                    whiteSpace: 'nowrap',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {getAmountPrefix(tx.type)}₦{tx.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Sentinel — observer watches this node */}
                        <div ref={sentinelRef} style={{ height: '1px' }} />

                        {/* Loading more indicator */}
                        {loadingMore && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    color: '#6B7280',
                                    fontSize: '0.8rem',
                                }}
                            >
                                Loading more…
                            </div>
                        )}

                        {/* End of history */}
                        {!hasMore && !loadingMore && transactions.length > 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    color: '#9CA3AF',
                                    fontSize: '0.7rem',
                                }}
                            >
                                End of history
                            </div>
                        )}

                        {/* Retry on error */}
                        {error && !hasMore && (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <button
                                    onClick={() => fetchPage(nextCursor, filter, false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#F97316',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}