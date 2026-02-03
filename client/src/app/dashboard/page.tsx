
'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { TrendingUp, Lightbulb, User, Clock, CheckCircle, Lock } from 'lucide-react'

// --- Components for New Roles ---

const InvestorDashboard = ({ profile }: { profile: any }) => {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8" dir="rtl">
            {/* Header */}
            <div className="bg-[#0D0032] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">مرحباً، {profile.full_name} 👋</h1>
                        <p className="text-gray-300">لوحة تحكم المستثمر</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
                        <TrendingUp size={32} className="text-[#D9FF5B]" />
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            {/* Approval Status */}
            {!profile.is_approved ? (
                <div className="bg-yellow-50 border-r-4 border-yellow-400 p-6 rounded-xl flex items-start gap-4 shadow-sm">
                    <Clock className="text-yellow-600 shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">حسابك قيد المراجعة</h3>
                        <p className="text-gray-600">شكراً لانضمامك! يقوم فريقنا حالياً بمراجعة طلبك للتحقق من أهليتك كمستثمر. سنقوم بتفعيل حسابك قريباً.</p>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-[#0D0032] mb-4">الفرص الاستثمارية 🚀</h3>
                        <p className="text-gray-500 text-sm mb-4">تصفح الشركات الناشئة الواعدة من خريجي أكاديمية مرفأ.</p>
                        <button className="w-full bg-[#0D0032] text-white py-3 rounded-xl font-bold hover:bg-[#1a0b4b] transition">
                            استعراض الشركات
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-[#0D0032] mb-4">رسائل رواد الأعمال 💬</h3>
                        <Link href="/admin/inbox">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                                <span>صندوق الوارد</span>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3 جديدة</span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

const EntrepreneurDashboard = ({ profile }: { profile: any }) => {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">أهلاً، {profile.full_name} 🚀</h1>
                        <p className="text-emerald-100 font-medium">عضو أكاديمية مرفأ</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-lg">
                        <Lightbulb size={32} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Academy Progress */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Enrollment Status */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><CheckCircle size={20} /></span>
                            حالة التسجيل
                        </h3>

                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <span className="text-gray-600 font-medium">البرنامج الحالي</span>
                            <span className="font-bold text-[#0D0032]">الدفعة الثالثة - مسار المناسبات</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mt-3">
                            <span className="text-gray-600 font-medium">الحالة</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.is_marfa_enrolled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {profile.is_marfa_enrolled ? 'ملتحق ✅' : 'قيد التسجيل'}
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">الخطوات القادمة</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-600 opacity-50">
                                <CheckCircle size={20} className="text-green-500" />
                                <span className="line-through">تسجيل البيانات الأولية</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-800 font-medium bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="w-5 h-5 rounded-full border-2 border-blue-500 grid place-items-center">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                </div>
                                <span>استكمال دراسة الجدوى الأولية</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                <span>المقابلة الشخصية</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-4">أدوات مساعدة</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition">
                                <span>📝 نموذج العمل التجاري</span>
                                <Lock size={16} className="text-gray-400" />
                            </button>
                            <button className="w-full flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition">
                                <span>📊 حاسبة السوق</span>
                                <Lock size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Main Page Component ---

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [role, setRole] = useState<'investor' | 'entrepreneur' | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if Investor
                const { data: investorData } = await supabase.from('investors').select('*').eq('id', user.id).maybeSingle();
                if (investorData) {
                    setProfile(investorData);
                    setRole('investor');
                    setLoading(false);
                    return;
                }

                // Check if Entrepreneur
                const { data: entData } = await supabase.from('entrepreneurs').select('*').eq('id', user.id).maybeSingle();
                if (entData) {
                    setProfile(entData);
                    setRole('entrepreneur');
                }
            }
            setLoading(false)
        }

        checkUser()
    }, [])

    if (loading) return (
        <div className="min-h-screen grid place-items-center bg-gray-50">
            <div className="animate-spin text-indigo-600">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    )

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">يرجى تسجيل الدخول</h2>
                    <p className="text-gray-500 mb-6">قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.</p>
                    <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition w-full">
                        تسجيل الدخول / تحديث
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            {role === 'investor' ? (
                <InvestorDashboard profile={profile} />
            ) : (
                <EntrepreneurDashboard profile={profile} />
            )}
        </div>
    )
}
