import React, { useState } from 'react';
import { Plus, Users, Printer, Trash2, Edit, Calendar, CheckCircle2 } from 'lucide-react';
import { MadrasaSettings, SalaryPayment, StaffMember } from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface StaffViewProps {
  staffList: StaffMember[];
  salaryPayments: SalaryPayment[];
  settings: MadrasaSettings;
  onOpenAddStaff: () => void;
  onEditStaff: (staff: StaffMember) => void;
  onOpenPaySalary: (staffId?: string) => void;
  onPrintSalarySlip: (payment: SalaryPayment) => void;
  onDeleteStaff: (id: string) => void;
  onDeleteSalaryPayment: (id: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  salaryPayments,
  settings,
  onOpenAddStaff,
  onEditStaff,
  onOpenPaySalary,
  onPrintSalarySlip,
  onDeleteStaff,
  onDeleteSalaryPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'staff_list' | 'salary_history'>('staff_list');
  const [monthFilter, setMonthFilter] = useState('');

  const totalMonthlyPayroll = staffList
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.monthlySalary, 0);

  const filteredPayments = salaryPayments.filter((p) => {
    if (monthFilter && p.monthYear !== monthFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>اساتذہ و ملازمین کا تنخواہ رجسٹر</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            اساتذہ کے ماہانہ مشاہرے، کٹوتیاں، بونس اور باضابطہ تنخواہ سلپ کا انتظام
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-right">
            <span className="text-[11px] text-emerald-800 font-medium block">کل ماہانہ تنخواہ کا تخمینہ</span>
            <span className="text-lg font-bold font-mono text-emerald-900 tabular-nums">
              {formatCurrencyPKR(totalMonthlyPayroll)} {settings.currency}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddStaff}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>نیا استاد شامل کریں</span>
            </button>
            <button
              onClick={() => onOpenPaySalary()}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>تنخواہ ادا کریں</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('staff_list')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'staff_list'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          اساتذہ و عملہ کی فہرست ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab('salary_history')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'salary_history'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          تنخواہ ادائیگی کی تاریخ و سلپس ({salaryPayments.length})
        </button>
      </div>

      {activeTab === 'staff_list' ? (
        /* Staff Members Grid/Table */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">نام استاد / ملازم</th>
                  <th className="py-3 px-4">عہدہ / شعبہ</th>
                  <th className="py-3 px-4">رابطہ نمبر</th>
                  <th className="py-3 px-4">تاریخ شمولیت</th>
                  <th className="py-3 px-4">ماہانہ مقررہ مشاہرہ</th>
                  <th className="py-3 px-4">کیفیت</th>
                  <th className="py-3 px-4 text-center">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{staff.name}</div>
                      {staff.notes && (
                        <div className="text-[11px] text-slate-500 font-normal">{staff.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{staff.role}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{staff.phone}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{staff.joinedDate}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-emerald-800 text-sm">
                      {formatCurrencyPKR(staff.monthlySalary)} {settings.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      {staff.isActive ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>حاضر سروس</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">غیر فعال</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenPaySalary(staff.id)}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold transition cursor-pointer"
                          title="تنخواہ ادا کریں"
                        >
                          تنخواہ سلپ
                        </button>
                        <button
                          onClick={() => onEditStaff(staff)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('کیا آپ اس استاد/ملازم کو حذف کرنا چاہتے ہیں؟')) {
                              onDeleteStaff(staff.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Salary Payments History */
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 w-fit text-xs">
            <span className="text-slate-600 font-medium">ماہ کے لحاظ سے فلٹر کریں:</span>
            <input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 font-mono text-slate-900"
            />
            {monthFilter && (
              <button
                onClick={() => setMonthFilter('')}
                className="text-xs text-rose-600 hover:underline"
              >
                صاف کریں
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">واؤچر نمبر</th>
                    <th className="py-3 px-4">ماہ و سال</th>
                    <th className="py-3 px-4">استاد / ملازم</th>
                    <th className="py-3 px-4">بنیادی مشاہرہ</th>
                    <th className="py-3 px-4">بونس (+)</th>
                    <th className="py-3 px-4">کٹوتی (-)</th>
                    <th className="py-3 px-4">خالص ادا شدہ</th>
                    <th className="py-3 px-4">تاریخ ادائیگی</th>
                    <th className="py-3 px-4 text-center">سلپ پرنٹ</th>
                    <th className="py-3 px-4 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-slate-400">
                        تنخواہ کی کوئی رسید نہیں ملی۔
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {p.voucherNumber}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{p.monthYear}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">{p.staffName}</span>
                          <span className="text-[11px] text-slate-500 block">{p.role}</span>
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                          {formatCurrencyPKR(p.basicSalary)}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-emerald-700">
                          {p.bonus > 0 ? `+${formatCurrencyPKR(p.bonus)}` : '۰'}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-rose-700">
                          {p.deduction > 0 ? `-${formatCurrencyPKR(p.deduction)}` : '۰'}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-bold text-emerald-800 text-sm">
                          {formatCurrencyPKR(p.netAmount)} {settings.currency}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{p.paymentDate}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onPrintSalarySlip(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>سلپ پرنٹ</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (window.confirm('کیا آپ اس تنخواہ واؤچر کو حذف کرنا چاہتے ہیں؟')) {
                                onDeleteSalaryPayment(p.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
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
      )}
    </div>
  );
};
