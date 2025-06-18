import api from './api';

// Dashboard Statistics Interface
export interface DashboardStats {
  totalOrdersToday: number;
  completedOrders: number;
  inProgressOrders: number;
  estimatedRevenueToday: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
  completionRate: number;
}

// Chart Data Interfaces
export interface ChartDataPoint {
  date: string;
  orders: number;
  revenue: number;
}

export interface DashboardChartData {
  labels: string[];
  orderData: number[];
  revenueData: number[];
}

// Mock data for demonstration
const mockStats: DashboardStats = {
  totalOrdersToday: 24,
  completedOrders: 18,
  inProgressOrders: 12,
  estimatedRevenueToday: 285000,
  totalRevenue: 12500000,
  totalCustomers: 1250,
  averageOrderValue: 35000,
  completionRate: 92.5
};

const mockChartData: ChartDataPoint[] = [
  { date: '2025-01-14', orders: 18, revenue: 220000 },
  { date: '2025-01-15', orders: 22, revenue: 285000 },
  { date: '2025-01-16', orders: 15, revenue: 195000 },
  { date: '2025-01-17', orders: 28, revenue: 340000 },
  { date: '2025-01-18', orders: 20, revenue: 260000 },
  { date: '2025-01-19', orders: 25, revenue: 315000 },
  { date: '2025-01-20', orders: 24, revenue: 285000 }
];

// Fetch dashboard statistics
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStats;
  }
};

// Fetch chart data for the last 7 days
export const fetchChartData = async (): Promise<DashboardChartData> => {
  try {
    const response = await api.get('/dashboard/chart-data');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Transform mock data for chart
    const labels = mockChartData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('id-ID', { 
        weekday: 'short', 
        day: 'numeric',
        month: 'short'
      });
    });
    
    return {
      labels,
      orderData: mockChartData.map(item => item.orders),
      revenueData: mockChartData.map(item => item.revenue)
    };
  }
};

// Employee Management Interface
export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'driver';
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  salary: number;
}

// Expense Management Interface
export interface Expense {
  id: string;
  category: 'supplies' | 'utilities' | 'maintenance' | 'salary' | 'other';
  description: string;
  amount: number;
  date: string;
  receipt?: string;
}

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ahmad Santoso',
    role: 'admin',
    email: 'ahmad@laundrykilat.id',
    phone: '081234567890',
    status: 'active',
    joinDate: '2023-01-15',
    salary: 4500000
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    role: 'staff',
    email: 'siti@laundrykilat.id',
    phone: '081234567891',
    status: 'active',
    joinDate: '2023-03-20',
    salary: 3200000
  },
  {
    id: '3',
    name: 'Budi Prasetyo',
    role: 'driver',
    email: 'budi@laundrykilat.id',
    phone: '081234567892',
    status: 'active',
    joinDate: '2023-06-10',
    salary: 2800000
  }
];

// Mock expenses data
const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'supplies',
    description: 'Deterjen dan pelembut pakaian',
    amount: 450000,
    date: '2025-01-20'
  },
  {
    id: '2',
    category: 'utilities',
    description: 'Tagihan listrik bulan Januari',
    amount: 850000,
    date: '2025-01-19'
  },
  {
    id: '3',
    category: 'maintenance',
    description: 'Service mesin cuci unit 2',
    amount: 350000,
    date: '2025-01-18'
  }
];

// Fetch employees
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get('/dashboard/employees');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockEmployees;
  }
};

// Fetch expenses
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/dashboard/expenses');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockExpenses;
  }
};