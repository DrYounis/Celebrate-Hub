import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ServiceGrid } from '@/components/ServiceGrid';
import { BudgetCalculator } from '@/components/BudgetCalculator';
import { LuckGame } from '@/components/LuckGame';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BudgetCalculator />
      <LuckGame />
      <ServiceGrid />
    </main>
  );
}
