import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  Building2,
  Printer,
  Trash2,
  FileText,
  Calendar,
  Users,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MadrasaSettings, Transaction } from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface DashboardViewProps {
  transactions: Transaction[];
  settings: MadrasaSettings;
  onOpenNewTransaction: (type?: 'income' | 'expense') => void;
  onOpenSalaryModal: () => void;
  onPrintTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onNavigateTab: (tab: 'income' | 'expenses' | 'staff' | 'roznamcha' | 'reports') => void;
  onOpenBackup?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  settings,
  onOpenNewTransaction,
  onOpenSalaryModal,
  onPrintTransaction,
  onDeleteTransaction,
  onNavigateTab,
  onOpenBackup,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Fund-wise breakdowns
  const zakatIncome = transactions
    .filter((t) => t.type === 'income' && t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);
  const zakatExpense = transactions
    .filter((t) => t.type === 'expense' && t.fundType === 'zakat')
    .reduce((sum, t) => sum + t.amount, 0);
  const zakatBalance = zakatIncome - zakatExpense;

  const generalIncome = transactions
    .filter((t) => t.type === 'income' && t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);
  const generalExpense = transactions
    .filter((t) => t.type === 'expense' && t.fundType === 'general')
    .reduce((sum, t) => sum + t.amount, 0);
  const generalBalance = generalIncome - generalExpense;

  // Filtered recent transactions
  const displayedTransactions = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // 6 Months Historical Financial Trend
  const urduMonthNames: Record<string, string> = {
    '01': 'جنوری',
    '02': 'فروری',
    '03': 'مارچ',
    '04': 'اپریل',
    '05': 'مئی',
    '06': 'جون',
    '07': 'جولائی',
    '08': 'اگست',
    '09': 'ستمبر',
    '10': 'اکتوبر',
    '11': 'نومبر',
    '12': 'دسمبر',
  };

  const monthlyChartData = useMemo(() => {
    // Determine base reference month from latest transaction or current date
    const dates = transactions.map((t) => t.date).sort();
    const latestDateStr = dates[dates.length - 1] || new Date().toISOString().split('T')[0];
    const [latestYear, latestMonth] = latestDateStr.split('-').map(Number);

    const result = [];
    for (let i = 5; i >= 0; i--) {
      let m = latestMonth - i;
      let y = latestYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const monthStr = String(m).padStart(2, '0');
      const yearMonthKey = `${y}-${monthStr}`;
      const monthLabel = `${urduMonthNames[monthStr] || monthStr}`;

      const income = transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(yearMonthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(yearMonthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      const net = income - expense;

      result.push({
        monthKey: yearMonthKey,
        monthName: monthLabel,
        'آمدن': income,
        'اخراجات': expense,
        netBalance: net,
      });
    }
    return result;
  }, [transactions]);

  // Aggregate totals for the 6-month period
  const total6MonthIncome = useMemo(
    () => monthlyChartData.reduce((acc, d) => acc + d['آمدن'], 0),
    [monthlyChartData]
  );
  const total6MonthExpense = useMemo(
    () => monthlyChartData.reduce((acc, d) => acc + d['اخراجات'], 0),
    [monthlyChartData]
  );
  const net6MonthSavings = total6MonthIncome - total6MonthExpense;

  const formatYAxisNumber = (val: number) => {
    if (val >= 100000) return `${(val / 100000).toFixed(1)} لاکھ`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)} ہزار`;
    return String(val);
  };

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const incomeVal = payload.find((p: any) => p.dataKey === 'آمدن')?.value || 0;
      const expenseVal = payload.find((p: any) => p.dataKey === 'اخراجات')?.value || 0;
      const netVal = incomeVal - expenseVal;

      return (
        <div className="bg-white/95 backdrop-blur p-3.5 rounded-xl border border-slate-200 shadow-xl text-right dir-rtl text-xs font-sans min-w-[200px]">
          <p className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 font-nastaliq text-sm">
            ماہ: {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
                کل آمدن:
              </span>
              <span className="font-mono font-bold text-emerald-900 tabular-nums">
                {formatCurrencyPKR(incomeVal)} {settings.currency}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-rose-800 font-semibold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-700 inline-block" />
                کل اخراجات:
              </span>
              <span className="font-mono font-bold text-rose-900 tabular-nums">
                {formatCurrencyPKR(expenseVal)} {settings.currency}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 font-bold">
              <span className="text-slate-700">ماہانہ بچت / خسارہ:</span>
              <span
                className={`font-mono tabular-nums ${
                  netVal >= 0 ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {netVal >= 0 ? '+' : ''}{formatCurrencyPKR(netVal)} {settings.currency}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-950">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs mb-1">
              <span>{settings.fiscalYear}</span>
              <span>·</span>
              <span>دفتر ناظم مالیات</span>
            </div>
            <h1 className="text-2xl font-bold font-nastaliq text-amber-100">
              {settings.madrasaName}
            </h1>
            <div className="mt-1.5 inline-block px-3 py-0.5 bg-amber-400/20 border border-amber-300/30 rounded-lg text-amber-200 text-xs font-bold font-nastaliq">
              {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
            </div>
            <p className="text-xs text-emerald-100 mt-1 max-w-xl">
              مدرسہ کے تمام مالی معاملات (آمدن، اخراجات، زکوٰۃ، عطیات، اور اساتذہ تنخواہیں) کا کمپیوٹرائزڈ و شرعی نظم
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenNewTransaction('income')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>آمدن / رسید جاری کریں</span>
            </button>
            <button
              onClick={() => onOpenNewTransaction('expense')}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingDown className="w-4 h-4" />
              <span>خرچ / واؤچر بنائیں</span>
            </button>
            <button
              onClick={onOpenSalaryModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>تنخواہ ادائیگی</span>
            </button>
            {onOpenBackup && (
              <button
                onClick={onOpenBackup}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 text-xs font-bold transition shadow flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                title="تمام مالیاتی ڈیٹا کا JSON بیک اپ ڈاؤن لوڈ یا بحال کریں"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>بیک اپ (JSON)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Cards (60-30-10 palette, tabular-nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Cash Balance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>موجودہ کل محفوظ بیلنس</span>
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {formatCurrencyPKR(netBalance)}{' '}
            <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>کل کیش و بینک بیلنس</span>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>کل آمدن و عطیات</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mb-1">
            {formatCurrencyPKR(totalIncome)}{' '}
            <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>آمدن کے کل اندراجات: {transactions.filter((t) => t.type === 'income').length}</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>کل اخراجات و ادائیگی</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-800 mb-1">
            {formatCurrencyPKR(totalExpense)}{' '}
            <span className="text-xs font-normal text-slate-500">{settings.currency}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>اخراجات کے کل واؤچرز: {transactions.filter((t) => t.type === 'expense').length}</span>
          </div>
        </div>

        {/* Zakat Fund Separation */}
        <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-semibold mb-2">
            <span>زکوٰۃ فنڈ موجودہ توازن</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 mb-1">
            {formatCurrencyPKR(zakatBalance)}{' '}
            <span className="text-xs font-normal text-emerald-700">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-emerald-800 flex items-center justify-between">
            <span>آمدن: {formatCurrencyPKR(zakatIncome)}</span>
            <span>·</span>
            <span>خرچ: {formatCurrencyPKR(zakatExpense)}</span>
          </div>
        </div>
      </div>

      {/* 6 Months Income vs Expenses Bar Chart Card (Recharts) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-slate-900">
                گزشتہ ۶ ماہ کی آمدن بمقابلہ اخراجات (Monthly Income vs. Expenses)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مدرسہ کے مالی استحکام، عطیات کی وصولی اور اخراجات کا تصویری تقابل (چھ ماہ کا رجحان)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
              <span>۶ ماہ کل آمدن: </span>
              <strong className="font-mono tabular-nums">{formatCurrencyPKR(total6MonthIncome)}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-medium">
              <span>۶ ماہ کل اخراجات: </span>
              <strong className="font-mono tabular-nums">{formatCurrencyPKR(total6MonthExpense)}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-medium">
              <span>خالص بچت: </span>
              <strong className="font-mono tabular-nums text-emerald-800">
                {net6MonthSavings >= 0 ? '+' : ''}{formatCurrencyPKR(net6MonthSavings)} {settings.currency}
              </strong>
            </div>
          </div>
        </div>

        {/* Recharts Chart Viewport */}
        <div className="w-full h-72 sm:h-80 dir-ltr pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyChartData}
              margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="monthName"
                tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Noto Sans Arabic, sans-serif' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxisNumber}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                iconType="circle"
              />
              <Bar
                dataKey="آمدن"
                name="آمدن (روپے)"
                fill="#047857"
                radius={[6, 6, 0, 0]}
                maxBarSize={42}
              />
              <Bar
                dataKey="اخراجات"
                name="اخراجات (روپے)"
                fill="#be123c"
                radius={[6, 6, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fund Breakdown & Quick Navigation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* General Fund Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">عام فنڈ (غیر زکوٰۃ)</p>
              <p className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {formatCurrencyPKR(generalBalance)} {settings.currency}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
          >
            تفصیل دیکھیں
          </button>
        </div>

        {/* Quick Roznamcha Link */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">روزنامچہ کیش بک</p>
              <p className="text-sm font-bold text-slate-900">یومیہ آمدن و خرچ رجسٹر</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('roznamcha')}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
          >
            کیش بک کھولیں
          </button>
        </div>

        {/* Staff Payroll Link */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">اساتذہ و عملہ</p>
              <p className="text-sm font-bold text-slate-900">ماہانہ تنخواہ سلپس</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('staff')}
            className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
          >
            رجسٹر دیکھیں
          </button>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">حالیہ مالیاتی اندراجات و رسیدات</h2>
            <p className="text-xs text-slate-500">تمام جاری کردہ رسیدیں، بلز اور اخراجات کے واؤچرز</p>
          </div>

          {/* Filter Tabs (Interactive filter control, clean buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تمام ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              صرف آمدن ({transactions.filter((t) => t.type === 'income').length})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-white text-rose-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              صرف اخراجات ({transactions.filter((t) => t.type === 'expense').length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">نمبر رسید/واؤچر</th>
                <th className="py-3 px-4">تاریخ</th>
                <th className="py-3 px-4">نام دہندہ / وصول کنندہ</th>
                <th className="py-3 px-4">مد (کیٹیگری)</th>
                <th className="py-3 px-4">فنڈ</th>
                <th className="py-3 px-4">ادائیگی ذریعہ</th>
                <th className="py-3 px-4 text-left">رقم ({settings.currency})</th>
                <th className="py-3 px-4 text-center">کارروائی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    کوئی ریکارڈ موجود نہیں ہے۔
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {tx.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{tx.personName}</div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{tx.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {tx.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {tx.fundType === 'zakat' ? (
                        <span className="text-emerald-800 font-medium">زکوٰۃ فنڈ</span>
                      ) : tx.fundType === 'imdad' ? (
                        <span>امداد طلبہ</span>
                      ) : tx.fundType === 'taameer' ? (
                        <span>تعمیرات</span>
                      ) : (
                        <span>عام فنڈ</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {tx.paymentMode === 'cash' ? 'نقد' : tx.paymentMode === 'bank' ? 'بینک' : tx.paymentMode}
                    </td>
                    <td className="py-3 px-4 text-left font-mono tabular-nums font-bold">
                      <span className={tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrencyPKR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintTransaction(tx)}
                          className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition cursor-pointer"
                          title="رسید / واؤچر پرنٹ کریں"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('کیا آپ اس اندراج کو حذف کرنا چاہتے ہیں؟')) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
