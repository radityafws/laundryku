'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/admin/DashboardLayout';
import ExpensesTable from '@/components/admin/ExpensesTable';
import AddExpenseModal from '@/components/admin/AddExpenseModal';
import EditExpenseModal from '@/components/admin/EditExpenseModal';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { useExpenses } from '@/hooks/useExpenses';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

// Dynamically import ExpenseSummaryChart with SSR disabled
const ExpenseSummaryChart = dynamic(
  () => import('@/components/admin/ExpenseSummaryChart'),
  { ssr: false }
);

export default function ExpensesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState(() => {
    // Default to current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: expenses, isLoading, refetch } = useExpenses();

  // Filter expenses based on search and filters
  const filteredExpenses = expenses?.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    const matchesDateRange = (!dateRange.startDate && !dateRange.endDate) || 
      (expense.date >= dateRange.startDate && expense.date <= dateRange.endDate);
    
    return matchesSearch && matchesCategory && matchesDateRange;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, categoryFilter, dateRange]);

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCount = filteredExpenses.length;

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
  };

  const handleDeleteExpense = (expense: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengeluaran "${expense.description}"?`)) {
      // Here you would call the delete API
      console.log('Delete expense:', expense.id);
      toast.success('Pengeluaran berhasil dihapus!');
      refetch();
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    refetch(); // Refresh data after modal closes
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return 'Semua tanggal';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    if (dateRange.startDate === dateRange.endDate) {
      return formatDate(dateRange.startDate);
    }
    
    return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateRange({ startDate: '', endDate: '' });
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || dateRange.startDate || dateRange.endDate;

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'electricity', label: 'Listrik' },
    { value: 'water', label: 'Air' },
    { value: 'detergent', label: 'Detergen' },
    { value: 'salary', label: 'Gaji' },
    { value: 'rent', label: 'Sewa' },
    { value: 'maintenance', label: 'Perawatan' },
    { value: 'other', label: 'Lainnya' }
  ];

  return (
    <DashboardLayout title="Manajemen Pengeluaran" subtitle="Kelola dan pantau pengeluaran operasional">
      <div className="space-y-6">
        {/* Date Filter Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-purple-800">Filter Periode Aktif</h3>
                <p className="text-purple-700">{formatDateRange()}</p>
              </div>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>


        {/* Chart */}
        <ExpenseSummaryChart expenses={filteredExpenses} isLoading={isLoading} />

        {/* Header & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">💰 Manajemen Pengeluaran</h2>
              <p className="text-sm text-gray-600">Kelola dan pantau semua pengeluaran operasional</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Pengeluaran</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pencarian
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari keterangan pengeluaran..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Kategori
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Rentang Tanggal
              </label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Pilih rentang tanggal..."
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {filteredExpenses.length} dari {expenses?.length || 0} pengeluaran
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Pencarian: &quot;{searchTerm}&quot;
                  </span>
                )}
                {categoryFilter !== 'all' && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Kategori: {categoryOptions.find(c => c.value === categoryFilter)?.label}
                  </span>
                )}
                {(dateRange.startDate || dateRange.endDate) && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Periode: {formatDateRange()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expenses Table */}
        <ExpensesTable
          expenses={paginatedExpenses}
          isLoading={isLoading}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredExpenses.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          totalAmount={totalExpenses}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddExpenseModal
          isOpen={showAddModal}
          onClose={handleModalClose}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          isOpen={!!editingExpense}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}