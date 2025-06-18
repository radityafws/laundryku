'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/admin/DashboardLayout';
import StatsCard from '@/components/admin/StatsCard';
import DateRangePicker from '@/components/ui/DateRangePicker';
import ReportsTable from '@/components/admin/ReportsTable';
import ProfitLossAnalysis from '@/components/admin/ProfitLossAnalysis';
import ExportReportModal from '@/components/admin/ExportReportModal';
import { useReportsData } from '@/hooks/useReports';
import { useDebounce } from '@/hooks/useDebounce';

// Dynamically import charts with SSR disabled
const RevenueChart = dynamic(
  () => import('@/components/admin/RevenueChart'),
  { ssr: false }
);

const ComparisonChart = dynamic(
  () => import('@/components/admin/ComparisonChart'),
  { ssr: false }
);

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
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
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [hideYearlyExpenses, setHideYearlyExpenses] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: reportsData, isLoading, refetch } = useReportsData({
    reportType,
    dateRange,
    hideYearlyExpenses
  });

  // Filter transactions based on search and filters
  const filteredTransactions = reportsData?.transactions?.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesType = transactionFilter === 'all' || transaction.type === transactionFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, transactionFilter, dateRange, reportType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return 'Semua periode';
    
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
    setTransactionFilter('all');
    setDateRange({ startDate: '', endDate: '' });
  };

  const hasActiveFilters = searchTerm || transactionFilter !== 'all' || dateRange.startDate || dateRange.endDate;

  const handleQuickDateRange = (type: string) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = new Date(today);

    switch (type) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'this_week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'this_year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last_year':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  return (
    <DashboardLayout title="Laporan Keuangan" subtitle="Analisis performa keuangan dan laporan komprehensif">
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📊 Filter Periode & Jenis Laporan</h2>
                <p className="text-sm text-gray-600">Pilih periode dan jenis laporan yang ingin ditampilkan</p>
              </div>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>📤</span>
                <span>Export Laporan</span>
              </button>
            </div>

            {/* Quick Date Shortcuts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ⚡ Shortcut Periode
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { key: 'today', label: 'Hari Ini' },
                  { key: 'this_week', label: 'Minggu Ini' },
                  { key: 'this_month', label: 'Bulan Ini' },
                  { key: 'this_year', label: 'Tahun Ini' },
                  { key: 'last_month', label: 'Bulan Lalu' },
                  { key: 'last_year', label: 'Tahun Lalu' }
                ].map((shortcut) => (
                  <button
                    key={shortcut.key}
                    onClick={() => handleQuickDateRange(shortcut.key)}
                    className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
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

              {/* Report Type */}
              <div>
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-2">
                  📈 Jenis Laporan
                </label>
                <select
                  id="report-type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly' | 'yearly')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                >
                  <option value="daily">Harian</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              {/* Yearly Expenses Toggle */}
              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideYearlyExpenses}
                    onChange={(e) => setHideYearlyExpenses(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sembunyikan Pengeluaran Tahunan</span>
                    <p className="text-xs text-gray-500">Untuk laporan bulanan yang proporsional</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
              <span>
                Periode aktif: <span className="font-medium text-blue-600">{formatDateRange()}</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg font-medium transition-colors text-xs"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            icon="💰"
            title="Total Pendapatan"
            value={reportsData ? formatCurrency(reportsData.summary.totalRevenue) : 'Rp 0'}
            subtitle="dalam periode"
            trend={{ value: reportsData?.summary.revenueTrend || 0, isPositive: (reportsData?.summary.revenueTrend || 0) >= 0 }}
            color="green"
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="💸"
            title="Total Pengeluaran"
            value={reportsData ? formatCurrency(reportsData.summary.totalExpenses) : 'Rp 0'}
            subtitle="dalam periode"
            trend={{ value: reportsData?.summary.expensesTrend || 0, isPositive: (reportsData?.summary.expensesTrend || 0) <= 0 }}
            color="red"
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="📈"
            title="Profit Bersih"
            value={reportsData ? formatCurrency(reportsData.summary.netProfit) : 'Rp 0'}
            subtitle="laba/rugi"
            trend={{ value: reportsData?.summary.profitTrend || 0, isPositive: (reportsData?.summary.profitTrend || 0) >= 0 }}
            color={reportsData && reportsData.summary.netProfit >= 0 ? "green" : "red"}
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="📦"
            title="Jumlah Pesanan"
            value={reportsData?.summary.totalOrders || 0}
            subtitle="transaksi"
            trend={{ value: reportsData?.summary.ordersTrend || 0, isPositive: (reportsData?.summary.ordersTrend || 0) >= 0 }}
            color="blue"
            isLoading={isLoading}
          />
        </div>

        {/* Profit & Loss Analysis */}
        <ProfitLossAnalysis 
          data={reportsData?.profitLoss} 
          isLoading={isLoading}
          hideYearlyExpenses={hideYearlyExpenses}
        />

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <RevenueChart 
            data={reportsData?.chartData} 
            isLoading={isLoading}
            reportType={reportType}
          />
          
          {/* Comparison Chart */}
          <ComparisonChart 
            data={reportsData?.comparisonData} 
            isLoading={isLoading}
            reportType={reportType}
          />
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📋 Detail Transaksi</h2>
              <p className="text-sm text-gray-600">Semua transaksi pemasukan dan pengeluaran</p>
            </div>
          </div>

          {/* Transaction Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pencarian
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari keterangan atau kategori..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label htmlFor="transaction-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Jenis Transaksi
              </label>
              <select
                id="transaction-filter"
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                <option value="all">Semua Transaksi</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {filteredTransactions.length} dari {reportsData?.transactions?.length || 0} transaksi
            </span>
            {(searchTerm || transactionFilter !== 'all') && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Pencarian: "{searchTerm}"
                  </span>
                )}
                {transactionFilter !== 'all' && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Jenis: {transactionFilter === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <ReportsTable
          transactions={paginatedTransactions}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTransactions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportReportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          reportData={reportsData}
          dateRange={dateRange}
          reportType={reportType}
        />
      )}
    </DashboardLayout>
  );
}