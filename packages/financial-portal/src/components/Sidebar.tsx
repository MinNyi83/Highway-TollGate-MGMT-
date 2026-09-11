import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Wallet,
  Car,
  Route,
  Building2,
  ClipboardCheck,
  Receipt,
  Calendar,
  Shield,
  BarChart3,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Grid,
  Search,
  GitBranch,
  CreditCard,
  Star,
  FileBarChart,
  Target,
  PieChart,
  Share2,
  Landmark,
  Banknote,
  Activity,
  Building,
} from 'lucide-react';
import { useLanguage } from '../i18n';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Financial Dashboard', labelMyanmar: 'ဘဏ္ဍာရေး ဒေသခွဲ' },
  { to: '/daily-collection', icon: FileText, label: 'Daily Collection Statement', labelMyanmar: 'နေ့စဉ်ကောက်ခံမှု ဖော်ပြချက်' },
  { to: '/revenue-by-region', icon: DollarSign, label: 'Toll Revenue by Region', labelMyanmar: 'ဒေသအလိုက် တံတားခ ဝင်ငွေ' },
  { to: '/topup-by-region', icon: Wallet, label: 'Wallet Deposits by Region', labelMyanmar: 'ဒေသအလိုက် ပိုက်ဆံအိတ် ဖြည့်သွင်းငွေ' },
  { to: '/vehicle-by-region', icon: Car, label: 'Vehicle Registration by Region', labelMyanmar: 'ဒေသအလိုက် ယာဉ်မှတ်ပုံတင်' },
  { to: '/toll-usage', icon: Route, label: 'Pass-Through Volume', labelMyanmar: 'ဖြတ်သန်းမှု ပမာဏ' },
  { to: '/settlement', icon: Building2, label: 'Revenue Remittance', labelMyanmar: 'ဘဏ္ဌာသို့ လွှဲပြောင်းမှု' },
  { to: '/reconciliation', icon: ClipboardCheck, label: 'Financial Reconciliation', labelMyanmar: 'ဘဏ္ဍာရေးပေါင်းစည်းခြင်း' },
  { to: '/receipts', icon: Receipt, label: 'Official Receipts', labelMyanmar: 'တရားဝင်ပြေစာ' },
  { to: '/fiscal-year', icon: Calendar, label: 'Fiscal Year Report', labelMyanmar: 'ဘဏ္ဍာနှစ် အစီရင်ခံစာ' },
  { to: '/comparison', icon: BarChart3, label: 'Comparison Report', labelMyanmar: 'နှိုင်းယှဉ်မှု အစီရင်ခံစာ' },
  { to: '/plaza-performance', icon: MapPin, label: 'Plaza Performance', labelMyanmar: 'ဂိတ်ရုံး စွမ်းဆောင်ရည်' },
  { to: '/violations', icon: AlertTriangle, label: 'Violation Analytics', labelMyanmar: 'ဖောက်ဖျက်မှု ခွဲခြမ်းစိတ်ဖြာ' },
  { to: '/forecast', icon: TrendingUp, label: 'Revenue Forecast', labelMyanmar: 'ဝင်ငွေ ခန့်မှန်းချက်' },
  { to: '/heatmap', icon: Grid, label: 'Revenue Heatmap', labelMyanmar: 'ဝင်ငွေ မြေပုံ' },
  { to: '/transactions', icon: Search, label: 'Transaction Search', labelMyanmar: 'ငွေပေးချေမှု ရှာဖွေ' },
  { to: '/settlement-pipeline', icon: GitBranch, label: 'Settlement Pipeline', labelMyanmar: 'ငွေလွှဲ လုပ်ငန်းစဉ်' },
  { to: '/wallet-analytics', icon: Wallet, label: 'Wallet Analytics', labelMyanmar: 'ပိုက်ဆံအိတ် ခွဲခြမ်းစိတ်ဖြာ' },
  { to: '/revenue-by-vehicle', icon: Car, label: 'Revenue by Vehicle', labelMyanmar: 'ယာဉ်အလိုက် ဝင်ငွေ' },
  { to: '/customer-spending', icon: CreditCard, label: 'Customer Spending', labelMyanmar: 'ဖောက်သည် သုံးစွဲမှု' },
  { to: '/revenue-by-payment', icon: CreditCard, label: 'Revenue by Payment', labelMyanmar: 'ငွေပေးချေမှု အလိုက် ဝင်ငွေ' },
  { to: '/loyalty-analytics', icon: Star, label: 'Loyalty Analytics', labelMyanmar: 'သစာရှိမှု ခွဲခြမ်းစိတ်ဖြာ' },
  { to: '/reports', icon: FileBarChart, label: 'Financial Reports', labelMyanmar: 'ဘဏ္ဍာရေး အစီရင်ခံစာ' },
  { to: '/budget-tracker', icon: Target, label: 'Budget Tracker', labelMyanmar: 'ဘတ်ဂျက် ခြေရာခံ' },
  { to: '/cost-allocation', icon: PieChart, label: 'Cost Allocation', labelMyanmar: 'ကုန်ကျစရိတ် ခွဲဝေ' },
  { to: '/revenue-sharing', icon: Share2, label: 'Revenue Sharing', labelMyanmar: 'ဝင်ငွေ ခွဲဝေ' },
  { to: '/debt-management', icon: Landmark, label: 'Debt Management', labelMyanmar: 'အကြွေး စီမံခန့်ခွဲမှု' },
  { to: '/cash-flow', icon: Banknote, label: 'Cash Flow', labelMyanmar: 'ငွေစီးဆင်းမှု' },
  { to: '/financial-ratios', icon: Activity, label: 'Financial Ratios', labelMyanmar: 'ဘဏ္ဍာရေး အချိုးအစား' },
  { to: '/vendor-payments', icon: Building, label: 'Vendor Payments', labelMyanmar: 'ရောင်းချသူ ပေးချေမှု' },
  { to: '/tax-withholding', icon: Receipt, label: 'Tax Withholding', labelMyanmar: 'အခွန်ထိန်း' },
  { to: '/audit-log', icon: Shield, label: 'Audit Trail', labelMyanmar: 'စစ်ဆေးမှု မှတ်တမ်း' },
];

export default function Sidebar({ collapsed = false }: { collapsed: boolean }) {
  const { language } = useLanguage();

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-navy-900 to-navy-800 border-r border-navy-700/40 min-h-screen transition-all duration-300 flex flex-col`}
    >
      <div className={`${collapsed ? 'p-4' : 'p-5'} transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <span className="text-white font-bold text-sm">TG</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold font-serif text-lg text-white">TollGate</h1>
              <p className="text-xs text-gray-400">ဘဏ္ဍာရေးစနစ်</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-400 border-l-[3px] border-gold-500 pl-3'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              title={collapsed ? (language === 'my' ? item.labelMyanmar : item.label) : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && (
                <span>{language === 'my' ? item.labelMyanmar : item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-navy-700/40 text-xs text-gray-500">
          <p>TollGate RFID Pass v1.0</p>
          <p className="mt-0.5 text-[10px] text-gray-600">Financial System</p>
        </div>
      )}
    </aside>
  );
}
