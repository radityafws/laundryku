'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import ProductsTable from '@/components/admin/ProductsTable';
import AddProductModal from '@/components/admin/AddProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import { useProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { data: products, isLoading, refetch } = useProducts();

  // Filter products based on search and filters
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, categoryFilter, typeFilter]);

  // Calculate stats
  const totalProducts = products?.length || 0;
  const totalServices = products?.filter(p => p.type === 'service').length || 0;
  const totalPhysicalProducts = products?.filter(p => p.type === 'product').length || 0;
  const outOfStockProducts = products?.filter(p => 
    p.type === 'product' && 
    (p.hasVariations 
      ? p.variations.every(v => v.stock === 0)
      : p.stock === 0)
  ).length || 0;

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (product: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${product.type === 'service' ? 'layanan' : 'produk'} "${product.name}"?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
      console.log('Delete product:', product.id);
      toast.success(`${product.type === 'service' ? 'Layanan' : 'Produk'} "${product.name}" berhasil dihapus!`, {
        position: "top-right",
        autoClose: 3000,
      });
      refetch();
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    refetch();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || typeFilter !== 'all';

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'laundry', label: 'Layanan Laundry' },
    { value: 'detergent', label: 'Detergen' },
    { value: 'perfume', label: 'Parfum' },
    { value: 'packaging', label: 'Kemasan' },
    { value: 'other', label: 'Lainnya' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'product', label: 'Produk Fisik' },
    { value: 'service', label: 'Layanan' }
  ];

  return (
    <DashboardLayout title="Manajemen Produk & Layanan" subtitle="Kelola produk dan layanan laundry">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Item</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧼</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Layanan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalServices}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛍️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Produk Fisik</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPhysicalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stok Habis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {outOfStockProducts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🧺 Daftar Produk & Layanan</h2>
              <p className="text-sm text-gray-600">Kelola produk fisik dan layanan laundry</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>➕</span>
              <span>Tambah Item</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Pencarian
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama atau SKU..."
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

            {/* Category Filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Kategori
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                🔖 Jenis Item
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Menampilkan {filteredProducts.length} dari {products?.length || 0} item
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Pencarian: &quot;{searchTerm}&quot;
                  </span>
                )}
                {categoryFilter !== 'all' && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Kategori: {categoryOptions.find(c => c.value === categoryFilter)?.label}
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    Jenis: {typeOptions.find(t => t.value === typeFilter)?.label}
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

        {/* Products Table */}
        <ProductsTable
          products={paginatedProducts}
          isLoading={isLoading}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={handleModalClose}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}