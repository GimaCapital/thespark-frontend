// src/pages/Marketplace/Sell/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { api, setAuthToken } from '../../../services/api';
import { auth, db } from '../../../services/firebase';
import { getMyProducts } from '../../../services/marketplace';
import { uploadToCloudinary, compressImage } from '../../../services/cloudinaryService';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import HeaderMissionCard from '../../../components/Common/HeaderMissionCard';
import { allCategories } from './constants/categories';
import { commonUnits } from './constants/units';
import { productNames } from './constants/productNames';
import toast from 'react-hot-toast';
import { Tooltip } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { LoadingOutlined, UploadOutlined, DeleteOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default function SellProduct() {
    // ============================================================
    // AUTHENTICATION & NAVIGATION
    // ============================================================
    const { user, userData } = useAuth();
    const navigate = useNavigate();

    // ============================================================
    // LOADING STATES
    // ============================================================
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // ============================================================
    // USER PRODUCTS
    // ============================================================
    const [userProducts, setUserProducts] = useState([]);

    // ============================================================
    // STOCK PHOTOS
    // ============================================================
    const [stockPhotos, setStockPhotos] = useState([]);
    const [selectedStockPhoto, setSelectedStockPhoto] = useState(null);

    // ============================================================
    // IMAGE UPLOAD
    // ============================================================
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);

    // ============================================================
    // CATEGORY SEARCH
    // ============================================================
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // ============================================================
    // UNIT SEARCH
    // ============================================================
    const [unitSuggestions, setUnitSuggestions] = useState([]);
    const [filteredUnits, setFilteredUnits] = useState([]);
    const [unitInput, setUnitInput] = useState('');
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);
    const unitDropdownRef = useRef(null);

    // ============================================================
    // CONSTANTS
    // ============================================================
    const categories = allCategories;
    const units = commonUnits;

    // Product name suggestions
    const [filteredProductNames, setFilteredProductNames] = useState([]);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const productDropdownRef = useRef(null);

    // ============================================================
    // FORM DATA
    // ============================================================
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        originalPrice: '',
        discountPrice: '',
        description: '',
        unit: '',
        stock: '',
        image: null,
        imageSource: null,
        productId: null // Track if editing existing product
    });

    // ============================================================
    // LIFECYCLE
    // ============================================================
    useEffect(() => {
        loadUserProducts();
        loadCategories();
        loadUnits();
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
                setShowUnitDropdown(false);
            }
            if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
                setShowProductDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ============================================================
    // LOAD FUNCTIONS
    // ============================================================
    const loadCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'categories'));
            const categoriesData = [];
            snapshot.forEach(doc => {
                categoriesData.push(doc.data().name);
            });
            if (categoriesData.length > 0) {
                const merged = [...new Set([...allCategories, ...categoriesData])];
                console.log(`✅ ${merged.length} total categories available`);
            } else {
                console.log(`✅ ${allCategories.length} categories loaded from constants`);
            }
        } catch (error) {
            console.log(`✅ ${allCategories.length} categories loaded from constants`);
        }
    };

    const loadUnits = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'units'));
            const unitsData = [];
            snapshot.forEach(doc => {
                unitsData.push(doc.data().label);
            });
            const allUnits = [...new Set([...commonUnits, ...unitsData])];
            setUnitSuggestions(allUnits);
        } catch (error) {
            console.error('Error loading units:', error);
            setUnitSuggestions(commonUnits);
        }
    };

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

    const loadStockPhotos = async (category) => {
        try {
            const q = query(
                collection(db, 'stockPhotos'),
                where('category', '==', category),
                where('isActive', '==', true)
            );
            const snapshot = await getDocs(q);
            const photos = [];
            snapshot.forEach(doc => {
                photos.push({ id: doc.id, ...doc.data() });
            });
            setStockPhotos(photos);
            
            if (!formData.image) {
                const defaultPhoto = photos.find(p => p.isDefault);
                if (defaultPhoto) {
                    setSelectedStockPhoto(defaultPhoto);
                    setFormData(prev => ({
                        ...prev,
                        image: defaultPhoto.url,
                        imageSource: 'stock'
                    }));
                    setImageError(false);
                }
            }
        } catch (error) {
            console.error('Failed to load stock photos:', error);
        }
    };

    // ============================================================
    // PRODUCT NAME HANDLERS
    // ============================================================
    const handleProductNameChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, name: value }));
        setShowProductDropdown(value.length > 0);
        
        if (value.length > 0) {
            const filtered = productNames.filter(name => 
                name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProductNames(filtered.slice(0, 10));
        } else {
            setFilteredProductNames([]);
        }
    };

    const selectProductName = (name) => {
        setFormData(prev => ({ ...prev, name: name }));
        setShowProductDropdown(false);
    };

    // ============================================================
    // CATEGORY SEARCH HANDLERS
    // ============================================================
    const handleCategorySearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFormData(prev => ({ ...prev, category: value }));
        setShowDropdown(value.length > 0);
        
        if (value.length > 0) {
            const filtered = categories.filter(cat => 
                cat.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCategories(filtered.slice(0, 10));
        } else {
            setFilteredCategories([]);
        }
    };

    const selectCategory = (category) => {
        setSearchTerm(category);
        setFormData(prev => ({ ...prev, category: category }));
        setShowDropdown(false);
    };

    // ============================================================
    // UNIT SEARCH HANDLERS
    // ============================================================
    const handleUnitChange = (e) => {
        const value = e.target.value;
        setUnitInput(value);
        setFormData(prev => ({ ...prev, unit: value }));
        setShowUnitDropdown(value.length > 0);
        
        if (value.length > 0) {
            const filtered = unitSuggestions.filter(unit => 
                unit.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUnits(filtered.slice(0, 10));
        } else {
            setFilteredUnits([]);
        }
    };

    const selectUnit = (unit) => {
        setUnitInput(unit);
        setFormData(prev => ({ ...prev, unit: unit }));
        setShowUnitDropdown(false);
    };

    // ============================================================
    // SAVE NEW UNIT
    // ============================================================
    const saveNewUnit = async (unit) => {
        if (!unit || unit.trim().length === 0) return;
        
        try {
            const existing = unitSuggestions.find(u => 
                u.toLowerCase() === unit.toLowerCase()
            );
            
            if (!existing) {
                await addDoc(collection(db, 'units'), {
                    label: unit.trim(),
                    createdAt: new Date().toISOString()
                });
                setUnitSuggestions(prev => [...prev, unit.trim()]);
                console.log(`✅ New unit saved: ${unit}`);
            }
        } catch (error) {
            console.error('Failed to save unit:', error);
        }
    };

    // ============================================================
    // IMAGE UPLOAD HANDLERS
    // ============================================================
    const handleImageFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setUploading(true);
        setImageError(false);
        
        try {
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            
            const compressedFile = await compressImage(file, 800, 800, 0.8);
            const url = await uploadToCloudinary(compressedFile, 'products');
            
            if (url) {
                setFormData(prev => ({
                    ...prev,
                    image: url,
                    imageSource: 'user'
                }));
                setSelectedStockPhoto(null);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload image. Please try again.');
                setImagePreview(null);
                setImageFile(null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            setImagePreview(null);
            setImageFile(null);
        } finally {
            setUploading(false);
        }
    };

    const selectStockPhoto = (photo) => {
        setSelectedStockPhoto(photo);
        setImageFile(null);
        setImagePreview(null);
        setImageError(false);
        setFormData(prev => ({
            ...prev,
            image: photo.url,
            imageSource: 'stock'
        }));
        toast.success('Stock photo selected');
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imageSource: null
        }));
        setSelectedStockPhoto(null);
        setImageFile(null);
        setImagePreview(null);
        setImageError(false);
    };

    // ============================================================
    // FORM HANDLERS
    // ============================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ============================================================
    // EDIT PRODUCT (Rejected products only)
    // ============================================================
    const handleEditProduct = (product) => {
        setFormData({
            name: product.name || '',
            category: product.category || '',
            originalPrice: product.originalPrice || '',
            discountPrice: product.discountPrice || '',
            description: product.description || '',
            unit: product.unit || '',
            stock: product.stock || '',
            image: product.image || null,
            imageSource: product.imageSource || null,
            productId: product.id
        });
        setSearchTerm(product.category || '');
        setUnitInput(product.unit || '');
        
        // Scroll to form
        document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth' });
        toast.info('✏️ Edit your product and resubmit for approval');
    };

    // ============================================================
    // SUBMIT PRODUCT (New or Edit)
    // ============================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // -------- VALIDATION --------
        if (!formData.name || formData.name.trim().length < 3) {
            toast.error('Product name must be at least 3 characters');
            document.getElementById('product-name')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        if (!formData.category) {
            toast.error('Please enter a product category');
            document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        if (!formData.unit) {
            toast.error('Please enter a product unit');
            document.getElementById('unit-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        if (!formData.originalPrice || parseInt(formData.originalPrice) < 100) {
            toast.error('Original price must be at least ₦100');
            document.getElementById('price-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (!formData.discountPrice || parseInt(formData.discountPrice) < 100) {
            toast.error('Discount price must be at least ₦100');
            document.getElementById('price-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (parseInt(formData.discountPrice) >= parseInt(formData.originalPrice)) {
            toast.error('Discount price must be less than original price');
            document.getElementById('price-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        if (!formData.description || formData.description.trim().length < 10) {
            toast.error('Description must be at least 10 characters');
            document.getElementById('description-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!formData.image) {
            toast.error('Please upload a product image or select a stock photo');
            document.getElementById('image-upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setImageError(true);
            return;
        }
        
        // -------- SAVE NEW UNIT --------
        await saveNewUnit(formData.unit);
        
        // -------- SUBMIT --------
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            setAuthToken(idToken);
            
            const payload = {
                ...formData,
                originalPrice: parseInt(formData.originalPrice),
                discountPrice: parseInt(formData.discountPrice),
                stock: parseInt(formData.stock) || 0,
                image: formData.image,
                imageSource: formData.imageSource
            };
            
            let response;
            
            // Check if editing existing product
            if (formData.productId) {
                // ✅ EDITING existing product (resubmit)
                response = await api.put(`/marketplace/products/update/${formData.productId}`, payload);
                if (response.data.success) {
                    toast.success('✅ Product updated and resubmitted for approval!');
                    // Reset form
                    setFormData({
                        name: '',
                        category: '',
                        originalPrice: '',
                        discountPrice: '',
                        description: '',
                        unit: '',
                        stock: '',
                        image: null,
                        imageSource: null,
                        productId: null
                    });
                    setSearchTerm('');
                    setUnitInput('');
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedStockPhoto(null);
                    setImageError(false);
                    loadUserProducts();
                }
            } else {
                // ✅ NEW product
                response = await api.post('/marketplace/products/submit', payload);
                if (response.data.success) {
                    toast.success('✅ Product submitted for admin approval!');
                    setFormData({
                        name: '',
                        category: '',
                        originalPrice: '',
                        discountPrice: '',
                        description: '',
                        unit: '',
                        stock: '',
                        image: null,
                        imageSource: null,
                        productId: null
                    });
                    setSearchTerm('');
                    setUnitInput('');
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedStockPhoto(null);
                    setImageError(false);
                    loadUserProducts();
                }
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            toast.error(error.response?.data?.error || 'Failed to submit product');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // DELETE PRODUCT
    // ============================================================
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

    // ============================================================
    // UI HELPERS
    // ============================================================
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { color: 'bg-yellow-100 text-yellow-700', label: '⏳ Pending Approval' },
            'approved': { color: 'bg-green-100 text-green-700', label: '✅ Approved' },
            'rejected': { color: 'bg-red-100 text-red-700', label: '❌ Rejected' }
        };
        return statusMap[status] || statusMap['pending'];
    };

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="bg-gray-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* ========== HEADER ========== */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📦 Sell on TheSpark</h1>
                        <p className="text-sm text-gray-500">List your food items for sale at wholesale prices</p>
                    </div>
                    <Link to="/marketplace" className="text-spark-500 hover:text-spark-600 text-sm font-medium">
                        ← Back to Marketplace
                    </Link>
                </div>

                {/* ========== USER'S LISTINGS ========== */}
                <div className="mb-8">
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
                                    <div key={product.id} className="bg-white rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                {product.image && product.image !== '📦' ? (
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `<span class="text-3xl">📦</span>`;
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-3xl">📦</span>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-500">₦{product.discountPrice?.toLocaleString()}</p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    {product.status === 'rejected' && product.rejectionReason && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Reason: {product.rejectionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 ml-2 flex-shrink-0">
                                                {product.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="text-spark-500 hover:text-spark-700 text-xs px-2 py-1 border border-spark-200 rounded-lg whitespace-nowrap"
                                                        title="Edit and resubmit"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                )}
                                                {(product.status === 'pending' || product.status === 'rejected') && (
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                        title="Delete product"
                                                    >
                                                        ✕
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

                {/* ========== LIST NEW PRODUCT FORM ========== */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" id="edit-form">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {formData.productId ? '✏️ Edit & Resubmit Product' : '📦 List New Product'}
                    </h2>
                    {formData.productId && (
                        <div className="text-sm text-amber-600 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                            ⚠️ You are editing a rejected product. Please fix the issues and resubmit.
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* -------- PRODUCT NAME -------- */}
                        <div id="product-name" className="relative" ref={productDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleProductNameChange}
                                onFocus={() => formData.name.length > 0 && setShowProductDropdown(true)}
                                placeholder="e.g. Premium Parboiled Rice, Mama Gold Rice..."
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
                                required
                            />
                            {showProductDropdown && filteredProductNames.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {filteredProductNames.map((name, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectProductName(name)}
                                            className="w-full text-left px-4 py-2 hover:bg-spark-50 transition text-sm"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                💡 Start typing to search (300+ product names available)
                            </p>
                        </div>

                        {/* -------- CATEGORY -------- */}
                        <div id="category-section">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <div className="relative">
                                    <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleCategorySearch}
                                        onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
                                        placeholder="Search for a category (e.g. Rice, Garri, Beans, Mango...)"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
                                    />
                                </div>

                                {showDropdown && filteredCategories.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {filteredCategories.map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => selectCategory(category)}
                                                className="w-full text-left px-4 py-2 hover:bg-spark-50 transition text-sm"
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                💡 Start typing to search (1500+ categories available)
                            </p>
                        </div>

                        {/* -------- PRICE SECTION -------- */}
                        <div id="price-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
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
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
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

                        {/* -------- UNIT & STOCK -------- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div id="unit-section">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <div className="relative" ref={unitDropdownRef}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={unitInput}
                                            onChange={handleUnitChange}
                                            onFocus={() => unitInput.length > 0 && setShowUnitDropdown(true)}
                                            placeholder="e.g. 50kg bag, 5 liters, piece..."
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
                                        />
                                        <Tooltip title="Enter your unit. If not found, it will be saved automatically.">
                                            <InfoCircleOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-help" />
                                        </Tooltip>
                                    </div>

                                    {showUnitDropdown && filteredUnits.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {filteredUnits.map((unit, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => selectUnit(unit)}
                                                    className="w-full text-left px-4 py-2 hover:bg-spark-50 transition text-sm"
                                                >
                                                    {unit}
                                                </button>
                                            ))}
                                            {filteredUnits.length === 0 && unitInput.length > 0 && (
                                                <div className="px-4 py-3 text-sm text-gray-500">
                                                    No matches found. Type your unit and it will be saved.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    💡 Type your unit (e.g. 50kg bag, 5 liters, piece). New units are saved automatically.
                                </p>
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
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* -------- DESCRIPTION -------- */}
                        <div id="description-section">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe your product (quality, origin, features...)"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-spark-500 focus:border-transparent transition"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
                        </div>

                        {/* -------- IMAGE UPLOAD -------- */}
                        <div id="image-upload-section" className="border-t border-gray-200 pt-4 mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📸 Product Image <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-400 mb-3">Upload a photo or choose from stock</p>

                            {imagePreview ? (
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img 
                                            src={imagePreview} 
                                            alt="Product preview" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition shadow-md"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Your Photo</p>
                                        {imageFile && (
                                            <p className="text-xs text-gray-400">
                                                {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                                            </p>
                                        )}
                                        <p className="text-xs text-green-600 mt-1">✅ Image uploaded successfully</p>
                                    </div>
                                </div>
                            ) : formData.image && formData.imageSource === 'stock' ? (
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img 
                                            src={formData.image} 
                                            alt="Stock photo" 
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition shadow-md"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">📸 Stock Photo</p>
                                        <p className="text-xs text-blue-600 mt-1">✅ Stock photo selected</p>
                                    </div>
                                </div>
                            ) : (
                                <div className={`flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-xl transition ${
                                    imageError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                }`}>
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingOutlined className="animate-spin text-spark-500" />
                                            <span className="text-sm text-gray-500">Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadOutlined className="text-3xl text-gray-400" />
                                            <p className="text-sm text-gray-500">Drop your image here</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, WebP (Max 5MB)</p>
                                            {imageError && (
                                                <p className="text-xs text-red-500 font-medium mt-1">
                                                    ⚠️ Please upload a photo or select a stock photo
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 mt-3">
                                <label className={`px-4 py-2 text-white rounded-lg transition cursor-pointer text-sm ${
                                    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-spark-500 hover:bg-spark-600'
                                }`}>
                                    {uploading ? 'Uploading...' : '📤 Upload Your Photo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileSelect}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            {stockPhotos.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-2">🖼️ Choose from stock photos:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stockPhotos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                                                    selectedStockPhoto?.id === photo.id
                                                        ? 'border-spark-500 ring-2 ring-spark-200'
                                                        : 'border-gray-200 hover:border-spark-300'
                                                }`}
                                                onClick={() => selectStockPhoto(photo)}
                                            >
                                                <img 
                                                    src={photo.url} 
                                                    alt="Stock" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {!formData.image && (
                                <p className="text-xs text-red-500 mt-2 font-medium">
                                    ⚠️ Required: Upload a photo or select a stock photo
                                </p>
                            )}
                        </div>

                        {/* -------- SUBMIT BUTTON -------- */}
                        <button
                            type="submit"
                            disabled={loading || !formData.image}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                                loading || !formData.image
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : formData.productId
                                        ? 'bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg'
                                        : 'bg-gradient-to-r from-spark-400 to-spark-600 hover:from-spark-500 hover:to-spark-700 shadow-md hover:shadow-lg'
                            }`}
                        >
                            {loading ? 'Submitting...' : formData.productId ? '📤 Resubmit for Approval' : '📤 Submit for Approval'}
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