export default function Footer() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'LaundryKilat';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🧺</span>
              </div>
              <span className="text-xl font-bold">{businessName}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Layanan laundry kiloan terpercaya dengan kualitas terbaik dan harga terjangkau.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Layanan</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Laundry Kiloan</li>
              <li>Express 1 Hari</li>
              <li>Cuci Kering</li>
              <li>Setrika Saja</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Menu</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Tentang</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Layanan</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kontak</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>📱 {process.env.NEXT_PUBLIC_PHONE || '0812-3456-7890'}</p>
              <p>📧 {process.env.NEXT_PUBLIC_EMAIL || 'support@laundrykilat.id'}</p>
              <p>🌐 {process.env.NEXT_PUBLIC_INSTAGRAM || '@laundrykilat.solo'}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {businessName}. All rights reserved. Made with ❤️ for better laundry experience.
          </p>
        </div>
      </div>
    </footer>
  );
}