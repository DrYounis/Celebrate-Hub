'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Gift, Calendar, MapPin, DollarSign, Package, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SmartConciergeProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'type' | 'location' | 'budget' | 'services' | 'contact';

export const SmartConcierge: React.FC<SmartConciergeProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventType: '',
        city: '',
        date: '',
        budget: '',
        services: [] as string[],
        name: '',
        phone: '',
        email: ''
    });

    if (!isOpen) return null;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSelect = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleService = (service: string) => {
        setFormData(prev => {
            const services = prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service];
            return { ...prev, services };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Insert request
            const { error } = await supabase
                .from('consultation_requests')
                .insert([{
                    event_type: formData.eventType,
                    city: formData.city,
                    event_date: formData.date,
                    budget_range: formData.budget,
                    services_needed: formData.services,
                    user_name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                }]);

            if (error) throw error;

            // 2. Award XP/Points (Mock for now or real if profile exists)
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await supabase.rpc('award_points', {
                    p_user_id: session.user.id,
                    p_points: 50,
                    p_action: 'smart_concierge_request'
                });
            }

            // 3. Success Feedback
            alert('تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً');
            onClose();

        } catch (err) {
            console.error('Error submitting request:', err);
            alert('حدث خطأ بسيط، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    // Render Steps
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-center text-purple-900">أهلاً بك! لنبدأ بتحديد نوع مناسبتك؟ 🎉</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {['حفل زفاف 🏰', 'افتتاح مشروع 🎊', 'مناسبة خاصة 🎂', 'فعالية شركات 💼'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { handleSelect('eventType', type); nextStep(); }}
                                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${formData.eventType === type
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="text-lg font-medium">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-center text-purple-900">رائع! أين ومتى؟ 📍</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">المدينة</label>
                                <div className="flex gap-2">
                                    {['حائل', 'الرياض', 'أخرى'].map(city => (
                                        <button
                                            key={city}
                                            onClick={() => handleSelect('city', city)}
                                            className={`flex-1 py-1 px-4 rounded-lg border ${formData.city === city ? 'bg-purple-600 text-white' : 'border-gray-300'
                                                }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">التاريخ المتوقع</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right"
                                    onChange={(e) => handleSelect('date', e.target.value)}
                                    value={formData.date}
                                />
                            </div>

                            <button
                                onClick={nextStep}
                                disabled={!formData.city || !formData.date}
                                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition"
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-center text-purple-900">ما هي ميزانيتك التقديرية؟ 💰</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'باقة اقتصادية (أقل من 20 ألف)', value: 'economic' },
                                { label: 'باقة متوسطة (20 - 50 ألف)', value: 'medium' },
                                { label: 'باقة فاخرة (50 ألف +)', value: 'luxury' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { handleSelect('budget', opt.value); nextStep(); }}
                                    className={`w-full p-4 rounded-xl border-2 text-right transition-all ${formData.budget === opt.value
                                        ? 'border-purple-600 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="font-bold text-gray-800">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-center text-purple-900">ما الخدمات التي تحتاجها؟ ✨</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'catering', label: 'الضيافة والعشاء 🍽️' },
                                { id: 'decor', label: 'التنسيق والديكور 💐' },
                                { id: 'transport', label: 'النقل واللوجستيك 🚗' },
                                { id: 'photo', label: 'التصوير والتوثيق 📸' }
                            ].map((srv) => (
                                <button
                                    key={srv.id}
                                    onClick={() => toggleService(srv.id)}
                                    className={`p-4 rounded-xl border-2 transition-all h-24 flex items-center justify-center text-center ${formData.services.includes(srv.id)
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="font-bold">{srv.label}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={formData.services.length === 0}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition"
                        >
                            التالي
                        </button>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-purple-900 mb-2">خطوة أخيرة! 🚀</h3>
                            <p className="text-gray-600">اترك بياناتك وسيتواصل معك خبير التخطيط لدينا</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex gap-3 text-right">
                            <Gift className="text-amber-500 shrink-0" />
                            <div>
                                <p className="font-bold text-amber-800">هدية خاصة!</p>
                                <p className="text-sm text-amber-700">سجل الآن واحصل على قسيمة خصم 10% صالحة لمدة 24 ساعة.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="الاسم الكريم"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right"
                                value={formData.name}
                                onChange={(e) => handleSelect('name', e.target.value)}
                            />
                            <input
                                type="tel"
                                placeholder="رقم الجوال (05xxxxxxxx)"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right"
                                value={formData.phone}
                                onChange={(e) => handleSelect('phone', e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-right"
                                value={formData.email}
                                onChange={(e) => handleSelect('email', e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.phone || loading}
                            className="w-full bg-gradient-to-l from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50"
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال الطلب والحصول على الخصم ✨'}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-purple-50 px-6 py-4 flex items-center justify-between border-b border-purple-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                            {step}/5
                        </div>
                        <span className="font-bold text-purple-900">المساعد الذكي</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-purple-100 rounded-full transition">
                        <X className="text-purple-700" size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-1">
                    <div
                        className="bg-purple-600 h-1 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 min-h-[400px] flex flex-col justify-center">
                    {renderStep()}
                </div>

                {/* Footer Navigation (if needed logic here) */}
                {step > 1 && step < 5 && (
                    <div className="px-6 pb-6 pt-0">
                        <button onClick={prevStep} className="text-gray-400 hover:text-purple-600 text-sm font-medium flex items-center gap-1">
                            <ChevronRight size={16} /> عودة للسابق
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
