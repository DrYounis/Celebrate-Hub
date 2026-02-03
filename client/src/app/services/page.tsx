'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, Star, Filter, ArrowLeft, Crown } from 'lucide-react';
import { Header } from '@/components/Header';
import { HAIL_VENUES } from '@/lib/hail-data';

interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    base_price: number | string;
    location: string;
    capacity: number;
    average_rating: number;
    total_reviews: number;
    provider_id: string;
    is_external?: boolean;
    profiles: {
        business_name: string;
    };
}

const categoryLabels: Record<string, string> = {
    venue: 'قاعات ملكية',
    catering: 'ضيافة فاخرة',
    photography: 'توثيق اللحظات',
    decoration: 'ديكور وتصاميم',
    entertainment: 'عروض فنية',
    planning: 'تخطيط شامل',
    other: 'خدمات أخرى',
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [selectedCategory, searchQuery, services]);

    const fetchServices = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

            const res = await fetch(`/api/search?${params.toString()}`);
            const data = await res.json();

            if (data.services) {
                setServices(data.services);
                setFilteredServices(data.services);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = services;
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q) ||
                s.location?.toLowerCase().includes(q)
            );
        }
        setFilteredServices(filtered);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#e0e0e0] border-t-[#D4AF37] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Crown size={20} className="text-[#D4AF37]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfaf7]" dir="rtl">
            <Header />

            {/* Luxurious Hero Section */}
            <div className="relative bg-[#4a148c] text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a148c] via-transparent to-transparent"></div>

                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <span className="text-[#D4AF37] tracking-[0.2em] font-medium text-sm mb-4 block animate-in slide-in-from-bottom-2 fade-in">
                        الفخامة . الأصالة . التميز
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-['Cairo'] animate-in slide-in-from-bottom-4 fade-in delay-75">
                        وجهتك الأولى للمناسبات الراقية
                    </h1>

                    {/* Golden Search Bar */}
                    <div className="max-w-2xl mx-auto mt-12 relative animate-in zoom-in duration-500 delay-150">
                        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl p-2 flex items-center border border-[#D4AF37]/30 ring-4 ring-[#D4AF37]/10 transition-all focus-within:ring-[#D4AF37]/30 focus-within:scale-[1.02]">
                            <Search className="text-[#D4AF37] mr-4 ml-2" size={24} />
                            <input
                                type="text"
                                placeholder="ابحث عن قاعة، فندق، أو خدمات VIP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 h-10 px-2"
                            />
                            <button className="bg-[#4a148c] text-white px-8 py-3 rounded-full font-bold hover:bg-[#38006b] transition-colors shadow-lg">
                                بحث
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Elegant Filters */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex bg-white p-2 rounded-full shadow-sm border border-gray-100 w-max mx-auto gap-1">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${selectedCategory === 'all'
                                ? 'bg-[#4a148c] text-white shadow-md transform scale-105'
                                : 'text-gray-500 hover:text-[#4a148c] hover:bg-purple-50'
                                }`}
                        >
                            الكل
                        </button>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-6 py-2 rounded-full font-bold transition-all duration-300 whitespace-nowrap ${selectedCategory === key
                                    ? 'bg-[#4a148c] text-white shadow-md transform scale-105'
                                    : 'text-gray-500 hover:text-[#4a148c] hover:bg-purple-50'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Refined Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">عذراً، لم نجد نتائج</h3>
                        <p className="text-gray-500">حاول البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                className="group bg-white rounded-[20px] overflow-hidden border border-[#e0e0e0] hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 block animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Image Area */}
                                <div className="h-64 relative overflow-hidden bg-gray-100">
                                    <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-500 ${service.is_external ? 'from-blue-900/40 to-transparent' : 'from-[#4a148c]/40 to-transparent'} opacity-0 group-hover:opacity-100`}></div>

                                    {/* Placeholder Gradient if no image (real app would use Image) */}
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700"></div>

                                    {/* Badges */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-sm text-[#4a148c] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            {categoryLabels[service.category]}
                                        </span>
                                        {service.is_external && (
                                            <span className="bg-[#4285F4] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                                <MapPin size={10} /> Google Maps
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 relative">
                                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-[#4a148c] transition-colors">
                                        {service.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4 text-[#666666] text-sm">
                                        <MapPin size={14} className="text-[#D4AF37]" />
                                        <span>{service.location}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            {service.average_rating > 0 ? (
                                                <>
                                                    <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                                                    <span className="font-bold">{service.average_rating.toFixed(1)}</span>
                                                    <span className="text-xs text-gray-400">({service.total_reviews})</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">جديد</span>
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <p className="text-[#D4AF37] font-bold text-lg">
                                                {typeof service.base_price === 'number' ? (
                                                    <>{service.base_price.toLocaleString()} <span className="text-xs text-gray-500">ريال</span></>
                                                ) : (
                                                    <span className="text-sm">{service.base_price}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Minimalist CTA */}
            <div className="bg-[#1a1a1a] text-[#fcfaf7] py-20 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-light mb-6">هل تمتلك خدمات استثنائية؟</h2>
                    <p className="text-gray-400 mb-8 font-light">
                        انضم إلى نخبة مقدمي الخدمات في المملكة وشارك في صياغة أفخم المناسبات.
                    </p>
                    <Link href="/dashboard/services" className="inline-block border border-[#D4AF37] text-[#D4AF37] px-10 py-3 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold">
                        انضم إلينا
                    </Link>
                </div>
            </div>
        </div>
    );
}
