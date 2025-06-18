import { useQuery } from '@tanstack/react-query';

// Customer interface
export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders?: number;
  lastOrderDate?: string;
  totalSpent?: number;
  createdAt: string;
}

// Mock customers data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmad Santoso',
    phone: '081234567890',
    totalOrders: 15,
    lastOrderDate: '2025-01-20',
    totalSpent: 450000,
    createdAt: '2024-06-15'
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    phone: '081234567891',
    totalOrders: 8,
    lastOrderDate: '2025-01-19',
    totalSpent: 240000,
    createdAt: '2024-08-22'
  },
  {
    id: '3',
    name: 'Budi Prasetyo',
    phone: '081234567892',
    totalOrders: 22,
    lastOrderDate: '2025-01-18',
    totalSpent: 660000,
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    name: 'Dewi Sartika',
    phone: '081234567893',
    totalOrders: 5,
    lastOrderDate: '2025-01-17',
    totalSpent: 150000,
    createdAt: '2024-11-05'
  },
  {
    id: '5',
    name: 'Eko Wijaya',
    phone: '081234567894',
    totalOrders: 12,
    lastOrderDate: '2025-01-16',
    totalSpent: 360000,
    createdAt: '2024-07-18'
  },
  {
    id: '6',
    name: 'Rina Melati',
    phone: '081234567895',
    totalOrders: 18,
    lastOrderDate: '2025-01-15',
    totalSpent: 540000,
    createdAt: '2024-05-30'
  },
  {
    id: '7',
    name: 'Joko Susilo',
    phone: '081234567896',
    totalOrders: 3,
    lastOrderDate: '2025-01-14',
    totalSpent: 90000,
    createdAt: '2024-12-01'
  },
  {
    id: '8',
    name: 'Maya Sari',
    phone: '081234567897',
    totalOrders: 9,
    lastOrderDate: '2025-01-13',
    totalSpent: 270000,
    createdAt: '2024-09-12'
  },
  {
    id: '9',
    name: 'Rudi Hartono',
    phone: '081234567898',
    totalOrders: 14,
    lastOrderDate: '2025-01-12',
    totalSpent: 420000,
    createdAt: '2024-04-25'
  },
  {
    id: '10',
    name: 'Lina Kusuma',
    phone: '081234567899',
    totalOrders: 7,
    lastOrderDate: '2025-01-11',
    totalSpent: 210000,
    createdAt: '2024-10-08'
  },
  {
    id: '11',
    name: 'Agus Setiawan',
    phone: '081234567800',
    totalOrders: 11,
    lastOrderDate: '2025-01-10',
    totalSpent: 330000,
    createdAt: '2024-06-20'
  },
  {
    id: '12',
    name: 'Fitri Handayani',
    phone: '081234567801',
    totalOrders: 6,
    lastOrderDate: '2025-01-09',
    totalSpent: 180000,
    createdAt: '2024-08-15'
  },
  {
    id: '13',
    name: 'Bambang Sutrisno',
    phone: '081234567802',
    totalOrders: 20,
    lastOrderDate: '2025-01-08',
    totalSpent: 600000,
    createdAt: '2024-02-28'
  },
  {
    id: '14',
    name: 'Indira Sari',
    phone: '081234567803',
    totalOrders: 4,
    lastOrderDate: '2025-01-07',
    totalSpent: 120000,
    createdAt: '2024-11-18'
  },
  {
    id: '15',
    name: 'Hendra Gunawan',
    phone: '081234567804',
    totalOrders: 16,
    lastOrderDate: '2025-01-06',
    totalSpent: 480000,
    createdAt: '2024-05-12'
  },
  {
    id: '16',
    name: 'Ratna Dewi',
    phone: '081234567805',
    totalOrders: 13,
    lastOrderDate: '2025-01-05',
    totalSpent: 390000,
    createdAt: '2024-07-03'
  },
  {
    id: '17',
    name: 'Doni Prasetyo',
    phone: '081234567806',
    totalOrders: 2,
    lastOrderDate: '2025-01-04',
    totalSpent: 60000,
    createdAt: '2024-12-10'
  },
  {
    id: '18',
    name: 'Sari Wulandari',
    phone: '081234567807',
    totalOrders: 10,
    lastOrderDate: '2025-01-03',
    totalSpent: 300000,
    createdAt: '2024-09-05'
  },
  {
    id: '19',
    name: 'Yudi Setiawan',
    phone: '081234567808',
    totalOrders: 19,
    lastOrderDate: '2025-01-02',
    totalSpent: 570000,
    createdAt: '2024-04-14'
  },
  {
    id: '20',
    name: 'Nita Anggraini',
    phone: '081234567809',
    totalOrders: 1,
    lastOrderDate: '2025-01-01',
    totalSpent: 30000,
    createdAt: '2024-12-25'
  }
];

// Fetch customers function
const fetchCustomers = async (): Promise<Customer[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be an API call
  // const response = await api.get('/customers');
  // return response.data;
  
  return mockCustomers;
};

// Custom hook for customers
export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};