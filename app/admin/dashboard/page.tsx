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
        <div className="grid grid-cols-1">
          {/* Main Chart */}
          <div className="col-span-1">
            <DashboardChart
              labels={chartData?.labels || []}
              orderData={chartData?.orderData || []}
              revenueData={chartData?.revenueData || []}
              isLoading={chartLoading}
            />
          </div>
         </div>
        
      </div>
    </DashboardLayout>
  );
}