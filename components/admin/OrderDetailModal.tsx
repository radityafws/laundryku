'use client';

import { useState } from 'react';

interface Order {
  id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  weight: number;
  service: 'regular' | 'express';
  status: 'in-progress' | 'ready' | 'completed';
  total: number;
  notes?: string;
  paymentMethod?: 'cash' | 'qris';
}

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPrintReceipt: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: string) => void;
}

const statusOptions = [
  { value: 'in-progress', label: 'Dalam Proses', icon: '🔄', color: 'yellow' },
  { value: 'ready', label: 'Siap Diambil', icon: '✅', color: 'green' },
  { value: 'completed', label: 'Sudah Diambil', icon: '✔️', color: 'gray' }
];

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onPrintReceipt,
  onPrintOrder,
  onUpdateStatus
}: OrderDetailModalProps) {
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

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

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getServiceInfo = (service: string) => {
    return service === 'express' 
      ? { label: 'Express (1 hari)', icon: '⚡', price: 5000 }
      : { label: 'Reguler (3 hari)', icon: '🕐', price: 3000 };
  };

  const getPaymentMethodInfo = (method: string) => {
    return method === 'qris'
      ? { label: 'QRIS', icon: '📱' }
      : { label: 'Tunai', icon: '💵' };
  };

  const handleStatusUpdate = () => {
    onUpdateStatus(order, selectedStatus);
    setShowStatusUpdate(false);
  };

  if (!isOpen) return null;

  const statusInfo = getStatusInfo(order.status);
  const serviceInfo = getServiceInfo(order.service);
  const paymentInfo = getPaymentMethodInfo(order.paymentMethod || 'cash');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📄 Detail Pesanan</h2>
            <p className="text-gray-600">{order.invoice}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-lg font-semibold border-2 ${
              statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
              statusInfo.color === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
              'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              <span className="text-2xl">{statusInfo.icon}</span>
              <span>{statusInfo.label}</span>
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
                <p className="text-sm text-gray-600 mb-1">Berat Cucian</p>
                <p className="font-semibold text-gray-900">{order.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Jenis Layanan</p>
                <div className="flex items-center space-x-2">
                  <span>{serviceInfo.icon}</span>
                  <span className="font-semibold text-gray-900">{serviceInfo.label}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                <div className="flex items-center space-x-2">
                  <span>{paymentInfo.icon}</span>
                  <span className="font-semibold text-gray-900">{paymentInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
              <span>📅</span>
              <span>Jadwal</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-600 mb-1">Tanggal Masuk</p>
                <p className="font-semibold text-green-900">{formatDate(order.dateIn)}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 mb-1">Estimasi Selesai</p>
                <p className="font-semibold text-green-900">{formatDate(order.estimatedDone)}</p>
              </div>
            </div>
          </div>

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
            <p className="text-sm text-orange-700 mt-2">
              {order.weight} kg × {formatCurrency(serviceInfo.price)}/kg = {formatCurrency(order.weight * serviceInfo.price)}
            </p>
          </div>

          {/* Status Update Section */}
          {showStatusUpdate ? (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                <span>🔄</span>
                <span>Ubah Status</span>
              </h3>
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedStatus === status.value
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-xl">{status.icon}</span>
                    <span className="font-semibold text-gray-900">{status.label}</span>
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
          ) : null}
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
              <span>Cetak Pesanan</span>
            </button>
            
            <button
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>🔁</span>
              <span>Ubah Status</span>
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>✕</span>
              <span>Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}