'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Select from '@/components/ui/Select';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { usePromotions } from '@/hooks/usePromotions';
import { useOrderStatuses } from '@/hooks/useOrderStatus';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

interface Customer {
  value: string;
  label: string;
  phone: string;
}

interface CartItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  sku: string;
  price: number;
  quantity: number;
  weight?: number;
  variation?: string;
  variationId?: string;
  subtotal: number;
}

interface CashierFormData {
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  promoCode: string;
  paymentMethod: 'cash' | 'qris' | 'transfer';
  paymentStatus: 'paid' | 'unpaid';
  orderStatus: string;
  notes: string;
}

export default function CashierPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [isQuickPurchase, setIsQuickPurchase] = useState(false);
  const [productFilter, setProductFilter] = useState<'all' | 'product' | 'service'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [appliedPromos, setAppliedPromos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState<any>(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Fetch data
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: promotionsData, isLoading: isLoadingPromotions } = usePromotions();
  const { data: orderStatusesData, isLoading: isLoadingOrderStatuses } = useOrderStatuses();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CashierFormData>({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      items: [],
      promoCode: '',
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      orderStatus: '1', // Default to first status
      notes: ''
    }
  });

  // Set default order status when data is loaded
  useEffect(() => {
    if (orderStatusesData && orderStatusesData.length > 0) {
      const defaultStatus = orderStatusesData.find(s => s.order === 1)?.id || orderStatusesData[0].id;
      setValue('orderStatus', defaultStatus);
    }
  }, [orderStatusesData, setValue]);

  // Transform customers data for Select component
  const customers: Customer[] = customersData?.map(customer => ({
    value: customer.id,
    label: customer.name,
    phone: customer.phone
  })) || [];

  // Filter products based on search and type filter
  const filteredProducts = productsData?.filter(product => {
    const matchesSearch = 
      !debouncedSearchTerm || 
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    const matchesType = 
      productFilter === 'all' || 
      product.type === productFilter;
    
    return matchesSearch && matchesType;
  }) || [];

  // Handle customer search
  const handleCustomerSearch = async (searchTerm: string) => {
    if (!searchTerm) return;
    
    setIsSearchingCustomers(true);
    
    // In a real app, this would call an API endpoint
    // For now, we're just simulating a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsSearchingCustomers(false);
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setValue('customerName', customer.label);
      setValue('customerPhone', customer.phone);
    } else {
      setValue('customerName', '');
      setValue('customerPhone', '');
    }
  };

  // Handle creating new customer
  const handleCreateCustomer = (name: string) => {
    const newCustomer: Customer = {
      value: `new_${Date.now()}`,
      label: name,
      phone: ''
    };
    
    setSelectedCustomer(newCustomer);
    setValue('customerName', name);
    setValue('customerPhone', '');
  };

  // Add product to cart
  const handleAddToCart = (product: any, variation?: any) => {
    // For products with variations that haven't been selected yet
    if (product.hasVariations && !variation) {
      setSelectedProduct(product);
      setShowVariationModal(true);
      return;
    }

    const newItem: CartItem = {
      id: variation ? `${product.id}_${variation.id}` : product.id,
      type: product.type,
      name: product.name,
      sku: variation ? variation.sku : product.sku,
      price: variation ? variation.price : product.price,
      quantity: 1,
      weight: product.type === 'service' ? 1 : undefined,
      variation: variation ? variation.name : undefined,
      variationId: variation?.id,
      subtotal: variation ? variation.price : product.price
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === newItem.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedCart = [...cart];
      const existingItem = updatedCart[existingItemIndex];
      
      if (existingItem.type === 'product') {
        existingItem.quantity += 1;
      } else {
        existingItem.weight = (existingItem.weight || 0) + 1;
      }
      
      existingItem.subtotal = existingItem.price * (existingItem.type === 'product' ? existingItem.quantity : (existingItem.weight || 0));
      
      setCart(updatedCart);
    } else {
      // Add new item
      setCart([...cart, newItem]);
    }

    // Close variation modal if open
    if (showVariationModal) {
      setShowVariationModal(false);
      setSelectedProduct(null);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Update item quantity/weight
  const handleUpdateQuantity = (itemId: string, value: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
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
    
    setCart(updatedCart);
  };

  // Apply promo code
  const handleApplyPromo = () => {
    const promoCode = watch('promoCode');
    
    if (!promoCode) {
      toast.error('Masukkan kode promo terlebih dahulu');
      return;
    }
    
    // Check if promo already applied
    if (appliedPromos.some(promo => promo.code === promoCode)) {
      toast.error('Promo sudah digunakan');
      return;
    }
    
    // Find promo in available promotions
    const promo = promotionsData?.find(p => 
      p.code.toLowerCase() === promoCode.toLowerCase() && 
      p.status === 'active'
    );
    
    if (!promo) {
      toast.error('Kode promo tidak valid atau sudah berakhir');
      return;
    }
    
    // Check minimum order
    const subtotal = calculateSubtotal();
    if (subtotal < promo.minOrder) {
      toast.error(`Minimal pembelian untuk promo ini adalah ${formatCurrency(promo.minOrder)}`);
      return;
    }
    
    // Add promo to applied promos
    setAppliedPromos([...appliedPromos, promo]);
    setValue('promoCode', '');
    
    toast.success(`Promo ${promo.code} berhasil diterapkan!`);
  };

  // Remove applied promo
  const handleRemovePromo = (promoId: string) => {
    setAppliedPromos(appliedPromos.filter(promo => promo.id !== promoId));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Calculate discount
  const calculateDiscount = () => {
    let totalDiscount = 0;
    
    appliedPromos.forEach(promo => {
      if (promo.type === 'percentage') {
        const discountAmount = calculateSubtotal() * (promo.value / 100);
        const cappedDiscount = promo.maxDiscount ? Math.min(discountAmount, promo.maxDiscount) : discountAmount;
        totalDiscount += cappedDiscount;
      } else {
        totalDiscount += promo.value;
      }
    });
    
    return totalDiscount;
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle form submission
  const onSubmit = async (data: CashierFormData) => {
    if (cart.length === 0) {
      toast.error('Keranjang belanja kosong. Tambahkan item terlebih dahulu.');
      return;
    }
    
    if (!isQuickPurchase && (!data.customerName || !data.customerPhone)) {
      toast.error('Data pelanggan wajib diisi atau pilih "Pembelian Cepat"');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        ...data,
        items: cart,
        promos: appliedPromos,
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        grandTotal: calculateGrandTotal(),
        orderDate: new Date().toISOString(),
        invoice: `INV${Date.now()}`,
        isQuickPurchase
      };
      
      console.log('Creating order:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store order data for receipt
      setNewOrderData(orderData);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form for next order
      reset();
      setCart([]);
      setAppliedPromos([]);
      setSelectedCustomer(null);
      setIsQuickPurchase(false);
      
      toast.success('Pesanan berhasil dibuat!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Kasir" subtitle="Buat pesanan baru dan kelola transaksi">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>💰</span>
                <span>Kasir</span>
              </h2>
              <p className="text-gray-600">Buat pesanan baru dan kelola transaksi</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/admin/orders'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Lihat Daftar Pesanan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>👤</span>
                <span>Informasi Pelanggan</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="quick-purchase"
                    checked={isQuickPurchase}
                    onChange={(e) => setIsQuickPurchase(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="quick-purchase" className="text-sm font-medium text-gray-700">
                    Pembelian Cepat (Tanpa Data Pelanggan)
                  </label>
                </div>

                {!isQuickPurchase && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pelanggan
                      </label>
                      <Select
                        options={customers}
                        value={selectedCustomer}
                        onChange={handleCustomerSelect}
                        onCreateOption={handleCreateCustomer}
                        onInputChange={handleCustomerSearch}
                        placeholder="Cari nama pelanggan atau ketik nama baru..."
                        isSearchable={true}
                        isCreatable={true}
                        isLoading={isSearchingCustomers || isLoadingCustomers}
                      />
                    </div>

                    <div>
                      <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor HP
                      </label>
                      <input
                        {...register('customerPhone', {
                          required: !isQuickPurchase ? 'Nomor HP wajib diisi' : false,
                          pattern: {
                            value: /^[0-9+\-\s]+$/,
                            message: 'Format nomor HP tidak valid'
                          }
                        })}
                        type="tel"
                        placeholder="081234567890"
                        disabled={selectedCustomer?.phone ? true : false}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                          selectedCustomer?.phone
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                            : 'border-gray-200 focus:border-blue-500'
                        } ${errors.customerPhone ? 'border-red-300' : ''}`}
                      />
                      {errors.customerPhone && (
                        <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Catalog */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <span>🛍️</span>
                    <span>Katalog Produk & Layanan</span>
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setProductFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      productFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setProductFilter('service')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      productFilter === 'service'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Layanan
                  </button>
                  <button
                    onClick={() => setProductFilter('product')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      productFilter === 'product'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Produk
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari produk atau layanan..."
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

              {/* Products Grid */}
              {isLoadingProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-32 rounded-xl mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div 
                        className={`p-4 cursor-pointer ${
                          product.hasVariations ? 'bg-blue-50' : 'bg-gray-50'
                        }`}
                        onClick={() => handleAddToCart(product)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">
                            {product.type === 'service' ? '🧼' : '🛍️'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.type === 'service' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {product.type === 'service' ? 'Layanan' : 'Produk'}
                          </span>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {product.name}
                        </h4>
                        
                        {product.hasVariations ? (
                          <div className="text-sm text-blue-600 font-medium">
                            {formatCurrency(Math.min(...product.variations.map(v => v.price)))} - {formatCurrency(Math.max(...product.variations.map(v => v.price)))}
                          </div>
                        ) : (
                          <div className="text-sm text-blue-600 font-medium">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                        
                        {product.type === 'product' && !product.hasVariations && (
                          <div className={`text-xs mt-1 ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                          </div>
                        )}
                        
                        {product.hasVariations && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.variations.length} variasi tersedia
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Add Button */}
                      {!product.hasVariations && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.type === 'product' && product.stock === 0}
                          className={`w-full py-2 text-sm font-medium ${
                            product.type === 'product' && product.stock === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          + Tambah ke Keranjang
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Produk Tidak Ditemukan
                  </h4>
                  <p className="text-gray-600">
                    Coba kata kunci lain atau reset filter
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Cart & Payment */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>🛒</span>
                <span>Keranjang</span>
              </h3>

              {cart.length > 0 ? (
                <div className="space-y-4">
                  {/* Cart Items */}
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          {item.variation && (
                            <p className="text-xs text-gray-600">{item.variation}</p>
                          )}
                          <p className="text-xs text-gray-500">{item.sku}</p>
                          <p className="text-sm text-blue-600 font-medium">{formatCurrency(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0.1"
                              step={item.type === 'service' ? '0.1' : '1'}
                              value={item.type === 'service' ? item.weight : item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseFloat(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center"
                            />
                            <span className="ml-1 text-xs text-gray-500">
                              {item.type === 'service' ? 'kg' : 'pcs'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    
                    {/* Applied Promos */}
                    {appliedPromos.length > 0 && (
                      <div className="space-y-2 mb-2">
                        {appliedPromos.map((promo) => (
                          <div key={promo.id} className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <span className="text-green-600">Diskon ({promo.code}):</span>
                              <button
                                onClick={() => handleRemovePromo(promo.id)}
                                className="ml-2 text-red-500 hover:text-red-700 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                            <span className="font-medium text-green-600">
                              -{formatCurrency(
                                promo.type === 'percentage'
                                  ? Math.min(calculateSubtotal() * (promo.value / 100), promo.maxDiscount || Infinity)
                                  : promo.value
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateGrandTotal())}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-600">Keranjang kosong</p>
                  <p className="text-sm text-gray-500 mt-1">Tambahkan produk atau layanan</p>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>🎁</span>
                <span>Kode Promo</span>
              </h3>

              <div className="flex space-x-2">
                <input
                  {...register('promoCode')}
                  type="text"
                  placeholder="Masukkan kode promo"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  Terapkan
                </button>
              </div>

              {/* Active Promos */}
              {appliedPromos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Promo Aktif:</h4>
                  {appliedPromos.map((promo) => (
                    <div key={promo.id} className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200">
                      <div>
                        <p className="text-sm font-medium text-green-700">{promo.code}</p>
                        <p className="text-xs text-green-600">
                          {promo.type === 'percentage' 
                            ? `${promo.value}% off` 
                            : formatCurrency(promo.value)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemovePromo(promo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>💳</span>
                <span>Informasi Pembayaran</span>
              </h3>

              <div className="space-y-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      watch('paymentMethod') === 'cash'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="cash"
                        className="sr-only"
                      />
                      <span>💵</span>
                      <span className="font-medium">Tunai</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      watch('paymentMethod') === 'qris'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="qris"
                        className="sr-only"
                      />
                      <span>📱</span>
                      <span className="font-medium">QRIS</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      watch('paymentMethod') === 'transfer'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="transfer"
                        className="sr-only"
                      />
                      <span>🏦</span>
                      <span className="font-medium">Transfer</span>
                    </label>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pembayaran
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      watch('paymentStatus') === 'paid'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <input
                        {...register('paymentStatus')}
                        type="radio"
                        value="paid"
                        className="sr-only"
                      />
                      <span>✅</span>
                      <span className="font-medium">Sudah Dibayar</span>
                    </label>
                    
                    <label className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      watch('paymentStatus') === 'unpaid'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}>
                      <input
                        {...register('paymentStatus')}
                        type="radio"
                        value="unpaid"
                        className="sr-only"
                      />
                      <span>⏳</span>
                      <span className="font-medium">Belum Dibayar</span>
                    </label>
                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pesanan
                  </label>
                  <select
                    {...register('orderStatus', { required: 'Status pesanan wajib dipilih' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                  >
                    {isLoadingOrderStatuses ? (
                      <option value="">Loading...</option>
                    ) : (
                      orderStatusesData?.filter(status => status.isActive).map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.icon} {status.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.orderStatus && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderStatus.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Catatan tambahan untuk pesanan ini..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Buat Pesanan & Cetak</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setCart([]);
                    setAppliedPromos([]);
                    reset();
                    setSelectedCustomer(null);
                    setIsQuickPurchase(false);
                  }}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Batal & Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variation Selection Modal */}
      {showVariationModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Pilih Variasi</h3>
              <p className="text-gray-600">{selectedProduct.name}</p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {selectedProduct.variations.map((variation: any) => (
                  <button
                    key={variation.id}
                    onClick={() => handleAddToCart(selectedProduct, variation)}
                    disabled={selectedProduct.type === 'product' && variation.stock === 0}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-colors ${
                      selectedProduct.type === 'product' && variation.stock === 0
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{variation.name}</h4>
                        <p className="text-sm text-gray-500">{variation.sku}</p>
                      </div>
                      <div className="text-blue-600 font-medium">
                        {formatCurrency(variation.price)}
                      </div>
                    </div>
                    
                    {selectedProduct.type === 'product' && (
                      <div className={`text-sm mt-1 ${
                        variation.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variation.stock > 0 ? `Stok: ${variation.stock}` : 'Stok Habis'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowVariationModal(false);
                  setSelectedProduct(null);
                }}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with Receipt */}
      {showSuccessModal && newOrderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-200 bg-green-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pesanan Berhasil Dibuat</h3>
                  <p className="text-gray-600">Invoice: {newOrderData.invoice}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Customer Info */}
                {!newOrderData.isQuickPurchase && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informasi Pelanggan</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm"><span className="text-gray-600">Nama:</span> {newOrderData.customerName}</p>
                      <p className="text-sm"><span className="text-gray-600">No. HP:</span> {newOrderData.customerPhone}</p>
                    </div>
                  </div>
                )}
                
                {/* Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Daftar Item</h4>
                  <div className="space-y-2">
                    {newOrderData.items.map((item: any) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.variation && (
                              <p className="text-xs text-gray-600">{item.variation}</p>
                            )}
                          </div>
                          <p className="text-sm font-medium">{formatCurrency(item.subtotal)}</p>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <p>{item.sku}</p>
                          <p>
                            {formatCurrency(item.price)} × {item.type === 'service' ? `${item.weight} kg` : `${item.quantity} pcs`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Payment Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informasi Pembayaran</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatCurrency(newOrderData.subtotal)}</span>
                    </div>
                    
                    {newOrderData.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diskon:</span>
                        <span className="text-green-600">-{formatCurrency(newOrderData.discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(newOrderData.grandTotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Metode Pembayaran:</span>
                      <span>{
                        newOrderData.paymentMethod === 'cash' ? 'Tunai' :
                        newOrderData.paymentMethod === 'qris' ? 'QRIS' : 'Transfer'
                      }</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status Pembayaran:</span>
                      <span className={newOrderData.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                        {newOrderData.paymentStatus === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    // In a real app, this would trigger printing
                    console.log('Printing receipt for:', newOrderData.invoice);
                    toast.success('Struk berhasil dicetak!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🖨️</span>
                  <span>Cetak Struk</span>
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}