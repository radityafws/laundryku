'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductFormData {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  type: 'product' | 'service';
  description: string;
  hasVariations: boolean;
  variations: {
    name: string;
    sku: string;
    price: number;
    stock: number;
  }[];
  status: 'active' | 'inactive';
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      category: 'laundry',
      type: 'service',
      description: '',
      hasVariations: false,
      variations: [{ name: '', sku: '', price: 0, stock: 0 }],
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations'
  });

  const watchHasVariations = watch('hasVariations');
  const watchType = watch('type');
  const watchName = watch('name');

  // Generate SKU based on product name
  const generateSku = () => {
    if (!watchName) {
      toast.error('Masukkan nama produk terlebih dahulu');
      return;
    }
    
    const prefix = watchType === 'service' ? 'SRV' : 'PRD';
    const namePart = watchName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 3);
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    setValue('sku', `${prefix}-${namePart}${randomPart}`);
  };

  // Generate variation SKUs based on main SKU
  const generateVariationSkus = () => {
    const mainSku = watch('sku');
    if (!mainSku) {
      toast.error('Generate SKU utama terlebih dahulu');
      return;
    }
    
    const updatedVariations = fields.map((field, index) => {
      return {
        ...field,
        sku: `${mainSku}-V${(index + 1).toString().padStart(2, '0')}`
      };
    });
    
    updatedVariations.forEach((variation, index) => {
      setValue(`variations.${index}.sku`, variation.sku);
    });
  };

  const addVariation = () => {
    append({ name: '', sku: '', price: 0, stock: 0 });
  };

  const onSubmit = async (data: ProductFormData) => {
    // Validate variations if hasVariations is true
    if (data.hasVariations) {
      const emptyVariations = data.variations.some(v => !v.name);
      if (emptyVariations) {
        toast.error('Semua nama variasi harus diisi');
        return;
      }
      
      // Check for duplicate variation names
      const variationNames = data.variations.map(v => v.name.toLowerCase());
      const hasDuplicates = variationNames.some((name, index) => 
        variationNames.indexOf(name) !== index
      );
      
      if (hasDuplicates) {
        toast.error('Nama variasi tidak boleh duplikat');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare product data
      const productData = {
        ...data,
        id: `item_${Date.now()}`,
        createdAt: new Date().toISOString(),
        // For services, set stock to 0 and hasVariations to false
        ...(data.type === 'service' && { stock: 0, hasVariations: false, variations: [] })
      };

      console.log('Creating product:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${data.type === 'service' ? 'Layanan' : 'Produk'} "${data.name}" berhasil ditambahkan!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(`Gagal menambahkan ${data.type === 'service' ? 'layanan' : 'produk'}. Silakan coba lagi.`, {
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

  const categoryOptions = [
    { value: 'laundry', label: 'Layanan Laundry', icon: '🧺' },
    { value: 'detergent', label: 'Detergen', icon: '🧴' },
    { value: 'perfume', label: 'Parfum', icon: '🌸' },
    { value: 'packaging', label: 'Kemasan', icon: '📦' },
    { value: 'other', label: 'Lainnya', icon: '🔖' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">➕ Tambah Item Baru</h2>
          <p className="text-gray-600">Tambahkan produk atau layanan baru</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Nama Item <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', {
                required: 'Nama item wajib diisi',
                minLength: { value: 3, message: 'Nama minimal 3 karakter' },
                maxLength: { value: 100, message: 'Nama maksimal 100 karakter' }
              })}
              type="text"
              placeholder="Contoh: Cuci Ekspres, Deterjen 1L"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ SKU <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                {...register('sku', {
                  required: 'SKU wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9\-]+$/,
                    message: 'SKU hanya boleh berisi huruf besar, angka, dan tanda hubung'
                  }
                })}
                type="text"
                placeholder="PRD-001"
                className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.sku ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={generateSku}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors"
              >
                Generate
              </button>
            </div>
            {errors.sku && (
              <p className="mt-2 text-sm text-red-600">{errors.sku.message}</p>
            )}
          </div>
        </div>

        {/* Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🔖 Jenis Item <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('type')}
                  type="radio"
                  value="product"
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🛍️</span>
                    <span className="font-medium text-gray-900">Produk Fisik</span>
                  </div>
                  <div className="text-xs text-gray-600">Memiliki stok fisik</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  {...register('type')}
                  type="radio"
                  value="service"
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🧼</span>
                    <span className="font-medium text-gray-900">Layanan</span>
                  </div>
                  <div className="text-xs text-gray-600">Tidak memiliki stok</div>
                </div>
              </label>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ Kategori <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category', {
                required: 'Kategori wajib dipilih'
              })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.category ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Price & Stock (for products) */}
        {(watchType === 'product' || watchType === 'service') && !watchHasVariations && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Harga <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  {...register('price', {
                    required: 'Harga wajib diisi',
                    min: { value: 0, message: 'Harga tidak boleh negatif' }
                  })}
                  type="number"
                  placeholder="0"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Stock (only for products) */}
            {watchType === 'product' && (
              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                  📦 Stok <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('stock', {
                    required: watchType === 'product' ? 'Stok wajib diisi' : false,
                    min: { value: 0, message: 'Stok tidak boleh negatif' }
                  })}
                  type="number"
                  placeholder="0"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    errors.stock ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.stock && (
                  <p className="mt-2 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Keterangan (Opsional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Deskripsi tambahan tentang produk atau layanan..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
          />
        </div>

        {/* Variations Toggle (only for products) */}
        {watchType === 'product' && (
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                🔄 Variasi Produk
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('hasVariations')}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  {watchHasVariations ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>
            
            {watchHasVariations && (
              <div className="mt-4 p-4 border border-blue-200 rounded-xl bg-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-blue-800">Daftar Variasi</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={generateVariationSkus}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg font-medium transition-colors text-sm"
                    >
                      Generate SKU Variasi
                    </button>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors text-sm"
                    >
                      + Tambah Variasi
                    </button>
                  </div>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">Variasi #{index + 1}</h5>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ✕ Hapus
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Variation Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Variasi <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register(`variations.${index}.name` as const, {
                            required: 'Nama variasi wajib diisi'
                          })}
                          type="text"
                          placeholder="Contoh: Ukuran S, Warna Merah"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      
                      {/* Variation SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU Variasi <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register(`variations.${index}.sku` as const, {
                            required: 'SKU variasi wajib diisi'
                          })}
                          type="text"
                          placeholder="PRD-001-V01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      
                      {/* Variation Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harga <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            Rp
                          </span>
                          <input
                            {...register(`variations.${index}.price` as const, {
                              required: 'Harga variasi wajib diisi',
                              min: { value: 0, message: 'Harga tidak boleh negatif' }
                            })}
                            type="number"
                            placeholder="0"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                      </div>
                      
                      {/* Variation Stock */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stok <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register(`variations.${index}.stock` as const, {
                            required: 'Stok variasi wajib diisi',
                            min: { value: 0, message: 'Stok tidak boleh negatif' }
                          })}
                          type="number"
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🏷️ Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
              <input
                {...register('status')}
                type="radio"
                value="active"
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Aktif</div>
                <div className="text-xs text-gray-600">Tersedia untuk dijual/digunakan</div>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
              <input
                {...register('status')}
                type="radio"
                value="inactive"
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-900">Nonaktif</div>
                <div className="text-xs text-gray-600">Tidak tersedia untuk dijual/digunakan</div>
              </div>
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Informasi Penting</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• SKU harus unik untuk setiap produk dan variasi</li>
                <li>• Untuk layanan, stok dan variasi tidak relevan</li>
                <li>• Variasi digunakan untuk produk dengan beberapa opsi (ukuran, warna, dll)</li>
                <li>• Harga dan stok per variasi wajib diisi jika variasi aktif</li>
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
                <span>Simpan Item</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}