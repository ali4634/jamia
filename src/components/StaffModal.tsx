import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { StaffMember } from '../types/maliyat';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<StaffMember, 'id'>) => void;
  initialData?: StaffMember | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || 'استاد / مدرس');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [monthlySalary, setMonthlySalary] = useState<number | ''>(
    initialData?.monthlySalary ?? 30000
  );
  const [joinedDate, setJoinedDate] = useState(
    initialData?.joinedDate || (() => new Date().toISOString().split('T')[0])
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('براہ کرم نام درج کریں۔');
      return;
    }
    onSave({
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      monthlySalary: Number(monthlySalary) || 0,
      joinedDate,
      isActive: true,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? 'استاد / ملازم کی تفصیلات میں تبدیلی' : 'نیا استاد یا ملازم شامل کریں'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              پورا نام مع القاب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: مولانا قاری حافظ محمد اسماعیل"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                عہدہ / ذمہ داری <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="مثلاً: صدر مدرس / قاری صاحب"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ماہانہ مقررہ تنخواہ (روپے)
              </label>
              <input
                type="number"
                min="0"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="مثلاً: 35000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رابطہ نمبر
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                تاریخ شمولیت
              </label>
              <input
                type="date"
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              تدریسی شعبہ یا اضافی معلومات
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: درجہ حفظ نمبر ۲ و ناظرہ"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="pt-3 flex gap-2 justify-end border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>محفوظ کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
