import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, setAuthToken } from '../services/api';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { formatDate, getFullDate } from '../utils/dateUtils';
import { computeDiscount as computePlanDiscount } from '../utils/planLimits';
import NotificationBell from '../components/NotificationBell';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import EmailTracking from '../components/Admin/EmailTracking';
import AdminProducts from '../components/Admin/AdminProducts';
import AdminStockPhone from '../components/Admin/AdminStockPhone';
import AgentDashboard from '../components/Admin/AgentDashboard';
import { Modal, Button, Descriptions, Alert, Tag } from 'antd';
import {
    LayoutDashboard,
    Banknote,
    Users,
    BookOpen,
    AlertTriangle,
    Wallet,
    Tag as TagIcon, 
    Mail,
    ShoppingCart,
    Image as ImageIcon,
    Headphones,
} from 'lucide-react';


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

    // ✅ NEW: delete withdrawal modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteMode, setDeleteMode] = useState('confirm');

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

    // ✅ NEW: track rejected deposits and orphan payments
    const [rejectedDeposits, setRejectedDeposits] = useState([]);
    const [orphanPayments, setOrphanPayments] = useState([]);
    const [failedPaymentsLoading, setFailedPaymentsLoading] = useState(false);

    // ✅ NEW: Flutterwave merchant balance
    const [flwBalance, setFlwBalance] = useState(null);
    const [flwBalanceLoading, setFlwBalanceLoading] = useState(false);
    const [flwBalanceError, setFlwBalanceError] = useState(null);

    // ✅ NEW: Withdrawal settings
    const [minWithdrawalAmount, setMinWithdrawalAmount] = useState('');
    const [autoApproveThreshold, setAutoApproveThreshold] = useState('');
    const [withdrawalSettingsLoading, setWithdrawalSettingsLoading] = useState(false);
    const [withdrawalSettingsSaving, setWithdrawalSettingsSaving] = useState(false);

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

    // ============ PLAN CONFIGS ============
    const [planConfigs, setPlanConfigs] = useState([]);
    const [plansOriginal, setPlansOriginal] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [plansSaving, setPlansSaving] = useState({});  // { Basic: true, Premium: false, ... }
    const [plansSeeding, setPlansSeeding] = useState(false);

    // ============ EMAIL SENDING ============
    const [sendingEmail, setSendingEmail] = useState(false);

    // ============ ✅ NEW: CONFIRM MODALS (replace window.confirm) ============

    // 1) Welcome email (single)
    const [showWelcomeEmailModal, setShowWelcomeEmailModal] = useState(false);
    const [welcomeEmailUserId, setWelcomeEmailUserId] = useState(null);
    const [welcomeEmailSending, setWelcomeEmailSending] = useState(false);

    // 2) Welcome emails (bulk)
    const [showBulkWelcomeModal, setShowBulkWelcomeModal] = useState(false);
    const [bulkWelcomeSending, setBulkWelcomeSending] = useState(false);

    // 3) Reject story
    const [showRejectStoryModal, setShowRejectStoryModal] = useState(false);
    const [rejectStoryTarget, setRejectStoryTarget] = useState(null);
    const [rejectStoryProcessing, setRejectStoryProcessing] = useState(false);

    // 4) Admin action (make / remove admin)
    const [showAdminActionModal, setShowAdminActionModal] = useState(false);
    const [adminActionType, setAdminActionType] = useState('make'); // 'make' | 'remove'
    const [adminActionTarget, setAdminActionTarget] = useState(null); // { userId, fullName }
    const [adminActionProcessing, setAdminActionProcessing] = useState(false);

    // 5) Send investor email
    const [showSendInvestorEmailModal, setShowSendInvestorEmailModal] = useState(false);
    const [sendInvestorEmailTarget, setSendInvestorEmailTarget] = useState(null);

    // 6) Seed plans
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [seedResult, setSeedResult] = useState(null);

    useEffect(() => {
        if (user) {
            loadAdminData();
            loadFlutterwaveBalance();
            loadWithdrawalSettings();
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'stories') {
            loadPendingStories();
        }
        if (activeTab === 'flagged') {
            loadFlaggedDeposits();
            loadFailedPayments();
        }
        if (activeTab === 'investment') {
            loadInvestmentInterests();
            loadAccessCodes();
            loadInvestmentStats();
        }
        // ✅ NEW
        if (activeTab === 'plans') {
            loadPlanConfigs();
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
            // console.error('Failed to load admin data:', error);
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
            // console.error('Failed to load flagged deposits:', error);
            toast.error('Failed to load flagged deposits');
        } finally {
            setFlaggedLoading(false);
        }
    };

    // ✅ NEW: load rejected deposits + orphan payments in one call
    const loadFailedPayments = async () => {
        setFailedPaymentsLoading(true);
        try {
            const response = await api.get('/admin/failed-payments');
            setRejectedDeposits(response.data.rejected || []);
            setOrphanPayments(response.data.orphan || []);
        } catch (error) {
            console.error('Failed to load failed payments:', error);
            // Non-fatal — user still sees flagged deposits
        } finally {
            setFailedPaymentsLoading(false);
        }
    };

    // ✅ NEW: Fetch Flutterwave merchant balance + pending liability
    const loadFlutterwaveBalance = async () => {
        setFlwBalanceLoading(true);
        setFlwBalanceError(null);
        try {
            const response = await api.get('/admin/flutterwave-balance');
            setFlwBalance(response.data);
        } catch (error) {
            console.error('Failed to load Flutterwave balance:', error);
            setFlwBalanceError(
                error.response?.data?.error || 'Failed to fetch Flutterwave balance'
            );
        } finally {
            setFlwBalanceLoading(false);
        }
    };

    // ✅ NEW: Load withdrawal settings
    const loadWithdrawalSettings = async () => {
        setWithdrawalSettingsLoading(true);
        try {
            const response = await api.get('/admin/withdrawal-settings');
            const { minWithdrawalAmount, autoApproveThreshold } = response.data;
            setMinWithdrawalAmount(minWithdrawalAmount === null ? '' : String(minWithdrawalAmount));
            setAutoApproveThreshold(autoApproveThreshold === null ? '' : String(autoApproveThreshold));
        } catch (error) {
            console.error('Failed to load withdrawal settings:', error);
        } finally {
            setWithdrawalSettingsLoading(false);
        }
    };

    // ✅ NEW: Save withdrawal settings
    const saveWithdrawalSettings = async () => {
        setWithdrawalSettingsSaving(true);
        try {
            const payload = {
                minWithdrawalAmount: minWithdrawalAmount === '' ? null : Number(minWithdrawalAmount),
                autoApproveThreshold: autoApproveThreshold === '' ? null : Number(autoApproveThreshold),
            };

            const response = await api.put('/admin/withdrawal-settings', payload);
            const { minWithdrawalAmount: newMin, autoApproveThreshold: newThreshold } = response.data;

            setMinWithdrawalAmount(newMin === null ? '' : String(newMin));
            setAutoApproveThreshold(newThreshold === null ? '' : String(newThreshold));

            toast.success('Withdrawal settings saved');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save settings');
        } finally {
            setWithdrawalSettingsSaving(false);
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
            // console.error('Failed to resolve flagged deposit:', error);
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
            // console.error('Failed to reverse:', error);
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
            // console.error('Failed to load pending stories:', error);
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
            // console.error('Failed to approve story:', error);
            toast.error('Failed to approve story');
        }
    };

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestRejectStory = (story) => {
        setRejectStoryTarget(story);
        setShowRejectStoryModal(true);
    };

    const confirmRejectStory = async () => {
        if (!rejectStoryTarget) return;
        setRejectStoryProcessing(true);
        try {
            await updateDoc(doc(db, 'successStories', rejectStoryTarget.id), {
                status: 'rejected',
                rejectedAt: new Date(),
                rejectedBy: user.uid
            });
            toast.success('Story rejected');
            loadPendingStories();
            setShowRejectStoryModal(false);
            setRejectStoryTarget(null);
        } catch (error) {
            // console.error('Failed to reject story:', error);
            toast.error('Failed to reject story');
        } finally {
            setRejectStoryProcessing(false);
        }
    };

    const cancelRejectStory = () => {
        if (rejectStoryProcessing) return;
        setShowRejectStoryModal(false);
        setRejectStoryTarget(null);
    };

    // ============ EMAIL FUNCTIONS ============

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestSendSingleWelcomeEmail = (userId) => {
        if (!userId) {
            toast.error('No user selected');
            return;
        }
        setWelcomeEmailUserId(userId);
        setShowWelcomeEmailModal(true);
    };

    const confirmSendSingleWelcomeEmail = async () => {
        if (!welcomeEmailUserId) return;
        setWelcomeEmailSending(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);

            const response = await api.post('/users/resend-welcome-email', { userId: welcomeEmailUserId });

            if (response.data.success) {
                toast.success('✅ Welcome email sent successfully!');
                loadAdminData(); // Refresh user list
                setShowWelcomeEmailModal(false);
                setWelcomeEmailUserId(null);
            } else {
                toast.error(response.data.message || 'Failed to send email');
            }
        } catch (error) {
            // console.error('Error sending email:', error);
            toast.error(error.response?.data?.error || 'Failed to send email');
        } finally {
            setWelcomeEmailSending(false);
        }
    };

    const cancelSendSingleWelcomeEmail = () => {
        if (welcomeEmailSending) return;
        setShowWelcomeEmailModal(false);
        setWelcomeEmailUserId(null);
    };

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestSendBulkWelcomeEmails = () => {
        setShowBulkWelcomeModal(true);
    };

    const confirmSendBulkWelcomeEmails = async () => {
        setBulkWelcomeSending(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);

            const response = await api.post('/users/send-bulk-welcome-emails');

            if (response.data.success) {
                toast.success(`✅ ${response.data.sentCount} welcome emails sent! ${response.data.failedCount || 0} failed.`);
                loadAdminData(); // Refresh user list
                setShowBulkWelcomeModal(false);
            } else {
                toast.error(response.data.message || 'Failed to send bulk emails');
            }
        } catch (error) {
            // console.error('Error sending bulk emails:', error);
            toast.error(error.response?.data?.error || 'Failed to send bulk emails');
        } finally {
            setBulkWelcomeSending(false);
        }
    };

    const cancelSendBulkWelcomeEmails = () => {
        if (bulkWelcomeSending) return;
        setShowBulkWelcomeModal(false);
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
            // console.error('Withdrawal approval failed:', {
            //     requestId,
            //     error: errorMessage,
            //     fullError: error
            // });
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
            // console.error('Failed to reject:', error);
            toast.error('Failed to reject');
        }
    };

    // Opens the delete modal. Decides mode based on the row data.
    const openDeleteModal = (withdrawal) => {
        const isBlocked = withdrawal.status === 'failed' && withdrawal.debitedAt != null && withdrawal.refunded !== true;
        setDeleteTarget(withdrawal);
        setDeleteMode(isBlocked ? 'blocked' : 'confirm');
        setShowDeleteModal(true);
    };

    // Called from the modal's Delete button
    const confirmDeleteWithdrawal = async () => {
        if (!deleteTarget) return;
        const requestId = deleteTarget.id;

        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            await api.delete(`/admin/withdrawals/${requestId}`);
            toast.success('Deleted successfully');
            setShowDeleteModal(false);
            setDeleteTarget(null);
            loadAdminData();
        } catch (error) {
            const backendError = error.response?.data?.error;

            if (backendError && backendError.includes('never refunded')) {
                // Backend blocked it — switch modal to blocked mode
                setDeleteMode('blocked');
            } else if (backendError) {
                toast.error(backendError, { duration: 6000 });
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    // ============ ADMIN MANAGEMENT FUNCTIONS ============

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestMakeAdmin = (userId, fullName) => {
        setAdminActionType('make');
        setAdminActionTarget({ userId, fullName });
        setShowAdminActionModal(true);
    };

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestRemoveAdmin = (userId, fullName) => {
        if (userId === user?.uid) {
            toast.error('You cannot remove your own admin role');
            return;
        }
        setAdminActionType('remove');
        setAdminActionTarget({ userId, fullName });
        setShowAdminActionModal(true);
    };

    const confirmAdminAction = async () => {
        if (!adminActionTarget) return;
        setAdminActionProcessing(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);

            if (adminActionType === 'make') {
                await api.post(`/admin/make-admin/${adminActionTarget.userId}`);
                toast.success(`${adminActionTarget.fullName} is now an admin`);
            } else {
                await api.post(`/admin/remove-admin/${adminActionTarget.userId}`);
                toast.success(`${adminActionTarget.fullName} is no longer an admin`);
            }

            loadAdminData();
            setShowAdminActionModal(false);
            setAdminActionTarget(null);
        } catch (error) {
            toast.error(`Failed to ${adminActionType === 'make' ? 'make admin' : 'remove admin'}`);
        } finally {
            setAdminActionProcessing(false);
        }
    };

    const cancelAdminAction = () => {
        if (adminActionProcessing) return;
        setShowAdminActionModal(false);
        setAdminActionTarget(null);
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
            // console.error('Failed to load investment interests:', error);
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
            // console.error('Failed to load investment stats:', error);
        }
    };

    const loadAccessCodes = async () => {
        setAccessCodesLoading(true);
        try {
            const response = await api.get('/investment/access-codes');
            setAccessCodes(response.data);
        } catch (error) {
            // console.error('Failed to load access codes:', error);
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
            // console.error('Failed to generate codes:', error);
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
            // console.error('Failed to update status:', error);
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

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestSendInvestorEmail = (interest) => {
        if (!interest.email) {
            toast.error('No email address found for this investor');
            return;
        }
        setSendInvestorEmailTarget(interest);
        setShowSendInvestorEmailModal(true);
    };

    const confirmSendInvestorEmail = async () => {
        if (!sendInvestorEmailTarget) return;
        const interest = sendInvestorEmailTarget;

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
                setShowSendInvestorEmailModal(false);
                setSendInvestorEmailTarget(null);
            }
        } catch (error) {
            // console.error('Error sending email:', error);
            toast.error(error.response?.data?.error || 'Failed to send email');
        } finally {
            setSendingEmail(false);
        }
    };

    const cancelSendInvestorEmail = () => {
        if (sendingEmail) return;
        setShowSendInvestorEmailModal(false);
        setSendInvestorEmailTarget(null);
    };

    // ============ PLAN CONFIG FUNCTIONS ============
    const loadPlanConfigs = async () => {
        setPlansLoading(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/admin/plans');
            setPlanConfigs(response.data);
            // ✅ Save a pristine snapshot for dirty-check
            setPlansOriginal(JSON.parse(JSON.stringify(response.data)));
        } catch (error) {
            console.error('Failed to load plan configs:', error);
            toast.error('Failed to load plan configs');
        } finally {
            setPlansLoading(false);
        }
    };

    const updatePlanField = (planName, field, value) => {
        setPlanConfigs(prev =>
            prev.map(p => (p.name === planName ? { ...p, [field]: value } : p))
        );
    };

    // ✅ NEW: returns true if any field differs from the pristine snapshot
    const isPlanDirty = (plan) => {
        const original = plansOriginal.find(p => p.name === plan.name);
        if (!original) return true; // if we have no baseline, assume dirty

        // Fields we care about (exclude transient UI fields like __targetDiscount)
        const fields = ['min', 'max', 'monthlyFee', 'yearlyFee', 'interestRate', 'dailySaveMax', 'icon', 'bestFor'];

        for (const f of fields) {
            const a = plan[f];
            const b = original[f];

            // Normalize numbers — "" vs 0 vs undefined should be treated the same
            const na = f === 'icon' || f === 'bestFor' ? String(a ?? '') : Number(a ?? 0);
            const nb = f === 'icon' || f === 'bestFor' ? String(b ?? '') : Number(b ?? 0);

            if (na !== nb) return true;
        }

        // Compare features array
        const aFeat = JSON.stringify(plan.features || []);
        const bFeat = JSON.stringify(original.features || []);
        if (aFeat !== bFeat) return true;

        return false;
    };

    const savePlanConfig = async (plan) => {
        setPlansSaving(s => ({ ...s, [plan.name]: true }));
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);

            const payload = {
                min: Number(plan.min) || 0,
                max: Number(plan.max) || 0,
                monthlyFee: Number(plan.monthlyFee) || 0,
                yearlyFee: Number(plan.yearlyFee) || 0,
                interestRate: Number(plan.interestRate) || 0,
                dailySaveMax: Number(plan.dailySaveMax) || 0,
                icon: plan.icon || '',
                bestFor: plan.bestFor || '',
                features: Array.isArray(plan.features) ? plan.features : [],
            };

            const response = await api.put(`/admin/plans/${plan.name}`, payload);
            toast.success(response.data.message || `${plan.name} plan saved ✅`);

            // ✅ Update BOTH the current state and the pristine snapshot
            // using the NORMALIZED values we just sent (not the raw form values)
            const normalized = {
                ...plan,
                min: Number(plan.min) || 0,
                max: Number(plan.max) || 0,
                monthlyFee: Number(plan.monthlyFee) || 0,
                yearlyFee: Number(plan.yearlyFee) || 0,
                interestRate: Number(plan.interestRate) || 0,
                dailySaveMax: Number(plan.dailySaveMax) || 0,
                icon: plan.icon || '',
                bestFor: plan.bestFor || '',
                features: Array.isArray(plan.features) ? plan.features : [],
            };
            delete normalized.__targetDiscount;

            // 1. Normalize the live plan so its fields match what the server stored
            setPlanConfigs(prev =>
                prev.map(p => (p.name === plan.name ? { ...normalized } : p))
            );

            // 2. Update the pristine snapshot for this plan
            setPlansOriginal(prev => {
                const next = JSON.parse(JSON.stringify(prev));
                const idx = next.findIndex(p => p.name === plan.name);
                if (idx !== -1) {
                    next[idx] = JSON.parse(JSON.stringify(normalized));
                } else {
                    next.push(JSON.parse(JSON.stringify(normalized)));
                }
                return next;
            });
        } catch (error) {
            console.error('Save plan error:', error);
            toast.error(error.response?.data?.error || 'Failed to save plan');
        } finally {
            setPlansSaving(s => ({ ...s, [plan.name]: false }));
        }
    };

    // ✅ CHANGED: now opens an Ant modal instead of window.confirm
    const requestSeedPlanConfigs = () => {
        setSeedResult(null);
        setShowSeedModal(true);
    };

    const confirmSeedPlanConfigs = async () => {
        setPlansSeeding(true);
        try {
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.post('/admin/plans/seed');
            const results = response.data.results || {};
            setSeedResult(results);
            toast.success('Plans seeded successfully');
            await loadPlanConfigs();
            // Keep modal open briefly to show the summary, then close
            setTimeout(() => {
                setShowSeedModal(false);
                setSeedResult(null);
            }, 1800);
        } catch (error) {
            console.error('Seed error:', error);
            toast.error(error.response?.data?.error || 'Failed to seed plans');
            setShowSeedModal(false);
        } finally {
            setPlansSeeding(false);
        }
    };

    const cancelSeedPlanConfigs = () => {
        if (plansSeeding) return;
        setShowSeedModal(false);
        setSeedResult(null);
    };

    // ✅ NEW: Apply a target discount % by auto-computing the yearly fee
    const applyTargetDiscount = (planName) => {
        const plan = planConfigs.find(p => p.name === planName);
        if (!plan) return;

        const target = Number(plan.__targetDiscount);
        const monthly = Number(plan.monthlyFee) || 0;

        if (!target || monthly <= 0) return;

        const fullYear = monthly * 12;
        const clamped = Math.max(0, Math.min(99, target));
        const rawYearly = fullYear * (1 - clamped / 100);
        // Round to nearest ₦100 to keep numbers clean
        const rounded = Math.round(rawYearly / 100) * 100;

        updatePlanField(planName, 'yearlyFee', rounded);
        updatePlanField(planName, '__targetDiscount', '');
    };

    const updatePlanFeaturesFromText = (planName, text) => {
        const features = text.split('\n').map(l => l.trim()).filter(Boolean);
        updatePlanField(planName, 'features', features);
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
                        { id: 'stats', label: 'Overview', Icon: LayoutDashboard },
                        { id: 'withdrawals', label: 'Withdrawals', count: pendingWithdrawals.filter(w => w.status === 'pending').length, Icon: Banknote },
                        { id: 'users', label: 'Customers', count: users.length, Icon: Users },
                        { id: 'stories', label: 'Stories', count: pendingStories.length, Icon: BookOpen },
                        { id: 'flagged', label: 'Flagged', count: flaggedDeposits.filter(f => f.status === 'review_needed' || !f.status).length, Icon: AlertTriangle },
                        { id: 'investment', label: 'Investment', count: investmentInterests.filter(i => i.status === 'new' || !i.status).length, Icon: Wallet },
                        { id: 'plans', label: 'Plans pricing', Icon: TagIcon  },
                        { id: 'email-tracking', label: 'Email Tracking', Icon: Mail },
                        { id: 'marketplace', label: 'Marketplace', Icon: ShoppingCart },
                        { id: 'admin-stock-photos', label: 'Stock Photos', Icon: ImageIcon },
                        { id: 'agent', label: 'Agent Support', Icon: Headphones },
                      ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all ${activeTab === tab.id
                                ? 'bg-white text-spark-500 border-b-2 border-spark-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                           <tab.Icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
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
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-100 text-red-700' : 'bg-spark-50 text-spark-600'
                                        }`}>
                                        {((stats.cumulativeInterestPaid / stats.budgetLimit) * 100).toFixed(1)}% Used
                                    </span>
                                </div>
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                                        <div
                                            style={{ width: `${Math.min((stats.cumulativeInterestPaid / stats.budgetLimit) * 100, 100)}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${stats.cumulativeInterestPaid >= stats.budgetLimit ? 'bg-red-500' : 'bg-spark-500'
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

                        {/* ============ ✅ NEW: FLUTTERWAVE MERCHANT BALANCE ============ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Merchant Balance Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-spark-50 flex items-center justify-center">
                                            🏦
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Flutterwave Balance</h3>
                                            <p className="text-xs text-gray-500">Merchant wallet (NGN)</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={loadFlutterwaveBalance}
                                        disabled={flwBalanceLoading}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                                    >
                                        {flwBalanceLoading ? 'Loading...' : '🔄 Refresh'}
                                    </button>
                                </div>

                                {flwBalanceError ? (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-xs text-red-600">{flwBalanceError}</p>
                                    </div>
                                ) : flwBalanceLoading && !flwBalance ? (
                                    <div className="p-4 text-center">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-spark-500"></div>
                                        <p className="text-xs text-gray-500 mt-2">Loading balance...</p>
                                    </div>
                                ) : flwBalance ? (
                                    <>
                                        <p className={`text-3xl font-bold ${flwBalance.canCoverPending ? 'text-green-600' : 'text-red-600'}`}>
                                            ₦{(flwBalance.available || 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Ledger: ₦{(flwBalance.ledger || 0).toLocaleString()}
                                        </p>

                                        {flwBalance.canCoverPending ? (
                                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                ✅ Can cover pending withdrawals
                                            </div>
                                        ) : (
                                            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                ⚠️ Short by ₦{(flwBalance.shortfall || 0).toLocaleString()}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400">Balance not loaded</p>
                                )}
                            </div>

                            {/* Withdrawal Liability Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Liability</h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <div>
                                            <p className="text-xs text-gray-500">Pending Withdrawals</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₦{(flwBalance?.pendingWithdrawals?.total || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="text-2xl">⏳</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                        <div>
                                            <p className="text-xs text-gray-500">Failed (insufficient balance)</p>
                                            <p className="text-lg font-bold text-red-600">
                                                ₦{(flwBalance?.failedInsufficient?.total || 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {flwBalance?.failedInsufficient?.count || 0} request(s)
                                            </p>
                                        </div>
                                        <span className="text-2xl">❌</span>
                                    </div>
                                </div>

                                {flwBalance && !flwBalance.canCoverPending && flwBalance.pendingWithdrawals?.count > 0 && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-xs text-red-700 font-medium">
                                            ⚠️ Merchant balance is lower than pending withdrawals. Top up Flutterwave before approving.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ============ ✅ NEW: FAILED WITHDRAWALS BANNER ============ */}
                        {flwBalance && flwBalance.failedInsufficient?.count > 0 && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-2xl">
                                    ⚠️
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-800">
                                        {flwBalance.failedInsufficient.count} withdrawal{flwBalance.failedInsufficient.count > 1 ? 's' : ''} failed due to insufficient merchant balance
                                    </h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        Total pending retry: <span className="font-bold">₦{flwBalance.failedInsufficient.total.toLocaleString()}</span>
                                    </p>
                                    <p className="text-xs text-red-600 mt-2">
                                        Top up your Flutterwave merchant wallet, then go to the Withdrawals tab and click 🔄 Retry on each failed request.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('withdrawals')}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition flex-shrink-0"
                                >
                                    Go to Withdrawals →
                                </button>
                            </div>
                        )}

                        {/* ============ ✅ NEW: WITHDRAWAL SETTINGS ============ */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-spark-50 flex items-center justify-center">
                                        ⚙️
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Withdrawal Settings</h3>
                                        <p className="text-xs text-gray-500">
                                            Control the minimum amount and auto-approval rules for withdrawals.
                                        </p>
                                    </div>
                                </div>
                                {withdrawalSettingsLoading && (
                                    <span className="text-xs text-gray-400">Loading…</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">
                                        Minimum Withdrawal Amount (₦)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="50"
                                        value={minWithdrawalAmount}
                                        onChange={(e) => setMinWithdrawalAmount(e.target.value)}
                                        placeholder="Leave empty to disable minimum"
                                        disabled={withdrawalSettingsLoading || withdrawalSettingsSaving}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent disabled:opacity-50"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Requests below this amount are rejected.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">
                                        Auto-Approve Threshold (₦)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="50"
                                        value={autoApproveThreshold}
                                        onChange={(e) => setAutoApproveThreshold(e.target.value)}
                                        placeholder="Leave empty to require admin approval"
                                        disabled={withdrawalSettingsLoading || withdrawalSettingsSaving}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent disabled:opacity-50"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Requests at or below this amount are processed instantly.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                    {minWithdrawalAmount === '' && autoApproveThreshold === '' && (
                                        <>🔒 All withdrawals require manual approval. No minimum enforced.</>
                                    )}
                                    {minWithdrawalAmount !== '' && autoApproveThreshold === '' && (
                                        <>Minimum: <strong>₦{Number(minWithdrawalAmount).toLocaleString()}</strong> · Auto-approve: <strong>Off</strong></>
                                    )}
                                    {minWithdrawalAmount === '' && autoApproveThreshold !== '' && (
                                        <>Minimum: <strong>None</strong> · Auto-approve ≤ <strong>₦{Number(autoApproveThreshold).toLocaleString()}</strong></>
                                    )}
                                    {minWithdrawalAmount !== '' && autoApproveThreshold !== '' && (
                                        <>Minimum: <strong>₦{Number(minWithdrawalAmount).toLocaleString()}</strong> · Auto-approve ≤ <strong>₦{Number(autoApproveThreshold).toLocaleString()}</strong></>
                                    )}
                                </div>
                                <button
                                    onClick={saveWithdrawalSettings}
                                    disabled={withdrawalSettingsLoading || withdrawalSettingsSaving}
                                    className="px-6 py-2 bg-spark-500 hover:bg-spark-600 text-white font-medium rounded-xl transition disabled:opacity-50 whitespace-nowrap"
                                >
                                    {withdrawalSettingsSaving ? 'Saving…' : 'Save Settings'}
                                </button>
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
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                                                        onClick={() => openDeleteModal(w)}
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
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">👥 Customers</h3>
                            <button
                                onClick={requestSendBulkWelcomeEmails}
                                className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg text-sm font-medium transition"
                            >
                                📧 Send to All
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Welcome Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id || user.userId} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900">{user.fullName || 'N/A'}</td>
                                                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">
                                                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.welcomeEmailSent
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {user.welcomeEmailSent ? '✅ Sent' : '❌ Not Sent'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => requestSendSingleWelcomeEmail(user.id || user.userId)}
                                                        disabled={user.welcomeEmailSent}
                                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${user.welcomeEmailSent
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-spark-500 hover:bg-spark-600 text-white'
                                                            }`}
                                                    >
                                                        {user.welcomeEmailSent ? 'Sent' : 'Send Email'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                                                        onClick={() => requestRejectStory(story)}
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
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deposit.status === 'approved' ? 'bg-green-100' :
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
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
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

                        {/* ============ ✅ NEW: REJECTED DEPOSITS ============ */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">🚫 Rejected Deposits</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Deposits that were received but not credited (plan limits, daily limits, etc.)
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-red-50 text-red-600">
                                    {rejectedDeposits.length} total
                                </span>
                            </div>

                            {failedPaymentsLoading ? (
                                <div className="bg-white rounded-2xl p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-spark-500"></div>
                                    <p className="text-gray-500 mt-3 text-sm">Loading...</p>
                                </div>
                            ) : rejectedDeposits.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">No rejected deposits — all clear</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {rejectedDeposits.map((r) => (
                                        <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <div className="flex items-start justify-between flex-wrap gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-lg">
                                                        🚫
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {r.userId || 'Unknown User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            <span className="font-medium text-red-600">{r.reason}</span>
                                                        </p>
                                                        <p className="text-xs font-mono text-gray-400 mt-1 break-all">
                                                            Ref: {r.flwReference || 'N/A'}
                                                        </p>
                                                        {r.alreadySavedToday !== undefined && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Already saved today: ₦{(r.alreadySavedToday || 0).toLocaleString()} / Limit: ₦{(r.dailyLimit || 0).toLocaleString()}
                                                            </p>
                                                        )}
                                                        {r.createdAt && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {formatDate(r.createdAt)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₦{(r.amount || 0).toLocaleString()}
                                                    </p>
                                                    {r.paidAmount && r.paidAmount !== r.amount && (
                                                        <p className="text-xs text-red-600 mt-0.5">
                                                            Paid: ₦{r.paidAmount.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ============ ✅ NEW: ORPHAN PAYMENTS ============ */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">👻 Orphan Payments</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Payments received with no matching user account
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-amber-50 text-amber-600">
                                    {orphanPayments.length} total
                                </span>
                            </div>

                            {failedPaymentsLoading ? (
                                <div className="bg-white rounded-2xl p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-spark-500"></div>
                                    <p className="text-gray-500 mt-3 text-sm">Loading...</p>
                                </div>
                            ) : orphanPayments.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">No orphan payments — all clear</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orphanPayments.map((o) => (
                                        <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                            <div className="flex items-start justify-between flex-wrap gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-lg">
                                                        👻
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {o.email || 'Unknown Email'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            Reason: <span className="font-medium text-amber-600">{o.reason}</span>
                                                        </p>
                                                        <p className="text-xs font-mono text-gray-400 mt-1 break-all">
                                                            Ref: {o.reference || 'N/A'}
                                                        </p>
                                                        {o.createdAt && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {formatDate(o.createdAt)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        ₦{(o.paidAmount || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}

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
                                                                onClick={() => requestSendInvestorEmail(interest)}
                                                                disabled={sendingEmail || interest.emailSent}
                                                                className={`px-3 py-1.5 text-white text-sm font-medium rounded-xl transition-all ${interest.emailSent
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
                                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${code.isUsed
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
                                                        requestSendInvestorEmail(selectedInvestmentDetails);
                                                    }
                                                }}
                                                disabled={sendingEmail || selectedInvestmentDetails?.emailSent}
                                                className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition-all ${selectedInvestmentDetails?.emailSent
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

                {/* ============ PLANS TAB ============ */}
                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Plan Configuration</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Edit fees, limits, and features. Changes apply immediately to new upgrades and renewals.
                                </p>
                            </div>
                            <button
                                onClick={requestSeedPlanConfigs}
                                disabled={plansSeeding || plansLoading}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                            >
                                {plansSeeding ? 'Seeding…' : '🌱 Seed from defaults'}
                            </button>
                        </div>

                        {plansLoading ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-spark-500 mx-auto"></div>
                                <p className="text-gray-500 mt-4">Loading plan configs…</p>
                            </div>
                        ) : planConfigs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <p className="text-gray-500">No plans loaded. Click "Seed from defaults" to initialize.</p>
                            </div>
                        ) : (
                            planConfigs.map(plan => {
                                const actualDiscount = computePlanDiscount(plan);
                                const isSaving = plansSaving[plan.name];

                                return (
                                    <div key={plan.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* Card header */}
                                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">{plan.icon || '📦'}</div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                                                    <p className="text-xs text-gray-500">{plan.bestFor}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                                                Actual savings: <strong>{actualDiscount}%</strong> off monthly × 12
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="p-5 space-y-4">
                                            {/* Grid of numeric fields */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Icon</span>
                                                    <input
                                                        type="text"
                                                        value={plan.icon || ''}
                                                        onChange={(e) => updatePlanField(plan.name, 'icon', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                        placeholder="⭐"
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Min deposit (₦)</span>
                                                    <input
                                                        type="number"
                                                        value={plan.min ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'min', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Max deposit (₦)</span>
                                                    <input
                                                        type="number"
                                                        value={plan.max ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'max', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Daily save goal (₦)</span>
                                                    <input
                                                        type="number"
                                                        value={plan.dailySaveMax ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'dailySaveMax', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly fee (₦)</span>
                                                    <input
                                                        type="number"
                                                        value={plan.monthlyFee ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'monthlyFee', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Yearly fee (₦)</span>
                                                    <input
                                                        type="number"
                                                        value={plan.yearlyFee ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'yearlyFee', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>

                                                <div>
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                        Discount %
                                                    </span>
                                                    <div className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-xl bg-gray-50 text-sm flex items-center justify-between">
                                                        <span className="font-semibold text-gray-700">{actualDiscount}%</span>
                                                        <span className="text-[10px] uppercase tracking-wide text-gray-400">auto</span>
                                                    </div>
                                                </div>

                                                <label className="block">
                                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Interest rate (%)</span>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={plan.interestRate ?? 0}
                                                        onChange={(e) => updatePlanField(plan.name, 'interestRate', e.target.value)}
                                                        disabled={isSaving}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    />
                                                </label>
                                            </div>

                                            {/* ✅ NEW: Yearly discount helper */}
                                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3 flex flex-wrap items-end justify-between gap-3">
                                        <div className="flex-1 min-w-[220px]">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Yearly discount
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                Currently shows <strong className="text-spark-600">{actualDiscount}%</strong> off
                                                {Number(plan.monthlyFee) > 0 && (
                                                    <span className="text-gray-400">
                                                        {' '}(₦{Number(plan.yearlyFee || 0).toLocaleString()}/yr vs ₦
                                                        {(Number(plan.monthlyFee) * 12).toLocaleString()})
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Enter a target percentage (0-99) and click Apply to auto-compute the yearly fee.
                                            </p>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <label className="block">
                                                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                    Set %
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="99"
                                                    step="1"
                                                    value={plan.__targetDiscount ?? ''}
                                                    placeholder="e.g. 0-99"
                                                    disabled={isSaving || Number(plan.monthlyFee) <= 0}
                                                    onChange={(e) => updatePlanField(plan.name, '__targetDiscount', e.target.value)}
                                                    className="w-40 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => applyTargetDiscount(plan.name)}
                                                disabled={isSaving || !plan.__targetDiscount || Number(plan.monthlyFee) <= 0}
                                                className="px-4 py-2 text-sm font-medium rounded-xl bg-spark-500 text-white hover:bg-spark-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                            {/* Tagline */}
                                            <label className="block">
                                                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tagline</span>
                                                <input
                                                    type="text"
                                                    value={plan.bestFor || ''}
                                                    onChange={(e) => updatePlanField(plan.name, 'bestFor', e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    placeholder="Perfect for beginners"
                                                />
                                            </label>

                                            {/* Features */}
                                            <label className="block">
                                                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                    Features (one per line)
                                                </span>
                                                <textarea
                                                    rows={6}
                                                    value={(plan.features || []).join('\n')}
                                                    onChange={(e) => updatePlanFeaturesFromText(plan.name, e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent text-sm font-mono disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                />
                                            </label>

                                            {/* Save button */}
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    onClick={() => savePlanConfig(plan)}
                                                    disabled={isSaving || !isPlanDirty(plan)}
                                                    className={`px-6 py-2 text-white font-semibold rounded-xl transition-all ${isSaving || !isPlanDirty(plan)
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-spark-500 hover:bg-spark-600'
                                                        }`}
                                                >
                                                    {isSaving
                                                        ? 'Saving…'
                                                        : !isPlanDirty(plan)
                                                            ? 'No changes'
                                                            : `Save ${plan.name}`}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {activeTab === 'marketplace' && (
                    <AdminProducts />
                )}

                {activeTab === 'email-tracking' && (
                    // ✅ Email Tracking Component
                    <EmailTracking />
                )}

                {activeTab === 'admin-stock-photos' && (
                    // ✅ Email Tracking Component
                    <AdminStockPhone />
                )}

                {activeTab === 'agent' && (
                    <AgentDashboard />
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
                                        className={`flex-1 text-white font-semibold py-3 rounded-xl transition-all ${generatingCodes ? 'bg-gray-400 cursor-not-allowed' : 'bg-spark-500 hover:bg-spark-600'
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
                                        className={`flex-1 text-white font-semibold py-3 rounded-xl transition-all ${updatingInvestment ? 'bg-gray-400 cursor-not-allowed' : 'bg-spark-500 hover:bg-spark-600'
                                            }`}
                                    >
                                        {updatingInvestment ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ ✅ NEW: DELETE WITHDRAWAL MODAL (antd) ============ */}
                <Modal
                    open={showDeleteModal}
                    onCancel={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                    title={
                        deleteMode === 'blocked'
                            ? '⚠️ Cannot Delete This Withdrawal'
                            : '🗑️ Delete This Withdrawal?'
                    }
                    width={520}
                    footer={
                        deleteMode === 'blocked'
                            ? [
                                <Button
                                    key="cancel"
                                    onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="retry"
                                    type="primary"
                                    onClick={() => {
                                        const id = deleteTarget?.id;
                                        setShowDeleteModal(false);
                                        setDeleteTarget(null);
                                        if (id) retryWithdrawal(id);
                                    }}
                                >
                                    🔄 Retry Withdrawal Instead
                                </Button>,
                            ]
                            : [
                                <Button
                                    key="cancel"
                                    onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="delete"
                                    type="primary"
                                    danger
                                    onClick={confirmDeleteWithdrawal}
                                >
                                    🗑️ Delete Withdrawal
                                </Button>,
                            ]
                    }
                >
                    {deleteTarget && (
                        <>
                            <p className="text-sm text-gray-500 mb-4">
                                {deleteMode === 'blocked'
                                    ? 'This failed withdrawal was never refunded. Deleting it would hide the fact that the user is owed money.'
                                    : 'This action cannot be undone. The withdrawal record will be soft-deleted from Firestore.'}
                            </p>

                            <Descriptions
                                column={1}
                                size="small"
                                bordered
                                labelStyle={{ width: 160 }}
                            >
                                <Descriptions.Item label="User">
                                    {deleteTarget.userName && deleteTarget.userName !== 'Deleted User'
                                        ? deleteTarget.userName
                                        : deleteTarget.userId || 'Unknown'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Amount">
                                    ₦{Number(deleteTarget.amount || 0).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total Deduction">
                                    ₦{Number(deleteTarget.totalDeduction || deleteTarget.amount || 0).toLocaleString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag
                                        color={
                                            deleteTarget.status === 'failed' ? 'red' :
                                                deleteTarget.status === 'pending' ? 'orange' :
                                                    deleteTarget.status === 'approved' ? 'green' :
                                                        deleteTarget.status === 'rejected' ? 'volcano' :
                                                            'default'
                                        }
                                    >
                                        {(deleteTarget.status || 'pending').toUpperCase()}
                                    </Tag>
                                </Descriptions.Item>
                                {deleteTarget.error && (
                                    <Descriptions.Item label="Reason">
                                        <span className="text-red-600 text-xs">{deleteTarget.error}</span>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            {deleteMode === 'blocked' && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    className="mt-4"
                                    message={`This user was never refunded ₦${Number(deleteTarget.totalDeduction || deleteTarget.amount || 0).toLocaleString()}`}
                                    description="Retry the withdrawal or refund the user first. If you're sure, you can delete this doc directly from Firestore."
                                />
                            )}
                        </>
                    )}
                </Modal>

                {/* ============ ✅ NEW: SEND SINGLE WELCOME EMAIL MODAL ============ */}
                <Modal
                    open={showWelcomeEmailModal}
                    onCancel={cancelSendSingleWelcomeEmail}
                    title="📧 Send Welcome Email?"
                    width={480}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={cancelSendSingleWelcomeEmail}
                            disabled={welcomeEmailSending}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="send"
                            type="primary"
                            onClick={confirmSendSingleWelcomeEmail}
                            loading={welcomeEmailSending}
                        >
                            📧 Send Email
                        </Button>,
                    ]}
                >
                    <p className="text-sm text-gray-600">
                        Send the welcome email to this user? They'll receive onboarding instructions by email.
                    </p>
                </Modal>

                {/* ============ ✅ NEW: SEND BULK WELCOME EMAILS MODAL ============ */}
                <Modal
                    open={showBulkWelcomeModal}
                    onCancel={cancelSendBulkWelcomeEmails}
                    title="📧 Send Welcome Emails to All?"
                    width={520}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={cancelSendBulkWelcomeEmails}
                            disabled={bulkWelcomeSending}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="send"
                            type="primary"
                            onClick={confirmSendBulkWelcomeEmails}
                            loading={bulkWelcomeSending}
                        >
                            📧 Send to All
                        </Button>,
                    ]}
                >
                    <p className="text-sm text-gray-600 mb-3">
                        Send a welcome email to <strong>all customers who haven't received one yet</strong>.
                    </p>
                    <Alert
                        type="info"
                        showIcon
                        message="Customers who already received the welcome email will be skipped."
                    />
                </Modal>

                {/* ============ ✅ NEW: REJECT STORY MODAL ============ */}
                <Modal
                    open={showRejectStoryModal}
                    onCancel={cancelRejectStory}
                    title="❌ Reject This Story?"
                    width={480}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={cancelRejectStory}
                            disabled={rejectStoryProcessing}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="reject"
                            type="primary"
                            danger
                            onClick={confirmRejectStory}
                            loading={rejectStoryProcessing}
                        >
                            ❌ Reject Story
                        </Button>,
                    ]}
                >
                    {rejectStoryTarget && (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                Reject the story from <strong>{rejectStoryTarget.name}</strong>?
                            </p>
                            <Alert
                                type="warning"
                                showIcon
                                message="The user will need to resubmit their story."
                            />
                        </>
                    )}
                </Modal>

                {/* ============ ✅ NEW: ADMIN ACTION MODAL (make/remove) ============ */}
                <Modal
                    open={showAdminActionModal}
                    onCancel={cancelAdminAction}
                    title={
                        adminActionType === 'make'
                            ? '👑 Make Admin?'
                            : '⚠️ Remove Admin?'
                    }
                    width={480}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={cancelAdminAction}
                            disabled={adminActionProcessing}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="confirm"
                            type="primary"
                            danger={adminActionType === 'remove'}
                            onClick={confirmAdminAction}
                            loading={adminActionProcessing}
                        >
                            {adminActionType === 'make' ? '👑 Make Admin' : '⚠️ Remove Admin'}
                        </Button>,
                    ]}
                >
                    {adminActionTarget && (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                {adminActionType === 'make' ? (
                                    <>Give <strong>{adminActionTarget.fullName}</strong> admin access to the platform?</>
                                ) : (
                                    <>Remove <strong>{adminActionTarget.fullName}</strong> from admins?</>
                                )}
                            </p>
                            {adminActionType === 'make' ? (
                                <Alert
                                    type="info"
                                    showIcon
                                    message="Admins can manage users, withdrawals, plans, and other critical settings."
                                />
                            ) : (
                                <Alert
                                    type="warning"
                                    showIcon
                                    message="They will lose all admin privileges immediately."
                                />
                            )}
                        </>
                    )}
                </Modal>

                {/* ============ ✅ NEW: SEND INVESTOR EMAIL MODAL ============ */}
                <Modal
                    open={showSendInvestorEmailModal}
                    onCancel={cancelSendInvestorEmail}
                    title="📧 Send Investment Details Email?"
                    width={520}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={cancelSendInvestorEmail}
                            disabled={sendingEmail}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="send"
                            type="primary"
                            onClick={confirmSendInvestorEmail}
                            loading={sendingEmail}
                        >
                            📧 Send Email
                        </Button>,
                    ]}
                >
                    {sendInvestorEmailTarget && (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                Send investment details email to:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-semibold text-gray-900">
                                        {sendInvestorEmailTarget.fullName || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-semibold text-gray-900 break-all">
                                        {sendInvestorEmailTarget.email}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Investment amount</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(sendInvestorEmailTarget.investmentAmount || 0)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </Modal>

                {/* ============ ✅ NEW: SEED PLANS CONFIRMATION MODAL ============ */}
                <Modal
                    open={showSeedModal}
                    onCancel={cancelSeedPlanConfigs}
                    title="🌱 Seed Plan Configs?"
                    width={520}
                    footer={
                        seedResult
                            ? [
                                <Button key="ok" type="primary" onClick={cancelSeedPlanConfigs}>
                                    Got it
                                </Button>
                            ]
                            : [
                                <Button
                                    key="cancel"
                                    onClick={cancelSeedPlanConfigs}
                                    disabled={plansSeeding}
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="seed"
                                    type="primary"
                                    onClick={confirmSeedPlanConfigs}
                                    loading={plansSeeding}
                                >
                                    🌱 Seed Now
                                </Button>,
                            ]
                    }
                >
                    {!seedResult ? (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                This will write the default plan configurations (Basic, Premium, Investor) to Firestore.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
                                <li><strong>Plans that already exist</strong> in Firestore will be skipped — your existing values stay safe.</li>
                                <li><strong>Missing plans</strong> will be created from the built-in defaults.</li>
                                <li>You can edit any value afterward — nothing here is final.</li>
                            </ul>
                            <Alert
                                type="info"
                                showIcon
                                className="mt-4"
                                message="Safe to run anytime"
                                description="Running this multiple times does not overwrite existing plans."
                            />
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-3">
                                Done. Here's what happened:
                            </p>
                            <Descriptions column={1} size="small" bordered>
                                {Object.entries(seedResult).map(([planName, status]) => (
                                    <Descriptions.Item key={planName} label={planName}>
                                        <Tag color={status.startsWith('created') ? 'green' : 'default'}>
                                            {status}
                                        </Tag>
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
}