
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import confetti from 'canvas-confetti'

interface EventRequestFormProps {
    contractorId: string
    contractorName: string
    clientId: string
}

const EventRequestForm: React.FC<EventRequestFormProps> = ({ contractorId, contractorName, clientId }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        budgetRange: '',
        details: ''
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const { error } = await supabase
                .from('event_requests')
                .insert({
                    client_id: clientId,
                    contractor_id: contractorId,
                    event_name: formData.eventName,
                    event_date: formData.eventDate,
                    budget_range: formData.budgetRange,
                    details: formData.details,
                    status: 'pending'
                })

            if (error) throw error

            // Trigger gamification points for "Sending Request"
            await supabase.from('gamification_logs').insert({
                user_id: clientId,
                action_type: 'send_request',
                points_earned: 20,
                metadata: { contractor_id: contractorId }
            })

            setStatus('success')
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
        } catch (error) {
            console.error('Error submitting request:', error)
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="p-6 bg-green-50 rounded-xl text-center border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-2">تم استلام طلبك بنجاح! 🎉</h3>
                <p className="text-green-700">سيقوم {contractorName} بالرد عليك قريباً. لقد كسبت <span className="font-bold">+20 نقطة</span>!</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-green-600 underline">إرسال طلب آخر</button>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">طلب تسعير من: <span className="text-indigo-600">{contractorName}</span></h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم الفعالية</label>
                    <input
                        type="text"
                        name="eventName"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={formData.eventName}
                        onChange={handleChange}
                        placeholder="مثال: حفل زفاف نورة ومحمد"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الفعالية</label>
                        <input
                            type="date"
                            name="eventDate"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.eventDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الميزانية المتوقعة</label>
                        <select
                            name="budgetRange"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={formData.budgetRange}
                            onChange={handleChange}
                        >
                            <option value="">اختر الميزانية...</option>
                            <option value="low">أقل من 5000 ريال</option>
                            <option value="medium">5000 - 15000 ريال</option>
                            <option value="high">15000 - 50000 ريال</option>
                            <option value="luxury">أكثر من 50000 ريال</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</label>
                    <textarea
                        name="details"
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="اكتب أي تفاصيل مهمة للمقاول..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال طلب التسعير'}
                </button>

                {status === 'error' && (
                    <p className="text-red-500 text-sm text-center mt-2">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</p>
                )}
            </form>
        </div>
    )
}

export default EventRequestForm
