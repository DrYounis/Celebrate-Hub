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
        <div className="min-h-screen bg-[#fdfdfd]" dir="rtl">
            <Header />

            {/* Qondor-Style Hero Section */}
            <div className="relative bg-[#0D0032] text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative max-w-7xl mx-auto text-center z-10">
                    <span className="text-[#D9FF5B] tracking-[0.2em] font-bold text-sm mb-4 block animate-in slide-in-from-bottom-2 fade-in uppercase">
                        Technology x Events
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-['Cairo'] animate-in slide-in-from-bottom-4 fade-in delay-75 leading-tight">
                        بوابتك الذكية <br /> <span className="text-[#D9FF5B]">لتخطيط المستقبل</span>
                    </h1>

                    {/* Tech-Style Search Bar */}
                    <div className="max-w-2xl mx-auto mt-12 relative animate-in zoom-in duration-500 delay-150">
                        <div className="bg-white rounded-full shadow-2xl p-2 flex items-center border-4 border-[#EBE2FF] focus-within:border-[#D9FF5B] transition-colors">
                            <Search className="text-[#0D0032] mr-4 ml-2" size={24} />
                            <input
                                type="text"
                                placeholder="ابحث عن قاعات، خدمات، أو تقنيات..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-[#0D0032] placeholder-gray-400 h-12 px-2 font-medium"
                            />
                            <button className="bg-[#D9FF5B] text-[#0D0032] px-8 py-3 rounded-full font-bold hover:bg-[#c9f046] transition-colors shadow-lg shadow-[#D9FF5B]/20">
                                ابحث الآن
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Tech Pill Filters */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${selectedCategory === 'all'
                                ? 'bg-[#0D0032] text-white border-[#0D0032] shadow-xl'
                                : 'bg-white text-[#0D0032] border-[#EBE2FF] hover:border-[#D9FF5B]'
                                }`}
                        >
                            الكل
                        </button>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 whitespace-nowrap ${selectedCategory === key
                                    ? 'bg-[#0D0032] text-white border-[#0D0032] shadow-xl'
                                    : 'bg-white text-[#0D0032] border-[#EBE2FF] hover:border-[#D9FF5B]'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Refined Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-[#EBE2FF] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-[#0D0032]" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#0D0032] mb-2">عذراً، لم نجد نتائج</h3>
                        <p className="text-gray-500">حاول البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-[#EBE2FF] hover:border-[#D9FF5B] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Image Area */}
                                <div className="h-64 relative overflow-hidden bg-[#EBE2FF]">
                                    <div className={`absolute inset-0 bg-gradient-to-tr transition-opacity duration-500 ${service.is_external ? 'from-blue-900/40 to-transparent' : 'from-[#0D0032]/40 to-transparent'} opacity-0 group-hover:opacity-100`}></div>

                                    {/* Placeholder Gradient if no image (real app would use Image) */}
                                    <div className="w-full h-full bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] group-hover:scale-105 transition-transform duration-700"></div>

                                    {/* Badges */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <span className="bg-white text-[#0D0032] px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                                            {categoryLabels[service.category]}
                                        </span>
                                        {service.is_external && (
                                            <span className="bg-[#4285F4] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                                                <MapPin size={10} /> Google Maps
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-8 relative">
                                    <h3 className="text-2xl font-bold text-[#0D0032] mb-3 line-clamp-1 group-hover:text-[#4a148c] transition-colors">
                                        {service.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-6 text-[#666666] text-sm font-medium">
                                        <MapPin size={16} className="text-[#D9FF5B]" />
                                        <span>{service.location}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-6 mt-2">
                                        <div className="flex items-center gap-1 bg-[#f8f9fa] px-3 py-1 rounded-full">
                                            {service.average_rating > 0 ? (
                                                <>
                                                    <Star size={14} className="text-[#0D0032] fill-[#0D0032]" />
                                                    <span className="font-bold text-[#0D0032]">{service.average_rating.toFixed(1)}</span>
                                                    <span className="text-xs text-gray-500">({service.total_reviews})</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">جديد</span>
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <p className="text-[#0D0032] font-black text-xl">
                                                {typeof service.base_price === 'number' ? (
                                                    <>{service.base_price.toLocaleString()} <span className="text-xs font-medium text-gray-500">ريال</span></>
                                                ) : (
                                                    <span className="text-sm font-bold">{service.base_price}</span>
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

            {/* Tech CTA */}
            <div className="bg-[#EBE2FF] py-24 text-center rounded-t-[3rem] mx-4 mt-8">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-extrabold text-[#0D0032] mb-6">جاهز لإطلاق فعاليتك؟</h2>
                    <p className="text-[#0D0032]/70 mb-10 text-lg font-medium">
                        انضم إلى منصة النخبة وواكب مستقبل إدارة الفعاليات
                    </p>
                    <Link href="/dashboard/services" className="inline-block bg-[#0D0032] text-white px-12 py-4 rounded-full hover:bg-[#1a0536] transition-all duration-300 shadow-xl text-lg font-bold">
                        ابدأ الآن مجاناً
                    </Link>
                </div>
            </div>
        </div>
    );
}
