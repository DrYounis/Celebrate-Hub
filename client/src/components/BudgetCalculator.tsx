"use client";
import React, { useState } from 'react';
import { Calculator, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import styles from './BudgetCalculator.module.css';

export const BudgetCalculator = () => {
    const [eventType, setEventType] = useState('wedding');
    const [budget, setBudget] = useState<string>('');
    const [plan, setPlan] = useState<any>(null);

    const calculatePlan = () => {
        const total = parseFloat(budget);
        if (!total || total <= 0) return;

        // MVP Logic: Simple percentage split
        // Venue 40%, Catering 30%, Styling 20%, Extras 10%
        setPlan({
            venue: total * 0.4,
            catering: total * 0.3,
            styling: total * 0.2,
            extras: total * 0.1,
            total: total
        });
    };

    return (
        <section className={styles.section} id="budget">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>محرك التخطيط الذكي</h2>
                    <p className={styles.subtitle}>حدد ميزانيتك، وسنقوم بتوزيعها لك على أفضل الخدمات المتاحة في حائل</p>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>نوع المناسبة</label>
                        <select
                            className={styles.select}
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                        >
                            <option value="wedding">حفل زفاف</option>
                            <option value="graduation">حفل تخرج</option>
                            <option value="birthday">عيد ميلاد</option>
                            <option value="gathering">عزيمة / عشاء</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>المدينة</label>
                        <select className={styles.select} disabled>
                            <option value="hail">حائل (المنطقة الحالية)</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>الميزانية التقديرية (ريال)</label>
                        <input
                            type="number"
                            placeholder="مثلاً: 20000"
                            className={styles.input}
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Button onClick={calculatePlan} size="default" style={{ width: '100%', maxWidth: '300px' }}>
                        <Calculator size={20} /> اقترح لي خطة
                    </Button>
                </div>

                {plan && (
                    <div className={styles.resultContainer}>
                        <h3 className={styles.breakdownTitle}>
                            <CheckCircle2 color="var(--secondary)" size={24} style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                            خطتك المقترحة
                        </h3>

                        <div className={styles.cardsContainer}>
                            <div className={styles.budgetCard}>
                                <span className={styles.cardIcon}>🏰</span>
                                <span className={styles.cardCategory}>القاعة / المكان</span>
                                <span className={styles.cardAmount}>{plan.venue.toLocaleString()} ر.س</span>
                            </div>

                            <div className={styles.budgetCard}>
                                <span className={styles.cardIcon}>🍽️</span>
                                <span className={styles.cardCategory}>الضيافة والعشاء</span>
                                <span className={styles.cardAmount}>{plan.catering.toLocaleString()} ر.س</span>
                            </div>

                            <div className={styles.budgetCard}>
                                <span className={styles.cardIcon}>💐</span>
                                <span className={styles.cardCategory}>التنسيق والديكور</span>
                                <span className={styles.cardAmount}>{plan.styling.toLocaleString()} ر.س</span>
                            </div>

                            <div className={styles.budgetCard}>
                                <span className={styles.cardIcon}>🚗</span>
                                <span className={styles.cardCategory}>أخرى (نقل/تجميل)</span>
                                <span className={styles.cardAmount}>{plan.extras.toLocaleString()} ر.س</span>
                            </div>
                        </div>

                        <div className={styles.totalBanner}>
                            إجمالي الميزانية المخططة: {plan.total.toLocaleString()} ريال سعودي
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
