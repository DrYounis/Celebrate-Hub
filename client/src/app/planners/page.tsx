'use client';

import React from 'react';
import Link from 'next/link';
import { BadgeCheck, Star, Award, Instagram, Globe } from 'lucide-react';

const MOCK_PLANNERS = [
    {
        id: 1,
        name: "سارة العلي",
        business: "لمسات مخملية",
        role: "Master Planner",
        rating: 5.0,
        reviews: 84,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
        specialty: "حفلات زفاف ملكية",
        isverified: true
    },
    {
        id: 2,
        name: "خالد المنصور",
        business: "إبداع بلا حدود",
        role: "Event Architect",
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop",
        specialty: "مؤتمرات دولية",
        isverified: true
    },
    {
        id: 3,
        name: "نورة الجابر",
        business: "Noura Events",
        role: "Floral Designer",
        rating: 4.9,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        cover: "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2070&auto=format&fit=crop",
        specialty: "حفلات خاصة",
        isverified: true
    }
];

export default function PlannersPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#D4AF37]/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

                {/* Cinematic Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
                            <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm">The Curators</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Architects of</span> <br />
                            <span className="font-serif italic font-light text-[#D4AF37]">Unforgettable Moments</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-lg leading-relaxed">
                            نجمع لك نخبة منظمي الفعاليات في الشرق الأوسط. محترفون يتقنون فن تحويل الأحلام إلى واقع ملموس بدقة متناهية.
                        </p>
                    </div>

                    <div className="flex gap-8 text-center bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">50+</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Top Planners</div>
                        </div>
                        <div className="w-[1px] bg-white/10"></div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Verified</div>
                        </div>
                    </div>
                </div>

                {/* Planners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {MOCK_PLANNERS.map((planner) => (
                        <div key={planner.id} className="group relative">
                            {/* Card Background & Border */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37] to-purple-600 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>

                            <div className="relative bg-[#0a0a0a] rounded-[1.9rem] overflow-hidden border border-white/10 h-full flex flex-col">

                                {/* Cover Image */}
                                <div className="h-48 overflow-hidden relative">
                                    <img src={planner.cover} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>

                                    {/* Verified Badge */}
                                    {planner.isverified && (
                                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
                                            <BadgeCheck size={14} className="text-[#D4AF37]" />
                                            <span className="text-[10px] text-[#D4AF37] font-bold tracking-wider uppercase">Verified Pro</span>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Content */}
                                <div className="px-8 pb-8 -mt-12 flex-1 flex flex-col">
                                    {/* Avatar */}
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#0a0a0a] shadow-xl mb-4 group-hover:-translate-y-2 transition duration-300">
                                        <img src={planner.image} alt={planner.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{planner.name}</h3>
                                            <p className="text-purple-400 text-sm font-medium">{planner.business}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-sm">{planner.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6 flex-1">
                                        متخصص في <span className="text-gray-300">{planner.specialty}</span>. {planner.role} مع خبرة في إدارة الفعاليات الفاخرة.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex gap-4 border-t border-white/5 pt-4">
                                            <div className="flex-1 text-center border-r border-white/5">
                                                <div className="text-lg font-bold text-white">{planner.reviews}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">Reviews</div>
                                            </div>
                                            <div className="flex-1 text-center">
                                                <div className="text-lg font-bold text-white">50+</div>
                                                <div className="text-[10px] text-gray-500 uppercase">Projects</div>
                                            </div>
                                        </div>

                                        <button className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg">
                                            <span>تواصل مع {planner.name.split(' ')[0]}</span>
                                            <ArrowRight size={18} className="transform group-hover/btn:-translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
