import React from 'react';
import Link from 'next/link';
import { Search, PartyPopper } from 'lucide-react';
import { Button } from './ui/Button';
import styles from './Header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            {/* 1. Logo */}
            <div className={styles.logoContainer}>
                <PartyPopper className={styles.logoIcon} size={32} />
                <span>Celebrate Hub</span>
            </div>

            {/* 2. Search Bar */}
            <div className={styles.searchBar}>
                <Search size={18} color="#666" />
                <input
                    type="text"
                    placeholder="ابحث عن قاعة، بوفيه، أو خدمة..."
                    className={styles.searchInput}
                />
            </div>

            {/* 3. Navigation Links */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>الرئيسية</Link>
                <Link href="/services" className={styles.navLink}>الخدمات</Link>
                <Link href="/planners" className={styles.navLink}>منظمون</Link>
                <Link href="/contact" className={styles.navLink}>تواصل معنا</Link>
            </nav>

            {/* 4. Action Buttons */}
            <div className={styles.actions}>
                <Button variant="ghost">تسجيل الدخول</Button>
                <Button variant="primary">أضف مناسبتك</Button>
            </div>
        </header>
    );
};
