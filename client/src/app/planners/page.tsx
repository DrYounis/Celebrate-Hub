'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Crown, Briefcase, PartyPopper, Palette, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        id: 1,
        title: 'الأعراس الملكية',
        subtitle: 'Royal Weddings',
        description: 'نحول ليلة العمر إلى أسطورة. تخطيط متكامل يمزج بين عراقة التقاليد وفخامة الحداثة.',
        icon: <Crown size={32} />,
        features: ['كوشات بتصاميم حصرية', 'ضيافة ملكية VIP', 'إخراج فني وسينمائي'],
        color: 'bg-[#4a148c]',
        textColor: 'text-white'
    },
    {
        id: 2,
        title: 'المحافل الدولية',
        subtitle: 'Corporate Events',
        description: 'واجهة مشرفة لشركتك. تنظيم دقيق للمؤتمرات والمعارض وإطلاق العلامات التجارية.',
        icon: <Briefcase size={32} />,
        features: ['تجهيزات لوجستية', 'أنظمة صوت وإضاءة', 'تغطية إعلامية'],
        color: 'bg-white',
        textColor: 'text-[#1a1a1a]'
    },
    {
        id: 3,
        title: 'المناسبات الخاصة',
        subtitle: 'Private Events',
        description: 'احتفالات مصممة خصيصاً لتعكس ذوقك الرفيع. من حفلات التخرج إلى العشاء الخاص.',
        icon: <PartyPopper size={32} />,
        features: ['ديكورات موسمية', 'تنسيق زهور عالمي', 'فرق فنية وموسيقية'],
        color: 'bg-white',
        textColor: 'text-[#1a1a1a]'
    },
    {
        id: 4,
        title: 'التصميم الإبداعي',
        subtitle: 'Creative Design',
        description: 'نمتلك استوديو تصميم داخلي لتحويل المساحات إلى لوحات فنية تخطف الأنظار.',
        icon: <Palette size={32} />,
        features: ['تصاميم ثلاثية الأبعاد', 'هوية بصرية للحدث', 'أثاث فاخر'],
        color: 'bg-white',
        textColor: 'text-[#1a1a1a]'
    }
];

export default function PlannersPage() {
    return (
        <div className="min-h-screen bg-[#fdfdfd]" dir="rtl">
            <Header />

            {/* Qondor Hero Section */}
            <div className="relative h-[70vh] bg-[#0D0032] overflow-hidden flex items-center justify-center">
                {/* Abstract 3D Shapes */}
                <div className="absolute top-10 right-20 w-32 h-32 bg-[#D9FF5B] rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-10 left-20 w-64 h-64 bg-[#EBE2FF] rounded-full blur-[100px] opacity-10"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block px-4 py-2 bg-[#1a0536] text-[#D9FF5B] rounded-full text-sm font-bold mb-6 border border-[#2a1050]">
                        Event Management 2.0
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight font-['Cairo']">
                        الفاعلية <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9FF5B] to-[#bce63b]">تتحدث</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        حلول تقنية متكاملة لإدارة الحشود، التنظيم اللوجستي، وتصميم التجارب الاستثنائية.
                    </p>
                    <div className="mt-12 flex justify-center gap-4">
                        <button onClick={() => document.getElementById('consultation-grid')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#D9FF5B] text-[#0D0032] px-10 py-4 rounded-full hover:bg-[#c9f046] transition-all duration-300 text-lg font-bold shadow-[0_0_20px_rgba(217,255,91,0.3)]">
                            اكتشف حلولنا
                        </button>
                    </div>
                </div>
            </div>

            <div id="consultation-grid" className="max-w-7xl mx-auto py-24 px-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Item: Featured (Navy) */}
                    <div className="md:col-span-2 bg-[#0D0032] text-white rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D9FF5B]/10 rounded-full blur-3xl -z-0"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-right">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8 text-[#D9FF5B] border border-[#D9FF5B]/30 backdrop-blur-sm">
                                    {services[0].icon}
                                </div>
                                <h2 className="text-5xl font-extrabold mb-4">{services[0].title}</h2>
                                <p className="text-[#D9FF5B] uppercase tracking-widest text-sm font-bold mb-6">{services[0].subtitle}</p>
                                <p className="text-gray-300 text-xl leading-relaxed mb-10 max-w-xl">
                                    {services[0].description}
                                </p>
                                <button className="bg-[#D9FF5B] text-[#0D0032] px-10 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-lg">
                                    احجز استشارة
                                </button>
                            </div>
                            <div className="flex-1 h-80 w-full bg-[#1a0536] rounded-[2rem] border border-[#2a1050] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0032] via-transparent to-transparent z-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-[#2a1050] font-black text-9xl opacity-20">01</div>
                            </div>
                        </div>
                    </div>

                    {/* Other Items */}
                    {services.slice(1).map((service, idx) => (
                        <div
                            key={service.id}
                            className="bg-white p-12 rounded-[3rem] border border-[#EBE2FF] hover:border-[#D9FF5B] hover:shadow-2xl transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards flex flex-col justify-between"
                            style={{ animationDelay: `${(idx + 1) * 150}ms` }}
                        >
                            <div>
                                <div className="w-16 h-16 bg-[#EBE2FF] rounded-2xl flex items-center justify-center text-[#0D0032] group-hover:bg-[#0D0032] group-hover:text-[#D9FF5B] transition-colors duration-500 mb-8">
                                    {service.icon}
                                </div>

                                <h3 className="text-3xl font-extrabold text-[#0D0032] mb-2">{service.title}</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">{service.subtitle}</p>

                                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                    {service.description}
                                </p>
                            </div>

                            <div>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {service.features.map((f, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#f0f0f0] rounded-full text-xs font-bold text-gray-500">
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/dashboard/services" className="inline-flex items-center justify-center w-full bg-[#f8f9fa] text-[#0D0032] py-4 rounded-full font-bold hover:bg-[#0D0032] hover:text-white transition-all group-hover:shadow-lg">
                                    عرض التفاصيل
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Qondor Footer CTA */}
            <div className="bg-[#0D0032] py-24 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D9FF5B] to-transparent opacity-30"></div>
                <h2 className="text-4xl text-white font-black mb-8">جاهز لتجربة "Qondor Style"؟</h2>
                <button onClick={() => document.getElementById('smart-concierge-trigger')?.click()} className="inline-flex items-center gap-3 bg-[#D9FF5B] text-[#0D0032] px-12 py-5 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(217,255,91,0.2)] font-bold text-lg">
                    <Crown size={24} className="text-[#0D0032]" />
                    ابدأ التخطيط الذكي
                </button>
            </div>
        </div>
    );
}
