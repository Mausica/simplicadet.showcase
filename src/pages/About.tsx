import { Users, Target, Zap, Award, FileStack, Lightbulb, GraduationCap } from 'lucide-react';
import { LiquidLayout, GlassCard } from '@/components/landing/liquid';
import { cn } from '@/lib/utils';

export default function About() {
  const storySteps = [
    {
      icon: GraduationCap,
      year: "Clasa a XI-a",
      title: "Ambiția",
      desc: "La Colegiul Național Militar 'Tudor Vladimirescu', atmosfera era vibrantă. Noi, elevii de anul III, ne pregăteam să preluăm ștafeta. Îmi doream să fiu un exemplu, să devin 'elev gradat' și să am grijă de colegii mai mici.",
      align: "left"
    },
    {
      icon: Award,
      year: "Sergent Major",
      title: "Responsabilitatea",
      desc: "Visul s-a împlinit. Am devenit Comandant de Pluton. Răspundeam acum de o clasă întreagă. Era o onoare imensă, dar realitatea poziției a venit cu o greutate neașteptată.",
      align: "right"
    },
    {
      icon: FileStack,
      year: "Provocarea",
      title: "Muntele de Hârtii",
      desc: "Am fost copleșit de birocrație. Prezența la apel, rapoarte zilnice, tabele pentru fiecare activitate. Timpul pe care voiam să-l dedic oamenilor era înghițit de completarea hârtiilor.",
      align: "left"
    },
    {
      icon: Lightbulb,
      year: "Soluția",
      title: "Simplicadet",
      desc: "Așa s-a născut ideea. De ce să nu simplificăm totul? O aplicație care să elimine birocrația și să ne lase să ne concentrăm pe ce contează: camaraderia și instrucția. Simplu. Pentru Cadet.",
      align: "right"
    }
  ];

  return (
    <LiquidLayout>
      <div className="min-h-screen relative px-4 py-20 overflow-hidden">
        {}
        <div className="fixed top-1/4 -left-64 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="fixed bottom-1/4 -right-64 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {}
          <div className="text-center mb-24 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242880]/5 border border-[#242880]/10 text-[#242880] dark:text-[#8d7dca] dark:bg-white/5 dark:border-white/10 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest">Despre Noi</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              <span className="block text-foreground/90 mb-2">
                Povestea din spatele
              </span>
              <span className="block bg-gradient-to-r from-[#242880] via-[#8d7dca] to-[#242880] bg-clip-text text-transparent">
                Simplicadet
              </span>
            </h1>
            <p className="text-foreground/60 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Cum o provocare din viața reală de cadet s-a transformat în soluția digitală de astăzi.
            </p>
          </div>

          {}
          <div className="relative">
            {}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#242880]/20 dark:via-white/20 to-transparent transform md:-translate-x-1/2" />

            <div className="space-y-12 md:space-y-24">
              {storySteps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                
                return (
                  <div 
                    key={step.title}
                    className={cn(
                      "relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center",
                      !isEven && "md:flex-row-reverse"
                    )}
                  >
                    {}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#242880] dark:bg-[#8d7dca] border-[3px] border-white dark:border-[#0a0a0a] shadow-[0_0_0_4px_rgba(36,40,128,0.1)] dark:shadow-[0_0_0_4px_rgba(141,125,202,0.1)] transform -translate-x-[7px] md:-translate-x-1/2 z-20 mt-6 md:mt-0" />

                    {}
                    <div className={cn(
                      "pl-12 md:pl-0 md:w-1/2 md:px-12",
                      "opacity-0 animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: "forwards" }}
                    >
                      <GlassCard 
                        className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                        variant="default"
                      >
                         {}
                         <div className={cn(
                           "absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#242880]/40 dark:via-[#8d7dca]/40 to-transparent opacity-50",
                           isEven ? "left-0" : "right-0"
                         )} />

                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#242880]/5 dark:bg-white/10 flex items-center justify-center border border-[#242880]/10 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <Icon className="w-6 h-6 text-[#242880] dark:text-[#8d7dca]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#242880]/60 dark:text-[#8d7dca]/80 block mb-0.5">{step.year}</span>
                            <h3 className="font-bold text-xl text-foreground">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
                          {step.desc}
                        </p>
                      </GlassCard>
                    </div>

                    {}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </LiquidLayout>
  );
}
