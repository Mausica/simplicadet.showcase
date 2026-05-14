import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, Users, UserCheck, UserX, AlertTriangle, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import type { Role } from '@/lib/auth';
const glass = {
  card: 'bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-lg shadow-black/5 dark:shadow-none',
  cardSm: 'bg-white/45 dark:bg-white/[0.03] backdrop-blur-xl border border-white/[0.10] rounded-2xl shadow-sm shadow-black/5 dark:shadow-none',
  chip: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/40 dark:bg-white/[0.06] border border-white/15 dark:border-white/10',
};

type UserRow = { id: string; email: string; name: string; roles: Role[]; college_key?: string | null };
type CompanyMapEntry = { cp: number; year: number; name: string; commander_name?: string; commander_grade?: string };

interface CommandChainDashboardProps {
  users: UserRow[];
  companyMap: CompanyMapEntry[];
  platoonsByYear: Record<number, number[]>;
  schoolCommander: string;
  pendingRequests: number;
  className?: string;
}

interface HealthIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  context?: string;
}

export default function CommandChainDashboard({ users, companyMap, platoonsByYear, schoolCommander, pendingRequests, className }: CommandChainDashboardProps) {
  const analysis = useMemo(() => {
    const issues: HealthIssue[] = [];
    const stats = { total: users.length, withRoles: 0, commanders: 0, platoonLeaders: 0 };
    const cmds = users.filter(u => u.roles.some(r => r.role === 'cmd'));
    stats.commanders = cmds.length;
    if (cmds.length === 0) issues.push({ type: 'error', message: 'Nu a fost desemnat Comandantul Colegiului', context: 'Rol „cmd" lipsă' });
    if (!schoolCommander) issues.push({ type: 'warning', message: 'Numele comandantului de colegiu nu este configurat' });
    const years = Object.keys(platoonsByYear).map(Number).sort();
    for (const year of years) {
      const cpEntry = companyMap.find(c => c.year === year);
      const cpUsers = users.filter(u => u.roles.some(r => /^cp\d+$/i.test(r.role) && r.an === year));
      if (cpUsers.length === 0) issues.push({ type: 'error', message: `Compania An ${year} – fără comandant`, context: `Rol cp* an=${year} lipsă` });
      if (!cpEntry?.commander_name) issues.push({ type: 'warning', message: `Compania An ${year} – nume comandant neconfigurat` });
    }
    for (const [yearStr, platoons] of Object.entries(platoonsByYear)) {
      const year = parseInt(yearStr, 10);
      for (const plt of platoons) {
        const leaders = users.filter(u => u.roles.some(r => (r.role === `plt${plt}` || r.role === 'platoon_editor') && r.an === year && r.pluton === plt));
        if (leaders.length === 0) issues.push({ type: 'warning', message: `Pluton ${plt} (An ${year}) – fără comandant`, context: `Rol plt${plt} an=${year} lipsă` });
        stats.platoonLeaders += leaders.length;
      }
    }

    stats.withRoles = users.filter(u => u.roles.length > 0).length;
    if (pendingRequests > 0) issues.push({ type: 'info', message: `${pendingRequests} cereri de rol în așteptare` });

    const health = issues.filter(i => i.type === 'error').length === 0
      ? issues.filter(i => i.type === 'warning').length === 0 ? 'healthy' : 'warning'
      : 'critical';

    return { issues, stats, health };
  }, [users, companyMap, platoonsByYear, schoolCommander, pendingRequests]);

  const healthColors = {
    healthy: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    critical: 'text-red-600 dark:text-red-400',
  };
  const healthBg = {
    healthy: 'bg-emerald-50/50 dark:bg-emerald-500/10',
    warning: 'bg-amber-50/50 dark:bg-amber-500/10',
    critical: 'bg-red-50/50 dark:bg-red-500/10',
  };
  const HealthIcon = analysis.health === 'healthy' ? ShieldCheck : analysis.health === 'warning' ? Shield : ShieldAlert;

  const [hierarchyOpen, setHierarchyOpen] = useState(false);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [issueLimit, setIssueLimit] = useState(3);

  return (
    <div className={cn('space-y-4', className)}>
      {}
      <div className={cn(glass.card, 'p-5')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#242880] dark:text-white/70" />
            Lanț de Comandă
          </h3>
          <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium', healthBg[analysis.health], healthColors[analysis.health])}>
            <HealthIcon className="w-3.5 h-3.5" />
            {analysis.health === 'healthy' ? 'Complet' : analysis.health === 'warning' ? 'Atenție' : 'Critic'}
          </div>
        </div>

        {}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: 'Utilizatori', value: analysis.stats.total, color: 'text-[#242880] dark:text-indigo-400', bg: 'bg-[#242880]/8 dark:bg-indigo-500/10' },
            { label: 'Cu roluri', value: analysis.stats.withRoles, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/8 dark:bg-emerald-500/10' },
            { label: 'Comandanți', value: analysis.stats.commanders, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/8 dark:bg-violet-500/10' },
            { label: 'Șefi Pluton', value: analysis.stats.platoonLeaders, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/8 dark:bg-blue-500/10' },
          ].map(s => (
            <span key={s.label} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10', s.bg)}>
              <span className={cn('font-bold text-sm leading-none', s.color)}>{s.value}</span>
              <span className="text-foreground/60">{s.label}</span>
            </span>
          ))}
        </div>

        {}
        <div className={cn(glass.cardSm, 'overflow-hidden')}>
          <button
            onClick={() => setHierarchyOpen(!hierarchyOpen)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/15 dark:hover:bg-white/[0.03] transition-colors"
          >
            <p className="text-xs font-medium text-foreground/60">Ierarhie</p>
            <ChevronDown className={cn('w-4 h-4 text-foreground/40 transition-transform', hierarchyOpen && 'rotate-180')} />
          </button>
          {hierarchyOpen && (
            <div className="px-4 pb-4 space-y-2">
              {}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#242880] dark:text-violet-400" />
                <span className="text-sm font-medium text-foreground">{schoolCommander || 'Neconfigurat'}</span>
                <span className={cn(glass.chip, 'text-[10px]')}>CMD</span>
              </div>
              {}
              {Object.keys(platoonsByYear).map(Number).sort().map(year => {
                const cp = companyMap.find(c => c.year === year);
                const platoons = platoonsByYear[year] || [];
                return (
                  <div key={year} className="ml-6 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-foreground/30" />
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm text-foreground">{cp?.commander_name || `Compania An ${year}`}</span>
                      <span className={cn(glass.chip, 'text-[10px]')}>CP An {year}</span>
                    </div>
                    {platoons.map(plt => {
                      const leader = users.find(u => u.roles.some(r => (r.role === `plt${plt}`) && r.an === year));
                      return (
                        <div key={plt} className="ml-6 flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-foreground/20" />
                          {leader ? (
                            <UserCheck className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                          ) : (
                            <UserX className="w-3 h-3 text-red-400 dark:text-red-500" />
                          )}
                          <span className="text-xs text-foreground/70">{leader?.name || `Pluton ${plt}`}</span>
                          <span className={cn(glass.chip, 'text-[10px]')}>PLT {plt}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {}
      {analysis.issues.length > 0 && (
        <div className={cn(glass.card, 'overflow-hidden')}>
          <button
            onClick={() => setIssuesOpen(!issuesOpen)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/15 dark:hover:bg-white/[0.03] transition-colors"
          >
            <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Probleme detectate ({analysis.issues.length})</h4>
            <ChevronDown className={cn('w-4 h-4 text-foreground/40 transition-transform', issuesOpen && 'rotate-180')} />
          </button>
          {issuesOpen && (
            <div className="px-4 pb-4 space-y-2">
              {analysis.issues.slice(0, issueLimit).map((issue, i) => (
              <div key={i} className={cn(
                'flex items-start gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors',
                issue.type === 'error' ? 'bg-red-50/40 dark:bg-red-500/5 text-red-700 dark:text-red-400' :
                issue.type === 'warning' ? 'bg-amber-50/40 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400' :
                'bg-blue-50/40 dark:bg-blue-500/5 text-blue-700 dark:text-blue-400'
              )}>
                {issue.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                 issue.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                 <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium">{issue.message}</p>
                  {issue.context && <p className="text-xs opacity-70 mt-0.5">{issue.context}</p>}
                </div>
              </div>
            ))}
              {analysis.issues.length > issueLimit && (
                <button
                  onClick={() => setIssueLimit(l => l + 5)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs rounded-xl border border-white/15 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] hover:bg-white/50 dark:hover:bg-white/[0.06] text-foreground transition-all mt-2"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  Încarcă mai multe ({analysis.issues.length - issueLimit} rămase)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
