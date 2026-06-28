// src/components/Admin/EmailTracking.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';  // ✅ Import api
import toast from 'react-hot-toast';

export default function EmailTracking() {
    const { user, userData } = useAuth();
    const [emailLogs, setEmailLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        if (userData?.role === 'admin') {
            fetchEmailLogs();
            fetchUsers();
        }
    }, [userData]);

    const fetchEmailLogs = async () => {
        setLoading(true);
        try {
            const token = await user.getIdToken();
            setAuthToken(token);  // ✅ Set auth token for axios
            
            const response = await api.get('/users/email-logs');  // ✅ Use api instance
            setEmailLogs(response.data || []);
        } catch (error) {
            console.error('Error fetching email logs:', error);
            setEmailLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = await user.getIdToken();
            setAuthToken(token);  // ✅ Set auth token for axios
            
            const response = await api.get('/users/admin/users');  // ✅ Use api instance
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const checkUserEmailStatus = async (userId) => {
        if (!userId) {
            toast.error('Please select a user');
            return;
        }
        
        setLoading(true);
        try {
            const token = await user.getIdToken();
            setAuthToken(token);  // ✅ Set auth token for axios
            
            const response = await api.get(`/users/user-email-status/${userId}`);  // ✅ Use api instance
            
            const data = response.data;
            toast.success(
                `Email status for ${data.fullName}:\n` +
                `Email: ${data.email}\n` +
                `Sent: ${data.welcomeEmailSent ? '✅ Yes' : '❌ No'}\n` +
                `Sent At: ${data.welcomeEmailSentAt || 'Never'}\n` +
                `Attempts: ${data.welcomeEmailAttempts || 0}`
            );
        } catch (error) {
            console.error('Error checking email status:', error);
            toast.error('Failed to check email status');
        } finally {
            setLoading(false);
        }
    };

    const resendWelcomeEmail = async (userId) => {
        if (!userId) {
            toast.error('Please select a user');
            return;
        }
        
        if (!window.confirm('Are you sure you want to resend the welcome email?')) {
            return;
        }
        
        setLoading(true);
        try {
            const token = await user.getIdToken();
            setAuthToken(token);  // ✅ Set auth token for axios
            
            const response = await api.post('/users/resend-welcome-email', { userId });  // ✅ Use api instance
            
            if (response.data.success) {
                toast.success('Welcome email resent successfully!');
                fetchEmailLogs();
            } else {
                toast.error(response.data.message || 'Failed to resend email');
            }
        } catch (error) {
            console.error('Error resending email:', error);
            toast.error('Failed to resend email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">📧 Email Tracking</h2>
            
            {/* Email Status Checker */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Check User Email Status</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select User
                        </label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                        >
                            <option value="">Select a user...</option>
                            {users.map((user) => (
                                <option key={user.userId || user.id} value={user.userId || user.id}>
                                    {user.fullName} - {user.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => checkUserEmailStatus(selectedUserId)}
                        disabled={loading || !selectedUserId}
                        className="px-6 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Check Status
                    </button>
                    <button
                        onClick={() => resendWelcomeEmail(selectedUserId)}
                        disabled={loading || !selectedUserId}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Resend Email
                    </button>
                </div>
            </div>
            
            {/* Email Logs Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Email Logs</h3>
                </div>
                
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading logs...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {emailLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No email logs found
                                        </td>
                                    </tr>
                                ) : (
                                    emailLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{log.userId?.slice(0, 8)}...</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{log.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    log.type === 'welcome' ? 'bg-blue-100 text-blue-700' :
                                                    log.type === 'welcome_resend' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {log.type || 'welcome'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    log.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {log.success ? '✅ Sent' : '❌ Failed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{log.attempts || 0}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[100px]">
                                                {log.messageId || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}