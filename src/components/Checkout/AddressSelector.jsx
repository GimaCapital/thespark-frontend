// src/components/Checkout/AddressSelector.jsx
import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

export default function AddressSelector({
    selectedAddress,
    onAddressSelect,
    deliveryAddress,
    setDeliveryAddress
}) {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        isDefault: false
    });

    useEffect(() => {
        if (user) {
            loadAddresses();
        }
    }, [user]);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const token = await user.getIdToken();
            setAuthToken(token);
           
            const response = await api.get('/address/addresses');
           
            const loadedAddresses = response.data.addresses || [];
            setAddresses(loadedAddresses);
           
            // Auto-select default address
            const defaultAddr = loadedAddresses.find(a => a.isDefault);
            if (defaultAddr && !selectedAddress) {
                if (typeof onAddressSelect === 'function') {
                    onAddressSelect(defaultAddr);
                }
                const fullAddress = `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state}`;
                if (typeof setDeliveryAddress === 'function') {
                    setDeliveryAddress(fullAddress);
                }
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            // toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async () => {
        if (!newAddress.street || !newAddress.city || !newAddress.state) {
            toast.error('Please fill in all required fields');
            return;
        }
        try {
            const token = await user.getIdToken();
            setAuthToken(token);
           
            const response = await api.post('/address/addresses', newAddress);
           
            if (response.data.success) {
                toast.success('Address added successfully!');
                setAddresses([...addresses, response.data.address]);
                setShowAddForm(false);
                setNewAddress({
                    fullName: '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    isDefault: false
                });
                loadAddresses();
            }
        } catch (error) {
            console.error('Failed to add address:', error);
            toast.error('Failed to add address');
        }
    };

    const deleteAddress = async (addressId) => {
        if (!window.confirm('Delete this address?')) return;
       
        try {
            const token = await user.getIdToken();
            setAuthToken(token);
            await api.delete(`/address/addresses/${addressId}`);
            toast.success('Address deleted');
            loadAddresses();
        } catch (error) {
            console.error('Failed to delete address:', error);
            toast.error('Failed to delete address');
        }
    };

    const setDefault = async (addressId) => {
        try {
            const token = await user.getIdToken();
            setAuthToken(token);
            await api.put(`/address/addresses/${addressId}/default`);
            toast.success('Default address set');
            loadAddresses();
        } catch (error) {
            console.error('Failed to set default:', error);
            toast.error('Failed to set default address');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading addresses...</div>;
    }

    if (!user) {
        return <div className="text-center py-4 text-amber-600">Please log in to manage addresses</div>;
    }

    return (
        <div className="space-y-4">
            {addresses.length > 0 ? (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <div
                            key={address.id || address._id}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                                selectedAddress?.id === address.id || selectedAddress?._id === address._id
                                    ? 'border-spark-500 bg-spark-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                                if (typeof onAddressSelect === 'function') {
                                    onAddressSelect(address);
                                }
                                const fullAddress = `${address.street}, ${address.city}, ${address.state}`;
                                if (typeof setDeliveryAddress === 'function') {
                                    setDeliveryAddress(fullAddress);
                                }
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">{address.fullName}</p>
                                        {address.isDefault && (
                                            <span className="text-xs bg-spark-100 text-spark-600 px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                        {selectedAddress?.id === address.id && (
                                            <CheckCircleOutlined className="text-spark-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{address.street}</p>
                                    <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                                    <p className="text-xs text-gray-400">{address.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!address.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDefault(address.id || address._id);
                                            }}
                                            className="text-xs text-spark-500 hover:text-spark-600"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteAddress(address.id || address._id);
                                        }}
                                        className="text-xs text-red-500 hover:text-red-600"
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">No addresses found. Add one below.</p>
            )}

            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-spark-400 transition flex items-center justify-center gap-2 text-gray-500 hover:text-spark-500"
            >
                <PlusOutlined />
                Add New Address
            </button>

            {showAddForm && (
                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-3">New Address</h4>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <textarea
                            placeholder="Street Address"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            rows="2"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={addAddress}
                                className="px-4 py-2 bg-spark-500 hover:bg-spark-600 text-white rounded-lg text-sm transition"
                            >
                                Save Address
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}