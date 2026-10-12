import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Wallet,
  AlertCircle,
  FileCode2,
} from 'lucide-react';
import { storage } from '../services/storage';
import { MadrasaSettings, Transaction } from '../types/maliyat';
import { formatCurrencyPKR } from '../utils/numberToWordsUrdu';

interface DailyBackupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MadrasaSettings;
  transactions: Transaction[];
  onBackupSuccess?: () => void;
  triggeredBy?: 'exit' | 'roznamcha_closing' | 'manual';
}

export const DailyBackupPromptModal: React.FC<DailyBackupPromptModalProps> = ({
  isOpen,
  onClose,
  settings,
  transactions,
  onBackupSuccess,
  triggeredBy = 'exit',
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);
  const [rememberPreference, setRememberPreference] = useState(
    settings.backupConfig?.autoBackupPromptOnExit ?? true
  );

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayIncome = transactions
    .filter((t) => t.type === 'income' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = transactions
    .filter((t) => t.type === 'expense' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance =
    transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
    transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const handleDownload = () => {
    try {
      const filename = storage.downloadBackupFile();
      setDownloadedFileName(filename);
      setDownloadSuccess(true);
      if (onBackupSuccess) {
        onBackupSuccess();
      }
    } catch (e) {
      console.error(e);
      alert('بیک اپ فائل ڈاؤن لوڈ کرنے میں دشواری پیش آئی۔');
    }
  };

  const handleClose = () => {
    // If preference toggled, persist it
    if (settings.backupConfig?.autoBackupPromptOnExit !== rememberPreference) {
      storage.saveSettings({
        ...settings,
        backupConfig: {
          ...(settings.backupConfig || {
            autoDownloadOnDailyClosing: true,
            cloudSyncEnabled: false,
          }),
          autoBackupPromptOnExit: rememberPreference,
        },
      });
    }
    setDownloadSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-right dir-rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-amber-200 font-semibold tracking-wider block">
                {triggeredBy === 'roznamcha_closing'
                  ? 'اختتامِ روزنامچہ و کیش بک'
                  : 'حفاظتِ مالیات و تاحیات بیک اپ'}
              </span>
              <h2 className="text-xl font-bold font-nastaliq text-white">
                {triggeredBy === 'roznamcha_closing'
                  ? 'روزنامچہ اختتام: یومیہ بیک اپ محفوظ کریں'
                  : 'کام کا اختتام: یومیہ بیک اپ محفوظ کریں'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {downloadSuccess ? (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950 font-nastaliq">
                  ماشاء اللہ! بیک اپ فائل کامیابی سے ڈاؤن لوڈ ہو گئی
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  فائل آپ کے کمپیوٹر کے Downloads فولڈر میں محفوظ ہو چکی ہے:
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-mono text-emerald-900 font-bold">
                  <FileCode2 className="w-4 h-4 text-emerald-700" />
                  <span>{downloadedFileName}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600">
                یہ فائل اپنے پاس یا USB ڈرائیو میں محفوظ رکھیں، تاکہ کمپیوٹر خراب ہونے کی صورت میں بھی ریکارڈز ۱۰۰٪ محفوظ رہیں۔
              </p>
            </div>
          ) : (
            <>
              {/* Informative reassurance */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 leading-relaxed">
                  <strong className="block font-bold mb-0.5">
                    کمپیوٹر یا سسٹم بند کرنے سے قبل یومیہ بیک اپ محفوظ فرما لیں!
                  </strong>
                  ایپ بند کرنے سے ڈیٹا خود بخود ضائع نہیں ہوتا، لیکن طویل مدت (سالہا سال) تک کمپیوٹر کی خرابی، ونڈوز کی تبدیلی یا براؤزر کی صفائی سے بچاؤ کے لیے روزانہ کی بیک اپ فائل محفوظ رکھنا ضروری ہے۔
                </div>
              </div>

              {/* Financial snapshot */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">آمدن آج</span>
                  <strong className="font-mono text-emerald-800 text-sm">
                    +{formatCurrencyPKR(todayIncome)}
                  </strong>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <span className="text-slate-500 block text-[11px]">اخراجات آج</span>
                  <strong className="font-mono text-rose-800 text-sm">
                    -{formatCurrencyPKR(todayExpense)}
                  </strong>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <span className="text-slate-500 block text-[11px]">موجودہ کل میزان</span>
                  <strong className="font-mono text-slate-900 text-sm">
                    {formatCurrencyPKR(totalBalance)}
                  </strong>
                </div>
              </div>

              {/* Preference toggle */}
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberPreference}
                  onChange={(e) => setRememberPreference(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                />
                <span>روزانہ کام ختم کرتے وقت اور ایپ سے نکلتے وقت یہ یاد دہانی فعال رکھیں</span>
              </label>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            {!downloadSuccess ? (
              <>
                <button
                  onClick={handleDownload}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ابھی یومیہ بیک اپ ڈاؤن لوڈ کریں (JSON)</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  بعد میں کریں
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>بہت شکریہ، بند کریں</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
