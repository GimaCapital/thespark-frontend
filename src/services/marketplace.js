// // src/services/marketplace.js
import { api, setAuthToken } from './api';
import { auth } from './firebase';

// ============ PRODUCTS (Public) ============

// Get all approved products - PUBLIC (no auth required)
export const getProducts = async () => {
    try {
        // Check if user is authenticated
        const user = auth.currentUser;
        if (user) {
            // If authenticated, include token
            const token = await user.getIdToken();
            setAuthToken(token);
        }
        // If not authenticated, still make the request without token
        const response = await api.get('/marketplace/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get single product - PUBLIC (no auth required)
export const getProduct = async (productId) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            setAuthToken(token);
        }
        const response = await api.get(`/marketplace/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Get products by category - PUBLIC (no auth required)
export const getProductsByCategory = async (category) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            setAuthToken(token);
        }
        const response = await api.get(`/marketplace/products/category/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// Search products - PUBLIC (no auth required)
export const searchProducts = async (query) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            setAuthToken(token);
        }
        const response = await api.get(`/marketplace/products/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// ============ PRODUCTS (Authenticated) ============

// Get user's own products - REQUIRES AUTH
export const getMyProducts = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view your products');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get('/marketplace/my-products');
        return response.data;
    } catch (error) {
        console.error('Error fetching user products:', error);
        throw error;
    }
};

// Submit a product - REQUIRES AUTH
export const submitProduct = async (productData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to submit a product');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.post('/marketplace/products/submit', productData);
        return response.data;
    } catch (error) {
        console.error('Error submitting product:', error);
        throw error;
    }
};

// Update a product - REQUIRES AUTH
export const updateProduct = async (productId, productData) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to update a product');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.put(`/marketplace/products/update/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete a product - REQUIRES AUTH
export const deleteProduct = async (productId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to delete a product');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.delete(`/marketplace/products/delete/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// ============ ORDERS (All require authentication) ============

// Create an order (checkout) - REQUIRES AUTH
export const createOrder = async (items, total, deliveryAddress) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to place an order');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.post('/marketplace/orders', {
            items,
            total,
            deliveryAddress
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Get all user orders - REQUIRES AUTH
export const getOrders = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view orders');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get('/marketplace/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Get a single order - REQUIRES AUTH
export const getOrder = async (orderId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view order details');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get(`/marketplace/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

// Cancel an order - REQUIRES AUTH
export const cancelOrder = async (orderId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to cancel an order');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.delete(`/marketplace/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
    }
};

// ============ ADMIN (All require authentication + admin role) ============

// Get pending products (admin only)
export const getPendingProducts = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view pending products');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get('/marketplace/admin/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending products:', error);
        throw error;
    }
};

// Approve a product (admin only)
export const approveProduct = async (productId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to approve products');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.post(`/marketplace/admin/approve/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error approving product:', error);
        throw error;
    }
};

// Reject a product (admin only)
export const rejectProduct = async (productId, reason) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to reject products');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.post(`/marketplace/admin/reject/${productId}`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error rejecting product:', error);
        throw error;
    }
};

// Get all orders (admin only)
export const getAllOrders = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view all orders');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get('/marketplace/admin/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId, stage) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to update order status');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.put(`/marketplace/orders/${orderId}/status`, { stage });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// Get marketplace stats (admin only)
export const getMarketplaceStats = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('You must be logged in to view marketplace stats');
        const token = await user.getIdToken();
        setAuthToken(token);
        const response = await api.get('/marketplace/admin/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching marketplace stats:', error);
        throw error;
    }
};

// ============ CATEGORIES (Public) ============

// Get categories - PUBLIC (no auth required)
export const getCategories = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            setAuthToken(token);
        }
        const response = await api.get('/marketplace/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};