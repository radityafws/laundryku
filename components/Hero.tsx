'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLandingPageData } from '@/hooks/useLandingPageData';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading } = useLandingPageData();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading || !data) {
    return (
      <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-40 h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-full h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  const { hero } = data;

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 font-medium">
                <span className="text-2xl">{hero.badge.icon}</span>
                <span>{hero.badge.text}</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {hero.title.main}
                <span className="text-blue-600">{hero.title.highlight}</span>
                <br />
                {hero.title.subtitle}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {hero.features.map((feature, index) => (
                  <span key={index} className="flex items-center space-x-2 mb-2">
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </span>
                ))}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {hero.cta.map((button, index) => (
                <Link
                  key={index}
                  href={button.link}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                    button.type === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600'
                  }`}
                >
                  <span>{button.icon}</span>
                  <span>{button.text}</span>
                </Link>
              ))}
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
                          {hero.animation.washingMachine.colors.map((color, index) => {
                            const positions = ['top-0 left-1/2', 'right-0 top-1/2', 'bottom-0 left-1/2', 'left-0 top-1/2'];
                            const transforms = ['-translate-x-1/2', '-translate-y-1/2', '-translate-x-1/2', '-translate-y-1/2'];
                            const delays = ['', 'delay-100', 'delay-200', 'delay-300'];
                            
                            return (
                              <div 
                                key={index}
                                className={`absolute ${positions[index]} w-4 h-4 bg-${color}-400 rounded transform ${transforms[index]} animate-bounce ${delays[index]}`}
                              ></div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Water Effect */}
                      <div className="absolute inset-0 bg-blue-400 opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  {hero.animation.washingMachine.floatingElements.map((element, index) => {
                    const positionClasses = {
                      'top-left': '-top-8 -left-8',
                      'top-right': '-top-4 -right-8',
                      'bottom-left': '-bottom-4 -left-4',
                      'bottom-right': '-bottom-8 -right-4'
                    };
                    const delays = ['', 'delay-200', 'delay-400', 'delay-600'];
                    
                    return (
                      <div 
                        key={index}
                        className={`absolute ${positionClasses[element.position as keyof typeof positionClasses]} text-3xl sm:text-4xl animate-bounce ${delays[index]}`}
                      >
                        {element.icon}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}