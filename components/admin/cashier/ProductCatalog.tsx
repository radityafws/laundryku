import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';

interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  sku: string;
  price: number;
  quantity?: number;
  weight?: number;
  variation?: string;
  variationId?: string;
  subtotal: number;
}

interface ProductCatalogProps {
  addToCart: (product: any, variation?: any) => void;
}

export default function ProductCatalog({ addToCart }: ProductCatalogProps) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  
  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  
  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Filter products based on search, category, and type
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  }) || [];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get category name
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
  
  // Get category icon
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

  // Open variations modal
  const openVariationsModal = (product: any) => {
    setSelectedProduct(product);
    setShowVariationsModal(true);
  };

  // Add product with variation from modal
  const addVariationFromModal = (variation: any) => {
    if (selectedProduct) {
      addToCart(selectedProduct, variation);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">🛍️ Katalog Produk & Layanan</h3>
          <p className="text-sm text-gray-600">Pilih item untuk ditambahkan ke keranjang</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDisplayMode('grid')}
            className={`p-2 rounded-lg ${
              displayMode === 'grid' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Grid View"
          >
            <span className="text-lg">🔲</span>
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`p-2 rounded-lg ${
              displayMode === 'list' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="List View"
          >
            <span className="text-lg">📋</span>
          </button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Pencarian
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau SKU..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏷️ Kategori
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="laundry">Layanan Laundry</option>
            <option value="detergent">Detergen</option>
            <option value="perfume">Parfum</option>
            <option value="packaging">Kemasan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔖 Jenis Item
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
          >
            <option value="all">Semua Jenis</option>
            <option value="product">Produk Fisik</option>
            <option value="service">Layanan</option>
          </select>
        </div>
      </div>
      
      {/* Products Grid/List */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada item ditemukan</h4>
          <p className="text-gray-600">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : displayMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              {/* Product Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{product.type === 'service' ? '🧼' : '🛍️'}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200">
                      {product.type === 'service' ? 'Layanan' : 'Produk'}
                    </span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200 flex items-center space-x-1">
                    <span>{getCategoryIcon(product.category)}</span>
                  </span>
                </div>
              </div>
              
              {/* Product Content */}
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <h4 className="font-medium text-gray-900 line-clamp-2 min-h-[40px]">{product.name}</h4>
                
                {/* Price & Stock */}
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-sm font-semibold text-blue-600">
                    {product.hasVariations 
                      ? `${formatCurrency(Math.min(...product.variations.map(v => v.price)))} +`
                      : formatCurrency(product.price)
                    }
                  </div>
                  
                  {product.type === 'product' && !product.hasVariations && (
                    <div className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                    </div>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                {product.hasVariations ? (
                  <button
                    onClick={() => openVariationsModal(product)}
                    className="w-full mt-2 py-2 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Pilih Variasi
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.type === 'product' && product.stock === 0}
                    className={`w-full mt-2 py-2 rounded-lg font-medium text-sm ${
                      product.type === 'product' && product.stock === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    + Tambah
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3 max-h-[500px] overflow-y-auto p-1">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {/* Product Info */}
                <div className="p-4 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{product.type === 'service' ? '🧼' : '🛍️'}</span>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200">
                      {product.type === 'service' ? 'Layanan' : 'Produk'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200 flex items-center space-x-1">
                      <span>{getCategoryIcon(product.category)}</span>
                      <span>{getCategoryName(product.category)}</span>
                    </span>
                    
                    <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200">
                      SKU: {product.sku}
                    </span>
                    
                    {product.type === 'product' && !product.hasVariations && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                        product.stock > 0 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm font-semibold text-blue-600">
                    {product.hasVariations 
                      ? `${formatCurrency(Math.min(...product.variations.map(v => v.price)))} - ${formatCurrency(Math.max(...product.variations.map(v => v.price)))}`
                      : formatCurrency(product.price)
                    }
                  </div>
                </div>
                
                {/* Add to Cart */}
                <div className="p-4 bg-gray-100 border-t sm:border-t-0 sm:border-l border-gray-200 flex flex-col justify-center">
                  {product.hasVariations ? (
                    <button
                      onClick={() => openVariationsModal(product)}
                      className="py-2 px-4 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Pilih Variasi
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.type === 'product' && product.stock === 0}
                      className={`py-2 px-4 rounded-lg font-medium text-sm ${
                        product.type === 'product' && product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      + Tambah ke Keranjang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Variations Modal */}
      <Modal
        isOpen={showVariationsModal}
        onClose={() => setShowVariationsModal(false)}
        size="md"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Pilih Variasi</h3>
          <p className="text-gray-600">{selectedProduct?.name}</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">{selectedProduct?.type === 'service' ? '🧼' : '🛍️'}</span>
              <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">
                {selectedProduct?.type === 'service' ? 'Layanan' : 'Produk'}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full flex items-center space-x-1">
                <span>{getCategoryIcon(selectedProduct?.category)}</span>
                <span>{getCategoryName(selectedProduct?.category)}</span>
              </span>
            </div>
            
            <div className="space-y-3">
              {selectedProduct?.variations.map((variation: any) => (
                <button
                  key={variation.id}
                  onClick={() => {
                    addVariationFromModal(variation);
                    setShowVariationsModal(false);
                  }}
                  disabled={selectedProduct?.type === 'product' && variation.stock === 0}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedProduct?.type === 'product' && variation.stock === 0
                      ? 'border-red-200 bg-red-50 text-red-700 cursor-not-allowed'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{variation.name}</div>
                    <div className="text-sm">{variation.sku}</div>
                    {selectedProduct?.type === 'product' && (
                      <div className={`text-sm ${variation.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variation.stock > 0 ? `Stok: ${variation.stock}` : 'Stok Habis'}
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(variation.price)}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowVariationsModal(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}