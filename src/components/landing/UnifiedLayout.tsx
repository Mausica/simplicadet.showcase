import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function UnifiedHeader({ variant = 'marketing' }: { variant?: 'marketing' | 'app' }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navItems = variant === 'marketing' ? [
    { key: 'Home', label: 'Prezentare', to: '/' },
    { key: 'Despre', label: 'Despre', to: '/about' },
    { key: 'Preturi', label: 'Prețuri', to: '/pricing' },
    { key: 'Resurse', label: 'Resurse', to: '/resources' },
  ] : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {}
      <div className="mx-4 mt-4 rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl border border-neutral-200/50 dark:border-neutral-700/40 shadow-lg shadow-neutral-900/5 dark:shadow-black/20">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          {}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center overflow-hidden">
              <span className="text-white dark:text-neutral-900 font-bold text-lg tracking-tight">S</span>
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
              Simplicadet
            </span>
          </Link>

          {}
          {variant === 'marketing' && (
            <nav className="hidden md:flex items-center">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/80">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.to)
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {}
          <div className="flex items-center gap-2">
            {}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function UnifiedFooter() {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="mx-4 mb-4 rounded-2xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-2xl border border-neutral-200/50 dark:border-neutral-700/40 shadow-lg shadow-neutral-900/5 dark:shadow-black/20">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-neutral-900 font-bold text-xs">S</span>
              </div>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Simplicadet
              </span>
            </div>

            {}
            <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center">
              Platforma educațională pentru instituții militare din România
            </p>

            {}
            <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 tracking-wider">
              <span>44°26'N</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span>26°06'E</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default { UnifiedHeader, UnifiedFooter };
