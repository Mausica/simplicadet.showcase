import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Filter, Download, Search, User, FileText, ClipboardCheck, Shield, ChevronDown, ChevronRight, Layers, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { AuditEvent } from '@/lib/browser-database';
const glass = {
  card: 'bg-white/60 dark:bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl shadow-lg shadow-black/5 dark:shadow-none',
  cardSm: 'bg-white/45 dark:bg-white/[0.03] backdrop-blur-xl border border-white/[0.10] rounded-2xl shadow-sm shadow-black/5 dark:shadow-none',
  input: 'h-9 px-3 rounded-xl border border-white/15 dark:border-white/10 bg-white/30 dark:bg-white/[0.02] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#242880]/30 transition-all',
  btnPrimary: 'rounded-xl bg-[#242880] text-white shadow-lg shadow-[#242880]/25 hover:shadow-[#242880]/40 dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border dark:border-white/10 dark:text-white dark:shadow-none dark:hover:bg-white/10 font-medium transition-all',
  btnSecondary: 'rounded-xl border border-white/15 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] hover:bg-white/50 dark:hover:bg-white/[0.06] text-foreground transition-all',
  chip: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/40 dark:bg-white/[0.06] border border-white/15 dark:border-white/10',
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  attendance: { icon: <ClipboardCheck className="w-3.5 h-3.5" />, color: 'text-emerald-600 dark:text-emerald-400', label: 'Prezență' },
  permission: { icon: <FileText className="w-3.5 h-3.5" />, color: 'text-blue-600 dark:text-blue-400', label: 'Permisie' },
  leave: { icon: <Shield className="w-3.5 h-3.5" />, color: 'text-violet-600 dark:text-violet-400', label: 'Invoiere' },
};

const ACTION_LABELS: Record<string, string> = {
  mark: 'marcat', create: 'creat', update: 'actualizat', delete: 'șters',
};
interface BulkGroup {
  id: string;
  events: AuditEvent[];
  type: string;
  action: string;
  firstTs: string;
  lastTs: string;
  by?: string;
}

function groupIntoBulks(events: AuditEvent[]): BulkGroup[] {
  const groups: BulkGroup[] = [];
  for (const e of events) {
    const last = groups[groups.length - 1];
    if (last && last.type === e.type && last.action === e.action && last.by === e.by) {
      const gap = new Date(last.lastTs).getTime() - new Date(e.ts).getTime();
      if (Math.abs(gap) < 5000) {
        last.events.push(e);
        last.lastTs = e.ts;
        continue;
      }
    }
    groups.push({
      id: `${e.ts}_${groups.length}`,
      events: [e],
      type: e.type,
      action: e.action,
      firstTs: e.ts,
      lastTs: e.ts,
      by: e.by,
    });
  }
  return groups;
}

interface AuditTimelineProps {
  events: AuditEvent[];
  students: Array<{ id: string; nume: string; prenume: string }>;
  onExport: () => void;
  onClearLogs?: () => void;
  className?: string;
}

export default function AuditTimeline({ events, students, onExport, onClearLogs, className }: AuditTimelineProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [limit, setLimit] = useState(50);
  const [expandedBulks, setExpandedBulks] = useState<Set<string>>(new Set());

  const studentMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of students) m.set(s.id, `${s.nume} ${s.prenume}`);
    return m;
  }, [students]);

  const filtered = useMemo(() => {
    let items = [...events].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    items = items.filter(e => {
      if (e.type !== 'attendance') return true;
      if (!e.by) return false;
      if (e.action === 'mark' && 'details' in e && e.details) {
        const d = e.details as Record<string, unknown>;
        if (d.status === 'present' && (!e.by || e.by === 'auto' || e.by === 'system')) return false;
      }
      return true;
    });
    if (typeFilter !== 'all') items = items.filter(e => e.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(e => {
        const name = e.student_id ? (studentMap.get(e.student_id) || '').toLowerCase() : '';
        const by = (e.by || '').toLowerCase();
        return name.includes(q) || by.includes(q) || e.type.includes(q) || e.action.includes(q);
      });
    }
    return items;
  }, [events, typeFilter, search, studentMap]);
  const grouped = useMemo(() => {
    const dateGroups: Record<string, AuditEvent[]> = {};
    for (const e of filtered.slice(0, limit)) {
      const dateKey = new Date(e.ts).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
      (dateGroups[dateKey] ||= []).push(e);
    }
    const result: Record<string, BulkGroup[]> = {};
    for (const [date, dayEvents] of Object.entries(dateGroups)) {
      result[date] = groupIntoBulks(dayEvents);
    }
    return result;
  }, [filtered, limit]);

  const toggleBulk = (id: string) => {
    setExpandedBulks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className={cn(glass.card, 'p-5')}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#242880] dark:text-white/70" />
            Jurnal Activitate
          </h3>
          <div className="flex gap-2">
            <span className={cn(glass.chip)}>{filtered.length} evenimente</span>
            <button onClick={onExport} className={cn('flex items-center gap-1 px-3 py-1 text-xs', glass.btnSecondary)}>
              <Download className="w-3 h-3" /> Export
            </button>
            {onClearLogs && (
              <button onClick={onClearLogs} className={cn('flex items-center gap-1 px-3 py-1 text-xs text-red-600 dark:text-red-400', glass.btnSecondary)} title="Șterge toate logurile">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="text"
              placeholder="Caută (nume, email, acțiune)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(glass.input, 'pl-9 w-full text-sm')}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(glass.input, 'text-sm w-full sm:w-44 bg-white/85 dark:bg-[#1c2145] dark:text-slate-100 dark:border-white/20 flex items-center justify-between gap-2 cursor-pointer')}>
                <span className="truncate">{typeFilter === 'all' ? 'Toate tipurile' : TYPE_CONFIG[typeFilter]?.label || typeFilter}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 dark:bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] rounded-xl text-foreground w-48">
              {[
                { value: 'all', label: 'Toate tipurile' },
                { value: 'attendance', label: 'Prezență' },
                { value: 'permission', label: 'Permisii' },
                { value: 'leave', label: 'Invoieri' },
              ].map(opt => (
                <DropdownMenuItem
                  key={opt.value}
                  onSelect={() => setTypeFilter(opt.value)}
                  className={cn('cursor-pointer text-sm', typeFilter === opt.value && 'font-semibold text-[#242880] dark:text-white')}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {}
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, bulkGroups]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                <span className="text-xs font-medium text-foreground/50">{date}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />
              </div>
              <div className="space-y-1.5">
                {bulkGroups.map((bulk) => {
                  const cfg = TYPE_CONFIG[bulk.type] || TYPE_CONFIG.attendance;
                  const time = new Date(bulk.firstTs).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
                  const isBulk = bulk.events.length > 1;
                  const isExpanded = expandedBulks.has(bulk.id);

                  if (isBulk) {
                    const studentNames = bulk.events
                      .map(e => e.student_id ? studentMap.get(e.student_id) : null)
                      .filter(Boolean);
                    return (
                      <div key={bulk.id} className={cn(glass.cardSm, 'overflow-hidden')}>
                        <button
                          onClick={() => toggleBulk(bulk.id)}
                          className="w-full px-3 py-2 flex items-start gap-3 hover:bg-white/30 dark:hover:bg-white/[0.03] transition-colors text-left"
                        >
                          <div className={cn('mt-0.5 shrink-0', cfg.color)}>{cfg.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">
                                {cfg.label} {ACTION_LABELS[bulk.action] || bulk.action}
                              </span>
                              <span className={cn(glass.chip, 'text-[10px] gap-0.5')}>
                                <Layers className="w-2.5 h-2.5" /> {bulk.events.length} acțiuni
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-foreground/40">{time}</span>
                              {bulk.by && <span className="text-[10px] text-foreground/40">de {bulk.by}</span>}
                            </div>
                          </div>
                          <ChevronDown className={cn('w-4 h-4 text-foreground/30 mt-1 shrink-0 transition-transform', isExpanded && 'rotate-180')} />
                        </button>
                        {isExpanded && (
                          <div className="px-3 pb-2 space-y-1 ml-6 border-t border-white/10 pt-2">
                            {bulk.events.map((e, i) => {
                              const studentName = e.student_id ? studentMap.get(e.student_id) : null;
                              const evTime = new Date(e.ts).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                              return (
                                <div key={`${e.ts}_${i}`} className="flex items-center gap-2 py-1">
                                  <span className="text-[10px] text-foreground/30 w-14 shrink-0">{evTime}</span>
                                  {studentName && (
                                    <span className={cn(glass.chip, 'text-[10px]')}>
                                      <User className="w-2.5 h-2.5" /> {studentName}
                                    </span>
                                  )}
                                  {'details' in e && e.details && (
                                    <span className="text-[10px] text-foreground/30">
                                      {'status' in e.details && e.details.status}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  const e = bulk.events[0];
                  const studentName = e.student_id ? studentMap.get(e.student_id) : null;
                  return (
                    <div key={bulk.id} className={cn(glass.cardSm, 'px-3 py-2 flex items-start gap-3 group hover:bg-white/30 dark:hover:bg-white/[0.03] transition-colors')}>
                      <div className={cn('mt-0.5 shrink-0', cfg.color)}>{cfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">
                            {cfg.label} {ACTION_LABELS[e.action] || e.action}
                          </span>
                          {studentName && (
                            <span className={cn(glass.chip, 'text-[10px]')}>
                              <User className="w-2.5 h-2.5" /> {studentName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-foreground/40">{time}</span>
                          {e.by && <span className="text-[10px] text-foreground/40">de {e.by}</span>}
                          {'details' in e && e.details && (
                            <span className="text-[10px] text-foreground/30">
                              {'date' in e.details && e.details.date}
                              {'status' in e.details && ` • ${e.details.status}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {}
        {filtered.length > limit && (
          <button onClick={() => setLimit(l => l + 50)} className={cn('flex items-center gap-1.5 px-4 py-2 text-sm w-full justify-center mt-4', glass.btnSecondary)}>
            <ChevronDown className="w-4 h-4" /> Încarcă mai multe ({filtered.length - limit} rămase)
          </button>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 mx-auto mb-3 text-foreground/20" />
            <p className="text-sm text-foreground/40">Niciun eveniment găsit</p>
          </div>
        )}
      </div>
    </div>
  );
}
