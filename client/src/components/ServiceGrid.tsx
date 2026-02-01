import React from 'react';
import {
    Building2,
    UtensilsCrossed,
    CalendarCheck2,
    Car,
    Sparkles,
    Palette
} from 'lucide-react';
import styles from './ServiceGrid.module.css';

const services = [
    {
        id: 1,
        title: 'قاعات ومخيمات',
        description: 'أفخم القاعات، الاستراحات، ومخيمات حائل المجهزة بالكامل.',
        icon: <Building2 size={36} />,
    },
    {
        id: 2,
        title: 'ضيافة وبوفيهات',
        description: 'ولائم، بوفيهات مفتوحة، وقهوة عربية أصيلة لضيوفك.',
        icon: <UtensilsCrossed size={36} />,
    },
    {
        id: 3,
        title: 'تنظيم وتنسيق',
        description: 'شركات تنظيم حفلات محترفة لتحويل خيالك إلى واقع.',
        icon: <CalendarCheck2 size={36} />,
    },
    {
        id: 4,
        title: 'تصميم وديكور',
        description: 'كوش افراح، تنسيق طاولات، وإضاءات ساحرة.',
        icon: <Palette size={36} />,
    },
    {
        id: 5,
        title: 'مراكز تجميل',
        description: 'أفضل الصالونات والمشاغل النسائية لتتألقي في ليلتك.',
        icon: <Sparkles size={36} />,
    },
    {
        id: 6,
        title: 'نقل ومواصلات',
        description: 'سيارات فارهة وتوصيل للضيوف من وإلى موقع الحفل.',
        icon: <Car size={36} />,
    },
];

export const ServiceGrid = () => {
    return (
        <section className={styles.section} id="services">
            <h2 className={styles.title}>خدماتنا المتكاملة</h2>
            <p className={styles.subtitle}>
                كل ما تحتاجه لمناسبتك في مكان واحد، اخترنا لك أفضل مزودي الخدمة في منطقة حائل
            </p>

            <div className={styles.grid}>
                {services.map((service) => (
                    <div key={service.id} className={styles.card}>
                        <div className={styles.iconWrapper}>
                            {service.icon}
                        </div>
                        <h3 className={styles.cardTitle}>{service.title}</h3>
                        <p className={styles.cardDescription}>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
