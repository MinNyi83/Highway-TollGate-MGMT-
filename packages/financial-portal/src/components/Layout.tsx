import { useState, useEffect, useCallback, ReactNode } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import FloatingRail from './FloatingRail';
import Watermark from './Watermark';
import LanguageToggle from './LanguageToggle';
import { useAuthStore } from '../stores/authStore';
import { useLanguage } from '../i18n';
import {
  LayoutDashboard, FileText, DollarSign, Wallet, Car, Route,
  Building2, ClipboardCheck, Receipt, Calendar, Shield, BarChart3,
  MapPin, AlertTriangle, TrendingUp, Grid, Search, GitBranch,
  CreditCard, Star, FileBarChart, Target, PieChart, Share2,
  Landmark, Banknote, Activity, Building, Sun, Moon, Command, LogOut, Menu, X,
} from 'lucide-react';

const mobileTabItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/revenue-by-region', icon: DollarSign, label: 'Revenue' },
  { to: '/daily-collection', icon: FileText, label: 'Daily' },
  { to: '/settlement', icon: Building2, label: 'Settle' },
];

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Financial Dashboard', labelMyanmar: 'ဘဏ္ဍာရေး ဒေသခွဲ', category: 'Dashboard' },
  { to: '/daily-collection', icon: FileText, label: 'Daily Collection', labelMyanmar: 'နေ့စဉ်ကောက်ခံမှု', category: 'Reports' },
  { to: '/revenue-by-region', icon: DollarSign, label: 'Revenue by Region', labelMyanmar: 'ဒေသအလိုက် ဝင်ငွေ', category: 'Revenue' },
  { to: '/topup-by-region', icon: Wallet, label: 'Wallet Deposits', labelMyanmar: 'ပိုက်ဆံအိတ် ဖြည့်သွင်းငွေ', category: 'Revenue' },
  { to: '/vehicle-by-region', icon: Car, label: 'Vehicle Registration', labelMyanmar: 'ယာဉ်မှတ်ပုံတင်', category: 'Revenue' },
  { to: '/toll-usage', icon: Route, label: 'Pass-Through Volume', labelMyanmar: 'ဖြတ်သန်းမှု ပမာဏ', category: 'Revenue' },
  { to: '/settlement', icon: Building2, label: 'Revenue Remittance', labelMyanmar: 'ဘဏ္ဌာသို့ လွှဲပြောင်းမှု', category: 'Settlement' },
  { to: '/reconciliation', icon: ClipboardCheck, label: 'Financial Reconciliation', labelMyanmar: 'ဘဏ္ဍာရေးပေါင်းစည်းခြင်း', category: 'Settlement' },
  { to: '/receipts', icon: Receipt, label: 'Official Receipts', labelMyanmar: 'တရားဝင်ပြေစာ', category: 'Settlement' },
  { to: '/fiscal-year', icon: Calendar, label: 'Fiscal Year Report', labelMyanmar: 'ဘဏ္ဍာနှစ် အစီရင်ခံစာ', category: 'Reports' },
  { to: '/comparison', icon: BarChart3, label: 'Comparison Report', labelMyanmar: 'နှိုင်းယှဉ်မှု', category: 'Reports' },
  { to: '/plaza-performance', icon: MapPin, label: 'Plaza Performance', labelMyanmar: 'ဂိတ်ရုံး စွမ်းဆောင်ရည်', category: 'Analytics' },
  { to: '/violations', icon: AlertTriangle, label: 'Violation Analytics', labelMyanmar: 'ဖောက်ဖျက်မှု', category: 'Analytics' },
  { to: '/forecast', icon: TrendingUp, label: 'Revenue Forecast', labelMyanmar: 'ဝင်ငွေ ခန့်မှန်းချက်', category: 'Analytics' },
  { to: '/heatmap', icon: Grid, label: 'Revenue Heatmap', labelMyanmar: 'ဝင်ငွေ မြေပုံ', category: 'Analytics' },
  { to: '/transactions', icon: Search, label: 'Transaction Search', labelMyanmar: 'ငွေပေးချေမှု ရှာဖွေ', category: 'Search' },
  { to: '/settlement-pipeline', icon: GitBranch, label: 'Settlement Pipeline', labelMyanmar: 'ငွေလွှဲ လုပ်ငန်းစဉ်', category: 'Settlement' },
  { to: '/wallet-analytics', icon: Wallet, label: 'Wallet Analytics', labelMyanmar: 'ပိုက်ဆံအိတ် ခွဲခြမ်းစိတ်ဖြာ', category: 'Analytics' },
  { to: '/revenue-by-vehicle', icon: Car, label: 'Revenue by Vehicle', labelMyanmar: 'ယာဉ်အလိုက် ဝင်ငွေ', category: 'Revenue' },
  { to: '/customer-spending', icon: CreditCard, label: 'Customer Spending', labelMyanmar: 'ဖောက်သည် သုံးစွဲမှု', category: 'Analytics' },
  { to: '/revenue-by-payment', icon: CreditCard, label: 'Revenue by Payment', labelMyanmar: 'ငွေပေးချေမှု အလိုက် ဝင်ငွေ', category: 'Revenue' },
  { to: '/loyalty-analytics', icon: Star, label: 'Loyalty Analytics', labelMyanmar: 'သစာရှိမှု', category: 'Analytics' },
  { to: '/reports', icon: FileBarChart, label: 'Financial Reports', labelMyanmar: 'ဘဏ္ဍာရေး အစီရင်ခံစာ', category: 'Reports' },
  { to: '/budget-tracker', icon: Target, label: 'Budget Tracker', labelMyanmar: 'ဘတ်ဂျက် ခြေရာခံ', category: 'Finance' },
  { to: '/cost-allocation', icon: PieChart, label: 'Cost Allocation', labelMyanmar: 'ကုန်ကျစရိတ် ခွဲဝေ', category: 'Finance' },
  { to: '/revenue-sharing', icon: Share2, label: 'Revenue Sharing', labelMyanmar: 'ဝင်ငွေ ခွဲဝေ', category: 'Finance' },
  { to: '/debt-management', icon: Landmark, label: 'Debt Management', labelMyanmar: 'အကြွေး စီမံခန့်ခွဲမှု', category: 'Finance' },
  { to: '/cash-flow', icon: Banknote, label: 'Cash Flow', labelMyanmar: 'ငွေစီးဆင်းမှု', category: 'Finance' },
  { to: '/financial-ratios', icon: Activity, label: 'Financial Ratios', labelMyanmar: 'ဘဏ္ဍာရေး အချိုးအစား', category: 'Finance' },
  { to: '/vendor-payments', icon: Building, label: 'Vendor Payments', labelMyanmar: 'ရောင်းချသူ ပေးချေမှု', category: 'Finance' },
  { to: '/tax-withholding', icon: Receipt, label: 'Tax Withholding', labelMyanmar: 'အခွန်ထိန်း', category: 'Finance' },
  { to: '/audit-log', icon: Shield, label: 'Audit Trail', labelMyanmar: 'စစ်ဆေးမှု မှတ်တမ်း', category: 'Compliance' },
];

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const railItems = allNavItems.map(({ labelMyanmar, ...rest }) => rest);
  const cmdItems = allNavItems.map((item) => ({
    ...item,
    id: item.to,
    path: item.to,
    label: language === 'my' ? item.labelMyanmar : item.label,
  }));

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Watermark />
      <FloatingRail items={railItems} logo="TG" onLogout={handleLogout} />

      <div className="md:ml-24 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-navy-600/30 h-14 flex items-center justify-between px-4 md:px-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-gold-500 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-serif font-semibold text-sm text-gold-500">TollGate</span>
            <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500">Financial System</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-700/50 border border-slate-200/60 dark:border-navy-600/30 text-slate-500 dark:text-slate-400 hover:border-gold-500/30 transition-all text-sm"
            >
              <Command size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-navy-800 rounded border border-slate-200 dark:border-navy-600">⌘K</kbd>
            </button>
            <LanguageToggle />
            <button onClick={() => setDark(!dark)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-gold-500 rounded-lg transition-colors">
              {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-navy-600/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{user?.role || 'VIEWER'}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-crimson-500 rounded-lg transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl overflow-y-auto">
            <nav className="p-4 space-y-1">
              {allNavItems.slice(0, 15).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gold-500/15 text-gold-600 dark:text-gold-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {language === 'my' ? item.labelMyanmar : item.label}
                  </NavLink>
                );
              })}
              <div className="border-t border-slate-200/40 dark:border-navy-600/30 my-3" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-crimson-500 hover:bg-crimson-500/10 w-full transition-all"
              >
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto transition-colors duration-300">
          <div className="animate-fade-in">
            {children || <Outlet />}
          </div>
        </main>

        <footer className="border-t border-slate-200/40 dark:border-navy-600/30 bg-white/30 dark:bg-navy-800/30 backdrop-blur-sm px-6 py-3">
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>© 2026 nyimin. All rights reserved.</span>
            <span className="font-serif text-gold-500">TollGate RFID Pass Financial System v1.0</span>
          </div>
        </footer>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl border-t border-slate-200/40 dark:border-navy-600/30 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-gold-500'
                      : 'text-slate-400 dark:text-slate-500'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <CommandPalette items={cmdItems} isOpen={cmdOpen} onClose={() => setCmdOpen(false)} placeholder={language === 'my' ? 'ရှာဖွေရန်...' : 'Search pages, actions...'} />
    </div>
  );
}
