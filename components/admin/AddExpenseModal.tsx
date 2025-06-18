'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExpenseFormData {
  date: string;
  category: string;
  customCategory?: string;
  expenseType: string;
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

const expenseTypeOptions = [
  { value: 'monthly', label: 'Bulanan', icon: '📅', description: 'Pengeluaran rutin setiap bulan' },
  { value: 'yearly', label: 'Tahunan', icon: '🗓️', description: 'Pengeluaran rutin setiap tahun' },
  { value: 'one_time', label: 'Satu Kali', icon: '🔄', description: 'Pengeluaran yang hanya terjadi sekali' },
  { value: 'routine', label: 'Rutin', icon: '🔁', description: 'Pengeluaran rutin dengan periode tertentu' },
  { value: 'other', label: 'Lainnya', icon: '📋', description: 'Jenis pengeluaran lainnya' }
];

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<ExpenseFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: '',
      expenseType: '',
      amount: 0,
      description: '',
      notes: ''
    }
  });

  const watchedCategory = watch('category');
  const watchedExpenseType = watch('expenseType');

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
        id: `exp_${Date.now()}`, // Generate temporary ID
        createdAt: new Date().toISOString()
      };

      // Here you would call your API to create the expense
      console.log('Creating expense:', expenseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Pengeluaran berhasil ditambahkan!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form and close modal
      reset();
      setShowCustomCategory(false);
      onClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Gagal menambahkan pengeluaran. Silakan coba lagi.', {
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">➕ Tambah Pengeluaran</h2>
          <p className="text-gray-600">Catat pengeluaran operasional baru</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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

        {/* Expense Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🔄 Jenis Pengeluaran <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expenseTypeOptions.map((type) => (
              <label
                key={type.value}
                className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  watchedExpenseType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <input
                  {...register('expenseType', {
                    required: 'Jenis pengeluaran wajib dipilih'
                  })}
                  type="radio"
                  value={type.value}
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium text-gray-900">{type.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.expenseType && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <span>❌</span>
              <span>{errors.expenseType.message}</span>
            </p>
          )}
        </div>

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

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-purple-500 text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-purple-800 mb-1">Tips Pencatatan</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Catat pengeluaran sesegera mungkin agar tidak lupa</li>
                <li>• Gunakan keterangan yang jelas dan spesifik</li>
                <li>• Pilih jenis pengeluaran sesuai dengan frekuensi kejadian</li>
                <li>• Simpan bukti pembayaran untuk referensi</li>
              </ul>
            </div>
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
                <span>Simpan Pengeluaran</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}