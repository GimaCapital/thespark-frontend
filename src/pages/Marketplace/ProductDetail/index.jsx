// src/pages/Marketplace/ProductDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { createOrder } from '../../../services/marketplace'; // ✅ Added
import HeaderMissionCard from '../../../components/Common/HeaderMissionCard';
import toast from 'react-hot-toast';
import { 
    ShoppingCartOutlined, 
    ArrowLeftOutlined, 
    TruckOutlined, 
    CheckCircleOutlined, 
    StarOutlined, 
    StarFilled, 
    UserOutlined, 
    ShopOutlined 
} from '@ant-design/icons';
import ProductReviews from './components/ProductReviews';
import CartModal from '../components/CartModal';

export default function ProductDetail() {
    const { productId } = useParams();
    const { user, userData } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [sellerRating, setSellerRating] = useState(0);
    const [sellerTotalReviews, setSellerTotalReviews] = useState(0);
    const [sellerJoinedDate, setSellerJoinedDate] = useState('Recently');
    const [productRating, setProductRating] = useState({
        averageRating: 0,
        totalRatings: 0
    });
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [balance, setBalance] = useState(0);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState(''); // ✅ Added

    // Load delivery address from user data
    useEffect(() => {
        if (user && userData?.deliveryAddress) {
            setDeliveryAddress(userData.deliveryAddress);
        }
    }, [user, userData]);

    // Load cart from localStorage on mount
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

    // Listen for cart updates
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

    const loadBalance = async () => {
        if (!user) return;
        try {
            const idToken = await user.getIdToken();
            const response = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${idToken}` }
            });
            setBalance(response.data.currentBalance || 0);
            if (response.data.deliveryAddress) {
                setDeliveryAddress(response.data.deliveryAddress);
            }
        } catch (error) {
            console.error('Failed to load balance:', error);
        }
    };

    useEffect(() => {
        loadProduct();
        if (user) {
            loadBalance();
        }
    }, [productId]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/marketplace/products/${productId}`);
            const productData = response.data;
            
            setProduct(productData);
            
            if (productData) {
                const sellerId = productData.sellerId || productData.userId;
                
                loadRelatedProducts(productData.category);
                loadSellerProducts(sellerId);
                loadSellerRating(sellerId);
                loadProductRatings(productId);
            }
        } catch (error) {
            console.error('Failed to load product:', error);
            toast.error('Product not found');
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
    };

    const loadProductRatings = async (productId) => {
        try {
            const response = await api.get(`/marketplace/products/${productId}/ratings`);
            if (response.data.success) {
                setProductRating({
                    averageRating: response.data.averageRating || 0,
                    totalRatings: response.data.totalRatings || 0
                });
            }
        } catch (error) {
            console.error('Failed to load product ratings:', error);
        }
    };

    const loadRelatedProducts = async (category) => {
        try {
            const response = await api.get('/marketplace/products');
            const allProducts = response.data || [];
            
            const related = allProducts
                .filter(p => p.category === category && p.id !== productId && p.status === 'approved')
                .slice(0, 4);
            
            setRelatedProducts(related);
        } catch (error) {
            console.error('Failed to load related products:', error);
            setRelatedProducts([]);
        }
    };

    const loadSellerProducts = async (sellerId) => {
        if (!sellerId) {
            setSellerProducts([]);
            return;
        }
        
        try {
            const response = await api.get('/marketplace/products');
            const allProducts = response.data || [];
            
            const sellerItems = allProducts
                .filter(p => (p.sellerId === sellerId || p.userId === sellerId) && p.id !== productId && p.status === 'approved')
                .slice(0, 4);
            
            setSellerProducts(sellerItems);
        } catch (error) {
            console.error('Failed to load seller products:', error);
            setSellerProducts([]);
        }
    };

    const loadSellerRating = async (sellerId) => {
        if (!sellerId) {
            setSellerRating(0);
            setSellerTotalReviews(0);
            setSellerJoinedDate('Recently');
            return;
        }
        
        try {
            const response = await api.get(`/marketplace/seller/${sellerId}/rating`);
            if (response.data.success) {
                const data = response.data.data;
                setSellerRating(data.averageRating || 0);
                setSellerTotalReviews(data.totalReviews || 0);
                setSellerJoinedDate(data.joinedDate ? new Date(data.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently');
            }
        } catch (error) {
            console.error('Failed to load seller rating:', error);
            setSellerRating(0);
            setSellerTotalReviews(0);
            setSellerJoinedDate('Recently');
        }
    };

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    // Add to cart with localStorage
    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (product.stock === 0) {
            toast.error('Product is out of stock');
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            discountPrice: product.discountPrice || product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            unit: product.unit,
            stock: product.stock,
            quantity: quantity
        };

        let currentCart = JSON.parse(localStorage.getItem('thespark_cart') || '[]');
        
        const existingIndex = currentCart.findIndex(item => item.id === cartItem.id);
        if (existingIndex > -1) {
            const newQuantity = currentCart[existingIndex].quantity + quantity;
            if (newQuantity > product.stock) {
                toast.error(`Only ${product.stock} units available`);
                return;
            }
            currentCart[existingIndex].quantity = newQuantity;
        } else {
            currentCart.push(cartItem);
        }
        
        localStorage.setItem('thespark_cart', JSON.stringify(currentCart));
        setCart(currentCart);
        
        toast.success(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('thespark_cart', JSON.stringify(updatedCart));
        toast.info('Item removed from cart');
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const updatedCart = cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCart(updatedCart);
        localStorage.setItem('thespark_cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
    };

    const getTotalSavings = () => {
        return cart.reduce((total, item) => 
            total + ((item.originalPrice - item.discountPrice) * item.quantity), 0
        );
    };

    const openCart = () => {
        if (!user) {
            toast.error('Please login to view your cart');
            navigate('/login');
            return;
        }
        setShowCart(true);
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
                await loadBalance();
                window.dispatchEvent(new Event('cartUpdated'));
                
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

    const renderStars = (rating = 0, showText = false) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<StarFilled key={i} className="text-yellow-400 text-sm" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="relative inline-block">
                        <StarOutlined className="text-yellow-400 text-sm" />
                        <span className="absolute inset-0 overflow-hidden w-1/2">
                            <StarFilled className="text-yellow-400 text-sm" />
                        </span>
                    </span>
                );
            } else {
                stars.push(<StarOutlined key={i} className="text-gray-300 text-sm" />);
            }
        }
        return (
            <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">{stars}</div>
                {showText && (
                    <span className="text-sm text-gray-600 ml-1">
                        {rating.toFixed(1)} ({productRating.totalRatings || 0} reviews)
                    </span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Product not found</p>
                <Link to="/marketplace" className="text-spark-500 hover:underline">← Back to Marketplace</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <HeaderMissionCard />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Header with Cart */}
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

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link to="/" className="hover:text-spark-500">Home</Link>
                    <span>/</span>
                    <Link to="/marketplace" className="hover:text-spark-500">Marketplace</Link>
                    <span>/</span>
                    <span className="text-gray-700">{product.category}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </div>

                {/* Back Button */}
                <Link to="/marketplace" className="inline-flex items-center gap-2 text-spark-500 hover:text-spark-600 text-sm mb-4">
                    <ArrowLeftOutlined />
                    Back to Marketplace
                </Link>

                {/* Product Main Section - Keep existing code */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
                        <div>
                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                {product.image && product.image !== '📦' ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-spark-50 to-amber-50">
                                        {product.emoji || '📦'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-spark-500 font-medium uppercase tracking-wider mb-1">
                                {product.category}
                            </span>
                            
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-2 mb-3">
                                {renderStars(productRating.averageRating, true)}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl md:text-3xl font-bold text-spark-600">
                                        {formatPrice(product.discountPrice || product.price)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.discountPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    {product.discount > 0 && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                {product.stock > 0 ? (
                                    <>
                                        <CheckCircleOutlined className="text-green-500" />
                                        <span className="text-sm text-green-600 font-medium">
                                            In Stock ({product.stock} available)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                                )}
                            </div>

                            <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <TruckOutlined className="text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Delivery Information</p>
                                    <p className="text-xs text-blue-600">Delivery within 24-48 hours</p>
                                    <p className="text-xs text-blue-500">Free delivery on orders above ₦10,000</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span className="text-gray-500">Unit</span>
                                    <span className="text-gray-900 font-medium">{product.unit}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span className="text-gray-500">Category</span>
                                    <span className="text-gray-900 font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span className="text-gray-500">Seller</span>
                                    <span className="text-gray-900 font-medium">{product.sellerName || 'TheSpark'}</span>
                                </div>
                            </div>

                            {product.stock > 0 && (
                                <div className="flex items-center gap-4 mb-4">
                                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                                    product.stock === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-spark-500 hover:bg-spark-600 shadow-md hover:shadow-lg'
                                }`}
                            >
                                <ShoppingCartOutlined />
                                {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice((product.discountPrice || product.price) * quantity)}`}
                            </button>

                            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                                <span>🔒 Secure Payment</span>
                                <span>•</span>
                                <span>✅ Verified Seller</span>
                                <span>•</span>
                                <span>🔄 Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== SELLER INFORMATION ========== */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShopOutlined className="text-spark-500" />
                        Seller Information
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-spark-100 flex items-center justify-center text-spark-500 text-xl font-bold">
                                {product.sellerName?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{product.sellerName || 'TheSpark'}</h4>
                                <div className="flex items-center gap-2 text-sm">
                                    {sellerRating > 0 ? (
                                        renderStars(sellerRating, true)
                                    ) : (
                                        <span className="text-gray-400">No ratings yet</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Joined {sellerJoinedDate}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500 ml-0 sm:ml-auto">
                            <div className="text-center">
                                <p className="font-bold text-gray-900">{sellerProducts.length + 1}</p>
                                <p>Products</p>
                            </div>
                            <div className="text-center border-l border-gray-200 pl-4">
                                <p className="font-bold text-gray-900">{sellerTotalReviews || 0}</p>
                                <p>Reviews</p>
                            </div>
                            <div className="text-center border-l border-gray-200 pl-4">
                                <p className="font-bold text-green-600">{sellerTotalReviews > 0 ? '98%' : 'N/A'}</p>
                                <p>Positive</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Product Description</h3>
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Product Specifications */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Product Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Product Name</span>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Category</span>
                            <span className="text-gray-900 font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Unit</span>
                            <span className="text-gray-900 font-medium">{product.unit}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Stock</span>
                            <span className="text-gray-900 font-medium">{product.stock} units</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Original Price</span>
                            <span className="text-gray-900 font-medium">{formatPrice(product.originalPrice)}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-500">Discount Price</span>
                            <span className="text-spark-600 font-bold">{formatPrice(product.discountPrice)}</span>
                        </div>
                        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded col-span-2">
                            <span className="text-gray-500">Seller</span>
                            <span className="text-gray-900 font-medium">{product.sellerName || 'TheSpark'}</span>
                        </div>
                    </div>
                </div>

                {/* Product Reviews */}
                <ProductReviews productId={product.id} />

                {/* More Items from Seller */}
                {sellerProducts.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <UserOutlined className="text-spark-500" />
                            More Items from {product.sellerName || 'This Seller'}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {sellerProducts.map((item) => (
                                <Link 
                                    key={item.id} 
                                    to={`/marketplace/product/${item.id}`}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group"
                                >
                                    <div className="h-32 bg-gray-100 overflow-hidden">
                                        {item.image && item.image !== '📦' ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-spark-50 to-amber-50">
                                                {item.emoji || '📦'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm text-gray-700 font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-spark-600 font-bold">
                                            {formatPrice(item.discountPrice || item.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛍️ You May Also Like</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.map((related) => (
                                <Link 
                                    key={related.id} 
                                    to={`/marketplace/product/${related.id}`}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group"
                                >
                                    <div className="h-32 bg-gray-100 overflow-hidden">
                                        {related.image && related.image !== '📦' ? (
                                            <img 
                                                src={related.image} 
                                                alt={related.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-spark-50 to-amber-50">
                                                {related.emoji || '📦'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm text-gray-700 font-medium truncate">{related.name}</p>
                                        <p className="text-xs text-spark-600 font-bold">
                                            {formatPrice(related.discountPrice || related.price)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Cart Modal */}
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