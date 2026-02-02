
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ChatRoom from '@/components/ChatRoom'

export default function ChatPage() {
    const params = useParams()
    const requestId = params.requestId as string
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [requestDetails, setRequestDetails] = useState<any>(null)

    useEffect(() => {
        const init = async () => {
            // 1. Get Current User
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setCurrentUser(user)

            // 2. Get Request Details (to know who we are talking to)
            const { data: req, error } = await supabase
                .from('event_requests')
                .select(`
                *,
                client:client_id(full_name, id),
                contractor:contractor_id(business_name, id)
            `)
                .eq('id', requestId)
                .single()

            if (error || !req) {
                console.error('Error fetching request:', error)
                alert('الطلب غير موجود')
                router.push('/dashboard')
                return
            }

            // Verify access (RLS does this on DB, but good for UI state)
            if (user.id !== req.client_id && user.id !== req.contractor_id) {
                alert('ليس لديك صلاحية الوصول لهذه المحادثة')
                router.push('/dashboard')
                return
            }

            setRequestDetails(req)
            setLoading(false)
        }

        init()
    }, [requestId, router])

    if (loading) return <div className="p-12 text-center">جاري تحميل المحادثة...</div>

    // Determine the "Other" user name
    const isClient = currentUser.id === requestDetails.client_id
    const otherName = isClient ? requestDetails.contractor?.business_name : requestDetails.client?.full_name

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.back()} className="text-gray-500 mb-4 hover:text-gray-800 flex items-center gap-2">
                    <span>←</span> العودة
                </button>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">تفاصيل الطلب: {requestDetails.event_name}</h1>
                    <p className="text-gray-500">الحالة: {requestDetails.status}</p>
                </div>

                <ChatRoom
                    requestId={requestId}
                    currentUserId={currentUser.id}
                    otherUserName={otherName || 'الطرف الآخر'}
                />
            </div>
        </div>
    )
}
