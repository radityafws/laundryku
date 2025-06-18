export default function Contact() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'LaundryKilat';
  const address = process.env.NEXT_PUBLIC_ADDRESS || 'Jl. Surya III No.24, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126';
  const phone = process.env.NEXT_PUBLIC_PHONE || '0812-3456-7890';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'support@laundrykilat.id';
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM || '@laundrykilat.solo';
  const operatingHours = process.env.NEXT_PUBLIC_OPERATING_HOURS || 'Senin – Minggu  10.00–22.00';

  const contactInfo = [
    {
      icon: '📍',
      title: 'Alamat',
      content: address,
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: '⏰',
      title: 'Jam Operasional',
      content: operatingHours,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      content: phone,
      gradient: 'from-green-500 to-green-600',
      link: `https://wa.me/${phone.replace(/[^0-9]/g, '')}`
    },
    {
      icon: '📧',
      title: 'Email',
      content: email,
      gradient: 'from-purple-500 to-purple-600',
      link: `mailto:${email}`
    },
    {
      icon: '🌐',
      title: 'Instagram',
      content: instagram,
      gradient: 'from-pink-500 to-pink-600',
      link: `https://instagram.com/${instagram.replace('@', '')}`
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Hubungi <span className="text-blue-300">{businessName}</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Siap melayani kebutuhan laundry Anda dengan pelayanan terbaik
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {info.icon}
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-blue-100">
                {info.title}
              </h3>
              
              {info.link ? (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-300 transition-colors duration-300 break-words"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-white break-words">
                  {info.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Siap untuk Mencoba Layanan Kami?</h3>
            <p className="text-blue-100 mb-6">
              Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>Chat WhatsApp</span>
              </a>
              
              <a
                href={`tel:${phone}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>📞</span>
                <span>Telepon Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}