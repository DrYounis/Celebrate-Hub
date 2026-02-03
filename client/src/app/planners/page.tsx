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
        <div className="min-h-screen bg-[#fcfaf7]" dir="rtl">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[60vh] bg-[#1a1a1a] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#4a148c]/20 to-[#1a1a1a]"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide font-['Cairo']">
                        حيث يلتقي <span className="text-[#D4AF37] font-bold">الإبداع</span> بالفخامة
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        في Celebrate Hub، نحن لا ننظم الحفلات فحسب، بل نصنع ذكريات تليق بك.
                    </p>
                    <div className="mt-12 flex justify-center gap-4">
                        <button onClick={() => document.getElementById('consultation-grid')?.scrollIntoView({ behavior: 'smooth' })} className="border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-full hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-500 uppercase tracking-widest text-sm font-bold">
                            خدماتنا
                        </button>
                    </div>
                </div>
            </div>

            <div id="consultation-grid" className="max-w-7xl mx-auto py-24 px-6 relative">
                {/* Background Decorative */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4a148c]/5 rounded-full blur-3xl -z-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Item: Featured (Purple) */}
                    <div className="md:col-span-2 bg-[#4a148c] text-white rounded-[2rem] p-12 relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-right">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 text-[#D4AF37] border border-[#D4AF37]/30">
                                    {services[0].icon}
                                </div>
                                <h2 className="text-4xl font-bold mb-2">{services[0].title}</h2>
                                <p className="text-[#D4AF37] uppercase tracking-widest text-sm mb-6">{services[0].subtitle}</p>
                                <p className="text-purple-100 text-lg leading-relaxed mb-8 max-w-xl">
                                    {services[0].description}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {services[0].features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            <CheckCircle size={16} className="text-[#D4AF37]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="bg-[#D4AF37] text-[#1a1a1a] px-8 py-3 rounded-full font-bold hover:bg-white transition-colors shadow-lg shadow-black/20">
                                    طلب عرض سعر
                                </button>
                            </div>
                            <div className="flex-1 h-64 w-full bg-black/20 rounded-xl overflow-hidden relative">
                                {/* Placeholder for Wedding Image */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#38006b] to-transparent"></div>
                                <div className="absolute bottom-4 right-4 text-white/50 text-xs">صورة تعبيرية</div>
                            </div>
                        </div>
                    </div>

                    {/* Other Items */}
                    {services.slice(1).map((service, idx) => (
                        <div
                            key={service.id}
                            className="bg-white p-10 rounded-[2rem] border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                            style={{ animationDelay: `${(idx + 1) * 150}ms` }}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#4a148c] group-hover:bg-[#4a148c] group-hover:text-white transition-colors duration-500">
                                    {service.icon}
                                </div>
                                <span className="text-5xl font-serif text-gray-100 font-bold group-hover:text-[#D4AF37]/20 transition-colors">0{service.id}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-1">{service.title}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{service.subtitle}</p>

                            <p className="text-gray-600 mb-8 leading-relaxed h-16">
                                {service.description}
                            </p>

                            <div className="space-y-3 mb-8">
                                {service.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <Link href="/dashboard/services" className="text-[#4a148c] font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">
                                    تفاصيل أكثر <ArrowLeft size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-[#1a1a1a] border-t border-white/5 py-16 text-center">
                <h2 className="text-2xl text-white font-light mb-8">هل لديك استفسار خاص؟</h2>
                <button onClick={() => document.getElementById('smart-concierge-trigger')?.click()} className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm">
                    <Crown size={20} className="text-[#D4AF37]" />
                    محادثة مع المنسق الذكي
                </button>
            </div>
        </div>
    );
}
