import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ServiceGrid } from '@/components/ServiceGrid';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ServiceGrid />
    </main>
  );
}
