import React, { useState } from 'react';
import { X, Check, FileText } from 'lucide-react';
import {
  EXPENSE_CATEGORIES,
  FundType,
  FUND_TYPE_LABELS,
  INCOME_CATEGORIES,
  PaymentMode,
  PAYMENT_MODE_LABELS,
  Transaction,
  TransactionType,
} from '../types/maliyat';
import { numberToWordsUrdu } from '../utils/numberToWordsUrdu';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>, printAfterSave?: boolean) => void;
  initialType?: TransactionType;
  defaultReceiver?: string;
  nextReceiptNo: string;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialType = 'income',
  defaultReceiver = '',
  nextReceiptNo,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>(
    initialType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
  );
  const [fundType, setFundType] = useState<FundType>('general');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [personName, setPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [receivedBy, setReceivedBy] = useState(defaultReceiver);
  const [voucherNumber, setVoucherNumber] = useState(nextReceiptNo);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Keep category in sync with transaction type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
      if (voucherNumber.startsWith('EXP-')) {
        setVoucherNumber(voucherNumber.replace('EXP-', 'REC-'));
      }
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
      if (voucherNumber.startsWith('REC-')) {
        setVoucherNumber(voucherNumber.replace('REC-', 'EXP-'));
      }
    }
  };

  const handleSubmit = (printReceipt: boolean) => {
    if (!amount || Number(amount) <= 0) {
      alert('براہ کرم درست رقم درج فرمائیں۔');
      return;
    }
    if (!personName.trim()) {
      alert(type === 'income' ? 'براہ کرم دہندہ کا نام درج کریں۔' : 'براہ کرم وصول کنندہ کا نام درج کریں۔');
      return;
    }

    onSave(
      {
        voucherNumber: voucherNumber || (type === 'income' ? 'REC-001' : 'EXP-001'),
        type,
        amount: Number(amount),
        category,
        fundType,
        paymentMode,
        date,
        personName: personName.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        notes: notes.trim() || undefined,
        receivedBy: receivedBy.trim() || 'ناظم مالیات',
      },
      printReceipt
    );

    // Reset Form
    setAmount('');
    setPersonName('');
    setPhone('');
    setCity('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 text-right dir-rtl max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {type === 'income' ? 'نئی آمدن کا اندراج / رسید جاری کریں' : 'نئے خرچ کا اندراج / واؤچر جاری کریں'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            آمدن / عطیات وصولی
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اخراجات ادائیگی
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
          className="space-y-4 text-sm"
        >
          {/* Amount and Live Urdu Words */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              رقم (روپے میں) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثلاً: 25000"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-lg font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            />
            {amount !== '' && Number(amount) > 0 && (
              <p className="mt-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 font-medium">
                بلحاظ الفاظ: <strong>{numberToWordsUrdu(Number(amount))}</strong>
              </p>
            )}
          </div>

          {/* Name & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {type === 'income' ? 'نام دہندہ (مخیر شخصیت)' : 'نام وصول کنندہ / دکاندار'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder={type === 'income' ? 'مثلاً: حاجی محمد افضل' : 'مثلاً: المدینہ ہارڈویئر / قاری صاحب'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رابطہ نمبر (موبائل فون)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثلاً: 0300-1234567"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Category & Fund Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مد / کیٹیگری <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'زکوٰۃ') setFundType('zakat');
                  else if (e.target.value === 'تعمیراتی فنڈ') setFundType('taameer');
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {type === 'income'
                  ? INCOME_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  : EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                کھاتہ / فنڈ کی قسم <span className="text-rose-500">*</span>
              </label>
              <select
                value={fundType}
                onChange={(e) => setFundType(e.target.value as FundType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {Object.entries(FUND_TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Mode, Receipt No, and Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ادائیگی کا ذریعہ
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {Object.entries(PAYMENT_MODE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {type === 'income' ? 'رسید نمبر' : 'واؤچر نمبر'}
              </label>
              <input
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تاریخ
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* City / Address & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                شہر یا پتہ
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثلاً: لاہور / گوجرانوالہ"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                خزانچی / وصول کنندہ
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                placeholder="مثلاً: قاری محمد رضوان"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تفصیل / ضروری نوٹ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: برائے طعام و ضروریات طلبہ مستحقین"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>محفوظ کریں</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>محفوظ کریں اور رسید پرنٹ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
