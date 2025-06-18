'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

interface ReportsData {
  summary: any;
  profitLoss: any;
  transactions: any[];
  chartData: any[];
  comparisonData: any;
}

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: ReportsData;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  selectedExpenseTypes?: string[];
}

interface ExportFormData {
  format: 'pdf' | 'excel';
  includeCharts: boolean;
  includeSummary: boolean;
  includeTransactions: boolean;
  includeProfitLoss: boolean;
  fileName: string;
}

export default function ExportReportModal({
  isOpen,
  onClose,
  reportData,
  dateRange,
  selectedExpenseTypes = []
}: ExportReportModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<ExportFormData>({
    defaultValues: {
      format: 'pdf',
      includeCharts: true,
      includeSummary: true,
      includeTransactions: true,
      includeProfitLoss: true,
      fileName: `laporan-keuangan-${new Date().toISOString().split('T')[0]}`
    }
  });

  const watchedFormat = watch('format');

  const onSubmit = async (data: ExportFormData) => {
    setIsExporting(true);
    
    try {
      // Prepare export data
      const exportData = {
        ...data,
        reportData,
        dateRange,
        selectedExpenseTypes,
        exportedAt: new Date().toISOString()
      };

      // Here you would call your API to generate the export
      console.log('Exporting report:', exportData);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success message
      toast.success(`Laporan berhasil diekspor ke ${data.format.toUpperCase()}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // In a real app, you would trigger the download here
      // For demo, we'll just show a success message
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Gagal mengekspor laporan. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) return 'Semua periode';
    
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    if (dateRange.startDate === dateRange.endDate) {
      return formatDate(dateRange.startDate);
    }
    
    return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
  };

  const expenseTypeLabels: { [key: string]: string } = {
    monthly: 'Bulanan',
    yearly: 'Tahunan',
    one_time: 'Satu Kali',
    routine: 'Rutin',
    other: 'Lainnya'
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📤 Export Laporan Keuangan</h2>
          <p className="text-gray-600">Unduh laporan dalam format PDF atau Excel</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Report Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
            <span>📊</span>
            <span>Informasi Laporan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Periode:</span>
              <div className="font-semibold text-blue-900">{formatDateRange()}</div>
            </div>
            <div>
              <span className="text-blue-600">Total Transaksi:</span>
              <div className="font-semibold text-blue-900">{reportData?.transactions?.length || 0}</div>
            </div>
            <div className="md:col-span-2">
              <span className="text-blue-600">Filter Jenis Pengeluaran:</span>
              <div className="font-semibold text-blue-900">
                {selectedExpenseTypes.length > 0 
                  ? selectedExpenseTypes.map(type => expenseTypeLabels[type] || type).join(', ')
                  : 'Semua jenis pengeluaran'
                }
              </div>
            </div>
            <div>
              <span className="text-blue-600">Dibuat:</span>
              <div className="font-semibold text-blue-900">
                {new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📄 Format Export <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              watchedFormat === 'pdf'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}>
              <input
                {...register('format', { required: 'Format export wajib dipilih' })}
                type="radio"
                value="pdf"
                className="w-4 h-4 text-red-600"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">📄</span>
                  <span className="font-semibold text-gray-900">PDF</span>
                </div>
                <p className="text-sm text-gray-600">Laporan lengkap dengan grafik dan visualisasi</p>
              </div>
            </label>

            <label className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              watchedFormat === 'excel'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}>
              <input
                {...register('format', { required: 'Format export wajib dipilih' })}
                type="radio"
                value="excel"
                className="w-4 h-4 text-green-600"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">📊</span>
                  <span className="font-semibold text-gray-900">Excel</span>
                </div>
                <p className="text-sm text-gray-600">Data dalam format spreadsheet untuk analisis</p>
              </div>
            </label>
          </div>
          {errors.format && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <span>❌</span>
              <span>{errors.format.message}</span>
            </p>
          )}
        </div>

        {/* Content Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📋 Konten yang Disertakan
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                {...register('includeSummary')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📈</span>
                  <span className="font-medium text-gray-900">Ringkasan Statistik</span>
                </div>
                <p className="text-sm text-gray-600">Total pendapatan, pengeluaran, dan profit</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                {...register('includeProfitLoss')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💸</span>
                  <span className="font-medium text-gray-900">Analisis Laba Rugi</span>
                </div>
                <p className="text-sm text-gray-600">Breakdown pendapatan dan pengeluaran detail</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                {...register('includeTransactions')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📋</span>
                  <span className="font-medium text-gray-900">Detail Transaksi</span>
                </div>
                <p className="text-sm text-gray-600">Daftar lengkap semua transaksi dalam periode</p>
              </div>
            </label>

            {watchedFormat === 'pdf' && (
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  {...register('includeCharts')}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📊</span>
                    <span className="font-medium text-gray-900">Grafik dan Visualisasi</span>
                  </div>
                  <p className="text-sm text-gray-600">Chart tren dan perbandingan (khusus PDF)</p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* File Name */}
        <div>
          <label htmlFor="fileName" className="block text-sm font-semibold text-gray-700 mb-2">
            📁 Nama File <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('fileName', {
                required: 'Nama file wajib diisi',
                minLength: {
                  value: 3,
                  message: 'Nama file minimal 3 karakter'
                },
                maxLength: {
                  value: 100,
                  message: 'Nama file maksimal 100 karakter'
                },
                pattern: {
                  value: /^[a-zA-Z0-9\-_\s]+$/,
                  message: 'Nama file hanya boleh berisi huruf, angka, spasi, tanda hubung, dan underscore'
                }
              })}
              type="text"
              placeholder="laporan-keuangan-2025-01"
              className={`w-full px-4 py-3 pr-20 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.fileName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              .{watchedFormat}
            </span>
          </div>
          {errors.fileName && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <span>❌</span>
              <span>{errors.fileName.message}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            File akan disimpan dengan ekstensi .{watchedFormat}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-500 text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Tips Export</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• PDF cocok untuk presentasi dan laporan formal</li>
                <li>• Excel cocok untuk analisis data lebih lanjut</li>
                <li>• Proses export mungkin membutuhkan beberapa saat</li>
                <li>• File akan otomatis terunduh setelah selesai</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isExporting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Mengekspor...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Export Laporan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}