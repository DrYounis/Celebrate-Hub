
'use client'

import React from 'react'
import Link from 'next/link'

export interface Vendor {
    id: string
    business_name: string
    category: string
    pricing_model: {
        setup_fee?: number | string
        starting_price?: number | string
        [key: string]: any
    }
    coverage?: string
    points_value?: number
}

interface ComparisonTableProps {
    vendors: Vendor[]
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ vendors }) => {
    if (!vendors || vendors.length === 0) return null;

    // Find the vendor with the lowest setup fee for "Best Value" highlight
    const lowestPriceVendorId = vendors.reduce((prev, curr) => {
        const prevPrice = Number(prev.pricing_model?.setup_fee) || Infinity
        const currPrice = Number(curr.pricing_model?.setup_fee) || Infinity
        return currPrice < prevPrice ? curr : prev
    }, vendors[0])?.id

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">قارن بين مزودي الخدمات</h2>
                <p className="text-gray-500 mt-2">قارن بين الأسعار، الدعم الفني، والنقاط المكتسبة</p>
            </div>

            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-right min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600">
                                <th className="p-6 border-b text-lg sticky right-0 bg-gray-50 z-10 shadow-sm md:shadow-none">
                                    المعايير
                                </th>
                                {vendors.map(service => (
                                    <th key={service.id} className="p-6 border-b text-center border-r min-w-[180px]">
                                        <div className="text-lg font-bold text-indigo-700">{service.business_name}</div>
                                        <div className="text-xs font-normal text-gray-400">{service.category}</div>
                                        {service.id === lowestPriceVendorId && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                                                أفضل قيمة 🏷️
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* صف السعر */}
                            <tr>
                                <td className="p-6 font-semibold bg-gray-50/50 sticky right-0 z-10 shadow-sm md:shadow-none bg-gray-50">تكلفة التأسيس</td>
                                {vendors.map(s => (
                                    <td key={s.id} className="p-6 text-center text-green-600 font-bold border-r">
                                        {s.pricing_model?.setup_fee ? `${s.pricing_model.setup_fee} ريال` : 'غير محدد'}
                                    </td>
                                ))}
                            </tr>
                            {/* صف اللوجستيك */}
                            <tr>
                                <td className="p-6 font-semibold bg-gray-50/50 sticky right-0 z-10 shadow-sm md:shadow-none bg-gray-50">تغطية التوصيل</td>
                                {vendors.map(s => (
                                    <td key={s.id} className="p-6 text-center border-r">
                                        {s.coverage === 'National' ? '🇸🇦 كامل المملكة' : '📍 مناطق محددة'}
                                    </td>
                                ))}
                            </tr>
                            {/* صف التلعيب - Gamification */}
                            <tr>
                                <td className="p-6 font-semibold bg-gray-50/50 sticky right-0 z-10 shadow-sm md:shadow-none bg-gray-50">مكافأة الحجز (Points)</td>
                                {vendors.map(s => (
                                    <td key={s.id} className="p-6 text-center border-r">
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                            +{s.points_value || 50} XP
                                        </span>
                                    </td>
                                ))}
                            </tr>
                            {/* صف الإجراءات */}
                            <tr>
                                <td className="p-6 sticky right-0 bg-gray-50 md:bg-white z-10"></td>
                                {vendors.map(s => (
                                    <td key={s.id} className="p-6 text-center border-r">
                                        <Link
                                            href={`/request?vendorId=${s.id}&vendorName=${encodeURIComponent(s.business_name)}`}
                                            className="inline-block w-full bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 font-semibold"
                                        >
                                            اطلب الآن 🚀
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTable;
