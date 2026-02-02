'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Star, Calendar, Clock, ArrowRight } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    base_price: number;
    location: string;
    capacity: number;
    average_rating: number;
    total_reviews: number;
    features: string[];
    provider_id: string;
    profiles: {
        business_name: string;
        full_name: string;
    };
}

interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    max_guests: number;
    duration_hours: number;
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [service, setService] = useState<Service | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);

    // Booking form state
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingStep, setBookingStep] = useState(1);

    useEffect(() => {
        fetchServiceDetails();
    }, [params.id]);

    const fetchServiceDetails = async () => {
        const { data: serviceData } = await supabase
            .from('services')
            .select(`
        *,
        profiles:provider_id (business_name, full_name)
      `)
            .eq('id', params.id)
            .single();

        const { data: packagesData } = await supabase
            .from('service_packages')
            .select('*')
            .eq('service_id', params.id)
            .eq('is_active', true);

        if (serviceData) setService(serviceData as any);
        if (packagesData) setPackages(packagesData);
        setLoading(false);
    };

    const handleBooking = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('يرجى تسجيل الدخول أولاً');
            router.push('/');
            return;
        }

        if (!service) return;

        const bookingData = {
            service_id: service.id,
            package_id: selectedPackage?.id || null,
            customer_id: user.id,
            provider_id: service.provider_id,
            event_date: eventDate,
            event_time: eventTime || null,
            guest_count: guestCount ? parseInt(guestCount) : null,
            total_amount: selectedPackage?.price || service.base_price,
            customer_notes: notes,
            payment_status: 'pending',
            booking_status: 'pending',
        };

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) {
            alert('حدث خطأ في الحجز: ' + error.message);
            return;
        }

        if (data) {
            // Award points for booking
            await supabase.rpc('award_points', {
                p_user_id: user.id,
                p_points: 50,
                p_action: 'create_booking'
            });

            alert('تم إنشاء الحجز بنجاح! سيتم التواصل معك قريباً.');
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">الخدمة غير موجودة</h2>
                    <button
                        onClick={() => router.push('/services')}
                        className="text-purple-600 hover:underline"
                    >
                        العودة للخدمات
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Hero Image */}
            <div className="h-96 bg-gradient-to-br from-purple-400 to-pink-400 relative">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-8 right-8 bg-white px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500" size={20} />
                        <span className="font-bold text-xl">{service.average_rating.toFixed(1)}</span>
                        <span className="text-gray-600">({service.total_reviews} تقييم)</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Service Info */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
                            <p className="text-gray-600 text-lg mb-6">{service.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <MapPin className="text-purple-600" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-500">الموقع</p>
                                        <p className="font-bold">{service.location}</p>
                                    </div>
                                </div>
                                {service.capacity && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Users className="text-purple-600" size={24} />
                                        <div>
                                            <p className="text-sm text-gray-500">السعة</p>
                                            <p className="font-bold">{service.capacity} ضيف</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {service.features && service.features.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">المميزات</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Packages */}
                        {packages.length > 0 && (
                            <div className="bg-white p-8 rounded-2xl shadow-sm">
                                <h2 className="text-2xl font-bold mb-6">الباقات المتاحة</h2>
                                <div className="grid gap-4">
                                    {packages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition ${selectedPackage?.id === pkg.id
                                                    ? 'border-purple-600 bg-purple-50'
                                                    : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                                                    <p className="text-gray-600">{pkg.description}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-3xl font-bold text-purple-600">
                                                        {pkg.price.toLocaleString()} <span className="text-lg">ريال</span>
                                                    </p>
                                                </div>
                                            </div>
                                            {pkg.features && pkg.features.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {pkg.features.map((feature, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-4">
                            <h3 className="text-2xl font-bold mb-6">احجز الآن</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <Calendar className="inline ml-2" size={16} />
                                        تاريخ المناسبة *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <Clock className="inline ml-2" size={16} />
                                        الوقت
                                    </label>
                                    <input
                                        type="time"
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        <Users className="inline ml-2" size={16} />
                                        عدد الضيوف
                                    </label>
                                    <input
                                        type="number"
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        placeholder="مثال: 200"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        ملاحظات إضافية
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="أي تفاصيل إضافية..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">الإجمالي</span>
                                        <span className="text-3xl font-bold text-purple-600">
                                            {(selectedPackage?.price || service.base_price).toLocaleString()} ريال
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        disabled={!eventDate}
                                        className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        تأكيد الحجز
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        ✨ احصل على 50 نقطة مكافأة عند إتمام الحجز!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
