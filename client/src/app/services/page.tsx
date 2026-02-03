'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Filter, Search, ArrowRight } from 'lucide-react';

const MOCK_SERVICES = [
    {
        id: 1,
        title: "القاعة الملكية الكبرى",
        category: "قاعات",
        price: "50,000",
        rating: 4.9,
        location: "الرياض - حي الخزامى",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
        verified: true
    },
    {
        id: 2,
        title: "بوفيه الأناقة الفرنسية",
        category: "ضيافة",
        price: "15,000",
        rating: 4.8,
        location: "جدة - الكورنيش",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
        verified: true
    },
    {
        id: 3,
        title: "تصوير سينمائي احترافي",
        category: "تصوير",
        price: "8,000",
        rating: 5.0,
        location: "الدمام",
        image: "https://images.unsplash.com/photo-1520390138845-fd2d229dd552?q=80&w=2032&auto=format&fit=crop",
        verified: true
    },
    {
        id: 4,
        title: "فرقة الموسيقى الكلاسيكية",
        category: "ترفيه",
        price: "12,000",
        rating: 4.7,
        location: "الرياض",
        image: "https://images.unsplash.com/photo-1465847899078-b413929f7120?q=80&w=2070&auto=format&fit=crop",
        verified: false
    },
    {
        id: 5,
        title: "تنسيق زهور هولندي فاخر",
        category: "ديكور",
        price: "25,000",
        rating: 4.9,
        location: "الرياض - العليا",
        image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop",
        verified: true
    },
    {
        id: 6,
        title: "خدمة صف السيارات VIP",
        category: "لوجستيك",
        price: "5,000",
        rating: 4.6,
        location: "جميع المناطق",
        image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=2128&auto=format&fit=crop",
        verified: true
    }
];

const CATEGORIES = ["الكل", "قاعات", "ضيافة", "تصوير", "ديكور", "ترفيه", "لوجستيك"];

export default function ServicesPage() {
    const [activeCategory, setActiveCategory] = useState("الكل");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = MOCK_SERVICES.filter(service => {
        const matchesCategory = activeCategory === "الكل" || service.category === activeCategory;
        const matchesSearch = service.title.includes(searchQuery) || service.location.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4B0082]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

                {/* Header Section */}
                <div className="text-center mb-20 space-y-6">
                    <span className="inline-block py-1 px-3 border border-[#D4AF37] rounded-full text-[#D4AF37] text-xs tracking-widest uppercase mb-4">
                        Elite Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
                        <span className="font-serif italic text-gray-400">Discover</span> <span className="text-white font-bold">Perfection</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        نقدم لك نخبة الخدمات الراقية لتجعل من مناسبتك ذكرى لا تُنسى. تصفح مجموعتنا المختارة بعناية من أفضل المزودين في المملكة.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="sticky top-4 z-20 bg-[#050505]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl mb-16">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition duration-300" size={20} />
                            <input
                                type="text"
                                placeholder="ابحث عن خدمة، موقع..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 transition-all duration-300"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 scrollbar-hide">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap backdrop-blur-md border ${activeCategory === cat
                                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((service) => (
                        <div key={service.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Price Tag */}
                                <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end">
                                    <span className="text-xs text-gray-300 mb-1">يبدأ من</span>
                                    <span className="text-xl font-bold text-[#D4AF37] font-serif">{service.price} <span className="text-xs font-sans text-white">ر.س</span></span>
                                </div>

                                {/* Category Badge */}
                                <span className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs text-white">
                                    {service.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{service.title}</h3>
                                        <div className="flex items-center text-gray-400 text-sm gap-2">
                                            <MapPin size={14} className="text-[#D4AF37]" />
                                            {service.location}
                                        </div>
                                    </div>
                                    {service.verified && (
                                        <div className="bg-[#D4AF37]/10 p-1.5 rounded-full" title="Verified">
                                            <Star size={16} className="text-[#D4AF37] fill-[#D4AF37]" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-white">{service.rating}</span>
                                        <span className="text-xs text-gray-500">(120 تقييم)</span>
                                    </div>

                                    <Link href={`/services/${service.id}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group/link">
                                        تفاصيل
                                        <ArrowRight size={16} className="transform group-hover/link:-translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                            <Filter size={32} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-gray-400">حاول تغيير خيارات البحث أو الفلتر</p>
                    </div>
                )}

            </div>
        </div>
    );
}
