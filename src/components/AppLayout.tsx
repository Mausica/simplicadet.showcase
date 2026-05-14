import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, LogOut, Shield, Bell, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { withBase } from '@/lib/base-url';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getMe, signOut, isGuestSession, type MeResponse } from '@/lib/auth';
import { PremiumBackground } from './landing/liquid/PremiumBackground';
import LiquidGlassFilters from './landing/liquid/LiquidGlassFilters';
import { LiquidFooter } from './landing/liquid/LiquidFooter';
import { getInstitutionBySlug } from '@/data/institutions';
import RoleRequestDialog from './RoleRequestDialog';
import { OfflineIndicator } from './OfflineQueue';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const isDark = resolvedTheme === 'dark';
  const [roleRequestOpen, setRoleRequestOpen] = useState(false);
  const [myRequests, setMyRequests] = useState<Array<{ id: number; status: 'pending' | 'approved' | 'denied'; requested_role: string; college_key: string; created_at: string }>>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const SUPER_ADMIN_EMAIL = 'mausica.dev@gmail.com';
  function getRank(roles: any[], email?: string): number {
    if (email === SUPER_ADMIN_EMAIL) return 100;
    if (!roles?.length) return 0;
    let maxRank = 0;
    for (const r of roles) {
      const roleStr = String(r.role);
      if (roleStr === 'cmd' || roleStr === 'admin') maxRank = Math.max(maxRank, 90);
      else if (/^cp\d+$/i.test(roleStr)) maxRank = Math.max(maxRank, 70);
      else if (roleStr === 'sergent_major' || /^plt\d+$/i.test(roleStr) || roleStr === 'platoon_editor') maxRank = Math.max(maxRank, 50);
    }
    return maxRank;
  }

  function getRankLabel(rank: number): string {
    if (rank >= 100) return 'Super Admin';
    if (rank >= 90) return 'Comandant Colegiu';
    if (rank >= 70) return 'Comandant Companie';
    if (rank >= 50) return 'Comandant Pluton';
    return 'Utilizator';
  }

  const userRank = useMemo(() => getRank(me?.roles || [], me?.user?.email ?? undefined), [me]);
  const userRankLabel = useMemo(() => getRankLabel(userRank), [userRank]);
  const institutionSlug = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0 && getInstitutionBySlug(parts[0])) return parts[0];
    return null;
  }, [location.pathname]);
  const basePrefix = institutionSlug ? `/${institutionSlug}` : '';
  const navItemsBase = [
    { key: 'documents', label: 'Documente', to: `${basePrefix}/documents` },
    { key: 'collections', label: 'Strângeri', to: `${basePrefix}/collections` },
    { key: 'attendance', label: 'Prezență', to: `${basePrefix}/attendance` },
    { key: 'services', label: 'Servicii', to: `${basePrefix}/services` },
  ];

  useEffect(() => {
    (async () => {
      const guest = isGuestSession();
      setIsGuest(guest);
      const m = await getMe();
      setMe(m);
    })();
  }, [location.pathname]);
  const hasCmdAccess = !isGuest && !!me?.roles?.some(r => ['cmd', 'admin', 'edit_all_students'].includes(String(r.role)));
  const showActivities = isGuest || hasCmdAccess;
  const hasNoRoles = !isGuest && !!me?.user?.id && (!me?.roles || me.roles.length === 0 || me.roles.every(r => r.role === 'guest'));
  const isAdmin = !isGuest && (me?.user?.email === SUPER_ADMIN_EMAIL || (me?.roles || []).some(r => ['admin', 'cmd'].includes(r.role)));
  const fetchRoleData = useCallback(async () => {
    if (isGuest || !me?.user?.id) return;
    try {
      const res = await fetch('/api/data?entity=myRoleRequest');
      if (res.ok) setMyRequests(await res.json());
    } catch {  }
    const hasAdminAccess = me?.user?.email === SUPER_ADMIN_EMAIL || (me?.roles || []).some(r => ['admin', 'cmd'].includes(r.role));
    if (hasAdminAccess) {
      try {
        const res = await fetch('/api/data?entity=roleRequests');
        if (res.ok) {
          const data = await res.json();
          setPendingCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {  }
    }
  }, [me, isGuest]);

  useEffect(() => { fetchRoleData(); }, [fetchRoleData]);
  useEffect(() => {
    if (hasNoRoles && !isGuest && me?.user?.id && myRequests.length === 0) {
      try {
        const dismissed = localStorage.getItem('role_request_auto_dismissed');
        if (!dismissed) setRoleRequestOpen(true);
      } catch { setRoleRequestOpen(true); }
    }
  }, [hasNoRoles, isGuest, me, myRequests]);

  const allNavItems = [
    ...navItemsBase,
    ...(showActivities ? [{ key: 'activities', label: 'Activități', to: `${basePrefix}/activities` }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col relative">
      <LiquidGlassFilters />
      <PremiumBackground />

      {}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-700 ease-in-out" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}>
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "flex items-center justify-between transition-all duration-700 ease-in-out rounded-full px-4 py-2",
            "liquid-glass-nav"
          )}>
            {}
            <Link to={institutionSlug ? `/${institutionSlug}` : "/"} className="flex items-center gap-3 group ml-2">
              <img
                src={withBase("/logo-dark.svg")}
                alt="Logo"
                className={cn("h-8 w-auto object-contain transition-opacity group-hover:opacity-80", isDark ? "hidden" : "block")}
              />
              <img
                src={withBase("/logo.svg")}
                alt="Logo"
                className={cn("h-8 w-auto object-contain transition-opacity group-hover:opacity-80", isDark ? "block" : "hidden")}
              />
            </Link>

            {}
            <div className="hidden md:flex items-center gap-1">
              {allNavItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive(item.to)
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {isActive(item.to) && (
                    <motion.div
                      layoutId="app-nav-pill"
                      className="absolute inset-0 bg-white/15 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>

            {}
            <div className="flex items-center gap-2">
              {}
              <div className="flex items-center justify-center w-8 h-8 rounded-full">
                {isGuest ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                ) : (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600 dark:bg-violet-400 shadow-sm shadow-violet-500/30" />
                  </span>
                )}
              </div>

              {}
              {isAdmin && pendingCount > 0 && (
                <Link
                  to={institutionSlug ? `/${institutionSlug}/admin` : '/admin'}
                  className="liquid-glass-button !p-2.5 !rounded-full aspect-square hidden sm:flex items-center justify-center relative"
                  title={`${pendingCount} cereri de acces în așteptare`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center px-1 rounded-full text-[9px] font-bold bg-red-500 text-white shadow-sm">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                </Link>
              )}

              {}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="liquid-glass-button !p-2.5 !rounded-full aspect-square hidden sm:flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {}
              {isGuest ? (
                <button
                  onClick={() => signOut()}
                  className="liquid-glass-button !p-2.5 !rounded-full aspect-square flex items-center justify-center hover:!border-red-400/40 group"
                  title="Ieși din modul demo"
                >
                  <LogOut className="w-4 h-4 text-foreground/70 group-hover:text-red-500 transition-colors" />
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full liquid-glass-button !p-0 outline-none group">
                      <Avatar className="h-7 w-7 border border-white/20 ring-2 ring-white/10 ring-offset-0">
                        <AvatarImage src={me?.user?.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-[#242880] to-[#8d7dca] text-white text-[10px] font-bold">
                          {(me?.user?.name || 'U').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    sideOffset={8}
                    align="end"
                    className="w-56 bg-white/95 dark:bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-2xl shadow-2xl shadow-black/10"
                  >
                    <DropdownMenuLabel className="px-4 pt-3 pb-2">
                      <p className="text-sm font-semibold text-foreground">{me?.user?.name || 'Utilizator'}</p>
                      <p className="text-[10px] text-foreground/50 mb-2">{me?.user?.email || ''}</p>
                      <div className="flex">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wide uppercase",
                          userRank >= 90
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-[#242880]/10 text-[#242880] dark:bg-white/10 dark:text-white/80 border-transparent"
                        )}>
                          <Shield className="w-2.5 h-2.5" />
                          {userRankLabel}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="px-4 py-2.5 text-foreground/80 hover:bg-white/10 cursor-pointer rounded-lg mx-1"
                      onSelect={(e) => { e.preventDefault(); setTheme(isDark ? 'light' : 'dark'); }}
                    >
                      {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                      {isDark ? 'Temă deschisă' : 'Temă întunecată'}
                    </DropdownMenuItem>
                    {}
                    {!isGuest && me?.user?.id && (
                      <DropdownMenuItem
                        className="px-4 py-2.5 text-foreground/80 hover:bg-white/10 cursor-pointer rounded-lg mx-1"
                        onSelect={(e) => { e.preventDefault(); setRoleRequestOpen(true); }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Solicită acces
                      </DropdownMenuItem>
                    )}
                    {me?.roles?.some(r => ['admin', 'cmd', 'edit_all_students'].includes(String(r.role))) && !isGuest && (
                      <DropdownMenuItem
                        className="px-4 py-2.5 text-foreground/80 hover:bg-white/10 cursor-pointer rounded-lg mx-1"
                        onSelect={(e) => { e.preventDefault(); window.location.href = institutionSlug ? `/${institutionSlug}/admin` : '/admin'; }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Administrare
                        {pendingCount > 0 && (
                          <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">{pendingCount}</span>
                        )}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      className="px-4 py-2.5 text-foreground/80 hover:bg-white/10 cursor-pointer rounded-lg mx-1"
                      onSelect={(e) => { e.preventDefault(); signOut(); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Deconectare
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden liquid-glass-button !p-2.5 !rounded-full aspect-square flex items-center justify-center"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {}
          <div className={cn(
            "md:hidden mt-2 overflow-hidden transition-all duration-500",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="liquid-glass-card p-4 space-y-2">
              {allNavItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive(item.to)
                      ? "bg-white/15 text-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 space-y-2">
                {}
                {isAdmin && pendingCount > 0 && (
                  <Link
                    to={institutionSlug ? `/${institutionSlug}/admin` : '/admin'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-foreground/70 hover:text-foreground hover:bg-white/5"
                  >
                    <Bell className="w-4 h-4" />
                    Cereri de acces
                    <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">{pendingCount}</span>
                  </Link>
                )}
                {}
                {!isGuest && me?.user?.id && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setRoleRequestOpen(true); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-foreground/70 hover:text-foreground hover:bg-white/5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Solicită acces
                  </button>
                )}
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-foreground/70 hover:text-foreground hover:bg-white/5"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Mod Luminos' : 'Mod Întunecat'}
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-foreground/70 hover:text-red-500 hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  {isGuest ? 'Ieși din demo' : 'Deconectare'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {}
      <main className="flex-1 pt-28 relative z-10">{children}</main>

      {}
      <OfflineIndicator />

      {}
      <LiquidFooter />

      {}
      {!isGuest && (
        <RoleRequestDialog
          open={roleRequestOpen}
          onOpenChange={(open) => {
            setRoleRequestOpen(open);
            if (!open && hasNoRoles) {
              try { localStorage.setItem('role_request_auto_dismissed', '1'); } catch { }
            }
          }}
          existingRequests={myRequests}
          onSubmitted={() => {
            fetchRoleData();
            try { localStorage.removeItem('role_request_auto_dismissed'); } catch { }
          }}
        />
      )}
    </div>
  );
}
