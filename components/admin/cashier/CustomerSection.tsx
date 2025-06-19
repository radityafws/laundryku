import { useState } from 'react';
import Select from '@/components/ui/Select';
import { useCustomers } from '@/hooks/useCustomers';

interface CustomerSectionProps {
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
  isQuickPurchase: boolean;
  setIsQuickPurchase: (value: boolean) => void;
}

export default function CustomerSection({
  selectedCustomer,
  setSelectedCustomer,
  isQuickPurchase,
  setIsQuickPurchase
}: CustomerSectionProps) {
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();

  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setIsQuickPurchase(false);
  };
  
  // Handle creating new customer
  const handleCreateCustomer = (name: string) => {
    const newCustomer = {
      value: `new_${Date.now()}`,
      label: name,
      phone: ''
    };
    
    setSelectedCustomer(newCustomer);
    setIsQuickPurchase(false);
  };
  
  // Handle quick purchase toggle
  const handleQuickPurchaseToggle = () => {
    setIsQuickPurchase(!isQuickPurchase);
    if (!isQuickPurchase) {
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Informasi Pelanggan</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isQuickPurchase}
              onChange={handleQuickPurchaseToggle}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Pembelian Cepat (tanpa data pelanggan)</span>
          </label>
        </div>
        
        {!isQuickPurchase && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Pelanggan
              </label>
              <Select
                options={customers?.map(customer => ({
                  value: customer.id,
                  label: customer.name,
                  phone: customer.phone
                })) || []}
                value={selectedCustomer}
                onChange={handleCustomerSelect}
                onCreateOption={handleCreateCustomer}
                placeholder="Cari nama pelanggan atau ketik nama baru..."
                isSearchable={true}
                isCreatable={true}
                isLoading={isLoadingCustomers}
              />
            </div>
            
            {selectedCustomer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor HP
                  </label>
                  <input
                    type="tel"
                    value={selectedCustomer.phone || ''}
                    onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                    placeholder="081234567890"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}