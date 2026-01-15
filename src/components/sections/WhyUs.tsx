'use client';

import { useEffect, useRef, useState } from 'react';

export default function WhyUs() {
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

  const features = [
    {
      icon: '👨‍🏫',
      title: 'Expert Faculty',
      description: 'Learn from qualified educators with years of experience and passion for teaching.',
      stat: '50+ Qualified Teachers',
    },
    {
      icon: '🏢',
      title: 'Modern Facilities',
      description: 'State-of-the-art classrooms, labs, and resources designed for optimal learning.',
      stat: 'World-Class Infrastructure',
    },
    {
      icon: '🎓',
      title: 'Proven Track Record',
      description: 'Consistently high success rates and student achievements across all programs.',
      stat: '95% Success Rate',
    },
    {
      icon: '🌟',
      title: 'Personalized Learning',
      description: 'Small class sizes ensuring individual attention and customized learning paths.',
      stat: '15:1 Student-Teacher Ratio',
    },
    {
      icon: '🔬',
      title: 'Hands-on Experience',
      description: 'Practical projects, internships, and real-world applications of knowledge.',
      stat: '100+ Partner Organizations',
    },
    {
      icon: '🌍',
      title: 'Global Perspective',
      description: 'International partnerships and diverse learning opportunities for global readiness.',
      stat: 'International Network',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Mdluli',
      role: 'Class of 2023',
      image: '👩‍🎓',
      quote: 'Edmeca Academy transformed my life. The supportive environment and excellent teachers helped me achieve my dreams.',
    },
    {
      name: 'John Nkosi',
      role: 'Parent',
      image: '👨‍💼',
      quote: 'The best decision we made was enrolling our children at Edmeca. The quality of education is outstanding.',
    },
    {
      name: 'Thabo Sithole',
      role: 'Alumni, Engineer',
      image: '🧑‍💻',
      quote: 'The foundation I received at Edmeca prepared me perfectly for university and my career in technology.',
    },
  ];

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              What Makes Us <span className="text-primary">Different</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the advantages that set Edmeca Academy apart and make us the
              preferred choice for quality education.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-primary group ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              What Our Community Says
            </h3>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Hear from students, parents, and alumni who have experienced Edmeca Academy
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.image}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="text-accent text-3xl mb-3">&ldquo;</div>
                  <p className="text-gray-600 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Banner */}
          <div className={`mt-20 bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">10+</div>
                <div className="text-white/90">Years Experience</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">500+</div>
                <div className="text-white/90">Active Students</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-white/90">Expert Teachers</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-white/90">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
