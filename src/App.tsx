import { Hero } from "./components/Hero";
import { SocialProof } from "./components/SocialProof";
import { LandingPages } from "./components/LandingPages";
import { OrderTools } from "./components/OrderTools";
import { ServerTracking } from "./components/ServerTracking";
import { BrandApp } from "./components/BrandApp";
import { Inventory } from "./components/Inventory";
import { OtherFeatures } from "./components/OtherFeatures";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-white transition-colors duration-300 dark:bg-ink-950"
    >
      <Navbar />
      <main id="main">
        <Hero />
        <SocialProof />
        <LandingPages />
        <OrderTools />
        <ServerTracking />
        <BrandApp />
        <Inventory />
        <OtherFeatures />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
