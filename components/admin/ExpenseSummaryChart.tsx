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

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
}

interface ExpenseSummaryChartProps {
  expenses: Expense[];
  isLoading?: boolean;
}

const categoryLabels: { [key: string]: string } = {
  electricity: 'Listrik',
  water: 'Air',
  detergent: 'Detergen',
  salary: 'Gaji',
  rent: 'Sewa',
  maintenance: 'Perawatan',
  other: 'Lainnya'
};

const categoryColors: { [key: string]: string } = {
  electricity: 'rgba(255, 193, 7, 0.8)',
  water: 'rgba(54, 162, 235, 0.8)',
  detergent: 'rgba(75, 192, 192, 0.8)',
  salary: 'rgba(255, 99, 132, 0.8)',
  rent: 'rgba(153, 102, 255, 0.8)',
  maintenance: 'rgba(255, 159, 64, 0.8)',
  other: 'rgba(201, 203, 207, 0.8)'
};

export default function ExpenseSummaryChart({ 
  expenses, 
  isLoading = false 
}: ExpenseSummaryChartProps) {
  const chartRef = useRef<ChartJS>(null);

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const labels = Object.keys(categoryTotals).map(category => 
    categoryLabels[category] || category
  );
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Pengeluaran (Rp)',
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(category => 
          categoryColors[category] || categoryColors.other
        ),
        borderColor: Object.keys(categoryTotals).map(category => 
          categoryColors[category]?.replace('0.8', '1') || categoryColors.other.replace('0.8', '1')
        ),
        borderWidth: 2,
        borderRadius: 8,
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
        text: 'Ringkasan Pengeluaran per Kategori',
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
        display: false, // Hide legend since we have category labels on x-axis
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `Total: Rp ${value.toLocaleString('id-ID')}`;
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
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6b7280',
          callback: function(value) {
            return 'Rp ' + (value as number).toLocaleString('id-ID');
          }
        },
        title: {
          display: true,
          text: 'Nominal (Rp)',
          font: {
            size: 11,
            weight: 'bold',
          },
          color: '#9333ea',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 sm:h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Data untuk Grafik
          </h3>
          <p className="text-gray-600">
            Tambahkan pengeluaran untuk melihat ringkasan dalam bentuk grafik.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="h-64 sm:h-80">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Kategori</p>
          <p className="text-lg font-bold text-purple-600">{Object.keys(categoryTotals).length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Transaksi</p>
          <p className="text-lg font-bold text-blue-600">{expenses.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Rata-rata</p>
          <p className="text-lg font-bold text-green-600">
            Rp {Math.round(Object.values(categoryTotals).reduce((a, b) => a + b, 0) / expenses.length).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Terbesar</p>
          <p className="text-lg font-bold text-red-600">
            Rp {Math.max(...Object.values(categoryTotals)).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}