import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Printer,
  ChevronRight,
  ChevronLeft,
  FileCheck2,
  ListOrdered,
  FileDown,
  ShieldCheck,
  Building2,
  Wallet,
  TrendingUp,
  TrendingDown,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { MadrasaSettings, Transaction } from '../types/maliyat';
import { storage } from '../services/storage';
import { formatCurrencyPKR, numberToWordsUrdu } from '../utils/numberToWordsUrdu';

interface RoznamchaViewProps {
  transactions: Transaction[];
  settings: MadrasaSettings;
  onTriggerDailyBackup?: () => void;
}

export const RoznamchaView: React.FC<RoznamchaViewProps> = ({
  transactions,
  settings,
  onTriggerDailyBackup,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily_summary' | 'detailed_ledger'>('daily_summary');
  const [closingSuccessMsg, setClosingSuccessMsg] = useState<string | null>(null);

  // Navigate date
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Day of week in Urdu
  const urduDays = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
  const dayName = urduDays[new Date(selectedDate).getDay()] || '';

  // Opening balance calculation (all transactions before selectedDate)
  const openingIncome = transactions
    .filter((t) => t.type === 'income' && t.date < selectedDate)
    .reduce((sum, t) => sum + t.amount, 0);

  const openingExpense = transactions
    .filter((t) => t.type === 'expense' && t.date < selectedDate)
    .reduce((sum, t) => sum + t.amount, 0);

  const openingBalance = openingIncome - openingExpense;

  // Day transactions
  const dayIncomeList = transactions.filter(
    (t) => t.type === 'income' && t.date === selectedDate
  );
  const dayExpenseList = transactions.filter(
    (t) => t.type === 'expense' && t.date === selectedDate
  );

  const todayIncome = dayIncomeList.reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = dayExpenseList.reduce((sum, t) => sum + t.amount, 0);
  const todayNetCashFlow = todayIncome - todayExpense;

  const closingBalance = openingBalance + todayIncome - todayExpense;

  // Breakdown by category for the daily summary
  const dayIncomeByCategory = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();
    dayIncomeList.forEach((t) => {
      const prev = map.get(t.category) || { amount: 0, count: 0 };
      map.set(t.category, { amount: prev.amount + t.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([category, val]) => ({
      category,
      amount: val.amount,
      count: val.count,
    }));
  }, [dayIncomeList]);

  const dayExpenseByCategory = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();
    dayExpenseList.forEach((t) => {
      const prev = map.get(t.category) || { amount: 0, count: 0 };
      map.set(t.category, { amount: prev.amount + t.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([category, val]) => ({
      category,
      amount: val.amount,
      count: val.count,
    }));
  }, [dayExpenseList]);

  // Fund-wise breakdowns for today
  const dayZakatIncome = dayIncomeList
    .filter((t) => t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);
  const dayZakatExpense = dayExpenseList
    .filter((t) => t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);

  const dayGeneralIncome = dayIncomeList
    .filter((t) => t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);
  const dayGeneralExpense = dayExpenseList
    .filter((t) => t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrint = (mode: 'daily_summary' | 'detailed_ledger') => {
    setViewMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Date Selector & Mode Toolbar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 no-print shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-800" />
            <span>روزنامچہ و یومیہ مالی خلاصہ (Daily Cash Book)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            منتخب تاریخ کی آمدن، اخراجات، سابقہ و حتمی اختتامی بیلنس کا باضابطہ خلاصہ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day Navigation */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-white rounded text-slate-700 transition cursor-pointer"
              title="پچھلا دن"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="px-2 text-center">
              <span className="text-[11px] text-slate-500 block font-semibold">{dayName}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-slate-900 border-none focus:outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={handleNextDay}
              className="p-1.5 hover:bg-white rounded text-slate-700 transition cursor-pointer"
              title="اگلا دن"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('daily_summary')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'daily_summary'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>یومیہ خلاصہ (Daily Summary)</span>
            </button>
            <button
              onClick={() => setViewMode('detailed_ledger')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'detailed_ledger'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-slate-600" />
              <span>تفصیلی کیش بک (Detailed)</span>
            </button>
          </div>

          {/* Daily Closing & Backup Download Button */}
          <button
            onClick={() => {
              try {
                const fname = storage.downloadBackupFile();
                setClosingSuccessMsg(`آج کا یومیہ کیش بک بیک اپ (${fname}) کامیابی سے ڈاؤن لوڈ ہو گیا۔`);
                if (onTriggerDailyBackup) onTriggerDailyBackup();
                setTimeout(() => setClosingSuccessMsg(null), 6000);
              } catch (e) {
                console.error(e);
                alert('بیک اپ فائل تیار کرنے میں دشواری پیش آئی۔');
              }
            }}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="آج کا کام ختم کرتے ہوئے تمام ڈیٹا کی روزانہ بیک اپ فائل ڈاؤن لوڈ کریں"
          >
            <Download className="w-4 h-4" />
            <span>اختتامِ کیش بک مع بیک اپ</span>
          </button>

          {/* Print / PDF Trigger Button */}
          <button
            onClick={() => handlePrint(viewMode)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="منتخب صفحہ کو پرنٹر یا PDF کے طور پر محفوظ کریں"
          >
            <Printer className="w-4 h-4" />
            <span>
              {viewMode === 'daily_summary' ? 'یومیہ خلاصہ پرنٹ / PDF' : 'کیش بک پرنٹ کریں'}
            </span>
          </button>
        </div>
      </div>

      {closingSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-emerald-900 text-xs font-medium flex items-center gap-2 no-print shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{closingSuccessMsg}</span>
        </div>
      )}

      {/* Summary KPI Strip (Screen View) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500">سابقہ بقایا (Opening Balance)</p>
          <p className="text-lg font-bold font-mono tabular-nums text-slate-800">
            {formatCurrencyPKR(openingBalance)} {settings.currency}
          </p>
          <span className="text-[11px] text-slate-400">گزشتہ تاریخ کا اختتامی میزان</span>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <p className="text-xs text-emerald-800 font-semibold">آمدن آج ({dayIncomeList.length} رسیدات)</p>
          <p className="text-lg font-bold font-mono tabular-nums text-emerald-900">
            +{formatCurrencyPKR(todayIncome)} {settings.currency}
          </p>
          <span className="text-[11px] text-emerald-700">کل موصولی</span>
        </div>

        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
          <p className="text-xs text-rose-800 font-semibold">اخراجات آج ({dayExpenseList.length} واؤچرز)</p>
          <p className="text-lg font-bold font-mono tabular-nums text-rose-900">
            -{formatCurrencyPKR(todayExpense)} {settings.currency}
          </p>
          <span className="text-[11px] text-rose-700">کل ادائیگی</span>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs">
          <p className="text-xs text-emerald-300 font-semibold">حتمی اختتامی بیلنس (Closing Balance)</p>
          <p className="text-xl font-bold font-mono tabular-nums text-amber-200">
            {formatCurrencyPKR(closingBalance)} {settings.currency}
          </p>
          <span className="text-[11px] text-slate-300">موجودہ کیش محفوظ</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: PRINTABLE SINGLE-PAGE DAILY SUMMARY (یومیہ خلاصہ و میزان نامہ)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'daily_summary' && (
        <div className="printable-area single-page-print bg-white rounded-2xl border-2 border-slate-900 p-6 md:p-8 shadow-sm space-y-5">
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="text-xs font-arabic text-slate-700 mb-0.5">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-nastaliq text-emerald-950 mb-1">
              {settings.madrasaName}
            </h1>
            <div className="my-1.5 inline-block px-4 py-0.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 font-nastaliq text-xs sm:text-sm font-bold shadow-xs">
              {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {settings.registrationNumber} · {settings.address}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              رابطہ فون: {settings.phone}
            </p>

            {/* Certificate Title Badge */}
            <div className="mt-3 inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-6 py-1.5 rounded-md shadow-xs">
              <span>یومیہ مالی خلاصہ و میزان نامہ (Daily Financial Summary)</span>
            </div>
          </div>

          {/* Date & Hijri Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-medium">
            <div>
              <span className="text-slate-500">تاریخ و دن:</span>{' '}
              <strong className="text-slate-900 font-mono text-sm">{selectedDate}</strong>{' '}
              <span className="text-slate-700">({dayName})</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-slate-500">مالی و ہجری سال:</span>{' '}
              <strong className="text-slate-900">{settings.fiscalYear}</strong>
            </div>
            <div className="text-left col-span-2 sm:col-span-1">
              <span className="text-slate-500">شمارندہ رسیدات:</span>{' '}
              <strong className="text-slate-900 font-mono">
                {dayIncomeList.length} آمدن · {dayExpenseList.length} خرچ
              </strong>
            </div>
          </div>

          {/* Grand Balance Matrix (Four Pillars of the Day) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <span className="text-[11px] text-slate-600 font-semibold block mb-0.5">
                سابقہ ابتدائی بقایا (Opening)
              </span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-900">
                {formatCurrencyPKR(openingBalance)} {settings.currency}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
              <span className="text-[11px] text-emerald-800 font-semibold block mb-0.5">
                کل آمدن و عطیات وصولی (+)
              </span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-900">
                +{formatCurrencyPKR(todayIncome)} {settings.currency}
              </span>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-300">
              <span className="text-[11px] text-rose-800 font-semibold block mb-0.5">
                کل اخراجات و ادائیگیاں (-)
              </span>
              <span className="text-base font-bold font-mono tabular-nums text-rose-900">
                -{formatCurrencyPKR(todayExpense)} {settings.currency}
              </span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-950">
              <span className="text-[11px] text-emerald-300 font-semibold block mb-0.5">
                حتمی اختتامی کیش بیلنس
              </span>
              <span className="text-lg font-bold font-mono tabular-nums text-amber-200">
                {formatCurrencyPKR(closingBalance)} {settings.currency}
              </span>
            </div>
          </div>

          {/* Amount In Words & Daily Cash Flow Highlight */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div>
              <span className="text-amber-950 font-semibold">اختتامی کیش بیلنس بلحاظ الفاظ: </span>
              <strong className="text-slate-900 text-sm font-nastaliq">
                {numberToWordsUrdu(closingBalance)}
              </strong>
            </div>
            <div className="text-left sm:text-right font-medium">
              <span className="text-slate-600">آج کا خالص کیش فلو: </span>
              <strong
                className={`font-mono tabular-nums text-xs font-bold ${
                  todayNetCashFlow >= 0 ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {todayNetCashFlow >= 0 ? '+' : ''}{formatCurrencyPKR(todayNetCashFlow)} {settings.currency}
              </strong>
            </div>
          </div>

          {/* Dual Summaries: Category Breakdown for Income vs Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Income Heads Breakdown */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-emerald-800 text-white px-3 py-2 text-xs font-bold flex justify-between items-center">
                <span>آمدنیات خلاصہ بلحاظ مدات (Receipts)</span>
                <span>تعداد: {dayIncomeList.length}</span>
              </div>
              {dayIncomeByCategory.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  آج کوئی آمدن وصول نہیں ہوئی۔
                </div>
              ) : (
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {dayIncomeByCategory.map((item) => (
                      <tr key={item.category} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {item.category}{' '}
                          <span className="text-[10px] text-slate-400">({item.count} رسید)</span>
                        </td>
                        <td className="py-2 px-3 text-left font-mono tabular-nums font-bold text-emerald-800">
                          +{formatCurrencyPKR(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50/70 font-bold border-t border-emerald-200">
                      <td className="py-2 px-3 text-emerald-950">کل آمدن آج:</td>
                      <td className="py-2 px-3 text-left font-mono tabular-nums text-emerald-900">
                        +{formatCurrencyPKR(todayIncome)} {settings.currency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Expense Heads Breakdown */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <div className="bg-rose-800 text-white px-3 py-2 text-xs font-bold flex justify-between items-center">
                <span>اخراجات خلاصہ بلحاظ شعبہ جات (Payments)</span>
                <span>تعداد: {dayExpenseList.length}</span>
              </div>
              {dayExpenseByCategory.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  آج کوئی خرچ واقع نہیں ہوا۔
                </div>
              ) : (
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {dayExpenseByCategory.map((item) => (
                      <tr key={item.category} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {item.category}{' '}
                          <span className="text-[10px] text-slate-400">({item.count} واؤچر)</span>
                        </td>
                        <td className="py-2 px-3 text-left font-mono tabular-nums font-bold text-rose-800">
                          -{formatCurrencyPKR(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-rose-50/70 font-bold border-t border-rose-200">
                      <td className="py-2 px-3 text-rose-950">کل اخراجات آج:</td>
                      <td className="py-2 px-3 text-left font-mono tabular-nums text-rose-900">
                        -{formatCurrencyPKR(todayExpense)} {settings.currency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Shariah Fund Breakdown Strip */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500">زکوٰۃ فنڈ آج:</span>{' '}
                <strong className="text-emerald-900 font-mono">
                  آمدن: {formatCurrencyPKR(dayZakatIncome)} · خرچ: {formatCurrencyPKR(dayZakatExpense)}
                </strong>
              </div>
              <div className="border-r border-slate-300 pr-4">
                <span className="text-slate-500">عام فنڈ آج:</span>{' '}
                <strong className="text-slate-900 font-mono">
                  آمدن: {formatCurrencyPKR(dayGeneralIncome)} · خرچ: {formatCurrencyPKR(dayGeneralExpense)}
                </strong>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              کیش بک کمپیوٹرائزڈ آڈٹ سسٹم
            </span>
          </div>

          {/* Official Certification & Signatures */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">دستخط مع تاریخ</span>
              </div>
              <p className="font-bold text-slate-900">خزانچی / ناظم مالیات</p>
              <p className="text-[10px] text-slate-500">{settings.khazanchiName}</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">دستخط پڑتال</span>
              </div>
              <p className="font-bold text-slate-900">محاسب / نگران آڈٹ</p>
              <p className="text-[10px] text-slate-500">دفتر محاسبی مدرسہ</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">مہر و تصدیق</span>
              </div>
              <p className="font-bold text-slate-900">مہتمم / ناظم اعلیٰ</p>
              <p className="text-[10px] text-slate-500">{settings.mohtamimName}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 pt-2 font-mono">
            جامعہ کمپیوٹرائزڈ مالیات سافٹ ویئر · یومیہ خلاصہ و میزان نامہ (صفحہ ۱ / ۱)
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: DETAILED DUAL-COLUMN LEDGER (تفصیلی روزنامچہ کیش بک)
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'detailed_ledger' && (
        <div className="printable-area bg-white rounded-2xl border-2 border-slate-800 p-6 shadow-sm">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
            <p className="text-xs font-arabic text-slate-700">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <h2 className="text-2xl font-bold font-nastaliq text-emerald-900">
              {settings.madrasaName}
            </h2>
            <div className="my-1.5 inline-block px-3 py-0.5 bg-amber-50 border border-amber-300 rounded-md text-amber-950 font-nastaliq text-xs font-bold shadow-xs">
              {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
            </div>
            <p className="text-xs text-slate-600">
              {settings.registrationNumber} · {settings.address}
            </p>
            <div className="inline-block mt-2 px-5 py-0.5 bg-slate-900 text-white text-xs font-bold rounded">
              تفصیلی روزنامچہ کیش بک برائے تاریخ: <span className="font-mono">{selectedDate}</span> ({dayName})
            </div>
          </div>

          {/* Dual Column Ledger: آمدن (Debit) vs اخراجات (Credit) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-300 pb-6">
            {/* Income Column */}
            <div className="space-y-3">
              <div className="bg-emerald-800 text-white p-2 rounded-lg font-bold text-xs flex justify-between items-center">
                <span>وصولی / آمدن کھاتہ (آمدنیات)</span>
                <span>تعداد: {dayIncomeList.length}</span>
              </div>

              {/* Opening Balance Row */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">سابقہ بقایا رقم (گزشتہ کل سے):</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  {formatCurrencyPKR(openingBalance)} روپے
                </span>
              </div>

              <div className="space-y-2">
                {dayIncomeList.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                    آج کی کوئی آمدن درج نہیں ہوئی۔
                  </div>
                ) : (
                  dayIncomeList.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50/40 transition text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{tx.personName}</span>
                        <span className="font-mono font-bold text-emerald-800 tabular-nums">
                          +{formatCurrencyPKR(tx.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>
                          مد: {tx.category} ({tx.fundType === 'zakat' ? 'زکوٰۃ فنڈ' : 'عام فنڈ'})
                        </span>
                        <span className="font-mono">رسید #{tx.voucherNumber}</span>
                      </div>
                      {tx.notes && <p className="text-[10px] text-slate-500 italic">{tx.notes}</p>}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex justify-between font-bold text-xs text-emerald-900">
                <span>میزان کل آمدن (مع سابقہ بقایا):</span>
                <span className="font-mono tabular-nums text-sm">
                  {formatCurrencyPKR(openingBalance + todayIncome)} روپے
                </span>
              </div>
            </div>

            {/* Expense Column */}
            <div className="space-y-3">
              <div className="bg-rose-800 text-white p-2 rounded-lg font-bold text-xs flex justify-between items-center">
                <span>ادائیگی / خرچ کھاتہ (اخراجات)</span>
                <span>تعداد: {dayExpenseList.length}</span>
              </div>

              <div className="space-y-2">
                {dayExpenseList.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                    آج کا کوئی خرچ درج نہیں ہوا۔
                  </div>
                ) : (
                  dayExpenseList.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50/30 transition text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{tx.personName}</span>
                        <span className="font-mono font-bold text-rose-800 tabular-nums">
                          -{formatCurrencyPKR(tx.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>شعبہ: {tx.category}</span>
                        <span className="font-mono">واؤچر #{tx.voucherNumber}</span>
                      </div>
                      {tx.notes && <p className="text-[10px] text-slate-500 italic">{tx.notes}</p>}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex justify-between font-bold text-xs text-rose-900">
                <span>میزان کل اخراجات آج:</span>
                <span className="font-mono tabular-nums text-sm">
                  {formatCurrencyPKR(todayExpense)} روپے
                </span>
              </div>

              {/* Closing Balance Result */}
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-300 flex justify-between font-bold text-xs text-slate-900">
                <span>موجودہ میزان بقایا (Closing Balance):</span>
                <span className="font-mono tabular-nums text-sm text-emerald-800">
                  {formatCurrencyPKR(closingBalance)} روپے
                </span>
              </div>
            </div>
          </div>

          {/* Roznamcha Signatures */}
          <div className="mt-8 pt-4 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">دستخط</span>
              </div>
              <p className="font-semibold text-slate-800">دستخط خزانچی / ناظم مالیات</p>
              <p className="text-[10px] text-slate-500">{settings.khazanchiName}</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">مہر و دستخط</span>
              </div>
              <p className="font-semibold text-slate-800">تصدیق و مہر مہتمم صاحب</p>
              <p className="text-[10px] text-slate-500">{settings.mohtamimName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
