import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralCard({ referralCode }) {
    const [copied, setCopied] = useState(false);
    
    // Get the app URL from environment variable
    const appUrl = import.meta.env.VITE_APP_URL || 'https://thespark.money';
    const referralLink = `${appUrl}/register?ref=${referralCode}`;
    
    // ✅ Your exact message
    const shareMessage = `🔥 Join me on TheSpark — the wealth-building platform that teaches Nigerians how to save, grow, and achieve financial freedom!

💰 Start with as little as ₦100/day
📈 Track your progress every 21-day cycle
🎓 Graduate in 6 months with real wealth skills
🤝 Earn ₦500 when your friends join

Use my referral link to sign up:
${referralLink}

TheSpark — One spark. One fire. One wealthy Nigeria. 🇳🇬`;
    
    const copyReferralLink = () => {
        navigator.clipboard.writeText(shareMessage);
        setCopied(true);
        toast.success('Referral message copied!');
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareReferral = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join TheSpark - Wealth Building Platform',
                text: shareMessage,
                url: referralLink
            });
        } else {
            copyReferralLink();
        }
    };
    
    // ✅ Reset Notification Button
    const resetNotifications = () => {
        localStorage.removeItem('notificationsReminded');
        window.location.reload();
        toast.success('Notifications reset!');
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-spark-50 rounded-full">
                    <span className="text-xs font-semibold text-spark-600 uppercase tracking-wider">Referral Program</span>
                </div>
                {/* <h3 className="text-lg font-bold text-gray-900 mt-2">Your Referral Link</h3> */}
            </div>
            
            {/* Reward Info */}
            <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-lg">💰</span>
                    <span className="text-sm font-semibold text-gray-800">₦500</span>
                    <span className="text-xs text-gray-500">per referral</span>
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm font-semibold text-gray-800">Unlimited</span>
                    <span className="text-xs text-gray-500">earnings</span>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={copyReferralLink} 
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-spark-300 text-gray-700 hover:text-spark-600 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-600">Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copy Link</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={shareReferral} 
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 hover:from-spark-600 hover:to-spark-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share Link</span>
                </button>
            </div>
        </div>
    );
}