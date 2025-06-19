'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import StatsCard from '@/components/admin/StatsCard';
import OrdersTable from '@/components/admin/OrdersTable';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { useOrders } from '@/hooks/useOrders';
import { useOrderStatuses } from '@/hooks/useOrderStatus';
import { useDebounce } from '@/hooks/useDebounce';

export default function OrdersPage() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(() => {
    // Default to current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    };
  });
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: orderStatuses, isLoading: isLoadingStatuses } = useOrderStatuses();

  // Filter orders based on search and filters
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.invoice.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      order.customerPhone.includes(debouncedSearchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesPaymentStatus = paymentStatusFilter === 'all' || 
      (paymentStatusFilter === 'paid' && order.paymentStatus === 'paid') ||
      (paymentStatusFilter === 'unpaid' && order.paymentStatus === 'unpaid');
    
    const matchesDateRange = (!dateRange.startDate && !dateRange.endDate) || 
      (order.dateIn >= dateRange.startDate && order.dateIn <= dateRange.endDate);
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, paymentStatusFilter, dateRange]);

  // Calculate stats
  const getOrderCountByStatus = (status: string) => {
    return orders?.filter(order => order.status === status).length || 0;
  };

  const getOrderCountByPaymentStatus = (paymentStatus: string) => {
    return orders?.filter(order => order.paymentStatus === paymentStatus).length || 0;
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const handlePrintReceipt = (order: any) => {
    console.log('Print receipt for:', order.invoice);
  };

  const handlePrintOrder = (order: any) => {
    console.log('Print order for:', order.invoice);
  };

  const handleUpdateStatus = (order: any, newStatus: string) => {
    console.log('Update status for:', order.invoice, 'to:', newStatus);
  };

  const handleUpdatePaymentStatus = (order: any, newStatus: string) => {
    console.log('Update payment status for:', order.invoice, 'to:', newStatus);
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
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateRange({ startDate: '', endDate: '' });
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || paymentStatusFilter !== 'all' || dateRange.startDate || dateRange.endDate;

  // Get default statuses (first 4)
  const defaultStatuses = orderStatuses?.slice(0, 4) || [];
  const remainingStatuses = orderStatuses?.slice(4) || [];

  return (
    <DashboardLayout title="Daftar Pesanan" subtitle="Kelola semua pesanan laundry">
      <div className="space-y-6">
        {/* Date Filter Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-blue-800">Filter Tanggal Aktif</h3>
                <p className="text-blue-700">{formatDateRange()}</p>
              </div>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ringkasan Status Pesanan</h3>
            <button
              onClick={() => setShowAllStatuses(!showAllStatuses)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAllStatuses ? 'Sembunyikan' : 'Lihat Semua Status'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* Default Statuses (first 4) */}
            {isLoadingStatuses ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse bg-white p-6 rounded-2xl h-24"></div>
              ))
            ) : (
              defaultStatuses.map((status) => (
                <StatsCard
                  key={status.id}
                  icon={status.icon}
                  title={status.name}
                  value={getOrderCountByStatus(status.id)}
                  subtitle="pesanan"
                  color="blue"
                  isLoading={isLoadingOrders}
                />
              ))
            )}
          </div>

          {/* Additional Statuses (expandable) */}
          {showAllStatuses && remainingStatuses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
              {remainingStatuses.map((status) => (
                <StatsCard
                  key={status.id}
                  icon={status.icon}
                  title={status.name}
                  value={getOrderCountByStatus(status.id)}
                  subtitle="pesanan"
                  color="blue"
                  isLoading={isLoadingOrders}
                />
              ))}
              
              {/* Payment Status Cards */}
              <StatsCard
                icon="✅"
                title="Sudah Dibayar"
                value={getOrderCountByPaymentStatus('paid')}
                subtitle="pesanan"
                color="green"
                isLoading={isLoadingOrders}
              />
              
              <StatsCard
                icon="⏳"
                title="Belum Dibayar"
                value={getOrderCountByPaymentStatus('unpaid')}
                subtitle="pesanan"
                color="yellow"
                isLoading={isLoadingOrders}
              />
            </div>
          )}
        </div>

        {/* Header & Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📋 Manajemen Pesanan</h2>
              <p className="text-sm text-gray-600">Kelola dan pantau semua pesanan laundry</p>
            </div>
            
            <button
              onClick={() => router.push('/admin/cashier')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>💰</span>
              <span>Buka Halaman Kasir</span>
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
                placeholder="Cari invoice, nama, HP..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Status Pesanan
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                <option value="all">Semua Status</option>
                {orderStatuses?.filter(status => status.isActive).map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.icon} {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label htmlFor="payment-status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                💰 Status Pembayaran
              </label>
              <select
                id="payment-status-filter"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Sudah Dibayar</option>
                <option value="unpaid">Belum Dibayar</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
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
              Menampilkan {filteredOrders.length} dari {orders?.length || 0} pesanan
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Pencarian: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Status: {orderStatuses?.find(s => s.id === statusFilter)?.name || statusFilter}
                  </span>
                )}
                {paymentStatusFilter !== 'all' && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Pembayaran: {paymentStatusFilter === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                  </span>
                )}
                {(dateRange.startDate || dateRange.endDate) && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                    Tanggal: {formatDateRange()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={paginatedOrders}
          isLoading={isLoadingOrders}
          onViewOrder={handleViewOrder}
          onPrintReceipt={handlePrintReceipt}
          onPrintOrder={handlePrintOrder}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          orderStatuses={orderStatuses}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrintReceipt={handlePrintReceipt}
          onPrintOrder={handlePrintOrder}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          orderStatuses={orderStatuses}
        />
      )}
    </DashboardLayout>
  );
}