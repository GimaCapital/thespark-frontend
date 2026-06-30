// src/services/cloudinaryService.js
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'marketplace_products';

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder name (e.g., 'products', 'stock-photos')
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadToCloudinary = async (file, folder = 'products') => {
    if (!file) {
        console.error('No file provided');
        return null;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        console.error('Image must be less than 5MB');
        return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        console.error('Please upload a JPEG, PNG, or WebP image');
        return null;
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        }

        console.error('Upload failed:', data.error?.message || 'Unknown error');
        return null;
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
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
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {string} folder - Optional folder name
 * @returns {Promise<string[]>} - Array of uploaded image URLs
 */
export const uploadMultipleToCloudinary = async (files, folder = 'products') => {
    const uploadedUrls = [];
    
    for (const file of files) {
        const url = await uploadToCloudinary(file, folder);
        if (url) {
            uploadedUrls.push(url);
        }
    }
    
    return uploadedUrls;
};

/**
 * Get optimized image URL with transformations
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImage = (url, options = {}) => {
    if (!url) return null;
    
    const {
        width = 400,
        height = 300,
        crop = 'fill',
        quality = 'auto:good',
        format = 'auto'
    } = options;

    if (url.includes('cloudinary.com')) {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
            return `${parts[0]}/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/${parts[1]}`;
        }
    }
    
    return url;
};