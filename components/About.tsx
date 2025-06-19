'use client';

import { useLandingPageData } from '@/hooks/useLandingPageData';

export default function About() {
  const { data, isLoading } = useLandingPageData();

  if (isLoading || !data) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-64 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { about } = data;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                {about.title.main} <span className="text-blue-600">{about.title.highlight}</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {about.description.replace('5.000 pelanggan', '5.000 pelanggan')}
              </p>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">{about.location.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{about.location.title}</h3>
                  <p className="text-gray-600">{about.location.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {about.stats.map((stat, index) => {
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600 text-blue-100',
                green: 'from-green-500 to-green-600 text-green-100',
                purple: 'from-purple-500 to-purple-600 text-purple-100',
                orange: 'from-orange-500 to-orange-600 text-orange-100'
              };
              
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300`}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className={colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}