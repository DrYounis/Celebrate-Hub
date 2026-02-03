
# 🎊 Celebrate Hub - منصة تنظيم الفعاليات

**Celebrate Hub** هي منصة تقنية متكاملة تهدف إلى إحداث ثورة في قطاع تنظيم الفعاليات والمناسبات في المملكة العربية السعودية. يعمل المشروع كحلقة وصل ذكية بين مزودي الخدمة والمستفيدين، مع التركيز على تنظيم الميزانية وتوفير الجهد والوقت، مدعوماً بنظام تلعيب (Gamification) لزيادة التفاعل.

![Celebrate Hub App Screenshot](https://via.placeholder.com/800x400?text=Celebrate+Hub+Preview)

---

## 🌟 الميزات الرئيسية (Key Features)

### 1. نظام الأدوار (Role-Based System)
*   **مزود الخدمة (Contractor/Vendor):**
    *   لوحة تحكم خاصة لإدارة الطلبات الواردة (قبول/رفض).
    *   إعدادات الملف التجاري (تغيير الشعار، الأسعار، نطاق التغطية).
    *   نظام محادثة فورية مع العملاء.
*   **العميل (Client):**
    *   تصفح ومقارنة الخدمات بناءً على الأسعار والتقييمات.
    *   إرسال طلبات عروض أسعار (RFQ) مخصصة.
    *   لوحة تحكم لمتابعة حالة الطلبات وتاريخها.

### 2. التلعيب والمكافآت (Gamification) 🎮
نظام تفاعلي لتحفيز المستخدمين:
*   **نقاط XP:** يحصل المستخدم على نقاط مقابل كل إجراء (مقارنة خدمات، إرسال طلب، تقييم).
*   **المستويات:** ترقية مستوى المستخدم (فضي، ذهبي، ماسي) بناءً على النقاط.
*   **متجر المكافآت:** استبدال النقاط بخصومات حقيقية أو استشارات مجانية.

### 3. التواصل والتقييم
*   **محادثة فورية (Real-time Chat):** نظام دردشة مباشر بين العميل والمقاول لمناقشة التفاصيل قبل التنفيذ.
*   **التقييمات:** نظام تقييم 5 نجوم مع تعليقات لضمان الجودة والشفافية.

---

## 🛠 التقنيات المستخدمة (Tech Stack)

تم بناء المشروع باستخدام أحدث التقنيات لضمان الأداء والسرعة:

*   **الواجهة الأمامية (Frontend):** Next.js 14 (App Router), Tailwind CSS, Lucide Icons.
*   **الواجهة الخلفية (Backend):** Supabase (BaaS).
*   **قاعدة البيانات:** PostgreSQL.
*   **إدارة الحالة:** React Hooks (Context API).
*   **الميزات السحابية:**
    *   **Auth:** نظام تسجيل دخول آمن.
    *   **Storage:** تخزين شعارات الشركات.
    *   **Realtime:** تحديثات فورية للطلبات والرسائل.

---

## 📁 هيكل المشروع (Project Structure)

```
Event_Managment/
├── client/                      # Next.js Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── dashboard/       # User dashboards
│   │   │   │   ├── page.tsx     # Main dashboard
│   │   │   │   └── services/    # Service management
│   │   │   ├── services/        # Service marketplace
│   │   │   │   ├── page.tsx     # Services listing
│   │   │   │   └── [id]/        # Service details
│   │   │   ├── globals.css      # Global styles
│   │   │   └── layout.tsx       # Root layout
│   │   ├── components/          # Reusable React components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── AuthModal.tsx    # Authentication modal
│   │   │   ├── AuthPortal.tsx   # Login/signup form
│   │   │   └── SmartConcierge.tsx # Event planning wizard
│   │   └── lib/
│   │       └── supabaseClient.ts # Supabase configuration
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── vercel.json              # Vercel deployment config
│
├── supabase/                    # Database & Backend
│   ├── migrations/              # Database migrations
│   │   ├── 20260203_payment_system.sql
│   │   └── ...
│   ├── master_schema.sql        # Complete database schema
│   ├── seed_data.sql            # Sample data
│   └── tests/                   # Database tests
│
└── README.md                    # Project documentation
```

---

## 🗄️ قاعدة البيانات (Database Schema)

### الجداول الأساسية (Core Tables)

#### 1. **profiles** - ملفات المستخدمين
```sql
- id (uuid, PK) → auth.users
- full_name, avatar_url
- role: 'free' | 'pro'
- business_name, category (للمزودين)
- is_verified, total_points
```

#### 2. **services** - كتالوج الخدمات
```sql
- id (uuid, PK)
- provider_id → profiles
- title, description, category
- base_price, currency (SAR)
- images (jsonb), features (jsonb)
- location, capacity
- average_rating, total_reviews
```

#### 3. **service_packages** - باقات التسعير
```sql
- id (uuid, PK)
- service_id → services
- name, price, features (jsonb)
- max_guests, duration_hours
```

#### 4. **bookings** - الحجوزات
```sql
- id (uuid, PK)
- service_id → services
- package_id → service_packages
- customer_id, provider_id → profiles
- event_date, event_time, guest_count
- total_amount
- payment_status: 'pending' | 'paid' | 'refunded'
- booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
- payment_required, requires_deposit, deposit_percentage
```

#### 5. **transactions** - المعاملات المالية
```sql
- id (uuid, PK)
- booking_id → bookings (unique)
- stripe_payment_intent_id, stripe_charge_id
- amount_total, platform_fee_amount (12%), vendor_payout_amount
- status: 'pending' | 'held' | 'released' | 'refunded' | 'disputed'
- held_until, released_at (escrow system)
- payment_method_type, client_ip
```

#### 6. **stripe_accounts** - حسابات Stripe للمزودين
```sql
- id (uuid, PK)
- user_id → profiles (unique)
- stripe_account_id (unique)
- onboarding_completed, payouts_enabled
- country (SA), currency (SAR)
```

#### 7. **service_reviews** - تقييمات الخدمات
```sql
- id (uuid, PK)
- service_id → services
- booking_id → bookings (unique)
- customer_id → profiles
- rating (1-5), comment
```

#### 8. **gamification_logs** - سجل النقاط
```sql
- id (uuid, PK)
- user_id → profiles
- action_type, points_earned
- metadata (jsonb)
```

#### 9. **availability** - جداول التوفر
```sql
- id (uuid, PK)
- service_id → services
- date, is_available
- time_slots (jsonb)
```

#### 10. **promotional_codes** - أكواد الخصم
```sql
- id (uuid, PK)
- code (unique), discount_type, discount_value
- valid_from, valid_until
- max_uses, current_uses
```

### الدوال والمحفزات (Functions & Triggers)

- `calculate_platform_fee(amount)` → Returns 12% commission
- `auto_release_escrow()` → Releases held payments after 7 days
- `award_points(user_id, points, action)` → Awards gamification points
- `update_service_rating()` → Updates average rating on new review
- `award_booking_points()` → Awards 100 XP on booking completion
- `handle_new_user()` → Auto-creates profile on signup

### العروض التحليلية (Analytics Views)

- `vendor_earnings` → Pending/available balance per vendor
- `platform_revenue` → Monthly GMV, commission, net revenue

---

## 🚀 طريقة التشغيل (Setup Guide)

### المتطلبات
*   Node.js 18+
*   حساب Supabase

### التثبيت

1.  **استنسخ المستودع:**
    ```bash
    git clone https://github.com/DrYounis/Celebrate-Hub.git
    cd Celebrate-Hub/client
    ```

2.  **تثبيت الحزم:**
    ```bash
    npm install
    ```

3.  **إعداد المتغيرات البيئية:**
    أنشئ ملف `.env.local` وأضف مفاتيح Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **تشغيل الخادم المحلي:**
    ```bash
    npm run dev
    ```

---

## 👥 فريق العمل
*   **أيمن محمد:** المدير التنفيذي.
*   **القاسم الحميدي:** المدير المالي.
*   **راكان الحميدي:** التسويق وتطوير الأعمال.
*   **ناصر الحربي:** تقنية المعلومات (IT).
*   **حسناء عبد الكريم:** علاقات عامة.
*   **الحسين الشمري:** الشؤون القانونية.

---

## 📧 التواصل
*   **البريد الإلكتروني:** celebratehub.ksa@gmail.com
