'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ringkasan Pengeluaran</h3>
            <p className="text-sm text-gray-600">Distribusi pengeluaran per kategori</p>
          </div>
        </div>
        
        <button
          onClick={toggleCollapse}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <span className="text-sm font-medium text-gray-700">
            {isCollapsed ? 'Tampilkan Detail' : 'Sembunyikan Detail'}
          </span>
          <span className={`text-gray-500 transition-transform duration-300 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}>
            ▼
          </span>
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-2">
              <div className="h-64 sm:h-80">
                <Pie ref={chartRef} data={data} options={options} />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">📋</span>
                <h4 className="text-lg font-semibold text-gray-900">Detail per Kategori</h4>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(categoryTotals)
                  .sort(([,a], [,b]) => b - a) // Sort by amount descending
                  .map(([category, amount]) => {
                    const percentage = ((amount / totalAmount) * 100).toFixed(1);
                    const label = categoryLabels[category] || category;
                    const icon = categoryIcons[category] || categoryIcons.other;
                    const color = categoryColors[category] || categoryColors.other;
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
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
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-lg">🏷️</span>
                <p className="text-sm font-medium text-purple-600">Total Kategori</p>
              </div>
              <p className="text-xl font-bold text-purple-700">{Object.keys(categoryTotals).length}</p>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-lg">📝</span>
                <p className="text-sm font-medium text-blue-600">Total Transaksi</p>
              </div>
              <p className="text-xl font-bold text-blue-700">{expenses.length}</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-lg">🏆</span>
                <p className="text-sm font-medium text-green-600">Kategori Terbesar</p>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm">{categoryIcons[highestCategory[0]]}</span>
                <p className="text-sm font-bold text-green-700">
                  {categoryLabels[highestCategory[0]] || highestCategory[0]}
                </p>
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="text-lg">📊</span>
                <p className="text-sm font-medium text-orange-600">Rata-rata per Kategori</p>
              </div>
              <p className="text-sm font-bold text-orange-700">
                {formatCurrency(totalAmount / Object.keys(categoryTotals).length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Always Visible Summary (when collapsed) */}
      {isCollapsed && (
        <div className="px-4 sm:px-6 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Kategori</p>
              <p className="text-lg font-bold text-purple-600">{Object.keys(categoryTotals).length}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Transaksi</p>
              <p className="text-lg font-bold text-blue-600">{expenses.length}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-sm font-bold text-red-600">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Terbesar</p>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-xs">{categoryIcons[highestCategory[0]]}</span>
                <p className="text-xs font-bold text-green-600">
                  {(categoryLabels[highestCategory[0]] || highestCategory[0]).substring(0, 8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}