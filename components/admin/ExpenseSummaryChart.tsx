'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
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
  electricity: '#fbbf24',
  water: '#3b82f6',
  detergent: '#10b981',
  salary: '#ef4444',
  rent: '#8b5cf6',
  maintenance: '#f97316',
  other: '#6b7280'
};

const categoryIcons: { [key: string]: string } = {
  electricity: '⚡',
  water: '💧',
  detergent: '🧴',
  salary: '💰',
  rent: '🏠',
  maintenance: '🔧',
  other: '📝'
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
        label: 'Pengeluaran',
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(category => 
          categoryColors[category] || categoryColors.other
        ),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Distribusi Pengeluaran per Kategori',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 20
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i] as number;
                const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor?.[i] as string,
                  strokeStyle: dataset.backgroundColor?.[i] as string,
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        },
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
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `Nominal: Rp ${value.toLocaleString('id-ID')}`,
              `Persentase: ${percentage}%`
            ];
          }
        }
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mb-4 mx-auto"></div>
          <div className="h-64 sm:h-80 bg-gray-200 rounded-full mx-auto max-w-sm"></div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
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
            Tambahkan pengeluaran untuk melihat distribusi dalam bentuk pie chart.
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const highestCategory = Object.entries(categoryTotals).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2">
          <div className="h-64 sm:h-80">
            <Pie ref={chartRef} data={data} options={options} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Detail per Kategori</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a) // Sort by amount descending
              .map(([category, amount]) => {
                const percentage = ((amount / totalAmount) * 100).toFixed(1);
                const label = categoryLabels[category] || category;
                const icon = categoryIcons[category] || categoryIcons.other;
                const color = categoryColors[category] || categoryColors.other;
                
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-600">{percentage}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Kategori</p>
          <p className="text-lg font-bold text-purple-600">{Object.keys(categoryTotals).length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Transaksi</p>
          <p className="text-lg font-bold text-blue-600">{expenses.length}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Kategori Terbesar</p>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-sm">{categoryIcons[highestCategory[0]]}</span>
            <p className="text-sm font-bold text-green-600">
              {categoryLabels[highestCategory[0]] || highestCategory[0]}
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Rata-rata per Kategori</p>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(totalAmount / Object.keys(categoryTotals).length)}
          </p>
        </div>
      </div>
    </div>
  );
}