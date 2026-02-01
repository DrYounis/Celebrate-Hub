"use client";
import React, { useState } from 'react';
import { Dices, MapPin, Coffee, Utensils } from 'lucide-react';
import styles from './LuckGame.module.css';

// Comprehensive Database: Popular Restaurants and Cafes in Hail (Based on Google Maps)
const hailPlaces = [
    // --- Traditional & Saudi Restaurants ---
    { id: 1, name: 'مطعم التراثي', type: 'شعبي تراثي', category: 'food', rating: 4.8, icon: '🛖', mapQuery: 'Al Turathi Restaurant Hail' },
    { id: 2, name: 'الوادي المبارك', type: 'مأكولات شامية', category: 'food', rating: 4.5, icon: '🥘', mapQuery: 'Alwadi Almubarak Restaurant Hail' },
    { id: 3, name: 'مطعم المضياف', type: 'سعودي', category: 'food', rating: 4.2, icon: '🍚', mapQuery: 'Medhiaf Restaurant Hail' },
    { id: 4, name: 'مطعم أبرود', type: 'سعودي', category: 'food', rating: 4.3, icon: '🥘', mapQuery: 'Abroud Restaurant Hail' },

    // --- Seafood ---
    { id: 5, name: 'مطعم المرسى', type: 'مأكولات بحرية', category: 'food', rating: 4.6, icon: '🦞', mapQuery: 'Al-Marsaai Restaurant Hail' },

    // --- International Cuisine ---
    { id: 6, name: 'كوبر هاوس', type: 'هندي', category: 'food', rating: 4.7, icon: '🍛', mapQuery: 'Copper House Restaurant Hail' },
    { id: 7, name: 'مطعم القرية اللبنانية', type: 'لبناني فاخر', category: 'food', rating: 4.4, icon: '🥗', mapQuery: 'Lebanese Village Restaurant Hail' },
    { id: 8, name: 'أبل بيز', type: 'أمريكي', category: 'food', rating: 4.3, icon: '🥩', mapQuery: 'Applebees Hail' },
    { id: 9, name: 'تشيس كلوب', type: 'إيطالي آسيوي', category: 'food', rating: 4.5, icon: '🍝', mapQuery: 'Chess Club Restaurant Hail' },
    { id: 10, name: 'كروبس إيطالي', type: 'إيطالي', category: 'food', rating: 4.4, icon: '🍕', mapQuery: 'CROPS ITALY Hail' },
    { id: 11, name: 'مدراس كافيه', type: 'هندي', category: 'food', rating: 4.2, icon: '🍛', mapQuery: 'Madras Cafe Hail' },
    { id: 12, name: 'مطعم نيرالا', type: 'باكستاني', category: 'food', rating: 4.1, icon: '🍲', mapQuery: 'Nirala Restaurant Hail' },
    { id: 13, name: 'كيرلا', type: 'هندي جنوبي', category: 'food', rating: 4.3, icon: '🌶️', mapQuery: 'Kerala Restaurant Hail' },

    // --- Grills & BBQ ---
    { id: 14, name: 'مشويات حائل', type: 'مشويات', category: 'food', rating: 4.7, icon: '🍖', mapQuery: 'Mashwiyat Hail' },
    { id: 15, name: 'شواية هاوس', type: 'شاورما ومشاوي', category: 'food', rating: 4.2, icon: '🍗', mapQuery: 'Shawaya House Hail' },

    // --- Fast Food ---
    { id: 16, name: 'البيك', type: 'وجبات سريعة', category: 'food', rating: 4.8, icon: '🍟', mapQuery: 'Albaik Hail' },
    { id: 17, name: 'كودو', type: 'برجر وساندوتش', category: 'food', rating: 4.1, icon: '🥪', mapQuery: 'Kudu Hail' },
    { id: 18, name: 'هرفي', type: 'وجبات سريعة', category: 'food', rating: 4.0, icon: '🍔', mapQuery: 'Herfy Hail' },
    { id: 19, name: 'برجر بوتيك', type: 'برجر', category: 'food', rating: 4.3, icon: '🍔', mapQuery: 'Burger Boutique Hail' },
    { id: 20, name: 'صب واي', type: 'ساندوتشات', category: 'food', rating: 4.0, icon: '🥖', mapQuery: 'Subway Hail' },
    { id: 21, name: 'كنتاكي', type: 'دجاج مقلي', category: 'food', rating: 4.1, icon: '🍗', mapQuery: 'KFC Hail' },

    // --- Fine Dining & Special ---
    { id: 22, name: 'ريستو إن ذا سكاي', type: 'إطلالة فاخرة', category: 'food', rating: 4.6, icon: '🌆', mapQuery: 'Resto in the Sky Hail' },
    { id: 23, name: 'كشريتا', type: 'مأكولات متنوعة', category: 'food', rating: 4.0, icon: '🍛', mapQuery: 'Kosherita Hail' },

    // --- Specialty Coffee Shops ---
    { id: 101, name: 'إيرث كافيه', type: 'قهوة وتراث', category: 'coffee', rating: 4.9, icon: '☕', mapQuery: 'Earth Cafe Hail' },
    { id: 102, name: 'ألكيمي', type: 'قهوة مختصة', category: 'coffee', rating: 4.7, icon: '⚗️', mapQuery: 'Alchemy Specialty Coffee Hail' },
    { id: 103, name: 'محمصة خطوة جمل', type: 'قهوة مختصة', category: 'coffee', rating: 4.8, icon: '🐫', mapQuery: 'Camel Step Coffee Roasters Hail' },
    { id: 104, name: 'محمصة 17 ديسمبر', type: 'قهوة مختصة', category: 'coffee', rating: 4.7, icon: '🗓️', mapQuery: '17 December Coffee Roasters Hail' },
    { id: 105, name: 'سلالات القهوة', type: 'محمصة ومقهى', category: 'coffee', rating: 4.6, icon: '🌱', mapQuery: 'Sulalat Coffee Hail' },
    { id: 106, name: 'بانديمك كافيه', type: 'قهوة مختصة', category: 'coffee', rating: 4.3, icon: '☕', mapQuery: 'Pandemic Coffee Hail' },
    { id: 107, name: 'ديمتريس', type: 'قهوة مختصة', category: 'coffee', rating: 4.4, icon: '☕', mapQuery: 'Dimitris Coffee Hail' },

    // --- Popular Cafes ---
    { id: 108, name: 'فرناز كافيه', type: 'كافيه راقي', category: 'coffee', rating: 4.5, icon: '🍰', mapQuery: 'Fernaz Cafe Hail' },
    { id: 109, name: 'ريلاكس كافيه', type: 'هدوء واسترخاء', category: 'coffee', rating: 4.4, icon: '😌', mapQuery: 'Relax Cafe Hail' },
    { id: 110, name: 'زد كافيه', type: 'مودرن', category: 'coffee', rating: 4.3, icon: '💤', mapQuery: 'Z Cafe Hail' },
    { id: 111, name: 'أوفردوز', type: 'قهوة وحلى', category: 'coffee', rating: 4.6, icon: '🥤', mapQuery: 'Overdose Cafe Hail' },
    { id: 112, name: 'بارنز', type: 'قهوة سريعة', category: 'coffee', rating: 4.2, icon: '☕', mapQuery: 'Barns Cafe Hail' },
    { id: 113, name: 'كافيه حنين', type: 'كلاسيكي', category: 'coffee', rating: 4.2, icon: '🎻', mapQuery: 'Cafe Hanin Hail' },
    { id: 114, name: 'كافيه جفرا', type: 'عائلي', category: 'coffee', rating: 4.1, icon: '☕', mapQuery: 'Cafe Jafra Hail' },
    { id: 115, name: 'مقهى ومتحف أجا وسلمى', type: 'تراثي ثقافي', category: 'coffee', rating: 4.7, icon: '🏛️', mapQuery: 'Aja Salma Cafe Museum Hail' },

    // --- International Coffee Chains ---
    { id: 116, name: 'ستاربكس', type: 'قهوة عالمية', category: 'coffee', rating: 4.4, icon: '☕', mapQuery: 'Starbucks Hail' },
    { id: 117, name: 'كوستا', type: 'قهوة عالمية', category: 'coffee', rating: 4.3, icon: '☕', mapQuery: 'Costa Coffee Hail' },
    { id: 118, name: 'دانكن دونتس', type: 'قهوة ودونات', category: 'coffee', rating: 4.3, icon: '🍩', mapQuery: 'Dunkin Donuts Hail' },
    { id: 119, name: 'د. كيف', type: 'قهوة ومخبوزات', category: 'coffee', rating: 4.1, icon: '🥐', mapQuery: 'Dr Cafe Hail' },
    { id: 120, name: 'سكند كب', type: 'قهوة كندية', category: 'coffee', rating: 4.2, icon: '☕', mapQuery: 'Second Cup Hail' },
    { id: 121, name: 'كوفي داي', type: 'قهوة هندية', category: 'coffee', rating: 4.0, icon: '☕', mapQuery: 'Coffee Day Hail' },

    // --- Premium Cafes ---
    { id: 122, name: 'بتيل', type: 'تمور وقهوة فاخرة', category: 'coffee', rating: 4.8, icon: '🌴', mapQuery: 'Bateel Hail' },
    { id: 123, name: 'إكلا', type: 'حلويات فرنسية', category: 'coffee', rating: 4.5, icon: '🥐', mapQuery: 'Eclat Hail' },
    { id: 124, name: 'جافا كافيه', type: 'قهوة راقية', category: 'coffee', rating: 4.4, icon: '☕', mapQuery: 'Java Cafe Hail' },
    { id: 125, name: 'توتي كافيه', type: 'عصائر وقهوة', category: 'coffee', rating: 4.2, icon: '🧃', mapQuery: 'Tutti Cafe Hail' },

    // --- Mixed (Entertainment & Dining) ---
    { id: 201, name: 'منتجع السمراء', type: 'ترفيه وعشاء', category: 'both', rating: 4.9, icon: '⛰️', mapQuery: 'Samra Park Hail' },
    { id: 202, name: 'ديفرنت كافيه', type: 'مطعم ومقهى', category: 'both', rating: 4.3, icon: '🍽️', mapQuery: 'Different Restaurant Cafe Hail' },
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
