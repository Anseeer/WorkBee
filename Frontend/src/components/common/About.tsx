import React from 'react';
import { Users, Shield, Clock, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
    const navigate = useNavigate()
    const features = [
        {
            icon: <Shield className="w-8 h-8 text-[#2B4E34]" />,
            title: 'Verified Workers',
            description: 'All workers undergo thorough background checks and verification processes.'
        },
        {
            icon: <Clock className="w-8 h-8 text-[#2B4E34]" />,
            title: 'Quick Booking',
            description: 'Book services instantly and get workers assigned within minutes.'
        },
        {
            icon: <Star className="w-8 h-8 text-[#2B4E34]" />,
            title: 'Quality Assurance',
            description: 'Rating system ensures only the best workers continue to serve you.'
        },
        {
            icon: <Award className="w-8 h-8 text-[#2B4E34]" />,
            title: 'Professional Service',
            description: 'Skilled workers with proven expertise in their respective fields.'
        }
    ];

    const steps = [
        {
            step: '1',
            title: 'Choose a Service',
            description: 'Browse through our wide range of home and professional services.'
        },
        {
            step: '2',
            title: 'Book a Worker',
            description: 'Select your preferred time slot and book a verified worker instantly.'
        },
        {
            step: '3',
            title: 'Track Progress',
            description: 'Monitor work status in real-time and communicate via in-app chat.'
        },
        {
            step: '4',
            title: 'Rate & Pay',
            description: 'Complete secure payment and rate your experience to help others.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#2B4E34] to-[#1a2e20] text-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl merienda-text md:text-6xl font-bold mb-6 animate-fade-in">
                            WorkBee
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                            Your trusted marketplace connecting skilled workers with those who need their services.
                            Building communities through reliable, professional service delivery.
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </section>

            {/* Our Mission Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Mission
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            At WorkBee, we believe everyone deserves access to reliable, professional services.
                            Our mission is to bridge the gap between skilled workers seeking opportunities and
                            customers needing quality services.
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            We empower workers by providing them with a platform to showcase their skills,
                            build their reputation, and grow their business. For customers, we offer peace of
                            mind through verified workers, transparent pricing, and quality assurance.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#2B4E34]">10k+</div>
                                <div className="text-sm text-gray-600">Active Workers</div>
                            </div>
                            <div className="w-px h-12 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#2B4E34]">50k+</div>
                                <div className="text-sm text-gray-600">Happy Customers</div>
                            </div>
                            <div className="w-px h-12 bg-gray-300"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#2B4E34]">100k+</div>
                                <div className="text-sm text-gray-600">Jobs Completed</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-[#2B4E34]/10 rounded-2xl p-8 backdrop-blur">
                            <Users className="w-20 h-20 text-[#2B4E34] mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
                                Building Trust, One Service at a Time
                            </h3>
                            <p className="text-gray-700 text-center">
                                We're more than a platform – we're a community dedicated to excellence,
                                reliability, and mutual growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Getting started with WorkBee is simple. Follow these easy steps to book your service.
                    </p>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-[#2B4E34] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose WorkBee Section */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                    Why Choose WorkBee?
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    We're committed to providing the best experience for both customers and workers.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#2B4E34] text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-gray-200 mb-8">
                        Join thousands of satisfied customers or become a worker and grow your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/')} className="bg-white text-[#2B4E34] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                            Book a Service
                        </button>
                        <button onClick={() => navigate('/workers')} className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                            Become a Worker
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;