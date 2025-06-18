'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  notes?: string;
}

interface ReportsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ReportsTable({
  transactions,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: ReportsTableProps) {
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
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

  const getTypeIcon = (type: string) => {
    return type === 'income' ? '💰' : '💸';
  };

  const getTypeText = (type: string) => {
    return type === 'income' ? 'Pemasukan' : 'Pengeluaran';
  };

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const getCategoryIcon = (category: string, type: string) => {
    if (type === 'income') {
      if (category.toLowerCase().includes('express')) return '⚡';
      if (category.toLowerCase().includes('reguler')) return '🧺';
      return '💰';
    } else {
      switch (category.toLowerCase()) {
        case 'listrik': return '⚡';
        case 'air': return '💧';
        case 'detergen': return '🧴';
        case 'gaji': return '👥';
        case 'sewa': return '🏠';
        case 'perawatan': return '🔧';
        case 'asuransi': return '🛡️';
        default: return '📝';
      }
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  // Calculate totals
  const totalIncome = sortedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = sortedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
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
                { key: 'date', label: 'Tanggal' },
                { key: 'type', label: 'Jenis' },
                { key: 'category', label: 'Kategori' },
                { key: 'description', label: 'Keterangan' },
                { key: 'amount', label: 'Nominal' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Transaction)}
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)}`}>
                    <span>{getTypeIcon(transaction.type)}</span>
                    <span>{getTypeText(transaction.type)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(transaction.category, transaction.type)}</span>
                    <span className="text-sm text-gray-900">{transaction.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{transaction.description}</div>
                  {transaction.notes && (
                    <div className="text-xs text-gray-500 mt-1">{transaction.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right font-semibold text-gray-800">
                Total:
              </td>
              <td className="px-6 py-4 font-bold text-sm">
                <div className="space-y-1">
                  <div className="text-green-600">Pemasukan: {formatCurrency(totalIncome)}</div>
                  <div className="text-red-600">Pengeluaran: {formatCurrency(totalExpenses)}</div>
                  <div className={`${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    Saldo: {formatCurrency(totalIncome - totalExpenses)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedTransactions.map((transaction, index) => (
          <div key={transaction.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  #{startIndex + index + 1}
                </span>
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.type)}`}>
                  <span>{getTypeIcon(transaction.type)}</span>
                  <span>{getTypeText(transaction.type)}</span>
                </span>
              </div>
              <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Tanggal:</span>
                <div className="font-medium">{formatDate(transaction.date)}</div>
              </div>
              <div>
                <span className="text-gray-500">Kategori:</span>
                <div className="font-medium flex items-center space-x-2">
                  <span>{getCategoryIcon(transaction.category, transaction.type)}</span>
                  <span>{transaction.category}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Keterangan:</span>
                <div className="font-medium">{transaction.description}</div>
              </div>
              {transaction.notes && (
                <div>
                  <span className="text-gray-500">Catatan:</span>
                  <div className="font-medium text-gray-700">{transaction.notes}</div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Mobile Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Ringkasan</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-600">Pemasukan:</span>
              <span className="font-bold text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Pengeluaran:</span>
              <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="border-t border-blue-300 pt-2">
              <div className="flex justify-between">
                <span className={`${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Saldo:
                </span>
                <span className={`font-bold ${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} transaksi
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
      {transactions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Transaksi
          </h3>
          <p className="text-gray-600 mb-6">
            Belum ada data transaksi untuk periode yang dipilih.
          </p>
        </div>
      )}
    </div>
  );
}