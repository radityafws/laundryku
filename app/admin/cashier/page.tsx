'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Select from '@/components/ui/Select';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useOrderStatuses } from '@/hooks/useOrderStatus';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

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

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
}

export default function CashierPage() {
  const router = useRouter();
  
  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isQuickPurchase, setIsQuickPurchase] = useState(false);
  
  // Product/service display state
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromos, setAppliedPromos] = useState<PromoCode[]>([]);
  const [promoCode, setPromoCode] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [orderStatus, setOrderStatus] = useState('1'); // Default to first status
  const [notes, setNotes] = useState('');
  
  // Fetch data
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: orderStatuses, isLoading: isLoadingStatuses } = useOrderStatuses();
  
  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Set default order status when statuses are loaded
  useEffect(() => {
    if (orderStatuses && orderStatuses.length > 0) {
      setOrderStatus(orderStatuses[0].id);
    }
  }, [orderStatuses]);
  
  // Filter products based on search, category, and type
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  }) || [];
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  const discountAmount = appliedPromos.reduce((sum, promo) => {
    if (promo.isPercentage) {
      return sum + (subtotal * promo.discount / 100);
    } else {
      return sum + promo.discount;
    }
  }, 0);
  
  const total = Math.max(0, subtotal - discountAmount);
  
  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setIsQuickPurchase(false);
  };
  
  // Handle creating new customer
  const handleCreateCustomer = (name: string) => {
    const newCustomer = {
      value: `new_${Date.now()}`,
      label: name,
      phone: ''
    };
    
    setSelectedCustomer(newCustomer);
    setIsQuickPurchase(false);
  };
  
  // Handle quick purchase toggle
  const handleQuickPurchaseToggle = () => {
    setIsQuickPurchase(!isQuickPurchase);
    if (!isQuickPurchase) {
      setSelectedCustomer(null);
    }
  };
  
  // Add item to cart
  const addToCart = (product: any, variation?: any) => {
    // For products with variations, require selecting a variation
    if (product.hasVariations && !variation) {
      return;
    }
    
    const newItem: CartItem = {
      id: variation ? `${product.id}_${variation.id}` : product.id,
      type: product.type,
      name: product.name,
      sku: variation ? variation.sku : product.sku,
      price: variation ? variation.price : product.price,
      quantity: product.type === 'product' ? 1 : undefined,
      weight: product.type === 'service' ? 1 : undefined,
      variation: variation?.name,
      variationId: variation?.id,
      subtotal: variation ? variation.price : product.price
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cartItems];
      const existingItem = updatedItems[existingItemIndex];
      
      if (existingItem.type === 'product' && existingItem.quantity) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
      } else if (existingItem.type === 'service' && existingItem.weight) {
        existingItem.weight += 0.5;
        existingItem.subtotal = existingItem.price * existingItem.weight;
      }
      
      setCartItems(updatedItems);
      toast.success(`Jumlah ${product.name} ditambah!`);
    } else {
      // Add new item
      setCartItems([...cartItems, newItem]);
      toast.success(`${product.name} ditambahkan ke keranjang!`);
    }
  };
  
  // Update cart item quantity/weight
  const updateCartItem = (id: string, value: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        if (item.type === 'product') {
          return {
            ...item,
            quantity: value,
            subtotal: item.price * value
          };
        } else {
          return {
            ...item,
            weight: value,
            subtotal: item.price * value
          };
        }
      }
      return item;
    });
    
    setCartItems(updatedItems);
  };
  
  // Remove item from cart
  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.info('Item dihapus dari keranjang');
  };
  
  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode) {
      toast.error('Masukkan kode promo terlebih dahulu');
      return;
    }
    
    // Check if promo already applied
    if (appliedPromos.some(p => p.code === promoCode)) {
      toast.error('Kode promo sudah digunakan');
      return;
    }
    
    // Mock promo validation
    const mockPromos: Record<string, PromoCode> = {
      'DISKON10': { id: '1', code: 'DISKON10', discount: 10, isPercentage: true },
      'DISKON20': { id: '2', code: 'DISKON20', discount: 20, isPercentage: true },
      'POTONGAN10K': { id: '3', code: 'POTONGAN10K', discount: 10000, isPercentage: false }
    };
    
    const promo = mockPromos[promoCode.toUpperCase()];
    
    if (promo) {
      setAppliedPromos([...appliedPromos, promo]);
      setPromoCode('');
      toast.success(`Kode promo ${promo.code} berhasil diterapkan!`);
    } else {
      toast.error('Kode promo tidak valid');
    }
  };
  
  // Remove applied promo
  const removePromo = (id: string) => {
    setAppliedPromos(appliedPromos.filter(promo => promo.id !== id));
  };
  
  // Create order
  const createOrder = (printReceipt: boolean = false) => {
    if (cartItems.length === 0) {
      toast.error('Keranjang kosong. Tambahkan item terlebih dahulu.');
      return;
    }
    
    if (!isQuickPurchase && !selectedCustomer) {
      toast.error('Pilih pelanggan atau gunakan mode pembelian cepat');
      return;
    }
    
    // Prepare order data
    const orderData = {
      customer: isQuickPurchase ? null : selectedCustomer,
      items: cartItems,
      promos: appliedPromos,
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus,
      notes,
      date: new Date().toISOString()
    };
    
    console.log('Creating order:', orderData);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Pesanan berhasil dibuat!');
      
      if (printReceipt) {
        console.log('Printing receipt...');
        // In a real app, this would trigger receipt printing
      }
      
      // Reset form
      setCartItems([]);
      setAppliedPromos([]);
      setNotes('');
      setSelectedCustomer(null);
      setIsQuickPurchase(false);
      
      // Redirect to orders page
      router.push('/admin/orders');
    }, 1000);
  };
  
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

  return (
    <DashboardLayout title="Kasir" subtitle="Buat pesanan baru dan proses pembayaran">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">💰 Kasir</h2>
              <p className="text-sm text-gray-600">Buat pesanan baru dan proses pembayaran</p>
            </div>
            
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>📋</span>
              <span>Lihat Daftar Pesanan</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="xl:col-span-2 space-y-6">
            {/* Customer Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Informasi Pelanggan</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isQuickPurchase}
                      onChange={handleQuickPurchaseToggle}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Pembelian Cepat (tanpa data pelanggan)</span>
                  </label>
                </div>
                
                {!isQuickPurchase && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih Pelanggan
                      </label>
                      <Select
                        options={customers?.map(customer => ({
                          value: customer.id,
                          label: customer.name,
                          phone: customer.phone
                        })) || []}
                        value={selectedCustomer}
                        onChange={handleCustomerSelect}
                        onCreateOption={handleCreateCustomer}
                        placeholder="Cari nama pelanggan atau ketik nama baru..."
                        isSearchable={true}
                        isCreatable={true}
                        isLoading={isLoadingCustomers}
                      />
                    </div>
                    
                    {selectedCustomer && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor HP
                          </label>
                          <input
                            type="tel"
                            value={selectedCustomer.phone || ''}
                            onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                            placeholder="081234567890"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Catalog */}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                            <span className="hidden sm:inline">{getCategoryName(product.category)}</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Product Content */}
                      <div className="p-3 space-y-2">
                        <h4 className="font-medium text-gray-900 line-clamp-2 h-10">{product.name}</h4>
                        
                        {/* Price & Stock */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-semibold text-blue-600">
                            {product.hasVariations 
                              ? `${formatCurrency(Math.min(...product.variations.map(v => v.price)))} - ${formatCurrency(Math.max(...product.variations.map(v => v.price)))}`
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
                          <div className="space-y-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Pilih variasi:</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {product.variations.map((variation) => (
                                <button
                                  key={variation.id}
                                  onClick={() => addToCart(product, variation)}
                                  disabled={product.type === 'product' && variation.stock === 0}
                                  className={`w-full text-left text-xs p-2 rounded-lg border ${
                                    product.type === 'product' && variation.stock === 0
                                      ? 'border-red-200 bg-red-50 text-red-700 cursor-not-allowed'
                                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <span>{variation.name}</span>
                                    <span>{formatCurrency(variation.price)}</span>
                                  </div>
                                  {product.type === 'product' && (
                                    <div className="text-xs mt-1">
                                      {variation.stock > 0 ? `Stok: ${variation.stock}` : 'Stok Habis'}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
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
                    <div key={product.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">Pilih variasi:</p>
                              <div className="space-y-1 max-h-24 overflow-y-auto">
                                {product.variations.map((variation) => (
                                  <button
                                    key={variation.id}
                                    onClick={() => addToCart(product, variation)}
                                    disabled={product.type === 'product' && variation.stock === 0}
                                    className={`w-full text-left text-xs p-2 rounded-lg border ${
                                      product.type === 'product' && variation.stock === 0
                                        ? 'border-red-200 bg-red-50 text-red-700 cursor-not-allowed'
                                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                                  >
                                    <div className="flex justify-between">
                                      <span>{variation.name}</span>
                                      <span>{formatCurrency(variation.price)}</span>
                                    </div>
                                    {product.type === 'product' && (
                                      <div className="text-xs mt-1">
                                        {variation.stock > 0 ? `Stok: ${variation.stock}` : 'Stok Habis'}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
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
            </div>
          </div>
          
          {/* Right Column - Cart & Payment */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 xl:sticky xl:top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span>🛒</span>
                  <span>Keranjang</span>
                  {cartItems.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </h3>
                
                {cartItems.length > 0 && (
                  <button
                    onClick={() => setCartItems([])}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Kosongkan
                  </button>
                )}
              </div>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500">Keranjang kosong</p>
                  <p className="text-sm text-gray-400">Tambahkan produk atau layanan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{item.type === 'service' ? '🧼' : '🛍️'}</span>
                              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            </div>
                            
                            {item.variation && (
                              <p className="text-xs text-gray-600 mt-1">{item.variation}</p>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">{formatCurrency(item.price)} {item.type === 'service' ? '/kg' : '/pcs'}</p>
                              <p className="text-sm font-medium text-blue-600">{formatCurrency(item.subtotal)}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {/* Quantity/Weight Input */}
                        <div className="mt-2 flex items-center">
                          <span className="text-xs text-gray-600 mr-2">
                            {item.type === 'service' ? 'Berat (kg):' : 'Jumlah:'}
                          </span>
                          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => {
                                const newValue = item.type === 'service'
                                  ? Math.max(0.5, (item.weight || 0) - 0.5)
                                  : Math.max(1, (item.quantity || 0) - 1);
                                updateCartItem(item.id, newValue);
                              }}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              -
                            </button>
                            <input
                              type={item.type === 'service' ? 'number' : 'number'}
                              step={item.type === 'service' ? 0.5 : 1}
                              min={item.type === 'service' ? 0.5 : 1}
                              value={item.type === 'service' ? item.weight : item.quantity}
                              onChange={(e) => updateCartItem(item.id, parseFloat(e.target.value) || 0)}
                              className="w-16 text-center border-x border-gray-300 py-1"
                            />
                            <button
                              onClick={() => {
                                const newValue = item.type === 'service'
                                  ? (item.weight || 0) + 0.5
                                  : (item.quantity || 0) + 1;
                                updateCartItem(item.id, newValue);
                              }}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Promo Code */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎁 Kode Promo
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Masukkan kode promo"
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors whitespace-nowrap"
                      >
                        Terapkan
                      </button>
                    </div>
                    
                    {/* Applied Promos */}
                    {appliedPromos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Promo Diterapkan:</p>
                        {appliedPromos.map((promo) => (
                          <div key={promo.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">🏷️</span>
                              <div>
                                <p className="text-sm font-medium text-green-800">{promo.code}</p>
                                <p className="text-xs text-green-600">
                                  {promo.isPercentage 
                                    ? `Diskon ${promo.discount}%` 
                                    : `Potongan ${formatCurrency(promo.discount)}`}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removePromo(promo.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Cart Summary */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diskon:</span>
                        <span className="font-medium text-green-600">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💳 Informasi Pembayaran</h3>
              
              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="sr-only"
                      />
                      <span className="text-xl">💵</span>
                      <span className="font-medium text-gray-900 text-sm">Tunai</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'qris'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        value="qris"
                        checked={paymentMethod === 'qris'}
                        onChange={() => setPaymentMethod('qris')}
                        className="sr-only"
                      />
                      <span className="text-xl">📱</span>
                      <span className="font-medium text-gray-900 text-sm">QRIS</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'transfer'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="sr-only"
                      />
                      <span className="text-xl">🏦</span>
                      <span className="font-medium text-gray-900 text-sm">Transfer</span>
                    </label>
                  </div>
                </div>
                
                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentStatus === 'paid'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <input
                        type="radio"
                        value="paid"
                        checked={paymentStatus === 'paid'}
                        onChange={() => setPaymentStatus('paid')}
                        className="sr-only"
                      />
                      <span className="text-xl">✅</span>
                      <span className="font-medium text-gray-900 text-sm">Sudah Dibayar</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      paymentStatus === 'unpaid'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}>
                      <input
                        type="radio"
                        value="unpaid"
                        checked={paymentStatus === 'unpaid'}
                        onChange={() => setPaymentStatus('unpaid')}
                        className="sr-only"
                      />
                      <span className="text-xl">⏳</span>
                      <span className="font-medium text-gray-900 text-sm">Belum Dibayar</span>
                    </label>
                  </div>
                </div>
                
                {/* Order Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pesanan
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                  >
                    {isLoadingStatuses ? (
                      <option>Loading...</option>
                    ) : (
                      orderStatuses?.filter(status => status.isActive).map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.icon} {status.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Tambahkan catatan untuk pesanan ini..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
                  />
                </div>
                
                {/* Submit Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => createOrder(true)}
                    disabled={cartItems.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>🧾</span>
                    <span>Buat & Cetak</span>
                  </button>
                  
                  <button
                    onClick={() => createOrder(false)}
                    disabled={cartItems.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>💾</span>
                    <span>Simpan Saja</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}