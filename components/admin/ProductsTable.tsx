'use client';

import { useState } from 'react';

interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  type: 'product' | 'service';
  description?: string;
  hasVariations: boolean;
  variations: ProductVariation[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ProductsTable({
  products,
  isLoading,
  onEditProduct,
  onDeleteProduct,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: ProductsTableProps) {
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
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

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'laundry': return 'Layanan Laundry';
      case 'detergent': return 'Detergen';
      case 'perfume': return 'Parfum';
      case 'packaging': return 'Kemasan';
      case 'other': return 'Lainnya';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'laundry': return '🧺';
      case 'detergent': return '🧴';
      case 'perfume': return '🌸';
      case 'packaging': return '📦';
      case 'other': return '🔖';
      default: return '🏷️';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'service' ? '🧼' : '🛍️';
  };

  const getTypeText = (type: string) => {
    return type === 'service' ? 'Layanan' : 'Produk';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Aktif' : 'Tidak Aktif';
  };

  const getTotalStock = (product: Product) => {
    if (product.type === 'service') return '-';
    
    if (product.hasVariations) {
      const total = product.variations.reduce((sum, variation) => sum + variation.stock, 0);
      return total === 0 ? '⚠️ Stok Habis' : total.toString();
    }
    
    return product.stock === 0 ? '⚠️ Stok Habis' : product.stock.toString();
  };

  const toggleExpandProduct = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
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
                { key: 'name', label: 'Nama Item' },
                { key: 'sku', label: 'SKU' },
                { key: 'price', label: 'Harga' },
                { key: 'stock', label: 'Stok' }
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof Product)}
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
            {sortedProducts.map((product, index) => (
              <>
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{getTypeIcon(product.type)}</span>
                          <span>{product.name}</span>
                        </div>
                        {product.hasVariations && (
                          <button
                            onClick={() => toggleExpandProduct(product.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors mt-1 flex items-center space-x-1"
                          >
                            <span>{expandedProductId === product.id ? 'Sembunyikan' : 'Lihat'} {product.variations.length} variasi</span>
                            <span>{expandedProductId === product.id ? '▲' : '▼'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.hasVariations 
                      ? `${formatCurrency(Math.min(...product.variations.map(v => v.price)))} - ${formatCurrency(Math.max(...product.variations.map(v => v.price)))}`
                      : formatCurrency(product.price)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTotalStock(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Variations Rows */}
                {expandedProductId === product.id && product.hasVariations && product.variations.map((variation) => (
                  <tr key={variation.id} className="bg-gray-50">
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3">
                      <div className="pl-4 border-l-2 border-blue-300">
                        <div className="text-sm text-gray-700">{variation.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {variation.sku}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(variation.price)}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {product.type === 'service' ? '-' : (variation.stock === 0 ? '⚠️ Stok Habis' : variation.stock)}
                    </td>
                    <td className="px-6 py-3"></td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedProducts.map((product, index) => (
          <div key={product.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                  #{startIndex + index + 1}
                </span>
                <div className="font-semibold text-gray-900 flex items-center space-x-1">
                  <span>{getTypeIcon(product.type)}</span>
                  <span>{product.name}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                {getStatusText(product.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">SKU:</span>
                <div className="font-medium">{product.sku}</div>
              </div>
              <div>
                <span className="text-gray-500">Harga:</span>
                <div className="font-medium">
                  {product.hasVariations 
                    ? `${formatCurrency(Math.min(...product.variations.map(v => v.price)))} - ${formatCurrency(Math.max(...product.variations.map(v => v.price)))}`
                    : formatCurrency(product.price)
                  }
                </div>
              </div>
              {product.type === 'product' && (
                <div>
                  <span className="text-gray-500">Stok:</span>
                  <div className="font-medium">{getTotalStock(product)}</div>
                </div>
              )}
              <div>
                <span className="text-gray-500">Kategori:</span>
                <div className="font-medium flex items-center space-x-1">
                  <span>{getCategoryIcon(product.category)}</span>
                  <span>{getCategoryName(product.category)}</span>
                </div>
              </div>
            </div>
            
            {/* Variations (Mobile) */}
            {product.hasVariations && (
              <div>
                <button
                  onClick={() => toggleExpandProduct(product.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                >
                  <span>{expandedProductId === product.id ? 'Sembunyikan' : 'Lihat'} variasi</span>
                  <span>{expandedProductId === product.id ? '▲' : '▼'}</span>
                </button>
                
                {expandedProductId === product.id && (
                  <div className="mt-2 space-y-2">
                    {product.variations.map((variation) => (
                      <div key={variation.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between">
                          <div className="font-medium">{variation.name}</div>
                          <div className="text-blue-600">{formatCurrency(variation.price)}</div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <div className="text-gray-500">{variation.sku}</div>
                          <div className={variation.stock === 0 && product.type !== 'service' ? 'text-red-500' : 'text-gray-700'}>
                            {product.type === 'service' ? '-' : (variation.stock === 0 ? '⚠️ Stok Habis' : `Stok: ${variation.stock}`)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => onEditProduct(product)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Ubah
              </button>
              <button
                onClick={() => onDeleteProduct(product)}
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
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} item
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
      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧺</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Belum Ada Produk atau Layanan
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai tambahkan produk atau layanan untuk mengelola bisnis laundry Anda.
          </p>
        </div>
      )}
    </div>
  );
}