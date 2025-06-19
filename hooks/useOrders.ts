import { useQuery } from '@tanstack/react-query';

// Order interface
export interface Order {
  id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  dateIn: string;
  estimatedDone: string;
  items: OrderItem[];
  status: string;
  paymentStatus: 'paid' | 'unpaid';
  total: number;
  notes?: string;
  paymentMethod?: 'cash' | 'qris' | 'transfer';
}

export interface OrderItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  sku: string;
  price: number;
  quantity?: number;
  weight?: number;
  variation?: string;
  variationId?: string;
  subtotal: number;
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
    status: '2', // Sedang Dicuci
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    total: 17500,
    notes: 'Pisahkan baju putih dan berwarna',
    items: [
      {
        id: 'item1',
        type: 'service',
        name: 'Cuci Kiloan Express',
        sku: 'SRV-CKE002',
        price: 5000,
        weight: 3.5,
        subtotal: 17500
      }
    ]
  },
  {
    id: '2',
    invoice: 'INV002',
    customerName: 'Siti Nurhaliza',
    customerPhone: '081234567891',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-22',
    status: '1', // Pesanan Diterima
    paymentStatus: 'unpaid',
    paymentMethod: 'qris',
    total: 18400,
    items: [
      {
        id: 'item2',
        type: 'service',
        name: 'Cuci Kiloan Reguler',
        sku: 'SRV-CKR001',
        price: 3000,
        weight: 2.8,
        subtotal: 8400
      },
      {
        id: 'item3',
        type: 'product',
        name: 'Parfum Laundry',
        sku: 'PRD-PFM005-V01',
        price: 10000,
        quantity: 1,
        variation: 'Aroma Lavender',
        variationId: 'var4',
        subtotal: 10000
      }
    ]
  },
  {
    id: '3',
    invoice: 'INV003',
    customerName: 'Budi Prasetyo',
    customerPhone: '081234567892',
    dateIn: '2025-01-18',
    estimatedDone: '2025-01-19',
    status: '6', // Pesanan Selesai
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    total: 31000,
    notes: 'Setrika extra rapi',
    items: [
      {
        id: 'item4',
        type: 'service',
        name: 'Cuci Kiloan Express',
        sku: 'SRV-CKE002',
        price: 5000,
        weight: 4.2,
        subtotal: 21000
      },
      {
        id: 'item5',
        type: 'product',
        name: 'Deterjen Cair Premium',
        sku: 'PRD-DCP004-V01',
        price: 10000,
        quantity: 1,
        variation: 'Ukuran 500ml',
        variationId: 'var1',
        subtotal: 10000
      }
    ]
  },
  {
    id: '4',
    invoice: 'INV004',
    customerName: 'Dewi Sartika',
    customerPhone: '081234567893',
    dateIn: '2025-01-20',
    estimatedDone: '2025-01-23',
    status: '3', // Sedang Dikeringkan
    paymentStatus: 'paid',
    paymentMethod: 'transfer',
    total: 15300,
    items: [
      {
        id: 'item6',
        type: 'service',
        name: 'Cuci Kiloan Reguler',
        sku: 'SRV-CKR001',
        price: 3000,
        weight: 5.1,
        subtotal: 15300
      }
    ]
  },
  {
    id: '5',
    invoice: 'INV005',
    customerName: 'Eko Wijaya',
    customerPhone: '081234567894',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-20',
    status: '5', // Siap Diambil
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    total: 19000,
    notes: 'Jangan gunakan pelembut',
    items: [
      {
        id: 'item7',
        type: 'service',
        name: 'Cuci Kiloan Express',
        sku: 'SRV-CKE002',
        price: 5000,
        weight: 1.8,
        subtotal: 9000
      },
      {
        id: 'item8',
        type: 'product',
        name: 'Kantong Plastik Laundry',
        sku: 'PRD-PKG006',
        price: 5000,
        quantity: 2,
        subtotal: 10000
      }
    ]
  },
  {
    id: '6',
    invoice: 'INV006',
    customerName: 'Rina Melati',
    customerPhone: '081234567895',
    dateIn: '2025-01-17',
    estimatedDone: '2025-01-18',
    status: '6', // Pesanan Selesai
    paymentStatus: 'paid',
    paymentMethod: 'qris',
    total: 15000,
    items: [
      {
        id: 'item9',
        type: 'service',
        name: 'Cuci Kiloan Express',
        sku: 'SRV-CKE002',
        price: 5000,
        weight: 3.0,
        subtotal: 15000
      }
    ]
  },
  {
    id: '7',
    invoice: 'INV007',
    customerName: 'Joko Susilo',
    customerPhone: '081234567896',
    dateIn: '2025-01-20',
    estimatedDone: '2025-01-23',
    status: '4', // Sedang Disetrika
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    total: 29500,
    notes: 'Cuci terpisah untuk jas',
    items: [
      {
        id: 'item10',
        type: 'service',
        name: 'Cuci Kiloan Reguler',
        sku: 'SRV-CKR001',
        price: 3000,
        weight: 6.5,
        subtotal: 19500
      },
      {
        id: 'item11',
        type: 'product',
        name: 'Parfum Laundry',
        sku: 'PRD-PFM005-V02',
        price: 10000,
        quantity: 1,
        variation: 'Aroma Lemon',
        variationId: 'var5',
        subtotal: 10000
      }
    ]
  },
  {
    id: '8',
    invoice: 'INV008',
    customerName: 'Maya Sari',
    customerPhone: '081234567897',
    dateIn: '2025-01-19',
    estimatedDone: '2025-01-20',
    status: '5', // Siap Diambil
    paymentStatus: 'paid',
    paymentMethod: 'qris',
    total: 11500,
    items: [
      {
        id: 'item12',
        type: 'service',
        name: 'Cuci Kiloan Express',
        sku: 'SRV-CKE002',
        price: 5000,
        weight: 2.3,
        subtotal: 11500
      }
    ]
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