'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonPeriod {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
}

interface ComparisonData {
  current: ComparisonPeriod;
  previous: ComparisonPeriod;
}

interface ComparisonChartProps {
  data?: ComparisonData;
  isLoading?: boolean;
  reportType: 'daily' | 'monthly' | 'yearly';
}

export default function ComparisonChart({ 
  data, 
  isLoading = false,
  reportType 
}: ComparisonChartProps) {
  const chartRef = useRef<ChartJS>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading || !data) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 sm:h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Pendapatan', 'Pengeluaran', 'Profit', 'Pesanan'],
    datasets: [
      {
        label: data.current.label,
        data: [
          data.current.revenue,
          data.current.expenses,
          data.current.profit,
          data.current.orders * 10000 // Scale orders for visibility
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          data.current.profit >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(245, 101, 101, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          data.current.profit >= 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(245, 101, 101, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: data.previous.label,
        data: [
          data.previous.revenue,
          data.previous.expenses,
          data.previous.profit,
          data.previous.orders * 10000 // Scale orders for visibility
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.4)',
          'rgba(239, 68, 68, 0.4)',
          data.previous.profit >= 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 101, 101, 0.4)',
          'rgba(168, 85, 247, 0.4)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          data.previous.profit >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(245, 101, 101, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Perbandingan Periode (${reportType === 'daily' ? 'Harian' : reportType === 'monthly' ? 'Bulanan' : 'Tahunan'})`,
        font: {
          size: 14,
          weight: 'bold',
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 20
        },
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const dataIndex = context.dataIndex;
            
            if (dataIndex === 3) { // Orders
              return `${label}: ${Math.round(value / 10000)} pesanan`;
            }
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
            weight: '500',
          },
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6b7280',
          callback: function(value) {
            return formatCurrency(value as number);
          }
        },
      },
    },
  };

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const revenueChange = calculateChange(data.current.revenue, data.previous.revenue);
  const expensesChange = calculateChange(data.current.expenses, data.previous.expenses);
  const profitChange = calculateChange(data.current.profit, data.previous.profit);
  const ordersChange = calculateChange(data.current.orders, data.previous.orders);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="h-64 sm:h-80 mb-6">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
      
      {/* Comparison Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Pendapatan</div>
          <div className={`text-sm font-bold ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {revenueChange >= 0 ? '↗️' : '↘️'} {Math.abs(revenueChange).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Pengeluaran</div>
          <div className={`text-sm font-bold ${expensesChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {expensesChange <= 0 ? '↘️' : '↗️'} {Math.abs(expensesChange).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Profit</div>
          <div className={`text-sm font-bold ${profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitChange >= 0 ? '↗️' : '↘️'} {Math.abs(profitChange).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">Pesanan</div>
          <div className={`text-sm font-bold ${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {ordersChange >= 0 ? '↗️' : '↘️'} {Math.abs(ordersChange).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}