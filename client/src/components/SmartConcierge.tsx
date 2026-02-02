'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SmartConciergeProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SmartConcierge: React.FC<SmartConciergeProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        city: 'حائل',
        budget: '',
        phone: '',
        email: ''
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Insert request
            const { error } = await supabase
                .from('consultation_requests')
                .insert([{
                    event_type: formData.type,
                    city: formData.city,
                    budget_range: formData.budget,
                    phone: formData.phone,
                    email: formData.email,
                    // Default values for schema compatibility
                    services_needed: [],
                    status: 'pending'
                }]);

            if (error) throw error;

            // 2. Award XP/Points
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await supabase.rpc('award_points', {
                    p_user_id: session.user.id,
                    p_points: 50,
                    p_action: 'smart_concierge_request'
                });
            }

            nextStep(); // Go to success step (4)
        } catch (err) {
            console.error('Error submitting request:', err);
            alert('حدث خطأ بسيط، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative">

                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 flex direction-ltr">
                    <div
                        className="bg-indigo-600 transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8 max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                    >
                        ✕
                    </button>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">ما نوع مناسبتك؟ 🏰</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {['حفل زفاف', 'افتتاح مشروع', 'مناسبة خاصة', 'فعالية شركات'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setFormData({ ...formData, type: t }); nextStep(); }}
                                        className="p-4 border-2 border-gray-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-sm font-bold text-gray-700 hover:text-indigo-700"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">الميزانية والمدينة 📍</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">المدينة</label>
                                <select
                                    className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 bg-white"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                >
                                    <option value="حائل">حائل</option>
                                    <option value="الرياض">الرياض</option>
                                    <option value="القصيم">القصيم</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-600">الميزانية التقديرية</label>
                                {['باقة اقتصادية', 'باقة متوسطة', 'باقة فاخرة'].map(b => (
                                    <button
                                        key={b}
                                        onClick={() => { setFormData({ ...formData, budget: b }); nextStep(); }}
                                        className="w-full p-4 border-2 border-gray-100 rounded-2xl text-right hover:border-indigo-600 hover:bg-indigo-50 font-medium transition-all flex justify-between items-center group"
                                    >
                                        <span>{b}</span>
                                        <span className="text-gray-300 group-hover:text-indigo-600">←</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">كيف نتواصل معك؟ 📞</h2>
                            <p className="text-gray-500 text-sm text-center">سيقوم فريقنا بالاتصال بك لمراجعة التسعير والخدمات.</p>

                            <input
                                type="tel"
                                placeholder="رقم الجوال (05xxxxxxx)"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl text-right outline-none focus:border-indigo-600 transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />

                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl text-right outline-none focus:border-indigo-600 transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={!formData.phone || loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال الطلب وحجز موعد الاتصال'}
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-4 py-6">
                            <div className="text-6xl animate-bounce">✅</div>
                            <h2 className="text-2xl font-bold text-gray-800">تم استلام طلبك!</h2>
                            <p className="text-gray-600 leading-relaxed">
                                شكراً لك. فريق الاستشارات سيقوم بمراجعة طلبك والاتصال بك خلال ساعات العمل القادمة.
                            </p>
                            <div className="bg-purple-50 p-4 rounded-xl text-purple-700 font-bold border border-purple-100 animate-pulse">
                                ربحت +50 XP لاهتمامك بالتفاصيل!
                            </div>
                            <button onClick={onClose} className="text-indigo-600 font-bold underline hover:text-indigo-800 mt-4">إغلاق</button>
                        </div>
                    )}

                    {step > 1 && step < 4 && (
                        <button onClick={prevStep} className="mt-6 text-gray-400 text-sm hover:text-gray-600 transition">← العودة للخطوة السابقة</button>
                    )}
                </div>
            </div>
        </div>
    );
};
