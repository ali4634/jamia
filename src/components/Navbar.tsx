import React from 'react';
import { Plus, Settings, TrendingUp, TrendingDown, ShieldCheck, ShieldAlert, Cloud, Lock } from 'lucide-react';
import { MadrasaSettings } from '../types/maliyat';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'dashboard' | 'income' | 'expenses' | 'staff' | 'roznamcha' | 'reports';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewTransaction: (type?: 'income' | 'expense') => void;
  onOpenSettings: (tab?: 'settings' | 'backup' | 'security') => void;
  onOpenDailyBackup?: () => void;
  onLockApp?: () => void;
  settings: MadrasaSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewTransaction,
  onOpenSettings,
  onOpenDailyBackup,
  onLockApp,
  settings,
}) => {
  const lastBackupIso = settings.backupConfig?.lastBackupTimestamp;
  const isBackedUpToday = (() => {
    if (!lastBackupIso) return false;
    const lastDate = lastBackupIso.split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return lastDate === today;
  })();
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="font-nastaliq text-xl">ق</span>
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap font-nastaliq block leading-tight">
                {settings.madrasaName || 'جامعہ انوارالقرآن پیرپیائی نوشہرہ'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-amber-900 font-bold block leading-tight font-nastaliq">
                {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line unboxed text with hover / active indicators) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              خلاصہ مالیات (ڈیش بورڈ)
            </button>
            <button
              onClick={() => onTabChange('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'income'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              آمدن و رسیدات
            </button>
            <button
              onClick={() => onTabChange('expenses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'expenses'
                  ? 'bg-rose-50 text-rose-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              اخراجات و واؤچرز
            </button>
            <button
              onClick={() => onTabChange('staff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              تنخواہ رجسٹر
            </button>
            <button
              onClick={() => onTabChange('roznamcha')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'roznamcha'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              روزنامچہ (کیش بک)
            </button>
            <button
              onClick={() => onTabChange('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              مالی گوشوارے و رپورٹس
            </button>
          </nav>

          {/* Zone 3: Actions (PWA install, Quick Add, Data Safety & Settings) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Data Safety & Backup Indicator */}
            <button
              onClick={() => {
                if (onOpenDailyBackup) onOpenDailyBackup();
                else onOpenSettings('backup');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                isBackedUpToday
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
              title={
                isBackedUpToday
                  ? `ماشاء اللہ، آج کا بیک اپ محفوظ شدہ ہے (${lastBackupIso?.split('T')[0]})۔ کلک کر کے نیا بیک اپ لیں۔`
                  : 'آج کا بیک اپ ابھی باقی ہے! کلک کر کے محفوظ فرما لیں۔'
              }
            >
              {isBackedUpToday ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden lg:inline text-[11px] font-semibold">ڈیٹا محفوظ ہے</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-[11px] font-bold">یومیہ بیک اپ</span>
                </>
              )}
            </button>

            <PWAInstallButton />

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => onOpenNewTransaction('income')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition shadow-xs cursor-pointer"
                title="نئی آمدن / عطیہ درج کریں"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>آمدن رسید</span>
              </button>

              <button
                onClick={() => onOpenNewTransaction('expense')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition shadow-xs cursor-pointer"
                title="نیا خرچ / واؤچر درج کریں"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>خرچ واؤچر</span>
              </button>
            </div>

            {onLockApp && (
              <button
                onClick={onLockApp}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition cursor-pointer"
                title="سسٹم لاک کریں (پاس ورڈ سیکیورٹی)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">لاک کریں</span>
              </button>
            )}

            <button
              onClick={() => onOpenSettings('backup')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-200"
              title="ڈیٹا بیک اپ و ترتیبات (JSON Export/Import)"
            >
              <span className="hidden sm:inline">ترتیبات</span>
              <Settings className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Mobile Submenu Tabs */}
        <div className="md:hidden flex overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            ڈیش بورڈ
          </button>
          <button
            onClick={() => onTabChange('income')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'income' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            آمدن
          </button>
          <button
            onClick={() => onTabChange('expenses')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'expenses' ? 'bg-rose-700 text-white' : 'text-slate-600'
            }`}
          >
            اخراجات
          </button>
          <button
            onClick={() => onTabChange('staff')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'staff' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            تنخواہیں
          </button>
          <button
            onClick={() => onTabChange('roznamcha')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'roznamcha' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            روزنامچہ
          </button>
          <button
            onClick={() => onTabChange('reports')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            رپورٹس
          </button>
        </div>
      </div>
    </header>
  );
};
