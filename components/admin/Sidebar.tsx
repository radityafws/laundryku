'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    icon: '🏠',
    label: 'Dashboard',
    href: '/admin/dashboard',
    description: 'Overview & Statistics'
  },
  {
    icon: '🧾',
    label: 'Daftar Pesanan',
    href: '/admin/orders',
    description: 'Manage Orders',
    badge: '12'
  },
  {
    icon: '💸',
    label: 'Manajemen Pengeluaran',
    href: '/admin/expenses',
    description: 'Track Expenses'
  },
  {
    icon: '👥',
    label: 'Manajemen Pegawai',
    href: '/admin/employees',
    description: 'Staff Management'
  },
  {
    icon: '📊',
    label: 'Laporan Keuangan',
    href: '/admin/reports',
    description: 'Financial Reports'
  },
  {
    icon: '⚙️',
    label: 'Pengaturan Sistem',
    href: '/admin/settings',
    description: 'System Settings'
  }
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-80'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">🧺</span>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="text-xl font-bold text-gray-800">LaundryKilat</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
          
          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">{isCollapsed ? '→' : '←'}</span>
          </button>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={index}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-700' 
                    : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 flex-shrink-0
                  ${isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }
                `}>
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold truncate ${
                        isActive ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </h3>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                    {item.badge && (
                      <div className="text-xs bg-red-500 px-1 rounded mt-1 inline-block">
                        {item.badge} new
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Tips</h4>
                  <p className="text-xs text-gray-600">
                    Gunakan shortcut Ctrl+K untuk pencarian cepat
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}