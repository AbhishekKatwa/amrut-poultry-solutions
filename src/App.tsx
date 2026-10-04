import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Hero } from '@/components/sections/Hero';
import { CompanyStory } from '@/components/sections/CompanyStory';
import { CoreProblem } from '@/components/sections/CoreProblem';
import { Flagship } from '@/components/sections/Flagship';
import { EggSales } from '@/components/sections/pillars/EggSales';
import { TraderFlow } from '@/components/sections/pillars/TraderFlow';
import { Godown } from '@/components/sections/pillars/Godown';
import { FarmFinance } from '@/components/sections/pillars/FarmFinance';
import { RealPnl } from '@/components/sections/pillars/RealPnl';
import { Ecosystem } from '@/components/sections/Ecosystem';
import { Showcase } from '@/components/sections/Showcase';
import { Decisions } from '@/components/sections/Decisions';
import { FiveNumbers } from '@/components/sections/FiveNumbers';
import { Vision } from '@/components/sections/Vision';
import { Pricing } from '@/components/sections/Pricing';
import { FinalCta } from '@/components/sections/FinalCta';

/**
 * The order is the argument: what the business is → why the numbers are hard →
 * the product → the five systems that matter → one connected view → the ask.
 */
export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <CompanyStory />
        <CoreProblem />
        <Flagship />
        <div id="solutions" className="scroll-mt-24">
          <EggSales />
          <TraderFlow />
          <Godown />
          <FarmFinance />
          <RealPnl />
        </div>
        <Ecosystem />
        <Showcase />
        <Decisions />
        <FiveNumbers />
        <Vision />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
