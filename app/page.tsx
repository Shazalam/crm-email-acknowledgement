// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Car,
  Shield,
  Zap,
  Star,
  Clock,
  Leaf,
  ArrowRight,
  Play,
  Phone
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Eco-Friendly Fleet",
      description: "100% electric and hybrid vehicles with zero emissions",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Booking",
      description: "Reserve your vehicle in under 60 seconds",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Premium Insurance",
      description: "Full coverage included with every rental",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Business Traveler",
      content: "The seamless experience and eco-friendly vehicles made my weekly commutes enjoyable. 5-star service!",
      rating: 5,
      image: "/avatars/sarah.jpg"
    },
    {
      name: "Mike Rodriguez",
      role: "Family Vacation",
      content: "Perfect for our family road trip. The kids loved the spacious electric SUV and we saved on gas!",
      rating: 5,
      image: "/avatars/mike.jpg"
    },
    {
      name: "Emily Watson",
      role: "Weekend Explorer",
      content: "Such an easy booking process. The car was spotless and ready to go when I arrived.",
      rating: 4,
      image: "/avatars/emily.jpg"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "500+", label: "Premium Vehicles" },
    { number: "24/7", label: "Support Available" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/30 overflow-hidden">
      {/* Enhanced Header with Glass Morphism */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
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
                href="#footer"
                className="hidden sm:flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-105"
              >
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </a>
              <a
                href="#footer"
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform flex items-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/20"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-200/50 text-green-700 text-sm font-medium shadow-sm mt-6">
                  <Zap className="h-4 w-4 mr-2" />
                  🚀 Premium Eco-Friendly Car Rental
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Drive Green,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Live Better.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Experience the future of car rental with our premium electric and hybrid fleet.
                  Sustainable, efficient, and designed for the modern traveler who cares about our planet.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#footer"
                  className="group relative bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform text-center"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>Book Your Eco-Ride</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </a>

                <a
                  href="#footer"
                  className="group border-2 border-gray-300/80 text-gray-700 px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover:border-green-400/50 text-center backdrop-blur-sm bg-white/50"
                >
                  <span className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    <Play className="h-5 w-5" />
                    <span>Watch Demo</span>
                  </span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced Hero Visual */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Main Car Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="aspect-video relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {/* Placeholder for car image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Car className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Premium Electric Vehicle</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
                </div>

                {/* Floating Feature Cards */}
                <div className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Fast Charging</div>
                      <div className="text-sm text-gray-600">30 min to 80%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-1/4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Full Coverage</div>
                      <div className="text-sm text-gray-600">Zero Deductible</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Why Choose EcoRide?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {`We're redefining car rental with sustainable solutions and premium experiences`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100/50 backdrop-blur-sm transition-all duration-500 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              {/* Testimonial Content */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-2xl text-gray-700 italic leading-relaxed">
                  `{testimonials[activeTestimonial].content}`
                </p>
              </div>

              {/* Author */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {testimonials[activeTestimonial].name.charAt(0)}
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{testimonials[activeTestimonial].name}</h4>
                <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Drive Green?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious travelers and experience the future of car rental today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#features"
              className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform flex items-center justify-center space-x-2 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>

          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="footer" className="bg-gray-900 text-white py-16">
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
              <p className="text-gray-400">
                Premium eco-friendly car rental for the modern traveler.
              </p>
              {/* <div className="flex space-x-4">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                ))}
              </div> */}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {['About Us', 'Our Fleet', 'Pricing', 'Locations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
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
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📱 +1 (855) 613-3131</li>
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