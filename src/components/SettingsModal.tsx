import React, { useRef, useState } from 'react';
import {
  X,
  Save,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  FileCode2,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { MadrasaSettings } from '../types/maliyat';
import { storage } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MadrasaSettings;
  onSaveSettings: (settings: MadrasaSettings) => void;
  onDataChanged: () => void;
  initialTab?: 'settings' | 'backup';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onDataChanged,
  initialTab = 'backup',
}) => {
  const [formData, setFormData] = useState<MadrasaSettings>({
    ...settings,
    founderName: settings.founderName || 'شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ',
  });
  const [activeTab, setActiveTab] = useState<'backup' | 'settings'>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import preview state
  const [importJsonText, setImportJsonText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    rawJson: string;
    txCount: number;
    staffCount: number;
    salaryCount: number;
    timestamp?: string;
    madrasaName?: string;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);

  // Copy indicator
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  // Current database statistics
  const currentTxs = storage.getTransactions();
  const currentStaff = storage.getStaff();
  const currentSalaries = storage.getSalaryPayments();
  const currentIncomeCount = currentTxs.filter((t) => t.type === 'income').length;
  const currentExpenseCount = currentTxs.filter((t) => t.type === 'expense').length;

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setImportSuccessMessage('مدرسہ کی معلومات اور ترتیبات کامیابی سے محفوظ ہو گئیں۔');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 1. Export JSON File Download
  const handleDownloadBackup = () => {
    try {
      const jsonStr = storage.exportBackupJSON();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
      a.href = url;
      a.download = `madrasa_maliyat_backup_${dateStr}_${timeStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setImportSuccessMessage('بیک اپ فائل (JSON) کامیابی سے آپ کے کمپیوٹر / موبائل میں ڈاؤن لوڈ ہو گئی۔');
      setTimeout(() => setImportSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
      alert('بیک اپ فائل تیار کرنے میں دشواری پیش آئی۔');
    }
  };

  // 2. Copy JSON Text to Clipboard
  const handleCopyJSON = () => {
    const jsonStr = storage.exportBackupJSON();
    navigator.clipboard.writeText(jsonStr).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 3000);
    });
  };

  // 3. Inspect and Preview JSON before restoring
  const inspectAndSetPreview = (jsonContent: string) => {
    setImportError(null);
    setImportSuccessMessage(null);

    const validation = storage.validateBackupJSON(jsonContent);
    if (!validation.valid || !validation.preview) {
      setImportError(validation.error || 'منتخب کردہ فائل درست بیک اپ نہیں ہے۔');
      setImportPreview(null);
      return;
    }

    setImportPreview({
      rawJson: jsonContent,
      txCount: validation.preview.txCount,
      staffCount: validation.preview.staffCount,
      salaryCount: validation.preview.salaryCount,
      timestamp: validation.preview.timestamp,
      madrasaName: validation.preview.madrasaName,
    });
  };

  // 4. Handle File Input Change
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        inspectAndSetPreview(content);
      }
    };
    reader.onerror = () => {
      setImportError('فائل کو پڑھنے میں ناکامی ہوئی۔ برائے مہربانی دوبارہ کوشش کریں۔');
    };
    reader.readAsText(file);

    // Reset input so user can pick the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 5. Confirm and Execute Restore
  const handleConfirmRestore = () => {
    if (!importPreview) return;

    const result = storage.importBackupJSON(importPreview.rawJson);
    if (result.success) {
      setImportSuccessMessage(result.message);
      setImportPreview(null);
      setShowPasteBox(false);
      setImportJsonText('');
      onDataChanged();
      setTimeout(() => {
        setImportSuccessMessage(null);
      }, 5000);
    } else {
      setImportError(result.message);
    }
  };

  // 6. CSV Export
  const handleExportCSV = () => {
    const csvContent = storage.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `madrasa_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 7. Reset Data
  const handleResetData = () => {
    if (
      window.confirm(
        'کیا آپ واقعی تمام موجودہ ریکارڈز صاف کر کے ابتدائی نمونہ ڈیٹا دوبارہ لوڈ کرنا چاہتے ہیں؟'
      )
    ) {
      storage.resetToDefault();
      onDataChanged();
      setImportSuccessMessage('ڈیٹا کامیابی کے ساتھ نمونہ ریکارڈز پر ری سیٹ کر دیا گیا۔');
      setTimeout(() => setImportSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 text-right dir-rtl max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">
              ڈیٹا بیک اپ، تحفظ اور ترتیبات
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {importSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccessMessage}</span>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'backup'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>ڈیٹا بیک اپ و بحالی (JSON Export & Import)</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>مدرسہ معلومات و پروفائل</span>
          </button>
        </div>

        {activeTab === 'backup' ? (
          /* JSON BACKUP & RESTORE TAB */
          <div className="space-y-5 text-sm">
            {/* Live Database Overview Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">موجودہ محفوظ شدہ ریکارڈز کا خلاصہ:</span>
                <span className="font-mono text-emerald-800 font-bold">{settings.madrasaName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">مالیاتی اندراجات</span>
                  <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    {currentTxs.length}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({currentIncomeCount} آمدن · {currentExpenseCount} خرچ)
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">اساتذہ و ملازمین</span>
                  <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    {currentStaff.length}
                  </span>
                  <span className="text-[10px] text-slate-400 block">رجسٹرڈ ارکان</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">تنخواہ سلپس</span>
                  <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    {currentSalaries.length}
                  </span>
                  <span className="text-[10px] text-slate-400 block">جاری شدہ واؤچرز</span>
                </div>
              </div>
            </div>

            {/* 1. EXPORT SECTION */}
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-700" />
                    <span>۱. بیک اپ ایکسپورٹ کریں (Export as JSON)</span>
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    مدرسہ کے تمام رسیدات، اخراجات، تنخواہوں اور نام و پتہ کی مکمل فائل اپنے کمپیوٹر، لیپ ٹاپ یا موبائل میں ڈاؤن لوڈ کر کے یو ایس بی (USB) یا گوگل ڈرائیو میں محفوظ رکھیں۔
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleDownloadBackup}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>بیک اپ فائل ڈاؤن لوڈ کریں (.json)</span>
                </button>

                <button
                  onClick={handleCopyJSON}
                  className="px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="ڈیٹا کو بطور ٹیکسٹ کاپی کریں"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>کاپی ہو گیا!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-700" />
                      <span>JSON کاپی کریں</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. IMPORT SECTION */}
            <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-slate-700" />
                  <span>۲. بیک اپ امپورٹ و بحال کریں (Import JSON File)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  اگر آپ نے نیا کمپیوٹر لیا ہے یا ونڈوز تبدیل کی ہے، تو پہلے سے محفوظ کردہ بیک اپ JSON فائل منتخب کر کے تمام مالیاتی حسابات منٹوں میں بحال کریں۔
                </p>
              </div>

              {/* Hidden Native File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileSelected}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>بیک اپ فائل منتخب کریں (.json)</span>
                </button>

                <button
                  onClick={() => setShowPasteBox(!showPasteBox)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode2 className="w-4 h-4 text-slate-600" />
                  <span>{showPasteBox ? 'پیسٹ باکس بند کریں' : 'JSON ٹیکسٹ پیسٹ کریں'}</span>
                </button>
              </div>

              {/* Paste JSON directly textarea */}
              {showPasteBox && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    بیک اپ کا JSON مواد یہاں پیسٹ کریں:
                  </label>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder="{'appName': 'مدرسہ مالیات', 'transactions': [...]}"
                    className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 bg-white"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => inspectAndSetPreview(importJsonText)}
                      disabled={!importJsonText.trim()}
                      className="px-4 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 disabled:opacity-50 transition cursor-pointer"
                    >
                      جانچ کریں (Inspect JSON)
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Import Confirmation Preview Dialog */}
              {importPreview && (
                <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>بیک اپ فائل کی تصدیق کامیاب:</span>
                    </div>
                    {importPreview.timestamp && (
                      <span className="text-[11px] font-mono text-amber-800">
                        تاریخ بیک اپ: {new Date(importPreview.timestamp).toLocaleDateString('ur-PK')}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-amber-900 space-y-1">
                    <p>
                      <strong>ادارہ:</strong> {importPreview.madrasaName || 'مدرسہ'}
                    </p>
                    <p>
                      <strong>دریافت شدہ ریکارڈز:</strong> {importPreview.txCount} مالیاتی اندراجات، {importPreview.staffCount} اساتذہ، {importPreview.salaryCount} تنخواہ سلپس۔
                    </p>
                    <p className="text-[11px] text-amber-800 pt-1">
                      ⚠️ توجہ فرمائیں: اس فائل کو بحال کرنے سے موجودہ ڈیٹا تبدیل ہو کر اس بیک اپ کے مطابق ہو جائے گا۔
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                    <button
                      onClick={() => setImportPreview(null)}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                    >
                      منسوخ کریں
                    </button>
                    <button
                      onClick={handleConfirmRestore}
                      className="px-5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>ہاں، مکمل ڈیٹا بحال کریں (Restore)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. AUTOMATED BACKUP RULES & LIFETIME DATA SAFETY */}
            <div className="border border-amber-200 bg-amber-50/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <span>۳. خودکار یومیہ بیک اپ و مستقل حفاظت کی ترتیبات</span>
                  </h3>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    کمپیوٹر یا سسٹم بند کرتے وقت یا روزنامچہ مکمل کرتے وقت خودکار بیک اپ تاکہ انسانی بھول چوک سے بھی ڈیٹا محفوظ رہے۔
                  </p>
                </div>
                {storage.getLastBackupTimestamp() && (
                  <div className="hidden sm:block text-left text-[11px] text-emerald-800 font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                    آخری بیک اپ: {storage.getLastBackupTimestamp()?.split('T')[0]}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer p-2 rounded-xl bg-white/80 hover:bg-white border border-amber-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.backupConfig?.autoBackupPromptOnExit ?? true}
                    onChange={(e) => {
                      const updated = {
                        ...formData,
                        backupConfig: {
                          ...(formData.backupConfig || {
                            autoDownloadOnDailyClosing: true,
                            cloudSyncEnabled: false,
                          }),
                          autoBackupPromptOnExit: e.target.checked,
                        },
                      };
                      setFormData(updated);
                      onSaveSettings(updated);
                    }}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="block text-slate-900">ایپ / ونڈو بند کرتے وقت خودکار بیک اپ یاد دہانی (Auto Prompt on Exit)</strong>
                    <span className="text-[11px] text-slate-500">کام ختم کرتے وقت اسکرین پر ڈاؤن لوڈ کا پرامپٹ ظاہر ہو گا۔</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer p-2 rounded-xl bg-white/80 hover:bg-white border border-amber-100 transition">
                  <input
                    type="checkbox"
                    checked={formData.backupConfig?.autoDownloadOnDailyClosing ?? true}
                    onChange={(e) => {
                      const updated = {
                        ...formData,
                        backupConfig: {
                          ...(formData.backupConfig || {
                            autoBackupPromptOnExit: true,
                            cloudSyncEnabled: false,
                          }),
                          autoDownloadOnDailyClosing: e.target.checked,
                        },
                      };
                      setFormData(updated);
                      onSaveSettings(updated);
                    }}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <strong className="block text-slate-900">روزنامچہ اختتام پر خودکار فائل ڈاؤن لوڈ</strong>
                    <span className="text-[11px] text-slate-500">جب بھی روزنامچہ کیش بک بند کی جائے، بیک اپ خود بخود محفوظ ہو۔</span>
                  </div>
                </label>
              </div>

              {/* Hybrid Offline & Cloud Sync Note */}
              <div className="p-3 bg-white border border-amber-200 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  <span>ہائبرڈ موڈ (آف لائن + کلاؤڈ لائف ٹائم پروٹیکشن):</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  سسٹم کمپیوٹر کے اندر انٹرنیٹ کے بغیر بھی ۱۰۰٪ تیز رفتار اور محفوظ چلتا ہے۔ اگر آپ کا کمپیوٹر خراب بھی ہو جائے تو ڈاؤن لوڈ کردہ روزانہ JSON فائل کو کسی بھی نئے کمپیوٹر پر ایک سیکنڈ میں امپورٹ کر کے سارا حساب کتاب واپس لایا جا سکتا ہے۔
                </p>
              </div>
            </div>

            {/* 4. CSV Export and Reset Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>ایکسل شیٹ (CSV)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">مائیکروسافٹ ایکسل میں کھولیں</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  ڈاؤن لوڈ
                </button>
              </div>

              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-rose-700" />
                    <span>نمونہ ڈیٹا ری سیٹ</span>
                  </h4>
                  <p className="text-[11px] text-rose-700">ابتدائی ڈیفالٹ ریکارڈز</p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  ری سیٹ
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MADRASA PROFILE SETTINGS TAB */
          <form onSubmit={handleSettingsSubmit} className="space-y-3.5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                مدرسہ / جامعہ کا مکمل نام (رسیدات کے سرورق کے لیے) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.madrasaName}
                onChange={(e) => setFormData({ ...formData, madrasaName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 font-nastaliq"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                بانیِ جامعہ / سرپرستِ اعلیٰ کا نامِ گرامی (رسیدات و ہیڈرز کے لیے)
              </label>
              <input
                type="text"
                value={formData.founderName || ''}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                placeholder="شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-amber-950 focus:ring-2 focus:ring-emerald-600 font-nastaliq"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                یہ معزز نام تمام رسیدوں، واؤچرز اور یومیہ میزان نامہ پر جامعہ کے نام کے فوراً نیچے جلی حروف میں شائع ہوگا۔
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رجسٹریشن نمبر / وفاق الحاق
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  مہتمم / ناظم اعلیٰ کا نام
                </label>
                <input
                  type="text"
                  value={formData.mohtamimName}
                  onChange={(e) => setFormData({ ...formData, mohtamimName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ناظم مالیات / خزانچی کا نام
                </label>
                <input
                  type="text"
                  value={formData.khazanchiName}
                  onChange={(e) => setFormData({ ...formData, khazanchiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رابطہ فون نمبرز
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  مالی سال / ہجری سال
                </label>
                <input
                  type="text"
                  value={formData.fiscalYear}
                  onChange={(e) => setFormData({ ...formData, fiscalYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                پتہ / جائے وقوع
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                بند کریں
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ترتیبات محفوظ کریں</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
