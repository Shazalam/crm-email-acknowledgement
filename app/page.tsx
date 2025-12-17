
import { Metadata } from 'next';
import { Leaf, Zap, Shield, Clock, Phone, ArrowRight, Play, Car } from 'lucide-react';
import HeroContent from './components/HeroContent';
import TestimonialCarousel from './components/TestimonialCarousel';

export const metadata: Metadata = {
  title: 'EcoRide | Premium Eco-Friendly Car Rental',
  description: 'Book electric and hybrid vehicles instantly. Premium insurance included. 99% satisfaction rate.',
  keywords: 'car rental, electric vehicles, eco-friendly, sustainable',
  openGraph: {
    title: 'EcoRide - Drive Green, Live Better',
    description: 'Premium eco-friendly car rental service with 50K+ happy customers',
    url: 'https://ecoride.com',
    type: 'website',
    images: [
      {
        url: 'https://ecoride.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoRide Premium Eco-Friendly Car Rental',
      },
    ],
  },
};

export default function Home() {
  const features = [
    {
      icon: Leaf,
      title: 'Eco-Friendly Fleet',
      description: '100% electric and hybrid vehicles with zero emissions',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Reserve your vehicle in under 60 seconds',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Shield,
      title: 'Premium Insurance',
      description: 'Full coverage included with every rental',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer service',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Business Traveler',
      content: 'The seamless experience and eco-friendly vehicles made my weekly commutes enjoyable. 5-star service!',
      rating: 5,
      image: '/avatars/sarah.jpg',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Family Vacation',
      content: 'Perfect for our family road trip. The kids loved the spacious electric SUV and we saved on gas!',
      rating: 5,
      image: '/avatars/mike.jpg',
    },
    {
      name: 'Emily Watson',
      role: 'Weekend Explorer',
      content: 'Such an easy booking process. The car was spotless and ready to go when I arrived.',
      rating: 4,
      image: '/avatars/emily.jpg',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Premium Vehicles' },
    { number: '24/7', label: 'Support Available' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/30 overflow-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoRide
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Car Rental</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Features', 'Fleet', 'Pricing', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a
                href="#contact"
                className="hidden sm:flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
              <a
                href="#contact"
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform flex items-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <HeroContent stats={stats} />
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Why Choose EcoRide?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're redefining car rental with sustainable solutions and premium experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100/50 backdrop-blur-sm transition-all duration-500 hover:scale-105"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Client Component */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50/50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of satisfied eco-conscious travelers
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Drive Green?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious travelers and experience the future of car rental today.
          </p>
          <a
            href="#contact"
            className="inline-flex bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform space-x-2 group"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EcoRide</span>
              </div>
              <p className="text-gray-400">Premium eco-friendly car rental for the modern traveler.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {['About Us', 'Our Fleet', 'Pricing', 'Locations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                {['Help Center', 'Contact Us', 'FAQs', 'Insurance'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📱 +1 (855) 613-3131</li>
                <li>✉️ support@ecoride.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EcoRide. All rights reserved. Driving towards a greener future.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="#features"
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 transform flex items-center justify-center group"
        >
          <Car className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}