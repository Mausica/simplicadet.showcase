import { useState, useRef, useEffect } from 'react';
import { FileText, ExternalLink, BookOpen, Calendar, Calculator, AlertTriangle, CheckCircle, XCircle, TrendingUp, ChevronDown } from 'lucide-react';
import { LiquidLayout, GlassCard } from '@/components/landing/liquid';
import { cn } from '@/lib/utils';
import { specializari, type Specialization } from '@/data/specializations';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const resources = [
  {
    icon: FileText,
    title: 'Ghid admitere',
    desc: 'Tot ce trebuie să știi despre procesul de admitere',
    link: 'https://www.recrutaremapn.ro/index.php',
  },
  {
    icon: Calendar,
    title: 'Calendar academic',
    desc: 'Date importante și termene limită',
    link: 'https://dgmru.mapn.ro/pages/planul-de-scolarizare-al-ministerului-apararii-nationale-pentru-anul-de-invatamant-2026-2027',
  },
  {
    icon: BookOpen,
    title: 'Pregătire examene',
    desc: 'Materiale pentru examenele de admitere',
    link: 'https://mta.ro/wp-content/uploads/2025/10/CalendarATM2026.pdf',
  },
] as const;

const glass = {
  card: 'bg-white/60 dark:bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] rounded-2xl shadow-lg shadow-black/5 dark:shadow-none',
  cardSm: 'bg-white/50 dark:bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] rounded-2xl shadow-sm shadow-black/5 dark:shadow-none',
  input: 'h-11 px-4 rounded-xl border border-white/15 dark:border-white/10 bg-white/30 dark:bg-white/[0.03] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-[#242880]/30 transition-all',
};

type CalculatorResult = {
  tvc: number;
  medieLiceu: number;
  medieAdmitere: number;
  canApply: number;
  totalWithSlots: number;
  sorted: Array<Specialization & { difference: number; canEnter: boolean; status: string }>;
  withMedicalGroup: Specialization[];
  observations: Array<{ index: number; text: string }>;
};

export default function Resources() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [notaMate, setNotaMate] = useState('');
  const [notaInfo, setNotaInfo] = useState('');
  const [notaFizica, setNotaFizica] = useState('');
  const [medieGenerala, setMedieGenerala] = useState('');
  const [medieBac, setMedieBac] = useState('');
  const [calculatorError, setCalculatorError] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showTVCFields, setShowTVCFields] = useState(false);
  const [isAllOpen, setIsAllOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCalculatorOpen && !showTVCFields) {
      setTimeout(() => setShowTVCFields(true), 300);
    }
    if (!isCalculatorOpen) {
      setShowTVCFields(false);
      setResult(null);
      setIsAllOpen(false);
    }
  }, [isCalculatorOpen]);

  useEffect(() => {
    if (!result) {
      setIsAllOpen(false);
    }
  }, [result]);

  const calculateAverage = () => {
    setCalculatorError('');
    const notaMateNum = parseFloat(notaMate);
    const notaInfoNum = parseFloat(notaInfo);
    const notaFizicaNum = parseFloat(notaFizica);
    const medieGeneralaNum = parseFloat(medieGenerala);
    const medieBacNum = parseFloat(medieBac);

    if (isNaN(notaMateNum) || isNaN(notaInfoNum) || isNaN(notaFizicaNum) || isNaN(medieGeneralaNum) || isNaN(medieBacNum)) {
      setCalculatorError('Te rog completează toate câmpurile cu note valide.');
      return;
    }

    if (notaMateNum < 1 || notaMateNum > 10 || notaInfoNum < 1 || notaInfoNum > 10 || notaFizicaNum < 1 || notaFizicaNum > 10 ||
        medieGeneralaNum < 1 || medieGeneralaNum > 10 || medieBacNum < 1 || medieBacNum > 10) {
      setCalculatorError('Notele trebuie să fie între 1 și 10.');
      return;
    }

    const tvc = 0.5 * notaMateNum + 0.3 * notaInfoNum + 0.2 * notaFizicaNum;
    const medieLiceu = (2 * medieGeneralaNum + medieBacNum) / 3;
    const medieAdmitere = 0.5 * tvc + 0.5 * medieLiceu;

    let numarPoateIntra = 0;
    let numarTotal = 0;
    const specCuGrupaMedicala: Specialization[] = [];
    const observatii: Array<{ index: number; text: string }> = [];

    for (let i = 0; i < specializari.length; i++) {
      if (specializari[i].locuri > 0) {
        numarTotal++;
        if (medieAdmitere >= specializari[i].ultimaMedie) {
          numarPoateIntra++;
          if (specializari[i].grupaMedicala) {
            specCuGrupaMedicala.push(specializari[i]);
          }
        }
      }
      if (specializari[i].observatie) {
        observatii.push({ index: i, text: specializari[i].observatie });
      }
    }

    const sorted = specializari
      .map((spec) => ({
        ...spec,
        difference: Number((medieAdmitere - spec.ultimaMedie).toFixed(2)),
        canEnter: medieAdmitere >= spec.ultimaMedie && spec.locuri > 0,
        status: spec.locuri === 0 ? 'Fără locuri' : medieAdmitere >= spec.ultimaMedie ? 'Poți intra' : 'Nu ajungi',
      }))
      .sort((a, b) => b.difference - a.difference);

    const newResult: CalculatorResult = {
      tvc,
      medieLiceu,
      medieAdmitere,
      canApply: numarPoateIntra,
      totalWithSlots: numarTotal,
      sorted,
      withMedicalGroup: specCuGrupaMedicala || [],
      observations: observatii || [],
    };

    setResult(newResult);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <LiquidLayout>
      <div className="min-h-screen relative px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242880]/10 border border-[#242880]/20 text-[#242880] dark:text-[#8d7dca] dark:bg-white/5 dark:border-white/10 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest">Materiale</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
               <span className="block text-foreground/90 mb-1">
                Centrul de
              </span>
              <span className="block bg-gradient-to-r from-[#242880] via-[#8d7dca] to-[#242880] bg-clip-text text-transparent">
                Resurse
              </span>
            </h1>
            <p className="text-foreground/60 mt-4 max-w-2xl mx-auto text-lg">
              Materiale utile pentru viitorii elevi și studenți militari
            </p>
          </div>

          <div className="grid gap-6 mb-10">
            <Collapsible open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
              <CollapsibleTrigger className="w-full">
                <GlassCard className={cn(glass.card, 'p-6 hover:bg-white/[0.08] dark:hover:bg-white/[0.08] transition-all cursor-pointer group')}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-[#242880]/10 dark:bg-white/10 flex items-center justify-center border border-[#242880]/20 dark:border-white/10">
                        <Calculator className="w-7 h-7 text-[#242880] dark:text-[#8d7dca]" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-foreground">Calculator admitere</h2>
                        <p className="text-sm text-foreground/70 mt-1">
                          Calculează media de admitere și descoperă la ce academii poți accesa
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={cn('w-6 h-6 text-foreground/60 transition-transform duration-300 flex-shrink-0', isCalculatorOpen && 'rotate-180')} />
                  </div>
                </GlassCard>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 space-y-4">
                <GlassCard className={cn(glass.card, 'p-6')}>
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-8 h-8 rounded-full bg-[#242880]/15 border border-[#242880]/35 text-[#242880] dark:text-[#8d7dca] dark:bg-[#242880]/25 dark:border-[#8d7dca]/30 flex items-center justify-center font-bold">1</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Media liceu și BAC</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-foreground/70 animate-fade-in">
                        <span className="font-medium">Media generală liceu</span>
                        <input
                          value={medieGenerala}
                          onChange={(e) => setMedieGenerala(e.target.value)}
                          type="number"
                          min="1"
                          max="10"
                          step="0.01"
                          placeholder="ex: 9.20"
                          className={cn(glass.input, 'w-full')}
                        />
                      </label>

                      <label className="space-y-2 text-sm text-foreground/70 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <span className="font-medium">Media bacalaureat</span>
                        <input
                          value={medieBac}
                          onChange={(e) => setMedieBac(e.target.value)}
                          type="number"
                          min="1"
                          max="10"
                          step="0.01"
                          placeholder="ex: 8.80"
                          className={cn(glass.input, 'w-full')}
                        />
                      </label>
                    </div>
                  </div>

                  {showTVCFields && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/80 mb-4 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-[#242880]/15 border border-[#242880]/35 text-[#242880] dark:text-[#8d7dca] dark:bg-[#242880]/25 dark:border-[#8d7dca]/30 flex items-center justify-center text-xs font-bold">2</span>
                          Note pentru TVC (50% Mat + 30% Info + 20% Fiz)
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <label className="space-y-2 text-sm text-foreground/70 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <span className="font-medium">Matematică (50%)</span>
                            <input
                              value={notaMate}
                              onChange={(e) => setNotaMate(e.target.value)}
                              type="number"
                              min="1"
                              max="10"
                              step="0.01"
                              placeholder="ex: 8.50"
                              className={cn(glass.input, 'w-full')}
                            />
                          </label>

                          <label className="space-y-2 text-sm text-foreground/70 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <span className="font-medium">Informatică (30%)</span>
                            <input
                              value={notaInfo}
                              onChange={(e) => setNotaInfo(e.target.value)}
                              type="number"
                              min="1"
                              max="10"
                              step="0.01"
                              placeholder="ex: 9.00"
                              className={cn(glass.input, 'w-full')}
                            />
                          </label>

                          <label className="space-y-2 text-sm text-foreground/70 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <span className="font-medium">Fizică (20%)</span>
                            <input
                              value={notaFizica}
                              onChange={(e) => setNotaFizica(e.target.value)}
                              type="number"
                              min="1"
                              max="10"
                              step="0.01"
                              placeholder="ex: 7.50"
                              className={cn(glass.input, 'w-full')}
                            />
                          </label>
                        </div>
                      </div>

                      {calculatorError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                          {calculatorError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={calculateAverage}
                        className={cn(
                          'w-full h-11 px-6 rounded-full font-semibold tracking-wide transition-all',
                          'bg-[#242880] text-white shadow-lg shadow-[#242880]/25 hover:shadow-[#242880]/40 hover:-translate-y-0.5',
                          'dark:bg-white/10 dark:backdrop-blur-xl dark:border dark:border-white/20 dark:text-white dark:shadow-none',
                          'dark:hover:bg-white/15 dark:hover:border-white/30 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
                          'active:translate-y-0'
                        )}
                      >
                        Calculează Media de Admitere
                      </button>
                    </div>
                  )}
                </GlassCard>

                {result && result.canApply !== undefined && (
                  <div ref={resultsRef} className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <GlassCard className={cn(glass.card, 'p-4 text-center')}>
                        <p className="text-xs text-foreground/60 font-medium mb-1">NOTA TVC</p>
                        <p className="text-3xl font-bold text-[#242880] dark:text-[#8d7dca]">{result.tvc?.toFixed(2) || '0.00'}</p>
                      </GlassCard>
                      <GlassCard className={cn(glass.card, 'p-4 text-center')}>
                        <p className="text-xs text-foreground/60 font-medium mb-1">MEDIA ADMITERE</p>
                        <p className="text-3xl font-bold text-[#242880] dark:text-[#8d7dca]">{result.medieAdmitere?.toFixed(2) || '0.00'}</p>
                      </GlassCard>
                    </div>

                    <GlassCard className={cn(glass.card, 'p-4 text-center')}>
                      <p className="text-foreground/70 text-sm">
                        Poți aplica la <span className="font-bold text-[#242880] dark:text-[#8d7dca]">{result.canApply || 0}</span> din{' '}
                        <span className="font-bold text-[#242880] dark:text-[#8d7dca]">{result.totalWithSlots || 0}</span> specializări
                      </p>
                    </GlassCard>

                    <GlassCard className={cn(glass.card, 'p-4')}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Toate specializările</p>
                          <p className="text-sm text-foreground/80">Lista completă sortată după diferență</p>
                        </div>
                        <span className="text-xs font-semibold text-[#242880] dark:text-[#8d7dca]">{result.sorted.length} total</span>
                      </div>

                      <Collapsible open={isAllOpen} onOpenChange={setIsAllOpen}>
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="w-full flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/5 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-[#242880]/25 hover:bg-[#242880]/5 dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            <span>{isAllOpen ? 'Ascunde lista completă' : 'Arată toate specializările'}</span>
                            <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', isAllOpen && 'rotate-180')} />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/80 shadow-sm dark:bg-white/5 dark:border-white/10">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm text-foreground/80">
                                <thead className="border-b border-white/10 bg-slate-950/5 dark:bg-white/5">
                                  <tr>
                                    <th className="px-4 py-3 font-semibold">Academie</th>
                                    <th className="px-4 py-3 font-semibold">Specializare</th>
                                    <th className="px-4 py-3 font-semibold">Locuri</th>
                                    <th className="px-4 py-3 font-semibold">Ultima medie</th>
                                    <th className="px-4 py-3 font-semibold">Diferență</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result.sorted.map((spec, idx) => (
                                    <tr
                                      key={idx}
                                      className={cn(
                                        'border-b border-white/10 last:border-0',
                                        spec.canEnter ? 'bg-emerald-500/5' : 'bg-red-500/5'
                                      )}
                                    >
                                      <td className="px-4 py-3 font-semibold text-foreground">{spec.academie}</td>
                                      <td className="px-4 py-3 text-foreground/80">{spec.specializare}</td>
                                      <td className="px-4 py-3 text-foreground/70">{spec.locuri}</td>
                                      <td className="px-4 py-3 text-foreground/70">{spec.ultimaMedie.toFixed(2)}</td>
                                      <td className={cn('px-4 py-3 font-semibold', spec.difference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                                        {spec.difference >= 0 ? '+' : ''}
                                        {spec.difference.toFixed(2)}
                                      </td>
                                      <td className={cn('px-4 py-3 font-semibold', spec.canEnter ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                                        {spec.status}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </GlassCard>

                    {result.observations.length > 0 && (
                      <GlassCard className={cn(glass.cardSm, 'p-4')}>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3">Observații</p>
                        <div className="space-y-2">
                          {result.observations.map((obs, idx) => (
                            <p key={idx} className="text-sm text-foreground/75">
                              *{idx + 1} {obs.text}
                            </p>
                          ))}
                        </div>
                      </GlassCard>
                    )}

                    {result.withMedicalGroup && result.withMedicalGroup.length > 0 && (
                      <GlassCard className={cn(glass.cardSm, 'p-4')}>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3">Cerințe medicale</p>
                        <div className="space-y-2">
                          {result.withMedicalGroup.map((spec, idx) => (
                            <p key={idx} className="text-sm text-foreground/75">
                              {spec.academie} - {spec.specializare}: <span className="font-semibold">{spec.grupaMedicala}</span>
                            </p>
                          ))}
                        </div>
                      </GlassCard>
                    )}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="grid gap-4">
            {resources.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.3 + i * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <GlassCard
                    variant="sm"
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0 border border-border/50 dark:border-white/15 group-hover:bg-foreground/10 dark:group-hover:bg-white/15 transition-colors">
                      <Icon className="w-7 h-7 text-foreground/70" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-foreground/60">{item.desc}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-foreground/40 group-hover:text-foreground/70 transition-colors" />
                  </GlassCard>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </LiquidLayout>
  );
}
