'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ 
  children, 
  title = 'Dashboard',
  subtitle = 'Overview & Statistics'
}: DashboardLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar collapsed state to localStorage
  const handleToggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'xl:ml-20' : 'xl:ml-80'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">☰</span>
                </button>

                {/* Desktop collapse button */}
                <button
                  onClick={handleToggleCollapse}
                  className="hidden xl:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  <span className="text-lg">{sidebarCollapsed ? '→' : '←'}</span>
                </button>

                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">{subtitle}</p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search */}
                <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-600">
                  <span>🔍</span>
                  <span>Search...</span>
                  <span className="text-xs bg-gray-300 px-1 rounded">Ctrl+K</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-lg sm:text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm"
                  >
                    {logoutMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Keluar...</span>
                      </>
                    ) : (
                      <>
                        <span>🚪</span>
                        <span className="hidden sm:inline">Logout</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}