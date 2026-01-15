'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="inline-block">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  Welcome to Excellence
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Empowering
                <span className="block text-primary mt-2">Tomorrow&apos;s Leaders</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                At Edmeca Academy, we provide world-class education that transforms lives
                and builds futures. Join a community dedicated to academic excellence,
                personal growth, and lifelong success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#programs"
                  className="group bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
                >
                  Explore Programs
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
                <Link
                  href="#contact"
                  className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  Contact Us
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                  <div className="text-sm text-gray-600 mt-1">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">95%</div>
                  <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">20+</div>
                  <div className="text-sm text-gray-600 mt-1">Programs</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image/Visual */}
            <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="relative aspect-square">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-primary rounded-3xl shadow-2xl transform -rotate-3 hover:-rotate-6 transition-transform duration-500 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-2xl font-bold">Your Success</h3>
                    <p className="text-lg mt-2">Starts Here</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                <div className="text-3xl">📚</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                <div className="text-3xl">🌟</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-gray-400 hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </a>
      </div>
    </section>
  );
}
