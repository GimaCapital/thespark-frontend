// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth } from '../services/firebase';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// export default function AdminDashboard() {
//     const { user } = useAuth();
//     const [stats, setStats] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [admins, setAdmins] = useState([]);
//     const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('stats');
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         if (user) {
//             loadAdminData();
//         }
//     }, [user]);

//     const loadAdminData = async () => {
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
            
//             const [statsRes, usersRes, withdrawalsRes, adminsRes] = await Promise.all([
//                 api.get('/admin/stats'),
//                 api.get('/admin/users'),
//                 api.get('/admin/withdrawals/pending'),
//                 api.get('/admin/admins')
//             ]);
            
//             setStats(statsRes.data);
//             setUsers(usersRes.data);
//             setPendingWithdrawals(withdrawalsRes.data);
//             setAdmins(adminsRes.data);
//         } catch (error) {
//             console.error('Failed to load admin data:', error);
//             toast.error('Failed to load admin data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const approveWithdrawal = async (requestId) => {
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/approve`);
//             toast.success('Withdrawal approved');
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to approve');
//         }
//     };

//     const rejectWithdrawal = async (requestId) => {
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/reject`);
//             toast.success('Withdrawal rejected');
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to reject');
//         }
//     };

//     const makeAdmin = async (userId, fullName) => {
//         if (!window.confirm(`Make ${fullName} an admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/make-admin/${userId}`);
//             toast.success(`${fullName} is now an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to make admin');
//         }
//     };

//     const removeAdmin = async (userId, fullName) => {
//         if (userId === user?.uid) {
//             toast.error('You cannot remove your own admin role');
//             return;
//         }
        
//         if (!window.confirm(`Remove ${fullName} from admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/remove-admin/${userId}`);
//             toast.success(`${fullName} is no longer an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to remove admin');
//         }
//     };

//     const filteredUsers = users.filter(u => 
//         u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.phone?.includes(searchTerm)
//     );

//     const isUserAdmin = (userId) => {
//         return admins.some(a => a.uid === userId);
//     };

//     if (loading) {
//         return (
//             <div className="flex-center h-64">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="container">
//             <div className="flex-between spacer-lg">
//                 <h1 className="heading-2">Admin Dashboard</h1>
//                 <Link to="/admin-management" className="btn btn-outline btn-sm">
//                     Manage Admins
//                 </Link>
//             </div>
            
//             <div className="grid-2 spacer-lg">
//                 <button
//                     onClick={() => setActiveTab('stats')}
//                     className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Stats
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('withdrawals')}
//                     className={`btn ${activeTab === 'withdrawals' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Withdrawals ({pendingWithdrawals.length})
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('users')}
//                     className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Users ({users.length})
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('admins')}
//                     className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Admins ({admins.length})
//                 </button>
//             </div>
            
//             {activeTab === 'stats' && stats && (
//                 <div className="card">
//                     <div className="flex-between spacer-sm">
//                         <span>Total Customers:</span>
//                         <span className="font-bold">{stats.totalCustomers}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Total Savings Pool:</span>
//                         <span className="font-bold">₦{stats.totalSavingsPool?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Total Interest Paid:</span>
//                         <span className="font-bold">₦{stats.totalInterestPaid?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Platform Earnings:</span>
//                         <span className="font-bold text-success">₦{stats.platformEarnings?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Budget Used:</span>
//                         <span className={`font-bold ${stats.cumulativeInterestPaid >= stats.budgetLimit ? 'text-error' : 'text-success'}`}>
//                             ₦{stats.cumulativeInterestPaid?.toLocaleString()} / ₦{stats.budgetLimit?.toLocaleString()}
//                         </span>
//                     </div>
//                     <div className="flex-between">
//                         <span>Hybrid Mode:</span>
//                         <span className={`font-bold ${stats.hybridMode ? 'text-success' : 'text-warning'}`}>
//                             {stats.hybridMode ? 'ACTIVE' : 'INACTIVE'}
//                         </span>
//                     </div>
//                     <div className="flex-between">
//                         <span>Stop Triggered:</span>
//                         <span className={`font-bold ${stats.stopTriggered ? 'text-error' : 'text-success'}`}>
//                             {stats.stopTriggered ? 'YES' : 'NO'}
//                         </span>
//                     </div>
//                 </div>
//             )}
            
//             {activeTab === 'withdrawals' && (
//                 <div className="card">
//                     <h3 className="heading-3 spacer-md">Pending Withdrawals</h3>
//                     {pendingWithdrawals.length === 0 ? (
//                         <p className="text-body">No pending withdrawals</p>
//                     ) : (
//                         pendingWithdrawals.map(w => (
//                             <div key={w.id} className="transaction-item">
//                                 <div>
//                                     <p className="font-semibold">{w.userName}</p>
//                                     <p className="text-small">₦{w.amount.toLocaleString()}</p>
//                                     <p className="text-small">Day {w.requestDay}, Cycle {w.cycle}</p>
//                                 </div>
//                                 <div className="flex-row gap-2">
//                                     <button
//                                         onClick={() => approveWithdrawal(w.id)}
//                                         className="btn btn-success btn-sm"
//                                     >
//                                         Approve
//                                     </button>
//                                     <button
//                                         onClick={() => rejectWithdrawal(w.id)}
//                                         className="btn btn-danger btn-sm"
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             )}
            
//             {activeTab === 'users' && (
//                 <div className="card">
//                     <div className="spacer-md">
//                         <input
//                             type="text"
//                             placeholder="Search by name, email, or phone..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="input"
//                         />
//                     </div>
//                     <h3 className="heading-3 spacer-md">All Users</h3>
//                     {filteredUsers.length === 0 ? (
//                         <p className="text-body text-center">No users found</p>
//                     ) : (
//                         filteredUsers.map(u => {
//                             const isAdmin = isUserAdmin(u.id);
//                             return (
//                                 <div key={u.id} className="transaction-item">
//                                     <div>
//                                         <p className="font-semibold">{u.fullName}</p>
//                                         <p className="text-small">{u.email || u.phone}</p>
//                                         <p className="text-small">
//                                             Balance: ₦{u.currentBalance?.toLocaleString()} | 
//                                             Cycle {u.currentCycle}, Day {u.currentDay}
//                                         </p>
//                                         {isAdmin && <p className="text-small text-spark-500">Admin</p>}
//                                     </div>
//                                     <div>
//                                         {isAdmin ? (
//                                             <button
//                                                 onClick={() => removeAdmin(u.id, u.fullName)}
//                                                 disabled={u.id === user?.uid}
//                                                 className={`btn btn-danger btn-sm ${u.id === user?.uid ? 'btn-disabled' : ''}`}
//                                             >
//                                                 Remove Admin
//                                             </button>
//                                         ) : (
//                                             <button
//                                                 onClick={() => makeAdmin(u.id, u.fullName)}
//                                                 className="btn btn-primary btn-sm"
//                                             >
//                                                 Make Admin
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             )}
            
//             {activeTab === 'admins' && (
//                 <div className="card">
//                     <div className="spacer-md">
//                         <input
//                             type="text"
//                             placeholder="Search admins..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="input"
//                         />
//                     </div>
//                     <h3 className="heading-3 spacer-md">Current Administrators</h3>
//                     {admins.length === 0 ? (
//                         <p className="text-body text-center">No admins found</p>
//                     ) : (
//                         admins.filter(a => 
//                             a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                             a.email?.toLowerCase().includes(searchTerm.toLowerCase())
//                         ).map(admin => (
//                             <div key={admin.uid} className="transaction-item">
//                                 <div>
//                                     <p className="font-semibold">{admin.fullName}</p>
//                                     <p className="text-small">{admin.email || admin.phone}</p>
//                                     <p className="text-small text-spark-500">
//                                         Admin since: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Recently'}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => removeAdmin(admin.uid, admin.fullName)}
//                                     disabled={admin.uid === user?.uid}
//                                     className={`btn btn-danger btn-sm ${admin.uid === user?.uid ? 'btn-disabled' : ''}`}
//                                 >
//                                     Remove Admin
//                                 </button>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth, db } from '../services/firebase';
// import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// export default function AdminDashboard() {
//     const { user } = useAuth();
//     const [stats, setStats] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [admins, setAdmins] = useState([]);
//     const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
//     const [pendingStories, setPendingStories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [storiesLoading, setStoriesLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState('stats');
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         if (user) {
//             loadAdminData();
//         }
//     }, [user]);

//     useEffect(() => {
//         if (activeTab === 'stories') {
//             loadPendingStories();
//         }
//     }, [activeTab]);

//     const loadAdminData = async () => {
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
            
//             const [statsRes, usersRes, withdrawalsRes, adminsRes] = await Promise.all([
//                 api.get('/admin/stats'),
//                 api.get('/admin/users'),
//                 api.get('/admin/withdrawals/pending'),
//                 api.get('/admin/admins')
//             ]);
            
//             setStats(statsRes.data);
//             setUsers(usersRes.data);
//             setPendingWithdrawals(withdrawalsRes.data);
//             setAdmins(adminsRes.data);
//         } catch (error) {
//             console.error('Failed to load admin data:', error);
//             toast.error('Failed to load admin data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadPendingStories = async () => {
//         setStoriesLoading(true);
//         try {
//             const storiesRef = collection(db, 'successStories');
//             const q = query(storiesRef, where('status', '==', 'pending'));
//             const snapshot = await getDocs(q);
            
//             const stories = [];
//             snapshot.forEach(doc => {
//                 stories.push({ id: doc.id, ...doc.data() });
//             });
//             setPendingStories(stories);
//         } catch (error) {
//             console.error('Failed to load pending stories:', error);
//             toast.error('Failed to load pending stories');
//         } finally {
//             setStoriesLoading(false);
//         }
//     };

//     const approveStory = async (storyId) => {
//         try {
//             await updateDoc(doc(db, 'successStories', storyId), {
//                 status: 'approved',
//                 approvedAt: new Date(),
//                 approvedBy: user.uid
//             });
//             toast.success('Story approved and published');
//             loadPendingStories();
//         } catch (error) {
//             console.error('Failed to approve story:', error);
//             toast.error('Failed to approve story');
//         }
//     };

//     const rejectStory = async (storyId) => {
//         if (!window.confirm('Reject this story? The user will need to resubmit.')) return;
        
//         try {
//             await updateDoc(doc(db, 'successStories', storyId), {
//                 status: 'rejected',
//                 rejectedAt: new Date(),
//                 rejectedBy: user.uid
//             });
//             toast.success('Story rejected');
//             loadPendingStories();
//         } catch (error) {
//             console.error('Failed to reject story:', error);
//             toast.error('Failed to reject story');
//         }
//     };

//     const approveWithdrawal = async (requestId) => {
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/approve`);
//             toast.success('Withdrawal approved');
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to approve');
//         }
//     };

//     const rejectWithdrawal = async (requestId) => {
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/reject`);
//             toast.success('Withdrawal rejected');
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to reject');
//         }
//     };

//     const makeAdmin = async (userId, fullName) => {
//         if (!window.confirm(`Make ${fullName} an admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/make-admin/${userId}`);
//             toast.success(`${fullName} is now an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to make admin');
//         }
//     };

//     const removeAdmin = async (userId, fullName) => {
//         if (userId === user?.uid) {
//             toast.error('You cannot remove your own admin role');
//             return;
//         }
        
//         if (!window.confirm(`Remove ${fullName} from admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/remove-admin/${userId}`);
//             toast.success(`${fullName} is no longer an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to remove admin');
//         }
//     };

//     const isUserAdmin = (userId) => {
//         return admins.some(a => a.uid === userId);
//     };

//     const filteredUsers = users.filter(u => 
//         u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.phone?.includes(searchTerm)
//     );

//     if (loading) {
//         return (
//             <div className="flex-center h-64">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="page-container">
//             <div className="flex-between spacer-lg">
//                 <h1 className="heading-2">Admin Dashboard</h1>
//                 <Link to="/admin-management" className="btn btn-outline btn-sm">
//                     Manage Admins
//                 </Link>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 spacer-lg">
//                 <button
//                     onClick={() => setActiveTab('stats')}
//                     className={`btn btn-sm ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Stats
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('withdrawals')}
//                     className={`btn btn-sm ${activeTab === 'withdrawals' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Withdrawals ({pendingWithdrawals.length})
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('users')}
//                     className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Users ({users.length})
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('stories')}
//                     className={`btn btn-sm ${activeTab === 'stories' ? 'btn-primary' : 'btn-secondary'}`}
//                 >
//                     Stories ({pendingStories.length})
//                 </button>
//             </div>
            
//             {/* Stats Tab */}
//             {activeTab === 'stats' && stats && (
//                 <div className="card">
//                     <div className="flex-between spacer-sm">
//                         <span>Total Customers:</span>
//                         <span className="font-bold">{stats.totalCustomers}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Total Savings Pool:</span>
//                         <span className="font-bold">₦{stats.totalSavingsPool?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Total Interest Paid:</span>
//                         <span className="font-bold">₦{stats.totalInterestPaid?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Platform Earnings:</span>
//                         <span className="font-bold text-success">₦{stats.platformEarnings?.toLocaleString()}</span>
//                     </div>
//                     <div className="flex-between spacer-sm">
//                         <span>Budget Used:</span>
//                         <span className={`font-bold ${stats.cumulativeInterestPaid >= stats.budgetLimit ? 'text-error' : 'text-success'}`}>
//                             ₦{stats.cumulativeInterestPaid?.toLocaleString()} / ₦{stats.budgetLimit?.toLocaleString()}
//                         </span>
//                     </div>
//                     <div className="flex-between">
//                         <span>Hybrid Mode:</span>
//                         <span className={`font-bold ${stats.hybridMode ? 'text-success' : 'text-warning'}`}>
//                             {stats.hybridMode ? 'ACTIVE' : 'INACTIVE'}
//                         </span>
//                     </div>
//                     <div className="flex-between">
//                         <span>Stop Triggered:</span>
//                         <span className={`font-bold ${stats.stopTriggered ? 'text-error' : 'text-success'}`}>
//                             {stats.stopTriggered ? 'YES' : 'NO'}
//                         </span>
//                     </div>
//                 </div>
//             )}
            
//             {/* Withdrawals Tab */}
//             {activeTab === 'withdrawals' && (
//                 <div className="card">
//                     <h3 className="heading-3 spacer-md">Pending Withdrawals</h3>
//                     {pendingWithdrawals.length === 0 ? (
//                         <p className="text-body">No pending withdrawals</p>
//                     ) : (
//                         pendingWithdrawals.map(w => (
//                             <div key={w.id} className="transaction-item">
//                                 <div>
//                                     <p className="font-semibold">{w.userName}</p>
//                                     <p className="text-small">₦{w.amount.toLocaleString()}</p>
//                                     <p className="text-small">Day {w.requestDay}, Cycle {w.cycle}</p>
//                                 </div>
//                                 <div className="flex-row gap-2">
//                                     <button
//                                         onClick={() => approveWithdrawal(w.id)}
//                                         className="btn btn-success btn-sm"
//                                     >
//                                         Approve
//                                     </button>
//                                     <button
//                                         onClick={() => rejectWithdrawal(w.id)}
//                                         className="btn btn-danger btn-sm"
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             )}
            
//             {/* Users Tab */}
//             {activeTab === 'users' && (
//                 <div className="card">
//                     <div className="spacer-md">
//                         <input
//                             type="text"
//                             placeholder="Search by name, email, or phone..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="input"
//                         />
//                     </div>
//                     <h3 className="heading-3 spacer-md">All Users</h3>
//                     {filteredUsers.length === 0 ? (
//                         <p className="text-body text-center">No users found</p>
//                     ) : (
//                         filteredUsers.map(u => {
//                             const isAdmin = isUserAdmin(u.id);
//                             return (
//                                 <div key={u.id} className="transaction-item">
//                                     <div>
//                                         <p className="font-semibold">{u.fullName}</p>
//                                         <p className="text-small">{u.email || u.phone}</p>
//                                         <p className="text-small">
//                                             Balance: ₦{u.currentBalance?.toLocaleString()} | 
//                                             Cycle {u.currentCycle}, Day {u.currentDay}
//                                         </p>
//                                         {isAdmin && <p className="text-small text-spark-500">Admin</p>}
//                                     </div>
//                                     <div>
//                                         {isAdmin ? (
//                                             <button
//                                                 onClick={() => removeAdmin(u.id, u.fullName)}
//                                                 disabled={u.id === user?.uid}
//                                                 className={`btn btn-danger btn-sm ${u.id === user?.uid ? 'btn-disabled' : ''}`}
//                                             >
//                                                 Remove Admin
//                                             </button>
//                                         ) : (
//                                             <button
//                                                 onClick={() => makeAdmin(u.id, u.fullName)}
//                                                 className="btn btn-primary btn-sm"
//                                             >
//                                                 Make Admin
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             )}
            
//             {/* Stories Tab - Admin Review Panel */}
//             {activeTab === 'stories' && (
//                 <div className="card">
//                     <h3 className="heading-3 spacer-md">Pending Success Stories</h3>
//                     <p className="text-small text-gray-500 spacer-md">
//                         Review user-submitted success stories. Approve to publish on the Success Stories page.
//                     </p>
                    
//                     {storiesLoading ? (
//                         <div className="flex-center py-8">
//                             <div className="spinner-sm"></div>
//                         </div>
//                     ) : pendingStories.length === 0 ? (
//                         <div className="text-center py-8">
//                             <p className="text-body">No pending stories to review</p>
//                             <p className="text-small text-gray-400 mt-2">
//                                 When users submit success stories, they will appear here for approval.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             {pendingStories.map(story => (
//                                 <div key={story.id} className="border rounded-lg p-4">
//                                     <div className="flex-between flex-wrap gap-2 mb-3">
//                                         <div>
//                                             <h4 className="font-bold text-gray-800">{story.name}</h4>
//                                             <p className="text-xs text-gray-500">
//                                                 Submitted: {story.createdAt?.toDate().toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => approveStory(story.id)}
//                                                 className="btn btn-success btn-sm"
//                                             >
//                                                 ✓ Approve & Publish
//                                             </button>
//                                             <button
//                                                 onClick={() => rejectStory(story.id)}
//                                                 className="btn btn-danger btn-sm"
//                                             >
//                                                 ✗ Reject
//                                             </button>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="bg-gray-50 rounded-lg p-3 mb-3">
//                                         <p className="text-sm text-gray-600 italic">"{story.story}"</p>
//                                     </div>
                                    
//                                     <div className="grid grid-cols-3 gap-2 text-xs">
//                                         <div>
//                                             <span className="text-gray-500">Total Saved:</span>
//                                             <span className="font-bold ml-1">₦{story.saved?.toLocaleString()}</span>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-500">Interest Earned:</span>
//                                             <span className="font-bold text-success ml-1">₦{story.interest?.toLocaleString()}</span>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-500">Final Balance:</span>
//                                             <span className="font-bold text-spark-500 ml-1">₦{story.total?.toLocaleString()}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
                            
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
















import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { formatDate, getFullDate } from '../utils/dateUtils';
import NotificationBell from '../components/NotificationBell';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
    const [pendingStories, setPendingStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storiesLoading, setStoriesLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('stats');
    const [searchTerm, setSearchTerm] = useState('');
    const [approveRating, setApproveRating] = useState(5);
    const [selectedStory, setSelectedStory] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [processingWithdrawal, setProcessingWithdrawal] = useState(null);
    const [retryingWithdrawal, setRetryingWithdrawal] = useState(null);
    
    // ============ FLAGGED DEPOSITS ============
    const [flaggedDeposits, setFlaggedDeposits] = useState([]);
    const [flaggedLoading, setFlaggedLoading] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedFlagged, setSelectedFlagged] = useState(null);
    const [resolveNote, setResolveNote] = useState('');
    const [resolvingFlagged, setResolvingFlagged] = useState(false);
    const [showReverseModal, setShowReverseModal] = useState(false);
    const [reverseReason, setReverseReason] = useState('');
    const [reversingFlagged, setReversingFlagged] = useState(false);

    // ============ INVESTMENT INTERESTS ============
    const [investmentInterests, setInvestmentInterests] = useState([]);
    const [investmentLoading, setInvestmentLoading] = useState(false);
    const [investmentStats, setInvestmentStats] = useState(null);
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [investmentStatus, setInvestmentStatus] = useState('');
    const [investmentNote, setInvestmentNote] = useState('');
    const [updatingInvestment, setUpdatingInvestment] = useState(false);

    // ============ ACCESS CODES ============
    const [accessCodes, setAccessCodes] = useState([]);
    const [accessCodesLoading, setAccessCodesLoading] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateCount, setGenerateCount] = useState(1);
    const [investorName, setInvestorName] = useState('');
    const [generatingCodes, setGeneratingCodes] = useState(false);

    // ============ INVESTMENT DETAILS MODAL ============
    const [showInvestmentDetailsModal, setShowInvestmentDetailsModal] = useState(false);
    const [selectedInvestmentDetails, setSelectedInvestmentDetails] = useState(null);
    const [investmentFilter, setInvestmentFilter] = useState('all');

    // ============ EMAIL SENDING ============
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        if (user) {
            loadAdminData();
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'stories') {
            loadPendingStories();
        }
        if (activeTab === 'flagged') {
            loadFlaggedDeposits();
        }
        if (activeTab === 'investment') {
            loadInvestmentInterests();
            loadAccessCodes();
            loadInvestmentStats();
        }
    }, [activeTab]);

    const loadAdminData = async () => {
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            
            const [statsRes, usersRes, withdrawalsRes, adminsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/withdrawals/pending'),
                api.get('/admin/admins')
            ]);
            
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setPendingWithdrawals(withdrawalsRes.data);
            setAdmins(adminsRes.data);
        } catch (error) {
            console.error('Failed to load admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    // ============ FLAGGED DEPOSITS FUNCTIONS ============
    const loadFlaggedDeposits = async () => {
        setFlaggedLoading(true);
        try {
            const response = await api.get('/admin/flagged-deposits');
            setFlaggedDeposits(response.data);
        } catch (error) {
            console.error('Failed to load flagged deposits:', error);
            toast.error('Failed to load flagged deposits');
        } finally {
            setFlaggedLoading(false);
        }
    };

    const resolveFlaggedDeposit = async (flaggedId, action) => {
        setResolvingFlagged(true);
        try {
            await api.put(`/admin/flagged-deposits/${flaggedId}/resolve`, {
                status: action === 'approve' ? 'approved' : 'rejected',
                resolveNote: resolveNote
            });
            
            toast.success(`Flagged deposit ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
            loadFlaggedDeposits();
            setShowResolveModal(false);
            setResolveNote('');
            setSelectedFlagged(null);
        } catch (error) {
            console.error('Failed to resolve flagged deposit:', error);
            toast.error(error.response?.data?.error || 'Failed to resolve flagged deposit');
        } finally {
            setResolvingFlagged(false);
        }
    };

    const reverseDecision = async (flaggedId) => {
        setReversingFlagged(true);
        try {
            await api.post(`/admin/flagged-deposits/${flaggedId}/reverse`, {
                reverseReason: reverseReason
            });
            
            toast.success('Decision reversed! Deposit is back for review.');
            loadFlaggedDeposits();
            setShowReverseModal(false);
            setReverseReason('');
            setSelectedFlagged(null);
        } catch (error) {
            console.error('Failed to reverse:', error);
            toast.error(error.response?.data?.error || 'Failed to reverse decision');
        } finally {
            setReversingFlagged(false);
        }
    };

    // ============ STORIES FUNCTIONS ============
    const loadPendingStories = async () => {
        setStoriesLoading(true);
        try {
            const storiesRef = collection(db, 'successStories');
            const q = query(storiesRef, where('status', '==', 'pending'));
            const snapshot = await getDocs(q);
            
            const stories = [];
            snapshot.forEach(doc => {
                stories.push({ id: doc.id, ...doc.data() });
            });
            setPendingStories(stories);
        } catch (error) {
            console.error('Failed to load pending stories:', error);
            toast.error('Failed to load pending stories');
        } finally {
            setStoriesLoading(false);
        }
    };

    const getBadgeStyle = (badgeText) => {
        const badges = {
            'Platinum Saver': { color: 'bg-purple-100 text-purple-700', icon: '💎' },
            'Gold Saver': { color: 'bg-yellow-100 text-yellow-700', icon: '🥇' },
            'Silver Saver': { color: 'bg-gray-100 text-gray-700', icon: '🥈' },
            'Bronze Saver': { color: 'bg-orange-100 text-orange-700', icon: '🥉' },
            'Rising Star': { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
            'Verified Saver': { color: 'bg-green-100 text-green-700', icon: '✓' }
        };
        return badges[badgeText] || badges['Verified Saver'];
    };

    const renderStars = (rating) => {
        const ratingValue = rating || 5;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= ratingValue ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const approveStory = async (storyId, rating) => {
        try {
            const updateData = {
                status: 'approved',
                approvedAt: new Date(),
                approvedBy: user.uid
            };
            
            if (rating) {
                updateData.rating = rating;
            }
            
            await updateDoc(doc(db, 'successStories', storyId), updateData);
            toast.success('Story approved and published');
            loadPendingStories();
        } catch (error) {
            console.error('Failed to approve story:', error);
            toast.error('Failed to approve story');
        }
    };

    const rejectStory = async (storyId) => {
        if (!window.confirm('Reject this story? The user will need to resubmit.')) return;
        
        try {
            await updateDoc(doc(db, 'successStories', storyId), {
                status: 'rejected',
                rejectedAt: new Date(),
                rejectedBy: user.uid
            });
            toast.success('Story rejected');
            loadPendingStories();
        } catch (error) {
            console.error('Failed to reject story:', error);
            toast.error('Failed to reject story');
        }
    };

    // ============ WITHDRAWAL FUNCTIONS ============
    const approveWithdrawal = async (requestId) => {
        setProcessingWithdrawal(requestId);
        
        try {
            const response = await api.post(`/admin/withdrawals/${requestId}/approve`);
            toast.success('Withdrawal approved successfully!');
            await loadAdminData();
        } catch (error) {
            const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message || 'Unknown error';
            toast.error(`Failed: ${errorMessage}`);
            console.error('Withdrawal approval failed:', {
                requestId,
                error: errorMessage,
                fullError: error
            });
            await loadAdminData();
        } finally {
            setProcessingWithdrawal(null);
        }
    };

    const retryWithdrawal = async (requestId) => {
        setRetryingWithdrawal(requestId);
        
        try {
            await api.post(`/admin/withdrawals/${requestId}/retry`);
            toast.success('Withdrawal reset to pending for retry');
            await loadAdminData();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
            toast.error(`Failed to retry: ${errorMessage}`);
        } finally {
            setRetryingWithdrawal(null);
        }
    };

    const rejectWithdrawal = async (requestId) => {
        try {
            await api.post(`/admin/withdrawals/${requestId}/reject`);
            toast.success('Withdrawal rejected');
            loadAdminData();
        } catch (error) {
            console.error('Failed to reject:', error);
            toast.error('Failed to reject');
        }
    };

    // Add this function in the WITHDRAWAL FUNCTIONS section
    const deleteWithdrawal = async (requestId) => {
        if (!window.confirm('Delete this withdrawal?')) return;
        
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.delete(`/admin/withdrawals/${requestId}`);
            toast.success('Deleted successfully');
            loadAdminData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    // ============ ADMIN MANAGEMENT FUNCTIONS ============
    const makeAdmin = async (userId, fullName) => {
        if (!window.confirm(`Make ${fullName} an admin?`)) return;
        
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post(`/admin/make-admin/${userId}`);
            toast.success(`${fullName} is now an admin`);
            loadAdminData();
        } catch (error) {
            toast.error('Failed to make admin');
        }
    };

    const removeAdmin = async (userId, fullName) => {
        if (userId === user?.uid) {
            toast.error('You cannot remove your own admin role');
            return;
        }
        
        if (!window.confirm(`Remove ${fullName} from admin?`)) return;
        
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.post(`/admin/remove-admin/${userId}`);
            toast.success(`${fullName} is no longer an admin`);
            loadAdminData();
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };

    const isUserAdmin = (userId) => {
        return admins.some(a => a.uid === userId);
    };

    // ============ INVESTMENT FUNCTIONS ============
    const loadInvestmentInterests = async () => {
        setInvestmentLoading(true);
        try {
            const response = await api.get('/investment/interests');
            setInvestmentInterests(response.data);
        } catch (error) {
            console.error('Failed to load investment interests:', error);
            toast.error('Failed to load investment interests');
        } finally {
            setInvestmentLoading(false);
        }
    };

    const loadInvestmentStats = async () => {
        try {
            const response = await api.get('/investment/stats');
            setInvestmentStats(response.data);
        } catch (error) {
            console.error('Failed to load investment stats:', error);
        }
    };

    const loadAccessCodes = async () => {
        setAccessCodesLoading(true);
        try {
            const response = await api.get('/investment/access-codes');
            setAccessCodes(response.data);
        } catch (error) {
            console.error('Failed to load access codes:', error);
            toast.error('Failed to load access codes');
        } finally {
            setAccessCodesLoading(false);
        }
    };

    const generateAccessCodes = async () => {
        setGeneratingCodes(true);
        try {
            const response = await api.post('/investment/generate-codes', {
                count: generateCount,
                investorName: investorName || 'Investor'
            });
            
            if (response.data.success) {
                toast.success(`${response.data.codes.length} access codes generated successfully!`);
                setShowGenerateModal(false);
                setGenerateCount(1);
                setInvestorName('');
                loadAccessCodes();
                loadInvestmentStats();
            }
        } catch (error) {
            console.error('Failed to generate codes:', error);
            toast.error(error.response?.data?.error || 'Failed to generate codes');
        } finally {
            setGeneratingCodes(false);
        }
    };

    const updateInvestmentStatus = async () => {
        if (!selectedInvestment) return;
        setUpdatingInvestment(true);
        try {
            await api.put(`/investment/interests/${selectedInvestment.id}/status`, {
                status: investmentStatus,
                notes: investmentNote
            });
            
            toast.success('Investment status updated successfully');
            setShowInvestmentModal(false);
            setSelectedInvestment(null);
            setInvestmentStatus('');
            setInvestmentNote('');
            loadInvestmentInterests();
            loadInvestmentStats();
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.error || 'Failed to update status');
        } finally {
            setUpdatingInvestment(false);
        }
    };

    const getInvestmentStatusColor = (status) => {
        const colors = {
            'new': 'bg-blue-100 text-blue-800',
            'contacted': 'bg-yellow-100 text-yellow-800',
            'invested': 'bg-green-100 text-green-800',
            'not_interested': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount) => {
        return '₦' + amount.toLocaleString();
    };

    // ============ NEW INVESTMENT HELPER FUNCTIONS ============
    const getUserStatusBadge = (userExists, userId, wasLoggedIn) => {
    if (userExists && userId) {
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">✅ Registered User</span>;
    } else {
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">🆕 New Lead</span>;
    }
};

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const viewUserDetails = (userId) => {
        if (!userId) {
            toast.info('This user does not have an account yet');
            return;
        }
        window.open(`/admin/users/${userId}`, '_blank');
    };

    const filteredUsers = users.filter(u => 
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    // ============ SEND INVESTOR EMAIL ============
// ============ SEND INVESTOR EMAIL ============
const sendInvestorEmail = async (interest) => {
    if (!interest.email) {
        toast.error('No email address found for this investor');
        return;
    }
    
    if (!window.confirm(`Send investment details email to ${interest.email}?`)) {
        return;
    }
    
    setSendingEmail(true);
    try {
        const idToken = await user.getIdToken();
        setAuthToken(idToken);
        
        const response = await api.post('/investment/send-investor-email', {
            interestId: interest.id,
            email: interest.email,
            fullName: interest.fullName,
            investmentAmount: interest.investmentAmount,
            investorName: interest.investorName || ''
        });
        
        if (response.data.success) {
            toast.success('✅ Email sent successfully!');
            // ✅ Refresh the investment list to show updated emailSent status
            loadInvestmentInterests();
        }
    } catch (error) {
        console.error('Error sending email:', error);
        toast.error(error.response?.data?.error || 'Failed to send email');
    } finally {
        setSendingEmail(false);
    }
};

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage platform operations and compliance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Link to="/admin-management" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Manage Admins
                        </Link>
                    </div>
                </div>
                
                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                    {[
                        { id: 'stats', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                        { id: 'withdrawals', label: 'Withdrawals', count: pendingWithdrawals.filter(w => w.status === 'pending').length, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z' },
                        { id: 'users', label: 'Customers', count: users.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                        { id: 'stories', label: 'Stories', count: pendingStories.length, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                        { id: 'flagged', label: 'Flagged', count: flaggedDeposits.filter(f => f.status === 'review_needed' || !f.status).length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                        { id: 'investment', label: 'Investment', count: investmentInterests.filter(i => i.status === 'new' || !i.status).length, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
                                activeTab === tab.id 
                                    ? 'bg-white text-spark-500 border-b-2 border-spark-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id 
                                        ? 'bg-spark-50 text-spark-600' 
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                
                {/* ============ STATS / OVERVIEW TAB ============ */}
                {activeTab === 'stats' && stats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Savings Pool</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.totalSavingsPool?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Interest Paid</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.totalInterestPaid?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-spark-500 to-spark-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/80 font-medium">Platform Earnings</p>
                                        <p className="text-3xl font-bold text-white mt-1">₦{stats.platformEarnings?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Budget Utilization</h3>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                        stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-100 text-red-700' : 'bg-spark-50 text-spark-600'
                                    }`}>
                                        {((stats.cumulativeInterestPaid / stats.budgetLimit) * 100).toFixed(1)}% Used
                                    </span>
                                </div>
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                                        <div 
                                            style={{ width: `${Math.min((stats.cumulativeInterestPaid / stats.budgetLimit) * 100, 100)}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${
                                                stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-500' : 'bg-spark-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3">
                                    <span className="text-sm text-gray-600">Used: ₦{stats.cumulativeInterestPaid?.toLocaleString()}</span>
                                    <span className="text-sm text-gray-600">Limit: ₦{stats.budgetLimit?.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">System Mode</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`w-2 h-2 rounded-full ${stats.hybridMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                            <p className={`text-lg font-semibold ${stats.hybridMode ? 'text-green-600' : 'text-gray-600'}`}>
                                                {stats.hybridMode ? 'Hybrid Mode Active' : 'Standard Mode'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-2 rounded-xl ${stats.stopTriggered ? 'bg-red-50' : 'bg-spark-50'}`}>
                                        <p className={`text-sm font-medium ${stats.stopTriggered ? 'text-red-600' : 'text-spark-600'}`}>
                                            {stats.stopTriggered ? '⚠️ Stop Triggered' : '✓ System Normal'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ============ WITHDRAWALS TAB ============ */}
                {activeTab === 'withdrawals' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h2>
                                <p className="text-sm text-gray-500 mt-1">Review and process customer withdrawal requests</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-600">
                                    Pending: {pendingWithdrawals.filter(w => w.status === 'pending').length}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-red-50 text-red-600">
                                    Failed: {pendingWithdrawals.filter(w => w.status === 'failed').length}
                                </span>
                            </div>
                        </div>

                        {pendingWithdrawals.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Withdrawals</h3>
                                <p className="text-gray-500">All withdrawal requests have been processed</p>
                            </div>
                        ) : (
                            pendingWithdrawals.map(w => (
                                <div key={w.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                                    <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    {/* ✅ FIX: Show user info with ID if deleted */}
                                                   <p className="font-semibold text-gray-900">
                                                        {w.userName && w.userName !== 'Deleted User' 
                                                            ? `${w.userName} (${w.userId})` 
                                                            : w.userId 
                                                                ? `👻 Deleted User (${w.userId})` 
                                                                : 'Unknown User'
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Request ID: {w.id}</p>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                        w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        w.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        w.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {w.status || 'pending'}
                                                    </span>
                                                    {w.error && (
                                                        <p className="text-xs text-red-600 mt-1">Error: {w.error}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {w.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveWithdrawal(w.id)}
                                                        disabled={processingWithdrawal === w.id}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {processingWithdrawal === w.id ? 'Processing...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => rejectWithdrawal(w.id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {w.status === 'failed' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => retryWithdrawal(w.id)}
                                                        disabled={retryingWithdrawal === w.id}
                                                        className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {retryingWithdrawal === w.id ? 'Retrying...' : '🔄 Retry'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteWithdrawal(w.id)}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            )}
                                            {w.status === 'approved' && (
                                                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-xl">
                                                    ✅ Approved
                                                </span>
                                            )}
                                            {w.status === 'rejected' && (
                                                <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-xl">
                                                    ❌ Rejected
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Amount</p>
                                                <p className="text-lg font-bold text-gray-900">₦{w.amount.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs text-gray-500">Cycle / Day</p>
                                                <p className="text-lg font-bold text-gray-900">Cycle {w.cycle} • Day {w.requestDay}</p>
                                            </div>
                                            {w.userBankAccount && (
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-500">Bank Account</p>
                                                    <p className="text-sm font-medium text-gray-900">{w.userBankAccount.bankName || 'Not set'}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{w.userBankAccount.accountNumber}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {/* ============ USERS / CUSTOMERS TAB ============ */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Customer Management</h2>
                                <p className="text-sm text-gray-500 mt-1">View and manage customer accounts</p>
                            </div>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-80 focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {filteredUsers.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <p className="text-gray-500">No customers found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredUsers.map(u => {
                                    const isAdmin = isUserAdmin(u.id);
                                    return (
                                        <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-spark-500 to-spark-700">
                                                        {u.fullName?.charAt(0) || u.email?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-900">{u.fullName}</p>
                                                            {isAdmin && (
                                                                <span className="px-2 py-0.5 rounded-lg text-xs bg-spark-50 text-spark-600">Admin</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-0.5">{u.email || u.phone}</p>
                                                        <p className="text-xs text-gray-400 mt-1">User ID: {u.id}</p>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <span className="text-xs text-gray-500">Balance: ₦{u.currentBalance?.toLocaleString()}</span>
                                                            <span className="text-xs text-gray-500">Cycle {u.currentCycle} • Day {u.currentDay}</span>
                                                        </div>
                                                        {u.bankName && (
                                                            <p className="text-xs text-gray-400 mt-2">Bank: {u.bankName} ({u.accountNumber})</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    {isAdmin ? (
                                                        <button
                                                            onClick={() => removeAdmin(u.id, u.fullName)}
                                                            disabled={u.id === user?.uid}
                                                            className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                                                        >
                                                            Remove Admin
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => makeAdmin(u.id, u.fullName)}
                                                            className="px-4 py-2 text-white text-sm font-medium rounded-xl transition-all bg-spark-500 hover:bg-spark-600"
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                
                {/* ============ STORIES TAB ============ */}
                {activeTab === 'stories' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Success Stories Review</h2>
                            <p className="text-sm text-gray-500 mt-1">Review and publish customer success stories</p>
                        </div>
                        
                        {storiesLoading ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                                <p className="text-gray-500 mt-4">Loading stories...</p>
                            </div>
                        ) : pendingStories.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Stories</h3>
                                <p className="text-gray-500">All stories have been reviewed</p>
                            </div>
                        ) : (
                            pendingStories.map(story => {
                                const badgeStyle = getBadgeStyle(story.badgeText);
                                return (
                                    <div key={story.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeStyle.color}`}>
                                                        <span className="text-xl">{badgeStyle.icon}</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-900">{story.name}</p>
                                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${badgeStyle.color}`}>
                                                                {story.badgeText || 'Verified Saver'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5">Submitted: {formatDate(story.createdAt)}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Story ID: {story.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStory(story);
                                                            setApproveRating(story.rating || 5);
                                                            setShowRatingModal(true);
                                                        }}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all"
                                                    >
                                                        Approve & Publish
                                                    </button>
                                                    <button
                                                        onClick={() => rejectStory(story.id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                <p className="text-gray-700 italic">"{story.story}"</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Total Saved</p>
                                                    <p className="text-lg font-bold text-gray-900">₦{story.saved?.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Interest Earned</p>
                                                    <p className="text-lg font-bold text-green-600">₦{story.interest?.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                                    <p className="text-xs text-gray-500">Final Balance</p>
                                                    <p className="text-lg font-bold text-spark-500">₦{story.total?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                               {/* ✅ Use renderStars here if you want to show rating */}
                                            {story.rating && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Rating:</span>
                                                    {renderStars(story.rating)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
                
                {/* ============ FLAGGED DEPOSITS TAB ============ */}
               {/* ============ FLAGGED DEPOSITS TAB ============ */}
                {activeTab === 'flagged' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Pending Review</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {flaggedDeposits.filter(f => f.status === 'review_needed' || !f.status).length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Approved</p>
                                        <p className="text-3xl font-bold text-green-600 mt-1">
                                            {flaggedDeposits.filter(f => f.status === 'approved').length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Rejected</p>
                                        <p className="text-3xl font-bold text-red-600 mt-1">
                                            {flaggedDeposits.filter(f => f.status === 'rejected').length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="rounded-2xl p-5 shadow-lg text-white bg-gradient-to-r from-spark-500 to-spark-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-white/80 font-medium">Total Flagged Value</p>
                                        <p className="text-3xl font-bold text-white mt-1">
                                            ₦{flaggedDeposits.reduce((sum, f) => sum + (f.actualAmount || 0), 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {flaggedLoading ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                                <p className="text-gray-500 mt-4">Loading transactions...</p>
                            </div>
                        ) : flaggedDeposits.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear</h3>
                                <p className="text-gray-500">No flagged transactions require your attention</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {flaggedDeposits.map((deposit) => (
                                    <div key={deposit.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                        deposit.status === 'approved' ? 'bg-green-100' :
                                                        deposit.status === 'rejected' ? 'bg-red-100' :
                                                        'bg-yellow-100'
                                                    }`}>
                                                        {deposit.status === 'approved' ? '✅' :
                                                        deposit.status === 'rejected' ? '❌' :
                                                        '⚠️'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {deposit.userName || deposit.userId || 'Unknown User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            Transaction: {deposit.flwReference || deposit.id}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                            deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            deposit.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            deposit.status === 'review_needed' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {deposit.status || 'review_needed'}
                                                        </span>
                                                        {deposit.resolveNote && (
                                                            <p className="text-xs text-gray-500 mt-1">Note: {deposit.resolveNote}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {(deposit.status === 'review_needed' || !deposit.status) && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedFlagged(deposit);
                                                                    setResolveNote('');
                                                                    setShowResolveModal(true);
                                                                }}
                                                                className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                                                            >
                                                                Review
                                                            </button>
                                                        </>
                                                    )}
                                                    {(deposit.status === 'approved' || deposit.status === 'rejected') && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedFlagged(deposit);
                                                                setReverseReason('');
                                                                setShowReverseModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-all"
                                                        >
                                                            🔄 Reverse
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-500">Intended Amount</p>
                                                    <p className="text-lg font-bold text-gray-900">₦{deposit.intendedAmount?.toLocaleString()}</p>
                                                </div>
                                                <div className={`rounded-xl p-3 ${deposit.actualAmount !== deposit.intendedAmount ? 'bg-red-50' : 'bg-gray-50'}`}>
                                                    <p className="text-xs text-gray-500">Actual Amount</p>
                                                    <p className={`text-lg font-bold ${deposit.actualAmount !== deposit.intendedAmount ? 'text-red-600' : 'text-gray-900'}`}>
                                                        ₦{deposit.actualAmount?.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-500">User ID</p>
                                                    <p className="text-xs font-mono text-gray-500 truncate">{deposit.userId}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-500">Date</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {deposit.createdAt ? formatDate(deposit.createdAt) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {deposit.discrepancyReason && (
                                                <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200">
                                                    <p className="text-xs text-red-500 font-medium">⚠️ Discrepancy Reason</p>
                                                    <p className="text-sm text-red-700">{deposit.discrepancyReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* ============ INVESTMENT TAB ============ */}
               {/* ============ INVESTMENT TAB ============ */}
{activeTab === 'investment' && (
    <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Investors</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{investmentStats?.totalInterests || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Potential</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(investmentStats?.totalAmount || 0)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
                        <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">New Leads</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{investmentStats?.stats?.new || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Confirmed</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{investmentStats?.stats?.invested || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl p-5 shadow-lg text-white bg-gradient-to-r from-spark-500 to-spark-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/80 font-medium">Avg Investment</p>
                        <p className="text-3xl font-bold text-white mt-1">
                            {investmentStats?.totalInterests > 0 
                                ? formatCurrency(Math.round(investmentStats.totalAmount / investmentStats.totalInterests))
                                : formatCurrency(0)}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Investment Interests</h2>
                <span className="text-xs text-gray-400">
                    {investmentInterests.filter(i => i.userExists).length} registered / {investmentInterests.filter(i => !i.userExists).length} new
                </span>
            </div>
            <div className="flex items-center gap-3">
                <select
                    value={investmentFilter}
                    onChange={(e) => setInvestmentFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="invested">Invested</option>
                    <option value="not_interested">Not Interested</option>
                </select>
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                >
                    + Generate Access Code
                </button>
            </div>
        </div>

        {/* Investment List */}
        {investmentLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading investment interests...</p>
            </div>
        ) : investmentInterests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Investment Interests</h3>
                <p className="text-gray-500">No one has expressed interest yet</p>
            </div>
        ) : (
            <div className="space-y-4">
                {investmentInterests
                    .filter(i => investmentFilter === 'all' || i.status === investmentFilter)
                    .map((interest) => {
                        const isUser = interest.userExists === true;
                        return (
                            <div key={interest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUser ? 'bg-green-50' : 'bg-spark-50'}`}>
                                                <span className="text-lg">{isUser ? '👤' : '🆕'}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-gray-900">{interest.fullName || 'Anonymous'}</p>
                                                    {getUserStatusBadge(interest.userExists, interest.userId)}
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getInvestmentStatusColor(interest.status || 'new')}`}>
                                                        {interest.status || 'new'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">{interest.email}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(interest.email)}
                                                        className="text-gray-400 hover:text-gray-600 text-xs"
                                                        title="Copy email"
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500">{interest.phone}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-400">
                                                        {interest.createdAt ? formatDate(interest.createdAt) : 'N/A'}
                                                    </span>
                                                    {interest.ipAddress && (
                                                        <span className="text-xs text-gray-400">
                                                            🌐 {interest.ipAddress}
                                                        </span>
                                                    )}
                                                    {interest.emailSent && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                            ✅ Email Sent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => sendInvestorEmail(interest)}
                                                disabled={sendingEmail || interest.emailSent}
                                                className={`px-3 py-1.5 text-white text-sm font-medium rounded-xl transition-all ${
                                                    interest.emailSent 
                                                        ? 'bg-green-500 cursor-default' 
                                                        : sendingEmail 
                                                            ? 'bg-gray-400 cursor-not-allowed' 
                                                            : 'bg-blue-500 hover:bg-blue-600'
                                                }`}
                                                title={interest.emailSent ? 'Email already sent' : 'Send investment details email'}
                                            >
                                                {interest.emailSent ? '✅ Sent' : '📧 Send Email'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedInvestmentDetails(interest);
                                                    setShowInvestmentDetailsModal(true);
                                                }}
                                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedInvestment(interest);
                                                    setInvestmentStatus(interest.status || 'new');
                                                    setInvestmentNote(interest.notes || '');
                                                    setShowInvestmentModal(true);
                                                }}
                                                className="px-3 py-1.5 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500">Investment Amount</p>
                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(interest.investmentAmount || 0)}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500">Type</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">{interest.type || 'profit_sharing'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500">Access Code</p>
                                            <p className="text-sm font-mono text-gray-900">{interest.accessCode || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500">User ID</p>
                                            <p className="text-xs font-mono text-gray-500 truncate">
                                                {interest.userId || 'No Account'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-500">Agreed to Terms</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {interest.agreedToTerms ? '✅' : '❌'}
                                            </p>
                                        </div>
                                    </div>
                                    {interest.notes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500">Notes</p>
                                            <p className="text-sm text-gray-700">{interest.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        )}

        {/* ============ ACCESS CODES SECTION ============ */}
        <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Access Codes</h3>
                <span className="text-sm text-gray-500">
                    {accessCodes.filter(c => {
                        const expiresDate = c.expiresAt ? new Date(c.expiresAt) : null;
                        const isExpired = expiresDate && expiresDate < new Date();
                        return !c.isUsed && !isExpired;
                    }).length} active of {accessCodes.length} total
                </span>
            </div>
            
            {accessCodesLoading ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-3">Loading access codes...</p>
                </div>
            ) : accessCodes.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <p className="text-gray-500">No access codes generated yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Generate Access Code" to create one</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used By</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accessCodes.map((code) => {
                                    const createdDate = code.createdAt ? new Date(code.createdAt) : null;
                                    const expiresDate = code.expiresAt ? new Date(code.expiresAt) : null;
                                    const now = new Date();
                                    const isExpired = expiresDate && expiresDate < now;
                                    
                                    const formatDateDisplay = (date) => {
                                        if (!date) return 'N/A';
                                        try {
                                            return date.toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            });
                                        } catch (e) {
                                            return 'Invalid Date';
                                        }
                                    };
                                    
                                    return (
                                        <tr key={code.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm font-bold text-gray-900">{code.code}</span>
                                                    {!code.isUsed && !isExpired && (
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(code.code);
                                                                toast.success('Code copied!');
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                                            title="Copy code"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {code.investorName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    code.isUsed 
                                                        ? 'bg-gray-100 text-gray-600' 
                                                        : isExpired
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-green-100 text-green-600'
                                                }`}>
                                                    {code.isUsed 
                                                        ? '✅ Used' 
                                                        : isExpired
                                                            ? '⏰ Expired'
                                                            : '🟢 Active'
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateDisplay(createdDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDateDisplay(expiresDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {code.usedBy || '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* ============ INVESTMENT DETAILS MODAL ============ */}
        {showInvestmentDetailsModal && selectedInvestmentDetails && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                setShowInvestmentDetailsModal(false);
                setSelectedInvestmentDetails(null);
            }}>
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                    <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Investment Details</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Full information about this investor</p>
                                </div>
                            </div>
                            <button onClick={() => {
                                setShowInvestmentDetailsModal(false);
                                setSelectedInvestmentDetails(null);
                            }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* User Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="text-lg font-semibold text-gray-900">{selectedInvestmentDetails.fullName || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-lg font-semibold text-gray-900 break-all">{selectedInvestmentDetails.email || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-lg font-semibold text-gray-900">{selectedInvestmentDetails.phone || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">User Status</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {selectedInvestmentDetails.userExists ? '✅ Registered User' : '🆕 New Lead'}
                                </p>
                            </div>
                        </div>

                        {/* Investment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-spark-50 rounded-xl p-4 border border-spark-200">
                                <p className="text-xs text-gray-500">Investment Amount</p>
                                <p className="text-2xl font-bold text-spark-600">
                                    {formatCurrency(selectedInvestmentDetails.investmentAmount || 0)}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`inline-flex px-3 py-1 mt-1 rounded-full text-sm font-medium ${getInvestmentStatusColor(selectedInvestmentDetails.status || 'new')}`}>
                                    {selectedInvestmentDetails.status || 'new'}
                                </span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-500">Access Code</p>
                                <p className="text-lg font-mono font-bold text-gray-900">{selectedInvestmentDetails.accessCode || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">🔒 Security Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">IP Address</p>
                                    <p className="text-sm font-mono text-gray-700">{selectedInvestmentDetails.ipAddress || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Device Fingerprint</p>
                                    <p className="text-xs font-mono text-gray-500 break-all">{selectedInvestmentDetails.deviceFingerprint || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Agreed to Terms</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedInvestmentDetails.agreedToTerms ? '✅ Yes' : '❌ No'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Submitted At</p>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {selectedInvestmentDetails.createdAt ? formatDate(selectedInvestmentDetails.createdAt) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedInvestmentDetails.notes && (
                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                <p className="text-xs text-gray-500">📝 Notes</p>
                                <p className="text-sm text-gray-700 mt-1">{selectedInvestmentDetails.notes}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100 flex-wrap">
                            {selectedInvestmentDetails.userId && (
                                <button
                                    onClick={() => viewUserDetails(selectedInvestmentDetails.userId)}
                                    className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                                >
                                    View User Profile
                                </button>
                            )}
                            
                            {/* ✅ Send Email Button */}
                            <button
                                onClick={() => {
                                    if (selectedInvestmentDetails) {
                                        sendInvestorEmail(selectedInvestmentDetails);
                                    }
                                }}
                                disabled={sendingEmail || selectedInvestmentDetails?.emailSent}
                                className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition-all ${
                                    selectedInvestmentDetails?.emailSent 
                                        ? 'bg-green-500 cursor-default' 
                                        : sendingEmail 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {selectedInvestmentDetails?.emailSent ? '✅ Email Sent' : '📧 Send Email'}
                            </button>
                            
                            <button
                                onClick={() => {
                                    copyToClipboard(selectedInvestmentDetails?.email);
                                }}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all"
                            >
                                📋 Copy Email
                            </button>
                            
                            <button
                                onClick={() => {
                                    setShowInvestmentDetailsModal(false);
                                    setSelectedInvestment(selectedInvestmentDetails);
                                    setInvestmentStatus(selectedInvestmentDetails?.status || 'new');
                                    setInvestmentNote(selectedInvestmentDetails?.notes || '');
                                    setShowInvestmentModal(true);
                                }}
                                className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
)}

                {/* ============ MODALS ============ */}
                
                {/* Rating Approval Modal */}
                {showRatingModal && selectedStory && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                        setShowRatingModal(false);
                        setSelectedStory(null);
                    }}>
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Rate Success Story</h3>
                                <p className="text-gray-500 mb-4">Set rating for {selectedStory.name}</p>
                                <div className="flex justify-center gap-3 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setApproveRating(star)} className="text-4xl focus:outline-none transition-transform hover:scale-110">
                                            <span className={star <= approveRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => { approveStory(selectedStory.id, approveRating); setShowRatingModal(false); setSelectedStory(null); }} className="flex-1 text-white font-semibold py-3 rounded-xl transition-all bg-spark-500 hover:bg-spark-600">
                                        Publish Story
                                    </button>
                                    <button onClick={() => { setShowRatingModal(false); setSelectedStory(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resolve Flagged Deposit Modal */}
                {showResolveModal && selectedFlagged && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                        setShowResolveModal(false);
                        setSelectedFlagged(null);
                        setResolveNote('');
                    }}>
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                            <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Review Transaction</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">Verify and process flagged deposit</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setShowResolveModal(false); setSelectedFlagged(null); setResolveNote(''); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <p className="text-sm text-gray-500 mb-2">Intended Amount</p>
                                        <p className="text-3xl font-bold text-gray-900">₦{selectedFlagged.intendedAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                                        <p className="text-sm text-gray-500 mb-2">Actual Amount</p>
                                        <p className="text-3xl font-bold text-red-600">₦{selectedFlagged.actualAmount?.toLocaleString()}</p>
                                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
                                            <span className="text-xs font-medium text-red-700">Discrepancy: ₦{Math.abs(selectedFlagged.actualAmount - selectedFlagged.intendedAmount).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                                    <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
                                        <span className="text-sm text-gray-500">Transaction Reference</span>
                                        <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.flwReference || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-500">Customer ID</span>
                                        <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.userId}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-500">Deposit ID</span>
                                        <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.id}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Resolution Note <span className="text-red-500">*</span>
                                    </label>
                                    <textarea value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition-all resize-none" rows="4" placeholder="Provide detailed reason for this decision..." />
                                    <p className="text-xs text-gray-400 mt-2">This note will be permanently recorded for audit purposes</p>
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => resolveFlaggedDeposit(selectedFlagged.id, 'approve')} disabled={resolvingFlagged || !resolveNote} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
                                        {resolvingFlagged ? 'Processing...' : '✓ Approve Transaction'}
                                    </button>
                                    <button onClick={() => resolveFlaggedDeposit(selectedFlagged.id, 'reject')} disabled={resolvingFlagged || !resolveNote} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
                                        {resolvingFlagged ? 'Processing...' : '✗ Reject Transaction'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reverse Decision Modal */}
                {showReverseModal && selectedFlagged && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                        setShowReverseModal(false);
                        setSelectedFlagged(null);
                        setReverseReason('');
                    }}>
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Reverse Decision</h3>
                                </div>
                                
                                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600">Deposit ID: <span className="font-mono text-xs break-all">{selectedFlagged.id}</span></p>
                                    <p className="text-sm text-gray-600 mt-2">Current Status: <span className="font-bold">{selectedFlagged.status}</span></p>
                                    <p className="text-sm text-gray-600 mt-2">This will undo the {selectedFlagged.status} and put the deposit back for review.</p>
                                    {selectedFlagged.status === 'approved' && (
                                        <p className="text-sm text-red-600 mt-3 font-medium">⚠️ This will deduct ₦{selectedFlagged.actualAmount?.toLocaleString()} from the user's balance.</p>
                                    )}
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Reversal</label>
                                    <textarea value={reverseReason} onChange={(e) => setReverseReason(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition-all resize-none" rows="3" placeholder="Why are you reversing this decision?" required />
                                </div>
                                
                                <div className="flex gap-3">
                                    <button onClick={() => reverseDecision(selectedFlagged.id)} disabled={reversingFlagged || !reverseReason} className="flex-1 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 bg-spark-500 hover:bg-spark-600">
                                        {reversingFlagged ? 'Processing...' : 'Yes, Reverse Decision'}
                                    </button>
                                    <button onClick={() => { setShowReverseModal(false); setSelectedFlagged(null); setReverseReason(''); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ INVESTMENT MODALS ============ */}
                
                {/* Generate Access Code Modal */}
                {showGenerateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                        setShowGenerateModal(false);
                        setGenerateCount(1);
                        setInvestorName('');
                    }}>
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Generate Access Codes</h3>
                                </div>
                                
                                <p className="text-sm text-gray-500 mb-4">
                                    Generate unique access codes for potential investors. Each code expires in 24 hours and can only be used once.
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Codes
                                        </label>
                                        <input
                                            type="number"
                                            value={generateCount}
                                            onChange={(e) => setGenerateCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            min="1"
                                            max="100"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Investor Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={investorName}
                                            onChange={(e) => setInvestorName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">This name will appear when the investor uses the code</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowGenerateModal(false);
                                            setGenerateCount(1);
                                            setInvestorName('');
                                        }}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={generateAccessCodes}
                                        disabled={generatingCodes}
                                        className={`flex-1 text-white font-semibold py-3 rounded-xl transition-all ${
                                            generatingCodes ? 'bg-gray-400 cursor-not-allowed' : 'bg-spark-500 hover:bg-spark-600'
                                        }`}
                                    >
                                        {generatingCodes ? 'Generating...' : 'Generate Codes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Investment Status Modal */}
                {showInvestmentModal && selectedInvestment && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
                        setShowInvestmentModal(false);
                        setSelectedInvestment(null);
                        setInvestmentStatus('');
                        setInvestmentNote('');
                    }}>
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
                                        <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Update Investment Status</h3>
                                </div>
                                
                                <p className="text-sm text-gray-500 mb-4">
                                    Update status for <strong>{selectedInvestment.fullName}</strong>
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={investmentStatus}
                                            onChange={(e) => setInvestmentStatus(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                        >
                                            <option value="new">New - Not Contacted</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="invested">Invested</option>
                                            <option value="not_interested">Not Interested</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            value={investmentNote}
                                            onChange={(e) => setInvestmentNote(e.target.value)}
                                            rows="3"
                                            placeholder="Add notes about this investor..."
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowInvestmentModal(false);
                                            setSelectedInvestment(null);
                                            setInvestmentStatus('');
                                            setInvestmentNote('');
                                        }}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateInvestmentStatus}
                                        disabled={updatingInvestment}
                                        className={`flex-1 text-white font-semibold py-3 rounded-xl transition-all ${
                                            updatingInvestment ? 'bg-gray-400 cursor-not-allowed' : 'bg-spark-500 hover:bg-spark-600'
                                        }`}
                                    >
                                        {updatingInvestment ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { api, setAuthToken } from '../services/api';
// import { auth, db } from '../services/firebase';
// import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { formatDate, getFullDate } from '../utils/dateUtils';
// import NotificationBell from '../components/NotificationBell';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// export default function AdminDashboard() {
//     const { user } = useAuth();
//     const [stats, setStats] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [admins, setAdmins] = useState([]);
//     const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
//     const [pendingStories, setPendingStories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [storiesLoading, setStoriesLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState('stats');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [approveRating, setApproveRating] = useState(5);
//     const [selectedStory, setSelectedStory] = useState(null);
//     const [showRatingModal, setShowRatingModal] = useState(false);
//     const [processingWithdrawal, setProcessingWithdrawal] = useState(null);
//     const [retryingWithdrawal, setRetryingWithdrawal] = useState(null);
    
//     const [flaggedDeposits, setFlaggedDeposits] = useState([]);
//     const [flaggedLoading, setFlaggedLoading] = useState(false);
//     const [showResolveModal, setShowResolveModal] = useState(false);
//     const [selectedFlagged, setSelectedFlagged] = useState(null);
//     const [resolveNote, setResolveNote] = useState('');
//     const [resolvingFlagged, setResolvingFlagged] = useState(false);
//     const [showReverseModal, setShowReverseModal] = useState(false);
//     const [reverseReason, setReverseReason] = useState('');
//     const [reversingFlagged, setReversingFlagged] = useState(false);

//     useEffect(() => {
//         if (user) {
//             loadAdminData();
//         }
//     }, [user]);

//     useEffect(() => {
//         if (activeTab === 'stories') {
//             loadPendingStories();
//         }
//         if (activeTab === 'flagged') {
//             loadFlaggedDeposits();
//         }
//     }, [activeTab]);

//     const loadAdminData = async () => {
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
            
//             const [statsRes, usersRes, withdrawalsRes, adminsRes] = await Promise.all([
//                 api.get('/admin/stats'),
//                 api.get('/admin/users'),
//                 api.get('/admin/withdrawals/pending'),
//                 api.get('/admin/admins')
//             ]);
            
//             setStats(statsRes.data);
//             setUsers(usersRes.data);
//             setPendingWithdrawals(withdrawalsRes.data);
//             setAdmins(adminsRes.data);
//         } catch (error) {
//             console.error('Failed to load admin data:', error);
//             toast.error('Failed to load admin data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadFlaggedDeposits = async () => {
//         setFlaggedLoading(true);
//         try {
//             const response = await api.get('/admin/flagged-deposits');
//             setFlaggedDeposits(response.data);
//         } catch (error) {
//             console.error('Failed to load flagged deposits:', error);
//             toast.error('Failed to load flagged deposits');
//         } finally {
//             setFlaggedLoading(false);
//         }
//     };

//     const resolveFlaggedDeposit = async (flaggedId, action) => {
//         setResolvingFlagged(true);
//         try {
//             await api.put(`/admin/flagged-deposits/${flaggedId}/resolve`, {
//                 status: action === 'approve' ? 'approved' : 'rejected',
//                 resolveNote: resolveNote
//             });
            
//             toast.success(`Flagged deposit ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
//             loadFlaggedDeposits();
//             setShowResolveModal(false);
//             setResolveNote('');
//             setSelectedFlagged(null);
//         } catch (error) {
//             console.error('Failed to resolve flagged deposit:', error);
//             toast.error(error.response?.data?.error || 'Failed to resolve flagged deposit');
//         } finally {
//             setResolvingFlagged(false);
//         }
//     };

//     const reverseDecision = async (flaggedId) => {
//         setReversingFlagged(true);
//         try {
//             await api.post(`/admin/flagged-deposits/${flaggedId}/reverse`, {
//                 reverseReason: reverseReason
//             });
            
//             toast.success('Decision reversed! Deposit is back for review.');
//             loadFlaggedDeposits();
//             setShowReverseModal(false);
//             setReverseReason('');
//             setSelectedFlagged(null);
//         } catch (error) {
//             console.error('Failed to reverse:', error);
//             toast.error(error.response?.data?.error || 'Failed to reverse decision');
//         } finally {
//             setReversingFlagged(false);
//         }
//     };

//     const loadPendingStories = async () => {
//         setStoriesLoading(true);
//         try {
//             const storiesRef = collection(db, 'successStories');
//             const q = query(storiesRef, where('status', '==', 'pending'));
//             const snapshot = await getDocs(q);
            
//             const stories = [];
//             snapshot.forEach(doc => {
//                 stories.push({ id: doc.id, ...doc.data() });
//             });
//             setPendingStories(stories);
//         } catch (error) {
//             console.error('Failed to load pending stories:', error);
//             toast.error('Failed to load pending stories');
//         } finally {
//             setStoriesLoading(false);
//         }
//     };

//     const getBadgeStyle = (badgeText) => {
//         const badges = {
//             'Platinum Saver': { color: 'bg-purple-100 text-purple-700', icon: '💎' },
//             'Gold Saver': { color: 'bg-yellow-100 text-yellow-700', icon: '🥇' },
//             'Silver Saver': { color: 'bg-gray-100 text-gray-700', icon: '🥈' },
//             'Bronze Saver': { color: 'bg-orange-100 text-orange-700', icon: '🥉' },
//             'Rising Star': { color: 'bg-blue-100 text-blue-700', icon: '⭐' },
//             'Verified Saver': { color: 'bg-green-100 text-green-700', icon: '✓' }
//         };
//         return badges[badgeText] || badges['Verified Saver'];
//     };

//     const renderStars = (rating) => {
//         const ratingValue = rating || 5;
//         return (
//             <div className="flex gap-0.5">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <span key={star} className={star <= ratingValue ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
//                         ★
//                     </span>
//                 ))}
//             </div>
//         );
//     };

//     const approveStory = async (storyId, rating) => {
//         try {
//             const updateData = {
//                 status: 'approved',
//                 approvedAt: new Date(),
//                 approvedBy: user.uid
//             };
            
//             if (rating) {
//                 updateData.rating = rating;
//             }
            
//             await updateDoc(doc(db, 'successStories', storyId), updateData);
//             toast.success('Story approved and published');
//             loadPendingStories();
//         } catch (error) {
//             console.error('Failed to approve story:', error);
//             toast.error('Failed to approve story');
//         }
//     };

//     const rejectStory = async (storyId) => {
//         if (!window.confirm('Reject this story? The user will need to resubmit.')) return;
        
//         try {
//             await updateDoc(doc(db, 'successStories', storyId), {
//                 status: 'rejected',
//                 rejectedAt: new Date(),
//                 rejectedBy: user.uid
//             });
//             toast.success('Story rejected');
//             loadPendingStories();
//         } catch (error) {
//             console.error('Failed to reject story:', error);
//             toast.error('Failed to reject story');
//         }
//     };

//     // ✅ FIXED: Approve withdrawal with better error handling
//     const approveWithdrawal = async (requestId) => {
//         setProcessingWithdrawal(requestId);
        
//         try {
//             const response = await api.post(`/admin/withdrawals/${requestId}/approve`);
//             toast.success('Withdrawal approved successfully!');
//             await loadAdminData();
//         } catch (error) {
//             const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message || 'Unknown error';
//             toast.error(`Failed: ${errorMessage}`);
//             console.error('Withdrawal approval failed:', {
//                 requestId,
//                 error: errorMessage,
//                 fullError: error
//             });
//             // ✅ Reload to show updated status (will show as 'failed')
//             await loadAdminData();
//         } finally {
//             setProcessingWithdrawal(null);
//         }
//     };

//     // ✅ NEW: Retry failed withdrawal
//     const retryWithdrawal = async (requestId) => {
//         setRetryingWithdrawal(requestId);
        
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/retry`);
//             toast.success('Withdrawal reset to pending for retry');
//             await loadAdminData();
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
//             toast.error(`Failed to retry: ${errorMessage}`);
//         } finally {
//             setRetryingWithdrawal(null);
//         }
//     };

//     const rejectWithdrawal = async (requestId) => {
//         try {
//             await api.post(`/admin/withdrawals/${requestId}/reject`);
//             toast.success('Withdrawal rejected');
//             loadAdminData();
//         } catch (error) {
//             console.error('Failed to reject:', error);
//             toast.error('Failed to reject');
//         }
//     };

//     const makeAdmin = async (userId, fullName) => {
//         if (!window.confirm(`Make ${fullName} an admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/make-admin/${userId}`);
//             toast.success(`${fullName} is now an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to make admin');
//         }
//     };

//     const removeAdmin = async (userId, fullName) => {
//         if (userId === user?.uid) {
//             toast.error('You cannot remove your own admin role');
//             return;
//         }
        
//         if (!window.confirm(`Remove ${fullName} from admin?`)) return;
        
//         try {
//             const idToken = await user.getIdToken();
//             setAuthToken(idToken);
//             await api.post(`/admin/remove-admin/${userId}`);
//             toast.success(`${fullName} is no longer an admin`);
//             loadAdminData();
//         } catch (error) {
//             toast.error('Failed to remove admin');
//         }
//     };

//     const isUserAdmin = (userId) => {
//         return admins.some(a => a.uid === userId);
//     };

//     const filteredUsers = users.filter(u => 
//         u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.phone?.includes(searchTerm)
//     );

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-96">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
//                     <p className="text-gray-500 mt-4">Loading dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//                         <p className="text-sm text-gray-500 mt-1">Manage platform operations and compliance</p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <NotificationBell />
//                         <Link to="/admin-management" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
//                             Manage Admins
//                         </Link>
//                     </div>
//                 </div>
                
//                 {/* Navigation Tabs */}
//                 <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
//                     {[
//                         { id: 'stats', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//                         { id: 'withdrawals', label: 'Withdrawals', count: pendingWithdrawals.filter(w => w.status === 'pending').length, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z' },
//                         { id: 'users', label: 'Customers', count: users.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//                         { id: 'stories', label: 'Stories', count: pendingStories.length, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
//                         { id: 'flagged', label: 'Flagged', count: flaggedDeposits.filter(f => f.status === 'review_needed' || !f.status).length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
//                     ].map(tab => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id)}
//                             className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
//                                 activeTab === tab.id 
//                                     ? 'bg-white text-spark-500 border-b-2 border-spark-500' 
//                                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                             }`}
//                         >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
//                             </svg>
//                             {tab.label}
//                             {tab.count > 0 && (
//                                 <span className={`px-2 py-0.5 rounded-full text-xs ${
//                                     activeTab === tab.id 
//                                         ? 'bg-spark-50 text-spark-600' 
//                                         : 'bg-gray-200 text-gray-700'
//                                 }`}>
//                                     {tab.count}
//                                 </span>
//                             )}
//                         </button>
//                     ))}
//                 </div>
                
//                 {/* ============ STATS / OVERVIEW TAB ============ */}
//                 {activeTab === 'stats' && stats && (
//                     <div className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Total Customers</p>
//                                         <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCustomers?.toLocaleString()}</p>
//                                     </div>
//                                     <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
//                                         <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Total Savings Pool</p>
//                                         <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.totalSavingsPool?.toLocaleString()}</p>
//                                     </div>
//                                     <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
//                                         <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Total Interest Paid</p>
//                                         <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.totalInterestPaid?.toLocaleString()}</p>
//                                     </div>
//                                     <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
//                                         <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-spark-500 to-spark-700">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-white/80 font-medium">Platform Earnings</p>
//                                         <p className="text-3xl font-bold text-white mt-1">₦{stats.platformEarnings?.toLocaleString()}</p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="font-semibold text-gray-900">Budget Utilization</h3>
//                                     <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
//                                         stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-100 text-red-700' : 'bg-spark-50 text-spark-600'
//                                     }`}>
//                                         {((stats.cumulativeInterestPaid / stats.budgetLimit) * 100).toFixed(1)}% Used
//                                     </span>
//                                 </div>
//                                 <div className="relative pt-1">
//                                     <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
//                                         <div 
//                                             style={{ width: `${Math.min((stats.cumulativeInterestPaid / stats.budgetLimit) * 100, 100)}%` }}
//                                             className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${
//                                                 stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-500' : 'bg-spark-500'
//                                             }`}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-between mt-3">
//                                     <span className="text-sm text-gray-600">Used: ₦{stats.cumulativeInterestPaid?.toLocaleString()}</span>
//                                     <span className="text-sm text-gray-600">Limit: ₦{stats.budgetLimit?.toLocaleString()}</span>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">System Mode</p>
//                                         <div className="flex items-center gap-2 mt-2">
//                                             <div className={`w-2 h-2 rounded-full ${stats.hybridMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
//                                             <p className={`text-lg font-semibold ${stats.hybridMode ? 'text-green-600' : 'text-gray-600'}`}>
//                                                 {stats.hybridMode ? 'Hybrid Mode Active' : 'Standard Mode'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className={`px-3 py-2 rounded-xl ${stats.stopTriggered ? 'bg-red-50' : 'bg-spark-50'}`}>
//                                         <p className={`text-sm font-medium ${stats.stopTriggered ? 'text-red-600' : 'text-spark-600'}`}>
//                                             {stats.stopTriggered ? '⚠️ Stop Triggered' : '✓ System Normal'}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* ============ WITHDRAWALS TAB ============ */}
//            {/* ============ WITHDRAWALS TAB - UPDATED ============ */}
//                 {activeTab === 'withdrawals' && (
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between mb-6">
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h2>
//                                 <p className="text-sm text-gray-500 mt-1">Review and process customer withdrawal requests</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <span className="px-3 py-1 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-600">
//                                     Pending: {pendingWithdrawals.filter(w => w.status === 'pending').length}
//                                 </span>
//                                 <span className="px-3 py-1 rounded-lg text-sm font-medium bg-red-50 text-red-600">
//                                     Failed: {pendingWithdrawals.filter(w => w.status === 'failed').length}
//                                 </span>
//                             </div>
//                         </div>
                        
//                         {pendingWithdrawals.length === 0 ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-1">No Withdrawals</h3>
//                                 <p className="text-gray-500">All withdrawal requests have been processed</p>
//                             </div>
//                         ) : (
//                             pendingWithdrawals.map(w => (
//                                 <div key={w.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
//                                     <div className="p-6">
//                                         <div className="flex items-start justify-between mb-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
//                                                     <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
//                                                     </svg>
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-semibold text-gray-900">{w.userName}</p>
//                                                     <p className="text-xs text-gray-500 mt-0.5">Request ID: {w.id}</p>
//                                                     {/* ✅ Status Badge */}
//                                                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
//                                                         w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                                         w.status === 'approved' ? 'bg-green-100 text-green-800' :
//                                                         w.status === 'failed' ? 'bg-red-100 text-red-800' :
//                                                         'bg-gray-100 text-gray-800'
//                                                     }`}>
//                                                         {w.status || 'pending'}
//                                                     </span>
//                                                     {w.error && (
//                                                         <p className="text-xs text-red-600 mt-1">Error: {w.error}</p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             {/* ✅ Action Buttons based on status */}
//                                             {w.status === 'pending' && (
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => approveWithdrawal(w.id)}
//                                                         disabled={processingWithdrawal === w.id}
//                                                         className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
//                                                     >
//                                                         {processingWithdrawal === w.id ? 'Processing...' : 'Approve'}
//                                                     </button>
//                                                     <button
//                                                         onClick={() => rejectWithdrawal(w.id)}
//                                                         className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all"
//                                                     >
//                                                         Reject
//                                                     </button>
//                                                 </div>
//                                             )}
//                                             {w.status === 'failed' && (
//                                                 <button
//                                                     onClick={() => retryWithdrawal(w.id)}
//                                                     disabled={retryingWithdrawal === w.id}
//                                                     className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
//                                                 >
//                                                     {retryingWithdrawal === w.id ? 'Retrying...' : '🔄 Retry'}
//                                                 </button>
//                                             )}
//                                             {w.status === 'approved' && (
//                                                 <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-xl">
//                                                     ✅ Approved
//                                                 </span>
//                                             )}
//                                             {w.status === 'rejected' && (
//                                                 <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-xl">
//                                                     ❌ Rejected
//                                                 </span>
//                                             )}
//                                         </div>
                                        
//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                             <div className="bg-gray-50 rounded-xl p-3">
//                                                 <p className="text-xs text-gray-500">Amount</p>
//                                                 <p className="text-lg font-bold text-gray-900">₦{w.amount.toLocaleString()}</p>
//                                             </div>
//                                             <div className="bg-gray-50 rounded-xl p-3">
//                                                 <p className="text-xs text-gray-500">Cycle / Day</p>
//                                                 <p className="text-lg font-bold text-gray-900">Cycle {w.cycle} • Day {w.requestDay}</p>
//                                             </div>
//                                             {w.userBankAccount && (
//                                                 <div className="bg-gray-50 rounded-xl p-3">
//                                                     <p className="text-xs text-gray-500">Bank Account</p>
//                                                     <p className="text-sm font-medium text-gray-900">{w.userBankAccount.bankName || 'Not set'}</p>
//                                                     <p className="text-xs text-gray-500 mt-0.5">{w.userBankAccount.accountNumber}</p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 )}
                
//                 {/* ============ USERS / CUSTOMERS TAB ============ */}
//                 {activeTab === 'users' && (
//                     <div className="space-y-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h2 className="text-lg font-semibold text-gray-900">Customer Management</h2>
//                                 <p className="text-sm text-gray-500 mt-1">View and manage customer accounts</p>
//                             </div>
//                             <div className="relative">
//                                 <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                                 <input
//                                     type="text"
//                                     placeholder="Search customers..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-80 focus:ring-2 focus:ring-spark-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>
                        
//                         {filteredUsers.length === 0 ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <p className="text-gray-500">No customers found</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 gap-4">
//                                 {filteredUsers.map(u => {
//                                     const isAdmin = isUserAdmin(u.id);
//                                     return (
//                                         <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
//                                             <div className="flex items-start justify-between">
//                                                 <div className="flex items-start gap-4">
//                                                     <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-spark-500 to-spark-700">
//                                                         {u.fullName?.charAt(0) || u.email?.charAt(0) || 'U'}
//                                                     </div>
//                                                     <div>
//                                                         <div className="flex items-center gap-2">
//                                                             <p className="font-semibold text-gray-900">{u.fullName}</p>
//                                                             {isAdmin && (
//                                                                 <span className="px-2 py-0.5 rounded-lg text-xs bg-spark-50 text-spark-600">Admin</span>
//                                                             )}
//                                                         </div>
//                                                         <p className="text-sm text-gray-500 mt-0.5">{u.email || u.phone}</p>
//                                                         <p className="text-xs text-gray-400 mt-1">User ID: {u.id}</p>
//                                                         <div className="flex items-center gap-4 mt-3">
//                                                             <span className="text-xs text-gray-500">Balance: ₦{u.currentBalance?.toLocaleString()}</span>
//                                                             <span className="text-xs text-gray-500">Cycle {u.currentCycle} • Day {u.currentDay}</span>
//                                                         </div>
//                                                         {u.bankName && (
//                                                             <p className="text-xs text-gray-400 mt-2">Bank: {u.bankName} ({u.accountNumber})</p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     {isAdmin ? (
//                                                         <button
//                                                             onClick={() => removeAdmin(u.id, u.fullName)}
//                                                             disabled={u.id === user?.uid}
//                                                             className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
//                                                         >
//                                                             Remove Admin
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             onClick={() => makeAdmin(u.id, u.fullName)}
//                                                             className="px-4 py-2 text-white text-sm font-medium rounded-xl transition-all bg-spark-500 hover:bg-spark-600"
//                                                         >
//                                                             Make Admin
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 )}
                
//                 {/* ============ STORIES TAB ============ */}
//                 {activeTab === 'stories' && (
//                     <div className="space-y-6">
//                         <div>
//                             <h2 className="text-lg font-semibold text-gray-900">Success Stories Review</h2>
//                             <p className="text-sm text-gray-500 mt-1">Review and publish customer success stories</p>
//                         </div>
                        
//                         {storiesLoading ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
//                                 <p className="text-gray-500 mt-4">Loading stories...</p>
//                             </div>
//                         ) : pendingStories.length === 0 ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Stories</h3>
//                                 <p className="text-gray-500">All stories have been reviewed</p>
//                             </div>
//                         ) : (
//                             pendingStories.map(story => {
//                                 const badgeStyle = getBadgeStyle(story.badgeText);
//                                 return (
//                                     <div key={story.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//                                         <div className="p-6">
//                                             <div className="flex items-start justify-between mb-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeStyle.color}`}>
//                                                         <span className="text-xl">{badgeStyle.icon}</span>
//                                                     </div>
//                                                     <div>
//                                                         <div className="flex items-center gap-2">
//                                                             <p className="font-semibold text-gray-900">{story.name}</p>
//                                                             <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${badgeStyle.color}`}>
//                                                                 {story.badgeText || 'Verified Saver'}
//                                                             </span>
//                                                         </div>
//                                                         <p className="text-xs text-gray-500 mt-0.5">Submitted: {formatDate(story.createdAt)}</p>
//                                                         <p className="text-xs text-gray-400 mt-0.5">Story ID: {story.id}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex gap-2">
//                                                     <button
//                                                         onClick={() => {
//                                                             setSelectedStory(story);
//                                                             setApproveRating(story.rating || 5);
//                                                             setShowRatingModal(true);
//                                                         }}
//                                                         className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all"
//                                                     >
//                                                         Approve & Publish
//                                                     </button>
//                                                     <button
//                                                         onClick={() => rejectStory(story.id)}
//                                                         className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-all"
//                                                     >
//                                                         Reject
//                                                     </button>
//                                                 </div>
//                                             </div>
                                            
//                                             <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                                                 <p className="text-gray-700 italic">"{story.story}"</p>
//                                             </div>
                                            
//                                             <div className="grid grid-cols-3 gap-4">
//                                                 <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                                     <p className="text-xs text-gray-500">Total Saved</p>
//                                                     <p className="text-lg font-bold text-gray-900">₦{story.saved?.toLocaleString()}</p>
//                                                 </div>
//                                                 <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                                     <p className="text-xs text-gray-500">Interest Earned</p>
//                                                     <p className="text-lg font-bold text-green-600">₦{story.interest?.toLocaleString()}</p>
//                                                 </div>
//                                                 <div className="text-center p-3 bg-gray-50 rounded-xl">
//                                                     <p className="text-xs text-gray-500">Final Balance</p>
//                                                     <p className="text-lg font-bold text-spark-500">₦{story.total?.toLocaleString()}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 )}
                
//                 {/* ============ FLAGGED DEPOSITS TAB ============ */}
//                 {activeTab === 'flagged' && (
//                     <div className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Pending Review</p>
//                                         <p className="text-3xl font-bold text-gray-900 mt-1">
//                                             {flaggedDeposits.filter(f => f.status === 'review_needed' || !f.status).length}
//                                         </p>
//                                     </div>
//                                     <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-spark-50">
//                                         <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Approved</p>
//                                         <p className="text-3xl font-bold text-green-600 mt-1">
//                                             {flaggedDeposits.filter(f => f.status === 'approved').length}
//                                         </p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                                         <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-gray-500 font-medium">Rejected</p>
//                                         <p className="text-3xl font-bold text-red-600 mt-1">
//                                             {flaggedDeposits.filter(f => f.status === 'rejected').length}
//                                         </p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                                         <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="rounded-2xl p-5 shadow-lg text-white bg-gradient-to-r from-spark-500 to-spark-700">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm text-white/80 font-medium">Total Flagged Value</p>
//                                         <p className="text-3xl font-bold text-white mt-1">
//                                             ₦{flaggedDeposits.reduce((sum, f) => sum + (f.actualAmount || 0), 0).toLocaleString()}
//                                         </p>
//                                     </div>
//                                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         {flaggedLoading ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
//                                 <p className="text-gray-500 mt-4">Loading transactions...</p>
//                             </div>
//                         ) : flaggedDeposits.length === 0 ? (
//                             <div className="bg-white rounded-2xl p-12 text-center">
//                                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear</h3>
//                                 <p className="text-gray-500">No flagged transactions require your attention</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {flaggedDeposits.map(flagged => (
//                                     <div key={flagged.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
//                                         <div className={`h-1 ${flagged.status === 'approved' ? 'bg-green-500' : flagged.status === 'rejected' ? 'bg-red-500' : 'bg-spark-500'}`} />
                                        
//                                         <div className="p-6">
//                                             <div className="flex items-start justify-between mb-6">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${flagged.status === 'approved' ? 'bg-green-50' : flagged.status === 'rejected' ? 'bg-red-50' : 'bg-spark-50'}`}>
//                                                         {flagged.status === 'approved' ? (
//                                                             <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                                             </svg>
//                                                         ) : flagged.status === 'rejected' ? (
//                                                             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                                             </svg>
//                                                         ) : (
//                                                             <svg className="w-6 h-6 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                                                             </svg>
//                                                         )}
//                                                     </div>
//                                                     <div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="font-mono text-sm font-semibold text-gray-900">Deposit ID: {flagged.id}</span>
//                                                             <span className={`px-2 py-1 rounded-lg text-xs font-medium ${flagged.status === 'approved' ? 'bg-green-50 text-green-700' : flagged.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-spark-50 text-spark-600'}`}>
//                                                                 {flagged.status === 'approved' ? 'Approved' : flagged.status === 'rejected' ? 'Rejected' : 'Pending Review'}
//                                                             </span>
//                                                         </div>
//                                                         <div className="flex flex-col gap-1 mt-1">
//                                                             <span className="text-xs text-gray-500">Customer ID: {flagged.userId}</span>
//                                                             <span className="text-xs text-gray-500">
//                                                                 Created: {flagged.createdAt?.toDate ? flagged.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : formatDate(flagged.createdAt)}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
                                                
//                                                 {flagged.status === 'review_needed' || !flagged.status ? (
//                                                     <button
//                                                         onClick={() => {
//                                                             setSelectedFlagged(flagged);
//                                                             setShowResolveModal(true);
//                                                         }}
//                                                         className="px-5 py-2 text-white text-sm font-medium rounded-xl transition-all duration-150 shadow-sm hover:shadow-md bg-spark-500 hover:bg-spark-600"
//                                                     >
//                                                         Review Transaction
//                                                     </button>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => {
//                                                             setSelectedFlagged(flagged);
//                                                             setShowReverseModal(true);
//                                                         }}
//                                                         className="px-5 py-2 border-2 border-gray-200 hover:border-spark-300 bg-white hover:bg-spark-50 text-gray-700 hover:text-spark-600 text-sm font-medium rounded-xl transition-all duration-150 flex items-center gap-2"
//                                                     >
//                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                                         </svg>
//                                                         Reverse
//                                                     </button>
//                                                 )}
//                                             </div>
                                            
//                                             <div className="grid grid-cols-2 gap-4 mb-6">
//                                                 <div className="bg-gray-50 rounded-xl p-4">
//                                                     <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Intended Amount</p>
//                                                     <p className="text-2xl font-bold text-gray-900">₦{flagged.intendedAmount?.toLocaleString()}</p>
//                                                 </div>
//                                                 <div className={`rounded-xl p-4 ${flagged.actualAmount !== flagged.intendedAmount ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'}`}>
//                                                     <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Actual Amount</p>
//                                                     <p className={`text-2xl font-bold ${flagged.actualAmount !== flagged.intendedAmount ? 'text-red-600' : 'text-gray-900'}`}>
//                                                         ₦{flagged.actualAmount?.toLocaleString()}
//                                                     </p>
//                                                     {flagged.actualAmount !== flagged.intendedAmount && (
//                                                         <p className="text-xs text-red-600 mt-2 font-medium">Discrepancy: ₦{Math.abs(flagged.actualAmount - flagged.intendedAmount).toLocaleString()}</p>
//                                                     )}
//                                                 </div>
//                                             </div>
                                            
//                                             {flagged.flwReference && (
//                                                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
//                                                     </svg>
//                                                     <div>
//                                                         <p className="text-xs text-gray-500">Flutterwave Reference</p>
//                                                         <p className="text-xs font-mono text-gray-700">{flagged.flwReference}</p>
//                                                     </div>
//                                                 </div>
//                                             )}
                                            
//                                             {flagged.resolveNote && (
//                                                 <div className="mt-4 p-4 rounded-xl border bg-spark-50 border-spark-200">
//                                                     <div className="flex items-start gap-3">
//                                                         <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-spark-500">
//                                                             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//                                                             </svg>
//                                                         </div>
//                                                         <div className="flex-1">
//                                                             <p className="text-xs font-semibold uppercase tracking-wider text-spark-600">Resolution Note</p>
//                                                             <p className="text-sm text-gray-700 mt-1">{flagged.resolveNote}</p>
//                                                             {flagged.resolvedBy && (
//                                                                 <p className="text-xs text-gray-400 mt-1">Resolved by: {flagged.resolvedBy}</p>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}
                
//                 {/* ============ MODALS ============ */}
                
//                 {/* Rating Approval Modal */}
//                 {showRatingModal && selectedStory && (
//                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
//                         setShowRatingModal(false);
//                         setSelectedStory(null);
//                     }}>
//                         <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
//                             <div className="p-6">
//                                 <h3 className="text-xl font-bold text-gray-900 mb-2">Rate Success Story</h3>
//                                 <p className="text-gray-500 mb-4">Set rating for {selectedStory.name}</p>
                                
//                                 <div className="flex justify-center gap-3 mb-6">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                         <button key={star} onClick={() => setApproveRating(star)} className="text-4xl focus:outline-none transition-transform hover:scale-110">
//                                             <span className={star <= approveRating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
//                                         </button>
//                                     ))}
//                                 </div>
                                
//                                 <div className="flex gap-3">
//                                     <button onClick={() => { approveStory(selectedStory.id, approveRating); setShowRatingModal(false); setSelectedStory(null); }} className="flex-1 text-white font-semibold py-3 rounded-xl transition-all bg-spark-500 hover:bg-spark-600">
//                                         Publish Story
//                                     </button>
//                                     <button onClick={() => { setShowRatingModal(false); setSelectedStory(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all">
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Resolve Flagged Deposit Modal */}
//                 {showResolveModal && selectedFlagged && (
//                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
//                         setShowResolveModal(false);
//                         setSelectedFlagged(null);
//                         setResolveNote('');
//                     }}>
//                         <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
//                             <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
//                                             <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                             </svg>
//                                         </div>
//                                         <div>
//                                             <h3 className="text-xl font-bold text-gray-900">Review Transaction</h3>
//                                             <p className="text-sm text-gray-500 mt-0.5">Verify and process flagged deposit</p>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => { setShowResolveModal(false); setSelectedFlagged(null); setResolveNote(''); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
//                                         <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
                            
//                             <div className="p-6 space-y-6">
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div className="bg-gray-50 rounded-xl p-5">
//                                         <p className="text-sm text-gray-500 mb-2">Intended Amount</p>
//                                         <p className="text-3xl font-bold text-gray-900">₦{selectedFlagged.intendedAmount?.toLocaleString()}</p>
//                                     </div>
//                                     <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
//                                         <p className="text-sm text-gray-500 mb-2">Actual Amount</p>
//                                         <p className="text-3xl font-bold text-red-600">₦{selectedFlagged.actualAmount?.toLocaleString()}</p>
//                                         <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
//                                             <span className="text-xs font-medium text-red-700">Discrepancy: ₦{Math.abs(selectedFlagged.actualAmount - selectedFlagged.intendedAmount).toLocaleString()}</span>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="bg-gray-50 rounded-xl p-5 space-y-3">
//                                     <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
//                                         <span className="text-sm text-gray-500">Transaction Reference</span>
//                                         <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.flwReference || 'N/A'}</span>
//                                     </div>
//                                     <div className="flex flex-col gap-1">
//                                         <span className="text-sm text-gray-500">Customer ID</span>
//                                         <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.userId}</span>
//                                     </div>
//                                     <div className="flex flex-col gap-1">
//                                         <span className="text-sm text-gray-500">Deposit ID</span>
//                                         <span className="text-sm font-mono text-gray-900 break-all">{selectedFlagged.id}</span>
//                                     </div>
//                                 </div>
                                
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         Resolution Note <span className="text-red-500">*</span>
//                                     </label>
//                                     <textarea value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition-all resize-none" rows="4" placeholder="Provide detailed reason for this decision (required for audit compliance)..." />
//                                     <p className="text-xs text-gray-400 mt-2">This note will be permanently recorded for audit purposes</p>
//                                 </div>
                                
//                                 <div className="flex gap-3 pt-4">
//                                     <button onClick={() => resolveFlaggedDeposit(selectedFlagged.id, 'approve')} disabled={resolvingFlagged || !resolveNote} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
//                                         {resolvingFlagged ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span>) : '✓ Approve Transaction'}
//                                     </button>
//                                     <button onClick={() => resolveFlaggedDeposit(selectedFlagged.id, 'reject')} disabled={resolvingFlagged || !resolveNote} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
//                                         {resolvingFlagged ? 'Processing...' : '✗ Reject Transaction'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Reverse Decision Modal */}
//                 {showReverseModal && selectedFlagged && (
//                     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
//                         setShowReverseModal(false);
//                         setSelectedFlagged(null);
//                         setReverseReason('');
//                     }}>
//                         <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
//                             <div className="p-6">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-spark-50">
//                                         <svg className="w-5 h-5 text-spark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-900">Reverse Decision</h3>
//                                 </div>
                                
//                                 <div className="mb-4 p-4 bg-gray-50 rounded-xl">
//                                     <p className="text-sm text-gray-600">Deposit ID: <span className="font-mono text-xs break-all">{selectedFlagged.id}</span></p>
//                                     <p className="text-sm text-gray-600 mt-2">Current Status: <span className="font-bold">{selectedFlagged.status}</span></p>
//                                     <p className="text-sm text-gray-600 mt-2">This will undo the {selectedFlagged.status} and put the deposit back for review.</p>
//                                     {selectedFlagged.status === 'approved' && (
//                                         <p className="text-sm text-red-600 mt-3 font-medium">⚠️ This will deduct ₦{selectedFlagged.actualAmount?.toLocaleString()} from the user's balance.</p>
//                                     )}
//                                 </div>
                                
//                                 <div className="mb-6">
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Reversal</label>
//                                     <textarea value={reverseReason} onChange={(e) => setReverseReason(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition-all resize-none" rows="3" placeholder="Why are you reversing this decision?" required />
//                                 </div>
                                
//                                 <div className="flex gap-3">
//                                     <button onClick={() => reverseDecision(selectedFlagged.id)} disabled={reversingFlagged || !reverseReason} className="flex-1 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 bg-spark-500 hover:bg-spark-600">
//                                         {reversingFlagged ? 'Processing...' : 'Yes, Reverse Decision'}
//                                     </button>
//                                     <button onClick={() => { setShowReverseModal(false); setSelectedFlagged(null); setReverseReason(''); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all">
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }