import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";
import { Handshake, Building2 } from "lucide-react";

const sponsors = [
  { name: "Ministerul Apărării Naționale", logo: "MApN", gradient: "from-blue-500 to-indigo-500" },
  { name: "Statul Major General", logo: "SMG", gradient: "from-indigo-500 to-purple-500" },
  { name: "Armata Română", logo: "AR", gradient: "from-emerald-500 to-teal-500" },
  { name: "NATO", logo: "NATO", gradient: "from-blue-600 to-blue-400" },
  { name: "Uniunea Europeană", logo: "UE", gradient: "from-amber-500 to-yellow-500" },
  { name: "Guvernul României", logo: "GR", gradient: "from-red-500 to-amber-500" },
];

const partners = [
  "Ministerul Educației",
  "Universitatea Națională de Apărare",
  "Academia de Poliție",
  "SRI",
  "SIE",
  "Jandarmeria Română",
];

const SponsorsSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {}
        <div className="text-center mb-16">
          <div className="mb-6 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
            <LiquidGlassCard
              shadowIntensity="sm"
              borderRadius="9999px"
              glowIntensity="none"
              className="inline-flex items-center gap-2 !px-4 !py-2 !min-h-0"
            >
              <Handshake className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground/60">
                Parteneri Oficiali
              </span>
            </LiquidGlassCard>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <span className="text-foreground/90">În Parteneriat </span>
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Cu
            </span>
          </h2>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <LiquidGlassCard
                shadowIntensity="sm"
                borderRadius="20px"
                glowIntensity="sm"
                className="flex flex-col items-center justify-center !py-8 group"
              >
                {}
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                  "bg-gradient-to-br from-white/10 to-white/5",
                  "border border-white/20 group-hover:border-white/40",
                  "transition-all duration-300 group-hover:scale-110"
                )}>
                  <span className={cn(
                    "font-black text-sm bg-gradient-to-r bg-clip-text text-transparent",
                    sponsor.gradient
                  )}>
                    {sponsor.logo}
                  </span>
                </div>
                <p className="text-xs text-foreground/50 text-center px-2 font-medium leading-tight">
                  {sponsor.name}
                </p>
              </LiquidGlassCard>
            </div>
          ))}
        </div>

        {}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <LiquidGlassCard
            shadowIntensity="md"
            borderRadius="28px"
            glowIntensity="sm"
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-foreground/50" />
              <h3 className="text-xl font-bold text-foreground/80">Colaboratori Instituționali</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {partners.map((partner, index) => (
                <LiquidGlassCard
                  key={partner}
                  shadowIntensity="none"
                  borderRadius="9999px"
                  glowIntensity="none"
                  className="!px-4 !py-2 !min-h-0 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.9 + index * 0.08}s`, animationFillMode: "forwards" }}
                >
                  <span className="text-xs font-semibold text-foreground/60">{partner}</span>
                </LiquidGlassCard>
              ))}
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
