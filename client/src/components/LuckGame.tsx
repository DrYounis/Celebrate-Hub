"use client";
import React, { useState } from 'react';
import { Dices, MapPin } from 'lucide-react';
import styles from './LuckGame.module.css';

// Mock Data: Best places in Hail
const hailPlaces = [
    { id: 1, name: 'مطعم التراثي', type: 'مطعم شعبي', rating: 4.8, icon: '🥘' },
    { id: 2, name: 'كافيه جاز لاونج', type: 'قهوة مختصة', rating: 4.5, icon: '☕' },
    { id: 3, name: 'مشويات حائل', type: 'مشويات', rating: 4.7, icon: '🍖' },
    { id: 4, name: 'منتجع السمراء', type: 'ترفيه وعشاء', rating: 4.9, icon: '⛰️' },
    { id: 5, name: 'برجر بوتيك', type: 'وجبات سريعة', rating: 4.3, icon: '🍔' },
    { id: 6, name: 'كنافة الأرياف', type: 'حلويات', rating: 4.6, icon: '🍮' },
    { id: 7, name: 'مطعم القرية اللبنانية', type: 'عشاء فاخر', rating: 4.4, icon: '🥗' },
];

export const LuckGame = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSpin = () => {
        setIsSpinning(true);
        setResult(null);

        // Simulation of spinning
        let counter = 0;
        const interval = setInterval(() => {
            const random = hailPlaces[Math.floor(Math.random() * hailPlaces.length)];
            setResult(random); // flicker effect
            counter++;
            if (counter > 10) {
                clearInterval(interval);
                finishSpin();
            }
        }, 100);
    };

    const finishSpin = () => {
        // Final result
        const finalResult = hailPlaces[Math.floor(Math.random() * hailPlaces.length)];
        setResult(finalResult);
        setIsSpinning(false);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>🎲 جرب حظك اليوم!</h2>
                <p className={styles.subtitle}>
                    محتار وين تروح في حائل؟ أدر العجلة ودعنا نختار لك أفضل المطاعم والكافيهات
                </p>

                <div className={`${styles.gameBox} ${isSpinning ? styles.spinning : ''}`}>
                    {!result && !isSpinning && (
                        <>
                            <div className={styles.placeholder}>❓</div>
                            <h3>اضغط الزر وشوف وين وجهتك!</h3>
                        </>
                    )}

                    {result && (
                        <div className={styles.resultCard}>
                            <span className={styles.placeImage}>{result.icon}</span>
                            <h3 className={styles.placeName}>{result.name}</h3>
                            <span className={styles.placeType}>{result.type}</span>
                            <div className={styles.rating}>⭐ {result.rating} / 5.0</div>
                        </div>
                    )}
                </div>

                <button
                    className={styles.spinButton}
                    onClick={handleSpin}
                    disabled={isSpinning}
                >
                    {isSpinning ? 'جاري الاختيار...' : 'جرب حظك الآن'} <Dices size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                </button>
            </div>
        </section>
    );
};
