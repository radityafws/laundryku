import { useQuery } from '@tanstack/react-query';

// Promotion interface
export interface Promotion {
  id: string;
  title: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'draft';
  usageCount: number;
  maxUsage?: number;
  createdAt: string;
}

// Mock promotions data
const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Diskon Akhir Tahun',
    code: 'NEWYEAR25',
    description: 'Diskon 25% untuk semua layanan laundry. Minimal order Rp 50.000.',
    type: 'percentage',
    value: 25,
    minOrder: 50000,
    maxDiscount: 100000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    usageCount: 45,
    maxUsage: 100,
    createdAt: '2024-12-15'
  },
  {
    id: '2',
    title: 'Promo Pelanggan Baru',
    code: 'WELCOME20',
    description: 'Diskon 20% untuk pelanggan baru. Minimal order Rp 30.000.',
    type: 'percentage',
    value: 20,
    minOrder: 30000,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    usageCount: 78,
    createdAt: '2024-12-20'
  },
  {
    id: '3',
    title: 'Potongan Rp 10.000',
    code: 'FLAT10K',
    description: 'Potongan langsung Rp 10.000 untuk semua layanan. Minimal order Rp 40.000.',
    type: 'fixed',
    value: 10000,
    minOrder: 40000,
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    status: 'scheduled',
    usageCount: 0,
    createdAt: '2025-01-05'
  },
  {
    id: '4',
    title: 'Diskon Hari Kemerdekaan',
    code: 'MERDEKA45',
    description: 'Diskon 45% untuk memperingati hari kemerdekaan. Minimal order Rp 45.000.',
    type: 'percentage',
    value: 45,
    minOrder: 45000,
    maxDiscount: 100000,
    startDate: '2024-08-17',
    endDate: '2024-08-31',
    status: 'expired',
    usageCount: 120,
    maxUsage: 200,
    createdAt: '2024-08-01'
  },
  {
    id: '5',
    title: 'Promo Setrika Kilat',
    code: 'IRON15',
    description: 'Diskon 15% khusus untuk layanan setrika. Minimal order Rp 25.000.',
    type: 'percentage',
    value: 15,
    minOrder: 25000,
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    status: 'draft',
    usageCount: 0,
    createdAt: '2025-01-10'
  },
  {
    id: '6',
    title: 'Diskon Akhir Pekan',
    code: 'WEEKEND30',
    description: 'Diskon 30% untuk order di akhir pekan. Minimal order Rp 60.000.',
    type: 'percentage',
    value: 30,
    minOrder: 60000,
    maxDiscount: 150000,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    status: 'active',
    usageCount: 32,
    createdAt: '2024-12-25'
  },
  {
    id: '7',
    title: 'Potongan Rp 25.000',
    code: 'FLAT25K',
    description: 'Potongan langsung Rp 25.000 untuk order di atas Rp 100.000.',
    type: 'fixed',
    value: 25000,
    minOrder: 100000,
    startDate: '2025-01-01',
    endDate: '2025-01-15',
    status: 'active',
    usageCount: 18,
    maxUsage: 50,
    createdAt: '2024-12-28'
  }
];

// Fetch promotions function
const fetchPromotions = async (): Promise<Promotion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be an API call
  // const response = await api.get('/promotions');
  // return response.data;
  
  return mockPromotions;
};

// Custom hook for promotions
export const usePromotions = () => {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: fetchPromotions,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};