import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import HeaderMissionCard from '../components/Common/HeaderMissionCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Referral() {
    const { user } = useAuth();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            loadReferralData();
        }
    }, [user]);

    const loadReferralData = async () => {
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/me');
            setReferralData(response.data);
        } catch (error) {
            console.error('Failed to load referral data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text, message) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(message);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    const handleShare = async (platform) => {
        const referralCode = referralData?.referralCode;
        const shareText = `Join me on TheSpark Savings! Use my referral code ${referralCode} to get started and earn bonuses. Sign up at ${window.location.origin}/signup?ref=${referralCode}`;
        const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
        
        switch(platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=Join me on Spark Savings&body=${encodeURIComponent(shareText)}`;
                break;
            case 'native':
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Join me on Spark Savings',
                            text: shareText,
                            url: shareUrl
                        });
                        toast.success('Thanks for sharing!');
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            toast.error('Failed to share');
                        }
                    }
                } else {
                    copyToClipboard(shareText, 'Link copied to clipboard!');
                }
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="bg-spark-50" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <HeaderMissionCard />
            {/* Header */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #F0F0F0' }}>
                <div className="container" style={{ padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/dashboard" style={{ textDecoration: 'none', fontSize: '1.5rem', color: '#1A1A1A' }}>
                            ←
                        </Link>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#1A1A1A' }}>
                            Invite Friends
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                {/* Hero Section */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #FF8A00 0%, #FF6B00 100%)', 
                    borderRadius: '1rem', 
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎁</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
                        Get ₦5,000 Per Referral
                    </h2>
                    <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>
                        Invite friends to join Spark Savings and earn bonuses when they start saving!
                    </p>
                </div>

                {/* Referral Code Card */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #F0F0F0', marginBottom: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>YOUR REFERRAL CODE</p>
                    <div style={{ 
                        backgroundColor: '#FFF4E6', 
                        padding: '1rem', 
                        borderRadius: '0.75rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <code style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF8A00', letterSpacing: '2px' }}>
                            {referralData?.referralCode || 'LOADING'}
                        </code>
                        <button
                            onClick={() => copyToClipboard(referralData?.referralCode, 'Referral code copied!')}
                            style={{
                                backgroundColor: '#FF8A00',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>
                    
                    <div style={{ backgroundColor: '#F8F9FA', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.7rem', color: '#999', marginBottom: '0.25rem' }}>REFERRAL LINK</p>
                        <p style={{ fontSize: '0.75rem', color: '#666', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
                            {`${window.location.origin}/signup?ref=${referralData?.referralCode}`}
                        </p>
                        <button
                            onClick={() => copyToClipboard(`${window.location.origin}/signup?ref=${referralData?.referralCode}`, 'Referral link copied!')}
                            style={{
                                backgroundColor: '#FF8A00',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                width: '100%'
                            }}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>

                {/* Share Options */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #F0F0F0', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                        Share with friends
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <button
                            onClick={() => handleShare('whatsapp')}
                            style={{
                                backgroundColor: '#25D366',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📱</div>
                            <span style={{ fontSize: '0.7rem' }}>WhatsApp</span>
                        </button>
                        <button
                            onClick={() => handleShare('facebook')}
                            style={{
                                backgroundColor: '#1877F2',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📘</div>
                            <span style={{ fontSize: '0.7rem' }}>Facebook</span>
                        </button>
                        <button
                            onClick={() => handleShare('twitter')}
                            style={{
                                backgroundColor: '#1DA1F2',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🐦</div>
                            <span style={{ fontSize: '0.7rem' }}>Twitter</span>
                        </button>
                        <button
                            onClick={() => handleShare('native')}
                            style={{
                                backgroundColor: '#FF8A00',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔗</div>
                            <span style={{ fontSize: '0.7rem' }}>Share</span>
                        </button>
                    </div>
                </div>

                {/* Stats Card */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #F0F0F0', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                        Your Referral Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF8A00', margin: 0 }}>
                                {referralData?.referralCount || 0}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.25rem 0 0 0' }}>Friends Joined</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FF8A00', margin: 0 }}>
                                ₦{(referralData?.referralEarnings || 0).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.25rem 0 0 0' }}>Total Earned</p>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #F0F0F0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                        How It Works
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', backgroundColor: '#FFF4E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF8A00', fontWeight: 'bold' }}>1</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Share Your Code</p>
                                <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.25rem 0 0 0' }}>Share your unique referral code with friends</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', backgroundColor: '#FFF4E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF8A00', fontWeight: 'bold' }}>2</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Friend Signs Up</p>
                                <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.25rem 0 0 0' }}>They use your code when creating their account</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '2rem', height: '2rem', backgroundColor: '#FFF4E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF8A00', fontWeight: 'bold' }}>3</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Earn Bonuses</p>
                                <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.25rem 0 0 0' }}>Get ₦5,000 when they make their first deposit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}