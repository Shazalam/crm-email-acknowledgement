import Image from 'next/image';
import { ArrowRight, Play, Car, Zap, Shield } from 'lucide-react';

interface HeroContentProps {
    stats: Array<{ number: string; label: string }>;
}

export default function HeroContent({ stats }: HeroContentProps) {
    return (
        <>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/20"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
                                Experience the future of car rental with our premium electric and hybrid fleet. Sustainable, efficient, and designed for the modern traveler who cares about our planet.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#contact"
                                className="group relative bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform text-center"
                            >
                                <span className="relative z-10 flex items-center justify-center space-x-2">
                                    <Car className="h-5 w-5" />
                                    <span>Book Your Eco-Ride</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>

                            <a
                                href="#features"
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
                                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Hero Visual */}
                    <div className="relative animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
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
        </>
    );
}