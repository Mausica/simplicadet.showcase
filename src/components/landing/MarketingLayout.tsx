import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { IconAuthButtons } from '@/components/IconAuthButtons';
import { getMe, isGuestSession, signOut } from '@/lib/auth';
import CamoBackground from './CamoBackground';

type PageName = 'Home' | 'Despre' | 'Preturi' | 'Resurse' | string;

const navItems = [
  { key: 'Home', label: 'Prezentare', to: '/' },
  { key: 'Despre', label: 'Despre', to: '/about' },
  { key: 'Preturi', label: 'Prețuri', to: '/pricing' },
  { key: 'Resurse', label: 'Resurse', to: '/resources' },
] as const;

export default function MarketingLayout({
  children,
  currentPageName,
}: {
  children: React.ReactNode;
  currentPageName: PageName;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const guest = isGuestSession();
      setIsGuest(guest);
      if (guest) {
        setIsLoggedIn(true);
        return;
      }
      const me = await getMe();
      setIsLoggedIn(!!me?.user?.email);
    })();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col relative">
      <CamoBackground />

      {}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur-2xl border border-olive-300/60 dark:border-olive-800/40 shadow-xl shadow-olive-900/8 dark:shadow-black/30">
            <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
              {}
              <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="relative w-9 h-9 rounded-xl bg-olive-800 dark:bg-olive-200 flex items-center justify-center overflow-hidden shadow-lg shadow-olive-900/20 dark:shadow-olive-200/10">
                  <span className="text-white dark:text-olive-900 font-bold text-lg tracking-tight">S</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                </div>
                <span className="hidden sm:block text-sm font-semibold text-olive-800 dark:text-olive-200 tracking-tight">
                  Simplicadet
                </span>
              </Link>

              {}
              <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-0.5 p-1 rounded-xl bg-olive-100 dark:bg-olive-900/50 border border-olive-200/60 dark:border-olive-700/30">
                  {navItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPageName === item.key
                          ? 'text-white dark:text-olive-900'
                          : 'text-olive-700 dark:text-olive-300 hover:text-olive-900 dark:hover:text-white'
                      }`}
                    >
                      {currentPageName === item.key && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-olive-800 dark:bg-olive-300 rounded-lg shadow-lg"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {}
              <div className="flex items-center gap-2 shrink-0">
                {}
                {isLoggedIn && (
                  <Link
                    to="/attendance"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200"
                    aria-label="Intră în aplicație"
                  >
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </Link>
                )}

                {}
                {!isLoggedIn ? (
                  <>
                    <IconAuthButtons 
                      callbackUrl="/attendance" 
                      showLogout={false}
                    />
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                    </button>
                  </>
                ) : (
                  <>
                    {}
                    {isGuest ? (
                      <button
                        onClick={() => signOut()}
                        className="h-9 px-3 rounded-xl flex items-center gap-2 text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200 group"
                        title="Ieși din modul demo"
                      >
                         <span className="relative flex h-2.5 w-2.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                         </span>
                         <LogOut className="w-4 h-4 ml-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      <button
                        onClick={() => signOut()}
                        className="h-9 px-3 rounded-xl flex items-center gap-2 text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200 group"
                        title="Deconectare"
                      >
                         <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              Cont
                            </span>
                         </div>
                         <div className="flex items-center justify-center w-5 h-5 rounded-full bg-olive-100 dark:bg-olive-800/50 border border-olive-200/50 dark:border-olive-700/50">
                            <ArrowRight className="w-3 h-3 text-olive-600 dark:text-olive-400" />
                         </div>
                      </button>
                    )}

                    {}
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-olive-600 dark:text-olive-400 hover:text-olive-800 dark:hover:text-olive-200 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                    </button>
                  </>
                )}

                {}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-olive-600 dark:text-olive-400 hover:bg-olive-100 dark:hover:bg-olive-800/50 transition-all duration-200"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="md:hidden border-t border-olive-200/50 dark:border-olive-700/30 overflow-hidden"
                >
                  <nav className="px-4 py-3 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-2.5 px-3 rounded-lg font-medium text-sm transition-colors duration-200 ${
                          currentPageName === item.key
                            ? 'bg-olive-100 dark:bg-olive-800 text-olive-900 dark:text-white'
                            : 'text-olive-600 dark:text-olive-400 hover:bg-olive-50 dark:hover:bg-olive-800/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {}
                    <div className="pt-3 mt-3 border-t border-olive-200/50 dark:border-olive-700/30 space-y-3">
                      
                      {}
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-olive-600 dark:text-olive-400 hover:bg-olive-50 dark:hover:bg-olive-800/50 transition-colors"
                      >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="text-sm font-medium">
                          {theme === 'dark' ? 'Mod Luminos' : 'Mod Întunecat'}
                        </span>
                      </button>

                      {}
                      <div className="pt-2">
                        {isLoggedIn ? (
                          isGuest ? (
                            
                            <div className="flex items-center justify-between p-3 rounded-xl bg-olive-50/50 dark:bg-olive-800/30 border border-olive-100 dark:border-olive-700/30">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <span className="relative flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-semibold text-olive-900 dark:text-olive-100">Cont Demo</span>
                                   <span className="text-[10px] text-olive-500 dark:text-olive-400">Vizitator</span>
                                </div>
                              </div>
                              <button
                                onClick={() => signOut()}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-olive-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-white/5 transition-all"
                                title="Ieși din demo"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            
                           <div className="flex items-center justify-between p-3 rounded-xl bg-olive-50/50 dark:bg-olive-800/30 border border-olive-100 dark:border-olive-700/30">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-300">
                                   <User className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-semibold text-olive-900 dark:text-olive-100">Cont Utilizator</span>
                                   <span className="text-[10px] text-olive-500 dark:text-olive-400">Autentificat</span>
                                </div>
                              </div>
                              <button
                                onClick={() => signOut()}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-olive-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-white/5 transition-all"
                              >
                                <LogOut className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        ) : (
                           <Link
                            to="/attendance"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full py-3 rounded-xl bg-olive-800 dark:bg-olive-200 text-white dark:text-olive-900 font-bold text-sm flex items-center justify-center shadow-lg shadow-olive-900/10 active:scale-95 transition-transform"
                          >
                            Intră în aplicație
                          </Link>
                        )}
                      </div>
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 pt-28">{children}</main>

      {}
      <footer className="relative z-10 px-4 pb-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/70 backdrop-blur-2xl border border-olive-300/60 dark:border-olive-700/40 shadow-xl shadow-olive-900/8 dark:shadow-black/30">
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-olive-800 dark:bg-olive-200 flex items-center justify-center shadow-md shadow-olive-900/20">
                    <span className="text-white dark:text-olive-900 font-bold text-xs">S</span>
                  </div>
                  <span className="text-sm font-medium text-olive-700 dark:text-olive-400">
                    Simplicadet
                  </span>
                </div>

                {}
                <p className="text-xs text-olive-600 dark:text-olive-500 text-center">
                  Platforma educațională pentru instituții militare
                </p>

                {}
                <div className="flex items-center gap-3 text-[10px] font-mono text-olive-500 dark:text-olive-600 tracking-wider">
                  <span>44°26'N</span>
                  <span className="w-1 h-1 rounded-full bg-olive-400 dark:bg-olive-700" />
                  <span>26°06'E</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
