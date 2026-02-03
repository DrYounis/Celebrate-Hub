'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

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
        let cleaned = phoneNumber.replace(/[^\d]/g, ''); // Remove regex +, just keep digits
        // If it starts with 0 (e.g. 055...), strip it and add 966
        if (cleaned.startsWith('0')) {
            cleaned = '966' + cleaned.substring(1);
        }
        // If it already has 966 but no +, great. 
        // If just 55... we assume 966
        if (cleaned.length === 9 && (cleaned.startsWith('5'))) {
            cleaned = '966' + cleaned;
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
                aria-label="Contact on WhatsApp"
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

                {/* Official WhatsApp Icon SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px' }} className="relative z-10">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.129-1.341a9.965 9.965 0 004.883 1.28h.004c5.505 0 9.988-4.478 9.989-9.983 0-2.668-1.04-5.176-2.926-7.062A9.936 9.936 0 0012.012 2zm0 18.288h-.003a8.295 8.295 0 01-4.238-1.164l-.304-.18-3.15.824.84-3.07-.197-.315a8.295 8.295 0 011.666-8.775 8.3 8.3 0 0111.261 11.758c-1.55 1.587-3.663 2.502-5.875 2.502v.42zm5.424-6.223c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.787-1.48-1.761-1.653-2.058-.173-.298-.018-.459.13-.607.134-.133.297-.347.446-.52.149-.174.198-.298.298-.496.099-.199.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.084 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>

                {/* Notification Badge (optional) */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            </a>

            {/* Close Button */}
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
