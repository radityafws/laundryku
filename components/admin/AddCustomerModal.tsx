'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { useDebounce } from '@/hooks/useDebounce';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerFormData {
  name: string;
  phone: string;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm<CustomerFormData>();

  const watchedPhone = watch('phone');
  const debouncedPhone = useDebounce(watchedPhone, 500);

  // Check phone uniqueness when debounced phone changes
  React.useEffect(() => {
    if (debouncedPhone && debouncedPhone.length >= 9) {
      checkPhoneUniqueness(debouncedPhone);
    } else {
      setPhoneError('');
      clearErrors('phone');
    }
  }, [debouncedPhone]);

  const checkPhoneUniqueness = async (phone: string) => {
    setIsCheckingPhone(true);
    setPhoneError('');
    
    try {
      // Simulate API call to check phone uniqueness
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock existing phones for demo
      const existingPhones = ['081234567890', '081234567891', '081234567892'];
      
      if (existingPhones.includes(phone)) {
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
      // Here you would call your API to create the customer
      console.log('Creating customer:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you might want to use a toast library)
      alert('Pelanggan berhasil ditambahkan!');
      
      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Gagal menambahkan pelanggan. Silakan coba lagi.');
    }
  };

  const handleClose = () => {
    reset();
    setPhoneError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">➕ Tambah Pelanggan Baru</h2>
          <p className="text-gray-600">Tambahkan data pelanggan baru ke sistem</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
          
          {debouncedPhone && debouncedPhone.length >= 9 && !isCheckingPhone && !phoneError && !errors.phone && (
            <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
              <span>✅</span>
              <span>Nomor HP tersedia</span>
            </p>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            9-13 digit, akan dicek otomatis untuk duplikasi
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Informasi Penting</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Nama akan digunakan untuk identifikasi pesanan</li>
                <li>• Nomor HP akan digunakan untuk notifikasi WhatsApp</li>
                <li>• Data pelanggan dapat diubah setelah disimpan</li>
              </ul>
            </div>
          </div>
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
            Simpan Pelanggan
          </button>
        </div>
      </form>
    </Modal>
  );
}