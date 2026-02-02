'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ComparisonTable, { Vendor } from '@/components/ComparisonTable'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ComparisonPage() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, business_name, category, pricing_model')
                    .eq('role', 'pro')
                    .limit(3)

                if (error) {
                    console.error('Error fetching vendors:', error)
                } else {
                    // Basic mapping to fit the interface, assuming DB data structure
                    const mappedVendors: Vendor[] = (data || []).map((v: any) => ({
                        ...v,
                        coverage_area: v.pricing_model?.coverage || 'غير محدد', // Fallback or extracting from jsonb
                        points_reward: 50 // Static/Logic based value
                    }))
                    setVendors(mappedVendors)
                }
            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchVendors()
    }, [])

    if (loading) {
        return <div className="p-8 text-center">جاري تحميل البيانات...</div>
    }

    if (vendors.length === 0) {
        return <div className="p-8 text-center">لا يوجد مقدمي خدمة لعرضهم حالياً.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        مقارنة الخدمات
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        قارن بين أفضل مقدمي الخدمات واختر الأنسب لميزانيتك واحتياجاتك.
                    </p>
                </div>

                <ComparisonTable vendors={vendors} />
            </div>
        </div>
    )
}
