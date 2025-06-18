'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from 'react-toastify';

interface Promotion {
  id: string;
  title: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  endDate: string;
}

interface WhatsAppBroadcastModalProps {
  promotion: Promotion;
  isOpen: boolean;
  onClose: () => void;
}

interface BroadcastFormData {
  targetType: 'all' | 'inactive';
  inactiveDays: number;
  messageTemplate: string;
  selectedCustomers: string[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastOrderDate?: string;
}

export default function WhatsAppBroadcastModal({ promotion, isOpen, onClose }: WhatsAppBroadcastModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetCustomers, setTargetCustomers] = useState<Customer[]>([]);
  const [broadcastResult, setBroadcastResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: allCustomers } = useCustomers();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<BroadcastFormData>({
    defaultValues: {
      targetType: 'all',
      inactiveDays: 30,
      messageTemplate: `Halo {{nama}}, ada promo spesial buat kamu!

Gunakan kode *{{kode_promo}}* untuk dapat potongan {{nilai_promo}}. Berlaku sampai {{tanggal_akhir}}.

Jangan sampai terlewat ya! 🎉`,
      selectedCustomers: []
    }
  });

  const watchedTargetType = watch('targetType');
  const watchedInactiveDays = watch('inactiveDays');
  const watchedMessageTemplate = watch('messageTemplate');

  // Filter customers based on target type
  useEffect(() => {
    if (!allCustomers) return;

    let filtered: Customer[] = [];

    if (watchedTargetType === 'all') {
      filtered = allCustomers;
    } else if (watchedTargetType === 'inactive') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - watchedInactiveDays);
      
      filtered = allCustomers.filter(customer => {
        if (!customer.lastOrderDate) return true; // Never ordered
        
        const lastOrderDate = new Date(customer.lastOrderDate);
        return lastOrderDate < cutoffDate;
      });
    }

    setTargetCustomers(filtered);
    setValue('selectedCustomers', filtered.map(c => c.id));
  }, [allCustomers, watchedTargetType, watchedInactiveDays, setValue]);

  const handleCustomerToggle = (customerId: string) => {
    const currentSelected = watch('selectedCustomers');
    const newSelected = currentSelected.includes(customerId)
      ? currentSelected.filter(id => id !== customerId)
      : [...currentSelected, customerId];
    
    setValue('selectedCustomers', newSelected);
  };

  const formatPromotionValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const generatePreviewMessage = (customerName: string) => {
    return watchedMessageTemplate
      .replace(/{{nama}}/g, customerName)
      .replace(/{{kode_promo}}/g, promotion.code)
      .replace(/{{nilai_promo}}/g, formatPromotionValue(promotion.type, promotion.value))
      .replace(/{{tanggal_akhir}}/g, formatDate(promotion.endDate));
  };

  const onSubmit = async (data: BroadcastFormData) => {
    if (data.selectedCustomers.length === 0) {
      toast.error('Pilih minimal satu pelanggan untuk mengirim broadcast!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedCustomerData = targetCustomers.filter(c => 
        data.selectedCustomers.includes(c.id)
      );

      // Simulate broadcast sending
      console.log('Sending WhatsApp broadcast:', {
        promotion: promotion.id,
        customers: selectedCustomerData,
        message: data.messageTemplate
      });
      
      // Simulate API call with progress
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock broadcast result
      const mockResult = {
        total: selectedCustomerData.length,
        success: Math.floor(selectedCustomerData.length * 0.95), // 95% success rate
        failed: Math.ceil(selectedCustomerData.length * 0.05),
        errors: [
          { phone: '081234567890', error: 'Nomor tidak valid' },
          { phone: '081234567891', error: 'API rate limit exceeded' }
        ]
      };

      setBroadcastResult(mockResult);
      
      toast.success(`Broadcast berhasil dikirim ke ${mockResult.success} pelanggan!`, {
        position: "top-right",
        autoClose: 5000,
      });
      
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Gagal mengirim broadcast. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setTargetCustomers([]);
    setBroadcastResult(null);
    setShowPreview(false);
    onClose();
  };

  const selectedCustomers = watch('selectedCustomers') || [];
  const selectedCustomerData = targetCustomers.filter(c => selectedCustomers.includes(c.id));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📱 Kirim Broadcast WhatsApp</h2>
          <p className="text-gray-600">Promosi: {promotion.title}</p>
        </div>
      </div>

      {!broadcastResult ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Promotion Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
              <span>🎯</span>
              <span>Detail Promosi</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Kode:</span>
                <div className="font-semibold text-blue-900">{promotion.code}</div>
              </div>
              <div>
                <span className="text-blue-600">Diskon:</span>
                <div className="font-semibold text-blue-900">
                  {formatPromotionValue(promotion.type, promotion.value)}
                </div>
              </div>
              <div>
                <span className="text-blue-600">Berakhir:</span>
                <div className="font-semibold text-blue-900">
                  {formatDate(promotion.endDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Target Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎯 Target Pelanggan
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('targetType')}
                  type="radio"
                  value="all"
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Semua Pelanggan</div>
                  <p className="text-sm text-gray-600">Kirim ke semua pelanggan terdaftar</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('targetType')}
                  type="radio"
                  value="inactive"
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Pelanggan Tidak Aktif</div>
                  <p className="text-sm text-gray-600">Pelanggan yang tidak transaksi dalam periode tertentu</p>
                </div>
              </label>
            </div>
          </div>

          {/* Inactive Days Input */}
          {watchedTargetType === 'inactive' && (
            <div>
              <label htmlFor="inactiveDays" className="block text-sm font-semibold text-gray-700 mb-2">
                📅 Tidak Transaksi Selama (Hari)
              </label>
              <input
                {...register('inactiveDays', {
                  required: 'Jumlah hari wajib diisi',
                  min: { value: 1, message: 'Minimal 1 hari' },
                  max: { value: 365, message: 'Maksimal 365 hari' }
                })}
                type="number"
                placeholder="30"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.inactiveDays ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.inactiveDays && (
                <p className="mt-2 text-sm text-red-600">{errors.inactiveDays.message}</p>
              )}
            </div>
          )}

          {/* Message Template */}
          <div>
            <label htmlFor="messageTemplate" className="block text-sm font-semibold text-gray-700 mb-2">
              💬 Template Pesan
            </label>
            <textarea
              {...register('messageTemplate', {
                required: 'Template pesan wajib diisi',
                minLength: { value: 20, message: 'Template minimal 20 karakter' }
              })}
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none ${
                errors.messageTemplate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.messageTemplate && (
              <p className="mt-2 text-sm text-red-600">{errors.messageTemplate.message}</p>
            )}
            
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">📋 Placeholder yang Tersedia:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                <div><code className="bg-green-100 px-1 rounded">{'{{nama}}'}</code> - Nama pelanggan</div>
                <div><code className="bg-green-100 px-1 rounded">{'{{kode_promo}}'}</code> - Kode promosi</div>
                <div><code className="bg-green-100 px-1 rounded">{'{{nilai_promo}}'}</code> - Nilai diskon</div>
                <div><code className="bg-green-100 px-1 rounded">{'{{tanggal_akhir}}'}</code> - Tanggal berakhir</div>
              </div>
            </div>
          </div>

          {/* Customer List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                👥 Target Pelanggan ({targetCustomers.length} pelanggan)
              </h4>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm"
              >
                {showPreview ? 'Sembunyikan' : 'Lihat'} Preview
              </button>
            </div>

            {showPreview && selectedCustomerData.length > 0 && (
              <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h5 className="font-semibold text-purple-800 mb-2">📱 Preview Pesan</h5>
                <div className="bg-white p-3 rounded-lg border text-sm">
                  <div className="font-medium text-gray-900 mb-2">
                    Kepada: {selectedCustomerData[0]?.name}
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {generatePreviewMessage(selectedCustomerData[0]?.name || 'Nama Pelanggan')}
                  </div>
                </div>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
              {targetCustomers.length > 0 ? (
                <div className="p-4 space-y-2">
                  {targetCustomers.map((customer) => (
                    <label
                      key={customer.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerToggle(customer.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                        {customer.lastOrderDate && (
                          <div className="text-xs text-gray-400">
                            Terakhir order: {formatDate(customer.lastOrderDate)}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>Tidak ada pelanggan yang sesuai kriteria</p>
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-600">
              {selectedCustomers.length} dari {targetCustomers.length} pelanggan dipilih
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
              disabled={isSubmitting || selectedCustomers.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span>📱</span>
                  <span>Kirim Broadcast ({selectedCustomers.length})</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Broadcast Result */
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Broadcast Berhasil Dikirim!
            </h3>
            <p className="text-gray-600">
              Pesan promosi telah dikirim ke pelanggan yang dipilih
            </p>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">{broadcastResult.total}</div>
              <div className="text-sm text-blue-700">Total Dikirim</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">{broadcastResult.success}</div>
              <div className="text-sm text-green-700">Berhasil</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-600">{broadcastResult.failed}</div>
              <div className="text-sm text-red-700">Gagal</div>
            </div>
          </div>

          {/* Error Details */}
          {broadcastResult.errors && broadcastResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-red-800 mb-3">❌ Detail Error</h4>
              <div className="space-y-2">
                {broadcastResult.errors.map((error: any, index: number) => (
                  <div key={index} className="text-sm text-red-700">
                    <span className="font-medium">{error.phone}:</span> {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Tutup
          </button>
        </div>
      )}
    </Modal>
  );
}