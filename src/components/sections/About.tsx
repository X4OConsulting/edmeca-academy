'use client';

import { useEffect, useRef, useState } from 'react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for the highest standards in education and student achievement.',
    },
    {
      icon: '🤝',
      title: 'Integrity',
      description: 'We build trust through honesty, transparency, and ethical practices.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We embrace modern teaching methods and cutting-edge technology.',
    },
    {
      icon: '🌍',
      title: 'Community',
      description: 'We foster a supportive environment where everyone can thrive together.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Building Tomorrow&apos;s <span className="text-primary">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Founded on the principles of excellence and innovation, Edmeca Academy has been
              transforming lives through quality education for years.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left - Image/Visual */}
            <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-7xl mb-6">🏫</div>
                    <h3 className="text-3xl font-bold mb-2">Edmeca Academy</h3>
                    <p className="text-lg">Where Dreams Take Flight</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">10+</div>
                    <div className="text-xs text-white/90">Years</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className={`space-y-6 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <h3 className="text-3xl font-bold text-gray-900">
                Our Mission & Vision
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Edmeca Academy, we are committed to providing an educational experience
                that goes beyond textbooks. We nurture critical thinking, creativity, and
                character development in every student.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our experienced educators use innovative teaching methods combined with
                personalized attention to ensure each student reaches their full potential.
              </p>
              <div className="flex items-start space-x-3 bg-primary/5 p-4 rounded-lg">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Our Promise</h4>
                  <p className="text-gray-600">
                    We promise to provide a safe, inclusive, and inspiring learning
                    environment where every student can discover their unique talents and
                    achieve their dreams.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Core Values
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-100 p-6 rounded-2xl hover:border-primary hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
