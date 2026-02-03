'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    vendorName?: string;
    serviceName?: string;
    variant?: 'primary' | 'secondary' | 'icon';
    className?: string;
}

export default function WhatsAppButton({
    phone,
    message,
    vendorName,
    serviceName,
    variant = 'primary',
    className = '',
}: WhatsAppButtonProps) {
    // Format phone number for WhatsApp (remove spaces, dashes, etc.)
    const formatPhoneForWhatsApp = (phoneNumber: string): string => {
        // Remove all non-digit characters except +
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');

        // If doesn't start with +, assume Saudi number and add +966
        if (!cleaned.startsWith('+')) {
            // Remove leading 0 if present
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }
            cleaned = '+966' + cleaned;
        }

        return cleaned;
    };

    // Generate default message if not provided
    const getDefaultMessage = (): string => {
        if (message) return message;

        let defaultMsg = 'مرحباً';
        if (vendorName) defaultMsg += ` ${vendorName}`;
        if (serviceName) defaultMsg += `، أنا مهتم بخدمة ${serviceName}`;
        defaultMsg += '. أود الاستفسار عن المزيد من التفاصيل.';

        return defaultMsg;
    };

    const whatsappPhone = formatPhoneForWhatsApp(phone);
    const whatsappMessage = encodeURIComponent(getDefaultMessage());
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

    // Variant styles
    const variantStyles = {
        primary: 'bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 justify-center',
        secondary: 'bg-white hover:bg-gray-50 text-[#25D366] border-2 border-[#25D366] px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-3 justify-center',
        icon: 'bg-[#25D366] hover:bg-[#20BD5A] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center',
    };

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${variantStyles[variant]} ${className}`}
            onClick={(e) => {
                // Track WhatsApp click event (optional analytics)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'whatsapp_click', {
                        vendor_name: vendorName,
                        service_name: serviceName,
                    });
                }
            }}
        >
            <MessageCircle size={variant === 'icon' ? 24 : 20} />
            {variant !== 'icon' && <span>تواصل عبر واتساب</span>}
        </a>
    );
}
