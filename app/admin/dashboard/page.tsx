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
        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Chart Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <DashboardChart
              labels={chartData?.labels || []}
              orderData={chartData?.orderData || []}
              revenueData={chartData?.revenueData || []}
              isLoading={chartLoading}
            />
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <StatsCard
              icon="👥"
              title="Total Pelanggan"
              value={stats ? formatNumber(stats.totalCustomers) : 0}
              subtitle="terdaftar"
              color="indigo"
              isLoading={statsLoading}
            />
            
            <StatsCard
              icon="📊"
              title="Rata-rata Nilai Pesanan"
              value={stats ? formatCurrency(stats.averageOrderValue) : 'Rp 0'}
              color="green"
              isLoading={statsLoading}
            />
            
            <StatsCard
              icon="🎯"
              title="Tingkat Penyelesaian"
              value={stats ? `${stats.completionRate}%` : '0%'}
              subtitle="success rate"
              trend={{ value: 2, isPositive: true }}
              color="blue"
              isLoading={statsLoading}
            />
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">📋 Pesanan Terbaru</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Lihat Semua →
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'INV123456', customer: 'Budi Santoso', status: 'Siap Diambil', amount: 'Rp 45.000' },
                { id: 'INV123457', customer: 'Siti Aminah', status: 'Dalam Proses', amount: 'Rp 32.000' },
                { id: 'INV123458', customer: 'Ahmad Rahman', status: 'Baru Masuk', amount: 'Rp 58.000' },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Siap Diambil' ? 'bg-green-100 text-green-700' :
                      order.status === 'Dalam Proses' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">⚡ Aksi Cepat</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl mb-2">➕</div>
                <p className="text-sm font-semibold text-blue-700">Tambah Pesanan</p>
              </button>
              
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-sm font-semibold text-green-700">Kirim Notifikasi</p>
              </button>
              
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-semibold text-purple-700">Lihat Laporan</p>
              </button>
              
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-semibold text-orange-700">Pengaturan</p>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📈 Metrik Performa</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="text-2xl font-bold text-blue-600">2.5</p>
              <p className="text-sm text-blue-700">Hari Rata-rata</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl mb-2">😊</div>
              <p className="text-2xl font-bold text-green-600">4.8</p>
              <p className="text-sm text-green-700">Rating Pelanggan</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-purple-700">Pelanggan Kembali</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-2xl font-bold text-orange-600">95%</p>
              <p className="text-sm text-orange-700">Notifikasi Terkirim</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}