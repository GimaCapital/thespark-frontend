import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
import { formatDate, getFullDate } from '../utils/dateUtils';  // ✅ Import date utilities

export default function AdminManagement() {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('admins');
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const [adminsRes, usersRes] = await Promise.all([
                api.get('/admin/admins'),
                api.get('/admin/users')
            ]);
            
            setAdmins(adminsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };
    
    const makeAdmin = async (userId, fullName) => {
        if (!window.confirm(`Make ${fullName} an admin?`)) return;
        
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post(`/admin/make-admin/${userId}`);
            toast.success(`${fullName} is now an admin`);
            loadData();
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
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.post(`/admin/remove-admin/${userId}`);
            toast.success(`${fullName} is no longer an admin`);
            loadData();
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };
    
    const filteredUsers = users.filter(u => 
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );
    
    const filteredAdmins = admins.filter(a => 
        a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (loading) {
        return (
            <div className="flex-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="container">
            <h1 className="heading-1 text-center spacer-lg">Admin Management</h1>
            
            <div className="grid-2 spacer-lg">
                <button
                    onClick={() => setActiveTab('admins')}
                    className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    Current Admins ({admins.length})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    All Users ({users.length})
                </button>
            </div>
            
            <div className="card">
                <div className="spacer-md">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input"
                    />
                </div>
                
                {activeTab === 'admins' && (
                    <div>
                        <h3 className="heading-3 spacer-md">Current Administrators</h3>
                        {filteredAdmins.length === 0 ? (
                            <p className="text-body text-center">No admins found</p>
                        ) : (
                            filteredAdmins.map(admin => (
                                <div key={admin.uid} className="transaction-item">
                                    <div>
                                        <p className="font-semibold">{admin.fullName}</p>
                                        <p className="text-small">{admin.email || admin.phone}</p>
                                        <p className="text-small text-spark-500">
                                            Admin since: {formatDate(admin.createdAt)}  {/* ✅ Updated */}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeAdmin(admin.uid, admin.fullName)}
                                        disabled={admin.uid === user?.uid}
                                        className={`btn btn-danger btn-sm ${admin.uid === user?.uid ? 'btn-disabled' : ''}`}
                                    >
                                        Remove Admin
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {activeTab === 'users' && (
                    <div>
                        <h3 className="heading-3 spacer-md">All Users</h3>
                        {filteredUsers.length === 0 ? (
                            <p className="text-body text-center">No users found</p>
                        ) : (
                            filteredUsers.map(user => {
                                const isAdminUser = admins.some(a => a.uid === user.id);
                                return (
                                    <div key={user.id} className="transaction-item">
                                        <div>
                                            <p className="font-semibold">{user.fullName}</p>
                                            <p className="text-small">{user.email || user.phone}</p>
                                            <p className="text-small">
                                                Balance: ₦{user.currentBalance?.toLocaleString()} | 
                                                Cycle {user.currentCycle}, Day {user.currentDay}
                                            </p>
                                        </div>
                                        <div>
                                            {isAdminUser ? (
                                                <button
                                                    onClick={() => removeAdmin(user.id, user.fullName)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Remove Admin
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => makeAdmin(user.id, user.fullName)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}