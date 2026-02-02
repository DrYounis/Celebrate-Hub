
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Message {
    id: string
    request_id: string
    sender_id: string
    content: string
    created_at: string
}

interface ChatRoomProps {
    requestId: string
    currentUserId: string
    otherUserName: string // For display ("Chatting with X")
}

const ChatRoom: React.FC<ChatRoomProps> = ({ requestId, currentUserId, otherUserName }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        // 1. Fetch existing messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('request_id', requestId)
                .order('created_at', { ascending: true })

            if (data) {
                setMessages(data)
                scrollToBottom()
            }
        }

        fetchMessages()

        // 2. Subscribe to new messages
        const channel = supabase
            .channel(`chat-${requestId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `request_id=eq.${requestId}` },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message])
                    scrollToBottom()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [requestId])

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        const { error } = await supabase.from('messages').insert([
            { request_id: requestId, sender_id: currentUserId, content: newMessage }
        ])

        if (error) {
            console.error('Error sending message:', error)
            alert('فشل إرسال الرسالة')
        } else {
            setNewMessage('')

            // Gamification: First message reward? (Logic would go here or in a database trigger)
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
                <div>
                    <h3 className="font-bold text-lg">محادثة مع {otherUserName}</h3>
                    <span className="text-xs text-indigo-200 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> متصل الآن
                    </span>
                </div>
                <button className="text-white hover:bg-white/20 p-2 rounded-full transition">✕</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/subtle-dark-vertical.png')]">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>لا توجد رسائل بعد.</p>
                        <p className="text-sm">ابدأ المحادثة للاستفسار عن التفاصيل!</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[75%] p-3 rounded-2xl text-sm relative shadow-sm ${isMe
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.content}</p>
                                <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                <button className="text-gray-400 hover:text-indigo-600 transition">
                    📎
                </button>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-gray-100 border-0 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                    ➤
                </button>
            </div>
        </div>
    )
}

export default ChatRoom
