'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting message (local only, acts as prompt)
    const initialGreeting = {
        id: 'greeting',
        text: "Hello there! Drop us a line to get in touch 😊",
        isUser: false,
        createdAt: new Date().toISOString()
    };

    // Load or create session on mount
    useEffect(() => {
        const initChat = async () => {
            // 1. Try to get existing token from local storage
            let token = localStorage.getItem('chat_visitor_token');
            if (!token) {
                token = Math.random().toString(36).substring(2) + Date.now().toString(36);
                localStorage.setItem('chat_visitor_token', token);
            }

            // 2. Check for active session in DB
            const { data: existingSession } = await supabase
                .from('chat_sessions')
                .select('id')
                .eq('visitor_token', token)
                .eq('status', 'active')
                .maybeSingle();

            if (existingSession) {
                setSessionId(existingSession.id);
                fetchMessages(existingSession.id);
                subscribeToMessages(existingSession.id);
            }
        }
        initChat();
    }, []);

    const createSessionIfNeeded = async () => {
        if (sessionId) return sessionId;

        const token = localStorage.getItem('chat_visitor_token');
        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({ visitor_token: token, status: 'active' })
            .select()
            .single();

        if (data) {
            setSessionId(data.id);
            subscribeToMessages(data.id);
            return data.id;
        }
        console.error("Error creating session", error);
        return null;
    };

    const fetchMessages = async (sid: string) => {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sid)
            .order('created_at', { ascending: true });

        if (data) {
            setMessages(data.map(m => ({
                id: m.id,
                text: m.content,
                isUser: m.sender_type === 'visitor',
                createdAt: m.created_at
            })));
        }
    };

    const subscribeToMessages = (sid: string) => {
        const channel = supabase
            .channel(`chat:${sid}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sid}` },
                (payload) => {
                    const newMsg = payload.new;
                    setMessages(prev => {
                        // Avoid duplicates if we inserted it locally
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, {
                            id: newMsg.id,
                            text: newMsg.content,
                            isUser: newMsg.sender_type === 'visitor',
                            createdAt: newMsg.created_at
                        }];
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel) };
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const text = inputValue;
        setInputValue(""); // Optimistic clear

        // 1. Ensure session exists
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            currentSessionId = await createSessionIfNeeded();
        }

        if (!currentSessionId) return;

        // 2. Insert Message
        const { error } = await supabase
            .from('chat_messages')
            .insert({
                session_id: currentSessionId,
                sender_type: 'visitor',
                content: text
            });

        if (error) {
            console.error("Error sending message", error);
            // Revert optimistic clear if needed, or show error
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Combine greeting with messages
    const displayMessages = messages.length === 0 ? [initialGreeting] : [initialGreeting, ...messages];

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            {isOpen && (
                <div className="bg-white rounded-[24px] shadow-2xl w-[360px] h-[600px] mb-4 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300 border border-gray-100 font-['Inter']">
                    {/* Header - Light Purple */}
                    <div className="bg-[#BFA6FF] p-6 pb-8 text-white relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white hover:opacity-80 transition"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt&hairColor=blonde"
                                    alt="Agent"
                                    className="w-full h-full bg-white"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Stine</h3>
                                <p className="text-white/90 text-sm">We typically reply in a few minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 bg-white p-6 overflow-y-auto space-y-6">
                        {displayMessages.map((msg, idx) => (
                            <div key={msg.id || idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isUser && (
                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 self-end mb-1 shrink-0">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt&hairColor=blonde" alt="Bot" className="bg-gray-100" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.isUser
                                            ? 'bg-[#BFA6FF] text-white rounded-br-none'
                                            : 'bg-[#F3F4F6] text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Input Area */}
                    <div className="p-4 bg-white">
                        {/* Privacy Text */}
                        <div className="mb-3 px-2">
                            <p className="text-[10px] text-gray-400 text-center leading-tight">
                                To give you the content requested, we need to store and process your personal data. For information on how to unsubscribe, as well as our privacy practices and commitment to protecting your privacy, please review our <a href="#" className="underline text-blue-400">Privacy Policy</a>.
                            </p>
                        </div>

                        {/* Pill Input */}
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="w-full bg-white border border-gray-300 rounded-full px-5 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#BFA6FF] focus:ring-1 focus:ring-[#BFA6FF] shadow-sm transition-all"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 p-2 text-gray-400 hover:text-[#BFA6FF] transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Launcher Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-[#BFA6FF] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform duration-300"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            {/* Close Button styling when open is usually implicit in the header close button, or we can transform the launcher. 
                The user image shows an X in the purple header, so we rely on that. 
            */}
        </div>
    );
};
