import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchOrderStatuses, 
  createOrderStatus, 
  updateOrderStatus, 
  deleteOrderStatus,
  updateOrderStatusPositions,
  toggleOrderStatusActive,
  OrderStatus
} from '@/lib/order-status-api';
import { toast } from 'react-toastify';

// Hook for fetching order statuses
export const useOrderStatuses = () => {
  return useQuery({
    queryKey: ['order-statuses'],
    queryFn: fetchOrderStatuses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Hook for creating a new order status
export const useCreateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (status: Omit<OrderStatus, 'id' | 'createdAt'>) => createOrderStatus(status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
      toast.success('Status pesanan berhasil ditambahkan!');
    },
    onError: (error: any) => {
      toast.error(`Gagal menambahkan status: ${error.message || 'Terjadi kesalahan'}`);
    }
  });
};

// Hook for updating an existing order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
      toast.success('Status pesanan berhasil diperbarui!');
    },
    onError: (error: any) => {
      toast.error(`Gagal memperbarui status: ${error.message || 'Terjadi kesalahan'}`);
    }
  });
};

// Hook for deleting an order status
export const useDeleteOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
      toast.success('Status pesanan berhasil dihapus!');
    },
    onError: (error: any) => {
      toast.error(`Gagal menghapus status: ${error.message || 'Terjadi kesalahan'}`);
    }
  });
};

// Hook for updating order status positions (batch update)
export const useUpdateOrderStatusPositions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (statusUpdates: { id: string; order: number }[]) => 
      updateOrderStatusPositions(statusUpdates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
      toast.success('Urutan status berhasil diperbarui!');
    },
    onError: (error: any) => {
      toast.error(`Gagal memperbarui urutan: ${error.message || 'Terjadi kesalahan'}`);
    }
  });
};

// Hook for toggling order status active state
export const useToggleOrderStatusActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleOrderStatusActive(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
      toast.success(`Status berhasil ${variables.isActive ? 'diaktifkan' : 'dinonaktifkan'}!`);
    },
    onError: (error: any) => {
      toast.error(`Gagal mengubah status aktif: ${error.message || 'Terjadi kesalahan'}`);
    }
  });
};