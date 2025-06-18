export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Tentang <span className="text-blue-600">LaundryKilat</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                LaundryKilat adalah layanan laundry kiloan terpercaya yang telah melayani lebih dari 
                <span className="font-semibold text-blue-600"> 5.000 pelanggan</span> sejak 2019. 
                Kami berkomitmen memberikan layanan cepat, bersih, dan terjangkau bagi setiap pelanggan kami.
              </p>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Berlokasi di Solo</h3>
                  <p className="text-gray-600">
                    Dengan peralatan modern dan tenaga profesional, kami pastikan pakaian Anda 
                    ditangani dengan hati-hati dan higienis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-blue-100">Pelanggan Puas</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-3xl font-bold">2019</div>
              <div className="text-green-100">Sejak Tahun</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-3xl font-bold">24</div>
              <div className="text-purple-100">Jam Express</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-3xl font-bold">3K</div>
              <div className="text-orange-100">Mulai /kg</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}