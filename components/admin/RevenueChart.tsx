'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  expenses: number;
  profit: number;
}

interface RevenueChartProps {
  data?: ChartDataPoint[];
  isLoading?: boolean;
  reportType: 'daily' | 'monthly' | 'yearly';
}

export default function RevenueChart({ 
  data, 
  isLoading = false,
  reportType 
}: RevenueChartProps) {
  const chartRef = useRef<ChartJS>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (reportType) {
      case 'daily':
        return date.toLocaleDateString('id-ID', { 
          day: '2-digit',
          month: 'short'
        });
      case 'monthly':
        return date.toLocaleDateString('id-ID', { 
          month: 'short',
          year: '2-digit'
        });
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return dateStr;
    }
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
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Pendapatan',
        data: data.map(item => item.revenue),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Jumlah Pesanan',
        data: data.map(item => item.orders),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Tren Pendapatan & Pesanan (${reportType === 'daily' ? 'Harian' : reportType === 'monthly' ? 'Bulanan' : 'Tahunan'})`,
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
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('Pendapatan')) {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value} pesanan`;
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
          maxRotation: 45,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Pendapatan (Rp)',
          font: {
            size: 11,
            weight: 'bold',
          },
          color: '#22c55e',
        },
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
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Jumlah Pesanan',
          font: {
            size: 11,
            weight: 'bold',
          },
          color: '#3b82f6',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6b7280',
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="h-64 sm:h-80">
        <Chart ref={chartRef} type="bar" data={chartData} options={options} />
      </div>
    </div>
  );
}