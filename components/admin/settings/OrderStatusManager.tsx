'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';

interface OrderStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
}

interface OrderStatusFormData {
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function OrderStatusManager() {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<OrderStatus | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<OrderStatusFormData>({
    defaultValues: {
      name: '',
      description: '',
      icon: '📦',
      order: 0,
      isActive: true
    }
  });

  // Load order statuses
  useEffect(() => {
    const loadOrderStatuses = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockStatuses: OrderStatus[] = [
          {
            id: '1',
            name: 'Pesanan Diterima',
            description: 'Pesanan telah diterima dan sedang menunggu proses',
            icon: '📥',
            order: 1,
            isActive: true,
            isDefault: true,
            createdAt: '2024-12-15'
          },
          {
            id: '2',
            name: 'Sedang Dicuci',
            description: 'Pesanan sedang dalam proses pencucian',
            icon: '🧼',
            order: 2,
            isActive: true,
            createdAt: '2024-12-15'
          },
          {
            id: '3',
            name: 'Sedang Dikeringkan',
            description: 'Pesanan sedang dalam proses pengeringan',
            icon: '🌞',
            order: 3,
            isActive: true,
            createdAt: '2024-12-15'
          },
          {
            id: '4',
            name: 'Sedang Disetrika',
            description: 'Pesanan sedang dalam proses penyetrikaan',
            icon: '🔥',
            order: 4,
            isActive: true,
            createdAt: '2024-12-15'
          },
          {
            id: '5',
            name: 'Siap Diambil',
            description: 'Pesanan telah selesai dan siap untuk diambil',
            icon: '🚚',
            order: 5,
            isActive: true,
            createdAt: '2024-12-15'
          },
          {
            id: '6',
            name: 'Pesanan Selesai',
            description: 'Pesanan telah diambil/diterima oleh pelanggan',
            icon: '✅',
            order: 6,
            isActive: true,
            isDefault: true,
            createdAt: '2024-12-15'
          },
          {
            id: '7',
            name: 'Dibatalkan',
            description: 'Pesanan dibatalkan',
            icon: '❌',
            order: 7,
            isActive: true,
            isDefault: true,
            createdAt: '2024-12-15'
          }
        ];
        
        setOrderStatuses(mockStatuses);
      } catch (error) {
        console.error('Error loading order statuses:', error);
        toast.error('Gagal memuat data status pesanan');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrderStatuses();
  }, []);

  const handleAddStatus = () => {
    reset({
      name: '',
      description: '',
      icon: '📦',
      order: orderStatuses.length + 1,
      isActive: true
    });
    setEditingStatus(null);
    setShowAddModal(true);
  };

  const handleEditStatus = (status: OrderStatus) => {
    setValue('name', status.name);
    setValue('description', status.description);
    setValue('icon', status.icon);
    setValue('order', status.order);
    setValue('isActive', status.isActive);
    setEditingStatus(status);
    setShowAddModal(true);
  };

  const handleDeleteStatus = (status: OrderStatus) => {
    if (status.isDefault) {
      toast.error('Status default tidak dapat dihapus', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus status "${status.name}"?`)) {
      // Here you would call your API to delete the status
      console.log('Deleting status:', status.id);
      
      // Update local state
      setOrderStatuses(prev => prev.filter(s => s.id !== status.id));
      
      toast.success(`Status "${status.name}" berhasil dihapus!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleActive = (status: OrderStatus) => {
    if (status.isDefault && status.isActive) {
      toast.error('Status default harus tetap aktif', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    // Here you would call your API to update the status
    console.log('Toggling status active state:', status.id);
    
    // Update local state
    setOrderStatuses(prev => 
      prev.map(s => 
        s.id === status.id 
          ? { ...s, isActive: !s.isActive } 
          : s
      )
    );
    
    toast.success(`Status "${status.name}" berhasil ${status.isActive ? 'dinonaktifkan' : 'diaktifkan'}!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const onSubmitStatus = async (data: OrderStatusFormData) => {
    try {
      if (editingStatus) {
        // Update existing status
        console.log('Updating status:', { ...data, id: editingStatus.id });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setOrderStatuses(prev => 
          prev.map(s => 
            s.id === editingStatus.id 
              ? { 
                  ...s, 
                  name: data.name,
                  description: data.description,
                  icon: data.icon,
                  order: data.order,
                  isActive: data.isActive
                } 
              : s
          )
        );
        
        toast.success(`Status "${data.name}" berhasil diperbarui!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Create new status
        const newStatus: OrderStatus = {
          id: `status_${Date.now()}`,
          name: data.name,
          description: data.description,
          icon: data.icon,
          order: data.order,
          isActive: data.isActive,
          createdAt: new Date().toISOString()
        };
        
        console.log('Creating new status:', newStatus);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local state
        setOrderStatuses(prev => [...prev, newStatus].sort((a, b) => a.order - b.order));
        
        toast.success(`Status "${data.name}" berhasil ditambahkan!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
      // Close modal and reset form
      setShowAddModal(false);
      reset();
      setEditingStatus(null);
    } catch (error) {
      console.error('Error saving status:', error);
      toast.error('Gagal menyimpan status. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleDragStart = (status: OrderStatus) => {
    setIsDragging(true);
    setDraggedItem(status);
  };

  const handleDragOver = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetStatus.id) return;
    
    // Reorder the statuses
    const newStatuses = [...orderStatuses];
    const draggedIndex = newStatuses.findIndex(s => s.id === draggedItem.id);
    const targetIndex = newStatuses.findIndex(s => s.id === targetStatus.id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged item
      const [removed] = newStatuses.splice(draggedIndex, 1);
      // Insert it at the target position
      newStatuses.splice(targetIndex, 0, removed);
      
      // Update order numbers
      newStatuses.forEach((status, index) => {
        status.order = index + 1;
      });
      
      setOrderStatuses(newStatuses);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    
    // Here you would call your API to update the order of all statuses
    console.log('Saving new status order:', orderStatuses.map(s => ({ id: s.id, order: s.order })));
    
    toast.success('Urutan status berhasil diperbarui!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const iconOptions = [
    '📥', '📤', '🧺', '🧼', '🌞', '🔥', '✅', '🚚', '❌', '⏳', '⌛', 
    '📦', '🧵', '👕', '👖', '🧦', '🧣', '🧥', '👚', '👔', '👗', '🛒'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <span>📦</span>
            <span>Manajemen Status Pesanan</span>
          </h3>
          <p className="text-gray-600">Kelola alur status pesanan laundry</p>
        </div>
        
        <button
          onClick={handleAddStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <span>➕</span>
          <span>Tambah Status</span>
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Informasi Penting</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Status dengan tanda <span className="bg-yellow-100 text-yellow-700 px-1 rounded">Default</span> tidak dapat dihapus</li>
              <li>• Ubah urutan status dengan drag & drop untuk menyesuaikan alur pesanan</li>
              <li>• Status yang dinonaktifkan tidak akan muncul di opsi perubahan status pesanan</li>
              <li>• Ikon status akan ditampilkan di halaman pelanggan dan notifikasi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status List */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orderStatuses.map((status) => (
            <div
              key={status.id}
              draggable
              onDragStart={() => handleDragStart(status)}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragEnd={handleDragEnd}
              className={`bg-white border-2 rounded-xl p-4 flex items-center justify-between ${
                isDragging && draggedItem?.id === status.id 
                  ? 'opacity-50 border-blue-300' 
                  : 'border-gray-200'
              } ${status.isActive ? '' : 'bg-gray-50'}`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-400 cursor-move">
                  <span className="text-xl">⋮⋮</span>
                </div>
                
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{status.icon}</span>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{status.name}</h4>
                    {status.isDefault && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    {!status.isActive && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{status.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(status)}
                  className={`p-2 rounded-lg transition-colors ${
                    status.isActive 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={status.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {status.isActive ? '✅' : '❌'}
                </button>
                
                <button
                  onClick={() => handleEditStatus(status)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Edit"
                >
                  ✏️
                </button>
                
                <button
                  onClick={() => handleDeleteStatus(status)}
                  className={`p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors ${
                    status.isDefault ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={status.isDefault}
                  title={status.isDefault ? 'Status default tidak dapat dihapus' : 'Hapus'}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Status Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setEditingStatus(null);
          reset();
        }}
        size="md"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {editingStatus ? '✏️ Edit Status' : '➕ Tambah Status Baru'}
          </h3>
          <p className="text-gray-600">
            {editingStatus ? 'Perbarui informasi status pesanan' : 'Tambahkan status baru ke alur pesanan'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmitStatus)} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Nama Status <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', {
                required: 'Nama status wajib diisi',
                minLength: { value: 3, message: 'Nama minimal 3 karakter' },
                maxLength: { value: 50, message: 'Nama maksimal 50 karakter' }
              })}
              type="text"
              placeholder="Contoh: Sedang Dicuci"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              📄 Keterangan
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Deskripsi status (opsional)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎨 Ikon <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-8 gap-2">
              {iconOptions.map((icon) => (
                <label
                  key={icon}
                  className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    watch('icon') === icon
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('icon', { required: 'Ikon wajib dipilih' })}
                    value={icon}
                    className="sr-only"
                  />
                  <span className="text-xl">{icon}</span>
                </label>
              ))}
            </div>
            {errors.icon && (
              <p className="mt-2 text-sm text-red-600">{errors.icon.message}</p>
            )}
          </div>

          {/* Order Field */}
          <div>
            <label htmlFor="order" className="block text-sm font-semibold text-gray-700 mb-2">
              🔢 Urutan <span className="text-red-500">*</span>
            </label>
            <input
              {...register('order', {
                required: 'Urutan wajib diisi',
                min: { value: 1, message: 'Urutan minimal 1' }
              })}
              type="number"
              placeholder="1"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                errors.order ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.order && (
              <p className="mt-2 text-sm text-red-600">{errors.order.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Urutan menentukan alur status pesanan dari awal hingga akhir
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
              🔖 Status Aktif
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {watch('isActive') ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingStatus(null);
                reset();
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {editingStatus ? 'Simpan Perubahan' : 'Tambah Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}