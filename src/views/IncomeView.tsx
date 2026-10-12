import React, { useState } from 'react';
import { Plus, Search, Printer, Trash2, TrendingUp, X, Filter, RotateCcw } from 'lucide-react';
import { INCOME_CATEGORIES, MadrasaSettings, Transaction } from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface IncomeViewProps {
  transactions: Transaction[];
  settings: MadrasaSettings;
  onOpenNewIncome: () => void;
  onPrintTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({
  transactions,
  settings,
  onOpenNewIncome,
  onPrintTransaction,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedDate, setShowAdvancedDate] = useState(false);

  const incomeList = transactions.filter((t) => t.type === 'income');

  // Multi-tier filtering: Search query + Quick category/fund button + detailed category + date range
  const filteredIncome = incomeList.filter((t) => {
    // 1. Search Query (matches donor name, receipt number, phone, city, notes, or amount)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        t.personName.toLowerCase().includes(q) ||
        t.voucherNumber.toLowerCase().includes(q) ||
        (t.phone && t.phone.includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        t.amount.toString().includes(q);
      if (!match) return false;
    }

    // 2. Quick Category / Fund filter (e.g., Zakat, Donation, General, etc.)
    if (activeQuickFilter !== 'all') {
      if (activeQuickFilter === 'zakat') {
        if (t.fundType !== 'zakat' && t.category !== 'زکوٰۃ') return false;
      } else if (activeQuickFilter === 'donation') {
        if (!t.category.includes('عطیات') && !t.category.includes('عطیہ')) return false;
      } else if (activeQuickFilter === 'general') {
        if (t.fundType !== 'general') return false;
      } else if (activeQuickFilter === 'imdad') {
        if (t.fundType !== 'imdad' && !t.category.includes('کفالت') && !t.category.includes('امداد')) return false;
      } else if (activeQuickFilter === 'taameer') {
        if (t.fundType !== 'taameer' && !t.category.includes('تعمیر')) return false;
      } else if (activeQuickFilter === 'sadaqat') {
        if (!t.category.includes('صدق') && !t.category.includes('فطرانہ') && !t.category.includes('قربانی')) return false;
      }
    }

    // 3. Dropdown Category filter (if specifically selected)
    if (selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }

    // 4. Date range filter
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;

    return true;
  });

  const totalFilteredAmount = filteredIncome.reduce((sum, t) => sum + t.amount, 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveQuickFilter('all');
    setSelectedCategory('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeQuickFilter !== 'all' ||
    selectedCategory !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="space-y-5">
      {/* Top Action & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            <span>آمدن و عطیات وصولی کا مکمل ریکارڈ</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            مخیر حضرات کے عطیات، زکوٰۃ، صدقات اور جملہ فنڈز کی رسیدات کا اندراج
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-right">
            <span className="text-[11px] text-emerald-800 font-medium block">
              مجموعی رقم ({filteredIncome.length} رسیدات)
            </span>
            <span className="text-lg font-bold font-mono text-emerald-900 tabular-nums">
              {formatCurrencyPKR(totalFilteredAmount)} {settings.currency}
            </span>
          </div>

          <button
            onClick={onOpenNewIncome}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>نئی رسید جاری کریں</span>
          </button>
        </div>
      </div>

      {/* Prominent Search Bar & Category Filter Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* 1. Main Search Bar Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute right-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="دہندہ کا نام، رسید نمبر (مثلاً: REC-1041)، فون نمبر، شہر یا رقم تلاش کریں..."
              className="w-full pr-11 pl-10 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50/50 hover:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="تلاش صاف کریں"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Interactive Category & Fund Quick-Filter Buttons (Zakat, Donation, General, etc.) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-1">
              مدات / فنڈز:
            </span>

            {/* All */}
            <button
              onClick={() => setActiveQuickFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              تمام ({incomeList.length})
            </button>

            {/* Zakat (زکوٰۃ) */}
            <button
              onClick={() => setActiveQuickFilter('zakat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'zakat'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              زکوٰۃ فنڈ (Zakat)
            </button>

            {/* Donation (عطیات عام) */}
            <button
              onClick={() => setActiveQuickFilter('donation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'donation'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              عطیات (Donation)
            </button>

            {/* General Fund (عام فنڈ) */}
            <button
              onClick={() => setActiveQuickFilter('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'general'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              عام فنڈ (General)
            </button>

            {/* Student Aid (کفالت طلبہ) */}
            <button
              onClick={() => setActiveQuickFilter('imdad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'imdad'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              کفالت و امدادِ طلبہ
            </button>

            {/* Construction (تعمیراتی فنڈ) */}
            <button
              onClick={() => setActiveQuickFilter('taameer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'taameer'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              تعمیرات
            </button>

            {/* Sadaqat & Fitrana */}
            <button
              onClick={() => setActiveQuickFilter('sadaqat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'sadaqat'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              صدقات و فطرانہ
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Toggle Advanced Filters (Category Dropdown & Date Range) */}
            <button
              onClick={() => setShowAdvancedDate(!showAdvancedDate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showAdvancedDate || selectedCategory !== 'all' || startDate !== '' || endDate !== ''
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>تاریخ و تفصیلی فلٹر</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="px-2.5 py-1.5 rounded-lg text-xs text-rose-700 hover:bg-rose-50 font-semibold flex items-center gap-1 transition cursor-pointer"
                title="تمام فلٹرز صاف کریں"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>صاف کریں</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Advanced Date & Detailed Category Filter Panel (Expandable) */}
        {showAdvancedDate && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">مخصوص مد منتخب کریں:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
              >
                <option value="all">تمام مدات</option>
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">از تاریخ (Start Date):</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">تا تاریخ (End Date):</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-mono bg-white"
              />
            </div>
          </div>
        )}

        {/* Live Filter Indicator Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            نتیجہ: <strong className="text-slate-900 font-mono">{filteredIncome.length}</strong> ریکارڈز
            (کل {incomeList.length} میں سے)
          </span>
          {hasActiveFilters && (
            <span className="text-emerald-800 font-semibold">فلٹر لاگو ہے</span>
          )}
        </div>
      </div>

      {/* Income Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">رسید نمبر</th>
                <th className="py-3 px-4">تاریخ</th>
                <th className="py-3 px-4">نام دہندہ / مخیر شخصیت</th>
                <th className="py-3 px-4">مد (کیٹیگری)</th>
                <th className="py-3 px-4">فنڈ کی قسم</th>
                <th className="py-3 px-4">ادائیگی ذریعہ</th>
                <th className="py-3 px-4 text-left">رقم ({settings.currency})</th>
                <th className="py-3 px-4 text-center">رسید پرنٹ</th>
                <th className="py-3 px-4 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncome.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600 mb-1">
                      کوئی ریکارڈ دستیاب نہیں ہے۔
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      مطلوبہ نام یا کیٹیگری کے مطابق کوئی آمدن کی رسید نہیں ملی۔
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetAllFilters}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        تمام فلٹرز صاف کریں
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredIncome.map((tx) => (
                  <tr key={tx.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {tx.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.personName}</div>
                      <div className="text-[11px] text-slate-500">
                        {tx.phone ? `فون: ${tx.phone}` : ''}{' '}
                        {tx.city ? `(${tx.city})` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {tx.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className={tx.fundType === 'zakat' ? 'text-emerald-800 font-bold' : 'text-slate-600'}>
                        {tx.fundType === 'zakat'
                          ? 'زکوٰۃ فنڈ'
                          : tx.fundType === 'imdad'
                          ? 'امداد طلبہ'
                          : tx.fundType === 'taameer'
                          ? 'تعمیرات'
                          : 'عام فنڈ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {tx.paymentMode === 'cash' ? 'نقد' : tx.paymentMode === 'bank' ? 'بینک' : tx.paymentMode}
                    </td>
                    <td className="py-3 px-4 text-left font-mono tabular-nums font-bold text-emerald-800 text-sm">
                      {formatCurrencyPKR(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPrintTransaction(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition font-medium cursor-pointer"
                        title="باضابطہ رسید پرنٹ کریں"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>رسید پرنٹ</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('کیا آپ اس رسید کو ریکارڈ سے حذف کرنا چاہتے ہیں؟')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
