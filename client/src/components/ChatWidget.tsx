'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, ChevronDown } from 'lucide-react';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "مرحباً بك! أنا سارة من Celebrate Hub 👋", isUser: false },
        { id: 2, text: "كيف يمكنني مساعدتك في تخطيط مناسبتك اليوم؟", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add User Message
        const userMsg = { id: Date.now(), text: inputValue, isUser: true };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Mock Reply (Simulating "Typically replies in minutes")
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "شكراً لتواصلك! سيقوم أحد مستشارينا بالرد عليك خلال دقائق. 🕒",
                isUser: false
            }]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-['Cairo'] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-[2rem] shadow-2xl w-[380px] h-[600px] mb-4 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300 border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] p-6 text-white relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-white rounded-full p-1 shadow-md">
                                    <img
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt&hairColor=black"
                                        alt="Agent"
                                        className="w-full h-full rounded-full bg-gray-100"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#7C3AED]"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">سارة - المستشار الذكي</h3>
                                <p className="text-purple-100 text-xs opacity-90">عادةً ما نرد خلال دقائق</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 bg-[#F9FAFB] p-6 overflow-y-auto space-y-4">
                        <div className="text-center text-xs text-gray-400 my-4">اليوم</div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isUser && (
                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 self-end mb-1 shadow-sm">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt&hairColor=black" alt="Bot" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isUser
                                            ? 'bg-[#8B5CF6] text-white rounded-br-none'
                                            : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Footer */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-[#8B5CF6] transition-colors px-2 py-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="اسألني أي شيء..."
                                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-gray-700 placeholder-gray-400"
                            />
                            <button
                                onClick={handleSend}
                                className={`p-2 rounded-full transition-all duration-300 ${inputValue.trim() ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'}`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <a href="https://celebhub.space" className="text-[10px] text-gray-300 hover:text-gray-400 transition">Powered by Celebrate Hub</a>
                        </div>
                    </div>
                </div>
            )}

            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${isOpen ? 'bg-[#8B5CF6] text-white' : 'bg-[#0D0032] text-white'}`}
            >
                {isOpen ? (
                    <ChevronDown size={28} />
                ) : (
                    <>
                        <span className="font-bold hidden md:block">محادثة فورية</span>
                        <div className="relative">
                            <MessageCircle size={28} className="animate-pulse" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                    </>
                )}
            </button>
        </div>
    );
};
