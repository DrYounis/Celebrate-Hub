
'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // Adjust path as needed
import PointsBadge from '@/components/PointsBadge'
import Link from 'next/link'

// Placeholder components - in a real app these would be separate files
const ClientDashboard = ({ profile }: { profile: any }) => {
    const [requests, setRequests] = useState<any[]>([])

    useEffect(() => {
        const fetchRequests = async () => {
            const { data } = await supabase
                .from('event_requests')
                .select(`*, contractor:contractor_id(business_name)`)
                .eq('client_id', profile.id)
                .order('created_at', { ascending: false })

            if (data) setRequests(data)
        }
        fetchRequests()
    }, [profile.id])

    // Progress logic (example)
    const nextLevelPoints = 500
    const progressPercent = Math.min((profile.total_points / nextLevelPoints) * 100, 100)

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6" dir="rtl">
            {/* Gamification Header */}
            <div className="bg-gradient-to-l from-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">🏆</div>
                <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
                    <div className="text-center md:text-right mb-6 md:mb-0">
                        <h1 className="text-3xl font-bold mb-2">أهلاً، {profile.full_name}! 👋</h1>
                        <p className="opacity-90 text-indigo-100 font-medium">مستواك الحالي: رائد أعمال فضي 🥈</p>
                    </div>
                    <div className="text-center">
                        <span className="text-5xl font-black tracking-tight">{profile.total_points || 0}</span>
                        <span className="block text-sm opacity-80 mt-1">نقطة XP مجتمعة</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 relative z-10">
                    <div className="flex justify-between text-xs mb-2 font-semibold tracking-wide opacity-90">
                        <span>المستوى القادم: رائد أعمال ذهبي 🥇</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-white/20 h-4 rounded-full backdrop-blur-sm overflow-hidden border border-white/10">
                        <div
                            className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-xs mt-2 text-center text-indigo-200">باقي {nextLevelPoints - (profile.total_points || 0)} نقطة للوصول للمستوى التالي!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">تاريخ طلباتك 📁</h2>
                        <Link href="/comparison" className="text-indigo-600 text-sm font-bold hover:underline">
                            + طلب جديد
                        </Link>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border-2 border-dashed border-gray-200 text-center text-gray-500">
                            <p className="mb-4">ليس لديك طلبات سابقة.</p>
                            <Link href="/comparison" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition inline-block">
                                ابحث عن مقاول الآن
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-center sm:text-right">
                                        <h4 className="font-bold text-gray-900 text-lg">{req.event_name}</h4>
                                        <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                                            <span>👤</span> {req.contractor?.business_name || 'مقدم خدمة'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                req.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                    req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {req.status === 'pending' ? '⏳ قيد المراجعة' :
                                                req.status === 'accepted' ? '✅ مقبول' :
                                                    req.status === 'completed' ? '🎉 مكتمل' : '❌ مرفوض'}
                                        </span>
                                        {/* Show Review Button if completed */}
                                        {/* {req.status === 'completed' && <button className="text-xs text-yellow-600 underline font-bold">تقييم الخدمة</button>} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rewards Store (Locked/Unlocked) */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>🎁</span> مكافآت الولاء
                    </h2>
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${(profile.total_points || 0) >= 500 ? 'bg-white border-green-400 shadow-sm' : 'bg-gray-100/50 border-gray-200 opacity-60'
                            }`}>
                            <div className="text-3xl bg-gray-50 p-2 rounded-lg">🚚</div>
                            <div>
                                <p className="font-bold text-gray-800">خصم 10% على اللوجستيك</p>
                                {(profile.total_points || 0) >= 500 ? (
                                    <p className="text-xs text-green-600 font-bold mt-1">✅ تم فك القفل! استخدم الكود: LOGIST10</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">🔒 تحتاج 500 نقطة</p>
                                )}
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${(profile.total_points || 0) >= 1000 ? 'bg-white border-yellow-400 shadow-sm' : 'bg-gray-100/50 border-gray-200 opacity-60'
                            }`}>
                            <div className="text-3xl bg-gray-50 p-2 rounded-lg">🌟</div>
                            <div>
                                <p className="font-bold text-gray-800">استشارة تقنية مجانية</p>
                                {(profile.total_points || 0) >= 1000 ? (
                                    <p className="text-xs text-green-600 font-bold mt-1">✅ تم فك القفل!</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">🔒 تحتاج 1000 نقطة</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-indigo-50 p-4 rounded-xl text-center">
                        <p className="text-indigo-800 text-sm font-medium">💡 نصيحة: اترك تقييماً بعد اكتمال الخدمة لتحصل على +15 نقطة فوراً!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ContractorDashboard = ({ profile }: { profile: any }) => {
    const [requests, setRequests] = useState<any[]>([])

    useEffect(() => {
        // 1. Initial Fetch
        const fetchRequests = async () => {
            const { data } = await supabase
                .from('event_requests')
                .select(`*, client:client_id(full_name, avatar_url)`)
                .eq('contractor_id', profile.id)
                .order('created_at', { ascending: false })

            if (data) setRequests(data)
        }
        fetchRequests()

        // 2. Real-time Subscription
        const subscription = supabase
            .channel('contractor-requests')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'event_requests', filter: `contractor_id=eq.${profile.id}` },
                (payload) => {
                    // On new request, append to list (or re-fetch for simplicity/joins)
                    fetchRequests()
                    // Optional: Trigger browser notification here
                    // new Notification('طلب جديد!')
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(subscription) }
    }, [profile.id])

    const handleStatus = async (requestId: string, newStatus: string) => {
        const { error } = await supabase
            .from('event_requests')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (!error) {
            // Optimistic update
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r))
            // Alert/Notify
            // alert(`تمت العملية بنجاح: ${newStatus}`) 
            // In a real app, use a toast library instead of alert
        } else {
            console.error('Error updating status:', error)
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{profile.business_name || 'لوحة التحكم'}</h2>
                    <p className="text-gray-500">لديك {requests.filter(r => r.status === 'pending').length} طلبات بانتظار المراجعة</p>
                </div>
                <div className="text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-full">
                    {profile.category || 'مورد'}
                </div>
            </div>

            <div className="grid gap-4">
                {requests.map((request) => (
                    <div key={request.id} className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-indigo-500 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-right">
                            <h3 className="font-bold text-lg text-gray-800">{request.event_name}</h3>
                            <p className="text-sm text-gray-600">من: {request.client?.full_name}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                                <span>📅 {request.event_date}</span>
                                <span>💰 ميزانية: {request.budget_range}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            {request.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleStatus(request.id, 'accepted')}
                                        className="flex-1 md:flex-none bg-green-100 text-green-700 px-6 py-2 rounded-lg hover:bg-green-200 font-medium transition"
                                    >
                                        قبول
                                    </button>
                                    <button
                                        onClick={() => handleStatus(request.id, 'rejected')}
                                        className="flex-1 md:flex-none bg-red-100 text-red-700 px-6 py-2 rounded-lg hover:bg-red-200 font-medium transition"
                                    >
                                        رفض
                                    </button>
                                </>
                            ) : (
                                <span className={`px-4 py-2 rounded-lg font-bold text-sm ${request.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {request.status === 'accepted' ? 'مقبول ✅' : 'مرفوض ❌'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl">
                        لا توجد طلبات واردة حالياً
                    </div>
                )}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            // Mock user fetch - in real app use auth context
            // For demo purposes, we will fetch a 'pro' user if available, or just any user
            // Or you can create a temporary logic to toggle for demo

            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)
            } else {
                // Fallback for demo if no user logged in
                // setProfile({ role: 'free', full_name: 'ضيف', total_points: 120 })
            }
            setLoading(false)
        }

        checkUser()
    }, [])

    if (loading) return <div className="p-12 text-center">جاري التحميل...</div>

    if (!profile) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl mb-4">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</h2>
                <Link href="/login" className="text-indigo-600 underline">تسجيل الدخول</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <div className="max-w-5xl mx-auto">
                {profile.role === 'pro' ? (
                    <ContractorDashboard profile={profile} />
                ) : (
                    <ClientDashboard profile={profile} />
                )}
            </div>
        </div>
    )
}
