'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import StatsCard from '@/components/admin/StatsCard';
import OrdersTable from '@/components/admin/OrdersTable';
import AddOrderModal from '@/components/admin/AddOrderModal';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const { data: orders, isLoading } = useOrders();

  // Filter orders based on search and filters
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = !dateFilter || order.dateIn.startsWith(dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const inProgressOrders = orders?.filter(order => order.status === 'in-progress').length || 0;
  const readyOrders = orders?.filter(order => order.status === 'ready').length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const handlePrintReceipt = (order: any) => {
    // Implement print receipt functionality
    console.log('Print receipt for:', order.invoice);
  };

  const handlePrintOrder = (order: any) => {
    // Implement print order functionality
    console.log('Print order for:', order.invoice);
  };

  const handleUpdateStatus = (order: any, newStatus: string) => {
    // Implement status update functionality
    console.log('Update status for:', order.invoice, 'to:', newStatus);
  };

  return (
    <DashboardLayout title="Daftar Pesanan" subtitle="Kelola semua pesanan laundry">
      <div className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            icon="📦"
            title="Total Pesanan"
            value={totalOrders}
            subtitle="semua pesanan"
            color="blue"
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="🔄"
            title="Dalam Proses"
            value={inProgressOrders}
            subtitle="sedang dikerjakan"
            color="yellow"
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="✅"
            title="Siap Diambil"
            value={readyOrders}
            subtitle="menunggu pickup"
            color="green"
            isLoading={isLoading}
          />
          
          <StatsCard
            icon="✔️"
            title="Sudah Diambil"
            value={completedOrders}
            subtitle="selesai"
            color="purple"
            isLoading={isLoading}
          />
        </div>

        {/* Header & Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📋 Manajemen Pesanan</h2>
              <p className="text-sm text-gray-600">Kelola dan pantau semua pesanan laundry</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Pesanan</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pencarian
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari invoice, nama, atau nomor HP..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="in-progress">Dalam Proses</option>
                <option value="ready">Siap Diambil</option>
                <option value="completed">Sudah Diambil</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
                📅 Tanggal
              </label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {filteredOrders.length} dari {totalOrders} pesanan
            </span>
            {(searchTerm || statusFilter !== 'all' || dateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          isLoading={isLoading}
          onViewOrder={handleViewOrder}
          onPrintReceipt={handlePrintReceipt}
          onPrintOrder={handlePrintOrder}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrintReceipt={handlePrintReceipt}
          onPrintOrder={handlePrintOrder}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </DashboardLayout>
  );
}