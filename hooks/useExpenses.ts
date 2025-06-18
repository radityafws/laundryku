import { useQuery } from '@tanstack/react-query';

// Expense interface
export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
}

// Mock expenses data
const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'electricity',
    description: 'Tagihan listrik bulan Januari 2025',
    amount: 850000,
    date: '2025-01-20',
    notes: 'Pembayaran melalui mobile banking'
  },
  {
    id: '2',
    category: 'detergent',
    description: 'Pembelian detergen dan pelembut pakaian',
    amount: 450000,
    date: '2025-01-19',
    notes: 'Stok untuk 2 minggu ke depan'
  },
  {
    id: '3',
    category: 'maintenance',
    description: 'Service mesin cuci unit 2',
    amount: 350000,
    date: '2025-01-18'
  },
  {
    id: '4',
    category: 'water',
    description: 'Tagihan air PDAM bulan Januari',
    amount: 275000,
    date: '2025-01-17',
    notes: 'Pembayaran tepat waktu'
  },
  {
    id: '5',
    category: 'salary',
    description: 'Gaji karyawan minggu ke-3 Januari',
    amount: 1200000,
    date: '2025-01-16'
  },
  {
    id: '6',
    category: 'rent',
    description: 'Sewa tempat usaha bulan Januari',
    amount: 2500000,
    date: '2025-01-15',
    notes: 'Pembayaran sewa bulanan'
  },
  {
    id: '7',
    category: 'detergent',
    description: 'Pembelian sabun cuci tambahan',
    amount: 180000,
    date: '2025-01-14'
  },
  {
    id: '8',
    category: 'maintenance',
    description: 'Perbaikan mesin pengering',
    amount: 425000,
    date: '2025-01-13',
    notes: 'Ganti spare part dan service rutin'
  },
  {
    id: '9',
    category: 'other',
    description: 'Pembelian alat kebersihan',
    amount: 125000,
    date: '2025-01-12'
  },
  {
    id: '10',
    category: 'electricity',
    description: 'Tagihan listrik tambahan (AC)',
    amount: 320000,
    date: '2025-01-11',
    notes: 'Biaya AC untuk ruang tunggu'
  },
  {
    id: '11',
    category: 'salary',
    description: 'Bonus karyawan terbaik',
    amount: 500000,
    date: '2025-01-10'
  },
  {
    id: '12',
    category: 'detergent',
    description: 'Stok detergen khusus pakaian putih',
    amount: 220000,
    date: '2025-01-09'
  },
  {
    id: '13',
    category: 'water',
    description: 'Biaya air tambahan untuk cuci besar',
    amount: 150000,
    date: '2025-01-08'
  },
  {
    id: '14',
    category: 'maintenance',
    description: 'Pembersihan dan maintenance rutin',
    amount: 200000,
    date: '2025-01-07'
  },
  {
    id: '15',
    category: 'other',
    description: 'Biaya transportasi pengambilan barang',
    amount: 75000,
    date: '2025-01-06'
  }
];

// Fetch expenses function
const fetchExpenses = async (): Promise<Expense[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be an API call
  // const response = await api.get('/expenses');
  // return response.data;
  
  return mockExpenses;
};

// Custom hook for expenses
export const useExpenses = () => {
  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};