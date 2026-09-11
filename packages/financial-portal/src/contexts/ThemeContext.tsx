import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type DarkMode = 'light' | 'dark';

export interface ColorTheme {
  id: string;
  name: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  surface: string;
  surfaceHover: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'navy-gold',
    name: 'Navy & Gold',
    accent: '#d4a574',
    accentHover: '#c8a87c',
    accentText: '#d4a574',
    accentBorder: 'rgba(212, 165, 116, 0.3)',
    accentBg: 'rgba(212, 165, 116, 0.15)',
    surface: '#1f2a38',
    surfaceHover: '#2e3f54',
  },
  {
    id: 'emerald-silver',
    name: 'Emerald & Silver',
    accent: '#34d399',
    accentHover: '#10b981',
    accentText: '#34d399',
    accentBorder: 'rgba(52, 211, 153, 0.3)',
    accentBg: 'rgba(52, 211, 153, 0.15)',
    surface: '#0f2922',
    surfaceHover: '#163d32',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    accent: '#c084fc',
    accentHover: '#a855f7',
    accentText: '#c084fc',
    accentBorder: 'rgba(192, 132, 252, 0.3)',
    accentBg: 'rgba(192, 132, 252, 0.15)',
    surface: '#1e1533',
    surfaceHover: '#2d2047',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    accent: '#38bdf8',
    accentHover: '#0ea5e9',
    accentText: '#38bdf8',
    accentBorder: 'rgba(56, 189, 248, 0.3)',
    accentBg: 'rgba(56, 189, 248, 0.15)',
    surface: '#0c1929',
    surfaceHover: '#132740',
  },
  {
    id: 'crimson-gold',
    name: 'Crimson & Gold',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentText: '#f59e0b',
    accentBorder: 'rgba(245, 158, 11, 0.3)',
    accentBg: 'rgba(245, 158, 11, 0.15)',
    surface: '#1c1017',
    surfaceHover: '#2d1a26',
  },
  {
    id: 'slate-steel',
    name: 'Monochrome',
    accent: '#94a3b8',
    accentHover: '#64748b',
    accentText: '#94a3b8',
    accentBorder: 'rgba(148, 163, 184, 0.3)',
    accentBg: 'rgba(148, 163, 184, 0.15)',
    surface: '#1a1f2e',
    surfaceHover: '#252b3b',
  },
];

interface ThemeContextType {
  darkMode: DarkMode;
  toggleDarkMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  allThemes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: 'dark',
  toggleDarkMode: () => {},
  colorTheme: COLOR_THEMES[0],
  setColorTheme: () => {},
  allThemes: COLOR_THEMES,
});

function applyColorTheme(theme: ColorTheme) {
  const root = document.documentElement;
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-hover', theme.accentHover);
  root.style.setProperty('--accent-text', theme.accentText);
  root.style.setProperty('--accent-border', theme.accentBorder);
  root.style.setProperty('--accent-bg', theme.accentBg);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-hover', theme.surfaceHover);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<DarkMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('colorTheme');
      if (stored) {
        const found = COLOR_THEMES.find((t) => t.id === stored);
        if (found) return found;
      }
    }
    return COLOR_THEMES[0];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode);
  }, [darkMode]);

  useEffect(() => {
    applyColorTheme(colorTheme);
    localStorage.setItem('colorTheme', colorTheme.id);
  }, [colorTheme]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, colorTheme, setColorTheme, allThemes: COLOR_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
