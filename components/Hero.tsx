'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 font-medium">
                <span className="text-2xl">🧺</span>
                <span>Bersih, Cepat, Terjangkau</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Layanan Laundry
                <span className="text-blue-600"> Kiloan & Express</span>
                <br />
                Terbaik di UNS!
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                <span className="flex items-center space-x-2 mb-2">
                  <span>📦</span>
                  <span>💨</span>
                  <span>Express 1 hari</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>Harga mulai Rp 3.000/kg</span>
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Cek Status</span>
              </button>
              
              <button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Hitung Estimasi</span>
              </button>
            </div>
          </div>

          {/* Right Content - Animated Illustration */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* Washing Machine Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Machine Body */}
                  <div className="w-64 h-80 bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl shadow-2xl border-4 border-gray-300">
                    {/* Control Panel */}
                    <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl flex items-center justify-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                    
                    {/* Door */}
                    <div className="mx-8 mt-8 w-48 h-48 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full border-8 border-gray-300 flex items-center justify-center relative overflow-hidden">
                      {/* Rotating Clothes */}
                      <div className="absolute inset-4 animate-spin">
                        <div className="w-full h-full relative">
                          <div className="absolute top-0 left-1/2 w-4 h-4 bg-red-400 rounded transform -translate-x-1/2 animate-bounce"></div>
                          <div className="absolute right-0 top-1/2 w-4 h-4 bg-blue-400 rounded transform -translate-y-1/2 animate-bounce delay-100"></div>
                          <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-green-400 rounded transform -translate-x-1/2 animate-bounce delay-200"></div>
                          <div className="absolute left-0 top-1/2 w-4 h-4 bg-yellow-400 rounded transform -translate-y-1/2 animate-bounce delay-300"></div>
                        </div>
                      </div>
                      
                      {/* Water Effect */}
                      <div className="absolute inset-0 bg-blue-400 opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-8 -left-8 text-4xl animate-bounce">🧽</div>
                  <div className="absolute -top-4 -right-8 text-3xl animate-bounce delay-200">🧴</div>
                  <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce delay-400">👕</div>
                  <div className="absolute -bottom-8 -right-4 text-4xl animate-bounce delay-600">✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}