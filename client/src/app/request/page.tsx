
'use client'

import React, { Suspense } from 'react' // Import Suspense
import { useSearchParams } from 'next/navigation'
import EventRequestForm from '@/components/EventRequestForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function RequestFormContent() {
    const searchParams = useSearchParams()
    const vendorId = searchParams.get('vendorId')
    const vendorName = searchParams.get('vendorName')

    // Mock Client ID (In real app, get from Auth Context)
    const clientId = 'user-uuid-placeholder' // This would come from auth.user.id

    if (!vendorId) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">لم يتم اختيار مقدم خدمة</h2>
                <Link href="/comparison" className="text-indigo-600 hover:underline mt-4 block">
                    العودة للمقارنة
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/comparison" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                    <span>←</span> العودة للمقارنة (تغيير مقدم الخدمة)
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">إكمال طلب الخدمة</h1>
                <p className="text-gray-600">أنت على وشك إرسال طلب إلى <span className="font-bold text-indigo-700">{vendorName}</span></p>
            </div>

            <EventRequestForm
                contractorId={vendorId}
                contractorName={vendorName || 'مقدم الخدمة'}
                clientId={clientId}
            />
        </div>
    )
}

export default function RequestPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
            <Suspense fallback={<div className="text-center py-20">جاري التحميل...</div>}>
                <RequestFormContent />
            </Suspense>
        </div>
    )
}
