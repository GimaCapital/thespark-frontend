// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import toast from 'react-hot-toast';

// export default function Graduation() {
//     const { user, userData } = useAuth();
//     const [certificate, setCertificate] = useState(null);
//     const [generating, setGenerating] = useState(false);
//     const [investments, setInvestments] = useState(null);
//     const [alumniEnrolled, setAlumniEnrolled] = useState(false);
    
//     const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate;
    
//     useEffect(() => {
//         if (user && isGraduated) {
//             loadCertificate();
//             loadInvestments();
//             checkAlumniStatus();
//         }
//     }, [user, isGraduated]);
    
//     const loadCertificate = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/graduation/certificate');
//             setCertificate(response.data.certificate);
//         } catch (error) {
//             console.error('No certificate found:', error);
//         }
//     };
    
//     const loadInvestments = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/graduation/investments');
//             setInvestments(response.data);
//         } catch (error) {
//             console.error('Failed to load investments:', error);
//         }
//     };
    
//     const checkAlumniStatus = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/graduation/alumni/status');
//             setAlumniEnrolled(response.data.enrolled);
//         } catch (error) {
//             console.error('Failed to check alumni status:', error);
//         }
//     };
    
//     const generateCertificate = async () => {
//         setGenerating(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.post('/graduation/certificate/generate');
//             setCertificate(response.data.certificate);
//             toast.success('Certificate generated!');
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to generate certificate');
//         } finally {
//             setGenerating(false);
//         }
//     };
    
//     const enrollAlumni = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.post('/graduation/alumni/enroll');
//             setAlumniEnrolled(true);
//             toast.success('Welcome to the Alumni group!');
//         } catch (error) {
//             toast.error('Failed to enroll');
//         }
//     };
    
//     const printCertificate = () => {
//         const printWindow = window.open('', '_blank');
//         printWindow.document.write(`
//             <html>
//             <head>
//                 <title>TheSpark Graduation Certificate</title>
//                 <style>
//                     body { font-family: Arial, sans-serif; padding: 50px; text-align: center; }
//                     .certificate { border: 10px solid #F97316; padding: 40px; max-width: 800px; margin: 0 auto; }
//                     h1 { color: #F97316; font-size: 48px; margin-bottom: 20px; }
//                     h2 { font-size: 32px; margin: 30px 0; }
//                     h3 { font-size: 24px; margin: 20px 0; }
//                     .date { margin-top: 50px; }
//                     .signature { margin-top: 50px; font-style: italic; }
//                     .footer { margin-top: 50px; font-size: 12px; color: #666; }
//                 </style>
//             </head>
//             <body>
//                 <div class="certificate">
//                     <h1>TheSpark</h1>
//                     <h2>CERTIFICATE OF WEALTH EDUCATION</h2>
//                     <p>This certifies that</p>
//                     <h3>${certificate?.fullName}</h3>
//                     <p>has successfully completed 8 cycles (6 months) of TheSpark Wealth Building Program,<br>
//                     demonstrating mastery of the principles from The Richest Man in Babylon.</p>
//                     <p><strong>Total Saved:</strong> ₦${certificate?.totalSaved?.toLocaleString()}<br>
//                     <strong>Total Interest Earned:</strong> ₦${certificate?.totalInterestEarned?.toLocaleString()}<br>
//                     <strong>Final Balance:</strong> ₦${certificate?.finalBalance?.toLocaleString()}</p>
//                     <p class="date">Graduation Date: ${new Date(certificate?.graduationDate).toLocaleDateString()}</p>
//                     <p class="signature">TheSpark Coach</p>
//                     <p class="footer">Certificate #: ${certificate?.certificateNumber}</p>
//                     <p class="footer">"The road to wealth is now open before you. Walk it with wisdom. Be the spark."</p>
//                 </div>
//             </body>
//             </html>
//         `);
//         printWindow.print();
//     };
    
//     if (!isGraduated) {
//         return (
//             <div className="container text-center">
//                 <div className="card">
//                     <h2 className="heading-2 spacer-md">Not Yet Graduated</h2>
//                     <p className="text-body spacer-md">
//                         Complete all 8 cycles (6 months) to access graduation benefits.
//                     </p>
//                     <div className="progress-bar">
//                         <div className="progress-fill" style={{ width: `${(userData?.currentCycle - 1) / 8 * 100}%` }}></div>
//                     </div>
//                     <p className="text-small spacer-md">
//                         Cycle {userData?.currentCycle} of 8
//                     </p>
//                 </div>
//             </div>
//         );
//     }
    
//     return (
//         <div className="container">
//             <h1 className="heading-1 text-center spacer-lg">Graduation Center</h1>
            
//             <div className="card spacer-lg">
//                 <h2 className="heading-2 text-center spacer-md">Your Certificate</h2>
//                 {certificate ? (
//                     <div className="text-center">
//                         <p className="text-success spacer-md">✓ Certificate Generated</p>
//                         <p className="text-body spacer-sm">Certificate #: {certificate.certificateNumber}</p>
//                         <p className="text-body spacer-md">Graduation Date: {new Date(certificate.graduationDate).toLocaleDateString()}</p>
//                         <button onClick={printCertificate} className="btn btn-primary">
//                             View / Print Certificate
//                         </button>
//                     </div>
//                 ) : (
//                     <button
//                         onClick={generateCertificate}
//                         disabled={generating}
//                         className={`btn btn-primary btn-full ${generating ? 'btn-disabled' : ''}`}
//                     >
//                         {generating ? 'Generating...' : 'Generate Your Certificate'}
//                     </button>
//                 )}
//             </div>
            
//             <div className="card spacer-lg">
//                 <h2 className="heading-2 text-center spacer-md">Alumni Group</h2>
//                 {alumniEnrolled ? (
//                     <p className="text-success text-center">✓ You are a member of TheSpark Alumni</p>
//                 ) : (
//                     <>
//                         <p className="text-body text-center spacer-md">
//                             Join the alumni group for networking, exclusive opportunities, and ongoing support.
//                         </p>
//                         <button onClick={enrollAlumni} className="btn btn-primary btn-full">
//                             Join Alumni Group
//                         </button>
//                     </>
//                 )}
//             </div>
            
//             {investments && (
//                 <div className="spacer-lg">
//                     <h2 className="heading-2 text-center spacer-md">Investment Opportunities</h2>
                    
//                     <div className="card spacer-md">
//                         <h3 className="heading-3 spacer-sm">{investments.lending.title}</h3>
//                         <p className="text-body spacer-sm">{investments.lending.description}</p>
//                         <p className="text-success spacer-sm">Return: {investments.lending.returnRate}</p>
//                         <p className="text-small">Minimum: ₦{investments.lending.minimumInvestment?.toLocaleString()}</p>
//                         <p className="text-warning text-small spacer-sm">⚠️ {investments.lending.teaching}</p>
//                         <button className="btn btn-primary btn-sm">Express Interest</button>
//                     </div>
                    
//                     <div className="card spacer-md">
//                         <h3 className="heading-3 spacer-sm">{investments.assets.title}</h3>
//                         <p className="text-body spacer-sm">{investments.assets.description}</p>
//                         {investments.assets.options.map((asset, idx) => (
//                             <div key={idx} className="bg-gray-50 rounded-lg p-3 spacer-sm">
//                                 <p className="font-semibold">{asset.name}</p>
//                                 <p className="text-small">Cost: ₦{asset.cost.toLocaleString()} | Each pays: ₦{asset.eachPays.toLocaleString()}</p>
//                                 <p className="text-small text-success">Monthly income: {asset.monthlyIncome}</p>
//                             </div>
//                         ))}
//                         <p className="text-warning text-small spacer-sm">⚠️ {investments.assets.teaching}</p>
//                         <button className="btn btn-secondary btn-sm">Join a Group</button>
//                     </div>
                    
//                     <div className="card">
//                         <h3 className="heading-3 spacer-sm">{investments.training.title}</h3>
//                         <p className="text-body spacer-sm">{investments.training.description}</p>
//                         {investments.training.options.map((training, idx) => (
//                             <div key={idx} className="flex-between transaction-item">
//                                 <div>
//                                     <p className="font-semibold">{training.name}</p>
//                                     <p className="text-small">{training.description}</p>
//                                 </div>
//                                 <button className="btn btn-primary btn-sm">₦{training.cost.toLocaleString()}</button>
//                             </div>
//                         ))}
//                         <p className="text-warning text-small spacer-sm">⚠️ {investments.training.teaching}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Graduation() {
    const { user, userData, refreshUserData } = useAuth();
    const [certificate, setCertificate] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [investments, setInvestments] = useState(null);
    const [alumniEnrolled, setAlumniEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Safe date formatter - handles Firestore Timestamp, Date object, and strings
    const formatDate = (date) => {
        if (!date) return 'Not set';
        
        // Handle Firestore Timestamp (has toDate method)
        if (typeof date.toDate === 'function') {
            return date.toDate().toLocaleDateString();
        }
        
        // Handle JavaScript Date object
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        
        // Handle timestamp with seconds (Firestore internal)
        if (date.seconds) {
            return new Date(date.seconds * 1000).toLocaleDateString();
        }
        
        // Handle string or number
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString();
        }
        
        return 'Not set';
    };
    
    // Check if user has graduated (cycle > 8 OR graduationDate exists)
    const isGraduated = userData?.currentCycle > 8 || userData?.graduationDate !== null && userData?.graduationDate !== undefined;
    
    useEffect(() => {
        if (user && isGraduated) {
            loadData();
        } else if (user && !isGraduated) {
            setLoading(false);
        }
    }, [user, isGraduated]);
    
    const loadData = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            // Load certificate
            try {
                const certRes = await api.get('/graduation/certificate');
                setCertificate(certRes.data.certificate);
            } catch (err) {
                console.log('No certificate yet');
            }
            
            // Load investments
            const invRes = await api.get('/graduation/investments');
            setInvestments(invRes.data);
            
            // Check alumni status
            const alumniRes = await api.get('/graduation/alumni/status');
            setAlumniEnrolled(alumniRes.data.enrolled);
            
        } catch (error) {
            console.error('Failed to load graduation data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const generateCertificate = async () => {
        setGenerating(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.post('/graduation/certificate/generate');
            setCertificate(response.data.certificate);
            toast.success('Certificate generated!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate certificate');
        } finally {
            setGenerating(false);
        }
    };
    
    const enrollAlumni = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post('/graduation/alumni/enroll');
            setAlumniEnrolled(true);
            toast.success('Welcome to the Alumni group!');
        } catch (error) {
            toast.error('Failed to enroll');
        }
    };
    
    const printCertificate = () => {
        if (!certificate) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>TheSpark Graduation Certificate</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 50px; text-align: center; }
                    .certificate { border: 10px solid #F97316; padding: 40px; max-width: 800px; margin: 0 auto; }
                    h1 { color: #F97316; font-size: 48px; margin-bottom: 20px; }
                    h2 { font-size: 32px; margin: 30px 0; }
                    h3 { font-size: 24px; margin: 20px 0; }
                    .date { margin-top: 50px; }
                    .signature { margin-top: 50px; font-style: italic; }
                    .footer { margin-top: 50px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <h1>TheSpark</h1>
                    <h2>CERTIFICATE OF WEALTH EDUCATION</h2>
                    <p>This certifies that</p>
                    <h3>${certificate?.fullName || userData?.fullName}</h3>
                    <p>has successfully completed 8 cycles (6 months) of TheSpark Wealth Building Program,<br>
                    demonstrating mastery of the principles from The Richest Man in Babylon.</p>
                    <p><strong>Total Saved:</strong> ₦${(certificate?.totalSaved || userData?.totalPrincipalSaved)?.toLocaleString()}<br>
                    <strong>Total Interest Earned:</strong> ₦${(certificate?.totalInterestEarned || userData?.totalInterestEarned)?.toLocaleString()}<br>
                    <strong>Final Balance:</strong> ₦${(certificate?.finalBalance || userData?.currentBalance)?.toLocaleString()}</p>
                    <p class="date">Graduation Date: ${formatDate(certificate?.graduationDate)}</p>
                    <p class="signature">TheSpark Coach</p>
                    <p class="footer">Certificate #: ${certificate?.certificateNumber || `SPARK-${user?.uid?.slice(0, 8).toUpperCase()}`}</p>
                    <p class="footer">"The road to wealth is now open before you. Walk it with wisdom. Be the spark."</p>
                </div>
            </body>
            </html>
        `);
        printWindow.print();
    };
    
    // Show loading state
    if (loading) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }
    
    // Show not graduated message
    if (!isGraduated) {
        const cyclesCompleted = userData?.currentCycle - 1 || 0;
        const progressPercent = (cyclesCompleted / 8) * 100;
        
        return (
            <div className="page-container text-center">
                <div className="card">
                    <h2 className="heading-2 spacer-md">Not Yet Graduated</h2>
                    <p className="text-body spacer-md">
                        Complete all 8 cycles (6 months) to access graduation benefits.
                    </p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-small spacer-md">
                        Cycle {userData?.currentCycle || 1} of 8 • {cyclesCompleted} cycles completed
                    </p>
                    <p className="text-small text-warning">
                        You need {8 - cyclesCompleted} more cycle(s) to graduate
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="page-container">
            <h1 className="heading-1 text-center spacer-lg">🎓 Graduation Center</h1>
            
            {/* Certificate Section */}
            <div className="card spacer-lg">
                <h2 className="heading-2 text-center spacer-md">Your Certificate</h2>
                {certificate ? (
                    <div className="text-center">
                        <p className="text-success spacer-md">✓ Certificate Generated</p>
                        <p className="text-body spacer-sm">Certificate #: {certificate.certificateNumber}</p>
                        <p className="text-body spacer-md">Graduation Date: {formatDate(certificate.graduationDate)}</p>
                        <button onClick={printCertificate} className="btn btn-primary">
                            View / Print Certificate
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-body spacer-md">
                            Congratulations on completing all 8 cycles! Generate your certificate to celebrate.
                        </p>
                        <button
                            onClick={generateCertificate}
                            disabled={generating}
                            className={`btn btn-primary btn-full ${generating ? 'btn-disabled' : ''}`}
                        >
                            {generating ? 'Generating...' : 'Generate Your Certificate'}
                        </button>
                    </div>
                )}
            </div>
            
            {/* Alumni Section */}
            <div className="card spacer-lg">
                <h2 className="heading-2 text-center spacer-md">Alumni Group</h2>
                {alumniEnrolled ? (
                    <p className="text-success text-center">✓ You are a member of TheSpark Alumni</p>
                ) : (
                    <>
                        <p className="text-body text-center spacer-md">
                            Join the alumni group for networking, exclusive opportunities, and ongoing support.
                        </p>
                        <button onClick={enrollAlumni} className="btn btn-primary btn-full">
                            Join Alumni Group
                        </button>
                    </>
                )}
            </div>
            
            {/* Investment Opportunities */}
            {investments && (
                <div className="spacer-lg">
                    <h2 className="heading-2 text-center spacer-md">Investment Opportunities</h2>
                    
                    {/* Lending */}
                    <div className="card spacer-md">
                        <h3 className="heading-3 spacer-sm">{investments.lending.title}</h3>
                        <p className="text-body spacer-sm">{investments.lending.description}</p>
                        <p className="text-success spacer-sm">Return: {investments.lending.returnRate}</p>
                        <p className="text-small">Minimum: ₦{investments.lending.minimumInvestment?.toLocaleString()}</p>
                        <p className="text-warning text-small spacer-sm">⚠️ {investments.lending.teaching}</p>
                        <button className="btn btn-primary btn-sm">Express Interest</button>
                    </div>
                    
                    {/* Asset Co-Ownership */}
                    <div className="card spacer-md">
                        <h3 className="heading-3 spacer-sm">{investments.assets.title}</h3>
                        <p className="text-body spacer-sm">{investments.assets.description}</p>
                        {investments.assets.options?.map((asset, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 spacer-sm">
                                <p className="font-semibold">{asset.name}</p>
                                <p className="text-small">Cost: ₦{asset.cost.toLocaleString()} | Each pays: ₦{asset.eachPays.toLocaleString()}</p>
                                <p className="text-small text-success">Monthly income: {asset.monthlyIncome}</p>
                            </div>
                        ))}
                        <p className="text-warning text-small spacer-sm">⚠️ {investments.assets.teaching}</p>
                        <button className="btn btn-secondary btn-sm">Join a Group</button>
                    </div>
                    
                    {/* Training Tickets */}
                    <div className="card">
                        <h3 className="heading-3 spacer-sm">{investments.training.title}</h3>
                        <p className="text-body spacer-sm">{investments.training.description}</p>
                        {investments.training.options?.map((training, idx) => (
                            <div key={idx} className="flex-between transaction-item">
                                <div>
                                    <p className="font-semibold">{training.name}</p>
                                    <p className="text-small">{training.description}</p>
                                </div>
                                <button className="btn btn-primary btn-sm">₦{training.cost.toLocaleString()}</button>
                            </div>
                        ))}
                        <p className="text-warning text-small spacer-sm">⚠️ {investments.training.teaching}</p>
                    </div>
                </div>
            )}
        </div>
    );
}