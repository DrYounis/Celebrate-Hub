import React from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Button } from './ui/Button';
import styles from './Hero.module.css';

export const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>

                {/* Badge */}
                <div className={styles.badge}>
                    ✨ انطلاقتنا الآن في مدينة حائل
                </div>

                {/* Main Title */}
                <h1 className={styles.title}>
                    خطط لمناسبتك بذكاء <br />
                    <span className={styles.highlight}>واصنع ذكريات لا تُنسى</span>
                </h1>

                {/* Subtitle */}
                <p className={styles.subtitle}>
                    المنصة الأولى التي تجمع لك أرقى القاعات، خدمات الضيافة، والمواهب التنظيمية في مكان واحد. حدد ميزانيتك ودعنا نتكفل بالباقي.
                </p>

                {/* CTAs */}
                <div className={styles.ctaGroup}>
                    <Button size="default" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                        ابدأ التخطيط الآن <ArrowLeft size={20} />
                    </Button>

                    <Button variant="outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                        شاهد الفيديو التعريفي <PlayCircle size={20} />
                    </Button>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <h3>+50</h3>
                        <p>مزود خدمة في حائل</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>100%</h3>
                        <p>ضمان الجودة</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>AI</h3>
                        <p>تخطيط ذكي</p>
                    </div>
                </div>

            </div>
        </section>
    );
};
