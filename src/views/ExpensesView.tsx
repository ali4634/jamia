import React, { useState } from 'react';
import { Plus, Search, Printer, Trash2, TrendingDown, Users, X, Filter, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES, MadrasaSettings, Transaction } from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface ExpensesViewProps {
  transactions: Transaction[];
  settings: MadrasaSettings;
  onOpenNewExpense: () => void;
  onOpenSalaryModal: () => void;
  onPrintTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  transactions,
  settings,
  onOpenNewExpense,
  onOpenSalaryModal,
  onPrintTransaction,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedDate, setShowAdvancedDate] = useState(false);

  const expenseList = transactions.filter((t) => t.type === 'expense');

  const filteredExpenses = expenseList.filter((t) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        t.personName.toLowerCase().includes(q) ||
        t.voucherNumber.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q)) ||
        t.amount.toString().includes(q);
      if (!match) return false;
    }

    // 2. Quick Category / Fund Filter
    if (activeQuickFilter !== 'all') {
      if (activeQuickFilter === 'salary') {
        if (!t.category.includes('تنخواہ')) return false;
      } else if (activeQuickFilter === 'kitchen') {
        if (!t.category.includes('مطبخ') && !t.category.includes('راشن')) return false;
      } else if (activeQuickFilter === 'bills') {
        if (!t.category.includes('بل') && !t.category.includes('یوٹیلٹی')) return false;
      } else if (activeQuickFilter === 'zakat') {
        if (t.fundType !== 'zakat') return false;
      } else if (activeQuickFilter === 'general') {
        if (t.fundType !== 'general') return false;
      } else if (activeQuickFilter === 'repair') {
        if (!t.category.includes('مرمت') && !t.category.includes('تعمیر')) return false;
      } else if (activeQuickFilter === 'books') {
        if (!t.category.includes('کتب') && !t.category.includes('اسٹیشنری')) return false;
      } else if (activeQuickFilter === 'medical') {
        if (!t.category.includes('علاج') && !t.category.includes('ادویات')) return false;
      }
    }

    // 3. Dropdown Category Filter
    if (selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }

    // 4. Date Range Filter
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;

    return true;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);

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
            <TrendingDown className="w-5 h-5 text-rose-700" />
            <span>اخراجات و ادائیگیوں کا مکمل ریکارڈ</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            اساتذہ تنخواہیں، مطبخ راشن، بلز، مرمت اور ضروری اخراجات کے واؤچرز
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 text-right">
            <span className="text-[11px] text-rose-800 font-medium block">
              کل ادا شدہ اخراجات ({filteredExpenses.length} واؤچرز)
            </span>
            <span className="text-lg font-bold font-mono text-rose-900 tabular-nums">
              {formatCurrencyPKR(totalFilteredAmount)} {settings.currency}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSalaryModal}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>تنخواہ ادا کریں</span>
            </button>

            <button
              onClick={onOpenNewExpense}
              className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>نیا واؤچر خرچ بنائیں</span>
            </button>
          </div>
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
              placeholder="وصول کنندہ کا نام، واؤچر نمبر (مثلاً: EXP-501)، مد خرچ، یا رقم تلاش کریں..."
              className="w-full pr-11 pl-10 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 bg-slate-50/50 hover:bg-white transition"
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

        {/* 2. Interactive Category & Fund Quick-Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-1">
              شعبہ / مدات:
            </span>

            {/* All */}
            <button
              onClick={() => setActiveQuickFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'all'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              تمام ({expenseList.length})
            </button>

            {/* Staff Salaries */}
            <button
              onClick={() => setActiveQuickFilter('salary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'salary'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              اساتذہ تنخواہیں
            </button>

            {/* Mess / Food */}
            <button
              onClick={() => setActiveQuickFilter('kitchen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'kitchen'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              مطبخ و راشن طلبہ
            </button>

            {/* Utility Bills */}
            <button
              onClick={() => setActiveQuickFilter('bills')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'bills'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              یوٹیلٹی بلز (بجلی/گیس)
            </button>

            {/* Zakat Expenses */}
            <button
              onClick={() => setActiveQuickFilter('zakat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'zakat'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              زکوٰۃ مصارف
            </button>

            {/* General Fund Expenses */}
            <button
              onClick={() => setActiveQuickFilter('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'general'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              عام فنڈ
            </button>

            {/* Maintenance & Repairs */}
            <button
              onClick={() => setActiveQuickFilter('repair')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'repair'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              مرمت و دیکھ بھال
            </button>

            {/* Books & Stationery */}
            <button
              onClick={() => setActiveQuickFilter('books')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'books'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              کتب و تعلیمی سامان
            </button>

            {/* Medical */}
            <button
              onClick={() => setActiveQuickFilter('medical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeQuickFilter === 'medical'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              علاج معالجہ طلبہ
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Toggle Advanced Filters (Category Dropdown & Date Range) */}
            <button
              onClick={() => setShowAdvancedDate(!showAdvancedDate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showAdvancedDate || selectedCategory !== 'all' || startDate !== '' || endDate !== ''
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>تاریخ و تفصیلی مدات</span>
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
              <label className="block text-slate-600 font-semibold mb-1">مخصوص مد خرچ منتخب کریں:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
              >
                <option value="all">تمام مدات</option>
                {EXPENSE_CATEGORIES.map((cat) => (
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
            نتیجہ: <strong className="text-slate-900 font-mono">{filteredExpenses.length}</strong> واؤچرز
            (کل {expenseList.length} میں سے)
          </span>
          {hasActiveFilters && (
            <span className="text-rose-800 font-semibold">فلٹر لاگو ہے</span>
          )}
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">واؤچر نمبر</th>
                <th className="py-3 px-4">تاریخ</th>
                <th className="py-3 px-4">نام وصول کنندہ / مدعوون</th>
                <th className="py-3 px-4">مد (کیٹیگری)</th>
                <th className="py-3 px-4">کھاتہ فنڈ</th>
                <th className="py-3 px-4">ادائیگی ذریعہ</th>
                <th className="py-3 px-4 text-left">رقم ({settings.currency})</th>
                <th className="py-3 px-4 text-center">واؤچر پرنٹ</th>
                <th className="py-3 px-4 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600 mb-1">
                      کوئی ریکارڈ دستیاب نہیں ہے۔
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      مطلوبہ نام یا کیٹیگری کے مطابق کوئی خرچ واؤچر نہیں ملا۔
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
                filteredExpenses.map((tx) => (
                  <tr key={tx.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {tx.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.personName}</div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-500 truncate max-w-sm">{tx.notes}</div>
                      )}
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
                    <td className="py-3 px-4 text-left font-mono tabular-nums font-bold text-rose-700 text-sm">
                      {formatCurrencyPKR(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onPrintTransaction(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200 transition font-medium cursor-pointer"
                        title="خرچ واؤچر پرنٹ کریں"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>واؤچر پرنٹ</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('کیا آپ اس واؤچر کو حذف کرنا چاہتے ہیں؟')) {
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
