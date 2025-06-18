'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromotionFormData {
  title: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  maxUsage?: number;
  status: 'active' | 'scheduled' | 'draft';
}

export default function AddPromotionModal({ isOpen, onClose }: AddPromotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<PromotionFormData>({
    defaultValues: {
      type: 'percentage',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }
  });

  const watchedType = watch('type');

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('code', result);
  };

  const onSubmit = async (data: PromotionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare promotion data
      const promotionData = {
        ...data,
        id: `promo_${Date.now()}`,
        usageCount: 0,
        createdAt: new Date().toISOString()
      };

      console.log('Creating promotion:', promotionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Promosi "${data.title}" berhasil dibuat!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast.error('Gagal membuat promosi. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">➕ Tambah Promosi Baru</h2>
          <p className="text-gray-600">Buat promosi untuk menarik lebih banyak pelanggan</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Judul Promosi <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Judul promosi wajib diisi',
              minLength: { value: 5, message: 'Judul minimal 5 karakter' },
              maxLength: { value: 100, message: 'Judul maksimal 100 karakter' }
            })}
            type="text"
            placeholder="Contoh: Diskon Spesial Akhir Tahun"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
              errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            🏷️ Kode Promosi <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              {...register('code', {
                required: 'Kode promosi wajib diisi',
                minLength: { value: 4, message: 'Kode minimal 4 karakter' },
                maxLength: { value: 20, message: 'Kode maksimal 20 karakter' },
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: 'Kode hanya boleh berisi huruf besar dan angka'
                }
              })}
              type="text"
              placeholder="DISKON2025"
              className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.code ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={generatePromoCode}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors"
            >
              🎲 Generate
            </button>
          </div>
          {errors.code && (
            <p className="mt-2 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description', {
              required: 'Deskripsi wajib diisi',
              minLength: { value: 10, message: 'Deskripsi minimal 10 karakter' },
              maxLength: { value: 500, message: 'Deskripsi maksimal 500 karakter' }
            })}
            rows={3}
            placeholder="Jelaskan detail promosi ini..."
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none ${
              errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              💸 Jenis Diskon <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('type')}
                  type="radio"
                  value="percentage"
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">Persentase (%)</div>
                  <div className="text-sm text-gray-600">Diskon berdasarkan persentase</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('type')}
                  type="radio"
                  value="fixed"
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">Nominal Tetap (Rp)</div>
                  <div className="text-sm text-gray-600">Diskon dengan nominal tetap</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Nilai Diskon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {watchedType === 'fixed' && (
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
              )}
              <input
                {...register('value', {
                  required: 'Nilai diskon wajib diisi',
                  min: { value: 1, message: 'Nilai minimal 1' },
                  max: { 
                    value: watchedType === 'percentage' ? 100 : 1000000, 
                    message: watchedType === 'percentage' ? 'Persentase maksimal 100%' : 'Nominal maksimal Rp 1.000.000'
                  }
                })}
                type="number"
                placeholder={watchedType === 'percentage' ? '10' : '50000'}
                className={`w-full ${watchedType === 'fixed' ? 'pl-12' : 'pl-4'} pr-12 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.value ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {watchedType === 'percentage' && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  %
                </span>
              )}
            </div>
            {errors.value && (
              <p className="mt-2 text-sm text-red-600">{errors.value.message}</p>
            )}
          </div>
        </div>

        {/* Min Order & Max Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minOrder" className="block text-sm font-semibold text-gray-700 mb-2">
              🛒 Minimal Pembelian <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                {...register('minOrder', {
                  required: 'Minimal pembelian wajib diisi',
                  min: { value: 0, message: 'Minimal pembelian tidak boleh negatif' }
                })}
                type="number"
                placeholder="50000"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.minOrder ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.minOrder && (
              <p className="mt-2 text-sm text-red-600">{errors.minOrder.message}</p>
            )}
          </div>

          {watchedType === 'percentage' && (
            <div>
              <label htmlFor="maxDiscount" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Maksimal Diskon (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  {...register('maxDiscount', {
                    min: { value: 1000, message: 'Maksimal diskon minimal Rp 1.000' }
                  })}
                  type="number"
                  placeholder="100000"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    errors.maxDiscount ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.maxDiscount && (
                <p className="mt-2 text-sm text-red-600">{errors.maxDiscount.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Batas maksimal potongan untuk diskon persentase
              </p>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              {...register('startDate', {
                required: 'Tanggal mulai wajib diisi'
              })}
              type="date"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.startDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.startDate && (
              <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Tanggal Berakhir <span className="text-red-500">*</span>
            </label>
            <input
              {...register('endDate', {
                required: 'Tanggal berakhir wajib diisi'
              })}
              type="date"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.endDate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.endDate && (
              <p className="mt-2 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Max Usage & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxUsage" className="block text-sm font-semibold text-gray-700 mb-2">
              🔢 Batas Penggunaan (Opsional)
            </label>
            <input
              {...register('maxUsage', {
                min: { value: 1, message: 'Batas penggunaan minimal 1' }
              })}
              type="number"
              placeholder="100"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.maxUsage ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.maxUsage && (
              <p className="mt-2 text-sm text-red-600">{errors.maxUsage.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Kosongkan untuk penggunaan tidak terbatas
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register('status', {
                required: 'Status wajib dipilih'
              })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.status ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            >
              <option value="active">Aktif</option>
              <option value="scheduled">Terjadwal</option>
              <option value="draft">Draft</option>
            </select>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Simpan Promosi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}