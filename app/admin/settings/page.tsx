'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import SystemNotificationSettings from '@/components/admin/settings/SystemNotificationSettings';
import SystemBackupRestore from '@/components/admin/settings/SystemBackupRestore';
import OrderStatusManager from '@/components/admin/settings/OrderStatusManager';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'backup' | 'orderStatus'>('notifications');

  const tabs = [
    {
      id: 'notifications',
      label: 'Notifikasi',
      icon: '📱',
      description: 'Konfigurasi WhatsApp'
    },
    {
      id: 'backup',
      label: 'Backup & Restore',
      icon: '💾',
      description: 'Manajemen Data'
    },
    {
      id: 'orderStatus',
      label: 'Status Pesanan',
      icon: '📦',
      description: 'Konfigurasi Status'
    }
  ];

  return (
    <DashboardLayout title="Pengaturan Sistem" subtitle="Konfigurasi sistem dan manajemen data">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">⚙️ Pengaturan Sistem</h2>
              <p className="text-gray-600">Kelola konfigurasi sistem dan backup data</p>
            </div>
          </div>

          <div className="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'notifications' | 'backup' | 'orderStatus')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'notifications' && <SystemNotificationSettings />}
        {activeTab === 'backup' && <SystemBackupRestore />}
        {activeTab === 'orderStatus' && <OrderStatusManager />}
      </div>
    </DashboardLayout>
  );
}