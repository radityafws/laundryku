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
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onPrintReceipt: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: string) => void;
}

export default function OrdersTable({
  orders,
  isLoading,
  onViewOrder
}: OrdersTableProps) {
  const [sortField, setSortField] = useState<keyof Order>('dateIn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress': return '🔄';
      case 'ready': return '✅';
      case 'completed': return '✔️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Dalam Proses';
      case 'ready': return 'Siap Diambil';
      case 'completed': return 'Sudah Diambil';
      default: return 'Unknown';
    }
  };

  const getServiceIcon = (service: string) => {
    return service === 'express' ? '⚡' : '🕐';
  };

  const getServiceText = (service: string) => {
    return service === 'express' ? 'Express' : 'Reguler';
  };

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
                { key: 'customerName', label: 'Nama Pelanggan' },
                { key: 'dateIn', label: 'Tgl Masuk' },
                { key: 'estimatedDone', label: 'Est Selesai' },
                { key: 'weight', label: 'Berat' },
                { key: 'service', label: 'Layanan' },
                { key: 'status', label: 'Status' },
                { key: 'total', label: 'Total' }
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
            {paginatedOrders.map((order) => (
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
                  {formatDate(order.estimatedDone)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.weight} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <span>{getServiceIcon(order.service)}</span>
                    <span className="text-sm text-gray-900">{getServiceText(order.service)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    <span>{getStatusIcon(order.status)}</span>
                    <span>{getStatusText(order.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {paginatedOrders.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-900">{order.invoice}</div>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                <span>{getStatusIcon(order.status)}</span>
                <span>{getStatusText(order.status)}</span>
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
                <span className="text-gray-500">Est Selesai:</span>
                <div className="font-medium">{formatDate(order.estimatedDone)}</div>
              </div>
              <div>
                <span className="text-gray-500">Berat:</span>
                <div className="font-medium">{order.weight} kg</div>
              </div>
              <div>
                <span className="text-gray-500">Layanan:</span>
                <div className="font-medium flex items-center space-x-1">
                  <span>{getServiceIcon(order.service)}</span>
                  <span>{getServiceText(order.service)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="font-bold text-lg text-gray-900">
                {formatCurrency(order.total)}
              </div>
              <button
                onClick={() => onViewOrder(order)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, orders.length)} dari {orders.length} pesanan
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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