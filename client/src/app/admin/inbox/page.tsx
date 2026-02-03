'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Send, User, Clock, CheckCircle, MessageCircle } from 'lucide-react';

// Admin Inbox for Instant Chat
export default function AdminInboxPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [replyText, setReplyText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Sessions
    useEffect(() => {
        const fetchSessions = async () => {
            const { data } = await supabase
                .from('chat_sessions')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) setSessions(data);
        };

        fetchSessions();

        // Sub to new sessions
        const channel = supabase.channel('admin-sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' },
                () => fetchSessions())
            .subscribe();

        return () => { supabase.removeChannel(channel) };
    }, []);

    // 2. Fetch Messages for Active Session
    useEffect(() => {
        if (!activeSessionId) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', activeSessionId)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
        };

        fetchMessages();

        // Sub to new messages
        const channel = supabase.channel(`admin-chat:${activeSessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${activeSessionId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
            .subscribe();

        return () => { supabase.removeChannel(channel) };
    }, [activeSessionId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendReply = async () => {
        if (!replyText.trim() || !activeSessionId) return;

        const text = replyText;
        setReplyText("");

        await supabase.from('chat_messages').insert({
            session_id: activeSessionId,
            sender_type: 'agent',
            content: text
        });

        // Update session timestamp
        await supabase.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', activeSessionId);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            {/* Sidebar List */}
            <div className="w-1/3 border-l border-gray-200 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-100 bg-indigo-900 text-white">
                    <h1 className="text-xl font-bold">صندوق المحادثات 📥</h1>
                    <p className="text-sm opacity-80">{sessions.length} محادثة نشطة</p>
                </div>
                <div>
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setActiveSessionId(session.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-indigo-50 transition ${activeSessionId === session.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-800 flex items-center gap-2">
                                    <User size={16} /> زائر #{session.visitor_token.slice(0, 4)}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(session.updated_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                                انقر للمشاهدة
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#F3F4F6]">
                {activeSessionId ? (
                    <>
                        <div className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
                            <h2 className="font-bold text-gray-800">جاري المحادثة مع زائر #{sessions.find(s => s.id === activeSessionId)?.visitor_token.slice(0, 4)}</h2>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> متصل
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender_type === 'agent'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                            }`}
                                    >
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 opacity-70 ${msg.sender_type === 'agent' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString('ar-SA')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center gap-2 max-w-4xl mx-auto">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                    placeholder="اكتب ردك هنا..."
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                <button
                                    onClick={handleSendReply}
                                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle size={64} className="mb-4 opacity-50" />
                        <p className="text-lg">اختر محادثة من القائمة للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
}
