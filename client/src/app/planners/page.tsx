'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Star, User } from 'lucide-react';

const planners = [
    {
        id: 1,
        name: 'سارة الحائلي',
        expertise: 'حفلات زفاف تراثية',
        rating: 4.9,
        bio: 'متخصصة في دمج التراث الحائلي مع التصاميم المودرن.',
        color: 'bg-rose-50 text-rose-600'
    },
    {
        id: 2,
        name: 'فهد الرياض',
        expertise: 'مؤتمرات ومعارض',
        rating: 4.8,
        bio: 'خبير في تنظيم الفعاليات الكبرى والبروتوكولات الرسمية.',
        color: 'bg-indigo-50 text-indigo-600'
    },
    {
        id: 3,
        name: 'نورة العتيبي',
        expertise: 'تنسيق زهور وديكور',
        rating: 4.9,
        bio: 'لمسة إبداعية في تنسيق الورود الطبيعية والديكورات الفاخرة.',
        color: 'bg-purple-50 text-purple-600'
    }
];

export default function PlannersPage() {
    return (
        <div className="min-h-screen bg-[#fcfaf7]" dir="rtl">
            <Header />

            <div className="max-w-7xl mx-auto py-12 px-6">
                <header className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-extrabold text-[#2d3436] mb-4">نخبة مخططي الفعاليات</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        خبراء محليون لتحويل رؤيتك إلى واقع ملموس. اختر مستشارك الشخصي لضمان نجاح مناسبتك.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {planners.map((planner, idx) => (
                        <div
                            key={planner.id}
                            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className={`w-20 h-20 ${planner.color} rounded-full mb-6 flex items-center justify-center text-3xl mx-auto`}>
                                <User size={32} />
                            </div>

                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2 text-gray-900">{planner.name}</h3>
                                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block border border-amber-200">
                                    {planner.expertise}
                                </span>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 h-16">{planner.bio}</p>
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-gray-900">{planner.rating}</span>
                                </div>
                                <button
                                    onClick={() => alert(`سيتم التواصل مع المخطط ${planner.name} قريباً`)}
                                    className="bg-[#2d3436] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg hover:shadow-gray-300 transform active:scale-95"
                                >
                                    حجز استشارة
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Concierge Teaser */}
                <div className="mt-20 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">هل تحتاج مساعدة في الاختيار؟</h2>
                        <p className="text-purple-200 mb-8 text-lg">
                            مساعدنا الذكي "سارة" جاهز لترشيح المخطط الأنسب لميزانيتك ونوع مناسبتك.
                        </p>
                        <div onClick={() => document.getElementById('smart-concierge-trigger')?.click()} className="cursor-pointer inline-block bg-white text-purple-900 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg hover:shadow-white/20">
                            استشر المساعد الذكي
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
