'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LaundryOrder {
  nama: string;
  no_invoice: string;
  tanggal_masuk: string;
  berat: string;
  layanan: string;
  status: string;
  tanggal_selesai?: string;
  waktu_diambil?: string;
}

// Mock data for demonstration
const mockOrders: LaundryOrder[] = [
  {
    nama: "Budi Santoso",
    no_invoice: "INV123456",
    tanggal_masuk: "2025-01-15",
    berat: "3.2 kg",
    layanan: "Express (1 hari)",
    status: "Siap Diambil"
  },
  {
    nama: "Siti Aminah",
    no_invoice: "INV123457",
    tanggal_masuk: "2025-01-16",
    berat: "2.5 kg",
    layanan: "Reguler (3 hari)",
    status: "Masih Proses"
  },
  {
    nama: "Ahmad Rahman",
    no_invoice: "INV123458",
    tanggal_masuk: "2025-01-14",
    berat: "4.1 kg",
    layanan: "Express (1 hari)",
    status: "Sudah Diambil",
    tanggal_selesai: "2025-01-15",
    waktu_diambil: "16 Januari 2025 pukul 14:32"
  }
];

export default function CekStatusPage() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<LaundryOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      alert('Silakan masukkan nomor invoice atau nomor HP');
      return;
    }

    if (inputValue.length < 5) {
      alert('Nomor invoice minimal 5 karakter');
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setSearchResult(null);
    setHasSearched(false);

    // Simulate API call delay
    setTimeout(() => {
      // Search in mock data
      const found = mockOrders.find(order => 
        order.no_invoice.toLowerCase().includes(inputValue.toLowerCase()) ||
        inputValue === '081234567890' // Mock phone number
      );

      setIsLoading(false);
      setHasSearched(true);

      if (found) {
        setSearchResult(found);
        setNotFound(false);
      } else {
        setSearchResult(null);
        setNotFound(true);
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'siap diambil':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'masih proses':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sudah diambil':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'siap diambil':
        return '✅';
      case 'masih proses':
        return '🧼';
      case 'sudah diambil':
        return '✔️';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔍 Cek Status <span className="text-blue-600">Laundry</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Masukkan nomor invoice atau nomor HP Anda untuk melihat status cucian
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label htmlFor="search-input" className="block text-lg font-semibold text-gray-700 mb-3">
                  Nomor Invoice atau Nomor HP
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: INV123456 atau 081234567890"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Cek Status</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="animate-fade-in">
              {searchResult ? (
                /* Order Found */
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      📄 Detail Pesanan
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">👤</span>
                        <div>
                          <p className="text-sm text-gray-500">Nama</p>
                          <p className="font-semibold text-gray-900">{searchResult.nama}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">🧾</span>
                        <div>
                          <p className="text-sm text-gray-500">Invoice</p>
                          <p className="font-semibold text-gray-900">{searchResult.no_invoice}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">📅</span>
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Masuk</p>
                          <p className="font-semibold text-gray-900">{formatDate(searchResult.tanggal_masuk)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">⚖️</span>
                        <div>
                          <p className="text-sm text-gray-500">Berat</p>
                          <p className="font-semibold text-gray-900">{searchResult.berat}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <span className="text-2xl">🚀</span>
                        <div>
                          <p className="text-sm text-gray-500">Layanan</p>
                          <p className="font-semibold text-gray-900">{searchResult.layanan}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`p-6 rounded-2xl border-2 ${getStatusColor(searchResult.status)} text-center`}>
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <span className="text-3xl">{getStatusIcon(searchResult.status)}</span>
                      <h3 className="text-xl font-bold">Status Laundry</h3>
                    </div>
                    
                    <p className="text-lg font-semibold mb-2">{searchResult.status}</p>
                    
                    {searchResult.status.toLowerCase() === 'siap diambil' && (
                      <p className="text-sm">Sudah selesai & siap diambil! Silakan datang atau tunggu kurir.</p>
                    )}
                    
                    {searchResult.status.toLowerCase() === 'masih proses' && (
                      <p className="text-sm">Masih dalam proses pencucian. Harap cek kembali beberapa saat lagi.</p>
                    )}
                    
                    {searchResult.status.toLowerCase() === 'sudah diambil' && searchResult.waktu_diambil && (
                      <p className="text-sm">Pesanan sudah diambil {searchResult.waktu_diambil}.</p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-8 p-6 bg-blue-50 rounded-2xl text-center">
                    <p className="text-gray-700 mb-4">Ada pertanyaan? Hubungi kami:</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE?.replace(/[^0-9]/g, '') || '081234567890'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>📱</span>
                        <span>WhatsApp</span>
                      </a>
                      
                      <a
                        href={`tel:${process.env.NEXT_PUBLIC_PHONE || '081234567890'}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>📞</span>
                        <span>Telepon</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : notFound ? (
                /* Order Not Found */
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-200 text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Pesanan Tidak Ditemukan
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Maaf, pesanan dengan nomor yang Anda masukkan tidak ditemukan.<br />
                    Silakan periksa kembali nomor invoice atau nomor HP Anda.
                  </p>
                  
                  <div className="bg-red-50 p-6 rounded-xl mb-6">
                    <h3 className="font-semibold text-red-800 mb-2">💡 Tips:</h3>
                    <ul className="text-sm text-red-700 space-y-1 text-left max-w-md mx-auto">
                      <li>• Pastikan nomor invoice diketik dengan benar</li>
                      <li>• Coba gunakan nomor HP yang terdaftar</li>
                      <li>• Hubungi kami jika masih mengalami kesulitan</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setInputValue('');
                      setNotFound(false);
                      setHasSearched(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Demo Instructions */}
          <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              🧪 Demo Mode - Coba Nomor Berikut:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-green-600">✅ Siap Diambil:</p>
                <p className="text-gray-600">INV123456</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-blue-600">🧼 Masih Proses:</p>
                <p className="text-gray-600">INV123457</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="font-semibold text-gray-600">✔️ Sudah Diambil:</p>
                <p className="text-gray-600">INV123458</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}