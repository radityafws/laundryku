import { useQuery } from '@tanstack/react-query';

// Employee interface
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
  },
  {
    id: '4',
    name: 'Dewi Sartika',
    role: 'staff',
    email: 'dewi@laundrykilat.id',
    phone: '081234567893',
    status: 'active',
    joinDate: '2023-08-05',
    salary: 3000000
  },
  {
    id: '5',
    name: 'Eko Wijaya',
    role: 'driver',
    email: 'eko@laundrykilat.id',
    phone: '081234567894',
    status: 'active',
    joinDate: '2023-11-12',
    salary: 2700000
  },
  {
    id: '6',
    name: 'Maya Sari',
    role: 'staff',
    email: 'maya@laundrykilat.id',
    phone: '081234567895',
    status: 'inactive',
    joinDate: '2023-05-18',
    salary: 3100000
  }
];

// Fetch employees function
const fetchEmployees = async (): Promise<Employee[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // In a real app, this would be an API call
  // const response = await api.get('/api/employees');
  // return response.data;
  
  return mockEmployees;
};

// Custom hook for employees
export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Hook for active employees only (for dropdowns)
export const useActiveEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['active-employees'],
    queryFn: async () => {
      const allEmployees = await fetchEmployees();
      return allEmployees.filter(emp => emp.status === 'active');
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};