export default function Features() {
  const features = [
    {
      icon: '⏱️',
      title: 'Layanan Express',
      description: 'Butuh cepat? Kami sediakan layanan 1 hari selesai dengan harga terjangkau.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: '💸',
      title: 'Harga Hemat',
      description: 'Mulai dari Rp 3.000/kg untuk layanan standar (3 hari), cocok untuk harian maupun bulanan.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: '📦',
      title: 'Packing Rapi',
      description: 'Pakaian Anda dikemas bersih dan wangi. Siap langsung dipakai atau disimpan.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: '🔒',
      title: 'Aman dan Terpercaya',
      description: 'Setiap order memiliki nomor invoice dan bisa dilacak statusnya langsung di website ini.',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mengapa Pilih <span className="text-blue-600">LaundryKilat?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami memberikan pelayanan terbaik dengan standar kualitas tinggi untuk kepuasan Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🚚</div>
              <h4 className="font-semibold text-gray-900">Antar Jemput Gratis</h4>
              <p className="text-gray-600 text-sm">Minimal order 5kg</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl">🧼</div>
              <h4 className="font-semibold text-gray-900">Deterjen Premium</h4>
              <p className="text-gray-600 text-sm">Aman untuk kulit sensitif</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl">📱</div>
              <h4 className="font-semibold text-gray-900">Notifikasi Real-time</h4>
              <p className="text-gray-600 text-sm">Update status via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}