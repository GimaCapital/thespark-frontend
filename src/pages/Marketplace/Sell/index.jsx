// src/pages/Marketplace/Sell/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { api, setAuthToken } from '../../../services/api';
import { auth } from '../../../services/firebase';
import { getMyProducts } from '../../../services/marketplace';
import HeaderMissionCard from '../../../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function SellProduct() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userProducts, setUserProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        category: 'grains',
        originalPrice: '',
        discountPrice: '',
        description: '',
        unit: '50kg bag',
        stock: '',
        image: '🍚'
    });

    const categories = [
        { id: 'grains', label: 'Grains', icon: '🌾' },
        { id: 'garri', label: 'Garri', icon: '🌽' },
        { id: 'beans', label: 'Beans', icon: '🫘' },
        { id: 'oils', label: 'Oils', icon: '🫒' },
        { id: 'others', label: 'Others', icon: '🧂' }
    ];

    const units = [
        '50kg bag',
        '25kg bag',
        '10kg bag',
        '5 liters',
        '10 liters',
        'carton (12 packs)',
        'unit'
    ];

    const emojis = ['🍚', '🌾', '🌽', '🫘', '🫒', '🌴', '🧂', '🍬', '🍝', '📦'];

    useEffect(() => {
        loadUserProducts();
    }, []);

    const loadUserProducts = async () => {
        setLoadingProducts(true);
        try {
            const data = await getMyProducts();
            setUserProducts(data || []);
        } catch (error) {
            console.error('Failed to load user products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || formData.name.trim().length < 3) {
            toast.error('Product name must be at least 3 characters');
            return;
        }
        if (!formData.originalPrice || parseInt(formData.originalPrice) < 100) {
            toast.error('Original price must be at least ₦100');
            return;
        }
        if (!formData.discountPrice || parseInt(formData.discountPrice) < 100) {
            toast.error('Discount price must be at least ₦100');
            return;
        }
        if (parseInt(formData.discountPrice) >= parseInt(formData.originalPrice)) {
            toast.error('Discount price must be less than original price');
            return;
        }
        if (!formData.description || formData.description.trim().length < 10) {
            toast.error('Description must be at least 10 characters');
            return;
        }
        
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const response = await api.post('/marketplace/products/submit', {
                ...formData,
                originalPrice: parseInt(formData.originalPrice),
                discountPrice: parseInt(formData.discountPrice),
                stock: parseInt(formData.stock) || 0
            });
            
            if (response.data.success) {
                toast.success('✅ Product submitted for admin approval!');
                setFormData({
                    name: '',
                    category: 'grains',
                    originalPrice: '',
                    discountPrice: '',
                    description: '',
                    unit: '50kg bag',
                    stock: '',
                    image: '🍚'
                });
                loadUserProducts();
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            toast.error(error.response?.data?.error || 'Failed to submit product');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            await api.delete(`/marketplace/products/delete/${productId}`);
            toast.success('Product deleted');
            loadUserProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { color: 'bg-yellow-100 text-yellow-700', label: '⏳ Pending Approval' },
            'approved': { color: 'bg-green-100 text-green-700', label: '✅ Approved' },
            'rejected': { color: 'bg-red-100 text-red-700', label: '❌ Rejected' }
        };
        return statusMap[status] || statusMap['pending'];
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📦 Sell on TheSpark</h1>
                        <p className="text-sm text-gray-500">List your food items for sale at wholesale prices</p>
                    </div>
                    <Link to="/marketplace" className="text-spark-500 hover:text-spark-600 text-sm font-medium">
                        ← Back to Marketplace
                    </Link>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Listings</h2>
                    {loadingProducts ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                        </div>
                    ) : userProducts.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                            <p className="text-gray-500 text-sm">You haven't listed any products yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {userProducts.map(product => {
                                const status = getStatusBadge(product.status);
                                return (
                                    <div key={product.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{product.image || '📦'}</span>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-500">₦{product.discountPrice?.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>
                                        {product.status === 'pending' && (
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">List New Product</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Premium Parboiled Rice"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Original Price (₦) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 95000"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    required
                                    min="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Price (₦) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 75000"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    required
                                    min="100"
                                />
                                {formData.originalPrice && formData.discountPrice && (
                                    <p className="text-xs mt-1 text-green-600">
                                        Discount: {Math.round(((parseInt(formData.originalPrice) - parseInt(formData.discountPrice)) / parseInt(formData.originalPrice)) * 100)}% OFF
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                >
                                    {units.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Available
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="e.g. 50"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Emoji
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {emojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                                        className={`text-2xl p-2 rounded-lg transition ${
                                            formData.image === emoji ? 'bg-spark-100 border-2 border-spark-500' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe your product (quality, origin, features...)"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-spark-400 to-spark-600 hover:from-spark-500 hover:to-spark-700'
                            }`}
                        >
                            {loading ? 'Submitting...' : '📤 Submit for Approval'}
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                            ⏳ Your product will be reviewed by an admin before appearing in the marketplace
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}