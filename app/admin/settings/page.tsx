'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout title="Pengaturan Sistem" subtitle="System configuration and settings">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pengaturan Sistem
          </h2>
          <p className="text-gray-600 mb-6">
            Fitur pengaturan sistem sedang dalam tahap pengembangan dan akan segera tersedia.
          </p>
          
          <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 max-w-md mx-auto">
            <h3 className="font-semibold text-orange-800 mb-3">🔧 Fitur yang Akan Datang:</h3>
            <ul className="text-sm text-orange-700 space-y-1 text-left">
              <li>• Pengaturan harga layanan</li>
              <li>• Konfigurasi notifikasi</li>
              <li>• Manajemen template pesan</li>
              <li>• Backup & restore data</li>
              <li>• Pengaturan jam operasional</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}