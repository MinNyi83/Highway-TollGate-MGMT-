import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'my';

const translations = {
  en: {
    home: 'Home',
    history: 'History',
    violations: 'Violations',
    account: 'Account',
    settings: 'Settings',
    balance: 'Balance',
    vehicles: 'Vehicles',
    trips: 'Trips',
    recentEvents: 'Recent Toll Events',
    vehicle: 'Vehicle',
    plaza: 'Plaza',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    type: 'Type',
    fine: 'Fine',
    topUp: 'Top Up',
    topUpHistory: 'History',
    paymentMethod: 'Payment Method',
    enterAmount: 'Enter Amount',
    signOut: 'Sign Out',
    welcomeBack: 'Welcome back!',
    noData: 'No data',
    loading: 'Loading...',
    completed: 'COMPLETED',
    pending: 'PENDING',
    paid: 'PAID',
    unpaid: 'UNPAID',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    language: 'Language',
    tollHistory: 'Toll History',
    registeredVehicles: 'Registered Vehicles',
    accountTopUp: 'Account & Top-Up',
    availableBalance: 'Available Balance',
    manualTopUp: 'Manual',
    scanQR: 'Scan QR to pay',
    ivePaid: "I've Paid",
    back: 'Back',
    processing: 'Processing...',
    noEvents: 'No toll events yet',
    noViolations: 'No violations - all clear!',
    noTopUpHistory: 'No top-up history yet',
    allClear: 'all clear',
    customerPortal: 'Customer Portal',
    about: 'About',
    appVersion: 'TollGate Customer Portal v1.0',
    systemDesc: 'Highway Tollgate Management System',
  },
  my: {
    home: 'ပင်မ',
    history: 'မှတ်တမ်း',
    violations: 'စည်းကမ်းချိုးဖောက်မှု',
    account: 'အကောင့်',
    settings: 'ဆက်တင်',
    balance: 'ငွေလက်ကျန်',
    vehicles: 'ယာဉ်',
    trips: 'ခရီးစဉ်',
    recentEvents: 'နောက်ဆုံး တံတားခွန်ဖြစ်စဉ်',
    vehicle: 'ယာဉ်',
    plaza: 'တံတား',
    amount: 'ပမာဏ',
    status: 'အခြေအနေ',
    date: 'ရက်စွဲ',
    type: 'အမျိုးအစား',
    fine: 'ဒဏ်ကြေး',
    topUp: 'ငွေဖြည့်ရန်',
    topUpHistory: 'မှတ်တမ်း',
    paymentMethod: 'ငွေပေးချေနည်း',
    enterAmount: 'ပမာဏထည့်ပါ',
    signOut: 'ထွက်ရန်',
    welcomeBack: 'ပြန်လည်ကြိုဆိုပါ၏!',
    noData: 'ဒေတာမရှိပါ',
    loading: 'ဖွင့်နေသည်...',
    completed: 'ပြီးမြောက်သည်',
    pending: 'ဆိုင်းငံ့နေသည်',
    paid: 'ပေးပြီး',
    unpaid: 'မပေးရသေး',
    changePassword: 'စကားဝှက်ပြောင်းရန်',
    currentPassword: 'လက်ရှိစကားဝှက်',
    newPassword: 'အသစ်စကားဝှက်',
    confirmPassword: 'စကားဝှက်အတည်ပြု',
    language: 'ဘာသာစကား',
    tollHistory: 'တံတားခွန်မှတ်တမ်း',
    registeredVaters: 'မှတ်ပုံတင်ထားသောယာဉ်',
    accountTopUp: 'အကောင့်နှင့်ငွေဖြည့်',
    availableBalance: 'ရရှိနိုင်သောငွေလက်ကျန်',
    manualTopUp: 'စာရွက်ဖြင့်',
    scanQR: 'QR စကင်ဖတ်ပါ',
    ivePaid: 'ပေးပြီးပါပြီ',
    back: 'နောက်သို့',
    processing: 'လုပ်ဆောင်နေသည်...',
    noEvents: 'တံတားခွန်ဖြစ်စဉ်မရှိသေးပါ',
    noViolations: 'စည်းကမ်းချိုးဖောက်မှုမရှိပါ - ကောင်းပါသည်!',
    noTopUpHistory: 'ငွေဖြည့်မှတ်တမ်းမရှိသေးပါ',
    allClear: 'ကောင်းပါသည်',
    customerPortal: 'ဖောက်သည်ပေါ်တယ်',
    about: 'အကြောင်းအရာ',
    appVersion: 'TollGate ဖောက်သည်ပေါ်တယ် v1.0',
    systemDesc: 'အဆင့်မြင့်တံတားစီမံခန့်ခွဲမှုစနစ်',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
