import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  onToggle?: (next: boolean) => void;
}

export function ToggleButton({ active, onToggle, className, ...props }: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onToggle && onToggle(!active)}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active ? 'bg-primary/80 text-primary-foreground' : 'bg-card/60 text-foreground',
        className
      )}
      {...props}
    >
      <span className={cn(
        'relative inline-block h-5 w-9 rounded-full',
        active ? 'bg-primary/70' : 'bg-muted/40'
      )}>
        <span className={cn(
          'absolute top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full border border-border transition-transform',
          active ? 'translate-x-4 bg-primary-foreground' : 'translate-x-0 bg-background'
        )} />
      </span>
    </button>
  )
}

export default ToggleButton
