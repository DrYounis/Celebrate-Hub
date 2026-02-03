
export interface HailVenue {
    id: string;
    title: string;
    category: string;
    base_price: string;
    average_rating: number;
    location: string;
    images: string[];
    description: string;
    features: string[];
    phone?: string;
    is_external: boolean;
}

export const HAIL_VENUES: HailVenue[] = [
    {
        id: "hail_millennium",
        title: "فندق ميلينيوم حائل (Millennium Hail Hotel)",
        category: "venue",
        base_price: "يبدأ من 5000 ريال",
        average_rating: 4.8,
        location: "طريق الملك فهد، حائل",
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"],
        description: "فندق 5 نجوم فاخر يضم قاعات زفاف راقية ومرافق متكاملة للمؤتمرات والمناسبات.",
        features: ["قاعة كبرى", "بوفيه مفتوح", "مواقف سيارات", "إقامة للضيوف"],
        phone: "0165320000",
        is_external: true
    },
    {
        id: "hail_grand_hall",
        title: "قاعة التاج للإحتفالات",
        category: "venue",
        base_price: "15000 ريال",
        average_rating: 4.5,
        location: "حي المطار، حائل",
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"],
        description: "واحدة من أكبر قاعات حائل، تتسع لأكثر من 500 ضيف مع خدمات ضيافة مميزة.",
        features: ["سعة 500+", "غرفة عروس", "نظام صوتي وتصوير", "قهوة عربية"],
        is_external: true
    },
    {
        id: "hail_palace_roses",
        title: "قصر الورود",
        category: "venue",
        base_price: "20000 ريال",
        average_rating: 4.7,
        location: "طريق الدائري، حائل",
        images: ["https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"],
        description: "قصر فخم للمناسبات الكبيرة، يتميز بالتصميم الكلاسيكي والخدمة الملكية.",
        features: ["قسمين (رجال/نساء)", "عشاء فاخر", "إضاءة ليزر"],
        is_external: true
    },
    {
        id: "hail_lens_studio",
        title: "ستوديو عدسة الشمال",
        category: "photography",
        base_price: "2500 ريال",
        average_rating: 4.9,
        location: "حي صديان، حائل",
        images: ["https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80"],
        description: "تصوير احترافي للأعراس والمناسبات بأحدث الكاميرات وطاقم نسائي متخصص.",
        features: ["تصوير فيديو 4K", "طباعة فورية", "ألبوم ديجيتال"],
        is_external: true
    },
    {
        id: "hail_florist_jouri",
        title: "زهور وجوري لتنسيق الحفلات",
        category: "decoration",
        base_price: "1500 ريال",
        average_rating: 4.6,
        location: "شارع الثلاثين، حائل",
        images: ["https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&q=80"],
        description: "تنسيق كوش افراح، طاولات استقبال، ومداخل بأجمل الزهور الطبيعية والصناعية.",
        features: ["كوش حديثة", "بوكيه عروس", "تزيين سيارات"],
        is_external: true
    },
    {
        id: "hail_catering_golden",
        title: "بوفيه المذاق الذهبي",
        category: "catering",
        base_price: "120 ريال للشخص",
        average_rating: 4.4,
        location: "حائل",
        images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80"],
        description: "تقديم أرقى المأكولات الشرقية والغربية بلمسة سعودية أصيلة.",
        features: ["بوفيه مفتوح", "ذبائح", "مقبلات وسلطات"],
        is_external: true
    },
    {
        id: "hail_resort_yamama",
        title: "منتجع اليمامة",
        category: "venue",
        base_price: "1200 ريال",
        average_rating: 4.3,
        location: "عقدة، حائل",
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"],
        description: "منتجع ريفي جميل في منطقة عقدة، مثالي للمناسبات الصغيرة والعائلية.",
        features: ["مسبح", "جلسات خارجية", "مشبات"],
        is_external: true
    },
    {
        id: "hail_beauty_center",
        title: "مركز لمسات حائل (Lamasat)",
        category: "other",
        base_price: "300 ريال",
        average_rating: 4.7,
        location: "حي الجامعيين، حائل",
        images: ["https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80"],
        description: "مركز تجميل متكامل للعروس ومرافقاتها.",
        features: ["مكياج", "تسريحات", "حمام مغربي"],
        is_external: true
    }
];
