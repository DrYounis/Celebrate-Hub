'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Crown, Briefcase, PartyPopper, Palette, Music, CheckCircle } from 'lucide-react';

const services = [
    {
        id: 1,
        title: 'تنظيم حفلات الزفاف الملكية',
        description: 'نحول ليلة العمر إلى أسطورة لا تُنسى. نهتم بأدق التفاصيل من الكوشة إلى الضيافة، مع لمسات تراثية وعصرية.',
        icon: <Crown size={40} />,
        features: ['تصميم ثيم خاص', 'تنسيق القاعات', 'إدارة الحضور', 'ضيافة VIP'],
        color: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
        id: 2,
        title: 'إدارة الفعاليات المؤسسية',
        description: 'حلول متكاملة للمؤتمرات والمعارض وإطلاق المنتجات. نضمن لك واجهة مشرفة تعكس هوية شركتك.',
        icon: <Briefcase size={40} />,
        features: ['تجهيزات صوتية ومرئية', 'تسجيل الحضور', 'التغطية الإعلامية', 'تصميم الأجنحة'],
        color: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
        id: 3,
        title: 'المناسبات الخاصة والاحتفالات',
        description: 'سواء كان حفل تخرج، عيد ميلاد، أو عشاء خاص، فريقنا جاهز لابتكار أجواء ساحرة تناسب ذوقك.',
        icon: <PartyPopper size={40} />,
        features: ['تنسيق الزهور', 'كيك وحلويات', 'هدايا وتوزيعات', 'عروض ترفيهية'],
        color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
        id: 4,
        title: 'التصميم والديكور الإبداعي',
        description: 'نمتلك فريقاً من المصمين المحترفين لتحويل الأماكن الفارغة إلى لوحات فنية تبهر ضيوفك.',
        icon: <Palette size={40} />,
        features: ['تصاميم 3D', 'إضاءة معمارية', 'أثاث فاخر', 'تنسيق طاولات'],
        color: 'bg-amber-50 text-amber-600 border-amber-100'
    }
];

export default function PlannersPage() {
    return (
        <div className="min-h-screen bg-[#fcfaf7]" dir="rtl">
            <Header />

            <div className="max-w-7xl mx-auto py-16 px-6">
                {/* Hero Section */}
                <header className="text-center mb-20 animate-in slide-in-from-bottom-4 duration-700">
                    <span className="text-purple-600 font-bold tracking-wider uppercase text-sm bg-purple-100 px-4 py-1 rounded-full mb-4 inline-block">
                        خدماتنا الاحترافية
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#2d3436] mb-6 leading-tight">
                        نبتكر.. نخطط.. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ونبهر</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        في Celebrate Hub، لا نقدم مجرد خدمات، بل نصنع تجارب خالدة. فريقنا المتكامل من الخبراء جاهز لتحويل أي فكرة إلى واقع ملموس بأعلى معايير الجودة والإتقان.
                    </p>
                </header>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {services.map((service, idx) => (
                        <div
                            key={service.id}
                            className={`group bg-white rounded-[2rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border ${service.color.split(' ')[2]} hover:-translate-y-2 relative overflow-hidden`}
                        >
                            <div className={`w-20 h-20 ${service.color.split(' ')[0]} ${service.color.split(' ')[1]} rounded-2xl mb-8 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                                {service.icon}
                            </div>

                            <h3 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-700 transition-colors">{service.title}</h3>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">{service.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {service.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                                        <CheckCircle size={18} className="text-green-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-purple-500 transition-all duration-700"></div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="relative bg-[#2d3436] rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl mx-auto max-w-5xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">جاهز لبدء التخطيط لمناسبتك؟</h2>
                        <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
                            دعنا نتولى التفاصيل بينما تستمتع أنت باللحظة. فريقنا بانتظار تواصلك لتقديم عرض سعر مخصص.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button onClick={() => document.getElementById('smart-concierge-trigger')?.click()} className="bg-white text-[#2d3436] px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl hover:shadow-white/20 transform hover:-translate-y-1">
                                استشر المخطط الذكي
                            </button>
                            <a href="/dashboard/services" className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition backdrop-blur-sm">
                                تصفح جميع الخدمات
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
