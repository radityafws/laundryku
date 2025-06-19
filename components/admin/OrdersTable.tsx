'use client';

import { useState } from 'react';
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

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onPrintReceipt: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: string) => void;
  onUpdatePaymentStatus: (order: Order, newStatus: string) => void;
  orderStatuses?: OrderStatus[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function OrdersTable({
  orders,
  isLoading,
  onViewOrder,
  onPrintReceipt,
  onPrintOrder,
  onUpdateStatus,
  onUpdatePaymentStatus,
  orderStatuses = [],
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: OrdersTableProps) {
  const [sortField, setSortField] = useState<keyof Order>('dateIn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
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

  const countItems = (order: Order) => {
    return order.items?.length || 0;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-8 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                { key: 'invoice', label: 'Invoice' },
                { key: 'customerName', label: 'Pelanggan' },
                { key: 'dateIn', label: 'Tgl Masuk' },
                { key: 'items', label: 'Jumlah Item' },
                { key: 'total', label: 'Total' },
                { key: 'status', label: 'Status Pesanan' },
                { key: 'paymentStatus', label: 'Status Pembayaran' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Order)}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <span className="text-gray-400">
                      {sortField === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕️'}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.invoice}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.dateIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {countItems(order)} item
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                    {order.paymentMethod && (
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                        <span>
                          {order.paymentMethod === 'cash' ? 'Tunai' : 
                           order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.name}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      <span>{getPaymentStatusIcon(order.paymentStatus)}</span>
                      <span>{getPaymentStatusText(order.paymentStatus)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => onPrintReceipt(order)}
                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                        title="Cetak Struk"
                      >
                        🧾
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          
          return (
            <div key={order.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">{order.invoice}</div>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  <span>{statusInfo.icon}</span>
                  <span>{statusInfo.name}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Nama:</span>
                  <div className="font-medium">{order.customerName}</div>
                </div>
                <div>
                  <span className="text-gray-500">HP:</span>
                  <div className="font-medium">{order.customerPhone}</div>
                </div>
                <div>
                  <span className="text-gray-500">Tgl Masuk:</span>
                  <div className="font-medium">{formatDate(order.dateIn)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Jumlah Item:</span>
                  <div className="font-medium">{countItems(order)} item</div>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <div className="font-medium">{formatCurrency(order.total)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Pembayaran:</span>
                  <div className="font-medium">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      <span>{getPaymentStatusIcon(order.paymentStatus)}</span>
                      <span>{getPaymentStatusText(order.paymentStatus)}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => onViewOrder(order)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Detail
                </button>
                <button
                  onClick={() => onPrintReceipt(order)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  Cetak Struk
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} pesanan
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Pesanan
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai tambahkan pesanan laundry untuk melihat daftar di sini.
          </p>
        </div>
      )}
    </div>
  );
}