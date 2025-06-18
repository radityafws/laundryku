import { useQuery } from '@tanstack/react-query';

// Report interfaces
export interface ReportSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
  revenueTrend: number;
  expensesTrend: number;
  profitTrend: number;
  ordersTrend: number;
}

export interface ProfitLossData {
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

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  notes?: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  expenses: number;
  profit: number;
}

export interface ComparisonPeriod {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
}

export interface ReportsData {
  summary: ReportSummary;
  profitLoss: ProfitLossData;
  transactions: Transaction[];
  chartData: ChartDataPoint[];
  comparisonData: {
    current: ComparisonPeriod;
    previous: ComparisonPeriod;
  };
}

interface UseReportsDataParams {
  reportType: 'daily' | 'monthly' | 'yearly';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  hideYearlyExpenses?: boolean;
}

// Mock data generator
const generateMockReportsData = (params: UseReportsDataParams): ReportsData => {
  const { reportType, dateRange, hideYearlyExpenses } = params;
  
  // Generate mock transactions
  const transactions: Transaction[] = [
    // Income transactions
    {
      id: '1',
      date: '2025-01-20',
      type: 'income',
      category: 'Laundry Reguler',
      description: 'Pesanan laundry reguler - INV001',
      amount: 45000
    },
    {
      id: '2',
      date: '2025-01-20',
      type: 'income',
      category: 'Laundry Express',
      description: 'Pesanan laundry express - INV002',
      amount: 75000
    },
    {
      id: '3',
      date: '2025-01-19',
      type: 'income',
      category: 'Laundry Reguler',
      description: 'Pesanan laundry reguler - INV003',
      amount: 32000
    },
    {
      id: '4',
      date: '2025-01-19',
      type: 'income',
      category: 'Laundry Express',
      description: 'Pesanan laundry express - INV004',
      amount: 85000
    },
    {
      id: '5',
      date: '2025-01-18',
      type: 'income',
      category: 'Laundry Reguler',
      description: 'Pesanan laundry reguler - INV005',
      amount: 28000
    },
    // Expense transactions
    {
      id: '6',
      date: '2025-01-20',
      type: 'expense',
      category: 'Listrik',
      description: 'Tagihan listrik bulan Januari',
      amount: 850000
    },
    {
      id: '7',
      date: '2025-01-19',
      type: 'expense',
      category: 'Detergen',
      description: 'Pembelian detergen dan pelembut',
      amount: 450000
    },
    {
      id: '8',
      date: '2025-01-18',
      type: 'expense',
      category: 'Gaji',
      description: 'Gaji karyawan minggu ke-3',
      amount: 1200000
    },
    {
      id: '9',
      date: '2025-01-17',
      type: 'expense',
      category: 'Air',
      description: 'Tagihan air PDAM',
      amount: 275000
    },
    {
      id: '10',
      date: '2025-01-16',
      type: 'expense',
      category: 'Perawatan',
      description: 'Service mesin cuci unit 2',
      amount: 350000
    },
    // Add yearly expenses if not hidden
    ...(hideYearlyExpenses ? [] : [
      {
        id: '11',
        date: '2025-01-15',
        type: 'expense' as const,
        category: 'Sewa',
        description: 'Sewa gedung tahunan 2025',
        amount: 24000000
      },
      {
        id: '12',
        date: '2025-01-15',
        type: 'expense' as const,
        category: 'Asuransi',
        description: 'Asuransi bisnis tahunan',
        amount: 3600000
      }
    ])
  ];

  // Calculate totals
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const totalOrders = transactions.filter(t => t.type === 'income').length;

  // Generate chart data
  const chartData: ChartDataPoint[] = [
    { date: '2025-01-14', revenue: 180000, orders: 8, expenses: 320000, profit: -140000 },
    { date: '2025-01-15', revenue: 220000, orders: 12, expenses: hideYearlyExpenses ? 280000 : 28000000, profit: hideYearlyExpenses ? -60000 : -27780000 },
    { date: '2025-01-16', revenue: 195000, orders: 9, expenses: 450000, profit: -255000 },
    { date: '2025-01-17', revenue: 285000, orders: 15, expenses: 375000, profit: -90000 },
    { date: '2025-01-18', revenue: 260000, orders: 11, expenses: 1300000, profit: -1040000 },
    { date: '2025-01-19', revenue: 315000, orders: 18, expenses: 520000, profit: -205000 },
    { date: '2025-01-20', revenue: 285000, orders: 14, expenses: 920000, profit: -635000 }
  ];

  return {
    summary: {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalOrders,
      revenueTrend: 12.5,
      expensesTrend: hideYearlyExpenses ? 8.3 : 45.2,
      profitTrend: hideYearlyExpenses ? 15.7 : -85.4,
      ordersTrend: 18.2
    },
    profitLoss: {
      revenue: {
        laundry: totalRevenue * 0.7,
        express: totalRevenue * 0.25,
        other: totalRevenue * 0.05,
        total: totalRevenue
      },
      expenses: {
        operational: hideYearlyExpenses ? 1200000 : 1200000,
        salary: 1200000,
        rent: hideYearlyExpenses ? 0 : 24000000,
        utilities: 1125000,
        maintenance: 350000,
        other: hideYearlyExpenses ? 450000 : 4050000,
        total: totalExpenses
      },
      netProfit,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    },
    transactions,
    chartData,
    comparisonData: {
      current: {
        label: 'Periode Saat Ini',
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: netProfit,
        orders: totalOrders
      },
      previous: {
        label: 'Periode Sebelumnya',
        revenue: totalRevenue * 0.85,
        expenses: totalExpenses * 0.92,
        profit: (totalRevenue * 0.85) - (totalExpenses * 0.92),
        orders: Math.floor(totalOrders * 0.88)
      }
    }
  };
};

// Fetch reports data function
const fetchReportsData = async (params: UseReportsDataParams): Promise<ReportsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call
  // const response = await api.get('/reports', { params });
  // return response.data;
  
  return generateMockReportsData(params);
};

// Custom hook for reports data
export const useReportsData = (params: UseReportsDataParams) => {
  return useQuery<ReportsData>({
    queryKey: ['reports', params],
    queryFn: () => fetchReportsData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};