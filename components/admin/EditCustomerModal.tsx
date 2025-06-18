'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { useDebounce } from '@/hooks/useDebounce';

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders?: number;
  lastOrderDate?: string;
  totalSpent?: number;
  createdAt: string;
}

interface EditCustomerModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerFormData {
  name: string;
  phone: string;
}

export default function EditCustomerModal({ customer, isOpen, onClose }: EditCustomerModalProps) {
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue
  } = useForm<CustomerFormData>();

  const watchedPhone = watch('phone');
  const debouncedPhone = useDebounce(watchedPhone, 500);

  // Set initial values when customer changes
  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('phone', customer.phone);
    }
  }, [customer, setValue]);

  // Check phone uniqueness when debounced phone changes (but not for the current customer's phone)
  React.useEffect(() => {
    if (debouncedPhone && debouncedPhone.length >= 9 && debouncedPhone !== customer.phone) {
      checkPhoneUniqueness(debouncedPhone);
    } else {
      setPhoneError('');
      clearErrors('phone');
    }
  }, [debouncedPhone, customer.phone]);

  const checkPhoneUniqueness = async (phone: string) => {
    setIsCheckingPhone(true);
    setPhoneError('');
    
    try {
      // Simulate API call to check phone uniqueness
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock existing phones for demo (excluding current customer's phone)
      const existingPhones = ['081234567890', '081234567891', '081234567892'];
      
      if (existingPhones.includes(phone) && phone !== customer.phone) {
        setPhoneError('Nomor HP sudah terdaftar');
        setError('phone', { 
          type: 'manual', 
          message: 'Nomor HP sudah terdaftar' 
        });
      } else {
        setPhoneError('');
        clearErrors('phone');
      }
    } catch (error) {
      console.error('Error checking phone:', error);
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    // Final phone check before submission
    if (phoneError) {
      return;
    }

    try {
      // Here you would call your API to update the customer
      console.log('Updating customer:', { id: customer.id, ...data });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you might want to use a toast library)
      alert('Data pelanggan berhasil diperbarui!');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Gagal memperbarui data pelanggan. Silakan coba lagi.');
    }
  };

  const handleClose = () => {
    reset();
    setPhoneError('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">✏️ Edit Data Pelanggan</h2>
          <p className="text-gray-600">Perbarui informasi pelanggan</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
            <span>📊</span>
            <span>Ringkasan Pelanggan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Total Pesanan:</span>
              <div className="font-semibold text-blue-900 flex items-center space-x-1">
                <span>📦</span>
                <span>{customer.totalOrders || 0}</span>
              </div>
            </div>
            <div>
              <span className="text-blue-600">Total Belanja:</span>
              <div className="font-semibold text-blue-900">
                {customer.totalSpent ? formatCurrency(customer.totalSpent) : '-'}
              </div>
            </div>
            <div>
              <span className="text-blue-600">Terdaftar:</span>
              <div className="font-semibold text-blue-900">
                {formatDate(customer.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', {
                required: 'Nama lengkap wajib diisi',
                minLength: {
                  value: 4,
                  message: 'Nama minimal 4 karakter'
                },
                maxLength: {
                  value: 100,
                  message: 'Nama maksimal 100 karakter'
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Nama hanya boleh berisi huruf dan spasi'
                }
              })}
              type="text"
              placeholder="Masukkan nama lengkap"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.name.message}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimal 4 karakter, hanya huruf dan spasi
            </p>
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Nomor HP <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('phone', {
                  required: 'Nomor HP wajib diisi',
                  minLength: {
                    value: 9,
                    message: 'Nomor HP minimal 9 digit'
                  },
                  maxLength: {
                    value: 13,
                    message: 'Nomor HP maksimal 13 digit'
                  },
                  pattern: {
                    value: /^[0-9+\-\s]+$/,
                    message: 'Format nomor HP tidak valid'
                  }
                })}
                type="tel"
                placeholder="081234567890"
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.phone || phoneError 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              
              {/* Loading indicator */}
              {isCheckingPhone && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {/* Success indicator */}
              {debouncedPhone && debouncedPhone.length >= 9 && !isCheckingPhone && !phoneError && !errors.phone && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-green-500 text-lg">✅</span>
                </div>
              )}
            </div>
            
            {(errors.phone || phoneError) && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.phone?.message || phoneError}</span>
              </p>
            )}
            
            {isCheckingPhone && (
              <p className="mt-2 text-sm text-blue-600 flex items-center space-x-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span>Memeriksa ketersediaan nomor HP...</span>
              </p>
            )}
            
            {debouncedPhone && debouncedPhone.length >= 9 && !isCheckingPhone && !phoneError && !errors.phone && debouncedPhone !== customer.phone && (
              <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                <span>✅</span>
                <span>Nomor HP tersedia</span>
              </p>
            )}
            
            {debouncedPhone === customer.phone && (
              <p className="mt-2 text-sm text-gray-600 flex items-center space-x-1">
                <span>ℹ️</span>
                <span>Nomor HP saat ini (tidak berubah)</span>
              </p>
            )}
            
            <p className="mt-1 text-xs text-gray-500">
              9-13 digit, akan dicek otomatis untuk duplikasi
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCheckingPhone || !!phoneError}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}