import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { withBase } from "@/lib/base-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, Settings, Sparkles, Database, Moon, Sun, Menu, Download, Shield, LogOut, Download as DownloadIcon, User, Eye } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from 'next-themes';
import { browserDb } from '@/lib/browser-database';
import { useToast } from '@/hooks/use-toast';
import { getMe, signInWithGoogle, signOut, isGuestSession, type Role } from '@/lib/auth';
import GoogleSignInButton from '@/components/GoogleSignInButton';

interface TopNavProps {
  user?: {
    name: string;
    rank: string;
    institution: string;
    imageUrl?: string;
  };
  variant?: "landing" | "app";
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function TopNav({ user, variant = "landing" }: TopNavProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileFileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const logoSrc = theme === 'dark' ? withBase('/logo.svg') : withBase('/logo-dark.svg');
  const [me, setMe] = useState<{ name?: string | null; email?: string | null; image?: string | null; roles?: Role[]; domainOk?: boolean; grad?: string | null; isGuest?: boolean } | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setCanInstall(false);
      toast({
        title: 'Instalare completă',
        description: 'Aplicația a fost adăugată pe ecranul de pornire',
      });
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    (async () => {
      const m = await getMe();
      const isGuest = isGuestSession();
      if (m?.user) {

        let grad: string | null = null;
        if (!isGuest) {
          try {
            const students = await browserDb.getStudents();
            if (m.user.email) {
              const local = m.user.email.split('@')[0];
              const parts = local.split(/[._-]+/);
              const last = parts[parts.length - 1].toLowerCase();
              const match = students.find(s => s.nume?.toLowerCase() === last);
              grad = match?.grad || null;
            }
          } catch {  }
        }
        setMe({ name: m.user.name, email: m.user.email, image: m.user.image, roles: m.roles, domainOk: m.domainOk, grad, isGuest });
      } else {
        setMe(null);
      }
    })();
  }, [location.pathname]);

  const hasCmdAccess = !me?.isGuest && !!me?.roles?.some(r => ['cmd', 'admin', 'edit_all_students'].includes(String(r.role)));

  const currentCollege = (() => { try { return localStorage.getItem('current_college') || 'cnmtv'; } catch { return 'cnmtv'; } })();
  const base = `/${currentCollege}`;

  const navLinks = variant === "landing"
    ? [
      { to: "/", label: "Prezentare" },
      { to: "/about", label: "Despre" },
      { to: "/pricing", label: "Prețuri" },
      { to: "/resources", label: "Resurse" },
    ]
    : [
      { to: `${base}/documents`, label: "Documente" },
      { to: `${base}/attendance`, label: "Prezență" },
      { to: `${base}/services`, label: "Servicii" },
      ...(hasCmdAccess ? [{ to: `${base}/activities`, label: "Activități" }] : []),
    ];

  const canAccessDatabase = hasCmdAccess;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between rounded-full liquid-glass-nav px-4 py-2 transition-all duration-300">
            {}
            <div className="flex items-center gap-3 min-w-0 z-10">
              <Link to="/">
                <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
              </Link>
            </div>
            {}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="max-w-full">
                <div className="flex gap-1 items-center">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={
                          "px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 " +
                          (isActive
                            ? "bg-white dark:bg-white/[0.15] text-foreground border border-white/[0.2] shadow-sm"
                            : "text-foreground/60 hover:text-foreground hover:bg-white/50 dark:hover:bg-white/[0.08]")
                        }
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
            {}
            <div className="flex items-center gap-2 z-10">
              {variant === "app" ? (
                <>
                  <button className="liquid-glass-button !p-2.5 !rounded-full aspect-square flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                    <span className="sr-only">Noutăți</span>
                  </button>
                  {}
                  <button className="liquid-glass-button !p-2.5 !rounded-full aspect-square flex items-center justify-center">
                    <BellIcon className="w-4 h-4" />
                    <span className="sr-only">Notificări</span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="h-10 w-10 flex items-center justify-center rounded-full liquid-glass-button !p-0 outline-none group"
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Avatar className="h-7 w-7 border border-white/20 ring-2 ring-white/10 ring-offset-0">
                          <AvatarImage src={me?.image || user?.imageUrl} />
                          <AvatarFallback>{(me?.name || user?.name || '').slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={8} className="w-56 bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl shadow-2xl shadow-black/10 p-0 overflow-hidden">
                      <DropdownMenuLabel>
                        <div className="font-normal px-5 pt-4 pb-2">
                          <p className="text-sm font-semibold text-foreground/90">{me?.name || user?.name}</p>
                          {me?.isGuest && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
                              <Eye className="w-3 h-3" />
                              <span>Mod Vizitator Demo</span>
                            </div>
                          )}
                          {me?.grad && !me?.isGuest && (<p className="text-xs text-foreground/60">Grad: {me.grad}</p>)}
                          <p className="text-xs text-foreground/60">{me?.isGuest ? 'Explorează aplicația' : (me?.email || user?.institution)}</p>
                          {me?.domainOk && !me?.isGuest && (<p className="text-[10px] text-yellow-600 mt-1">Acces limitat pe domeniu</p>)}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/[0.1] mx-1" />
                      <DropdownMenuItem
                        className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                        onSelect={(e) => {
                          e.preventDefault();

                          const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
                          const isiOS = /iphone|ipad|ipod/.test(ua);
                          if (deferredPrompt) {
                            handleInstall();
                            return;
                          }
                          if (isiOS) {
                            try { toast({ title: 'Instalare iOS', description: 'Deschide în Safari → Partajare → Adaugă pe ecranul de pornire' }); } catch (e) { alert('Deschide în Safari și alege "Adaugă pe ecranul de pornire"'); }
                            return;
                          }

                          try { toast({ title: 'Instalare', description: 'Folosește meniul browserului (⋮) → Add to Home screen / Install' }); } catch (e) { alert('Folosește meniul browserului (⋮) → Add to Home screen / Install'); }
                        }}
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Instalează aplicația
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4 mr-2" />
                        Setări
                      </DropdownMenuItem>
                      {me?.roles && !me?.isGuest && me.roles.some(r => ['admin', 'cmd', 'edit_all_students'].includes(String(r.role))) && (
                        <DropdownMenuItem
                          className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                          onSelect={(e) => { e.preventDefault(); window.location.href = `/${currentCollege}/admin`; }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Administrare
                        </DropdownMenuItem>
                      )}
                      {me?.isGuest && (
                        <DropdownMenuItem
                          className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                          onSelect={(e) => { e.preventDefault(); signInWithGoogle(location.pathname || '/'); }}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Conectare cont real
                        </DropdownMenuItem>
                      )}
                      {me ? (
                        <DropdownMenuItem
                          className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                          onSelect={(e) => { e.preventDefault(); signOut(); }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Deconectare
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-default p-3">
                          <GoogleSignInButton className="w-full" size="md" callbackUrl={location.pathname || '/'} />
                        </DropdownMenuItem>
                      )}
                      {canAccessDatabase && (
                        <>
                          <DropdownMenuSeparator className="bg-white/[0.1] mx-1" />
                          <DropdownMenuItem
                            className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                            onSelect={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Import DB
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                            onSelect={async (e) => { e.preventDefault(); try { const res = await fetch('/api/data?entity=backup'); if (!res.ok) throw new Error('Eroare'); const data = await res.json(); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'database.backup.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); } catch (err) { console.error(err); alert('Export eșuat'); } }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export DB
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer px-4 py-2.5 mx-1 rounded-xl transition-all font-medium text-foreground/80 hover:bg-white/[0.12] hover:text-foreground focus:bg-white/[0.12] focus:text-foreground flex items-center gap-2"
                        onSelect={(e) => {
                          e.preventDefault();
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                        }}
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {theme === 'dark' ? 'Temă deschisă' : 'Temă întunecată'}
                      </DropdownMenuItem>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".db,application/json"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const text = await file.text();
                            const result = await browserDb.importFull(text);
                            toast({
                              title: 'Import complet',
                              description: `Studenți: ${result.students}, Învoiri: ${result.leave}, Permisii: ${result.permissions}`
                            });

                            setTimeout(() => window.location.reload(), 600);
                          } catch (err: unknown) {
                            const message = err && typeof err === 'object' && 'message' in err
                              ? String((err as { message?: unknown }).message)
                              : String(err);
                            toast({
                              title: 'Eroare import',
                              description: message,
                            });
                          } finally {
                            e.target.value = '';
                          }
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {}
                  <div className="hidden md:flex items-center gap-2 z-20">
                    {me ? (
                      <>
                        {me?.roles && me.roles.some(r => ['admin', 'cmd', 'edit_all_students'].includes(String(r.role))) && (
                          <button className="px-4 py-1.5 bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium rounded-full" onClick={() => window.location.href = `/${currentCollege}/admin`}>
                            Administrare
                          </button>
                        )}
                        <button className="px-4 py-1.5 bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium rounded-full" onClick={() => signOut()}>Deconectare</button>
                      </>
                    ) : (
                      <GoogleSignInButton callbackUrl={location.pathname || '/'} size="sm" />
                    )}
                  </div>
                </>
              )}
              {}
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <button
                    className="md:hidden liquid-glass-button !p-2.5 !rounded-full aspect-square flex items-center justify-center"
                    aria-label="Deschide meniul de navigație"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90vw] sm:w-[420px] bg-white/90 dark:bg-black/80 backdrop-blur-2xl border-l border-white/[0.15] text-foreground">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Meniu</SheetTitle>
                  </SheetHeader>
                  {variant !== "app" && (
                    <div className="mt-4 flex flex-col gap-3">
                      {me ? (
                        <>
                          {me?.email === 'mausica.dev@gmail.com' && (
                            <button className="w-full h-10 rounded-full bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium" onClick={() => { setMobileNavOpen(false); window.location.href = `/${currentCollege}/admin`; }}>
                              Administrare
                            </button>
                          )}
                          <button className="w-full h-10 rounded-full bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium" onClick={() => { setMobileNavOpen(false); signOut(); }}>
                            Deconectare
                          </button>
                        </>
                      ) : (
                        <GoogleSignInButton className="w-full" size="md" callbackUrl={location.pathname || '/'} />
                      )}
                    </div>
                  )}
                  {canAccessDatabase && (
                    <div className="mt-4 flex flex-col gap-3 px-4">
                      <button
                        className="w-full h-10 rounded-full bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium flex items-center justify-center gap-2"
                        onClick={() => { setMobileNavOpen(false); mobileFileInputRef.current?.click(); }}
                      >
                        <Database className="w-4 h-4" />
                        Import DB
                      </button>
                      <button
                        className="w-full h-10 rounded-full bg-white/60 dark:bg-white/[0.06] text-foreground border border-white/[0.15] hover:border-[#8d7dca]/40 font-medium flex items-center justify-center gap-2"
                        onClick={async () => {
                          setMobileNavOpen(false);
                          try {
                            const res = await fetch('/api/data?entity=backup');
                            if (!res.ok) throw new Error('Eroare');
                            const data = await res.json();
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'database.backup.json';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error(err);
                            alert('Export eșuat');
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Export DB
                      </button>
                      <input
                        ref={mobileFileInputRef}
                        type="file"
                        accept=".db,application/json"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const text = await file.text();
                            const result = await browserDb.importFull(text);
                            toast({
                              title: 'Import complet',
                              description: `Studenți: ${result.students}, Învoiri: ${result.leave}, Permisii: ${result.permissions}`
                            });
                            setTimeout(() => window.location.reload(), 600);
                          } catch (err: unknown) {
                            const message = err && typeof err === 'object' && 'message' in err
                              ? String((err as { message?: unknown }).message)
                              : String(err);
                            toast({
                              title: 'Eroare import',
                              description: message,
                            });
                          } finally {
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  )}
                  <nav className="mt-4 flex flex-col">
                    {navLinks.map((link) => {
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all border border-transparent ${isActive ? 'bg-white/[0.15] text-foreground border-white/[0.2] shadow-sm font-semibold' : 'text-foreground/70 hover:bg-white/[0.08] hover:text-foreground'}`}
                          onClick={() => setMobileNavOpen(false)}
                        >
                          {link.label}
                          {isActive && <span className="ml-auto inline-block w-2 h-2 rounded-full bg-primary" />}
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
