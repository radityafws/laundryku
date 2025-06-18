'use client';

import { useState } from 'react';

interface Promotion {
  id: string;
  title: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'draft';
  usageCount: number;
  maxUsage?: number;
  createdAt: string;
}

interface PromotionsTableProps {
  promotions: Promotion[];
  isLoading: boolean;
  onEditPromotion: (promotion: Promotion) => void;
  onDeletePromotion: (promotion: Promotion) => void;
  onBroadcastPromotion: (promotion: Promotion) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function PromotionsTable({
  promotions,
  isLoading,
  onEditPromotion,
  onDeletePromotion,
  onBroadcastPromotion,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PromotionsTableProps) {
  const [sortField, setSortField] = useState<keyof Promotion>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Promotion) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPromotions = [...promotions].sort((a, b) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'scheduled': return '⏰';
      case 'expired': return '❌';
      case 'draft': return '📝';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'scheduled': return 'Terjadwal';
      case 'expired': return 'Berakhir';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : formatCurrency(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-7 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
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
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              {[
                { key: 'title', label: 'Judul Promosi' },
                { key: 'code', label: 'Kode' },
                { key: 'value', label: 'Diskon' },
                { key: 'status', label: 'Status' },
                { key: 'endDate', label: 'Berakhir' },
                { key: 'usageCount', label: 'Penggunaan' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Promotion)}
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
            {sortedPromotions.map((promotion, index) => (
              <tr key={promotion.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{promotion.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{promotion.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {promotion.code}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatDiscountValue(promotion.type, promotion.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(promotion.status)}`}>
                    <span>{getStatusIcon(promotion.status)}</span>
                    <span>{getStatusText(promotion.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(promotion.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span>{promotion.usageCount}</span>
                    {promotion.maxUsage && (
                      <>
                        <span>/</span>
                        <span>{promotion.maxUsage}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onBroadcastPromotion(promotion)}
                      disabled={promotion.status !== 'active'}
                      className="bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Kirim WhatsApp"
                    >
                      📱 Kirim
                    </button>
                    <button
                      onClick={() => onEditPromotion(promotion)}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => onDeletePromotion(promotion)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedPromotions.map((promotion, index) => (
          <div key={promotion.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  #{startIndex + index + 1}
                </span>
                <div className="font-semibold text-gray-900">{promotion.title}</div>
              </div>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(promotion.status)}`}>
                <span>{getStatusIcon(promotion.status)}</span>
                <span>{getStatusText(promotion.status)}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Kode:</span>
                <div className="font-medium">{promotion.code}</div>
              </div>
              <div>
                <span className="text-gray-500">Diskon:</span>
                <div className="font-medium">{formatDiscountValue(promotion.type, promotion.value)}</div>
              </div>
              <div>
                <span className="text-gray-500">Berakhir:</span>
                <div className="font-medium">{formatDate(promotion.endDate)}</div>
              </div>
              <div>
                <span className="text-gray-500">Penggunaan:</span>
                <div className="font-medium">
                  {promotion.usageCount}{promotion.maxUsage && `/${promotion.maxUsage}`}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {promotion.description}
            </div>
            
            <div className="flex space-x-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => onBroadcastPromotion(promotion)}
                disabled={promotion.status !== 'active'}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📱 Kirim WhatsApp
              </button>
              <button
                onClick={() => onEditPromotion(promotion)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Ubah
              </button>
              <button
                onClick={() => onDeletePromotion(promotion)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Hapus
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
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} promosi
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
      {promotions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Promosi
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai buat promosi untuk menarik lebih banyak pelanggan.
          </p>
        </div>
      )}
    </div>
  );
}