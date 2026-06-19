// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import toast from 'react-hot-toast';

// export default function HybridLending() {
//     const { user, isAdmin } = useAuth();
//     const [settings, setSettings] = useState(null);
//     const [loans, setLoans] = useState([]);
//     const [newLoan, setNewLoan] = useState({
//         borrowerName: '',
//         borrowerPhone: '',
//         amount: '',
//         interestRate: '10',
//         durationDays: '30',
//         purpose: ''
//     });
//     const [lendPercentage, setLendPercentage] = useState(70);
//     const [loading, setLoading] = useState(false);
    
//     useEffect(() => {
//         if (isAdmin) {
//             loadData();
//         }
//     }, [isAdmin]);
    
//     const loadData = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const [settingsRes, loansRes] = await Promise.all([
//                 api.get('/admin/hybrid/settings'),
//                 api.get('/admin/loans')
//             ]);
//             setSettings(settingsRes.data);
//             setLoans(loansRes.data);
//         } catch (error) {
//             console.error('Failed to load data:', error);
//         }
//     };
    
//     const activateHybridMode = async () => {
//         setLoading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.post('/graduation/admin/hybrid/transition', { lendPercentage });
//             toast.success('Hybrid mode activated! Savings are now being lent to borrowers.');
//             loadData();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to activate');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const createLoan = async () => {
//         setLoading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.post('/graduation/admin/loans/create', newLoan);
//             toast.success('Loan recorded');
//             setNewLoan({
//                 borrowerName: '',
//                 borrowerPhone: '',
//                 amount: '',
//                 interestRate: '10',
//                 durationDays: '30',
//                 purpose: ''
//             });
//             loadData();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to create loan');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const repayLoan = async (loanId) => {
//         setLoading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/graduation/admin/loans/${loanId}/repay`);
//             toast.success('Loan repaid');
//             loadData();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to repay');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     if (!isAdmin) {
//         return (
//             <div className="container text-center">
//                 <p className="text-error">Admin access required</p>
//             </div>
//         );
//     }
    
//     return (
//         <div className="container">
//             <h1 className="heading-1 text-center spacer-lg">Hybrid Lending Management</h1>
            
//             <div className="card spacer-lg">
//                 <h2 className="heading-2 spacer-md">Hybrid Mode Status</h2>
//                 {settings?.hybridMode ? (
//                     <div>
//                         <p className="text-success">✓ Active</p>
//                         <p className="text-small spacer-sm">Lending {settings.lendingPercentage}% of savings pool</p>
//                         <p className="text-small">Available to Lend: ₦{settings.amountAvailableToLend?.toLocaleString()}</p>
//                         <p className="text-small">Total Lent Out: ₦{settings.totalLentOut?.toLocaleString()}</p>
//                         <p className="text-small text-success">Platform Earnings: ₦{settings.platformEarnings?.toLocaleString()}</p>
//                     </div>
//                 ) : (
//                     <>
//                         <p className="text-body spacer-md">
//                             When activated, {lendPercentage}% of the savings pool (currently ₦{settings?.totalSavingsPool?.toLocaleString()}) will be available for lending.
//                         </p>
//                         <input
//                             type="number"
//                             value={lendPercentage}
//                             onChange={(e) => setLendPercentage(parseInt(e.target.value))}
//                             className="input spacer-md"
//                             placeholder="Lending percentage"
//                         />
//                         <button
//                             onClick={activateHybridMode}
//                             disabled={loading}
//                             className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
//                         >
//                             {loading ? 'Activating...' : 'Activate Hybrid Mode'}
//                         </button>
//                     </>
//                 )}
//             </div>
            
//             <div className="card spacer-lg">
//                 <h2 className="heading-2 spacer-md">Create New Loan</h2>
//                 <input
//                     type="text"
//                     value={newLoan.borrowerName}
//                     onChange={(e) => setNewLoan({...newLoan, borrowerName: e.target.value})}
//                     placeholder="Borrower Name"
//                     className="input spacer-sm"
//                 />
//                 <input
//                     type="tel"
//                     value={newLoan.borrowerPhone}
//                     onChange={(e) => setNewLoan({...newLoan, borrowerPhone: e.target.value})}
//                     placeholder="Borrower Phone"
//                     className="input spacer-sm"
//                 />
//                 <input
//                     type="number"
//                     value={newLoan.amount}
//                     onChange={(e) => setNewLoan({...newLoan, amount: parseInt(e.target.value)})}
//                     placeholder="Loan Amount (₦)"
//                     className="input spacer-sm"
//                 />
//                 <input
//                     type="number"
//                     value={newLoan.interestRate}
//                     onChange={(e) => setNewLoan({...newLoan, interestRate: e.target.value})}
//                     placeholder="Interest Rate (%)"
//                     className="input spacer-sm"
//                 />
//                 <input
//                     type="number"
//                     value={newLoan.durationDays}
//                     onChange={(e) => setNewLoan({...newLoan, durationDays: parseInt(e.target.value)})}
//                     placeholder="Duration (days)"
//                     className="input spacer-sm"
//                 />
//                 <input
//                     type="text"
//                     value={newLoan.purpose}
//                     onChange={(e) => setNewLoan({...newLoan, purpose: e.target.value})}
//                     placeholder="Loan Purpose"
//                     className="input spacer-md"
//                 />
//                 <button
//                     onClick={createLoan}
//                     disabled={loading || !newLoan.borrowerName || !newLoan.amount}
//                     className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
//                 >
//                     {loading ? 'Creating...' : 'Create Loan'}
//                 </button>
//             </div>
            
//             <div className="card">
//                 <h2 className="heading-2 spacer-md">Active Loans</h2>
//                 {loans.filter(l => l.status === 'active').length === 0 ? (
//                     <p className="text-body text-center">No active loans</p>
//                 ) : (
//                     loans.filter(l => l.status === 'active').map(loan => (
//                         <div key={loan.id} className="transaction-item">
//                             <div>
//                                 <p className="font-semibold">{loan.borrowerName}</p>
//                                 <p className="text-small">₦{loan.amount.toLocaleString()} at {loan.interestRate}%</p>
//                                 <p className="text-small">Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
//                             </div>
//                             <button
//                                 onClick={() => repayLoan(loan.id)}
//                                 className="btn btn-success btn-sm"
//                             >
//                                 Repay
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';

export default function HybridLending() {
    const { user, isAdmin } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loans, setLoans] = useState([]);
    const [newLoan, setNewLoan] = useState({
        borrowerName: '',
        borrowerPhone: '',
        amount: '',
        interestRate: '10',
        durationDays: '30',
        purpose: ''
    });
    const [lendPercentage, setLendPercentage] = useState(70);
    const [loading, setLoading] = useState(false);
    const [showRepaid, setShowRepaid] = useState(false);

    useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

    const loadData = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const [settingsRes, loansRes] = await Promise.all([api.get('/admin/hybrid/settings'), api.get('/admin/loans')]);
            setSettings(settingsRes.data);
            setLoans(loansRes.data);
        } catch (error) { console.error('Failed to load data:', error); toast.error('Failed to load data'); }
    };

    const formatDate = (date) => {
        if (!date) return 'Not set';
        if (typeof date === 'string') { const parsed = new Date(date); if (!isNaN(parsed.getTime())) return parsed.toLocaleDateString(); }
        if (date && typeof date.toDate === 'function') return date.toDate().toLocaleDateString();
        if (date && typeof date._seconds === 'number') return new Date(date._seconds * 1000).toLocaleDateString();
        if (date && typeof date.seconds === 'number') return new Date(date.seconds * 1000).toLocaleDateString();
        return 'Invalid Date';
    };

    const activateHybridMode = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post('/graduation/admin/hybrid/transition', { lendPercentage });
            toast.success('Hybrid mode activated!');
            loadData();
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to activate'); } finally { setLoading(false); }
    };

    const createLoan = async () => {
        if (!newLoan.borrowerName || !newLoan.amount) { toast.error('Please fill in borrower name and amount'); return; }
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.post('/graduation/admin/loans/create', { ...newLoan, amount: parseFloat(newLoan.amount), interestRate: parseFloat(newLoan.interestRate), durationDays: parseInt(newLoan.durationDays) });
            toast.success(response.data.message || 'Loan recorded');
            setNewLoan({ borrowerName: '', borrowerPhone: '', amount: '', interestRate: '10', durationDays: '30', purpose: '' });
            loadData();
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to create loan'); } finally { setLoading(false); }
    };

    const repayLoan = async (loanId) => {
        if (!window.confirm('Confirm repayment: Has the borrower paid back this loan?')) return;
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.post(`/graduation/admin/loans/${loanId}/repay`);
            toast.success(response.data.message || 'Loan repaid');
            loadData();
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to repay'); } finally { setLoading(false); }
    };

    if (!isAdmin) return <div className="container text-center"><div className="card"><p className="text-error">Admin access required</p><p className="text-small spacer-sm">This page is only available to TheSpark administrators.</p></div></div>;

    const activeLoans = loans.filter(l => l.status === 'active');
    const repaidLoans = loans.filter(l => l.status === 'repaid');

    return (
        <div className="container">
            <h1 className="heading-1 text-center spacer-lg">Hybrid Lending Management</h1>
            <p className="text-body text-center spacer-md">Admin-only page: Lend customer savings to borrowers and earn platform profit.</p>

            <div className="card spacer-lg">
                <h2 className="heading-2 spacer-md">Hybrid Mode Status</h2>
                {settings?.hybridMode ? (
                    <div>
                        <p className="text-success spacer-sm">✓ Active</p>
                        <p className="text-small spacer-md">Lending {settings.lendingPercentage}% of savings pool</p>
                        <div className="grid-2">
                            <div><p className="text-small">Available to Lend</p><p className="font-bold">₦{settings.amountAvailableToLend?.toLocaleString()}</p></div>
                            <div><p className="text-small">Total Lent Out</p><p className="font-bold">₦{settings.totalLentOut?.toLocaleString()}</p></div>
                            <div><p className="text-small">Platform Earnings</p><p className="font-bold text-success">₦{settings.platformEarnings?.toLocaleString()}</p></div>
                            <div><p className="text-small">Total Savings Pool</p><p className="font-bold">₦{settings.totalSavingsPool?.toLocaleString()}</p></div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-warning spacer-sm">○ Inactive</p>
                        <p className="text-body text-small spacer-md">Activate to lend {lendPercentage}% of the savings pool (currently ₦{settings?.totalSavingsPool?.toLocaleString()}) to borrowers.</p>
                        <div className="flex-row"><input type="number" value={lendPercentage} onChange={(e) => setLendPercentage(parseInt(e.target.value))} className="input" style={{ width: '80px' }} min="0" max="100" /><button onClick={activateHybridMode} disabled={loading} className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}>{loading ? 'Activating...' : 'Activate'}</button></div>
                    </div>
                )}
            </div>

            <div className="card spacer-lg">
                <h2 className="heading-2 spacer-md">Create New Loan</h2>
                <div className="flex flex-col">
                    <input type="text" value={newLoan.borrowerName} onChange={(e) => setNewLoan({...newLoan, borrowerName: e.target.value})} placeholder="Borrower Name" className="input spacer-sm" />
                    <input type="tel" value={newLoan.borrowerPhone} onChange={(e) => setNewLoan({...newLoan, borrowerPhone: e.target.value})} placeholder="Borrower Phone" className="input spacer-sm" />
                    <input type="number" value={newLoan.amount} onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})} placeholder="Loan Amount (₦)" className="input spacer-sm" />
                    <div className="grid-2">
                        <div><label className="input-label">Interest Rate (%)</label><input type="number" value={newLoan.interestRate} onChange={(e) => setNewLoan({...newLoan, interestRate: e.target.value})} className="input" step="0.5" /></div>
                        <div><label className="input-label">Duration (days)</label><input type="number" value={newLoan.durationDays} onChange={(e) => setNewLoan({...newLoan, durationDays: e.target.value})} className="input" /></div>
                    </div>
                    <input type="text" value={newLoan.purpose} onChange={(e) => setNewLoan({...newLoan, purpose: e.target.value})} placeholder="Loan Purpose" className="input spacer-sm" />
                    <button onClick={createLoan} disabled={loading || !newLoan.borrowerName || !newLoan.amount} className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}>{loading ? 'Creating...' : 'Create Loan'}</button>
                </div>
            </div>

            <div className="card spacer-lg">
                <div className="flex-between"><h2 className="heading-2">Active Loans ({activeLoans.length})</h2>{repaidLoans.length > 0 && <button onClick={() => setShowRepaid(!showRepaid)} className="text-small text-spark-500">{showRepaid ? 'Hide' : 'Show'} Repaid ({repaidLoans.length})</button>}</div>
                {activeLoans.length === 0 ? <p className="text-body text-center">No active loans</p> : activeLoans.map(loan => (
                    <div key={loan.id} className="card spacer-sm">
                        <div className="flex-between"><div><p className="font-semibold">{loan.borrowerName}</p><p className="text-small">{loan.borrowerPhone || 'No phone'}</p></div><button onClick={() => repayLoan(loan.id)} disabled={loading} className="btn btn-success btn-sm">Repay</button></div>
                        <div className="divider"></div>
                        <div className="grid-3"><div><p className="text-small">Amount</p><p className="font-bold">₦{loan.amount?.toLocaleString()}</p></div><div><p className="text-small">Interest</p><p className="font-bold text-success">{loan.interestRate}%</p></div><div><p className="text-small">Due Date</p><p className="text-small">{formatDate(loan.dueDate)}</p></div></div>
                        {loan.purpose && <p className="text-small">Purpose: {loan.purpose}</p>}
                    </div>
                ))}
            </div>

            {showRepaid && repaidLoans.length > 0 && (
                <div className="card spacer-lg">
                    <h2 className="heading-2 spacer-md">Repaid Loans ({repaidLoans.length})</h2>
                    {repaidLoans.map(loan => (
                        <div key={loan.id} className="card spacer-sm">
                            <div className="flex-between"><div><p className="font-semibold">{loan.borrowerName}</p><p className="text-small">{loan.borrowerPhone || 'No phone'}</p></div><span className="text-success text-small">✓ Repaid</span></div>
                            <div className="divider"></div>
                            <div className="grid-3"><div><p className="text-small">Amount</p><p className="font-bold">₦{loan.amount?.toLocaleString()}</p></div><div><p className="text-small">Interest</p><p className="font-bold text-success">{loan.interestRate}%</p></div><div><p className="text-small">Repaid Date</p><p className="text-small">{formatDate(loan.repaidAt)}</p></div></div>
                            {loan.purpose && <p className="text-small">Purpose: {loan.purpose}</p>}
                        </div>
                    ))}
                </div>
            )}

            <div className="message-card spacer-lg">
                <p className="message-title">🏦 How Hybrid Lending Works</p>
                <p className="message-text text-small">• Customers save daily and earn 5% interest every 21 days<br />• TheSpark lends 70% of the savings pool to trusted borrowers at 10-15%<br />• When borrower repays, principal returns to lending pool<br />• Interest becomes Platform Earnings (TheSpark revenue)</p>
            </div>
        </div>
    );
}