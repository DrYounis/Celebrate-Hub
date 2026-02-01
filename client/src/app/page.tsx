import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ServiceGrid } from '@/components/ServiceGrid';
import { BudgetCalculator } from '@/components/BudgetCalculator';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BudgetCalculator />
      <ServiceGrid />
    </main>
  );
}
