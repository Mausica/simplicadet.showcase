import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Soldier, AttendanceStatus, AbsenceReason } from '@/types/military';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SoldierCardProps {
  soldier: Soldier;
  status: AttendanceStatus;
  absenceReason?: AbsenceReason;
  canEdit: boolean;
  onStatusChange?: (status: AttendanceStatus, reason?: AbsenceReason) => void;
  displayIndex?: string | number;
}
const statusStyles = {
  present: 'bg-emerald-500/90 border-emerald-400/30 text-white shadow-lg shadow-emerald-500/20',
  absent: 'bg-red-500/90 border-red-400/30 text-white shadow-lg shadow-red-500/20',
  excused: 'bg-amber-400/90 border-amber-300/30 text-black shadow-lg shadow-amber-400/20',
  unknown: 'bg-black/[0.04] dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.15] text-foreground/60 backdrop-blur-sm'
};
const getStatusLabel = (status: AttendanceStatus, reason?: AbsenceReason) => {
  if (status === 'present') return 'Prezent';
  if (status === 'excused') return `Motivat (${reason})`;
  if (status === 'absent') return 'Absent (nemotivat)';
  return 'Necunoscut';
};

export function SoldierCard({ 
  soldier,
  status,
  absenceReason,
  canEdit,
  onStatusChange,
  displayIndex
}: SoldierCardProps) {
  const [isOtherDialogOpen, setIsOtherDialogOpen] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [pendingReason, setPendingReason] = useState<string | undefined>(undefined);
  const longPressTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);
  const singleTapTimer = useRef<number | null>(null);
  const awaitingSecondTap = useRef(false);
  const LONG_PRESS_MS = 700;
  const handleClick = () => {
    if (!canEdit) return;
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    if (awaitingSecondTap.current) {
      awaitingSecondTap.current = false;
      if (singleTapTimer.current) {
        window.clearTimeout(singleTapTimer.current);
        singleTapTimer.current = null;
      }
      onStatusChange?.('unknown');
      return;
    }
    awaitingSecondTap.current = true;
    singleTapTimer.current = window.setTimeout(() => {
      awaitingSecondTap.current = false;
      if (status === 'present') onStatusChange?.('absent'); else onStatusChange?.('present');
    }, 250);
  };
  const startLongPress = () => {
    if (!canEdit) return;
    if (singleTapTimer.current) { window.clearTimeout(singleTapTimer.current); singleTapTimer.current = null; awaitingSecondTap.current = false; }
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      setPendingReason(status === 'excused' && absenceReason ? String(absenceReason) : '');
      setCustomReason(status === 'excused' && absenceReason ? String(absenceReason) : '');
      setIsOtherDialogOpen(true);
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleCustomReasonSubmit = () => {
    const trimmed = customReason.trim();
    if (!trimmed) { setIsOtherDialogOpen(false); return; }
    onStatusChange?.('excused', trimmed as AbsenceReason);
    setIsOtherDialogOpen(false);
    setCustomReason('');
    setPendingReason(undefined);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
  <div
            className={cn(
              'relative cursor-pointer transition-all duration-300 rounded-2xl md:rounded-3xl border aspect-square w-full flex flex-col items-center justify-center text-sm font-semibold select-none',
        'hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl',
              statusStyles[status]
            )}
            onClick={handleClick}
    onMouseDown={startLongPress}
    onMouseUp={cancelLongPress}
    onMouseLeave={cancelLongPress}
    onTouchStart={startLongPress}
    onTouchEnd={cancelLongPress}
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' as unknown as string }}
          >
            {displayIndex !== undefined && (
              <div className="absolute top-1 left-2 text-[10px] font-bold opacity-80 select-none">{displayIndex}</div>
            )}
            <div className="text-xl sm:text-2xl font-bold mb-1 select-none">{soldier.initials}</div>
            
            {}
            <div className="text-sm sm:text-base opacity-80 select-none">
              {soldier.rank}
            </div>
            
            {}
            {status !== 'present' && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current opacity-60 select-none" />
            )}
          </div>
        </TooltipTrigger>
        
        {}
        <TooltipContent side="top" className="bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl shadow-xl select-none">
          <div className="text-sm space-y-1 select-none">
            <div className="font-semibold text-foreground select-none">{soldier.name}</div>
            <div className="text-foreground/50 select-none">{soldier.rank}</div>
            <div className="text-foreground/80 font-medium select-none">
              Status: {getStatusLabel(status, absenceReason)}
            </div>
            <div className="text-xs text-foreground/50 select-none">
              Poziție: Rând {soldier.position.row + 1}, Col {soldier.position.col + 1}
            </div>
            {canEdit && (
              <div className="text-xs text-foreground/80 mt-2 select-none">Apasă pentru a edita</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
      {}
      <Dialog open={isOtherDialogOpen} onOpenChange={(open) => {
        setIsOtherDialogOpen(open);
        if (!open) {
          setCustomReason('');
          setPendingReason(undefined);
        }
      }}>
        <DialogContent className="bg-white/90 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 text-foreground rounded-3xl shadow-2xl shadow-black/10 dark:shadow-none">
          <DialogHeader>
            <DialogTitle>Alt motiv</DialogTitle>
            <DialogDescription className="text-foreground/50">
              Introdu motivul pentru absență
            </DialogDescription>
          </DialogHeader>
          <Input
            className="bg-white/60 dark:bg-white/[0.05] border border-white/20 dark:border-white/10 text-foreground placeholder:text-foreground/40 rounded-xl backdrop-blur-sm focus:border-[#242880]/40 dark:focus:border-white/20 focus:ring-[#242880]/20 dark:focus:ring-white/10"
            placeholder="Scrieți motivul..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomReasonSubmit()}
            autoFocus
          />
          <DialogFooter className="sm:justify-start gap-2">
            <Button type="button" variant="outline" onClick={() => { setIsOtherDialogOpen(false); }} className="bg-white/60 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-foreground border border-white/20 dark:border-white/10 backdrop-blur-xl rounded-xl">
              Anulează
            </Button>
            <Button type="submit" onClick={handleCustomReasonSubmit} className="bg-[#242880] hover:bg-[#242880]/90 text-white shadow-lg shadow-[#242880]/25 dark:bg-white/5 dark:hover:bg-white/10 dark:backdrop-blur-xl dark:border dark:border-white/10 dark:text-white dark:shadow-none rounded-xl">
              Salvează motivul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}