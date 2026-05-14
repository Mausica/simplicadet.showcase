import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, ReactNode } from "react";

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  shadowIntensity?: "none" | "xs" | "sm" | "md" | "lg";
  borderRadius?: string;
  glowIntensity?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "hero" | "feature";
  children?: ReactNode;
  glowColor?: string;
  fadedGradient?: string;
}

const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ 
    className, 
    shadowIntensity = "md",
    borderRadius = "24px",
    glowIntensity = "sm",
    variant = "default",
    glowColor,
    children,
    fadedGradient,
    ...props 
  }, ref) => {





    const shadowStyles = {
      none: "",
      xs: "shadow-sm",
      sm: "shadow-md",
      md: "shadow-lg shadow-black/5 dark:shadow-none",
      lg: "shadow-xl shadow-black/10 dark:shadow-none",
    };

    const glowStyles = {
      none: "",
      sm: "dark:hover:shadow-[0_0_30px_var(--glow-color)]",
      md: "dark:hover:shadow-[0_0_50px_var(--glow-color)]",
      lg: "dark:hover:shadow-[0_0_80px_var(--glow-color)]",
    };

    const variantStyles = {
      default: "p-6",
      hero: "p-8 min-h-[280px]",
      feature: "p-5",
    };

    return (
      <div
        ref={ref}
        className={cn(



          "relative overflow-hidden",

          "bg-white backdrop-blur-xl border border-white/[0.15]",
          "hover:border-[#8d7dca]/40",

          "dark:bg-white/[0.08] dark:border-white/[0.15] dark:hover:border-white/[0.15]",

          "transition-all duration-500 ease-out",
          "hover:-translate-y-1",

          shadowStyles[shadowIntensity],
          glowStyles[glowIntensity],
          variantStyles[variant],
          className
        )}
        style={{ 
            borderRadius, 
            "--glow-color": glowColor 
        } as React.CSSProperties}
        {...props}
      >
        {}
        <div 
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none opacity-0 dark:opacity-100"
        />
        
        {}
        <div 
          className="absolute inset-0 opacity-0 dark:opacity-[0.02] pointer-events-none mix-blend-overlay"
          style={{
            borderRadius,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

export { LiquidGlassCard };
