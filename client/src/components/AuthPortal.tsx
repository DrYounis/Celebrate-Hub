'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from './AuthPortal.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface AuthPortalProps {
    onSuccess?: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onSuccess }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    // New roles added
    const [role, setRole] = useState<'free' | 'pro' | 'investor' | 'entrepreneur'>('free');

    useEffect(() => {
        // Auto-select role based on URL param (e.g. from Academy page)
        const typeParam = searchParams.get('type');
        if (typeParam === 'entrepreneur') {
            setRole('entrepreneur');
            setIsLogin(false); // Switch to registration mode
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Handle Sign In
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            } else {
                // Handle Sign Up
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role,
                            // Flag for Academy enrollments
                            is_marfa_enrolled: role === 'entrepreneur',
                            total_points: role === 'free' ? 50 : 0
                        }
                    }
                });
                if (signUpError) throw signUpError;

                if (role === 'investor') {
                    alert('تم استلام طلبك! حساب المستثمر يحتاج لموافقة الإدارة.');
                } else {
                    alert('تم التسجيل بنجاح! افحص بريدك لتأكيد الحساب');
                }
            }

            if (onSuccess) onSuccess();
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'حدث خطأ ما');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {isLogin ? 'تسجيل الدخول' : 'انضم إلى Celebrate Hub'}
            </h2>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="الاسم الكامل"
                        className={styles.input}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="كلمة المرور"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {!isLogin && (
                    <div className={styles.roleSelector}>
                        {/* Core Event Hub Roles */}
                        <label className={styles.roleOption}>
                            <input
                                type="radio"
                                name="role"
                                value="free"
                                checked={role === 'free'}
                                onChange={() => setRole('free')}
                                className={styles.roleInput}
                            />
                            <div className={styles.roleLabel}>منظم فعاليات</div>
                        </label>
                        <label className={styles.roleOption}>
                            <input
                                type="radio"
                                name="role"
                                value="pro"
                                checked={role === 'pro'}
                                onChange={() => setRole('pro')}
                                className={styles.roleInput}
                            />
                            <div className={styles.roleLabel}>مقدم خدمة (Pro)</div>
                        </label>

                        {/* New Marfa/Investment Roles */}
                        <div className="w-full border-t border-gray-200 my-2 pt-2 text-xs text-gray-400 text-center">أكاديمية مرفأ & الاستثمار</div>

                        <label className={styles.roleOption}>
                            <input
                                type="radio"
                                name="role"
                                value="entrepreneur"
                                checked={role === 'entrepreneur'}
                                onChange={() => setRole('entrepreneur')}
                                className={styles.roleInput}
                            />
                            <div className={styles.roleLabel}>رائد أعمال (أكاديمية مرفأ)</div>
                        </label>
                        <label className={styles.roleOption}>
                            <input
                                type="radio"
                                name="role"
                                value="investor"
                                checked={role === 'investor'}
                                onChange={() => setRole('investor')}
                                className={styles.roleInput}
                            />
                            <div className={styles.roleLabel}>مستثمر (يتطلب موافقة)</div>
                        </label>
                    </div>
                )}

                <button disabled={loading} className={styles.submitButton}>
                    {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'إنشاء حساب جديد')}
                </button>
            </form>

            <div className={styles.toggleLink}>
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <span
                    className={styles.toggleAction}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'سجل الآن' : 'تسجيل الدخول'}
                </span>
            </div>
        </div>
    );
};
