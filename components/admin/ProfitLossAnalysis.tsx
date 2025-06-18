'use client';

import { useState } from 'react';

interface ProfitLossData {
  revenue: {
    laundry: number;
    express: number;
    other: number;
    total: number;
  };
  expenses: {
    operational: number;
    salary: number;
    rent: number;
    utilities: number;
    maintenance: number;
    other: number;
    total: number;
  };
  netProfit: number;
  profitMargin: number;
}

interface ProfitLossAnalysisProps {
  data?: ProfitLossData;
  isLoading?: boolean;
  hideYearlyExpenses?: boolean;
}

export default function ProfitLossAnalysis({ 
  data, 
  isLoading = false,
  hideYearlyExpenses = false 
}: ProfitLossAnalysisProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Data Tidak Tersedia
          </h3>
          <p className="text-gray-600">
            Pilih periode untuk melihat analisis laba rugi.
          </p>
        </div>
      </div>
    );
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💸</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Analisis Laba Rugi</h3>
            <p className="text-sm text-gray-600">Perhitungan pendapatan, pengeluaran, dan profit bersih</p>
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

      {/* Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
      }`}>
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profit & Loss Statement */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>📋</span>
                <span>Laporan Laba Rugi</span>
              </h4>
              
              <div className="space-y-4">
                {/* Revenue Section */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h5 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                    <span>💰</span>
                    <span>Pendapatan</span>
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Laundry Reguler</span>
                      <span className="font-medium text-green-800">{formatCurrency(data.revenue.laundry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Laundry Express</span>
                      <span className="font-medium text-green-800">{formatCurrency(data.revenue.express)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Lainnya</span>
                      <span className="font-medium text-green-800">{formatCurrency(data.revenue.other)}</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-green-800">Total Pendapatan</span>
                        <span className="text-green-800">{formatCurrency(data.revenue.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h5 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
                    <span>💸</span>
                    <span>Pengeluaran</span>
                    {hideYearlyExpenses && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Tanpa Tahunan
                      </span>
                    )}
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700">Operasional</span>
                      <span className="font-medium text-red-800">{formatCurrency(data.expenses.operational)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Gaji Karyawan</span>
                      <span className="font-medium text-red-800">{formatCurrency(data.expenses.salary)}</span>
                    </div>
                    {(!hideYearlyExpenses && data.expenses.rent > 0) && (
                      <div className="flex justify-between">
                        <span className="text-red-700">Sewa</span>
                        <span className="font-medium text-red-800">{formatCurrency(data.expenses.rent)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-red-700">Utilitas (Listrik, Air)</span>
                      <span className="font-medium text-red-800">{formatCurrency(data.expenses.utilities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Perawatan</span>
                      <span className="font-medium text-red-800">{formatCurrency(data.expenses.maintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Lainnya</span>
                      <span className="font-medium text-red-800">{formatCurrency(data.expenses.other)}</span>
                    </div>
                    <div className="border-t border-red-300 pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="text-red-800">Total Pengeluaran</span>
                        <span className="text-red-800">({formatCurrency(data.expenses.total)})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className={`border-2 rounded-xl p-4 ${
                  data.netProfit >= 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <h5 className={`font-bold text-lg flex items-center space-x-2 ${
                      data.netProfit >= 0 ? 'text-green-800' : 'text-red-800'
                    }`}>
                      <span>{data.netProfit >= 0 ? '📈' : '📉'}</span>
                      <span>Laba Bersih</span>
                    </h5>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        data.netProfit >= 0 ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {formatCurrency(data.netProfit)}
                      </div>
                      <div className={`text-sm ${
                        data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Margin: {formatPercentage(data.profitMargin)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Analysis */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>📊</span>
                <span>Analisis Visual</span>
              </h4>

              {/* Revenue Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-800 mb-4">Komposisi Pendapatan</h5>
                <div className="space-y-3">
                  {[
                    { label: 'Laundry Reguler', value: data.revenue.laundry, color: 'bg-blue-500' },
                    { label: 'Laundry Express', value: data.revenue.express, color: 'bg-green-500' },
                    { label: 'Lainnya', value: data.revenue.other, color: 'bg-purple-500' }
                  ].map((item) => {
                    const percentage = data.revenue.total > 0 ? (item.value / data.revenue.total) * 100 : 0;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.label}</span>
                          <span className="font-medium">{formatPercentage(percentage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-semibold text-gray-800 mb-4">Komposisi Pengeluaran</h5>
                <div className="space-y-3">
                  {[
                    { label: 'Operasional', value: data.expenses.operational, color: 'bg-red-400' },
                    { label: 'Gaji', value: data.expenses.salary, color: 'bg-orange-400' },
                    ...((!hideYearlyExpenses && data.expenses.rent > 0) ? [{ label: 'Sewa', value: data.expenses.rent, color: 'bg-yellow-400' }] : []),
                    { label: 'Utilitas', value: data.expenses.utilities, color: 'bg-pink-400' },
                    { label: 'Perawatan', value: data.expenses.maintenance, color: 'bg-indigo-400' },
                    { label: 'Lainnya', value: data.expenses.other, color: 'bg-gray-400' }
                  ].map((item) => {
                    const percentage = data.expenses.total > 0 ? (item.value / data.expenses.total) * 100 : 0;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.label}</span>
                          <span className="font-medium">{formatPercentage(percentage)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-xs text-blue-600 mb-1">Margin Keuntungan</div>
                  <div className={`text-lg font-bold ${
                    data.profitMargin >= 0 ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    {formatPercentage(data.profitMargin)}
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs text-purple-600 mb-1">Rasio Pengeluaran</div>
                  <div className="text-lg font-bold text-purple-700">
                    {data.revenue.total > 0 ? formatPercentage((data.expenses.total / data.revenue.total) * 100) : '0%'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Always Visible Summary (when collapsed) */}
      {isCollapsed && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600">Pendapatan</p>
              <p className="text-sm font-bold text-green-700">{formatCurrency(data.revenue.total)}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600">Pengeluaran</p>
              <p className="text-sm font-bold text-red-700">{formatCurrency(data.expenses.total)}</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              data.netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <p className={`text-xs ${data.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Laba Bersih
              </p>
              <p className={`text-sm font-bold ${
                data.netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {formatCurrency(data.netProfit)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}