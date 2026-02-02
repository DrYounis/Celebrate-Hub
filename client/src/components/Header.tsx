import React from 'react';
import Link from 'next/link';
import { Search, PartyPopper } from 'lucide-react';
import { Button } from './ui/Button';
import styles from './Header.module.css';
import { AuthModal } from './AuthModal';
import { supabase } from '@/lib/supabaseClient';

export const Header = () => {
    const [isAuthOpen, setIsAuthOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

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
                {user ? (
                    <Link href="/dashboard">
                        <Button variant="ghost">لوحة التحكم</Button>
                    </Link>
                ) : (
                    <Button variant="ghost" onClick={() => setIsAuthOpen(true)}>تسجيل الدخول</Button>
                )}
                <Button variant="primary">أضف مناسبتك</Button>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </header>
    );
};
