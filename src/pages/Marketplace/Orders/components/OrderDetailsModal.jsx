// src/pages/Marketplace/Orders/components/OrderDetailsModal.jsx
import React from 'react';
import { Modal, Tag, Timeline, Divider, Button, Space, Descriptions } from 'antd';
import { 
    CheckCircleOutlined, 
    ShoppingOutlined,
    TruckOutlined,
} from '@ant-design/icons';

const statusConfig = {
    'pending': { color: 'default', label: '⏳ Pending' },
    'processing': { color: 'gold', label: '⚙️ Processing' },
    'dispatched': { color: 'blue', label: '📦 Dispatched' },
    'out_for_delivery': { color: 'purple', label: '🚚 Out for Delivery' },
    'delivered': { color: 'green', label: '✅ Delivered' },
    'cancelled': { color: 'red', label: '❌ Cancelled' }
};

// Map stages to icons - using emojis for simplicity
const stageIcons = {
    'Order Placed': '🕐',
    'Processing': '⚙️',
    'Dispatched': '📦',
    'Out for Delivery': '🚚',
    'Delivered': '🏠'
};

export default function OrderDetailsModal({ order, open, onClose }) {
    if (!order) return null;

    const formatPrice = (price) => {
        return '₦' + price.toLocaleString();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Pending';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const status = statusConfig[order.status] || statusConfig['pending'];

    // Find the current stage index (last completed or first incomplete)
    const getCurrentStageIndex = () => {
        if (!order.tracking || order.tracking.length === 0) return 0;
        // Find the first incomplete stage
        const index = order.tracking.findIndex(track => !track.completed);
        // If all are completed, return the last index
        return index === -1 ? order.tracking.length - 1 : index;
    };

    const currentStageIndex = getCurrentStageIndex();

    const timelineItems = order.tracking?.map((track, index) => {
        const isLast = index === order.tracking.length - 1;
        const isCompleted = track.completed;
        const isCurrent = index === currentStageIndex && !isCompleted;
        const icon = stageIcons[track.stage] || '📌';
        
        return {
            dot: (
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300
                    ${isCompleted ? ' text-white' : ''}
                    ${isCurrent ? 'bg-spark-500 text-white ring-4 ring-spark-200 animate-pulse' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-400' : ''}
                    ${isLast && isCompleted ? 'bg-green-500 text-white ring-4 ring-green-200' : ''}
                `}>
                    {isCurrent ? '📍' : icon}
                </div>
            ),
            color: isCompleted ? 'green' : isCurrent ? 'orange' : 'gray',
            children: (
                <div className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`
                                text-base font-semibold
                                ${isCompleted ? 'text-gray-900' : ''}
                                ${isCurrent ? 'text-spark-600' : ''}
                                ${!isCompleted && !isCurrent ? 'text-gray-400' : ''}
                            `}>
                                {track.stage}
                            </span>
                            {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-spark-100 text-spark-700 text-xs font-medium rounded-full border border-spark-300">
                                    <span className="w-1.5 h-1.5 bg-spark-500 rounded-full animate-pulse"></span>
                                    Current
                                </span>
                            )}
                            {isCompleted && (
                                <CheckCircleOutlined className="text-green-500 text-sm" />
                            )}
                        </div>
                        {track.time && (
                            <span className="text-xs text-gray-400 font-mono">
                                {formatTime(track.time)}
                            </span>
                        )}
                    </div>
                    {track.time && (
                        <div className="text-xs text-gray-400 mt-0.5">
                            {formatDate(track.time)}
                        </div>
                    )}
                    {isLast && isCompleted && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                            <CheckCircleOutlined className="text-green-500" />
                            Order Complete
                        </div>
                    )}
                </div>
            )
        };
    });

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-spark-900">Order Details</span>
                    <Tag color={status.color}>{status.label}</Tag>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button 
                    key="close" 
                    onClick={onClose} 
                    size="large"
                    className="bg-spark-500 hover:bg-spark-600 border-spark-500 hover:border-spark-600 text-white font-medium px-8 h-11 float-right"
                >
                    Close
                </Button>
            ]}
            width={720}
            className="order-details-modal"
            styles={{
                body: {
                    maxHeight: 'calc(90vh - 200px)',
                    overflowY: 'auto',
                    padding: '24px'
                }
            }}
        >
            <Descriptions 
                bordered 
                size="middle"
                column={{ xs: 1, sm: 2 }}
                className="mb-6"
                styles={{
                    label: {
                        fontWeight: 600,
                        backgroundColor: '#FDBA74'
                    },
                    content: {
                        backgroundColor: '#FFF7ED'
                    }
                }}
            >
                <Descriptions.Item label="Order ID">
                    <span className="font-mono text-sm text-gray-800">{order.orderId}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Date Placed">
                    <span className="text-gray-700">{formatDate(order.createdAt)}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={status.color}>{status.label}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                    <span className="text-lg font-bold text-spark-600">
                        {formatPrice(order.total)}
                    </span>
                </Descriptions.Item>
                {order.savings > 0 && (
                    <Descriptions.Item label="You Saved">
                        <span className="text-green-600 font-semibold">
                            🎉 {formatPrice(order.savings)}
                        </span>
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Delivery Address">
                    <span className="text-gray-700">{order.deliveryAddress || 'Not provided'}</span>
                </Descriptions.Item>
            </Descriptions>

            {/* Tracking Timeline */}
            <Divider 
                orientation="left" 
                className="text-sm font-semibold border-spark-200"
            >
                <Space>
                    <TruckOutlined className="text-spark-600" />
                    <span className="text-spark-900">Tracking Timeline</span>
                </Space>
            </Divider>
            
            <div className="rounded-xl p-4 mb-4">
                <Timeline 
                    items={timelineItems} 
                    className="timeline-professional"
                    styles={{
                        line: {
                            borderLeft: '3px solid #FED7AA'
                        }
                    }}
                />
            </div>

            {/* Items List */}
            <Divider 
                orientation="left" 
                className="text-sm font-semibold border-spark-200"
            >
                <Space>
                    <ShoppingOutlined className="text-spark-600" />
                    <span className="text-spark-900">Items</span>
                </Space>
            </Divider>
            <div className="space-y-2">
                {order.items?.map((item, index) => (
                    <div 
                        key={index} 
                        className="flex justify-between items-center py-3 px-4 bg-spark-100 rounded-lg hover:bg-spark-200 transition group"
                    >
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {item.quantity}× {item.name}
                        </span>
                        <span className="text-sm font-medium text-spark-800">
                            {formatPrice(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>
        </Modal>
    );
}