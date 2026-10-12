/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  HelpCircle,
  X,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { authService, AuthConfig } from '../services/auth';
import { MadrasaSettings } from '../types/maliyat';

interface LoginViewProps {
  settings: MadrasaSettings;
  onLoginSuccess: () => void;
}

export function LoginView({ settings, onLoginSuccess }: LoginViewProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authConfig, setAuthConfig] = useState<AuthConfig>(authService.getAuthConfig());

  // Failed attempts and lockout protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Forgot Password / Recovery Modal state
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRecoveryNewPassword, setShowRecoveryNewPassword] = useState(false);
  const [showRecoveryConfirm, setShowRecoveryConfirm] = useState(false);
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenRecovery = () => {
    setAuthConfig(authService.getAuthConfig());
    setRecoveryAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryError(null);
    setRecoverySuccess(null);
    setIsRecoveryOpen(true);
  };

  useEffect(() => {
    setAuthConfig(authService.getAuthConfig());
    inputRef.current?.focus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    if (!password.trim()) {
      setErrorMsg('برائے مہربانی پاس ورڈ درج فرمائیں!');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const isValid = await authService.verifyPassword(password);
      if (isValid) {
        authService.setSessionActive();
        onLoginSuccess();
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setLockoutTimer(30);
          setErrorMsg('بہت زیادہ غلط کوششیں! برائے مہربانی ۳۰ سیکنڈ انتظار فرمائیں۔');
        } else {
          setErrorMsg(`غلط پاس ورڈ! برائے مہربانی درست پاس ورڈ درج کریں۔ (کوشش نمبر ${nextAttempts})`);
        }
      }
    } catch {
      setErrorMsg('تصدیق میں خرابی پیش آگئی۔ دوبارہ کوشش کریں۔');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    if (!recoveryAnswer.trim()) {
      setRecoveryError('برائے مہربانی سوال کا جواب درج کریں!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError('نیا پاس ورڈ اور تصدیق آپس میں میل نہیں کھاتے!');
      return;
    }

    if (newPassword.length < 4) {
      setRecoveryError('پاس ورڈ کم از کم ۴ ہندسوں یا حروف پر مشتمل ہونا چاہیے!');
      return;
    }

    setIsSubmittingRecovery(true);
    try {
      const res = await authService.resetPasswordWithSecurityAnswer(recoveryAnswer, newPassword);
      if (res.success) {
        setRecoverySuccess(res.message);
        setAuthConfig(authService.getAuthConfig());
        setPassword(newPassword);
        setTimeout(() => {
          setIsRecoveryOpen(false);
          setRecoverySuccess(null);
          setRecoveryAnswer('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1500);
      } else {
        setRecoveryError(res.message);
      }
    } catch {
      setRecoveryError('پاس ورڈ ری سیٹ کرنے میں خرابی پیش آئی۔');
    } finally {
      setIsSubmittingRecovery(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white"
    >
      <div className="w-full max-w-md">
        {/* Madrasa Top Card & Seal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden relative">
          {/* Top Emerald Header Decoration */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Monogram Seal */}
            <div className="relative mx-auto w-20 h-20 bg-emerald-800/80 border-2 border-amber-400 rounded-2xl flex items-center justify-center shadow-lg mb-3 backdrop-blur-sm">
              <Building2 className="w-10 h-10 text-amber-300" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Madrasa Title in Jameel Noori Nastaleeq */}
            <h1 className="text-2xl sm:text-3xl font-bold font-nastaliq text-amber-300 tracking-wide drop-shadow-sm mb-1.5 leading-snug">
              {settings.madrasaName}
            </h1>

            {/* Founder Honorific */}
            {settings.founderName && (
              <div className="inline-block px-3 py-1 bg-emerald-950/70 border border-amber-400/40 rounded-full text-xs text-amber-200 font-nastaliq">
                بانی: {settings.founderName}
              </div>
            )}

            <p className="text-xs text-emerald-200/80 mt-2 font-nastaliq">
              محفوظ مالیاتی پورٹل و محاسبی نظام
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 font-nastaliq flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                سسٹم لاگ ان و پاس ورڈ
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                مالیاتی ریکارڈز اور روزنامچہ دیکھنے کے لیے پاس ورڈ درج فرمائیں
              </p>
            </div>

            {/* First-time default hint */}
            {!authConfig.isCustomPasswordSet && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-nastaliq leading-relaxed">
                  <span className="font-bold">ابتدائی ڈیفالٹ پاس ورڈ:</span>{' '}
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-mono font-bold">123456</code>{' '}
                  ہے، لاگ ان کے بعد اوپر سیٹنگز سے نیا پاس ورڈ سیٹ فرما سکتے ہیں۔
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-medium font-nastaliq">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  پاس ورڈ (Password)
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={lockoutTimer > 0 || isLoading}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="پاس ورڈ درج کریں..."
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all disabled:opacity-50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound className="w-5 h-5 text-emerald-800" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={lockoutTimer > 0 || isLoading}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-nastaliq text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : lockoutTimer > 0 ? (
                  <span>انتظار فرمائیں ({lockoutTimer} سیکنڈ)</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>سسٹم میں داخل ہوں</span>
                  </>
                )}
              </button>

              {/* Forgot password link */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleOpenRecovery}
                  className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 transition-colors hover:underline cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  پاس ورڈ بھول گئے؟ (ریکوری)
                </button>
                <span className="text-slate-600 text-[11px]">
                  مدرسہ مالیات پورٹل v2.0
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Notice */}
        <p className="text-center text-xs text-emerald-200/70 mt-6 font-nastaliq">
          {settings.registrationNumber} · {settings.address}
        </p>
      </div>

      {/* Password Recovery Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold font-nastaliq text-base">پاس ورڈ کی بازیابی و ری سیٹ (Recovery)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRecoveryOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900">
                <p className="font-semibold text-emerald-800 mb-1">سیکورٹی سوال:</p>
                <p className="font-nastaliq text-sm text-emerald-950 font-bold">
                  {authConfig.securityQuestion || 'جامعہ انوارالقرآن کے بانی محترم کا نام کیا ہے؟'}
                </p>
                <p className="text-[11px] text-emerald-700/90 mt-1">
                  پاس ورڈ بدلنے کے لیے سیٹنگز میں دیا گیا خفیہ جواب درج فرمائیں:
                </p>
              </div>

              {recoveryError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-1.5 font-nastaliq animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-1.5 font-nastaliq animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{recoverySuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  خفیہ جواب درج کریں: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={recoveryAnswer}
                  onChange={(e) => setRecoveryAnswer(e.target.value)}
                  placeholder="خفیہ جواب یہاں لکھیں..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نیا پاس ورڈ: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRecoveryNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="کم از کم ۴ ہندسے یا حروف..."
                    className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryNewPassword(!showRecoveryNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRecoveryNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نئے پاس ورڈ کی تصدیق: <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRecoveryConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="نیا پاس ورڈ دوبارہ درج کریں..."
                    className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryConfirm(!showRecoveryConfirm)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRecoveryConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-xs hover:bg-slate-50 font-medium cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRecovery}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 shadow font-nastaliq flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingRecovery ? (
                    <span>ری سیٹ ہو رہا ہے...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>پاس ورڈ ری سیٹ کریں</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
