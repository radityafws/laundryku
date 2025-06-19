'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { OrderStatus } from '@/lib/order-status-api';

interface Order {
  id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  items: any[];
  status: string;
  paymentStatus: 'paid' | 'unpaid';
  total: number;
  notes?: string;
  paymentMethod?: 'cash' | 'qris' | 'transfer';
}

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPrintReceipt: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: string) => void;
  onUpdatePaymentStatus: (order: Order, newStatus: string) => void;
  orderStatuses?: OrderStatus[];
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onPrintReceipt,
  onPrintOrder,
  onUpdateStatus,
  onUpdatePaymentStatus,
  orderStatuses = []
}: OrderDetailModalProps) {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [showPaymentStatusUpdate, setShowPaymentStatusUpdate] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(order.paymentStatus);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusInfo = (statusId: string) => {
    const status = orderStatuses.find(s => s.id === statusId);
    return {
      icon: status?.icon || '❓',
      name: status?.name || 'Unknown',
      color: getStatusColor(statusId)
    };
  };

  const getStatusColor = (statusId: string) => {
    const status = orderStatuses.find(s => s.id === statusId);
    if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    // Map status to colors based on order or predefined values
    const order = status.order || 0;
    
    if (status.name.toLowerCase().includes('batal') || status.icon === '❌') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    
    if (status.name.toLowerCase().includes('selesai') || status.icon === '✅') {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    
    if (status.name.toLowerCase().includes('siap') || status.icon === '🚚') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    
    // Default colors based on order
    if (order <= 2) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (order <= 4) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getPaymentStatusText = (status: string) => {
    return status === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar';
  };

  const getPaymentStatusIcon = (status: string) => {
    return status === 'paid' ? '✅' : '⏳';
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'qris': return '📱';
      case 'transfer': return '🏦';
      default: return '💰';
    }
  };

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'cash': return 'Tunai';
      case 'qris': return 'QRIS';
      case 'transfer': return 'Transfer';
      default: return 'Tidak diketahui';
    }
  };

  const handleStatusUpdate = () => {
    onUpdateStatus(order, selectedStatus);
    setShowStatusUpdate(false);
  };

  const handlePaymentStatusUpdate = () => {
    onUpdatePaymentStatus(order, selectedPaymentStatus);
    setShowPaymentStatusUpdate(false);
  };

  const statusInfo = getStatusInfo(order.status);

  // Group items by type
  const serviceItems = order.items?.filter(item => item.type === 'service') || [];
  const productItems = order.items?.filter(item => item.type === 'product') || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📄 Detail Pesanan</h2>
          <p className="text-gray-600">{order.invoice}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-lg font-semibold border-2 ${getStatusColor(order.status)}`}>
            <span className="text-2xl">{statusInfo.icon}</span>
            <span>{statusInfo.name}</span>
          </div>
          
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-lg font-semibold border-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
            <span className="text-2xl">{getPaymentStatusIcon(order.paymentStatus)}</span>
            <span>{getPaymentStatusText(order.paymentStatus)}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center space-x-2">
            <span>👤</span>
            <span>Informasi Pelanggan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600 mb-1">Nama Pelanggan</p>
              <p className="font-semibold text-blue-900">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 mb-1">Nomor HP</p>
              <p className="font-semibold text-blue-900">{order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span>📋</span>
            <span>Detail Pesanan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nomor Invoice</p>
              <p className="font-semibold text-gray-900">{order.invoice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tanggal Masuk</p>
              <p className="font-semibold text-gray-900">{formatDate(order.dateIn)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimasi Selesai</p>
              <p className="font-semibold text-gray-900">{formatDate(order.estimatedDone)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
              <div className="font-semibold text-gray-900 flex items-center space-x-2">
                <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                <span>{getPaymentMethodText(order.paymentMethod)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Items */}
        {serviceItems.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center space-x-2">
              <span>🧼</span>
              <span>Layanan Laundry</span>
            </h3>
            <div className="space-y-3">
              {serviceItems.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.variation && (
                        <p className="text-sm text-gray-600">{item.variation}</p>
                      )}
                    </div>
                    <p className="font-medium text-blue-600">{formatCurrency(item.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <p>{item.sku}</p>
                    <p>{formatCurrency(item.price)} × {item.weight} kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Items */}
        {productItems.length > 0 && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
              <span>🛍️</span>
              <span>Produk Tambahan</span>
            </h3>
            <div className="space-y-3">
              {productItems.map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-green-100">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.variation && (
                        <p className="text-sm text-gray-600">{item.variation}</p>
                      )}
                    </div>
                    <p className="font-medium text-green-600">{formatCurrency(item.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <p>{item.sku}</p>
                    <p>{formatCurrency(item.price)} × {item.quantity} pcs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center space-x-2">
              <span>📝</span>
              <span>Catatan</span>
            </h3>
            <p className="text-purple-900">{order.notes}</p>
          </div>
        )}

        {/* Total */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center space-x-2">
            <span>💰</span>
            <span>Total Tagihan</span>
          </h3>
          <div className="text-3xl font-bold text-orange-900">
            {formatCurrency(order.total)}
          </div>
        </div>

        {/* Status Update Section */}
        {showStatusUpdate && (
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center space-x-2">
              <span>🔄</span>
              <span>Ubah Status Pesanan</span>
            </h3>
            <div className="space-y-3">
              {orderStatuses.filter(status => status.isActive).map((status) => (
                <label
                  key={status.id}
                  className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedStatus === status.id
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={status.id}
                    checked={selectedStatus === status.id}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="text-xl">{status.icon}</span>
                  <span className="font-semibold text-gray-900">{status.name}</span>
                </label>
              ))}
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowStatusUpdate(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Simpan Status
              </button>
            </div>
          </div>
        )}

        {/* Payment Status Update Section */}
        {showPaymentStatusUpdate && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
              <span>💰</span>
              <span>Ubah Status Pembayaran</span>
            </h3>
            <div className="space-y-3">
              <label
                className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedPaymentStatus === 'paid'
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <input
                  type="radio"
                  value="paid"
                  checked={selectedPaymentStatus === 'paid'}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-xl">✅</span>
                <span className="font-semibold text-gray-900">Sudah Dibayar</span>
              </label>
              
              <label
                className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedPaymentStatus === 'unpaid'
                    ? 'border-yellow-500 bg-yellow-100'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <input
                  type="radio"
                  value="unpaid"
                  checked={selectedPaymentStatus === 'unpaid'}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                  className="w-5 h-5 text-yellow-600"
                />
                <span className="text-xl">⏳</span>
                <span className="font-semibold text-gray-900">Belum Dibayar</span>
              </label>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowPaymentStatusUpdate(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePaymentStatusUpdate}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Simpan Status
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onPrintReceipt(order)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>🧾</span>
            <span>Cetak Struk</span>
          </button>
          
          <button
            onClick={() => onPrintOrder(order)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Cetak Rincian</span>
          </button>
          
          <button
            onClick={() => setShowStatusUpdate(!showStatusUpdate)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>🔁</span>
            <span>Ubah Status</span>
          </button>
          
          <button
            onClick={() => setShowPaymentStatusUpdate(!showPaymentStatusUpdate)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>💰</span>
            <span>Ubah Pembayaran</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}