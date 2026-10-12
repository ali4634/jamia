import React from 'react';
import { Printer, X } from 'lucide-react';
import { MadrasaSettings, SalaryPayment, Transaction } from '../types/maliyat';
import { formatCurrencyPKR, numberToWordsUrdu } from '../utils/numberToWordsUrdu';

interface PrintSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  salaryPayment?: SalaryPayment | null;
  settings: MadrasaSettings;
}

export const PrintSlipModal: React.FC<PrintSlipModalProps> = ({
  isOpen,
  onClose,
  transaction,
  salaryPayment,
  settings,
}) => {
  if (!isOpen || (!transaction && !salaryPayment)) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSalary = !!salaryPayment;
  const isIncome = transaction?.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto no-print-overlay">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 text-right dir-rtl max-h-[92vh] overflow-y-auto">
        {/* Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm font-semibold hover:bg-emerald-900 transition shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>پرنٹ نکالیں (Print)</span>
            </button>
            <span className="text-xs text-slate-500">
              پرنٹر پر A4 یا A5 سائز میں صاف پرنٹ ہوگا
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div className="printable-area border-2 border-slate-800 rounded-xl p-6 bg-amber-50/20 text-slate-900 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
            <p className="text-sm font-arabic text-slate-700 mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-2xl font-bold font-nastaliq text-emerald-900 tracking-wide mb-1">
              {settings.madrasaName}
            </h1>
            <div className="my-1.5 inline-block px-3 py-1 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 font-nastaliq text-sm font-bold shadow-xs">
              {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
            </div>
            <p className="text-xs text-slate-600 mb-0.5">
              {settings.registrationNumber}
            </p>
            <p className="text-xs text-slate-500">
              {settings.address} · فون: {settings.phone}
            </p>

            {/* Slip Title Badge */}
            <div className="mt-3 inline-block bg-slate-900 text-white text-xs font-bold px-6 py-1 rounded-md">
              {isSalary
                ? 'تنخواہ سلپ و واؤچر ادائیگی'
                : isIncome
                ? 'رسید باضابطہ برائے آمدن و عطیات'
                : 'واؤچر ادائیگی برائے اخراجات'}
            </div>
          </div>

          {/* Slip Number and Date */}
          <div className="grid grid-cols-2 gap-4 text-xs font-medium border-b border-dashed border-slate-300 pb-3 mb-4">
            <div>
              <span className="text-slate-500">
                {isSalary ? 'واؤچر نمبر:' : isIncome ? 'رسید نمبر:' : 'واؤچر خرچ نمبر:'}
              </span>{' '}
              <strong className="text-slate-900 font-mono text-sm">
                {isSalary ? salaryPayment.voucherNumber : transaction?.voucherNumber}
              </strong>
            </div>
            <div className="text-left">
              <span className="text-slate-500">تاریخ:</span>{' '}
              <strong className="text-slate-900 font-mono text-sm">
                {isSalary ? salaryPayment.paymentDate : transaction?.date}
              </strong>
            </div>
          </div>

          {/* Body Content */}
          {isSalary ? (
            /* Salary Slip View */
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200 py-1.5">
                <span className="text-slate-600">نام استاد / ملازم:</span>
                <span className="font-bold text-slate-900">{salaryPayment.staffName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1.5">
                <span className="text-slate-600">شعبہ / عہدہ:</span>
                <span className="font-semibold text-slate-800">{salaryPayment.role}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1.5">
                <span className="text-slate-600">تنخواہ برائے ماہ:</span>
                <span className="font-mono font-bold text-slate-800">{salaryPayment.monthYear}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 py-1.5">
                <span className="text-slate-600">بنیادی مشاہرہ:</span>
                <span className="font-mono tabular-nums">{formatCurrencyPKR(salaryPayment.basicSalary)} روپے</span>
              </div>
              {salaryPayment.bonus > 0 && (
                <div className="flex justify-between border-b border-slate-200 py-1.5 text-emerald-700">
                  <span>اضافہ / انعام:</span>
                  <span className="font-mono tabular-nums">+{formatCurrencyPKR(salaryPayment.bonus)} روپے</span>
                </div>
              )}
              {salaryPayment.deduction > 0 && (
                <div className="flex justify-between border-b border-slate-200 py-1.5 text-rose-700">
                  <span>کٹوتی / پیشگی:</span>
                  <span className="font-mono tabular-nums">-{formatCurrencyPKR(salaryPayment.deduction)} روپے</span>
                </div>
              )}
              <div className="flex justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900">
                <span>کل خالص ادائیگی (Net Paid):</span>
                <span className="text-base font-mono tabular-nums text-emerald-800">
                  {formatCurrencyPKR(salaryPayment.netAmount)} {settings.currency}
                </span>
              </div>
              <div className="text-xs text-slate-700 pt-1">
                <span className="text-slate-500">بلحاظ الفاظ: </span>
                <span className="font-medium">{numberToWordsUrdu(salaryPayment.netAmount)}</span>
              </div>
              {salaryPayment.notes && (
                <div className="text-xs text-slate-600 border-t border-slate-200 pt-2">
                  <span>وضاحت: </span>
                  <span>{salaryPayment.notes}</span>
                </div>
              )}
            </div>
          ) : (
            /* Regular Income / Expense Transaction Slip */
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between border-b border-slate-200 py-1.5">
                <span className="text-slate-600">
                  {isIncome ? 'محترم دہندہ کا نام:' : 'نام وصول کنندہ:'}
                </span>
                <span className="font-bold text-slate-900 text-base">
                  {transaction?.personName}
                </span>
              </div>

              {(transaction?.phone || transaction?.city) && (
                <div className="flex justify-between border-b border-slate-200 py-1 text-xs text-slate-600">
                  <span>رابطہ و شہر:</span>
                  <span>
                    {transaction.phone ? `فون: ${transaction.phone}` : ''}{' '}
                    {transaction.city ? `(${transaction.city})` : ''}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 py-1.5">
                <div>
                  <span className="text-slate-600 text-xs">مد (کیٹیگری): </span>
                  <strong className="text-slate-900">{transaction?.category}</strong>
                </div>
                <div className="text-left">
                  <span className="text-slate-600 text-xs">کھاتہ / فنڈ: </span>
                  <strong className="text-slate-900">
                    {transaction?.fundType === 'zakat'
                      ? 'زکوٰۃ فنڈ'
                      : transaction?.fundType === 'imdad'
                      ? 'امداد طلبہ'
                      : transaction?.fundType === 'taameer'
                      ? 'تعمیراتی فنڈ'
                      : 'عام فنڈ'}
                  </strong>
                </div>
              </div>

              <div className="flex justify-between items-center bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 font-bold">
                <span className="text-slate-800">مبلغ (رقم):</span>
                <span className="text-xl font-mono tabular-nums text-emerald-900">
                  {formatCurrencyPKR(transaction?.amount || 0)} {settings.currency}
                </span>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">رقم بلحاظ الفاظ: </span>
                <span className="font-bold text-slate-900">
                  {numberToWordsUrdu(transaction?.amount || 0)}
                </span>
              </div>

              {transaction?.notes && (
                <div className="text-xs text-slate-600 border border-slate-100 p-2 rounded">
                  <span className="text-slate-500">تفصیل / بابت: </span>
                  <span>{transaction.notes}</span>
                </div>
              )}

              {/* Islamic Supplication */}
              {isIncome && (
                <div className="text-center py-2 text-xs font-arabic text-emerald-900 bg-emerald-50/50 rounded border border-emerald-100">
                  جَزَاكُمُ اللَّهُ خَيْرًا وَأَحْسَنَ الْجَزَاءِ فِي الدُّنْيَا وَالْآخِرَةِ
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    اللہ تعالیٰ آپ کے مال و جان میں برکت اور دین و دنیا میں فلاح عطا فرمائے۔ آمین
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-400 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">دستخط مع تاریخ</span>
              </div>
              <p className="font-semibold text-slate-800">
                {isSalary ? 'دستخط استاد / ملازم' : isIncome ? 'دستخط خزانچی / وصول کنندہ' : 'دستخط ادا کنندہ'}
              </p>
              <p className="text-[10px] text-slate-500">{settings.khazanchiName}</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center">
                <span className="text-slate-400 text-[10px]">مہر و دستخط</span>
              </div>
              <p className="font-semibold text-slate-800">دستخط و مہر مہتمم / ناظم اعلیٰ</p>
              <p className="text-[10px] text-slate-500">{settings.mohtamimName}</p>
            </div>
          </div>

          <div className="mt-4 text-center text-[10px] text-slate-400 border-t border-slate-200 pt-2 font-mono">
            جامعہ کمپیوٹرائزڈ مالیات سافٹ ویئر · یہ رسید کمپیوٹر سے تیار کی گئی ہے
          </div>
        </div>
      </div>
    </div>
  );
};
