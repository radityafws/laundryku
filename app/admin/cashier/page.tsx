'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import CustomerSection from '@/components/admin/cashier/CustomerSection';
import ProductCatalog from '@/components/admin/cashier/ProductCatalog';
import CartSection from '@/components/admin/cashier/CartSection';
import PaymentSection from '@/components/admin/cashier/PaymentSection';
import { useOrderStatuses } from '@/hooks/useOrderStatus';
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
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromos, setAppliedPromos] = useState<PromoCode[]>([]);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'transfer'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [orderStatus, setOrderStatus] = useState('1'); // Default to first status
  const [notes, setNotes] = useState('');
  
  // Fetch order statuses
  const { data: orderStatuses } = useOrderStatuses();
  
  // Set default order status when statuses are loaded
  useEffect(() => {
    if (orderStatuses && orderStatuses.length > 0) {
      setOrderStatus(orderStatuses[0].id);
    }
  }, [orderStatuses]);
  
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
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    const discountAmount = appliedPromos.reduce((sum, promo) => {
      if (promo.isPercentage) {
        return sum + (subtotal * promo.discount / 100);
      } else {
        return sum + promo.discount;
      }
    }, 0);
    
    const total = Math.max(0, subtotal - discountAmount);
    
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

  // Calculate cart totals for mobile display
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  const discountAmount = appliedPromos.reduce((sum, promo) => {
    if (promo.isPercentage) {
      return sum + (subtotal * promo.discount / 100);
    } else {
      return sum + promo.discount;
    }
  }, 0);
  
  const total = Math.max(0, subtotal - discountAmount);

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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="xl:col-span-8 space-y-6">
            {/* Customer Selection */}
            <CustomerSection 
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              isQuickPurchase={isQuickPurchase}
              setIsQuickPurchase={setIsQuickPurchase}
            />
            
            {/* Product Catalog */}
            <ProductCatalog addToCart={addToCart} />
          </div>
          
          {/* Right Column - Cart & Payment */}
          <div className="xl:col-span-4 space-y-6">
            {/* Cart */}
            <CartSection 
              cartItems={cartItems}
              setCartItems={setCartItems}
              appliedPromos={appliedPromos}
              setAppliedPromos={setAppliedPromos}
            />
            
            {/* Payment Information */}
            <PaymentSection 
              cartItems={cartItems}
              appliedPromos={appliedPromos}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              orderStatus={orderStatus}
              setOrderStatus={setOrderStatus}
              notes={notes}
              setNotes={setNotes}
              createOrder={createOrder}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}