import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />

      {/* Placeholder for future sections */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fdfdfd' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>خدماتنا المميزة</h2>
        <p style={{ color: '#666' }}>تصفح أفضل القاعات والخدمات في حائل قريباً...</p>
      </section>
    </main>
  );
}
