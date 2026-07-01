// src/pages/Marketplace/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, setAuthToken } from '../../services/api';
import { auth } from '../../services/firebase';
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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [balance, setBalance] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Load cart from localStorage on mount
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

    // ✅ Listen for cart updates from other pages
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

    useEffect(() => {
        loadData();
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

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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

    // ✅ Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('thespark_cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('thespark_cart');
        }
    }, [cart]);

    const addToCart = (product) => {
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
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        toast.info('Item removed from cart');
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const product = products.find(p => p.id === productId);
        if (newQuantity > product.stock) {
            toast.error('Not enough stock');
            return;
        }
        const updatedCart = cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCart(updatedCart);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    };

    const checkout = async () => {
        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        if (isProcessing) {
            toast.error('Please wait, your order is being processed');
            return;
        }

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
            const result = await createOrder(cart, total, deliveryAddress);
            
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {!user && (
                    <div className="rounded-2xl p-6 mb-6 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-lg font-bold text-gray-800">Welcome to TheSpark Market!</h3>
                            <p className="text-sm text-gray-600 mt-1">Create an account to start shopping and save money</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🛒 TheSpark Food Market</h1>
                        <p className="text-sm text-gray-500">Buy quality food items at wholesale discount prices</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {user && (
                            <>
                                <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                                    <span className="text-xs text-gray-500">Wallet Balance</span>
                                    <p className="text-lg font-bold text-spark-600">{formatPrice(balance)}</p>
                                </div>
                                <Link 
                                    to="/marketplace/sell" 
                                    className="px-4 py-2 bg-gradient-to-r from-spark-400 to-spark-600 hover:from-spark-500 hover:to-spark-700 text-white text-sm font-medium rounded-xl transition shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                    📦 Sell
                                </Link>
                            </>
                        )}
                        <button
                            onClick={openCart}
                            className="relative bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 hover:border-spark-300 transition flex items-center gap-2"
                        >
                            <span className="text-2xl">🛒</span>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Cart</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-spark-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                 {cart.length} 
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {categories.filter(c => c !== 'all').slice(0, 4).map(cat => {
                        const count = products.filter(p => p.category === cat).length;
                        const icons = {
                            'grains': '🌾',
                            'garri': '🌽', 
                            'beans': '🫘',
                            'oils': '🫒',
                            'others': '🧂'
                        };
                        return (
                            <div key={cat} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                                <span className="text-2xl block mb-1">{icons[cat] || '📦'}</span>
                                <p className="text-sm font-semibold capitalize">{cat}</p>
                                <p className="text-xs text-gray-400">{count} items</p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    <CategoryFilter 
                        categories={categories} 
                        selectedCategory={selectedCategory} 
                        onCategoryChange={setSelectedCategory} 
                    />
                </div>

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
                />
            )}
        </div>
    );
}