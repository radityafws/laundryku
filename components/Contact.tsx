'use client';

import { useLandingPageData } from '@/hooks/useLandingPageData';

export default function Contact() {
  const { data, isLoading } = useLandingPageData();

  if (isLoading || !data) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-64 h-8 bg-blue-700 rounded animate-pulse mx-auto mb-4"></div>
            <div className="w-full max-w-3xl h-16 bg-blue-700 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-32 bg-blue-700 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const { contact } = data;

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {contact.title.main} <span className="text-blue-300">{contact.title.highlight}</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {contact.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contact.info.map((info, index) => (
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
            <h3 className="text-2xl font-bold mb-4">{contact.cta.title}</h3>
            <p className="text-blue-100 mb-6">
              {contact.cta.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contact.cta.buttons.map((button, index) => {
                const colorClasses = {
                  green: 'bg-green-500 hover:bg-green-600',
                  blue: 'bg-blue-500 hover:bg-blue-600'
                };
                
                return (
                  <a
                    key={index}
                    href={button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${colorClasses[button.color as keyof typeof colorClasses]} text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
                  >
                    <span>{button.icon}</span>
                    <span>{button.text}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}