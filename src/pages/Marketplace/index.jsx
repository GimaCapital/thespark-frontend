// src/pages/Marketplace/index.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { getProducts, createOrder } from '../../services/marketplace';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import CartModal from './components/CartModal';

export default function Marketplace() {
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    
    // ✅ State Management
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [balance, setBalance] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [sortBy, setSortBy] = useState('popularity');
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const filterRef = useRef(null);

    // ✅ Responsive
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('thespark_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                setCart([]);
            }
        }
    }, []);

    // ✅ Listen for cart updates
    useEffect(() => {
        const handleCartUpdate = () => {
            const savedCart = localStorage.getItem('thespark_cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    setCart([]);
                }
            }
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // ✅ Load data
    useEffect(() => {
        loadData();
    }, []);

    // ✅ Filter and sort products with useMemo for performance
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term)
            );
        }

        // Price range
        result = result.filter(p => 
            p.discountPrice >= priceRange.min && 
            p.discountPrice <= (priceRange.max === Infinity ? Number.MAX_SAFE_INTEGER : priceRange.max)
        );

        // Stock filter
        if (inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        // Wishlist filter
        if (isWishlist) {
            result = result.filter(p => wishlist.includes(p.id));
        }

        // Sorting
        switch (sortBy) {
            case 'price_low':
                result.sort((a, b) => a.discountPrice - b.discountPrice);
                break;
            case 'price_high':
                result.sort((a, b) => b.discountPrice - a.discountPrice);
                break;
            case 'discount':
                result.sort((a, b) => ((b.originalPrice - b.discountPrice) / b.originalPrice) - 
                                   ((a.originalPrice - a.discountPrice) / a.originalPrice));
                break;
            case 'popularity':
            default:
                // Maintain original order
                break;
        }

        return result;
    }, [products, selectedCategory, searchTerm, priceRange, inStockOnly, sortBy, wishlist, isWishlist]);

    // ✅ Update filteredProducts when filteredAndSortedProducts changes
    useEffect(() => {
        setFilteredProducts(filteredAndSortedProducts);
    }, [filteredAndSortedProducts]);

    // ✅ Scroll handler for sticky filter
    useEffect(() => {
        const handleScroll = () => {
            if (filterRef.current) {
                const rect = filterRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const productsData = await getProducts();
            setProducts(productsData);
            
            if (user) {
                await loadUserBalance();
                if (userData?.deliveryAddress) {
                    setDeliveryAddress(userData.deliveryAddress);
                }
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load marketplace');
        } finally {
            setLoading(false);
        }
    };

    const loadUserBalance = async () => {
        try {
            if (!user) return;
            const idToken = await user.getIdToken();
            setAuthToken(idToken);
            const response = await api.get('/users/me');
            setBalance(response.data.currentBalance || 0);
            if (response.data.deliveryAddress) {
                setDeliveryAddress(response.data.deliveryAddress);
            }
        } catch (error) {
            console.error('Failed to load balance:', error);
        }
    };

    const categories = ['all', ...new Set(products.map(p => p.category))];

    const requireAuth = () => {
        if (!user) {
            toast.error(
                (t) => (
                    <div className="max-w-xs p-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🔒</span>
                            <p className="font-semibold text-gray-800">Login Required</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Create an account or login to start shopping
                        </p>
                        <div className="flex gap-2">
                            <Link
                                to="/login"
                                onClick={() => toast.dismiss(t.id)}
                                className="flex-1 text-center px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-lg transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => toast.dismiss(t.id)}
                                className="flex-1 text-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                ),
                { duration: 6000 }
            );
            return false;
        }
        return true;
    };

    // ✅ Save cart to localStorage
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('thespark_cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('thespark_cart');
        }
    }, [cart]);

    // ✅ Cart Functions
    const addToCart = useCallback((product) => {
        if (!requireAuth()) return;

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                const updatedCart = cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                setCart(updatedCart);
                toast.success(`Added another ${product.name} to cart`);
            } else {
                toast.error('Not enough stock available');
            }
        } else {
            const newCart = [...cart, { ...product, quantity: 1 }];
            setCart(newCart);
            toast.success(`${product.name} added to cart`);
        }
    }, [cart, user]);

    const removeFromCart = useCallback((productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        toast.info('Item removed from cart');
    }, [cart]);

    const updateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const product = products.find(p => p.id === productId);
        if (product && newQuantity > product.stock) {
            toast.error('Not enough stock');
            return;
        }
        const updatedCart = cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCart(updatedCart);
    }, [cart, products, removeFromCart]);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
        setDeliveryAddress(fullAddress);
    };

    // ✅ Checkout
    const checkout = async () => {
        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        if (isProcessing) return;

        if (cart.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        const total = getTotalPrice();
        if (total > balance) {
            toast.error(`Insufficient balance. You need ₦${total.toLocaleString()} but have ₦${balance.toLocaleString()}`);
            return;
        }

        setIsProcessing(true);

        try {
            const result = await createOrder(cart, total, deliveryAddress, selectedAddress?.id);
            
            if (result.success) {
                setCart([]);
                localStorage.removeItem('thespark_cart');
                setShowCart(false);
                await loadUserBalance();
                
                toast.success(
                    (t) => (
                        <div className="max-w-xs">
                            <p className="font-semibold text-green-700">🎉 Order Placed Successfully!</p>
                            <p className="text-sm text-green-600">Total: ₦{total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Order ID: {result.orderId}</p>
                            <p className="text-xs text-gray-500">📦 Delivery within 24-48 hours</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                        navigate('/orders');
                                    }}
                                    className="px-4 py-1.5 bg-spark-500 hover:bg-spark-600 text-white text-sm font-medium rounded-lg transition"
                                >
                                    📦 View Order & Track
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    ),
                    { duration: 8000 }
                );
            }
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to place order. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    const openCart = () => {
        if (!user) {
            toast.error('Please login to view your cart');
            navigate('/login');
            return;
        }
        setShowCart(true);
    };

    // ✅ Toggle wishlist
    const toggleWishlist = useCallback((productId) => {
        setWishlist(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    }, []);

    // ✅ Clear all filters
    const clearAllFilters = () => {
        setSelectedCategory('all');
        setSearchTerm('');
        setPriceRange({ min: 0, max: Infinity });
        setInStockOnly(false);
        setIsWishlist(false);
        setSortBy('popularity');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* ✅ Hero Banner */}
            <div className="relative bg-gradient-to-r from-spark-600 to-spark-800 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                                🛒 TheSpark Market
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                                Buy quality food items at wholesale discount prices. Support local producers and save money.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {user ? (
                                <>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                        <span className="text-sm text-white/80">Wallet Balance</span>
                                        <p className="text-2xl font-bold">{formatPrice(balance)}</p>
                                    </div>
                                    <Link 
                                        to="/marketplace/sell" 
                                        className="px-6 py-3 bg-white text-spark-600 hover:bg-gray-100 font-semibold rounded-xl transition shadow-lg hover:shadow-xl whitespace-nowrap"
                                    >
                                        📦 Start Selling
                                    </Link>
                                </>
                            ) : (
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                    <span className="text-sm text-white/80">Welcome to TheSpark Market</span>
                                    <p className="text-lg font-bold">Sign up to start shopping</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Statistics Bar */}
            <div className="bg-white border-b border-gray-200 py-3 px-4">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-spark-600">{products.length}</p>
                        <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-spark-600">
                            {categories.filter(c => c !== 'all').length}
                        </p>
                        <p className="text-xs text-gray-500">Categories</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-spark-600">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                        <p className="text-xs text-gray-500">Items in Cart</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-spark-600">
                            {user ? '✅' : '🔓'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user ? 'Active' : 'Sign Up'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ✅ Sticky Filter Bar */}
            <div 
                ref={filterRef}
                className={`sticky top-0 z-30 bg-white border-b border-gray-200 transition-shadow duration-300 ${
                    isSticky ? 'shadow-md' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* ✅ Cart Button (View Mode Toggle Removed) */}
                            <button
                                onClick={openCart}
                                className="relative bg-spark-50 hover:bg-spark-100 rounded-xl px-4 py-2 border border-spark-200 transition flex items-center gap-2"
                            >
                                <span className="text-xl">🛒</span>
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Cart</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-spark-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-lg transition ${showFilters ? 'bg-spark-100 text-spark-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                🔍
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <CategoryFilter 
                            categories={categories} 
                            selectedCategory={selectedCategory} 
                            onCategoryChange={setSelectedCategory} 
                        />
                    </div>
                </div>
            </div>

            {/* ✅ Advanced Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 py-4 px-4 shadow-inner">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Price Range */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                        value={priceRange.min || ''}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                        value={priceRange.max === Infinity ? '' : priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : Infinity })}
                                    />
                                </div>
                            </div>
                            {/* Sort By */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
                                <select
                                    className="w-full px-3 py-1 border border-gray-200 rounded-lg text-sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="discount">Best Discount</option>
                                </select>
                            </div>
                            {/* Stock Filter */}
                            <div className="flex items-center">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-4 h-4 text-spark-500 rounded"
                                    />
                                    In Stock Only
                                </label>
                            </div>
                            {/* Wishlist Filter */}
                            <div className="flex items-center">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isWishlist}
                                        onChange={(e) => setIsWishlist(e.target.checked)}
                                        className="w-4 h-4 text-spark-500 rounded"
                                    />
                                    ❤️ Wishlist ({wishlist.length})
                                </label>
                            </div>
                        </div>
                        <div className="mt-3 text-right">
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-spark-500 hover:text-spark-600 font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {filteredProducts.length} Products
                            {selectedCategory !== 'all' && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    in {selectedCategory}
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Sort by:</span>
                        <select 
                            className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-spark-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popularity">Popularity</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="discount">Best Discount</option>
                        </select>
                    </div>
                </div>

                {/* ✅ Product Grid (List View Removed) */}
                <ProductGrid products={filteredProducts} />
            </div>

            {showCart && user && (
                <CartModal
                    cart={cart}
                    onClose={() => setShowCart(false)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onCheckout={checkout}
                    balance={balance}
                    isProcessing={isProcessing}
                    deliveryAddress={deliveryAddress}
                    setDeliveryAddress={setDeliveryAddress}
                    selectedAddress={selectedAddress}
                    onAddressSelect={handleAddressSelect}
                />
            )}
        </div>
    );
}