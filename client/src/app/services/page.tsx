'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, MapPin, Users, Star, Filter } from 'lucide-react';
import { Header } from '@/components/Header';
// Force rebuild

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
    venue: 'قاعات',
    catering: 'تقديم طعام',
    photography: 'تصوير',
    decoration: 'ديكور',
    entertainment: 'ترفيه',
    planning: 'تنظيم',
    other: 'أخرى',
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
            // Build query params
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
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الخدمات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white" dir="rtl">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-l from-purple-600 to-purple-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
                        اكتشف أفضل خدمات المناسبات 🏰
                    </h1>
                    <p className="text-xl text-purple-100 text-center mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-100">
                        احجز الآن واحصل على نقاط مكافآت فورية!
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto animate-in zoom-in duration-500 delay-200">
                        <div className="bg-white rounded-2xl p-2 shadow-2xl mb-6 ring-4 ring-white/20 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <Search className="text-gray-400 mr-3" size={24} />
                                <input
                                    type="text"
                                    placeholder="ابحث عن قاعة، مصور، أو أي خدمة..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 p-3 text-gray-900 outline-none text-lg"
                                />
                                <button className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition font-bold whitespace-nowrap">
                                    بحث
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-600" />
                        <h2 className="text-lg font-bold text-gray-900">تصفية حسب الفئة</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-bold transition ${selectedCategory === 'all'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-600'
                                }`}
                        >
                            الكل ({services.length})
                        </button>
                        {Object.entries(categoryLabels).map(([key, label]) => {
                            const count = services.filter(s => s.category === key).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`px-6 py-2 rounded-full font-bold transition ${selectedCategory === key
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-600'
                                        }`}
                                >
                                    {label} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Services Grid */}
                {filteredServices.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد خدمات متاحة</h3>
                        <p className="text-gray-600">جرب تغيير معايير البحث أو الفئة</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, index) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Placeholder */}
                                <div className="h-56 bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-purple-600">
                                        {categoryLabels[service.category]}
                                    </div>
                                    {service.average_rating > 0 && (
                                        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-gray-900">{service.average_rating.toFixed(1)}</span>
                                            <span className="text-gray-500 text-sm">({service.total_reviews})</span>
                                        </div>
                                    )}
                                    {service.is_external && (
                                        <div className="absolute bottom-4 right-4 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200 shadow-sm">
                                            Google Maps
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {service.description || 'خدمة مميزة لمناسباتك الخاصة'}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin size={16} className="text-purple-600" />
                                            <span>{service.location}</span>
                                        </div>
                                        {service.capacity && (
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Users size={16} className="text-purple-600" />
                                                <span>يتسع لـ {service.capacity} ضيف</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-sm text-gray-500">يبدأ من</span>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {typeof service.base_price === 'number' ? (
                                                    <>{service.base_price.toLocaleString()} <span className="text-lg">ريال</span></>
                                                ) : (
                                                    service.base_price
                                                )}
                                            </p>
                                        </div>
                                        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-bold">
                                            احجز الآن
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-l from-purple-600 to-purple-800 text-white py-16 px-4 mt-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">هل أنت مقدم خدمة؟</h2>
                    <p className="text-xl text-purple-100 mb-8">
                        انضم إلى منصتنا وابدأ في عرض خدماتك لآلاف العملاء
                    </p>
                    <Link
                        href="/dashboard/services"
                        className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition font-bold text-lg shadow-xl"
                    >
                        ابدأ البيع الآن
                    </Link>
                </div>
            </div>
        </div>
    );
}
