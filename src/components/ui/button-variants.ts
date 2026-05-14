import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[0.92rem] font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#242880] text-white hover:bg-[#242880]/90 shadow-lg shadow-[#242880]/25 border border-[#242880]/80 dark:bg-white/5 dark:hover:bg-white/10 dark:backdrop-blur-xl dark:border-white/10 dark:text-white dark:shadow-none",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-black/[0.08] dark:border-white/10 bg-white/60 dark:bg-white/5 text-foreground dark:text-white hover:bg-white/80 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white backdrop-blur-sm",
        secondary: "bg-black/[0.04] dark:bg-white/[0.06] text-foreground dark:text-white/90 hover:bg-black/[0.07] dark:hover:bg-white/10 border border-black/[0.06] dark:border-white/10",
        ghost: "text-foreground dark:text-white/90 hover:bg-black/[0.04] dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white/90",
        link: "text-[#242880] dark:text-white/80 underline-offset-4 hover:underline hover:text-[#242880]/80",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
