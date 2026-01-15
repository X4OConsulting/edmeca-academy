import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'Home', href: '#home' },
      { name: 'About Us', href: '#about' },
      { name: 'Programs', href: '#programs' },
      { name: 'Contact', href: '#contact' },
    ],
    programs: [
      { name: 'Science & Mathematics', href: '#programs' },
      { name: 'Business Studies', href: '#programs' },
      { name: 'Arts & Humanities', href: '#programs' },
      { name: 'Technology & Computing', href: '#programs' },
    ],
    resources: [
      { name: 'Admissions', href: '#contact' },
      { name: 'Student Portal', href: '#' },
      { name: 'Parent Resources', href: '#' },
      { name: 'Career Guidance', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="text-2xl font-bold text-white">
                Edmeca <span className="text-primary">Academy</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering tomorrow&apos;s leaders through excellence in education and
              personalized learning experiences.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <span className="text-lg">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300"
                aria-label="Twitter"
              >
                <span className="text-lg">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <span className="text-lg">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300"
                aria-label="LinkedIn"
              >
                <span className="text-lg">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Our Programs</h3>
            <ul className="space-y-3">
              {footerLinks.programs.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="text-primary text-xl mt-1">📍</span>
                <div>
                  <p className="text-gray-400">123 Education Street</p>
                  <p className="text-gray-400">Johannesburg, SA</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary text-xl mt-1">📞</span>
                <div>
                  <p className="text-gray-400">+27 (0)11 123 4567</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary text-xl mt-1">✉️</span>
                <div>
                  <p className="text-gray-400">info@edmeca.co.za</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-bold text-xl mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest news and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
              />
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Edmeca Academy. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
}
