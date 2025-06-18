import { useQuery } from '@tanstack/react-query';
import { 
  fetchDashboardStats, 
  fetchChartData, 
  fetchEmployees, 
  fetchExpenses,
  DashboardStats,
  DashboardChartData,
  Employee,
  Expense
} from '@/lib/dashboard-api';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

export const useDashboardChartData = () => {
  return useQuery<DashboardChartData>({
    queryKey: ['dashboard-chart'],
    queryFn: fetchChartData,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useExpenses = () => {
  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};