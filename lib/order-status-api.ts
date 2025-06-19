import api from './api';

// Order Status interface
export interface OrderStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
}

// Mock order statuses data
const mockOrderStatuses: OrderStatus[] = [
  {
    id: '1',
    name: 'Pesanan Diterima',
    description: 'Pesanan telah diterima dan sedang menunggu proses',
    icon: '📥',
    order: 1,
    isActive: true,
    isDefault: true,
    createdAt: '2024-12-15'
  },
  {
    id: '2',
    name: 'Sedang Dicuci',
    description: 'Pesanan sedang dalam proses pencucian',
    icon: '🧼',
    order: 2,
    isActive: true,
    createdAt: '2024-12-15'
  },
  {
    id: '3',
    name: 'Sedang Dikeringkan',
    description: 'Pesanan sedang dalam proses pengeringan',
    icon: '🌞',
    order: 3,
    isActive: true,
    createdAt: '2024-12-15'
  },
  {
    id: '4',
    name: 'Sedang Disetrika',
    description: 'Pesanan sedang dalam proses penyetrikaan',
    icon: '🔥',
    order: 4,
    isActive: true,
    createdAt: '2024-12-15'
  },
  {
    id: '5',
    name: 'Siap Diambil',
    description: 'Pesanan telah selesai dan siap untuk diambil',
    icon: '🚚',
    order: 5,
    isActive: true,
    createdAt: '2024-12-15'
  },
  {
    id: '6',
    name: 'Pesanan Selesai',
    description: 'Pesanan telah diambil/diterima oleh pelanggan',
    icon: '✅',
    order: 6,
    isActive: true,
    isDefault: true,
    createdAt: '2024-12-15'
  },
  {
    id: '7',
    name: 'Dibatalkan',
    description: 'Pesanan dibatalkan',
    icon: '❌',
    order: 7,
    isActive: true,
    isDefault: true,
    createdAt: '2024-12-15'
  }
];

// Fetch all order statuses
export const fetchOrderStatuses = async (): Promise<OrderStatus[]> => {
  try {
    const response = await api.get('/order-status');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockOrderStatuses];
  }
};

// Create a new order status
export const createOrderStatus = async (status: Omit<OrderStatus, 'id' | 'createdAt'>): Promise<OrderStatus> => {
  try {
    const response = await api.post('/order-status', status);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new status with generated ID and timestamp
    const newStatus: OrderStatus = {
      ...status,
      id: `status_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    return newStatus;
  }
};

// Update an existing order status
export const updateOrderStatus = async (status: OrderStatus): Promise<OrderStatus> => {
  try {
    const response = await api.put(`/order-status/${status.id}`, status);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return status;
  }
};

// Delete an order status
export const deleteOrderStatus = async (id: string): Promise<void> => {
  try {
    await api.delete(`/order-status/${id}`);
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
  }
};

// Update order status positions (batch update)
export const updateOrderStatusPositions = async (statusUpdates: { id: string; order: number }[]): Promise<void> => {
  try {
    await api.put('/order-status/positions', { statusUpdates });
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
  }
};

// Toggle order status active state
export const toggleOrderStatusActive = async (id: string, isActive: boolean): Promise<OrderStatus> => {
  try {
    const response = await api.patch(`/order-status/${id}/toggle`, { isActive });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return a mock updated status
    const status = mockOrderStatuses.find(s => s.id === id);
    if (!status) throw new Error('Status not found');
    
    return {
      ...status,
      isActive
    };
  }
};