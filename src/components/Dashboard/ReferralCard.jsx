// import React, { useState } from 'react';
// import toast from 'react-hot-toast';

// export default function ReferralCard({ referralCode }) {
//     const [copied, setCopied] = useState(false);
//     // const referralLink = `${appUrl}/register?ref=${referralCode}`;
//      const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    
//     // ✅ Your exact message
//     const shareMessage = `🔥 Join me on TheSpark — the wealth-building platform that teaches Nigerians how to save, grow, and achieve financial freedom!

// 💰 Start with as little as ₦100/day
// 📈 Track your progress every 21-day cycle
// 🎓 Graduate in 6 months with real wealth skills
// 🤝 Earn ₦500 when your friends join

// Use my referral link to sign up:
// ${referralLink}

// TheSpark — One spark. One fire. One wealthy Nigeria. 🇳🇬`;
    
//     const copyReferralLink = () => {
//         navigator.clipboard.writeText(shareMessage);
//         setCopied(true);
//         toast.success('Referral message copied!');
//         setTimeout(() => setCopied(false), 2000);
//     };
    
//     const shareReferral = () => {
//         if (navigator.share) {
//             navigator.share({
//                 title: 'Join TheSpark - Wealth Building Platform',
//                 text: shareMessage,
//                 url: referralLink
//             });
//         } else {
//             copyReferralLink();
//         }
//     };
    
//     // ✅ Reset Notification Button
//     // const resetNotifications = () => {
//     //     localStorage.removeItem('notificationsReminded');
//     //     window.location.reload();
//     //     toast.success('Notifications reset!');
//     // };
    
//     return (
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
//             {/* Header */}
//             <div className="text-center">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-spark-50 rounded-full">
//                     <span className="text-xs font-semibold text-spark-600 uppercase tracking-wider">Referral Program</span>
//                 </div>
//                 {/* <h3 className="text-lg font-bold text-gray-900 mt-2">Your Referral Link</h3> */}
//             </div>
            
//             {/* Reward Info */}
//             <div className="flex items-center justify-center gap-4 py-2">
//                 <div className="flex items-center gap-1.5">
//                     <span className="text-lg">💰</span>
//                     <span className="text-sm font-semibold text-gray-800">₦500</span>
//                     <span className="text-xs text-gray-500">per referral</span>
//                 </div>
//                 <div className="w-px h-6 bg-gray-200"></div>
//                 <div className="flex items-center gap-1.5">
//                     <span className="text-lg">🎯</span>
//                     <span className="text-sm font-semibold text-gray-800">Unlimited</span>
//                     <span className="text-xs text-gray-500">earnings</span>
//                 </div>
//             </div>
            
//             {/* Action Buttons */}
//             <div className="grid grid-cols-2 gap-3">
//                 <button 
//                     onClick={copyReferralLink} 
//                     className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-spark-300 text-gray-700 hover:text-spark-600 text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
//                 >
//                     {copied ? (
//                         <>
//                             <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             <span className="text-green-600">Copied!</span>
//                         </>
//                     ) : (
//                         <>
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
//                             </svg>
//                             <span>Copy Link</span>
//                         </>
//                     )}
//                 </button>
//                 <button 
//                     onClick={shareReferral} 
//                     className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-spark-500 to-spark-600 hover:from-spark-600 hover:to-spark-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
//                 >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//                     </svg>
//                     <span>Share Link</span>
//                 </button>
//             </div>
//         </div>
//     );
// }

import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export default function ReferralCard({ referralCode }) {
    const [copied, setCopied] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const qrCanvasRef = useRef(null);
    
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    
    // ✅ Your exact message
    const shareMessage = `🔥 Join me on TheSpark — the wealth-building platform that teaches Nigerians how to save, grow, and achieve financial freedom!

💰 Start with as little as ₦100/day
📈 Track your progress every 21-day cycle
🎓 Graduate in 6 months with real wealth skills
🤝 Earn ₦500 when your friends join

Use my referral link to sign up:
${referralLink}

TheSpark — One spark. One fire. One wealthy Nigeria. 🇳🇬`;
    
    // ✅ Generate QR Code
    useEffect(() => {
        if (referralLink) {
            QRCode.toDataURL(referralLink, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#F97316',
                    light: '#FFFFFF'
                }
            }, (err, url) => {
                if (err) {
                    console.error('QR Code generation failed:', err);
                    return;
                }
                setQrCodeUrl(url);
            });
        }
    }, [referralLink]);

    // ✅ Download QR Code
    const downloadQR = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.download = `TheSpark-Referral-${referralCode}.png`;
        link.href = qrCodeUrl;
        link.click();
        toast.success('QR Code downloaded!');
    };

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

    // ✅ Share QR Code
    const shareQR = async () => {
        if (!qrCodeUrl) return;
        
        try {
            // Fetch the QR code image
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const file = new File([blob], `TheSpark-Referral-${referralCode}.png`, { type: 'image/png' });
            
            if (navigator.share) {
                await navigator.share({
                    title: 'Join TheSpark with my referral!',
                    text: `Join TheSpark using my referral code: ${referralCode}`,
                    files: [file]
                });
            } else {
                downloadQR();
            }
        } catch (error) {
            console.error('Share failed:', error);
            downloadQR();
        }
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-spark-50 rounded-full">
                    <span className="text-xs font-semibold text-spark-600 uppercase tracking-wider">Referral Program</span>
                </div>
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

            {/* ✅ QR Code Section */}
            <div className="flex flex-col items-center py-2">
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-spark-600 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    {showQR ? 'Hide QR Code' : 'Show QR Code'}
                </button>

                {showQR && qrCodeUrl && (
                    <div className="mt-3 flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <img 
                            src={qrCodeUrl} 
                            alt="Referral QR Code" 
                            className="w-48 h-48"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={downloadQR}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-spark-500 hover:bg-spark-600 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </button>
                            <button
                                onClick={shareQR}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Scan to join TheSpark</p>
                    </div>
                )}
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