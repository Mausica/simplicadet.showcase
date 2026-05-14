import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { withBase } from "@/lib/base-url";
import { GlassButton } from "./GlassButton";
import { Menu, X, Moon, Sun, LogOut, LogIn, User } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { IconAuthButtons } from "@/components/IconAuthButtons";
import { getMe, isGuestSession, signOut, signInWithGoogle, loginAsGuest } from "@/lib/auth";
import { useTheme } from "next-themes";
import { getInstitutionBySlug } from "@/data/institutions";

interface LiquidNavigationProps {
  onLogin?: () => void;
  immersive?: boolean;
}

const LiquidNavigation = ({ onLogin, immersive = false }: LiquidNavigationProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const isThemeDark = resolvedTheme === 'dark';

  const [scrolled, setScrolled] = useState(false);
  const forceDark = immersive && !scrolled;
  const isDark = forceDark || isThemeDark;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isGuestSession()) {
        setUser({ displayName: 'Oaspete', isGuest: true });
      } else {
        const data = await getMe();
        if (data?.user) setUser(data.user);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 700);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSlug = pathParts.length > 0 ? pathParts[0] : '';
  const currentInstitution = currentSlug ? getInstitutionBySlug(currentSlug) : undefined;

  const navItems = useMemo(() => {
    if (currentInstitution && user) {
      return [
        { path: `/${currentInstitution.slug}`, label: currentInstitution.shortName },
        { path: `/${currentInstitution.slug}/attendance`, label: "Prezență" },
        { path: `/${currentInstitution.slug}/documents`, label: "Documente" },
        { path: `/${currentInstitution.slug}/services`, label: "Servicii" },
      ];
    }
    return [
      { path: "/", label: "Acasă" },
      { path: "/about", label: "Despre" },
      { path: "/pricing", label: "Prețuri" },
      { path: "/resources", label: "Resurse" },
    ];
  }, [currentInstitution, user]);

  const isActive = (path: string) => {
    if (path === location.pathname) return true;
    return false;
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-700 ease-in-out",
        forceDark && "dark"
      )}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}
    >
      <div className="max-w-7xl mx-auto" ref={menuRef}>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-700 ease-in-out rounded-full",
            !forceDark && "liquid-glass-nav",
            forceDark ? "bg-white/[0.08] border border-white/15 backdrop-blur-xl" : "",

            "px-4 py-2"
          )}
        >
          {}
          <Link to="/" className="flex items-center gap-3 group ml-2">
            {}
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive(item.path)
                    ? "bg-white/15 text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {}
          <div className="flex items-center gap-2">
            {}
            {user ? (
              <>
                {}
                <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full">
                  {isGuestSession() ? (
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
                <GlassButton
                  variant="icon"
                  size="sm"
                  onClick={() => setTheme(isThemeDark ? "light" : "dark")}
                  className={cn(
                    "hidden sm:flex",
                    forceDark && "!bg-white/[0.08] !border-white/10 !text-white hover:!bg-white/20"
                  )}
                >
                  {isThemeDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </GlassButton>

                {}
                <GlassButton
                  variant="icon"
                  size="sm"
                  onClick={() => signOut()}
                  className={cn(
                    "hidden sm:flex group",
                    forceDark && "!bg-white/[0.08] !border-white/10 !text-white hover:!bg-white/20"
                  )}
                  title={isGuestSession() ? "Ieși din modul demo" : "Deconectare"}
                >
                  <LogOut className="w-4 h-4 text-foreground/70 group-hover:text-red-500 transition-colors" />
                </GlassButton>
              </>
            ) : (
              <>
                {}
                <div className="hidden sm:block">
                  <IconAuthButtons
                    showLogout={false}
                    user={user}
                    className={forceDark ? "immersive-auth-btn" : ""}
                  />
                </div>

                <GlassButton
                  variant="icon"
                  size="sm"
                  onClick={() => setTheme(isThemeDark ? "light" : "dark")}
                  className={cn(
                    "hidden sm:flex",
                    forceDark && "!bg-white/[0.08] !border-white/10 !text-white hover:!bg-white/20"
                  )}
                >
                  {isThemeDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </GlassButton>
              </>
            )}

            <GlassButton
              variant="icon"
              size="sm"
              className={cn(
                "md:hidden",
                forceDark && "!bg-white/[0.08] !border-white/10 !text-white hover:!bg-white/20"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </GlassButton>
          </div>
        </div>

        {}
        <div
          className={cn(
            "md:hidden mt-2 overflow-hidden transition-all duration-500",
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={cn(
            "p-4 space-y-2",
            !forceDark && "liquid-glass-card",
            forceDark && "bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-3xl"
          )}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(item.path)
                    ? "bg-white/15 text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/5",
                  forceDark && "text-white hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className={cn(
              "pt-2 border-t space-y-2",
              forceDark ? "border-white/10" : "border-white/10"
            )}>
              {user && (
                <div className="flex items-center gap-3 px-4 py-2">
                  {isGuestSession() ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  ) : (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600 dark:bg-violet-400 shadow-sm shadow-violet-500/30" />
                    </span>
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    forceDark ? "text-white/60" : "text-foreground/50"
                  )}>
                    {isGuestSession() ? 'Mod Demo' : 'Conectat'}
                  </span>
                </div>
              )}
              <button
                onClick={() => setTheme(isThemeDark ? "light" : "dark")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full",
                  forceDark
                    ? "text-white hover:bg-white/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                )}
              >
                {isThemeDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isThemeDark ? "Mod Luminos" : "Mod Întunecat"}
              </button>
              {user ? (
                <button
                  onClick={() => { setIsOpen(false); signOut(); }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full",
                    forceDark
                      ? "text-white hover:bg-white/10"
                      : "text-foreground/70 hover:text-red-500 hover:bg-white/5"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  {user?.isGuest ? 'Ieși din demo' : 'Deconectare'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setIsOpen(false); signInWithGoogle(location.pathname || '/', 'redirect'); }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full",
                      forceDark
                        ? "text-white hover:bg-white/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <LogIn className="w-4 h-4" />
                    Conectare cu Google
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); loginAsGuest(); window.location.href = '/attendance'; }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full",
                      forceDark
                        ? "text-white hover:bg-white/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <User className="w-4 h-4" />
                    Mod Vizitator
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LiquidNavigation;
