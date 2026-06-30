// src/services/imageService.js
import { auth, storage, ref, uploadBytes, getDownloadURL } from './firebase';
import toast from 'react-hot-toast';

/**
 * Upload a product image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} path - Optional custom path (default: 'products')
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadProductImage = async (file, path = 'products') => {
    if (!file) {
        toast.error('No file selected');
        return null;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or WebP image');
        return null;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            toast.error('You must be logged in to upload images');
            return null;
        }

        const timestamp = Date.now();
        const fileName = `${user.uid}_${timestamp}_${file.name}`;
        const storageRef = ref(storage, `${path}/${fileName}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);
        
        return downloadUrl;
    } catch (error) {
        console.error('Image upload error:', error);
        toast.error(error.message || 'Failed to upload image');
        return null;
    }
};

/**
 * Upload multiple product images
 * @param {File[]} files - Array of image files
 * @param {string} path - Optional custom path
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export const uploadMultipleProductImages = async (files, path = 'products') => {
    const uploadedUrls = [];
    
    for (const file of files) {
        const url = await uploadProductImage(file, path);
        if (url) {
            uploadedUrls.push(url);
        }
    }
    
    return uploadedUrls;
};

/**
 * Compress image before upload
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Get a placeholder image URL for a category
 * @param {string} category - The product category
 * @returns {string} - Placeholder image URL or emoji
 */
export const getCategoryPlaceholder = (category) => {
    const placeholders = {
        'rice': '🍚',
        'garri': '🌽',
        'beans': '🫘',
        'oil': '🫒',
        'yam': '🍠',
        'grains': '🌾',
        'oils': '🫒',
        'others': '📦'
    };
    return placeholders[category] || '📦';
};