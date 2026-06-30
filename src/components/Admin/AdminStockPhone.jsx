// src/components/Admin/StockPhotos.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query,
    where,
    getDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { 
    UploadOutlined, 
    DeleteOutlined, 
    PlusOutlined, 
    CheckOutlined,
    LoadingOutlined
} from '@ant-design/icons';

const categoryLabels = {
    'rice': '🍚 Rice',
    'garri': '🌽 Garri',
    'beans': '🫘 Beans',
    'oil': '🫒 Oil',
    'yam': '🍠 Yam',
    'others': '📦 Others'
};

const categoryColors = {
    'rice': 'bg-amber-100 border-amber-200',
    'garri': 'bg-yellow-100 border-yellow-200',
    'beans': 'bg-green-100 border-green-200',
    'oil': 'bg-orange-100 border-orange-200',
    'yam': 'bg-purple-100 border-purple-200',
    'others': 'bg-gray-100 border-gray-200'
};

export default function StockPhotos() {
    const { userData } = useAuth();
    const [stockPhotos, setStockPhotos] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('rice');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const categories = ['rice', 'garri', 'beans', 'oil', 'yam', 'others'];

    useEffect(() => {
        if (userData?.role === 'admin') {
            loadStockPhotos();
        }
    }, [userData]);

    const loadStockPhotos = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'stockPhotos'));
            const photos = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                if (!photos[data.category]) {
                    photos[data.category] = [];
                }
                photos[data.category].push({ id: doc.id, ...data });
            });
            setStockPhotos(photos);
        } catch (error) {
            console.error('Error loading stock photos:', error);
            toast.error('Failed to load stock photos');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        setUploading(true);
        let uploaded = 0;
        let failed = 0;

        for (const file of selectedFiles) {
            try {
                // Validate file
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} is too large (max 5MB)`);
                    failed++;
                    continue;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} is not an image`);
                    failed++;
                    continue;
                }

                // Upload to Cloudinary
                const imageUrl = await uploadToCloudinary(file, 'stock-photos');
                
                if (!imageUrl) {
                    failed++;
                    continue;
                }

                // Save to Firestore
                await addDoc(collection(db, 'stockPhotos'), {
                    category: selectedCategory,
                    url: imageUrl,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    uploadedBy: userData?.uid || 'admin',
                    uploadedByEmail: userData?.email || 'admin',
                    uploadedAt: new Date().toISOString(),
                    isActive: true,
                    isDefault: false,
                    usedCount: 0
                });

                uploaded++;
            } catch (error) {
                console.error('Upload failed:', error);
                failed++;
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setUploading(false);
        setSelectedFiles([]);
        setShowUploadForm(false);
        
        if (uploaded > 0) {
            toast.success(`✅ Uploaded ${uploaded} photo${uploaded > 1 ? 's' : ''} to ${categoryLabels[selectedCategory]}`);
        }
        if (failed > 0) {
            toast.warning(`⚠️ ${failed} file${failed > 1 ? 's' : ''} failed`);
        }
        
        loadStockPhotos();
    };

    const deletePhoto = async (photoId, category) => {
        if (!window.confirm('Delete this stock photo? This action cannot be undone.')) return;

        try {
            // Get photo data
            const photoDoc = await getDoc(doc(db, 'stockPhotos', photoId));
            const photoData = photoDoc.data();

            // Delete from Firestore only (Cloudinary will keep the image)
            await deleteDoc(doc(db, 'stockPhotos', photoId));
            toast.success('Photo deleted');
            loadStockPhotos();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete photo');
        }
    };

    const setDefaultPhoto = async (photoId, category) => {
        try {
            // Remove default from all photos in category
            const q = query(collection(db, 'stockPhotos'), where('category', '==', category));
            const snapshot = await getDocs(q);
            
            const updates = [];
            snapshot.forEach(doc => {
                if (doc.id !== photoId) {
                    updates.push(updateDoc(doc.ref, { isDefault: false }));
                }
            });
            
            await Promise.all(updates);
            
            // Set new default
            await updateDoc(doc(db, 'stockPhotos', photoId), { isDefault: true });
            
            toast.success('⭐ Default photo set');
            loadStockPhotos();
        } catch (error) {
            console.error('Failed to set default:', error);
            toast.error('Failed to set default photo');
        }
    };

    const getTotalPhotos = () => {
        let total = 0;
        Object.values(stockPhotos).forEach(photos => {
            total += photos.length;
        });
        return total;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-spark-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading stock photos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🖼️ Stock Photos</h1>
                    <p className="text-sm text-gray-500">
                        Manage product stock photos. These will be used as defaults when users don't upload their own.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        Total: <strong>{getTotalPhotos()}</strong> photos
                    </span>
                    <button
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg transition flex items-center gap-2"
                    >
                        <PlusOutlined />
                        Add Photos
                    </button>
                </div>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">📤 Upload New Stock Photos</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-spark-500 focus:border-transparent"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-spark-50 file:text-spark-700 hover:file:bg-spark-100"
                            />
                        </div>
                    </div>

                    {selectedFiles.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Selected: <strong>{selectedFiles.length}</strong> file{selectedFiles.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedFiles.map((file, index) => (
                                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {file.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || selectedFiles.length === 0}
                            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                                uploading || selectedFiles.length === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-spark-500 hover:bg-spark-600 text-white'
                            }`}
                        >
                            {uploading ? (
                                <>
                                    <LoadingOutlined className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadOutlined />
                                    Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setShowUploadForm(false);
                                setSelectedFiles([]);
                            }}
                            className="px-6 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                        💡 Supported: JPG, PNG, WebP (Max 5MB per image)
                    </p>
                </div>
            )}

            {/* Stock Photos Grid by Category */}
            {categories.map(category => {
                const photos = stockPhotos[category] || [];
                if (photos.length === 0) return null;

                return (
                    <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                        <div className={`px-6 py-3 border-b border-gray-200 ${categoryColors[category]}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                    {categoryLabels[category]}
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({photos.length} photos)
                                    </span>
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowUploadForm(true);
                                    }}
                                    className="text-sm text-spark-600 hover:text-spark-700"
                                >
                                    + Add more
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                            <img 
                                                src={photo.url} 
                                                alt={photo.fileName || 'Stock photo'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '';
                                                    e.target.className = 'hidden';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                                            <span class="text-4xl text-gray-300">🖼️</span>
                                                        </div>
                                                    `;
                                                }}
                                            />
                                            {photo.isDefault && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckOutlined className="text-[10px]" />
                                                    Default
                                                </div>
                                            )}
                                            {photo.usedCount > 0 && (
                                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                                    Used {photo.usedCount}x
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                                            <button
                                                onClick={() => setDefaultPhoto(photo.id, category)}
                                                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                                                    photo.isDefault 
                                                        ? 'bg-green-500 text-white cursor-default' 
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                }`}
                                                disabled={photo.isDefault}
                                            >
                                                {photo.isDefault ? 'Default' : 'Set Default'}
                                            </button>
                                            <button
                                                onClick={() => deletePhoto(photo.id, category)}
                                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition"
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Empty State */}
            {Object.keys(stockPhotos).length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stock Photos</h3>
                    <p className="text-gray-500 mb-4">Upload photos to provide default images for products</p>
                    <button
                        onClick={() => setShowUploadForm(true)}
                        className="px-6 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg transition"
                    >
                        <UploadOutlined /> Upload First Photo
                    </button>
                </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Stock Photos</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use high-quality, well-lit photos</li>
                    <li>• Show the product clearly (not blurry)</li>
                    <li>• Use consistent backgrounds (white recommended)</li>
                    <li>• Photos should be at least 400x400 pixels</li>
                    <li>• Set a default photo for each category</li>
                </ul>
            </div>
        </div>
    );
}