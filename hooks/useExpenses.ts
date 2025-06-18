import { useQuery } from '@tanstack/react-query';

// Expense interface (updated with expenseType)
export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  notes?: string;
  expenseType?: string;
}

// Mock expenses data (updated with expenseType)
const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'electricity',
    description: 'Tagihan listrik bulan Januari 2025',
    amount: 850000,
    date: '2025-01-20',
    notes: 'Pembayaran melalui mobile banking',
    expenseType: 'monthly'
  },
  {
    id: '2',
    category: 'detergent',
    description: 'Pembelian detergen dan pelembut pakaian',
    amount: 450000,
    date: '2025-01-19',
    notes: 'Stok untuk 2 minggu ke depan',
    expenseType: 'routine'
  },
  {
    id: '3',
    category: 'maintenance',
    description: 'Service mesin cuci unit 2',
    amount: 350000,
    date: '2025-01-18',
    expenseType: 'one_time'
  },
  {
    id: '4',
    category: 'water',
    description: 'Tagihan air PDAM bulan Januari',
    amount: 275000,
    date: '2025-01-17',
    notes: 'Pembayaran tepat waktu',
    expenseType: 'monthly'
  },
  {
    id: '5',
    category: 'salary',
    description: 'Gaji karyawan minggu ke-3 Januari',
    amount: 1200000,
    date: '2025-01-16',
    expenseType: 'routine'
  },
  {
    id: '6',
    category: 'rent',
    description: 'Sewa tempat usaha bulan Januari',
    amount: 2500000,
    date: '2025-01-15',
    notes: 'Pembayaran sewa bulanan',
    expenseType: 'monthly'
  },
  {
    id: '7',
    category: 'detergent',
    description: 'Pembelian sabun cuci tambahan',
    amount: 180000,
    date: '2025-01-14',
    expenseType: 'one_time'
  },
  {
    id: '8',
    category: 'maintenance',
    description: 'Perbaikan mesin pengering',
    amount: 425000,
    date: '2025-01-13',
    notes: 'Ganti spare part dan service rutin',
    expenseType: 'one_time'
  },
  {
    id: '9',
    category: 'other',
    description: 'Pembelian alat kebersihan',
    amount: 125000,
    date: '2025-01-12',
    expenseType: 'routine'
  },
  {
    id: '10',
    category: 'electricity',
    description: 'Tagihan listrik tambahan (AC)',
    amount: 320000,
    date: '2025-01-11',
    notes: 'Biaya AC untuk ruang tunggu',
    expenseType: 'monthly'
  },
  {
    id: '11',
    category: 'salary',
    description: 'Bonus karyawan terbaik',
    amount: 500000,
    date: '2025-01-10',
    expenseType: 'one_time'
  },
  {
    id: '12',
    category: 'detergent',
    description: 'Stok detergen khusus pakaian putih',
    amount: 220000,
    date: '2025-01-09',
    expenseType: 'routine'
  },
  {
    id: '13',
    category: 'water',
    description: 'Biaya air tambahan untuk cuci besar',
    amount: 150000,
    date: '2025-01-08',
    expenseType: 'one_time'
  },
  {
    id: '14',
    category: 'maintenance',
    description: 'Pembersihan dan maintenance rutin',
    amount: 200000,
    date: '2025-01-07',
    expenseType: 'routine'
  },
  {
    id: '15',
    category: 'other',
    description: 'Biaya transportasi pengambilan barang',
    amount: 75000,
    date: '2025-01-06',
    expenseType: 'one_time'
  },
  {
    id: '16',
    category: 'rent',
    description: 'Biaya asuransi gedung tahunan',
    amount: 1500000,
    date: '2025-01-05',
    notes: 'Pembayaran asuransi untuk tahun 2025',
    expenseType: 'yearly'
  },
  {
    id: '17',
    category: 'salary',
    description: 'THR karyawan',
    amount: 2000000,
    date: '2025-01-04',
    notes: 'Tunjangan hari raya',
    expenseType: 'yearly'
  },
  {
    id: '18',
    category: 'maintenance',
    description: 'Upgrade sistem POS',
    amount: 800000,
    date: '2025-01-03',
    expenseType: 'one_time'
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