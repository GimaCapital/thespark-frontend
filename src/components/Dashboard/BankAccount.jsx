// import React, { useState, useEffect } from 'react';
// import { api, setAuthToken } from '../../services/api';
// import { auth } from '../../services/firebase';
// import toast from 'react-hot-toast';

// export default function BankAccount() {
//     const [bankAccount, setBankAccount] = useState(null);
//     const [banks, setBanks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [banksLoading, setBanksLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [showForm, setShowForm] = useState(false);
//     const [formData, setFormData] = useState({
//         bankCode: '',
//         bankName: '',
//         accountNumber: '',
//         accountName: ''
//     });

//     useEffect(() => {
//         loadBankAccount();
//         fetchBanks();
//     }, []);

//     // Fetch banks from Flutterwave
//     const fetchBanks = async () => {
//         setBanksLoading(true);
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/flutterwave/banks');
//             if (response.data.success) {
//                 setBanks(response.data.banks);
//             }
//         } catch (error) {
//             console.error('Failed to fetch banks:', error);
//             toast.error('Failed to load banks');
//         } finally {
//             setBanksLoading(false);
//         }
//     };

//     const loadBankAccount = async () => {
//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             const response = await api.get('/users/bank-account');
//             if (response.data.hasAccount) {
//                 setBankAccount(response.data);
//             }
//         } catch (error) {
//             console.error('Failed to load bank account:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle bank selection
//     const handleBankSelect = (e) => {
//         const bankCode = e.target.value;
//         const selectedBank = banks.find(bank => bank.code === bankCode);
//         setFormData({
//             ...formData,
//             bankCode: bankCode,
//             bankName: selectedBank ? selectedBank.name : ''
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.bankCode || !formData.accountNumber || !formData.accountName) {
//             toast.error('Please fill all fields');
//             return;
//         }

//         if (formData.accountNumber.length !== 10) {
//             toast.error('Please enter a valid 10-digit account number');
//             return;
//         }

//         setSaving(true);

//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
            
//             // Save with Flutterwave's bank code
//             await api.post('/users/bank-account', {
//                 bankCode: formData.bankCode,
//                 bankName: formData.bankName,
//                 accountNumber: formData.accountNumber,
//                 accountName: formData.accountName
//             });
            
//             toast.success('Bank account added successfully!');
//             setShowForm(false);
//             setFormData({ bankCode: '', bankName: '', accountNumber: '', accountName: '' });
//             loadBankAccount();
//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Failed to add bank account');
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleRemove = async () => {
//         if (!window.confirm('Are you sure you want to remove your bank account?')) return;

//         try {
//             const idToken = await auth.currentUser.getIdToken();
//             setAuthToken(idToken);
//             await api.delete('/users/bank-account');
//             toast.success('Bank account removed');
//             setBankAccount(null);
//         } catch (error) {
//             toast.error('Failed to remove bank account');
//         }
//     };

//     if (loading || banksLoading) {
//         return (
//             <div className="text-center py-4">
//                 <div className="spinner-sm"></div>
//             </div>
//         );
//     }

//     if (bankAccount) {
//         return (
//             <div className="card">
//                 <h3 className="heading-3 text-center mb-4">🏦 Withdrawal Bank Account</h3>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                     <div className="flex items-center justify-between mb-3">
//                         <span className="text-sm text-gray-500">Bank</span>
//                         <span className="font-semibold">{bankAccount.bankName}</span>
//                     </div>
//                     <div className="flex items-center justify-between mb-3">
//                         <span className="text-sm text-gray-500">Account Number</span>
//                         <span className="font-mono font-semibold">{bankAccount.accountNumber}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-500">Account Name</span>
//                         <span className="font-semibold">{bankAccount.accountName}</span>
//                     </div>
//                 </div>
//                 <button
//                     onClick={handleRemove}
//                     className="btn btn-outline btn-sm mt-3 w-full text-red-600 border-red-300 hover:bg-red-50"
//                 >
//                     Remove Bank Account
//                 </button>
//                 <p className="text-xs text-gray-400 text-center mt-3">
//                     Withdrawals will be sent to this account within 24-48 hours after approval.
//                 </p>
//             </div>
//         );
//     }

//     if (showForm) {
//         return (
//             <div className="card">
//                 <h3 className="heading-3 text-center mb-4">Add Bank Account for Withdrawals</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Select Bank *
//                         </label>
//                         <select
//                             value={formData.bankCode}
//                             onChange={handleBankSelect}
//                             className="input w-full"
//                             required
//                         >
//                             <option value="">-- Select your bank --</option>
//                             {banks.map(bank => (
//                                 <option key={bank.code} value={bank.code}>{bank.name}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Account Number *
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.accountNumber}
//                             onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
//                             className="input w-full"
//                             placeholder="Enter your 10-digit account number"
//                             maxLength="10"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Account Name *
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.accountName}
//                             onChange={(e) => setFormData({ ...formData, accountName: e.target.value.toUpperCase() })}
//                             className="input w-full"
//                             placeholder="Enter your account name"
//                             required
//                         />
//                     </div>

//                     <div className="flex gap-3">
//                         <button
//                             type="button"
//                             onClick={() => setShowForm(false)}
//                             className="btn btn-secondary flex-1"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={saving}
//                             className="btn btn-primary flex-1"
//                         >
//                             {saving ? 'Saving...' : 'Add Account'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         );
//     }

//     return (
//         <div className="card text-center">
//             <div className="text-5xl mb-3">🏦</div>
//             <h3 className="heading-3 mb-2">Add Bank Account</h3>
//             <p className="text-body text-sm mb-4">
//                 Add your bank account to receive withdrawals.
//                 Money will be sent directly to your account.
//             </p>
//             <button
//                 onClick={() => setShowForm(true)}
//                 className="btn btn-primary w-full"
//             >
//                 Add Bank Account
//             </button>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';

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
                toast.success('Account verified!');
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

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="spinner"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
        );
    }

    // View when bank account exists
    if (bankAccount) {
        return (
            <div className="card">
                <h3 className="heading-3 text-center mb-4">🏦 Withdrawal Bank Account</h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Bank</span>
                        <span className="font-semibold">{bankAccount.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Account Number</span>
                        <span className="font-mono font-semibold">{bankAccount.accountNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Account Name</span>
                        <span className="font-semibold">{bankAccount.accountName}</span>
                    </div>
                </div>
                <button
                    onClick={handleRemove}
                    className="btn btn-outline btn-sm mt-3 w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                    Remove Bank Account
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                    Withdrawals will be sent to this account within 24-48 hours after approval.
                </p>
            </div>
        );
    }

    // Add Bank Account Form
    if (showForm) {
        return (
            <div className="card">
                <h3 className="heading-3 text-center mb-4">Add Bank Account for Withdrawals</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Bank *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm && setShowDropdown(true)}
                                placeholder="Search for your bank..."
                                className="input w-full"
                            />
                            {searchTerm && showDropdown && filteredBanks.length > 0 && (
                                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                                    {filteredBanks.slice(0, 10).map(bank => (
                                        <button
                                            key={bank.code}
                                            type="button"
                                            onClick={() => handleBankSelect(bank.code)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                                                formData.bankCode === bank.code ? 'bg-orange-50 text-spark-600' : ''
                                            }`}
                                        >
                                            <span>
                                                <span className="mr-2">{getBankIcon(bank.name)}</span>
                                                {bank.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {formData.bankName && (
                            <div className="mt-1 text-sm text-green-600">
                                Selected: <span className="font-medium">{formData.bankName}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number *
                        </label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={handleAccountNumberChange}
                            placeholder="Enter 10-digit account number"
                            className="input w-full"
                            maxLength="10"
                            disabled={validating}
                        />
                        {validationResult?.valid === true && (
                            <p className="text-xs text-green-600 mt-1">{validationResult.accountName}</p>
                        )}
                        {validationResult?.valid === false && (
                            <p className="text-xs text-red-500 mt-1">{validationResult.message}</p>
                        )}
                        {validating && <p className="text-xs text-gray-500 mt-1">Validating...</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Name *
                        </label>
                        <input
                            type="text"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value.toUpperCase() })}
                            placeholder="Enter your account name"
                            className="input w-full uppercase"
                            required
                        />
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
                            {saving ? 'Saving...' : 'Add Account'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Empty state
    return (
        <div className="card text-center">
            <div className="text-5xl mb-3">🏦</div>
            <h3 className="heading-3 mb-2">Add Bank Account</h3>
            <p className="text-body text-sm mb-4">
                Add your bank account to receive withdrawals. Money will be sent directly to your account.
            </p>
            <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary w-full"
            >
                Add Bank Account
            </button>
        </div>
    );
}