
'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        setup_fee: '',
        coverage: 'National',
        business_name: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)
                if (data) {
                    setFormData({
                        setup_fee: data.pricing_model?.setup_fee || '',
                        coverage: data.pricing_model?.coverage || 'National', // assuming stored in pricing_model or separate column
                        business_name: data.business_name || ''
                    })
                }
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const userId = profile.id
        const filePath = `${userId}/business_logo.png`  // Force PNG or handle ext dynamically

        setSaving(true)
        try {
            const { error: uploadError } = await supabase.storage
                .from('logos')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath)

            // Update profile with new avatar
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', userId)

            if (updateError) throw updateError

            setProfile({ ...profile, avatar_url: publicUrl })
            alert('تم تحديث الشعار بنجاح!')
        } catch (error) {
            console.error('Error uploading logo:', error)
            alert('حدث خطأ أثناء رفع الصورة.')
        } finally {
            setSaving(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update pricing_model jsonb merging existing data
            const updatedPricing = {
                ...(profile.pricing_model || {}),
                setup_fee: formData.setup_fee,
                coverage: formData.coverage
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    business_name: formData.business_name,
                    pricing_model: updatedPricing,
                    // If you have a dedicated column for coverage, update it here too.
                    // For now, sticking to the user request structure or pricing_model logic.
                })
                .eq('id', profile.id)

            if (error) throw error
            alert('تم حفظ الإعدادات بنجاح!')
        } catch (err) {
            console.error(err)
            alert('فشل الحفظ.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-12 text-center">جاري التحميل...</div>
    if (!profile) return <div className="p-12 text-center">الرجاء تسجيل الدخول</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mb-6 block">← العودة للوحة التحكم</Link>
                <h1 className="text-3xl font-bold mb-8 text-gray-900">إعدادات الملف التجاري</h1>

                {/* 1. Branding Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm mb-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-indigo-700 flex items-center gap-2">
                        <span>🎨</span> الهوية البصرية
                    </h2>
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-300">🏢</span>
                                )}
                            </div>
                            {saving && <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white text-xs">جاري الرفع...</div>}
                        </div>

                        <div className="flex-1">
                            <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition inline-block">
                                تغيير الشعار
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={saving} />
                            </label>
                            <p className="text-sm text-gray-400 mt-3">يفضل استخدام صورة مربعة (PNG/JPG) بمقاس 512x512 بكسل.</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم النشاط التجاري</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.business_name}
                            onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                        />
                    </div>
                </section>

                {/* 2. Pricing & Services Section */}
                <section className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-indigo-700 flex items-center gap-2">
                        <span>💰</span> قائمة الأسعار والخدمات
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رسوم التأسيس / بداية الخدمة (ريال)</label>
                            <input
                                type="number"
                                value={formData.setup_fee}
                                onChange={e => setFormData({ ...formData, setup_fee: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="مثال: 500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">نطاق التغطية اللوجستية</label>
                            <select
                                value={formData.coverage}
                                onChange={e => setFormData({ ...formData, coverage: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="National">🇸🇦 كامل المملكة</option>
                                <option value="Central">📍 المنطقة الوسطى</option>
                                <option value="Western">📍 المنطقة الغربية</option>
                                <option value="Eastern">📍 المنطقة الشرقية</option>
                                <option value="Northern">📍 المنطقة الشمالية</option>
                                <option value="Southern">📍 المنطقة الجنوبية</option>
                            </select>
                        </div>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات ✅'}
                </button>
            </div>
        </div>
    )
}
