import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

export default function ThemePicker() {
  const { colorTheme, setColorTheme, allThemes } = useThemeContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-slate-500 dark:text-slate-400 hover:text-[var(--accent)] rounded-lg transition-colors"
        title="Color Theme"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-navy-800 border border-slate-200/60 dark:border-navy-600/30 rounded-xl shadow-glass overflow-hidden z-50 animate-scale-in">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-700/50">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Color Theme</p>
          </div>
          <div className="p-2 space-y-0.5">
            {allThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => { setColorTheme(theme); setOpen(false); }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all ${
                  colorTheme.id === theme.id
                    ? 'bg-[var(--accent-bg)] text-[var(--accent-text)]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: theme.accent, backgroundColor: theme.accentBg }}
                >
                  {colorTheme.id === theme.id && (
                    <Check size={12} style={{ color: theme.accent }} />
                  )}
                </div>
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
