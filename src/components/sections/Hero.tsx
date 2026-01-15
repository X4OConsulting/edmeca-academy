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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-secondary/15 to-amber-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className={`space-y-10 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-blue-50 to-primary/5 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Welcome to Excellence
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                Empowering
                <span className="block bg-gradient-to-r from-primary via-blue-600 to-primary-dark bg-clip-text text-transparent mt-3">
                  Tomorrow&apos;s Leaders
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light max-w-xl">
                At Edmeca Academy, we provide world-class education that transforms lives
                and builds futures. Join a community dedicated to academic excellence,
                personal growth, and lifelong success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#programs"
                  className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-9 py-4 rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 text-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Programs
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="#contact"
                  className="group bg-white text-gray-900 border-2 border-gray-200 hover:border-primary px-9 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-center"
                >
                  <span className="group-hover:text-primary transition-colors">Contact Us</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div className="group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm font-medium text-gray-500 mt-2">Active Students</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">95%</div>
                  <div className="text-sm font-medium text-gray-500 mt-2">Success Rate</div>
                </div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">20+</div>
                  <div className="text-sm font-medium text-gray-500 mt-2">Programs</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image/Visual */}
            <div className={`relative ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-primary via-blue-600 to-primary-dark rounded-3xl shadow-2xl p-12 aspect-square flex items-center justify-center overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="text-center text-white relative z-10">
                    <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-500">🎓</div>
                    <h3 className="text-4xl font-bold mb-3">Your Success</h3>
                    <p className="text-xl text-blue-100">Starts Here</p>
                    <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Enrolling Now
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-8 -right-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">📚</div>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-secondary to-amber-500 text-white p-6 rounded-2xl shadow-2xl hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">⭐</div>
                </div>
                <div className="absolute top-1/4 -left-6 bg-gradient-to-br from-accent to-emerald-500 text-white p-4 rounded-xl shadow-xl hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl">✨</div>
                </div>
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
