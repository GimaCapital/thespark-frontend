import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralCard({ referralCode }) {
    const [copied, setCopied] = useState(false);
    
    // Get the app URL from environment variable
    const appUrl = import.meta.env.VITE_APP_URL || 'https://thespark.money';
    
    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareLink = `${appUrl}/register?ref=${referralCode}`;
    
    const shareReferral = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join TheSpark',
                text: `Join me on TheSpark! Use my referral code: ${referralCode}`,
                url: shareLink
            });
        } else {
            copyReferralCode();
        }
    };
    
    return (
        <div className="referral-card spacer-md">
            <p className="text-small text-gray-500 spacer-sm">Your Referral Code</p>
            <p className="referral-code spacer-sm">{referralCode}</p>
            <p className="text-small text-gray-500 spacer-md">
                Share your code. Get ₦500 when they join!
            </p>
            <div className="flex-row gap-2">
                <button onClick={copyReferralCode} className="btn btn-secondary btn-sm flex-1">
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button onClick={shareReferral} className="btn btn-primary btn-sm flex-1">
                    Share
                </button>
            </div>
        </div>
    );
}