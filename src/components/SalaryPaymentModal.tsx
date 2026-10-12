import React, { useState } from 'react';
import { X, Check, Printer } from 'lucide-react';
import { PaymentMode, PAYMENT_MODE_LABELS, SalaryPayment, StaffMember } from '../types/maliyat';
import { formatCurrencyPKR, numberToWordsUrdu } from '../utils/numberToWordsUrdu';

interface SalaryPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  onSave: (payment: Omit<SalaryPayment, 'id'>, printSlip?: boolean) => void;
  defaultStaffId?: string;
}

export const SalaryPaymentModal: React.FC<SalaryPaymentModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onSave,
  defaultStaffId,
}) => {
  const activeStaff = staffList.filter((s) => s.isActive);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    defaultStaffId || (activeStaff[0]?.id ?? '')
  );

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) || activeStaff[0];

  const [monthYear, setMonthYear] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${m}`;
  });

  const [basicSalary, setBasicSalary] = useState<number>(selectedStaff?.monthlySalary || 30000);
  const [bonus, setBonus] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Update basic salary when changing staff
  const handleStaffChange = (id: string) => {
    setSelectedStaffId(id);
    const s = staffList.find((item) => item.id === id);
    if (s) {
      setBasicSalary(s.monthlySalary);
    }
  };

  const netAmount = Math.max(0, basicSalary + bonus - deduction);

  const handleSubmit = (printSlip: boolean) => {
    if (!selectedStaff) {
      alert('براہ کرم عملے کا رکن منتخب کریں۔');
      return;
    }

    const voucherNumber = `SAL-${monthYear}-${Date.now().toString().slice(-4)}`;

    onSave(
      {
        staffId: selectedStaff.id,
        staffName: selectedStaff.name,
        role: selectedStaff.role,
        monthYear,
        basicSalary,
        bonus,
        deduction,
        netAmount,
        paymentDate,
        voucherNumber,
        paymentMode,
        notes: notes.trim() || undefined,
      },
      printSlip
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 text-right dir-rtl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            اساتذہ و ملازمین کی تنخواہ ادائیگی / سلپ
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Staff Member Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              استاد / ملازم کا نام <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => handleStaffChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-600"
            >
              {activeStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} — {staff.role} (مشاہرہ: {formatCurrencyPKR(staff.monthlySalary)} روپے)
                </option>
              ))}
            </select>
          </div>

          {/* Month & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تنخواہ برائے ماہ و سال <span className="text-rose-500">*</span>
              </label>
              <input
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تاریخ ادائیگی
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                بنیادی مشاہرہ (Basic Salary)
              </label>
              <input
                type="number"
                min="0"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono tabular-nums text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  اضافہ / انعام / وظیفہ (+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-emerald-900 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-800 mb-1">
                  کٹوتی / پیشگی رقم (-)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deduction}
                  onChange={(e) => setDeduction(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-rose-300 text-rose-900 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-center">
              <span className="font-bold text-slate-900">خالص قابلِ ادائیگی رقم:</span>
              <span className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
                {formatCurrencyPKR(netAmount)} روپے
              </span>
            </div>
            <p className="text-xs text-slate-600">
              بلحاظ الفاظ: <strong>{numberToWordsUrdu(netAmount)}</strong>
            </p>
          </div>

          {/* Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ادائیگی کا ذریعہ
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
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
                وضاحت / تفصیلی نوٹ
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثلاً: تنخواہ مع تدریسی انعام"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex gap-2 justify-end border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>تنخواہ ریکارڈ کریں</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>ریکارڈ اور سلپ پرنٹ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
