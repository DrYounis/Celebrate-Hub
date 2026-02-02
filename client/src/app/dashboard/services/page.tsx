'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    base_price: number;
    location: string;
    capacity: number;
    is_active: boolean;
    average_rating: number;
    total_reviews: number;
}

export default function ServiceManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'venue',
        base_price: '',
        location: '',
        capacity: '',
        features: '',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setServices(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const serviceData = {
            provider_id: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            base_price: parseFloat(formData.base_price),
            location: formData.location,
            capacity: parseInt(formData.capacity),
            features: formData.features.split(',').map(f => f.trim()),
            is_active: true,
        };

        if (editingService) {
            const { error } = await supabase
                .from('services')
                .update(serviceData)
                .eq('id', editingService.id);

            if (!error) {
                alert('تم تحديث الخدمة بنجاح!');
                resetForm();
                fetchServices();
            }
        } else {
            const { error } = await supabase
                .from('services')
                .insert([serviceData]);

            if (!error) {
                alert('تم إضافة الخدمة بنجاح!');
                resetForm();
                fetchServices();
            }
        }
    };

    const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('services')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (!error) fetchServices();
    };

    const deleteService = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (!error) fetchServices();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'venue',
            base_price: '',
            location: '',
            capacity: '',
            features: '',
        });
        setEditingService(null);
        setShowForm(false);
    };

    const editService = (service: Service) => {
        setFormData({
            title: service.title,
            description: service.description || '',
            category: service.category,
            base_price: service.base_price.toString(),
            location: service.location || '',
            capacity: service.capacity?.toString() || '',
            features: '', // Will be populated from service data
        });
        setEditingService(service);
        setShowForm(true);
    };

    if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6" dir="rtl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    إضافة خدمة جديدة
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">
                        {editingService ? 'تعديل الخدمة' : 'خدمة جديدة'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    عنوان الخدمة *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="مثال: قاعة الأفراح الملكية"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    الفئة *
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="venue">قاعات</option>
                                    <option value="catering">تقديم طعام</option>
                                    <option value="photography">تصوير</option>
                                    <option value="decoration">ديكور</option>
                                    <option value="entertainment">ترفيه</option>
                                    <option value="planning">تنظيم</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    السعر الأساسي (ريال) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.base_price}
                                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="15000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    الموقع *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="الرياض - حي النرجس"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    السعة (عدد الضيوف)
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    المميزات (افصل بفاصلة)
                                </label>
                                <input
                                    type="text"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="إضاءة LED, نظام صوت, مواقف سيارات"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                الوصف
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="وصف تفصيلي للخدمة..."
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-bold"
                            >
                                {editingService ? 'حفظ التعديلات' : 'إضافة الخدمة'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {services.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg mb-4">لا توجد خدمات مضافة بعد</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                        >
                            أضف خدمتك الأولى
                        </button>
                    </div>
                ) : (
                    services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {service.is_active ? 'نشط' : 'متوقف'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{service.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>📍 {service.location}</span>
                                        <span>💰 {service.base_price} ريال</span>
                                        {service.capacity && <span>👥 {service.capacity} ضيف</span>}
                                        <span>⭐ {service.average_rating.toFixed(1)} ({service.total_reviews} تقييم)</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        title={service.is_active ? 'إيقاف' : 'تفعيل'}
                                    >
                                        {service.is_active ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    <button
                                        onClick={() => editService(service)}
                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                        title="تعديل"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteService(service.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                                        title="حذف"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
