
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import confetti from 'canvas-confetti'

interface ReviewFormProps {
    requestId: string
    contractorId: string
    clientId: string
    contractorName: string
    onReviewSubmitted?: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ requestId, contractorId, clientId, contractorName, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async () => {
        if (rating === 0) return
        setStatus('submitting')

        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    request_id: requestId,
                    client_id: clientId,
                    contractor_id: contractorId,
                    rating: rating,
                    comment: comment
                })

            if (error) throw error

            // Gamification: Reward user for reviewing
            await supabase.from('gamification_logs').insert({
                user_id: clientId,
                action_type: 'submit_review',
                points_earned: 15,
                metadata: { request_id: requestId }
            })

            setStatus('success')
            confetti({
                particleCount: 150,
                spread: 60,
                colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'] // Gold colors
            })

            if (onReviewSubmitted) onReviewSubmitted()

        } catch (error) {
            console.error('Error submitting review:', error)
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-2">شكراً لتقييمك! 🌟</h3>
                <p className="text-green-700">لقد ساعدت الآخرين بتجربتك وحصلت على <span className="font-bold">+15 نقطة XP</span>.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-yellow-400 text-right mt-6" dir="rtl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">كيف كانت تجربتك مع <span className="text-indigo-600">{contractorName}</span>؟</h3>

            <div className="flex flex-row-reverse justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-colors duration-200 hover:scale-110 transform ${rating >= star ? "text-yellow-400" : "text-gray-200"}`}
                        type="button"
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                placeholder="اكتب رأيك هنا لمساعدة الآخرين..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={rating === 0 || status === 'submitting'}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال التقييم (+15 XP)'}
            </button>

            {status === 'error' && (
                <p className="text-red-500 text-sm text-center mt-2">حدث خطأ. يرجى المحاولة مرة أخرى.</p>
            )}
        </div>
    )
}

export default ReviewForm
