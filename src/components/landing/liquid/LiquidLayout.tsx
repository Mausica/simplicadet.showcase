import { ReactNode } from "react";
import LiquidGlassFilters from "./LiquidGlassFilters";
import PremiumBackground from "./PremiumBackground";
import LiquidNavigation from "./LiquidNavigation";
import { LiquidFooter } from "./LiquidFooter";

interface LiquidLayoutProps {
  children: ReactNode;
  onLogin?: () => void;
}

const LiquidLayout = ({ children, onLogin }: LiquidLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <LiquidGlassFilters />
      <PremiumBackground />
      <LiquidNavigation onLogin={onLogin} />
      
      <main className="pt-24 relative z-10">
        {children}
      </main>

      <LiquidFooter />
    </div>
  );
};

export default LiquidLayout;
