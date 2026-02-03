'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
    phone: string;
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
}

export default function FloatingWhatsApp({
    phone = '+966501234567', // Default support number
    message = 'مرحباً! أحتاج إلى مساعدة في Celebrate Hub',
    position = 'bottom-left', // Changed to bottom-left for RTL
}: FloatingWhatsAppProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Format phone number for WhatsApp
    const formatPhoneForWhatsApp = (phoneNumber: string): string => {
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+')) {
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }
            cleaned = '+966' + cleaned;
        }
        return cleaned;
    };

    const whatsappPhone = formatPhoneForWhatsApp(phone);
    const whatsappMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed ${positionClasses[position]} z-50 group`}>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                    تواصل معنا عبر واتساب
                    <div className="absolute top-full left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                </div>
            </div>

            {/* WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative"
                onClick={() => {
                    // Track analytics
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'floating_whatsapp_click', {
                            location: window.location.pathname,
                        });
                    }
                }}
            >
                {/* Pulse Animation */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>

                {/* Icon */}
                <MessageCircle size={28} className="relative z-10" />

                {/* Notification Badge (optional) */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            </a>

            {/* Close Button (optional - can be removed if you want it always visible) */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="إخفاء"
            >
                <X size={14} />
            </button>
        </div>
    );
}
