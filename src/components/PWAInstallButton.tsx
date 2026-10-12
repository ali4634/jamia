import React, { useState } from 'react';
import { Download, Monitor, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>ایپ انسٹال شدہ ہے</span>
      </div>
    );
  }

  // Browser supported beforeinstallprompt flow (Chromium / Windows Chrome / Edge / Android)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 whitespace-nowrap cursor-pointer"
        title="اس ویب ایپ کو اپنے کمپیوٹر یا موبائل پر بغیر انٹرنیٹ چلانے کے لیے انسٹال کریں"
      >
        <Download className="w-3.5 h-3.5 text-emerald-200" />
        <span>ایپ انسٹال کریں (PWA)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5 text-emerald-700" />
          <span>آئی فون پر انسٹال طریقہ</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl text-right dir-rtl">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">آئی فون یا آئی پیڈ پر تنصیب</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                ۱. سفاری (Safari) براؤزر میں نیچے <strong>Share</strong> (شیئر) کے آئیکن پر کلک کریں۔<br />
                ۲. فہرست میں نیچے جا کر <strong>Add to Home Screen</strong> منتخب کریں۔<br />
                ۳. اب یہ ایپ ہوم اسکرین پر ڈیسک ٹاپ ایپ کی طرح چلے گی۔
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-emerald-700 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition"
              >
                سمجھ آگیا
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button that explains how to install on Chrome/Edge or Mobile
  return (
    <>
      <button
        onClick={() => setShowGuideModal(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors border border-slate-200 whitespace-nowrap cursor-pointer"
        title="کمپیوٹر یا موبائل پر ایپ انسٹال کرنے کی ہدایات"
      >
        <Monitor className="w-3.5 h-3.5 text-slate-600" />
        <span>ڈیسک ٹاپ ایپ بنائیں</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">کمپیوٹر / موبائل پر ایپ بنانے کا طریقہ</h3>
              </div>
              <button onClick={() => setShowGuideModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-3 leading-relaxed mb-5">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="font-semibold text-emerald-900 mb-1">💻 کمپیوٹر (Windows / Mac / Chrome / Edge):</p>
                <p className="text-xs text-emerald-800">
                  براؤزر کے اوپر ایڈریس بار (URL بار) کے دائیں کونے میں انسٹال آئیکن <strong>(⊕ یا Download)</strong> پر کلک کریں، یا مینیو (تین نقطے) میں جا کر <strong>&quot;Install Madrasa Maliyat&quot;</strong> یا <strong>&quot;Save and share → Install page as app&quot;</strong> منتخب کریں۔ یہ خودکار ڈیسک ٹاپ سافٹ ویئر بن جائے گی!
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1">📱 اینڈرائڈ موبائل (Android Phone):</p>
                <p className="text-xs text-slate-700">
                  کروم براؤزر کے اوپر دائیں جانب تین نقطوں پر کلک کر کے <strong>&quot;Install app&quot;</strong> یا <strong>&quot;Add to Home screen&quot;</strong> پر کلک کریں۔
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              ٹھیک ہے
            </button>
          </div>
        </div>
      )}
    </>
  );
};
