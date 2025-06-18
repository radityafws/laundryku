'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';

export default function ReportsPage() {
  return (
    <DashboardLayout title="Laporan Keuangan" subtitle="Financial reports and analytics">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Laporan Keuangan
          </h2>
          <p className="text-gray-600 mb-6">
            Fitur laporan keuangan sedang dalam tahap pengembangan dan akan segera tersedia.
          </p>
          
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 max-w-md mx-auto">
            <h3 className="font-semibold text-purple-800 mb-3">📈 Fitur yang Akan Datang:</h3>
            <ul className="text-sm text-purple-700 space-y-1 text-left">
              <li>• Laporan pendapatan harian/bulanan</li>
              <li>• Analisis profit & loss</li>
              <li>• Grafik tren penjualan</li>
              <li>• Export laporan ke PDF/Excel</li>
              <li>• Perbandingan periode</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}