'use client';

import { useState } from 'react';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalAmount: number;
}

export default function ExpensesTable({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  totalAmount
}: ExpensesTableProps) {
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return '⚡';
      case 'water': return '💧';
      case 'detergent': return '🧴';
      case 'salary': return '💰';
      case 'rent': return '🏠';
      case 'maintenance': return '🔧';
      default: return '📝';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'electricity': return 'Listrik';
      case 'water': return 'Air';
      case 'detergent': return 'Detergen';
      case 'salary': return 'Gaji';
      case 'rent': return 'Sewa';
      case 'maintenance': return 'Perawatan';
      default: return 'Lainnya';
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((j) => (
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
                { key: 'category', label: 'Kategori' },
                { key: 'description', label: 'Keterangan' },
                { key: 'amount', label: 'Nominal' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Expense)}
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
            {sortedExpenses.map((expense, index) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                    <span className="text-sm text-gray-900">{getCategoryName(expense.category)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{expense.description}</div>
                  {expense.notes && (
                    <div className="text-xs text-gray-500 mt-1">{expense.notes}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-purple-50 border-t border-purple-200">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right font-semibold text-purple-800">
                Total Pengeluaran:
              </td>
              <td className="px-6 py-4 font-bold text-lg text-purple-600">
                {formatCurrency(totalAmount)}
              </td>
              <td className="px-6 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedExpenses.map((expense, index) => (
          <div key={expense.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                  #{startIndex + index + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                  <span className="font-semibold text-gray-900">{getCategoryName(expense.category)}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(expense.amount)}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Tanggal:</span>
                <div className="font-medium">{formatDate(expense.date)}</div>
              </div>
              <div>
                <span className="text-gray-500">Keterangan:</span>
                <div className="font-medium">{expense.description}</div>
              </div>
              {expense.notes && (
                <div>
                  <span className="text-gray-500">Catatan:</span>
                  <div className="font-medium text-gray-700">{expense.notes}</div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => onEditExpense(expense)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Ubah
              </button>
              <button
                onClick={() => onDeleteExpense(expense)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Total */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-purple-800">Total Pengeluaran:</span>
            <span className="text-xl font-bold text-purple-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} pengeluaran
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
                          ? 'bg-purple-600 text-white'
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
      {expenses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💸</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Pengeluaran
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai catat pengeluaran operasional untuk tracking yang lebih baik.
          </p>
        </div>
      )}
    </div>
  );
}