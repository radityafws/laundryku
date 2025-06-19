import { useQuery } from '@tanstack/react-query';

// Product interfaces
export interface ProductVariation {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  type: 'product' | 'service';
  description?: string;
  hasVariations: boolean;
  variations: ProductVariation[];
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cuci Kiloan Reguler',
    sku: 'SRV-CKR001',
    price: 3000,
    stock: 0,
    category: 'laundry',
    type: 'service',
    description: 'Layanan cuci kiloan reguler dengan estimasi 3 hari',
    hasVariations: false,
    variations: [],
    status: 'active',
    createdAt: '2024-12-15'
  },
  {
    id: '2',
    name: 'Cuci Kiloan Express',
    sku: 'SRV-CKE002',
    price: 5000,
    stock: 0,
    category: 'laundry',
    type: 'service',
    description: 'Layanan cuci kiloan express dengan estimasi 1 hari',
    hasVariations: false,
    variations: [],
    status: 'active',
    createdAt: '2024-12-15'
  },
  {
    id: '3',
    name: 'Setrika Saja',
    sku: 'SRV-STR003',
    price: 2000,
    stock: 0,
    category: 'laundry',
    type: 'service',
    description: 'Layanan setrika saja tanpa cuci',
    hasVariations: false,
    variations: [],
    status: 'active',
    createdAt: '2024-12-16'
  },
  {
    id: '4',
    name: 'Deterjen Cair Premium',
    sku: 'PRD-DCP004',
    price: 0,
    stock: 0,
    category: 'detergent',
    type: 'product',
    description: 'Deterjen cair premium untuk pakaian sensitif',
    hasVariations: true,
    variations: [
      {
        id: 'var1',
        name: 'Ukuran 500ml',
        sku: 'PRD-DCP004-V01',
        price: 25000,
        stock: 15
      },
      {
        id: 'var2',
        name: 'Ukuran 1L',
        sku: 'PRD-DCP004-V02',
        price: 45000,
        stock: 8
      },
      {
        id: 'var3',
        name: 'Ukuran 2L',
        sku: 'PRD-DCP004-V03',
        price: 80000,
        stock: 5
      }
    ],
    status: 'active',
    createdAt: '2024-12-20'
  },
  {
    id: '5',
    name: 'Parfum Laundry',
    sku: 'PRD-PFM005',
    price: 0,
    stock: 0,
    category: 'perfume',
    type: 'product',
    description: 'Parfum laundry dengan berbagai varian aroma',
    hasVariations: true,
    variations: [
      {
        id: 'var4',
        name: 'Aroma Lavender',
        sku: 'PRD-PFM005-V01',
        price: 18000,
        stock: 12
      },
      {
        id: 'var5',
        name: 'Aroma Lemon',
        sku: 'PRD-PFM005-V02',
        price: 18000,
        stock: 10
      },
      {
        id: 'var6',
        name: 'Aroma Vanilla',
        sku: 'PRD-PFM005-V03',
        price: 20000,
        stock: 0
      }
    ],
    status: 'active',
    createdAt: '2024-12-22'
  },
  {
    id: '6',
    name: 'Kantong Plastik Laundry',
    sku: 'PRD-PKG006',
    price: 5000,
    stock: 200,
    category: 'packaging',
    type: 'product',
    description: 'Kantong plastik untuk packaging laundry',
    hasVariations: false,
    variations: [],
    status: 'active',
    createdAt: '2024-12-25'
  },
  {
    id: '7',
    name: 'Cuci Sepatu',
    sku: 'SRV-SPT007',
    price: 25000,
    stock: 0,
    category: 'laundry',
    type: 'service',
    description: 'Layanan cuci sepatu dengan treatment khusus',
    hasVariations: false,
    variations: [],
    status: 'active',
    createdAt: '2025-01-05'
  },
  {
    id: '8',
    name: 'Hanger Kawat',
    sku: 'PRD-HGR008',
    price: 1500,
    stock: 0,
    category: 'packaging',
    type: 'product',
    description: 'Hanger kawat untuk pakaian',
    hasVariations: false,
    variations: [],
    status: 'inactive',
    createdAt: '2025-01-10'
  },
  {
    id: '9',
    name: 'Cuci Karpet',
    sku: 'SRV-CKP009',
    price: 0,
    stock: 0,
    category: 'laundry',
    type: 'service',
    description: 'Layanan cuci karpet dengan berbagai ukuran',
    hasVariations: true,
    variations: [
      {
        id: 'var7',
        name: 'Karpet Kecil (< 2m²)',
        sku: 'SRV-CKP009-V01',
        price: 35000,
        stock: 0
      },
      {
        id: 'var8',
        name: 'Karpet Sedang (2-5m²)',
        sku: 'SRV-CKP009-V02',
        price: 60000,
        stock: 0
      },
      {
        id: 'var9',
        name: 'Karpet Besar (> 5m²)',
        sku: 'SRV-CKP009-V03',
        price: 100000,
        stock: 0
      }
    ],
    status: 'active',
    createdAt: '2025-01-12'
  }
];

// Fetch products function
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, this would be an API call
  // const response = await api.get('/products');
  // return response.data;
  
  return mockProducts;
};

// Custom hook for products
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};