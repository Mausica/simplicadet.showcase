import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PremiumBackgroundProps {
  variant?: "default" | "cnmtv" | "aft" | "atm" | "cnmdc";
  className?: string;
}

export function PremiumBackground({ variant = "default", className }: PremiumBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isDarkRef = useRef(document.documentElement.classList.contains('dark'));
  const [isDark, setIsDark] = useState(isDarkRef.current);

  useEffect(() => {

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const newIsDark = document.documentElement.classList.contains('dark');
          if (isDarkRef.current !== newIsDark) {
            isDarkRef.current = newIsDark;

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setIsDark(newIsDark), 50);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => { observer.disconnect(); clearTimeout(timeoutId); };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.002;
      const orbs = container.querySelectorAll<HTMLDivElement>('.gradient-orb');
      
      orbs.forEach((orb, index) => {
        const offset = index * (Math.PI / 2.5);
        const x = Math.sin(time + offset) * 20;
        const y = Math.cos(time * 0.7 + offset) * 15;
        const scale = 1 + Math.sin(time * 0.5 + offset) * 0.1;
        orb.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const darkGradients = {
    default: [
      { color: "rgba(99, 102, 241, 0.4)", size: "90% 60%", position: "15% 20%" },
      { color: "rgba(139, 92, 246, 0.35)", size: "70% 50%", position: "80% 10%" },
      { color: "rgba(236, 72, 153, 0.3)", size: "60% 70%", position: "65% 80%" },
      { color: "rgba(34, 211, 238, 0.25)", size: "50% 60%", position: "5% 90%" },
      { color: "rgba(251, 146, 60, 0.2)", size: "40% 40%", position: "90% 60%" },
    ],
    cnmtv: [
      { color: "rgba(250, 204, 21, 0.4)", size: "80% 55%", position: "25% 25%" },
      { color: "rgba(251, 146, 60, 0.35)", size: "60% 45%", position: "75% 15%" },
      { color: "rgba(239, 68, 68, 0.25)", size: "55% 55%", position: "55% 75%" },
    ],
    aft: [
      { color: "rgba(239, 68, 68, 0.4)", size: "75% 55%", position: "20% 30%" },
      { color: "rgba(220, 38, 127, 0.35)", size: "60% 50%", position: "75% 20%" },
      { color: "rgba(251, 146, 60, 0.25)", size: "55% 60%", position: "50% 80%" },
    ],
    atm: [
      { color: "rgba(59, 130, 246, 0.45)", size: "80% 60%", position: "15% 25%" },
      { color: "rgba(99, 102, 241, 0.4)", size: "60% 50%", position: "80% 15%" },
      { color: "rgba(34, 211, 238, 0.3)", size: "55% 65%", position: "60% 75%" },
    ],
    cnmdc: [
      { color: "rgba(34, 197, 94, 0.4)", size: "75% 60%", position: "20% 25%" },
      { color: "rgba(16, 185, 129, 0.35)", size: "60% 50%", position: "75% 20%" },
      { color: "rgba(6, 182, 212, 0.25)", size: "55% 60%", position: "45% 80%" },
    ],
  };

  const lightGradients = {
    default: [
      { color: "rgba(129, 140, 248, 0.35)", size: "85% 55%", position: "20% 25%" },
      { color: "rgba(167, 139, 250, 0.3)", size: "65% 45%", position: "75% 15%" },
      { color: "rgba(244, 114, 182, 0.25)", size: "55% 65%", position: "60% 80%" },
      { color: "rgba(103, 232, 249, 0.2)", size: "45% 55%", position: "10% 85%" },
    ],
    cnmtv: [
      { color: "rgba(253, 224, 71, 0.35)", size: "75% 50%", position: "30% 30%" },
      { color: "rgba(251, 191, 36, 0.3)", size: "55% 40%", position: "70% 20%" },
      { color: "rgba(252, 165, 165, 0.2)", size: "50% 50%", position: "50% 75%" },
    ],
    aft: [
      { color: "rgba(252, 165, 165, 0.35)", size: "70% 50%", position: "25% 35%" },
      { color: "rgba(244, 114, 182, 0.3)", size: "55% 45%", position: "70% 25%" },
      { color: "rgba(254, 202, 202, 0.2)", size: "50% 55%", position: "55% 75%" },
    ],
    atm: [
      { color: "rgba(147, 197, 253, 0.4)", size: "75% 55%", position: "20% 30%" },
      { color: "rgba(165, 180, 252, 0.35)", size: "55% 45%", position: "75% 20%" },
      { color: "rgba(103, 232, 249, 0.25)", size: "50% 60%", position: "55% 75%" },
    ],
    cnmdc: [
      { color: "rgba(134, 239, 172, 0.35)", size: "70% 55%", position: "25% 30%" },
      { color: "rgba(110, 231, 183, 0.3)", size: "55% 45%", position: "70% 25%" },
      { color: "rgba(153, 246, 228, 0.2)", size: "50% 55%", position: "50% 75%" },
    ],
  };

  const gradients = isDark ? darkGradients : lightGradients;
  const orbs = gradients[variant];

  const maxOrbs = Math.max(
    (darkGradients[variant] || darkGradients.default).length,
    (lightGradients[variant] || lightGradients.default).length
  );

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden",
        className
      )}
      style={{
        backgroundColor: isDark ? '#0a0a0f' : '#fafafa',
        transition: 'background-color 0.7s ease',
      }}
    >
      {}
      {Array.from({ length: maxOrbs }).map((_, index) => {
        const orb = orbs[index];
        if (!orb) return null;
        return (
          <div
            key={`orb-${index}`}
            className="gradient-orb absolute will-change-transform"
            style={{
              transitionProperty: "background, opacity",
              transitionDuration: "1000ms",
              transitionTimingFunction: "ease-out",
              background: `radial-gradient(ellipse ${orb.size} at center, ${orb.color} 0%, transparent 70%)`,
              width: "100%",
              height: "100%",
              left: orb.position.split(" ")[0],
              top: orb.position.split(" ")[1],
              transform: "translate(-50%, -50%)",
              filter: "blur(40px)",
            }}
          />
        );
      })}
      
      {}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none mix-blend-overlay",
          isDark ? "opacity-[0.035]" : "opacity-[0.025]"
        )}
        style={{
          // backgroundImage removed due to corruption
        }}
      />

      {}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none",
          isDark ? "opacity-[0.02]" : "opacity-[0.015]"
        )}
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none transition-colors duration-700"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom, rgba(10,10,15,0.8), transparent)'
            : 'linear-gradient(to bottom, rgba(250,250,250,0.8), transparent)',
        }}
      />

      {}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)"
            : "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.08) 100%)",
        }}
      />
    </div>
  );
}

export default PremiumBackground;
