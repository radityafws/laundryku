'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ClothingItem {
  name: string;
  weightRange: [number, number]; // [min, max] in kg
  icon: string;
}

const clothingItems: ClothingItem[] = [
  { name: 'Kaos', weightRange: [0.15, 0.20], icon: '👕' },
  { name: 'Kemeja', weightRange: [0.20, 0.25], icon: '👔' },
  { name: 'Celana Panjang', weightRange: [0.30, 0.40], icon: '👖' },
  { name: 'Celana Pendek', weightRange: [0.15, 0.25], icon: '🩳' },
  { name: 'Jaket', weightRange: [0.50, 0.80], icon: '🧥' },
  { name: 'Sweater', weightRange: [0.40, 0.60], icon: '🧶' },
  { name: 'Dress', weightRange: [0.25, 0.35], icon: '👗' },
  { name: 'Rok', weightRange: [0.20, 0.30], icon: '👗' },
  { name: 'Underwear', weightRange: [0.05, 0.10], icon: '🩲' },
  { name: 'Kaos Kaki', weightRange: [0.03, 0.05], icon: '🧦' },
  { name: 'Handuk', weightRange: [0.30, 0.50], icon: '🏖️' },
  { name: 'Seprai', weightRange: [0.80, 1.20], icon: '🛏️' }
];

interface ServiceType {
  name: string;
  price: number;
  duration: string;
  description: string;
}

const serviceTypes: ServiceType[] = [
  {
    name: 'Standar',
    price: 3000,
    duration: '3 hari',
    description: 'Layanan reguler dengan kualitas terbaik'
  },
  {
    name: 'Express',
    price: 5000,
    duration: '1 hari',
    description: 'Layanan cepat untuk kebutuhan mendesak'
  }
];

export default function EstimasiPage() {
  const [inputMethod, setInputMethod] = useState<'weight' | 'items'>('weight');
  const [totalWeight, setTotalWeight] = useState<string>('');
  const [clothingCounts, setClothingCounts] = useState<{ [key: string]: number }>({});
  const [selectedService, setSelectedService] = useState<ServiceType>(serviceTypes[0]);
  const [showResult, setShowResult] = useState(false);
  const [estimationResult, setEstimationResult] = useState<{
    weightRange: [number, number];
    priceRange: [number, number];
    exactWeight?: number;
    exactPrice?: number;
  } | null>(null);

  const handleClothingCountChange = (itemName: string, count: string) => {
    const numCount = parseInt(count) || 0;
    setClothingCounts(prev => ({
      ...prev,
      [itemName]: numCount
    }));
  };

  const calculateEstimation = () => {
    if (inputMethod === 'weight') {
      const weight = parseFloat(totalWeight);
      if (!weight || weight <= 0) {
        alert('⚠️ Harap masukkan berat cucian yang valid');
        return;
      }

      const exactPrice = weight * selectedService.price;
      setEstimationResult({
        weightRange: [weight, weight],
        priceRange: [exactPrice, exactPrice],
        exactWeight: weight,
        exactPrice: exactPrice
      });
    } else {
      // Calculate from clothing items
      const totalItems = Object.values(clothingCounts).reduce((sum, count) => sum + count, 0);
      
      if (totalItems === 0) {
        alert('⚠️ Harap masukkan jumlah pakaian terlebih dahulu');
        return;
      }

      let minWeight = 0;
      let maxWeight = 0;

      Object.entries(clothingCounts).forEach(([itemName, count]) => {
        if (count > 0) {
          const item = clothingItems.find(item => item.name === itemName);
          if (item) {
            minWeight += count * item.weightRange[0];
            maxWeight += count * item.weightRange[1];
          }
        }
      });

      const minPrice = minWeight * selectedService.price;
      const maxPrice = maxWeight * selectedService.price;

      setEstimationResult({
        weightRange: [minWeight, maxWeight],
        priceRange: [minPrice, maxPrice]
      });
    }

    setShowResult(true);
  };

  const resetForm = () => {
    setTotalWeight('');
    setClothingCounts({});
    setShowResult(false);
    setEstimationResult(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatWeight = (weight: number) => {
    return weight.toFixed(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧾 Hitung Estimasi <span className="text-blue-600">Laundry</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hitung estimasi berat cucian dan total biaya berdasarkan jenis pakaian atau berat total
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Method Selection */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Metode Estimasi</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="inputMethod"
                        value="weight"
                        checked={inputMethod === 'weight'}
                        onChange={(e) => setInputMethod(e.target.value as 'weight')}
                        className="mt-1 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">⚖️</span>
                          <span className="font-semibold text-gray-900">Saya tahu berat total cucian saya</span>
                        </div>
                        <p className="text-gray-600 text-sm">Masukkan berat total jika Anda sudah menimbang cucian</p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="inputMethod"
                        value="items"
                        checked={inputMethod === 'items'}
                        onChange={(e) => setInputMethod(e.target.value as 'items')}
                        className="mt-1 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">👕</span>
                          <span className="font-semibold text-gray-900">Saya ingin menghitung berdasarkan jenis pakaian</span>
                        </div>
                        <p className="text-gray-600 text-sm">Masukkan jumlah setiap jenis pakaian untuk estimasi otomatis</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Weight Input */}
                {inputMethod === 'weight' && (
                  <div className="mb-8">
                    <label htmlFor="weight-input" className="block text-lg font-semibold text-gray-700 mb-3">
                      Berat Total Cucian (kg)
                    </label>
                    <input
                      id="weight-input"
                      type="number"
                      step="0.1"
                      min="0"
                      value={totalWeight}
                      onChange={(e) => setTotalWeight(e.target.value)}
                      placeholder="Contoh: 3.5"
                      className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                    />
                  </div>
                )}

                {/* Clothing Items Input */}
                {inputMethod === 'items' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Jumlah Pakaian per Jenis</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {clothingItems.map((item) => (
                        <div key={item.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <label htmlFor={`item-${item.name}`} className="block font-medium text-gray-700">
                              {item.name}
                            </label>
                            <p className="text-xs text-gray-500">
                              ~{formatWeight(item.weightRange[0])}-{formatWeight(item.weightRange[1])} kg/pcs
                            </p>
                          </div>
                          <input
                            id={`item-${item.name}`}
                            type="number"
                            min="0"
                            value={clothingCounts[item.name] || ''}
                            onChange={(e) => handleClothingCountChange(item.name, e.target.value)}
                            placeholder="0"
                            className="w-16 px-2 py-2 text-center border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pilih Layanan</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceTypes.map((service) => (
                      <label
                        key={service.name}
                        className={`flex items-start space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedService.name === service.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.name}
                          checked={selectedService.name === service.name}
                          onChange={() => setSelectedService(service)}
                          className="mt-1 w-5 h-5 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{service.name}</span>
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(service.price)}/kg
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                          <p className="text-sm font-medium text-green-600">Selesai dalam {service.duration}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="flex space-x-4">
                  <button
                    onClick={calculateEstimation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>🔍</span>
                    <span>Hitung Estimasi</span>
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  📦 Estimasi Laundry
                </h2>

                {showResult && estimationResult ? (
                  <div className="space-y-6">
                    {/* Weight Estimation */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                        <span>⚖️</span>
                        <span>Total Estimasi Berat</span>
                      </h3>
                      {estimationResult.exactWeight ? (
                        <p className="text-2xl font-bold text-blue-600">
                          {formatWeight(estimationResult.exactWeight)} kg
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-blue-600">
                          {formatWeight(estimationResult.weightRange[0])} – {formatWeight(estimationResult.weightRange[1])} kg
                        </p>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Pilihan Layanan</span>
                      </h3>
                      <p className="text-lg font-bold text-green-600 mb-1">
                        {selectedService.name} ({selectedService.duration})
                      </p>
                      <p className="text-green-700">
                        Tarif: {formatPrice(selectedService.price)}/kg
                      </p>
                    </div>

                    {/* Price Estimation */}
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                      <h3 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                        <span>💸</span>
                        <span>Estimasi Biaya</span>
                      </h3>
                      {estimationResult.exactPrice ? (
                        <p className="text-2xl font-bold text-orange-600">
                          {formatPrice(estimationResult.exactPrice)}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-orange-600">
                          {formatPrice(estimationResult.priceRange[0])} – {formatPrice(estimationResult.priceRange[1])}
                        </p>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 text-center">
                        💡 Estimasi ini adalah perkiraan. Harga final akan disesuaikan dengan berat aktual saat penimbangan.
                      </p>
                    </div>

                    {/* Contact CTA */}
                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE?.replace(/[^0-9]/g, '') || '081234567890'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>📱</span>
                        <span>Order via WhatsApp</span>
                      </a>
                      
                      <a
                        href={`tel:${process.env.NEXT_PUBLIC_PHONE || '081234567890'}`}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>📞</span>
                        <span>Telepon Sekarang</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg">Masukkan data cucian Anda untuk melihat estimasi biaya</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Services Info */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ℹ️ Informasi Tambahan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-blue-800 mb-2">Antar Jemput Gratis</h3>
                <p className="text-blue-700 text-sm">Minimal order 5kg dalam radius 5km dari toko</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl mb-3">🧼</div>
                <h3 className="font-semibold text-green-800 mb-2">Deterjen Premium</h3>
                <p className="text-green-700 text-sm">Menggunakan deterjen berkualitas tinggi dan aman</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-semibold text-purple-800 mb-2">Update Real-time</h3>
                <p className="text-purple-700 text-sm">Notifikasi status cucian via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}