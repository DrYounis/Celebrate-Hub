"use client";
import React, { useState } from 'react';
import { Dices, MapPin, Coffee, Utensils } from 'lucide-react';
import styles from './LuckGame.module.css';

// Updated Mock Data with Category and Map Query
const hailPlaces = [
    { id: 1, name: 'مطعم التراثي', type: 'مطعم شعبي', category: 'food', rating: 4.8, icon: '🥘', mapQuery: 'مطعم التراثي حائل' },
    { id: 2, name: 'كافيه جاز لاونج', type: 'قهوة مختصة', category: 'coffee', rating: 4.5, icon: '☕', mapQuery: 'جاز لاونج حائل' },
    { id: 3, name: 'مشويات حائل', type: 'مشويات', category: 'food', rating: 4.7, icon: '🍖', mapQuery: 'مشويات حائل' },
    { id: 4, name: 'منتجع السمراء', type: 'ترفيه وعشاء', category: 'both', rating: 4.9, icon: '⛰️', mapQuery: 'منتجع السمراء حائل' },
    { id: 5, name: 'برجر بوتيك', type: 'وجبات سريعة', category: 'food', rating: 4.3, icon: '🍔', mapQuery: 'برجر بوتيك حائل' },
    { id: 6, name: 'كنافة الأرياف', type: 'حلويات', category: 'food', rating: 4.6, icon: '🍮', mapQuery: 'كنافة الأرياف حائل' },
    { id: 7, name: 'مطعم القرية اللبنانية', type: 'عشاء فاخر', category: 'food', rating: 4.4, icon: '🥗', mapQuery: 'مطعم القرية اللبنانية حائل' },
    { id: 8, name: 'أوفردوز كافيه', type: 'قهوة وحلى', category: 'coffee', rating: 4.6, icon: '🥤', mapQuery: 'Overdose Cafe Hail' },
    { id: 9, name: 'بارنز كافيه', type: 'قهوة سريعة', category: 'coffee', rating: 4.2, icon: '☕', mapQuery: 'Barns Cafe Hail' },
];

export const LuckGame = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [filter, setFilter] = useState<'all' | 'food' | 'coffee'>('all');

    const filteredPlaces = hailPlaces.filter(place => {
        if (filter === 'all') return true;
        return place.category === filter || place.category === 'both';
    });

    const handleSpin = () => {
        setIsSpinning(true);
        setResult(null);

        // Simulation of spinning
        let counter = 0;
        const interval = setInterval(() => {
            const random = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
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
        const finalResult = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
        setResult(finalResult);
        setIsSpinning(false);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>🎲 جرب حظك اليوم!</h2>
                <p className={styles.subtitle}>
                    محتار وين تروح في حائل؟ حدد مزاجك وأدر العجلة
                </p>

                {/* Filter Buttons */}
                <div className={styles.filterContainer}>
                    <button
                        className={`${styles.filterButton} ${filter === 'coffee' ? styles.active : ''}`}
                        onClick={() => setFilter('coffee')}
                    >
                        <Coffee size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} /> قهوة وحلى
                    </button>
                    <button
                        className={`${styles.filterButton} ${filter === 'food' ? styles.active : ''}`}
                        onClick={() => setFilter('food')}
                    >
                        <Utensils size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} /> عشاء / غداء
                    </button>
                    <button
                        className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        الكل
                    </button>
                </div>

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

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.mapQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mapLink}
                            >
                                <MapPin size={18} /> عرض الموقع على الخريطة
                            </a>
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
