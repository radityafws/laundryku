'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { LoginCredentials } from '@/lib/auth';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const demoCredentials = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    description: 'Full access to all features',
    icon: '👑',
    color: 'from-purple-500 to-purple-600'
  },
  {
    username: 'staff',
    password: 'staff123',
    role: 'Staff',
    description: 'Limited access for daily operations',
    icon: '👨‍💼',
    color: 'from-blue-500 to-blue-600'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useLogin();

  // Watch form values for demo credential highlighting
  const watchedUsername = watch('username');
  const watchedPassword = watch('password');

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials: LoginCredentials = {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      };

      await loginMutation.mutateAsync(credentials);
    } catch (error: any) {
      // Handle specific field errors
      if (error.message.toLowerCase().includes('username')) {
        setError('username', { message: error.message });
      } else if (error.message.toLowerCase().includes('password')) {
        setError('password', { message: error.message });
      } else {
        setError('root', { message: error.message });
      }
    }
  };

  const handleDemoLogin = (demo: typeof demoCredentials[0]) => {
    setValue('username', demo.username);
    setValue('password', demo.password);
    setValue('rememberMe', true);
    
    // Auto-submit after a short delay for better UX
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 300);
  };

  const isCurrentDemo = (demo: typeof demoCredentials[0]) => {
    return watchedUsername === demo.username && watchedPassword === demo.password;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🧺</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">LaundryKilat</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🔐 Admin Login
          </h2>
          <p className="text-gray-600">
            Masuk ke panel admin untuk mengelola pesanan laundry
          </p>
        </div>

        {/* Demo Credentials Quick Access */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            🚀 Quick Demo Login
          </h3>
          <div className="space-y-3">
            {demoCredentials.map((demo, index) => (
              <button
                key={index}
                onClick={() => handleDemoLogin(demo)}
                disabled={loginMutation.isPending}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isCurrentDemo(demo)
                    ? 'border-green-400 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } ${loginMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${demo.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                    {demo.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Login as {demo.role}</h4>
                      {isCurrentDemo(demo) && (
                        <span className="text-green-600 text-sm">✓ Selected</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{demo.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {demo.username} / {demo.password}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              💡 Click any option above for instant login, or use the form below for manual entry
            </p>
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              📝 Manual Login
            </h3>
            <p className="text-sm text-gray-600">Or enter credentials manually</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-700 text-sm font-medium">
                    {errors.root.message}
                  </p>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Username atau Email
              </label>
              <input
                {...register('username', {
                  required: 'Username atau email wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Username minimal 3 karakter'
                  }
                })}
                type="text"
                id="username"
                placeholder="Masukkan username atau email"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                disabled={loginMutation.isPending}
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.username.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password wajib diisi',
                    minLength: {
                      value: 6,
                      message: 'Password minimal 6 karakter'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Masukkan password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loginMutation.isPending}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>❌</span>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loginMutation.isPending}
                />
                <span className="text-sm text-gray-700">Ingat saya</span>
              </label>
              
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                disabled={loginMutation.isPending}
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}