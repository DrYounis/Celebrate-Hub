'use client';

import React, { useState } from 'react';

type Service = {
    id: number;
    name: string;
    category: string;
    price: string;
    rating: number;
    xpReward: number;
    description: string;
    features: string[];
};

const servicesData: Service[] = [
    {
        id: 1,
        name: 'زلطه (Zalatah)',
        category: 'الضيافة والعشاء',
        price: '6,000 ر.س',
        rating: 4.7,
        xpReward: 15,
        description: 'خيار معاصر لتقديم أطباق مبتكرة وضيافة خارجية فاخرة.',
        features: ['بوفيه مفتوح', 'تقديم عصري', 'مناسب للتجمعات النوعية']
    },
    {
        id: 2,
        name: 'فلوري كادو',
        category: 'التنسيق والديكور',
        price: '4,000 ر.س',
        rating: 4.8,
        xpReward: 10,
        description: 'متخصصون في تحويل المساحات بلمسات فنية وزهور طبيعية.',
        features: ['تنسيق ورد طبيعي', 'تجهيز قاعات', 'تصميم ثيمات']
    },
    {
        id: 3,
        name: 'توصيل مشاوير بحائل',
        category: 'النقل',
        price: '2,000 ر.س',
        rating: 4.0,
        xpReward: 5,
        description: 'خدمة نقل موثوقة للأفراد والمجموعات داخل وخارج مدينة حائل.',
        features: ['خدمة 24 ساعة', 'سيارات حديثة', 'دقة في المواعيد']
    }
];

const ServicesPage = () => {
    const [selectedServices, setSelectedServices] = useState<number[]>([]);

    const toggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(selectedServices.filter(s => s !== id));
        } else {
            setSelectedServices([...selectedServices, id]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">خدمات منصة Celebrate Hub</h1>
                    <p className="text-xl text-gray-600">اختر خدماتك المفضلة لبناء فعاليتك المثالية في حائل</p>
                    <div className="mt-4 inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
                        عدد الخدمات المختارة: {selectedServices.length}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service) => (
                        <div
                            key={service.id}
                            className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all ${selectedServices.includes(service.id) ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent'
                                }`}
                        >
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                                        {service.category}
                                    </span>
                                    <span className="text-purple-600 font-bold text-sm">+{service.xpReward} XP</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{service.description}</p>

                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-400 text-lg">★</span>
                                    <span className="mr-1 text-sm font-bold text-gray-700">{service.rating}</span>
                                </div>

                                <ul className="space-y-2 mb-6 flex-grow">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600">
                                            <span className="ml-2 text-indigo-500">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between items-center border-t pt-4 mt-auto">
                                    <span className="text-2xl font-bold text-indigo-600">{service.price}</span>
                                    <button
                                        onClick={() => toggleService(service.id)}
                                        className={`px-6 py-2 rounded-lg font-bold transition ${selectedServices.includes(service.id)
                                                ? 'bg-red-50 text-red-600 border border-red-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {selectedServices.includes(service.id) ? 'إلغاء' : 'إضافة'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                {selectedServices.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 transform translate-x-1/2 w-full max-w-md px-4 pointer-events-none">
                        <button className="w-full pointer-events-auto bg-indigo-700 text-white py-4 rounded-2xl shadow-2xl font-bold text-lg hover:bg-indigo-800 transition transform hover:scale-105">
                            انتقل للمقارنة وإرسال الطلب ({selectedServices.length * 10} XP+)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;
