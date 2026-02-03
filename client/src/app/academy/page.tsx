import React from 'react';
import { ArrowLeft, BookOpen, User, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AcademyPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
            {/* Hero Section */}
            <section className="relative bg-[#0D0032] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0032] via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col items-center text-center">
                    <span className="bg-[#D9FF5B] text-[#0D0032] px-4 py-1.5 rounded-full font-bold text-sm mb-6 inline-flex items-center gap-2">
                        <Zap size={16} />
                        الدفعة الثالثة مفتوحة الآن
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        أكاديمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9FF5B] to-emerald-400">مرفأ</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
                        برنامج مكثف لتحويل الأفكار إلى شركات ناشئة قابلة للاستثمار في قطاع المناسبات والترفيه.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/register?type=entrepreneur"
                            className="bg-[#D9FF5B] text-[#0D0032] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(217,255,91,0.3)] flex items-center justify-center gap-2"
                        >
                            سجل فكرتك الآن <ArrowLeft size={20} />
                        </Link>
                        <button className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition backdrop-blur-sm">
                            تعرف على المنهج
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#0D0032] mb-4">ماذا تقدم لك الأكاديمية؟</h2>
                        <p className="text-gray-500 text-lg">رحلة متكاملة من الفكرة إلى الإطلاق</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BookOpen className="text-[#8B5CF6]" size={32} />,
                                title: "منهج عملي مكثف",
                                desc: "ورش عمل تطبيقية تغطي نموذج العمل، التسويق، والمالية."
                            },
                            {
                                icon: <User className="text-[#EC4899]" size={32} />,
                                title: "إرشاد نخبة الخبراء",
                                desc: "جلسات توجيه فردية مع مؤسسين ناجحين ومستثمرين."
                            },
                            {
                                icon: <Target className="text-[#10B981]" size={32} />,
                                title: "فرصة استثمار",
                                desc: "يوم عرض نهائي أمام شبكة من المستثمرين الملائكيين."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition card-hover-effect group">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
