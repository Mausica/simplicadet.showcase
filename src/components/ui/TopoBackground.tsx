import { cn } from "@/lib/utils";

interface TopoBackgroundProps {
  className?: string;
  opacity?: number;
}

export function TopoBackground({ className, opacity = 0.4 }: TopoBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none", className)}>
      <img
        src="/topo.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply dark:mix-blend-soft-light"
        style={{ opacity }}
        draggable={false}
      />
      {}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
    </div>
  );
}
