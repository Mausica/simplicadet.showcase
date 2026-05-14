import { Check } from 'lucide-react';
import { LiquidLayout, GlassCard, GlassButton } from '@/components/landing/liquid';

export default function Pricing() {
  return (
    <LiquidLayout>
      <div className="min-h-screen relative px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242880]/5 border border-[#242880]/10 text-[#242880] dark:text-[#8d7dca] dark:bg-white/5 dark:border-white/10 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest">Alege Planul</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
              <span className="block text-foreground/90 mb-1">
                Planuri și
              </span>
              <span className="block bg-gradient-to-r from-[#242880] via-[#8d7dca] to-[#242880] bg-clip-text text-transparent">
                Prețuri
              </span>
            </h1>
            <p className="text-foreground/60 mt-4 max-w-2xl mx-auto text-lg">
              Simplicadet este gratuit pentru toți utilizatorii
            </p>
          </div>

          {}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {}
            <GlassCard
              variant="lg"
              className="text-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              <div className="text-sm font-medium text-foreground/60 mb-2">Gratuit</div>
              <div className="text-5xl font-bold mb-1">0 RON</div>
              <p className="text-foreground/50 mb-8 text-sm">pentru totdeauna</p>

              <div className="space-y-4 text-left mb-8">
                {['Acces la toate instituțiile', 'Informații de bază', 'Documente oficiale'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-foreground/5 dark:bg-white/10 flex items-center justify-center border border-border/50 dark:border-white/10">
                      <Check className="w-3 h-3 text-foreground/70" />
                    </div>
                    <span className="text-sm text-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>

              <GlassButton variant="ghost" className="w-full">
                Plan curent
              </GlassButton>
            </GlassCard>

            {}
            <GlassCard
              variant="lg"
              className="text-center relative opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <div className="absolute top-4 right-4">
                <span className="liquid-glass-badge text-xs">În curând</span>
              </div>
              
              <div className="text-sm font-medium text-foreground/60 mb-2">Premium</div>
              <div className="text-5xl font-bold mb-1">29 RON</div>
              <p className="text-foreground/50 mb-8 text-sm">pe lună</p>

              <div className="space-y-4 text-left mb-8">
                {[
                  'Tot ce include Gratuit',
                  'Ghiduri detaliate admitere',
                  'Teste practice și simulări',
                  'Suport prioritar',
                  'Acces comunitate exclusivă',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-foreground/5 dark:bg-white/10 flex items-center justify-center border border-border/50 dark:border-white/10">
                      <Check className="w-3 h-3 text-foreground/70" />
                    </div>
                    <span className="text-sm text-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>

              <GlassButton variant="ghost" className="w-full opacity-50 cursor-not-allowed">
                Disponibil în curând
              </GlassButton>
            </GlassCard>
          </div>
        </div>
      </div>
    </LiquidLayout>
  );
}
