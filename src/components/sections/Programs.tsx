'use client';

import { useEffect, useRef, useState } from 'react';

export default function Programs() {
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

  const programs = [
    {
      icon: '📐',
      title: 'Science & Mathematics',
      description: 'Advanced STEM curriculum designed to prepare students for careers in science, technology, and engineering.',
      features: ['Advanced Lab Facilities', 'Expert Instructors', 'Hands-on Projects'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '💼',
      title: 'Business Studies',
      description: 'Comprehensive business education covering management, economics, and entrepreneurship.',
      features: ['Real-world Case Studies', 'Industry Mentorship', 'Practical Training'],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '🎨',
      title: 'Arts & Humanities',
      description: 'Creative programs fostering critical thinking, cultural awareness, and artistic expression.',
      features: ['Creative Studios', 'Cultural Programs', 'Expert Guidance'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '💻',
      title: 'Technology & Computing',
      description: 'Modern tech education covering programming, digital skills, and emerging technologies.',
      features: ['Modern Equipment', 'Industry Tools', 'Certification Programs'],
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: '🌐',
      title: 'Language Studies',
      description: 'Comprehensive language programs to develop communication skills and cultural understanding.',
      features: ['Native Speakers', 'Interactive Learning', 'Cultural Immersion'],
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: '⚽',
      title: 'Sports & Wellness',
      description: 'Programs promoting physical fitness, teamwork, and overall student well-being.',
      features: ['Professional Coaches', 'Modern Facilities', 'Team Building'],
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Our Programs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Discover Your <span className="text-primary">Perfect Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our diverse range of programs designed to unlock your potential
              and prepare you for future success.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-primary ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="text-5xl mb-3 relative z-10">{program.icon}</div>
                  <h3 className="text-2xl font-bold relative z-10">{program.title}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-primary flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gray-50 text-primary font-semibold py-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 group-hover:shadow-md">
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <p className="text-lg text-gray-600 mb-6">
              Can&apos;t find what you&apos;re looking for? We offer customized programs too!
            </p>
            <a
              href="#contact"
              className="inline-block bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
