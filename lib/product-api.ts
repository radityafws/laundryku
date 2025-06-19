import api from './api';

// Check if a SKU is available (not already used)
export const checkSkuAvailability = async (sku: string): Promise<boolean> => {
  try {
    // In a real app, this would be an API call
    // const response = await api.get(`/api/products/check-sku?sku=${encodeURIComponent(sku)}`);
    // return response.data.available;
    
    // For demo purposes, simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock list of existing SKUs
    const existingSkus = [
      'PRD-001', 'SRV-001', 'PRD-002', 'SRV-002', 
      'PRD-ABC123', 'SRV-XYZ456', 'PRD-TEST001',
      'PRD-001-V01', 'PRD-001-V02', 'SRV-001-V01'
    ];
    
    return !existingSkus.includes(sku);
  } catch (error) {
    console.error('Error checking SKU availability:', error);
    // In case of error, assume SKU is available to allow form submission
    // In production, you might want to handle this differently
    return true;
  }
};

// Validate a product before saving
export const validateProduct = async (product: any): Promise<{ valid: boolean, errors: string[] }> => {
  try {
    // In a real app, this would be an API call
    // const response = await api.post('/api/products/validate', product);
    // return response.data;
    
    // For demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation
    const errors: string[] = [];
    
    // Basic validation
    if (!product.name || product.name.length < 3) {
      errors.push('Nama produk minimal 3 karakter');
    }
    
    if (!product.sku) {
      errors.push('SKU wajib diisi');
    }
    
    // Validate variations if present
    if (product.hasVariations && product.variations) {
      if (product.variations.length === 0) {
        errors.push('Produk dengan variasi harus memiliki minimal 1 variasi');
      }
      
      product.variations.forEach((variation: any, index: number) => {
        if (!variation.name) {
          errors.push(`Nama variasi #${index + 1} wajib diisi`);
        }
        if (!variation.sku) {
          errors.push(`SKU variasi #${index + 1} wajib diisi`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error validating product:', error);
    return {
      valid: false,
      errors: ['Terjadi kesalahan saat validasi produk']
    };
  }
};