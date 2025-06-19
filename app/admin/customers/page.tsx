'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import CustomersTable from '@/components/admin/CustomersTable';
import AddCustomerModal from '@/components/admin/AddCustomerModal';
import EditCustomerModal from '@/components/admin/EditCustomerModal';
import { useCustomers } from '@/hooks/useCustomers';
import { useDebounce } from '@/hooks/useDebounce';

export default function CustomersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: customers, isLoading, refetch } = useCustomers();

  // Filter customers based on search
  const filteredCustomers = customers?.filter(customer => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.includes(debouncedSearchTerm)
    );
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
  };

  const handleDeleteCustomer = (customer: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${customer.name}"?`)) {
      console.log('Delete customer:', customer.id);
      // Here you would call the delete API
      // await deleteCustomer(customer.id);
      refetch();
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingCustomer(null);
    refetch(); // Refresh data after modal closes
  };

  return (
    <DashboardLayout title="Manajemen Pelanggan" subtitle="Kelola data pelanggan laundry">
      <div className="space-y-6">
        {/* Header & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">👥 Daftar Pelanggan</h2>
              <p className="text-sm text-gray-600">Kelola dan pantau data semua pelanggan</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Pelanggan</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Pencarian Pelanggan
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama atau nomor HP..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="text-gray-400">🔍</span>
                )}
              </div>
            </div>
            
            {/* Search Results Info */}
            <div className="mt-2 text-sm text-gray-600">
              {debouncedSearchTerm ? (
                <span>
                  Menampilkan {filteredCustomers.length} dari {customers?.length || 0} pelanggan
                  {debouncedSearchTerm && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      &quot;{debouncedSearchTerm}&quot;
                    </span>
                  )}
                </span>
              ) : (
                <span>Total {customers?.length || 0} pelanggan terdaftar</span>
              )}
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <CustomersTable
          customers={paginatedCustomers}
          isLoading={isLoading}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={handleModalClose}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          isOpen={!!editingCustomer}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}