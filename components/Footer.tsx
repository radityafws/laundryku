'use client';

import { useLandingPageData } from '@/hooks/useLandingPageData';

export default function Footer() {
  const { data, isLoading } = useLandingPageData();
  const currentYear = new Date().getFullYear();

  if (isLoading || !data) {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  const { footer } = data;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{footer.brand.logo}</span>
              </div>
              <span className="text-xl font-bold">{footer.brand.name}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {footer.brand.description}
            </p>
          </div>

          {/* Sections */}
          {footer.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold">{section.title}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {typeof item === 'string' ? (
                      item
                    ) : (
                      <a href={item.link} className="hover:text-white transition-colors">
                        {item.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {footer.brand.name}. {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}