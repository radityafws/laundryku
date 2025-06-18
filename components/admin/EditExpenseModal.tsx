'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
}

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
}

interface ExpenseFormData {
  date: string;
  category: string;
  customCategory?: string;
  amount: number;
  description: string;
  notes?: string;
}

const categoryOptions = [
  { value: 'electricity', label: 'Listrik', icon: '⚡' },
  { value: 'water', label: 'Air', icon: '💧' },
  { value: 'detergent', label: 'Detergen', icon: '🧴' },
  { value: 'salary', label: 'Gaji', icon: '💰' },
  { value: 'rent', label: 'Sewa', icon: '🏠' },
  { value: 'maintenance', label: 'Perawatan', icon: '🔧' },
  { value: 'other', label: 'Lainnya', icon: '📝' }
];

export default function EditExpenseModal({ expense, isOpen, onClose }: EditExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<ExpenseFormData>();

  const watchedCategory = watch('category');

  // Set initial values when expense changes
  useEffect(() => {
    if (expense) {
      const isCustomCategory = !categoryOptions.find(cat => cat.value === expense.category);
      
      setValue('date', expense.date);
      setValue('category', isCustomCategory ? 'other' : expense.category);
      setValue('customCategory', isCustomCategory ? expense.category : '');
      setValue('amount', expense.amount);
      setValue('description', expense.description);
      setValue('notes', expense.notes || '');
      
      setShowCustomCategory(isCustomCategory);
    }
  }, [expense, setValue]);

  // Show custom category input when "other" is selected
  React.useEffect(() => {
    setShowCustomCategory(watchedCategory === 'other');
    if (watchedCategory !== 'other') {
      setValue('customCategory', '');
    }
  }, [watchedCategory, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare expense data
      const expenseData = {
        ...data,
        category: data.category === 'other' ? data.customCategory : data.category,
        id: expense.id,
        updatedAt: new Date().toISOString()
      };

      // Here you would call your API to update the expense
      console.log('Updating expense:', expenseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Pengeluaran berhasil diperbarui!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Gagal memperbarui pengeluaran. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowCustomCategory(false);
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Format as currency
    if (numericValue) {
      const number = parseInt(numericValue);
      return new Intl.NumberFormat('id-ID').format(number);
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setValue('amount', parseInt(value) || 0);
  };

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrencyDisplay = (amount: number) => {
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
          <h2 className="text-2xl font-bold text-gray-900">✏️ Edit Pengeluaran</h2>
          <p className="text-gray-600">Perbarui data pengeluaran</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Expense Info Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
            <span>📊</span>
            <span>Data Pengeluaran Saat Ini</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-purple-600">Tanggal:</span>
              <div className="font-semibold text-purple-900">
                {formatDateForDisplay(expense.date)}
              </div>
            </div>
            <div>
              <span className="text-purple-600">Kategori:</span>
              <div className="font-semibold text-purple-900">
                {categoryOptions.find(cat => cat.value === expense.category)?.label || expense.category}
              </div>
            </div>
            <div>
              <span className="text-purple-600">Nominal:</span>
              <div className="font-semibold text-purple-900">
                {formatCurrencyDisplay(expense.amount)}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Tanggal Pengeluaran <span className="text-red-500">*</span>
            </label>
            <input
              {...register('date', {
                required: 'Tanggal pengeluaran wajib diisi'
              })}
              type="date"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none ${
                errors.date ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
              }`}
            />
            {errors.date && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.date.message}</span>
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏷️ Kategori Pengeluaran <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryOptions.map((category) => (
                <label
                  key={category.value}
                  className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    watchedCategory === category.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    {...register('category', {
                      required: 'Kategori pengeluaran wajib dipilih'
                    })}
                    type="radio"
                    value={category.value}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900 text-sm">{category.label}</span>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.category.message}</span>
              </p>
            )}
          </div>

          {/* Custom Category */}
          {showCustomCategory && (
            <div>
              <label htmlFor="customCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Kategori Kustom <span className="text-red-500">*</span>
              </label>
              <input
                {...register('customCategory', {
                  required: showCustomCategory ? 'Kategori kustom wajib diisi' : false,
                  minLength: {
                    value: 3,
                    message: 'Kategori minimal 3 karakter'
                  }
                })}
                type="text"
                placeholder="Masukkan kategori pengeluaran..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none ${
                  errors.customCategory ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
              />
              {errors.customCategory && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.customCategory.message}</span>
                </p>
              )}
            </div>
          )}

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Nominal Pengeluaran <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                {...register('amount', {
                  required: 'Nominal pengeluaran wajib diisi',
                  min: {
                    value: 1000,
                    message: 'Nominal minimal Rp 1.000'
                  },
                  max: {
                    value: 100000000,
                    message: 'Nominal maksimal Rp 100.000.000'
                  }
                })}
                type="text"
                placeholder="0"
                onChange={handleAmountChange}
                value={watch('amount') ? formatCurrency(watch('amount').toString()) : ''}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none ${
                  errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.amount.message}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Masukkan nominal dalam Rupiah (minimal Rp 1.000)
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Keterangan <span className="text-red-500">*</span>
            </label>
            <input
              {...register('description', {
                required: 'Keterangan pengeluaran wajib diisi',
                minLength: {
                  value: 5,
                  message: 'Keterangan minimal 5 karakter'
                },
                maxLength: {
                  value: 200,
                  message: 'Keterangan maksimal 200 karakter'
                }
              })}
              type="text"
              placeholder="Contoh: Pembelian detergen untuk bulan ini..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none ${
                errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
              }`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.description.message}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Jelaskan secara singkat untuk apa pengeluaran ini
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              📄 Catatan Tambahan (Opsional)
            </label>
            <textarea
              {...register('notes', {
                maxLength: {
                  value: 500,
                  message: 'Catatan maksimal 500 karakter'
                }
              })}
              rows={3}
              placeholder="Catatan atau detail tambahan..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 transition-all duration-300 outline-none resize-none ${
                errors.notes ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
              }`}
            />
            {errors.notes && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.notes.message}</span>
              </p>
            )}
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}