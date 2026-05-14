import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Download, Clock, ChevronLeft, Trash2 } from 'lucide-react';
import { browserDb } from '@/lib/browser-database';
import { getMe } from '@/lib/auth';
import { TimeSlot, UserRole } from '@/types/military';

interface AttendanceControlsProps {
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  userRole: UserRole;
  onDateChange: (date: Date) => void;
  onTimeSlotChange: (timeSlot: TimeSlot) => void;
  onBackToCompany?: () => void;
  onExport: () => void;
  isCompanyView?: boolean;
  availableYears?: number[];
  selectedYearKey?: string;
  onYearChange?: (value: string) => void;
}

export function AttendanceControls({
  selectedDate,
  selectedTimeSlot,
  userRole,
  onDateChange,
  onTimeSlotChange,
  onBackToCompany,
  onExport,
  isCompanyView = true,
  availableYears = [],
  selectedYearKey = 'all',
  onYearChange
}: AttendanceControlsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [meGrad, setMeGrad] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const me = await getMe();
        if(me){
          const roles = me.roles||[];
          setIsAdmin(roles.some(r => ['admin','cmd','edit_all_students'].includes(String(r.role))));
          let grad: string | null = null;
          try {
            const students = await browserDb.getStudents();
            if(me.user?.name){
              const norm = (s:string)=> s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
              const target = norm(me.user.name);
              const match = students.find(st => {
                const full = norm(`${st.nume} ${st.prenume}`);
                return full.startsWith(target) || target.startsWith(full);
              });
              grad = match?.grad || null;
            }
          } catch {}
          setMeGrad(grad);
        }
      } catch {}
    })();
  },[]);

  const timeSlotLabel = (t: TimeSlot) =>
    t === '06:00' ? 'Înviorare' : t === '08:00' ? 'Raportul și inspecția de dimineață' : t === '14:00' ? 'Raportul companiei' : t === '21:00' ? 'Apelul de seară' : '';

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
  case 'soldier': return 'Soldat';
  case 'staff_sergeant': return 'Sergent major';
  case 'captain': return 'Căpitan';
      default: return role;
    }
  };

  return (
  <div className="bg-white dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl p-5 space-y-4 shadow-lg shadow-black/5 dark:shadow-none transition-all duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-foreground border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm rounded-full">
            {isAdmin ? 'Admin' : (meGrad || getRoleDisplayName(userRole))}
          </Badge>
          <div className="text-sm text-foreground/60">
            {format(selectedDate, 'dd MMMM, yyyy')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="rounded-full border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm text-foreground hover:bg-white/20 hover:border-[#8d7dca]/40 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportă
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-foreground/50">
            Data misiunii
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-11 rounded-full px-4 justify-start text-left font-normal text-foreground border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm hover:bg-white/20 hover:border-[#8d7dca]/40 transition-all duration-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-xl rounded-2xl" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
                className="text-foreground"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-foreground/80",
                  caption_label: "text-sm font-medium text-foreground/80",
                  nav: "flex items-center space-x-1",
                  nav_button: "h-7 w-7 bg-transparent p-0 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.75rem] uppercase tracking-wide",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative",
                  day: "text-foreground/80 h-9 w-9 p-0 font-semibold hover:bg-secondary hover:text-foreground rounded-md",
                  day_today: "bg-secondary text-foreground ring-1 ring-border",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_outside: "text-muted-foreground/60",
                  day_disabled: "text-muted-foreground/40",
                  day_hidden: "invisible"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {}
        <div className="space-y-2">
          <Label htmlFor="time-slot" className="text-sm font-medium text-muted-foreground">
            Interval orar
          </Label>
          <Select value={selectedTimeSlot} onValueChange={(value: TimeSlot) => onTimeSlotChange(value)}>
            <SelectTrigger className="h-11 rounded-full pl-3 pr-10 text-foreground/90 border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm hover:bg-white/20 hover:border-[#8d7dca]/40 transition-all duration-300">
              <Clock className="mr-3 h-4 w-4" />
              <span className="inline-flex items-center gap-3">
                <span className="font-semibold text-foreground tracking-wide">{selectedTimeSlot}</span>
                <span className="text-sm text-foreground/50 ml-1 pl-2 border-l border-white/[0.15]">{timeSlotLabel(selectedTimeSlot)}</span>
              </span>
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl">
        <SelectItem value="06:00" className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                <div className="flex items-center gap-2">
                  <span>06:00</span>
          <span className="text-xs text-muted-foreground">Înviorare</span>
                </div>
              </SelectItem>
        <SelectItem value="08:00" className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                <div className="flex items-center gap-2">
                  <span>08:00</span>
          <span className="text-xs text-muted-foreground">Raportul și inspecția de dimineață</span>
                </div>
              </SelectItem>
        <SelectItem value="14:00" className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                <div className="flex items-center gap-2">
                  <span>14:00</span>
          <span className="text-xs text-muted-foreground">Raportul companiei</span>
                </div>
              </SelectItem>
        <SelectItem value="21:00" className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                <div className="flex items-center gap-2">
                  <span>21:00</span>
          <span className="text-xs text-muted-foreground">Apelul de seară</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {}
        {availableYears.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-medium text-muted-foreground">
              Companie (An)
            </Label>
            <Select value={selectedYearKey} onValueChange={(val: string) => onYearChange?.(val)}>
              <SelectTrigger className="h-11 rounded-full pl-3 pr-10 text-foreground/90 border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm hover:bg-white/20 hover:border-[#8d7dca]/40 transition-all duration-300">
                <span className="inline-flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {selectedYearKey === 'all' ? 'Toate companiile' : `Anul ${selectedYearKey}`}
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl">
                <SelectItem value="all" className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                  Toate companiile
                </SelectItem>
                {availableYears.sort((a,b)=>a-b).map(y => (
                  <SelectItem key={y} value={String(y)} className="text-foreground/90 hover:bg-secondary hover:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground">
                    Anul {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {}
        {!isCompanyView && onBackToCompany && (
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onBackToCompany}
              className="w-full h-11 rounded-full gap-2 text-foreground border-white/[0.15] bg-white/10 dark:bg-white/[0.06] backdrop-blur-sm hover:bg-white/20 hover:border-[#8d7dca]/40 transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Înapoi la companie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}