'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, MapPin, Phone, Mail, ArrowRight, ArrowLeft, CheckCircle, PartyPopper, Briefcase, Calendar, Building2, X } from 'lucide-react';

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
        } catch (err: any) {
            console.error('Error submitting request:', err);
            alert(`Error: ${err.message || 'حدث خطأ غير متوقع'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const eventTypes = [
        { name: 'حفل زفاف', icon: PartyPopper, color: 'bg-pink-100 text-pink-600' },
        { name: 'افتتاح مشروع', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
        { name: 'مناسبة خاصة', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
        { name: 'فعالية شركات', icon: Building2, color: 'bg-amber-100 text-amber-600' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" dir="rtl">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative border border-purple-100">

                {/* Header Pattern */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

                <div className=" p-8 max-h-[90vh] overflow-y-auto relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-gray-400 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-full transition duration-300"
                    >
                        <X size={24} />
                    </button>

                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-8 gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'w-8 bg-purple-600' : 'w-2 bg-gray-200'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900">ما نوع مناسبتك؟</h2>
                                <p className="text-gray-500">اختر نوع المناسبة لنساعدك في التخطيط</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {eventTypes.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => { setFormData({ ...formData, type: t.name }); nextStep(); }}
                                        className="group p-6 border border-gray-100 rounded-2xl hover:border-purple-500 hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 flex flex-col items-center gap-3 text-right bg-white"
                                    >
                                        <div className={`p-4 rounded-full ${t.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <t.icon size={28} />
                                        </div>
                                        <span className="font-bold text-gray-800 group-hover:text-purple-700">{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900">الميزانية والمدينة</h2>
                                <p className="text-gray-500">ساعدنا نخصص لك أفضل الخيارات</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <MapPin size={16} className="text-purple-600" /> المدينة
                                    </label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-800"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="حائل">حائل</option>
                                        <option value="الرياض">الرياض</option>
                                        <option value="القصيم">القصيم</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Sparkles size={16} className="text-purple-600" /> الميزانية التقديرية
                                    </label>
                                    {['باقة اقتصادية (أقل من 10k)', 'باقة متوسطة (10k - 50k)', 'باقة فاخرة (+50k)'].map(b => (
                                        <button
                                            key={b}
                                            onClick={() => { setFormData({ ...formData, budget: b }); nextStep(); }}
                                            className="w-full p-4 border border-gray-100 rounded-2xl text-right hover:border-purple-500 hover:bg-purple-50 font-bold text-gray-700 transition-all flex justify-between items-center group bg-white shadow-sm"
                                        >
                                            <span>{b}</span>
                                            <ArrowLeft size={18} className="text-gray-300 group-hover:text-purple-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900">كيف نتواصل معك؟</h2>
                                <p className="text-gray-500">سيقوم مستشارك الخاص بالتواصل معك قريباً</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Phone className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        placeholder="رقم الجوال (05xxxxxxx)"
                                        className="w-full p-4 pr-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all text-right font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="البريد الإلكتروني"
                                        className="w-full p-4 pr-12 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all text-right font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.phone || loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>إرسال الطلب <ArrowLeft size={20} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-6 py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce text-green-600">
                                <CheckCircle size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900">تم استلام طلبك بنجاح!</h2>
                                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                                    شكراً لاختيارك Celebrate Hub. سيقوم فريقنا بمراجعة طلبك والاتصال بك خلال ساعات العمل.
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 animate-pulse inline-block w-full">
                                <span className="text-amber-700 font-bold flex items-center justify-center gap-2">
                                    <Sparkles size={18} />
                                    ربحت +50 نقطة مكافأة!
                                </span>
                            </div>

                            <button onClick={onClose} className="text-purple-600 font-bold hover:text-purple-800 transition-colors block mx-auto py-2">
                                العودة للصفحة الرئيسية
                            </button>
                        </div>
                    )}

                    {step > 1 && step < 4 && (
                        <button onClick={prevStep} className="mt-8 text-gray-400 text-sm hover:text-gray-800 transition flex items-center gap-1 mx-auto">
                            <ArrowRight size={14} /> العودة للخطوة السابقة
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
