'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderFormData {
  customerName: string;
  customerPhone: string;
  weight: number;
  service: 'regular' | 'express';
  notes: string;
  paymentMethod: 'cash' | 'qris';
  total: number;
}

const serviceOptions = [
  {
    value: 'regular',
    label: 'Reguler (3 hari)',
    price: 3000,
    icon: '🕐',
    description: 'Layanan standar dengan kualitas terbaik'
  },
  {
    value: 'express',
    label: 'Express (1 hari)',
    price: 5000,
    icon: '⚡',
    description: 'Layanan cepat untuk kebutuhan mendesak'
  }
];

const paymentMethods = [
  {
    value: 'cash',
    label: 'Tunai',
    icon: '💵',
    description: 'Pembayaran dengan uang tunai'
  },
  {
    value: 'qris',
    label: 'QRIS',
    icon: '📱',
    description: 'Pembayaran digital via QRIS'
  }
];

// Mock customers data
const mockCustomers = [
  { name: 'Ahmad Santoso', phone: '081234567890' },
  { name: 'Siti Nurhaliza', phone: '081234567891' },
  { name: 'Budi Prasetyo', phone: '081234567892' },
  { name: 'Dewi Sartika', phone: '081234567893' },
  { name: 'Eko Wijaya', phone: '081234567894' }
];

export default function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<OrderFormData>({
    defaultValues: {
      service: 'regular',
      paymentMethod: 'cash',
      total: 0
    }
  });

  const watchedWeight = watch('weight');
  const watchedService = watch('service');

  // Calculate total automatically
  const calculateTotal = () => {
    if (watchedWeight && watchedService) {
      const servicePrice = serviceOptions.find(s => s.value === watchedService)?.price || 0;
      const total = watchedWeight * servicePrice;
      setValue('total', total);
    }
  };

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch)
  );

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setValue('customerName', customer.name);
    setValue('customerPhone', customer.phone);
    setShowCustomerDropdown(false);
    setIsNewCustomer(false);
  };

  const handleCustomerSearchChange = (value: string) => {
    setCustomerSearch(value);
    setValue('customerName', value);
    setShowCustomerDropdown(true);
    
    // Check if it's a new customer
    const existingCustomer = mockCustomers.find(c => 
      c.name.toLowerCase() === value.toLowerCase()
    );
    setIsNewCustomer(!existingCustomer && value.length > 0);
    setSelectedCustomer(existingCustomer || null);
  };

  const onSubmit = (data: OrderFormData) => {
    // Generate invoice number
    const invoice = `INV${Date.now()}`;
    
    // Calculate dates
    const dateIn = new Date().toISOString().split('T')[0];
    const estimatedDone = new Date();
    estimatedDone.setDate(estimatedDone.getDate() + (data.service === 'express' ? 1 : 3));
    
    const orderData = {
      ...data,
      invoice,
      dateIn,
      estimatedDone: estimatedDone.toISOString().split('T')[0],
      status: 'in-progress'
    };

    console.log('New order:', orderData);
    
    // Here you would typically send the data to your API
    // await createOrder(orderData);
    
    // Reset form and close modal
    reset();
    setSelectedCustomer(null);
    setCustomerSearch('');
    setIsNewCustomer(false);
    onClose();
  };

  // Auto-calculate total when weight or service changes
  React.useEffect(() => {
    calculateTotal();
  }, [watchedWeight, watchedService]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">➕ Tambah Pesanan Baru</h2>
            <p className="text-gray-600">Buat pesanan laundry baru</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👤 Pelanggan
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => handleCustomerSearchChange(e.target.value)}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Cari nama pelanggan atau ketik nama baru..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
              />
              
              {/* Customer Dropdown */}
              {showCustomerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCustomerSelect(customer)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </button>
                    ))
                  ) : customerSearch.length > 0 ? (
                    <div className="px-4 py-3 text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>➕</span>
                        <span>Tambah "{customerSearch}" sebagai pelanggan baru</span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      Ketik untuk mencari atau menambah pelanggan baru
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {isNewCustomer && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <span>ℹ️</span>
                  <span className="text-sm">Pelanggan baru akan ditambahkan ke database</span>
                </div>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Nomor HP
            </label>
            <input
              {...register('customerPhone', {
                required: 'Nomor HP wajib diisi',
                pattern: {
                  value: /^[0-9+\-\s]+$/,
                  message: 'Format nomor HP tidak valid'
                }
              })}
              type="tel"
              placeholder="081234567890"
              disabled={selectedCustomer && !isNewCustomer}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                selectedCustomer && !isNewCustomer
                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                  : 'border-gray-200 focus:border-blue-500'
              } ${errors.customerPhone ? 'border-red-300' : ''}`}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.customerPhone.message}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
              ⚖️ Berat Cucian (kg)
            </label>
            <input
              {...register('weight', {
                required: 'Berat cucian wajib diisi',
                min: { value: 0.1, message: 'Berat minimal 0.1 kg' },
                max: { value: 100, message: 'Berat maksimal 100 kg' }
              })}
              type="number"
              step="0.1"
              placeholder="3.5"
              className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.weight ? 'border-red-300' : ''
              }`}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🚀 Jenis Layanan
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceOptions.map((service) => (
                <label
                  key={service.value}
                  className={`flex items-start space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    watchedService === service.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    {...register('service')}
                    type="radio"
                    value={service.value}
                    className="mt-1 w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{service.icon}</span>
                      <span className="font-semibold text-gray-900">{service.label}</span>
                      <span className="text-lg font-bold text-blue-600">
                        Rp {service.price.toLocaleString()}/kg
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Catatan (Opsional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Catatan khusus untuk pesanan ini..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              💳 Metode Pembayaran
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    watch('paymentMethod') === method.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value={method.value}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-semibold text-gray-900">{method.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          <div>
            <label htmlFor="total" className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Total Tagihan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
              <input
                {...register('total', {
                  required: 'Total tagihan wajib diisi',
                  min: { value: 1000, message: 'Total minimal Rp 1.000' }
                })}
                type="number"
                placeholder="0"
                className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.total ? 'border-red-300' : ''
                }`}
              />
            </div>
            {errors.total && (
              <p className="mt-1 text-sm text-red-600">{errors.total.message}</p>
            )}
            {watchedWeight && watchedService && (
              <p className="mt-2 text-sm text-gray-600">
                Kalkulasi otomatis: {watchedWeight} kg × Rp {serviceOptions.find(s => s.value === watchedService)?.price.toLocaleString()}/kg = Rp {(watchedWeight * (serviceOptions.find(s => s.value === watchedService)?.price || 0)).toLocaleString()}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}