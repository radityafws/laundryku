import { useQuery } from '@tanstack/react-query';

// Order interface
export interface Order {
  id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  weight: number;
  service: 'regular' | 'express';
  status: 'in-progress' | 'ready' | 'completed';
  total: number;
  notes?: string;
  paymentMethod?: 'cash' | 'qris';
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    invoice: 'INV001',
    customerName: 'Ahmad Santoso',
    customerPhone: '081234567890',
    dateIn: '2025-01-20',
    estimatedDone: '2025-01-21',
    weight: 3.5,
    service: 'express',
    status: 'ready',
    total: 17500,
    notes: 'Pisahkan baju putih dan berwarna',
    paymentMethod: 'cash'
  },
  {
    id: '2',
    invoice: 'INV002',
    customerName: 'Siti Nurhaliza',
    customerPhone: '081234567891',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-22',
    weight: 2.8,
    service: 'regular',
    status: 'in-progress',
    total: 8400,
    paymentMethod: 'qris'
  },
  {
    id: '3',
    invoice: 'INV003',
    customerName: 'Budi Prasetyo',
    customerPhone: '081234567892',
    dateIn: '2025-01-18',
    estimatedDone: '2025-01-19',
    weight: 4.2,
    service: 'express',
    status: 'completed',
    total: 21000,
    notes: 'Setrika extra rapi',
    paymentMethod: 'cash'
  },
  {
    id: '4',
    invoice: 'INV004',
    customerName: 'Dewi Sartika',
    customerPhone: '081234567893',
    dateIn: '2025-01-20',
    estimatedDone: '2025-01-23',
    weight: 5.1,
    service: 'regular',
    status: 'in-progress',
    total: 15300,
    paymentMethod: 'qris'
  },
  {
    id: '5',
    invoice: 'INV005',
    customerName: 'Eko Wijaya',
    customerPhone: '081234567894',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-20',
    weight: 1.8,
    service: 'express',
    status: 'ready',
    total: 9000,
    notes: 'Jangan gunakan pelembut',
    paymentMethod: 'cash'
  },
  {
    id: '6',
    invoice: 'INV006',
    customerName: 'Rina Melati',
    customerPhone: '081234567895',
    dateIn: '2025-01-17',
    estimatedDone: '2025-01-18',
    weight: 3.0,
    service: 'express',
    status: 'completed',
    total: 15000,
    paymentMethod: 'qris'
  },
  {
    id: '7',
    invoice: 'INV007',
    customerName: 'Joko Susilo',
    customerPhone: '081234567896',
    dateIn: '2025-01-20',
    estimatedDone: '2025-01-23',
    weight: 6.5,
    service: 'regular',
    status: 'in-progress',
    total: 19500,
    notes: 'Cuci terpisah untuk jas',
    paymentMethod: 'cash'
  },
  {
    id: '8',
    invoice: 'INV008',
    customerName: 'Maya Sari',
    customerPhone: '081234567897',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-20',
    weight: 2.3,
    service: 'express',
    status: 'ready',
    total: 11500,
    paymentMethod: 'qris'
  }
];

// Fetch orders function
const fetchOrders = async (): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call
  // const response = await api.get('/orders');
  // return response.data;
  
  return mockOrders;
};

// Custom hook for orders
export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};