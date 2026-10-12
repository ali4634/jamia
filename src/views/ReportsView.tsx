import React, { useState } from 'react';
import { FileText, Printer, BarChart3, ShieldCheck, Download } from 'lucide-react';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  MadrasaSettings,
  Transaction,
} from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface ReportsViewProps {
  transactions: Transaction[];
  settings: MadrasaSettings;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ transactions, settings }) => {
  const [period, setPeriod] = useState<'all' | 'this_month' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter transactions by period
  const filteredTransactions = transactions.filter((t) => {
    if (period === 'this_month') {
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
      return t.date.startsWith(currentMonth);
    }
    if (period === 'custom') {
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
    }
    return true;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Category breakdowns
  const incomeByCategory = INCOME_CATEGORIES.map((cat) => {
    const amount = filteredTransactions
      .filter((t) => t.type === 'income' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
    return { category: cat, amount, percentage };
  }).filter((item) => item.amount > 0);

  const expenseByCategory = EXPENSE_CATEGORIES.map((cat) => {
    const amount = filteredTransactions
      .filter((t) => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    return { category: cat, amount, percentage };
  }).filter((item) => item.amount > 0);

  // Zakat Shariah Audit
  const zakatIncome = filteredTransactions
    .filter((t) => t.type === 'income' && t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);
  const zakatExpense = filteredTransactions
    .filter((t) => t.type === 'expense' && t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);
  const zakatSurplus = zakatIncome - zakatExpense;

  // General Fund
  const generalIncome = filteredTransactions
    .filter((t) => t.type === 'income' && t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);
  const generalExpense = filteredTransactions
    .filter((t) => t.type === 'expense' && t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);
  const generalSurplus = generalIncome - generalExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800" />
            <span>مالیاتی گوشوارے، میزانیہ و شرعی آڈٹ رپورٹ</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            شوریٰ، مہتمم اور مخیر حضرات کے سامنے پیش کرنے کے لیے باضابطہ مالی گوشوارہ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                period === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              مکمل ریکارڈ
            </button>
            <button
              onClick={() => setPeriod('this_month')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                period === 'this_month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              موجودہ ماہ
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                period === 'custom' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              مخصوص مدت
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>گوشوارہ پرنٹ کریں</span>
          </button>
        </div>
      </div>

      {period === 'custom' && (
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs no-print">
          <span className="text-slate-600 font-semibold">از تاریخ:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 font-mono"
          />
          <span className="text-slate-600 font-semibold">تا تاریخ:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 font-mono"
          />
        </div>
      )}

      {/* Printable Financial Statement (گوشوارہ مالیات) */}
      <div className="printable-area bg-white rounded-2xl border-2 border-slate-800 p-6 space-y-6 shadow-sm">
        {/* Report Header */}
        <div className="text-center border-b-2 border-slate-800 pb-4">
          <p className="text-xs font-arabic text-slate-700">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h2 className="text-2xl font-bold font-nastaliq text-emerald-900">
            {settings.madrasaName}
          </h2>
          <p className="text-xs text-slate-600">
            {settings.registrationNumber} · {settings.address}
          </p>
          <div className="inline-block mt-2 px-6 py-1 bg-slate-900 text-white text-xs font-bold rounded">
            گوشوارہ آمدن و اخراجات و میزانِ حسابات (مالی سال {settings.fiscalYear})
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">
              کل آمدن و عطیات وصولی
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950">
              {formatCurrencyPKR(totalIncome)} {settings.currency}
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
            <span className="text-xs text-rose-800 font-semibold block mb-1">
              کل ادا شدہ اخراجات
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-950">
              {formatCurrencyPKR(totalExpense)} {settings.currency}
            </span>
          </div>

          <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl">
            <span className="text-xs text-slate-700 font-semibold block mb-1">
              خالص بچت / زائد بیلنس (Surplus)
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800">
              {formatCurrencyPKR(netSavings)} {settings.currency}
            </span>
          </div>
        </div>

        {/* Shariah Zakat Audit Card */}
        <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-emerald-900">
                شرعی زکوٰۃ فنڈ کی علیحدہ کیفیت (Zakat Fund Audit)
              </h3>
            </div>
            <span className="text-xs text-emerald-800 font-semibold">شرعی مصارف کا حساب</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-slate-500 block">زکوٰۃ وصولی:</span>
              <span className="font-mono font-bold text-emerald-900 tabular-nums">
                {formatCurrencyPKR(zakatIncome)} روپے
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-slate-500 block">زکوٰۃ مصارف پر خرچ:</span>
              <span className="font-mono font-bold text-rose-900 tabular-nums">
                {formatCurrencyPKR(zakatExpense)} روپے
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-slate-500 block">زکوٰۃ فنڈ محفوظ بقایا:</span>
              <span className="font-mono font-bold text-emerald-800 tabular-nums">
                {formatCurrencyPKR(zakatSurplus)} روپے
              </span>
            </div>
          </div>
        </div>

        {/* Dual Category Tables: آمدن بمقابلہ اخراجات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-emerald-800 text-white p-2.5 font-bold text-xs flex justify-between">
              <span>مد وار آمدنیات کی تفصیل</span>
              <span>رقم ({settings.currency})</span>
            </div>
            <table className="w-full text-right text-xs">
              <tbody className="divide-y divide-slate-100">
                {incomeByCategory.map((item) => (
                  <tr key={item.category} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      <div>{item.category}</div>
                      <div className="w-24 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono tabular-nums font-bold text-emerald-800">
                      {formatCurrencyPKR(item.amount)}
                      <span className="text-[10px] text-slate-400 font-normal mr-1">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-3 text-slate-900">کل میزان آمدن:</td>
                  <td className="py-2.5 px-3 text-left font-mono tabular-nums text-emerald-900">
                    {formatCurrencyPKR(totalIncome)} {settings.currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expense Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-rose-800 text-white p-2.5 font-bold text-xs flex justify-between">
              <span>شعبہ وار اخراجات کی تفصیل</span>
              <span>رقم ({settings.currency})</span>
            </div>
            <table className="w-full text-right text-xs">
              <tbody className="divide-y divide-slate-100">
                {expenseByCategory.map((item) => (
                  <tr key={item.category} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      <div>{item.category}</div>
                      <div className="w-24 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-rose-600 h-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono tabular-nums font-bold text-rose-800">
                      {formatCurrencyPKR(item.amount)}
                      <span className="text-[10px] text-slate-400 font-normal mr-1">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2.5 px-3 text-slate-900">کل میزان اخراجات:</td>
                  <td className="py-2.5 px-3 text-left font-mono tabular-nums text-rose-900">
                    {formatCurrencyPKR(totalExpense)} {settings.currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-xs text-center">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
              <span className="text-slate-400 text-[10px]">دستخط</span>
            </div>
            <p className="font-semibold text-slate-800">محاسب / ناظم مالیات</p>
            <p className="text-[10px] text-slate-500">{settings.khazanchiName}</p>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
              <span className="text-slate-400 text-[10px]">دستخط</span>
            </div>
            <p className="font-semibold text-slate-800">اراکین مجلس شوریٰ / آڈٹ کمیٹی</p>
            <p className="text-[10px] text-slate-500">مدرسہ مجلس عاملہ</p>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
              <span className="text-slate-400 text-[10px]">مہر و دستخط</span>
            </div>
            <p className="font-semibold text-slate-800">مہتمم / ناظم اعلیٰ</p>
            <p className="text-[10px] text-slate-500">{settings.mohtamimName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
