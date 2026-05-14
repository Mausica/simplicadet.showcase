import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarCheck } from "lucide-react";

interface TimeUnit {
  value: number;
  label: string;
}

const CountdownSection = () => {
  const targetDate = new Date("2026-07-21T09:00:00+03:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, label: "Zile" },
    { value: timeLeft.hours, label: "Ore" },
    { value: timeLeft.minutes, label: "Minute" },
    { value: timeLeft.seconds, label: "Secunde" },
  ];

  if (!mounted) return null;

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8d7dca]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {}
          <div className="text-center lg:text-left flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242880]/5 border border-[#242880]/10 text-[#242880] dark:text-[#8d7dca] dark:bg-white/5 dark:border-white/10 mx-auto lg:mx-0">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                 </span>
                 <span className="text-xs font-bold uppercase tracking-widest">Admitere 2026</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                <span className="block text-foreground/90 mb-1">
                  Pregătirea ta
                </span>
                <span className="block bg-gradient-to-r from-[#242880] via-[#8d7dca] to-[#242880] bg-clip-text text-transparent">
                  Începe Acum
                </span>
              </h2>

              <p className="text-foreground/60 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                 Timpul nu așteaptă. Asigură-ți succesul în cariera militară prin pregătire constantă și disciplină.
              </p>

              <div className="flex justify-center lg:justify-start pt-2">
                 <div className="h-12 px-8 rounded-full border border-foreground/10 flex items-center justify-center gap-2 font-medium text-foreground/70 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm hover:bg-white/70 dark:hover:bg-white/10 transition-colors cursor-default min-w-[160px]">
                    <CalendarCheck className="w-4 h-4 opacity-70" />
                    21 Iulie 2026
                 </div>
              </div>
          </div>

          {}
          <div className="flex gap-3 sm:gap-4 justify-center">
             {timeUnits.map((unit, index) => (
                <div 
                  key={unit.label} 
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "w-20 h-24 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-2xl",
                    "bg-white dark:bg-white/[0.08] backdrop-blur-xl",
                    "border border-white/[0.15] hover:border-[#8d7dca]/40",
                    "shadow-lg shadow-black/5 hover:shadow-[#242880]/10",
                    "transition-all duration-300 group",
                    index === 3 && "hidden sm:flex"
                  )}
                >
                   <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tabular-nums group-hover:scale-110 transition-transform duration-500">
                      {unit.value}
                   </span>
                   <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground/40 mt-1 sm:mt-2 group-hover:text-[#8d7dca] transition-colors">
                      {unit.label}
                   </span>
                </div>
             ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CountdownSection;

