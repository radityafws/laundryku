import { useState } from 'react';
import { useOrderStatuses } from '@/hooks/useOrderStatus';

interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  sku: string;
  price: number;
  quantity?: number;
  weight?: number;
  variation?: string;
  variationId?: string;
  subtotal: number;
}

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
}

interface PaymentSectionProps {
  cartItems: CartItem[];
  appliedPromos: PromoCode[];
  paymentMethod: 'cash' | 'qris' | 'transfer';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'cash' | 'qris' | 'transfer'>>;
  paymentStatus: 'paid' | 'unpaid';
  setPaymentStatus: React.Dispatch<React.SetStateAction<'paid' | 'unpaid'>>;
  orderStatus: string;
  setOrderStatus: React.Dispatch<React.SetStateAction<string>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  createOrder: (printReceipt: boolean) => void;
}

export default function PaymentSection({
  cartItems,
  appliedPromos,
  paymentMethod,
  setPaymentMethod,
  paymentStatus,
  setPaymentStatus,
  orderStatus,
  setOrderStatus,
  notes,
  setNotes,
  createOrder
}: PaymentSectionProps) {
  const { data: orderStatuses, isLoading: isLoadingStatuses } = useOrderStatuses();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  const discountAmount = appliedPromos.reduce((sum, promo) => {
    if (promo.isPercentage) {
      return sum + (subtotal * promo.discount / 100);
    } else {
      return sum + promo.discount;
    }
  }, 0);
  
  const total = Math.max(0, subtotal - discountAmount);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">💳 Informasi Pembayaran</h3>
      
      <div className="space-y-4">
        {/* Total Summary (Mobile Only) */}
        <div className="xl:hidden bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">Total Pembayaran:</span>
            <span className="text-xl font-bold text-blue-700">{formatCurrency(total)}</span>
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'cash'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="sr-only"
              />
              <span className="text-xl">💵</span>
              <span className="font-medium text-gray-900 text-sm mt-1">Tunai</span>
            </label>
            
            <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'qris'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                value="qris"
                checked={paymentMethod === 'qris'}
                onChange={() => setPaymentMethod('qris')}
                className="sr-only"
              />
              <span className="text-xl">📱</span>
              <span className="font-medium text-gray-900 text-sm mt-1">QRIS</span>
            </label>
            
            <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'transfer'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                value="transfer"
                checked={paymentMethod === 'transfer'}
                onChange={() => setPaymentMethod('transfer')}
                className="sr-only"
              />
              <span className="text-xl">🏦</span>
              <span className="font-medium text-gray-900 text-sm mt-1">Transfer</span>
            </label>
          </div>
        </div>
        
        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentStatus === 'paid'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}>
              <input
                type="radio"
                value="paid"
                checked={paymentStatus === 'paid'}
                onChange={() => setPaymentStatus('paid')}
                className="sr-only"
              />
              <span className="text-xl">✅</span>
              <span className="font-medium text-gray-900 text-sm mt-1">Sudah Dibayar</span>
            </label>
            
            <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentStatus === 'unpaid'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-300'
            }`}>
              <input
                type="radio"
                value="unpaid"
                checked={paymentStatus === 'unpaid'}
                onChange={() => setPaymentStatus('unpaid')}
                className="sr-only"
              />
              <span className="text-xl">⏳</span>
              <span className="font-medium text-gray-900 text-sm mt-1">Belum Dibayar</span>
            </label>
          </div>
        </div>
        
        {/* Order Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Pesanan
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          >
            {isLoadingStatuses ? (
              <option>Loading...</option>
            ) : (
              orderStatuses?.filter(status => status.isActive).map((status) => (
                <option key={status.id} value={status.id}>
                  {status.icon} {status.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Tambahkan catatan untuk pesanan ini..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
          />
        </div>
        
        {/* Submit Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => createOrder(true)}
            disabled={cartItems.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>🧾</span>
            <span>Buat & Cetak</span>
          </button>
          
          <button
            onClick={() => createOrder(false)}
            disabled={cartItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>💾</span>
            <span>Simpan Saja</span>
          </button>
        </div>
      </div>
    </div>
  );
}