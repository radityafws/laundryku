'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import StatsCard from '@/components/admin/StatsCard';
import DashboardChart from '@/components/admin/DashboardChart';
import { useDashboardStats, useDashboardChartData } from '@/hooks/useDashboard';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: chartData, isLoading: chartLoading } = useDashboardChartData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview & Statistics">
      <div className="space-y-8">
        {/* Main Statistics - Better Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard
            icon="📦"
            title="Total Pesanan Hari Ini"
            value={stats ? formatNumber(stats.totalOrdersToday) : 0}
            subtitle="pesanan"
            trend={{ value: 12, isPositive: true }}
            color="blue"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="✅"
            title="Laundry Selesai"
            value={stats ? formatNumber(stats.completedOrders) : 0}
            subtitle="siap diambil"
            trend={{ value: 8, isPositive: true }}
            color="green"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="🕓"
            title="Masih Diproses"
            value={stats ? formatNumber(stats.inProgressOrders) : 0}
            subtitle="dalam antrian"
            color="yellow"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="💰"
            title="Estimasi Pendapatan Hari Ini"
            value={stats ? formatCurrency(stats.estimatedRevenueToday) : 'Rp 0'}
            trend={{ value: 15, isPositive: true }}
            color="purple"
            isLoading={statsLoading}
          />
        </div>

        {/* Secondary Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard
            icon="👥"
            title="Total Pelanggan"
            value={stats ? formatNumber(stats.totalCustomers) : 0}
            subtitle="pelanggan"
            color="indigo"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="💎"
            title="Rata-rata Order"
            value={stats ? formatCurrency(stats.averageOrderValue) : 'Rp 0'}
            subtitle="per pesanan"
            color="purple"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="📈"
            title="Total Pendapatan"
            value={stats ? formatCurrency(stats.totalRevenue) : 'Rp 0'}
            subtitle="keseluruhan"
            color="green"
            isLoading={statsLoading}
          />
          
          <StatsCard
            icon="⚡"
            title="Tingkat Penyelesaian"
            value={stats ? `${stats.completionRate}%` : '0%'}
            subtitle="success rate"
            trend={{ value: 2.5, isPositive: true }}
            color="blue"
            isLoading={statsLoading}
          />
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1">
          <DashboardChart
            labels={chartData?.labels || []}
            orderData={chartData?.orderData || []}
            revenueData={chartData?.revenueData || []}
            isLoading={chartLoading}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧾</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Pesanan Baru</h3>
                <p className="text-sm text-gray-600">Kelola pesanan masuk</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Lihat
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Laporan Harian</h3>
                <p className="text-sm text-gray-600">Lihat performa hari ini</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Buat
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Pengaturan</h3>
                <p className="text-sm text-gray-600">Konfigurasi sistem</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Atur
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}