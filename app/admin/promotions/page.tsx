'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import PromotionsTable from '@/components/admin/PromotionsTable';
import AddPromotionModal from '@/components/admin/AddPromotionModal';
import EditPromotionModal from '@/components/admin/EditPromotionModal';
import WhatsAppBroadcastModal from '@/components/admin/WhatsAppBroadcastModal';
import { usePromotions } from '@/hooks/usePromotions';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

export default function PromotionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [broadcastPromotion, setBroadcastPromotion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: promotions, isLoading, refetch } = usePromotions();

  // Filter promotions based on search and filters
  const filteredPromotions = promotions?.filter(promotion => {
    const matchesSearch = 
      promotion.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Calculate stats
  const totalPromotions = promotions?.length || 0;
  const activePromotions = promotions?.filter(promo => promo.status === 'active').length || 0;
  const expiredPromotions = promotions?.filter(promo => promo.status === 'expired').length || 0;

  const handleEditPromotion = (promotion: any) => {
    setEditingPromotion(promotion);
  };

  const handleDeletePromotion = (promotion: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus promosi "${promotion.title}"?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
      console.log('Delete promotion:', promotion.id);
      toast.success(`Promosi "${promotion.title}" berhasil dihapus!`, {
        position: "top-right",
        autoClose: 3000,
      });
      refetch();
    }
  };

  const handleBroadcastPromotion = (promotion: any) => {
    setBroadcastPromotion(promotion);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingPromotion(null);
    setBroadcastPromotion(null);
    refetch();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  return (
    <DashboardLayout title="Manajemen Promosi" subtitle="Kelola promosi dan kirim broadcast WhatsApp">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Promosi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPromotions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Promosi Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activePromotions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Promosi Berakhir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expiredPromotions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🎯 Daftar Promosi</h2>
              <p className="text-sm text-gray-600">Kelola promosi dan kirim broadcast WhatsApp</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Promosi</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pencarian Promosi
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari judul, kode, atau deskripsi..."
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
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Status Promosi
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="scheduled">Terjadwal</option>
                <option value="expired">Berakhir</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {filteredPromotions.length} dari {promotions?.length || 0} promosi
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Pencarian: &quot;{searchTerm}&quot;
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Status: {statusFilter}
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-lg font-medium transition-colors text-xs"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Promotions Table */}
        <PromotionsTable
          promotions={paginatedPromotions}
          isLoading={isLoading}
          onEditPromotion={handleEditPromotion}
          onDeletePromotion={handleDeletePromotion}
          onBroadcastPromotion={handleBroadcastPromotion}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPromotions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPromotionModal
          isOpen={showAddModal}
          onClose={handleModalClose}
        />
      )}

      {editingPromotion && (
        <EditPromotionModal
          promotion={editingPromotion}
          isOpen={!!editingPromotion}
          onClose={handleModalClose}
        />
      )}

      {broadcastPromotion && (
        <WhatsAppBroadcastModal
          promotion={broadcastPromotion}
          isOpen={!!broadcastPromotion}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}