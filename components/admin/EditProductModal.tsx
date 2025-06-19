'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import { checkSkuAvailability } from '@/lib/product-api';

interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  type: 'product' | 'service';
  description?: string;
  hasVariations: boolean;
  variations: ProductVariation[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface EditProductModalProps {
  product: Product;
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
    id?: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
  }[];
  status: 'active' | 'inactive';
}

interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

export default function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSku, setIsCheckingSku] = useState(false);
  const [skuError, setSkuError] = useState('');
  const [variationSkuErrors, setVariationSkuErrors] = useState<{[key: number]: string}>({});
  const [originalVariations, setOriginalVariations] = useState<ProductVariation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    control,
    setError,
    clearErrors
  } = useForm<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations'
  });

  const watchHasVariations = watch('hasVariations');
  const watchType = watch('type');
  const watchSku = watch('sku');
  const watchVariations = watch('variations');

  // Debounce SKU for backend validation
  const debouncedSku = useDebounce(watchSku, 500);

  // Set initial values when product changes
  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('sku', product.sku);
      setValue('price', product.price);
      setValue('stock', product.stock);
      setValue('category', product.category);
      setValue('type', product.type);
      setValue('description', product.description || '');
      setValue('hasVariations', product.hasVariations);
      setValue('status', product.status);
      
      // Store original variations for comparison
      setOriginalVariations(product.variations);
      
      // Set variations
      if (product.variations.length > 0) {
        setValue('variations', product.variations);
      } else {
        setValue('variations', [{ name: '', sku: '', price: 0, stock: 0 }]);
      }

      // Set selected category
      const categoryOption = categoryOptions.find(c => c.value === product.category);
      if (categoryOption) {
        setSelectedCategory(categoryOption);
      } else {
        setSelectedCategory({
          value: product.category,
          label: product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' '),
          icon: '🏷️'
        });
      }
    }
  }, [product, setValue]);

  // Check SKU uniqueness when debounced SKU changes (but not for the current product's SKU)
  useEffect(() => {
    if (debouncedSku && debouncedSku.length >= 4 && debouncedSku !== product.sku) {
      validateSku(debouncedSku);
    } else {
      setSkuError('');
      clearErrors('sku');
    }
  }, [debouncedSku, product.sku]);

  // Validate variation SKUs when they change
  useEffect(() => {
    if (watchHasVariations && watchVariations) {
      const newErrors: {[key: number]: string} = {};
      
      watchVariations.forEach((variation, index) => {
        // Only validate if SKU has changed from original
        const originalVariation = originalVariations.find(v => v.id === variation.id);
        if (variation.sku && variation.sku.length >= 4 && 
            (!originalVariation || variation.sku !== originalVariation.sku)) {
          validateVariationSku(variation.sku, index);
        }
      });
    }
  }, [watchVariations, watchHasVariations, originalVariations]);

  const validateSku = async (sku: string) => {
    setIsCheckingSku(true);
    setSkuError('');
    
    try {
      const isAvailable = await checkSkuAvailability(sku);
      
      if (!isAvailable) {
        setSkuError('SKU sudah digunakan');
        setError('sku', { 
          type: 'manual', 
          message: 'SKU sudah digunakan' 
        });
      } else {
        setSkuError('');
        clearErrors('sku');
      }
    } catch (error) {
      console.error('Error checking SKU:', error);
    } finally {
      setIsCheckingSku(false);
    }
  };

  const validateVariationSku = async (sku: string, index: number) => {
    try {
      // Skip validation if this is an existing variation with the same SKU
      const originalVariation = originalVariations.find(v => v.sku === sku);
      if (originalVariation) {
        return;
      }
      
      const isAvailable = await checkSkuAvailability(sku);
      
      if (!isAvailable) {
        setVariationSkuErrors(prev => ({
          ...prev,
          [index]: 'SKU sudah digunakan'
        }));
        setError(`variations.${index}.sku` as any, { 
          type: 'manual', 
          message: 'SKU sudah digunakan' 
        });
      } else {
        setVariationSkuErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[index];
          return newErrors;
        });
        clearErrors(`variations.${index}.sku` as any);
      }
    } catch (error) {
      console.error('Error checking variation SKU:', error);
    }
  };

  // Generate variation SKUs based on main SKU
  const generateVariationSkus = () => {
    const mainSku = watch('sku');
    if (!mainSku) {
      toast.error('SKU utama harus diisi terlebih dahulu');
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

  // Handle category selection
  const handleCategorySelect = (category: CategoryOption | null) => {
    setSelectedCategory(category);
    if (category) {
      setValue('category', category.value);
      clearErrors('category');
    } else {
      setValue('category', '');
    }
  };

  // Handle creating new category
  const handleCreateCategory = (inputValue: string) => {
    const newCategory: CategoryOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, '_'),
      label: inputValue,
      icon: '🏷️'
    };
    
    setValue('category', newCategory.value);
    setSelectedCategory(newCategory);
    clearErrors('category');
  };

  // Fetch categories (simulated)
  const fetchCategories = async (searchTerm: string) => {
    setIsLoadingCategories(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Default categories
      const defaultCategories: CategoryOption[] = [
        { value: 'laundry', label: 'Layanan Laundry', icon: '🧺' },
        { value: 'detergent', label: 'Detergen', icon: '🧴' },
        { value: 'perfume', label: 'Parfum', icon: '🌸' },
        { value: 'packaging', label: 'Kemasan', icon: '📦' },
        { value: 'other', label: 'Lainnya', icon: '🔖' }
      ];
      
      // Filter categories based on search term
      return defaultCategories.filter(category => 
        category.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // Check for SKU errors
    if (skuError) {
      toast.error('SKU utama sudah digunakan. Silakan gunakan SKU lain.');
      return;
    }
    
    // Validate variations if hasVariations is true
    if (data.hasVariations) {
      // Check for variation SKU errors
      if (Object.keys(variationSkuErrors).length > 0) {
        toast.error('Beberapa SKU variasi sudah digunakan. Silakan periksa kembali.');
        return;
      }
      
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
        id: product.id,
        createdAt: product.createdAt,
        updatedAt: new Date().toISOString(),
        // For services, set stock to 0 and handle variations appropriately
        ...(data.type === 'service' && !data.hasVariations && { stock: 0 }),
        ...(data.type === 'service' && data.hasVariations && {
          variations: data.variations.map(v => ({...v, stock: 0}))
        })
      };

      console.log('Updating product:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${data.type === 'service' ? 'Layanan' : 'Produk'} "${data.name}" berhasil diperbarui!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Gagal memperbarui ${data.type === 'service' ? 'layanan' : 'produk'}. Silakan coba lagi.`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSkuError('');
    setVariationSkuErrors({});
    setOriginalVariations([]);
    setSelectedCategory(null);
    onClose();
  };

  const categoryOptions: CategoryOption[] = [
    { value: 'laundry', label: 'Layanan Laundry', icon: '🧺' },
    { value: 'detergent', label: 'Detergen', icon: '🧴' },
    { value: 'perfume', label: 'Parfum', icon: '🌸' },
    { value: 'packaging', label: 'Kemasan', icon: '📦' },
    { value: 'other', label: 'Lainnya', icon: '🔖' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">✏️ Edit {product.type === 'service' ? 'Layanan' : 'Produk'}</h2>
          <p className="text-gray-600">Perbarui informasi {product.type === 'service' ? 'layanan' : 'produk'}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Product Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
            <span>📊</span>
            <span>Informasi Item Saat Ini</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">SKU:</span>
              <div className="font-semibold text-blue-900">{product.sku}</div>
            </div>
            <div>
              <span className="text-blue-600">Jenis:</span>
              <div className="font-semibold text-blue-900">
                {product.type === 'service' ? 'Layanan' : 'Produk Fisik'}
              </div>
            </div>
            <div>
              <span className="text-blue-600">Kategori:</span>
              <div className="font-semibold text-blue-900">
                {categoryOptions.find(c => c.value === product.category)?.label || product.category}
              </div>
            </div>
          </div>
        </div>

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
            <div className="relative">
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
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.sku || skuError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              
              {/* Loading/Status indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isCheckingSku ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : watchSku && watchSku.length >= 4 && watchSku !== product.sku && !skuError ? (
                  <span className="text-green-500 text-lg">✅</span>
                ) : null}
              </div>
            </div>
            {errors.sku && (
              <p className="mt-2 text-sm text-red-600">{errors.sku.message}</p>
            )}
            {skuError && (
              <p className="mt-2 text-sm text-red-600">{skuError}</p>
            )}
            {watchSku === product.sku && (
              <p className="mt-2 text-xs text-gray-600">
                SKU saat ini (tidak berubah)
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏷️ Kategori <span className="text-red-500">*</span>
          </label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategorySelect}
            onCreateOption={handleCreateCategory}
            onInputChange={(value) => fetchCategories(value)}
            placeholder="Pilih atau buat kategori baru..."
            isSearchable={true}
            isCreatable={true}
            isLoading={isLoadingCategories}
            error={errors.category?.message}
          />
          <input
            {...register('category', { required: 'Kategori wajib dipilih' })}
            type="hidden"
          />
        </div>

        {/* Price & Stock (for products) */}
        {!watchHasVariations && (
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

        {/* Variations Toggle */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              🔄 Variasi {watchType === 'product' ? 'Produk' : 'Layanan'}
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
              
              {fields.map((field, index) => {
                // Check if this variation exists in original data
                const isExistingVariation = originalVariations.some(v => v.id === field.id);
                
                return (
                  <div key={field.id} className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">Variasi #{index + 1}</h5>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={isExistingVariation && originalVariations.length === 1}
                          title={isExistingVariation && originalVariations.length === 1 ? "Tidak dapat menghapus variasi terakhir" : ""}
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
                        {errors.variations?.[index]?.name && (
                          <p className="mt-1 text-xs text-red-600">{errors.variations[index]?.name?.message}</p>
                        )}
                      </div>
                      
                      {/* Variation SKU */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU Variasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            {...register(`variations.${index}.sku` as const, {
                              required: 'SKU variasi wajib diisi',
                              pattern: {
                                value: /^[A-Z0-9\-]+$/,
                                message: 'SKU hanya boleh berisi huruf besar, angka, dan tanda hubung'
                              }
                            })}
                            type="text"
                            placeholder="PRD-001-V01"
                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none ${
                              errors.variations?.[index]?.sku || variationSkuErrors[index] ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          
                          {/* Status indicator */}
                          {watchVariations[index]?.sku && watchVariations[index].sku.length >= 4 && !variationSkuErrors[index] && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <span className="text-green-500 text-sm">✓</span>
                            </div>
                          )}
                        </div>
                        {errors.variations?.[index]?.sku && (
                          <p className="mt-1 text-xs text-red-600">{errors.variations[index]?.sku?.message}</p>
                        )}
                        {variationSkuErrors[index] && (
                          <p className="mt-1 text-xs text-red-600">{variationSkuErrors[index]}</p>
                        )}
                        {isExistingVariation && watchVariations[index]?.sku === originalVariations.find(v => v.id === field.id)?.sku && (
                          <p className="mt-1 text-xs text-gray-600">
                            SKU saat ini (tidak berubah)
                          </p>
                        )}
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
                        {errors.variations?.[index]?.price && (
                          <p className="mt-1 text-xs text-red-600">{errors.variations[index]?.price?.message}</p>
                        )}
                      </div>
                      
                      {/* Variation Stock (only for products) */}
                      {watchType === 'product' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stok <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register(`variations.${index}.stock` as const, {
                              required: watchType === 'product' ? 'Stok variasi wajib diisi' : false,
                              min: { value: 0, message: 'Stok tidak boleh negatif' }
                            })}
                            type="number"
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                          {errors.variations?.[index]?.stock && (
                            <p className="mt-1 text-xs text-red-600">{errors.variations[index]?.stock?.message}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
            disabled={isSubmitting || isCheckingSku || Object.keys(variationSkuErrors).length > 0}
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
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}