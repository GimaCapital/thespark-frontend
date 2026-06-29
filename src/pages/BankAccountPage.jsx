import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, setAuthToken } from '../services/api';
import { auth } from '../services/firebase';
import toast from 'react-hot-toast';
import FlutterwaveVirtualAccount from '../components/Dashboard/FlutterwaveVirtualAccount';
import BvnStatusCard from '../components/BvnStatusCard.jsx';

const getBankIcon = (bankName) => {
    if (!bankName) return '🏛️';
    let hash = 0;
    const cleanName = bankName.toLowerCase().replace(/\s/g, '');
    for (let i = 0; i < cleanName.length; i++) {
        hash = (hash + cleanName.charCodeAt(i) * (i + 1)) % 8;
    }
    const icons = ['🏛️', '🏦', '💳', '📱', '💰', '🏪', '💼', '📈'];
    return icons[hash];
};

export default function BankAccount() {
    const [bankAccount, setBankAccount] = useState(null);
    const [banks, setBanks] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [formData, setFormData] = useState({
        bankCode: '',
        bankName: '',
        accountNumber: '',
        accountName: ''
    });
    const [validating, setValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);

    useEffect(() => {
        loadBankAccount();
        fetchBanks();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredBanks(banks.filter(bank => 
                bank.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            setShowDropdown(true);
        } else {
            setFilteredBanks(banks);
            setShowDropdown(false);
        }
    }, [searchTerm, banks]);

    const fetchBanks = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/flutterwave/banks');
            if (response.data.success) {
                setBanks(response.data.banks);
                setFilteredBanks(response.data.banks);
            }
        } catch (error) {
            console.error('Failed to fetch banks:', error);
            toast.error('Failed to load banks');
        }
    };

    const loadBankAccount = async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/bank-account');
            if (response.data.hasAccount) {
                setBankAccount(response.data);
            }
        } catch (error) {
            console.error('Failed to load bank account:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBankSelect = (bankCode) => {
        const selectedBank = banks.find(bank => bank.code === bankCode);
        setFormData({
            ...formData,
            bankCode: bankCode,
            bankName: selectedBank ? selectedBank.name : ''
        });
        setSearchTerm(selectedBank ? selectedBank.name : '');
        setShowDropdown(false);
        setValidationResult(null);
    };

    const handleAccountNumberChange = async (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, accountNumber: value });
        setValidationResult(null);

        if (value.length === 10 && formData.bankCode) {
            await validateAccount(value, formData.bankCode);
        }
    };

    const validateAccount = async (accountNumber, bankCode) => {
        setValidating(true);
        setValidationResult(null);
        
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/flutterwave/validate-account', {
                bankCode: bankCode,
                accountNumber: accountNumber
            });
            
            if (response.data.success) {
                setValidationResult({
                    valid: true,
                    accountName: response.data.accountName
                });
                setFormData(prev => ({
                    ...prev,
                    accountName: response.data.accountName || prev.accountName
                }));
                toast.success('Account verified successfully');
            } else {
                setValidationResult({
                    valid: false,
                    message: response.data.message || 'Account not found'
                });
                toast.error(response.data.message || 'Invalid account number');
            }
        } catch (error) {
            setValidationResult({
                valid: false,
                message: error.response?.data?.message || 'Validation failed'
            });
            toast.error(error.response?.data?.message || 'Failed to validate account');
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bankCode || !formData.accountNumber || !formData.accountName) {
            toast.error('Please fill all fields');
            return;
        }

        if (formData.accountNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit account number');
            return;
        }

        if (!validationResult?.valid) {
            toast.error('Please verify your account number first');
            return;
        }

        setSaving(true);

        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            await api.post('/users/bank-account', {
                bankCode: formData.bankCode,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountName: formData.accountName.toUpperCase()
            });
            
            toast.success('Bank account added successfully!');
            setShowForm(false);
            setFormData({ bankCode: '', bankName: '', accountNumber: '', accountName: '' });
            setSearchTerm('');
            setShowDropdown(false);
            setValidationResult(null);
            loadBankAccount();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add bank account');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!window.confirm('Are you sure you want to remove your bank account?')) return;

        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.delete('/users/bank-account');
            toast.success('Bank account removed');
            setBankAccount(null);
        } catch (error) {
            toast.error('Failed to remove bank account');
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            let date;
            if (timestamp.toDate) {
                date = timestamp.toDate();
            } else if (timestamp._seconds) {
                date = new Date(timestamp._seconds * 1000);
            } else {
                date = new Date(timestamp);
            }
            
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            return date.toLocaleDateString('en-US', { 
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

    if (loading) {
        return (
            // <div className="text-center py-6">
             <div className="flex justify-center items-center min-h-[200px]">
                <div className="spinner"></div>
                <p className="text-sm text-gray-500">Loading your bank account details...</p>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Back to Dashboard Link */}
            <div className="mb-4">
                <Link to="/dashboard" className="text-sm text-spark-500 hover:text-spark-600 font-medium inline-flex items-center gap-1 transition">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* ✅ BVN STATUS CARD - Add here */}
            <div className="mb-4">
                <BvnStatusCard />
            </div>

            {/* Virtual Account Section */}
            <div className="mb-4">
                <FlutterwaveVirtualAccount />
            </div>

            {/* Withdrawal Bank Account Section */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="heading-3 mb-0">🏦 Withdrawal Bank Account</h3>
                    {bankAccount && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Verified
                        </span>
                    )}
                </div>
                
                {bankAccount ? (
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Bank</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        <span className="mr-1">{getBankIcon(bankAccount.bankName)}</span>
                                        {bankAccount.bankName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Account Number</p>
                                    <p className="text-sm font-mono font-semibold text-gray-900 mt-1">
                                        {bankAccount.accountNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Account Name</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                        {bankAccount.accountName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Last updated: {formatDate(bankAccount.bankAccountUpdatedAt)}</span>
                            </div>
                            <button
                                onClick={handleRemove}
                                className="text-sm text-red-600 hover:text-red-800 font-medium transition"
                            >
                                Remove Account
                            </button>
                        </div>
                    </div>
                ) : showForm ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Bank <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => searchTerm && setShowDropdown(true)}
                                    placeholder="Search for your bank..."
                                    className="input w-full pr-8"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setShowDropdown(false);
                                            setFormData(prev => ({ ...prev, bankCode: '', bankName: '' }));
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            {searchTerm && showDropdown && filteredBanks.length > 0 && (
                                <div className="relative">
                                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                                        {filteredBanks.slice(0, 10).map(bank => (
                                            <button
                                                key={bank.code}
                                                type="button"
                                                onClick={() => handleBankSelect(bank.code)}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition ${
                                                    formData.bankCode === bank.code ? 'bg-orange-50 text-spark-600' : ''
                                                }`}
                                            >
                                                <span className="mr-2">{getBankIcon(bank.name)}</span>
                                                {bank.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {formData.bankName && (
                                <div className="mt-2 text-xs text-green-600">
                                    Selected: <span className="font-medium">{formData.bankName}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={handleAccountNumberChange}
                                    placeholder="Enter 10-digit account number"
                                    className={`input w-full ${
                                        validationResult?.valid === true ? 'border-green-500 bg-green-50' :
                                        validationResult?.valid === false ? 'border-red-500 bg-red-50' : ''
                                    }`}
                                    maxLength="10"
                                    disabled={validating}
                                />
                                {validating && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-spark-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            {validationResult?.valid === true && (
                                <p className="mt-1 text-xs text-green-600">{validationResult.accountName}</p>
                            )}
                            {validationResult?.valid === false && (
                                <p className="mt-1 text-xs text-red-500">{validationResult.message}</p>
                            )}
                            {validating && <p className="mt-1 text-xs text-gray-400">Validating account...</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.accountName}
                                onChange={(e) => setFormData({ ...formData, accountName: e.target.value.toUpperCase() })}
                                placeholder="Enter your account name as on bank record"
                                className="input w-full uppercase"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-400">Must match your bank account name exactly</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setSearchTerm('');
                                    setShowDropdown(false);
                                    setValidationResult(null);
                                }}
                                className="btn btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !formData.bankCode || !formData.accountNumber || !formData.accountName || !validationResult?.valid}
                                className="btn btn-primary flex-1"
                            >
                                {saving ? 'Adding...' : 'Add Bank Account'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-5xl mb-3">🏦</div>
                        <p className="text-gray-500 text-sm mb-2">
                            No withdrawal bank account added yet
                        </p>
                        <p className="text-gray-400 text-xs mb-4">
                            Add your bank account to receive withdrawals directly
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-primary w-full"
                        >
                            Add Bank Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}