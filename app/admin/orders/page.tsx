'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';

export default function OrdersPage() {
  return (
    <DashboardLayout title="Daftar Pesanan" subtitle="Manage all laundry orders">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Halaman Dalam Pengembangan
          </h2>
          <p className="text-gray-600 mb-6">
            Fitur manajemen pesanan sedang dalam tahap pengembangan dan akan segera tersedia.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 max-w-md mx-auto">
            <h3 className="font-semibold text-blue-800 mb-3">✨ Fitur yang Akan Datang:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Daftar semua pesanan laundry</li>
              <li>• Filter berdasarkan status</li>
              <li>• Update status pesanan</li>
              <li>• Print invoice dan label</li>
              <li>• Pencarian pesanan</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}