'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';

interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'driver';
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  salary: number;
  address?: string;
}

interface EditEmployeeModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

interface EmployeeFormData {
  name: string;
  phone: string;
  email: string;
  role: string;
  customRole?: string;
  address?: string;
  salary: number;
  status: 'active' | 'inactive';
}

interface RoleOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

const defaultRoles: RoleOption[] = [
  {
    value: 'admin',
    label: 'Administrator',
    icon: '👑',
    description: 'Akses penuh ke semua fitur sistem'
  },
  {
    value: 'staff',
    label: 'Staff Laundry',
    icon: '👨‍💼',
    description: 'Mengelola operasional harian laundry'
  },
  {
    value: 'driver',
    label: 'Driver',
    icon: '🚚',
    description: 'Antar jemput pakaian pelanggan'
  }
];

export default function EditEmployeeModal({ employee, isOpen, onClose }: EditEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue
  } = useForm<EmployeeFormData>();

  const watchedPhone = watch('phone');
  const watchedEmail = watch('email');

  const debouncedPhone = useDebounce(watchedPhone, 500);
  const debouncedEmail = useDebounce(watchedEmail, 500);

  // Set initial values when employee changes
  useEffect(() => {
    if (employee) {
      setValue('name', employee.name);
      setValue('phone', employee.phone);
      setValue('email', employee.email);
      setValue('role', employee.role);
      setValue('address', employee.address || '');
      setValue('salary', employee.salary);
      setValue('status', employee.status);
      
      // Set selected role
      const role = defaultRoles.find(r => r.value === employee.role);
      if (role) {
        setSelectedRole(role);
      } else {
        // Custom role
        const customRole: RoleOption = {
          value: employee.role,
          label: employee.role,
          icon: '👤',
          description: 'Jabatan kustom'
        };
        setRoleOptions(prev => [...prev, customRole]);
        setSelectedRole(customRole);
      }
    }
  }, [employee, setValue]);

  // Check phone uniqueness (excluding current employee's phone)
  React.useEffect(() => {
    if (debouncedPhone && debouncedPhone.length >= 9 && debouncedPhone !== employee.phone) {
      checkPhoneUniqueness(debouncedPhone);
    } else {
      setPhoneError('');
      clearErrors('phone');
    }
  }, [debouncedPhone, employee.phone]);

  // Check email uniqueness (excluding current employee's email)
  React.useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes('@') && debouncedEmail !== employee.email) {
      checkEmailUniqueness(debouncedEmail);
    } else {
      setEmailError('');
      clearErrors('email');
    }
  }, [debouncedEmail, employee.email]);

  const checkPhoneUniqueness = async (phone: string) => {
    setIsCheckingPhone(true);
    setPhoneError('');
    
    try {
      // Simulate API call to check phone uniqueness
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock existing phones for demo (excluding current employee)
      const existingPhones = ['081234567890', '081234567891', '081234567892'];
      
      if (existingPhones.includes(phone) && phone !== employee.phone) {
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

  const checkEmailUniqueness = async (email: string) => {
    setIsCheckingEmail(true);
    setEmailError('');
    
    try {
      // Simulate API call to check email uniqueness
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock existing emails for demo (excluding current employee)
      const existingEmails = ['admin@laundrykilat.id', 'staff@laundrykilat.id', 'driver@laundrykilat.id'];
      
      if (existingEmails.includes(email.toLowerCase()) && email !== employee.email) {
        setEmailError('Email sudah terdaftar');
        setError('email', { 
          type: 'manual', 
          message: 'Email sudah terdaftar' 
        });
      } else {
        setEmailError('');
        clearErrors('email');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role: RoleOption | null) => {
    setSelectedRole(role);
    if (role) {
      setValue('role', role.value);
      clearErrors('role');
      
      // Set default salary based on role (only if it's a default role)
      const defaultSalaries = {
        admin: 4500000,
        staff: 3200000,
        driver: 2800000
      };
      
      if (role.value in defaultSalaries) {
        setValue('salary', defaultSalaries[role.value as keyof typeof defaultSalaries]);
      }
    } else {
      setValue('role', '');
    }
  };

  // Handle creating new role
  const handleCreateRole = (inputValue: string) => {
    const newRole: RoleOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, '_'),
      label: inputValue,
      icon: '👤',
      description: 'Jabatan kustom'
    };
    
    setRoleOptions(prev => [...prev, newRole]);
    setSelectedRole(newRole);
    setValue('role', newRole.value);
    setValue('customRole', inputValue);
    clearErrors('role');
  };

  const onSubmit = async (data: EmployeeFormData) => {
    // Final validation checks
    if (phoneError || emailError) {
      toast.error('Harap perbaiki error validasi terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare employee data
      const employeeData = {
        ...data,
        id: employee.id,
        joinDate: employee.joinDate,
        updatedAt: new Date().toISOString()
      };

      // Here you would call your API to update the employee
      console.log('Updating employee:', employeeData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success(`Data pegawai "${data.name}" berhasil diperbarui!`, {
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
      console.error('Error updating employee:', error);
      toast.error('Gagal memperbarui data pegawai. Silakan coba lagi.', {
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
    setPhoneError('');
    setEmailError('');
    setSelectedRole(null);
    setRoleOptions(defaultRoles);
    onClose();
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      const number = parseInt(numericValue);
      return new Intl.NumberFormat('id-ID').format(number);
    }
    return '';
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setValue('salary', parseInt(value) || 0);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'staff': return '👨‍💼';
      case 'driver': return '🚚';
      default: return '👤';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'staff': return 'Staff Laundry';
      case 'driver': return 'Driver';
      default: return role;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">✏️ Edit Data Pegawai</h2>
          <p className="text-gray-600">Perbarui informasi pegawai</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Employee Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
            <span>📊</span>
            <span>Data Pegawai Saat Ini</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Nama:</span>
              <div className="font-semibold text-blue-900">{employee.name}</div>
            </div>
            <div>
              <span className="text-blue-600">Jabatan:</span>
              <div className="font-semibold text-blue-900 flex items-center space-x-1">
                <span>{getRoleIcon(employee.role)}</span>
                <span>{getRoleName(employee.role)}</span>
              </div>
            </div>
            <div>
              <span className="text-blue-600">Bergabung:</span>
              <div className="font-semibold text-blue-900">
                {formatDateForDisplay(employee.joinDate)}
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
              
              {/* Loading/Status indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isCheckingPhone ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : debouncedPhone && debouncedPhone.length >= 9 && !phoneError && !errors.phone ? (
                  <span className="text-green-500 text-lg">✅</span>
                ) : null}
              </div>
            </div>
            
            {(errors.phone || phoneError) && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.phone?.message || phoneError}</span>
              </p>
            )}
            
            {debouncedPhone === employee.phone && (
              <p className="mt-2 text-sm text-gray-600 flex items-center space-x-1">
                <span>ℹ️</span>
                <span>Nomor HP saat ini (tidak berubah)</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              📧 Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid'
                  }
                })}
                type="email"
                placeholder="nama@email.com"
                className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.email || emailError 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              
              {/* Loading/Status indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isCheckingEmail ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : debouncedEmail && debouncedEmail.includes('@') && !emailError && !errors.email ? (
                  <span className="text-green-500 text-lg">✅</span>
                ) : null}
              </div>
            </div>
            
            {(errors.email || emailError) && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.email?.message || emailError}</span>
              </p>
            )}
            
            {debouncedEmail === employee.email && (
              <p className="mt-2 text-sm text-gray-600 flex items-center space-x-1">
                <span>ℹ️</span>
                <span>Email saat ini (tidak berubah)</span>
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💼 Jabatan <span className="text-red-500">*</span>
            </label>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleSelect}
              onCreateOption={handleCreateRole}
              placeholder="Pilih jabatan atau buat jabatan baru..."
              isSearchable={true}
              isCreatable={true}
              error={errors.role?.message}
            />
            <input
              {...register('role', { required: 'Jabatan wajib dipilih' })}
              type="hidden"
            />
            
            {/* Role Info Display */}
            {selectedRole && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{selectedRole.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">{selectedRole.label}</h4>
                    <p className="text-sm text-blue-600">{selectedRole.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏷️ Status Pegawai <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                watch('status') === 'active'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}>
                <input
                  {...register('status', { required: 'Status wajib dipilih' })}
                  type="radio"
                  value="active"
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-lg">✅</span>
                <span className="font-medium text-gray-900">Aktif</span>
              </label>
              
              <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                watch('status') === 'inactive'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}>
                <input
                  {...register('status', { required: 'Status wajib dipilih' })}
                  type="radio"
                  value="inactive"
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-lg">❌</span>
                <span className="font-medium text-gray-900">Tidak Aktif</span>
              </label>
            </div>
            {errors.status && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.status.message}</span>
              </p>
            )}
          </div>

          {/* Salary Field */}
          <div>
            <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Gaji Bulanan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                {...register('salary', {
                  required: 'Gaji bulanan wajib diisi',
                  min: {
                    value: 1000000,
                    message: 'Gaji minimal Rp 1.000.000'
                  },
                  max: {
                    value: 50000000,
                    message: 'Gaji maksimal Rp 50.000.000'
                  }
                })}
                type="text"
                placeholder="0"
                onChange={handleSalaryChange}
                value={watch('salary') ? formatCurrency(watch('salary').toString()) : ''}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.salary ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.salary && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.salary.message}</span>
              </p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              🏠 Alamat (Opsional)
            </label>
            <textarea
              {...register('address', {
                maxLength: {
                  value: 500,
                  message: 'Alamat maksimal 500 karakter'
                }
              })}
              rows={3}
              placeholder="Masukkan alamat lengkap..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none resize-none ${
                errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {errors.address && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>❌</span>
                <span>{errors.address.message}</span>
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
              disabled={isSubmitting || isCheckingPhone || isCheckingEmail || !!phoneError || !!emailError}
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
      </div>
    </Modal>
  );
}