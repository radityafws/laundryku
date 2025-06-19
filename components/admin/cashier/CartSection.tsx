import { useState } from 'react';
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

interface CartSectionProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  appliedPromos: PromoCode[];
  setAppliedPromos: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

export default function CartSection({
  cartItems,
  setCartItems,
  appliedPromos,
  setAppliedPromos
}: CartSectionProps) {
  const [promoCode, setPromoCode] = useState('');
  
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
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
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
                className="px-2 sm:px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors text-xs sm:text-sm whitespace-nowrap"
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
  );
}