/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuthConfig {
  passwordHash: string;
  isCustomPasswordSet: boolean;
  securityQuestion: string;
  securityAnswerHash: string;
  autoLockMinutes: number;
  lastUpdated: string;
}

const AUTH_STORAGE_KEY = 'madrasa_auth_v1';
const SESSION_STORAGE_KEY = 'madrasa_session_v1';

// SHA-256 hash helper with fallback
async function sha256(text: string): Promise<string> {
  const normalized = text.trim();
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Pure JS fallback hash for offline / non-crypto contexts
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'simple_' + Math.abs(hash).toString(16);
}

// Urdu text normalizer for resilient secret answer matching
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove Arabic/Urdu aerab (diacritics)
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ةۀ]/g, 'ہ')
    .replace(/\s+/g, ' ');
}

export const PRESET_SECURITY_QUESTIONS = [
  'جامعہ انوارالقرآن کے بانی محترم کا نام کیا ہے؟',
  'آپ کے پسندیدہ استاذ محترم کا نام کیا ہے؟',
  'آپ کے آبائی گاؤں یا علاقے کا نام کیا ہے؟',
  'آپ کی پسندیدہ دینی کتاب یا درس نظامی کی کتاب کا نام کیا ہے؟',
  'آپ کا خفیہ ذاتی شناختی کوڈ یا لفظ کیا ہے؟',
];

// Initial default configuration
// Default password: "123456"
// Default security question: "جامعہ انوارالقرآن کے بانی محترم کا نام کیا ہے؟"
// Default security answer: "عبدالمجید"
const DEFAULT_AUTH_CONFIG: AuthConfig = {
  passwordHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  isCustomPasswordSet: false,
  securityQuestion: 'جامعہ انوارالقرآن کے بانی محترم کا نام کیا ہے؟',
  securityAnswerHash: '', // Set on initialize
  autoLockMinutes: 15,
  lastUpdated: new Date().toISOString(),
};

class AuthService {
  private configCache: AuthConfig | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!existing) {
        // Initialize default security answer hash
        const answerHash = await sha256(normalizeAnswer('عبدالمجید'));
        const initialConfig: AuthConfig = {
          ...DEFAULT_AUTH_CONFIG,
          securityAnswerHash: answerHash,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(initialConfig));
        this.configCache = initialConfig;
      } else {
        const parsed = JSON.parse(existing);
        if (!parsed.securityAnswerHash) {
          parsed.securityAnswerHash = await sha256(normalizeAnswer('عبدالمجید'));
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
        }
        this.configCache = parsed;
      }
    } catch (e) {
      console.error('Failed to initialize auth service', e);
    }
  }

  public getAuthConfig(): AuthConfig {
    if (this.configCache) return this.configCache;
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        this.configCache = JSON.parse(saved);
        return this.configCache!;
      }
    } catch {}
    return DEFAULT_AUTH_CONFIG;
  }

  private saveConfig(config: AuthConfig): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(config));
      this.configCache = config;
    } catch (e) {
      console.error('Failed to save auth config', e);
    }
  }

  public async verifyPassword(inputPassword: string): Promise<boolean> {
    const config = this.getAuthConfig();
    const inputHash = await sha256(inputPassword);

    // Also support fallback compare with raw default 123456 for initial migration
    if (!config.isCustomPasswordSet && inputPassword.trim() === '123456') {
      return true;
    }

    return inputHash === config.passwordHash;
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const isOldValid = await this.verifyPassword(oldPassword);
    if (!isOldValid) {
      return { success: false, message: 'موجودہ پاس ورڈ غلط ہے!' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'نیا پاس ورڈ کم از کم ۴ ہندسوں یا حروف پر مشتمل ہونا چاہیے!' };
    }

    const newHash = await sha256(newPassword);
    const config = this.getAuthConfig();
    const updated: AuthConfig = {
      ...config,
      passwordHash: newHash,
      isCustomPasswordSet: true,
      lastUpdated: new Date().toISOString(),
    };
    this.saveConfig(updated);

    return { success: true, message: 'پاس ورڈ کامیابی سے تبدیل ہو گیا!' };
  }

  public async updateSecurityQuestion(
    question: string,
    answer: string
  ): Promise<{ success: boolean; message: string }> {
    if (!question.trim() || !answer.trim()) {
      return { success: false, message: 'سیکورٹی سوال اور جواب دونوں درج کرنا ضروری ہیں!' };
    }

    const normAnswer = normalizeAnswer(answer);
    const answerHash = await sha256(normAnswer);
    const config = this.getAuthConfig();
    const updated: AuthConfig = {
      ...config,
      securityQuestion: question.trim(),
      securityAnswerHash: answerHash,
      lastUpdated: new Date().toISOString(),
    };
    this.saveConfig(updated);

    return { success: true, message: 'سیکورٹی سوال اور خفیہ جواب کامیابی سے محفوظ ہو گیا!' };
  }

  public async verifySecurityAnswer(inputAnswer: string): Promise<boolean> {
    const config = this.getAuthConfig();
    const norm = normalizeAnswer(inputAnswer);
    const inputHash = await sha256(norm);
    const rawTrimHash = await sha256(inputAnswer.trim().toLowerCase());

    // Also accept founder name keywords as fallback for default question
    if (
      !config.isCustomPasswordSet ||
      config.securityQuestion.includes('بانی') ||
      !config.securityAnswerHash
    ) {
      if (
        norm.includes('عبدالمجید') ||
        norm.includes('عبد المجید') ||
        norm.includes('مولانا عبدالمجید') ||
        norm.includes('abdul majeed')
      ) {
        return true;
      }
    }

    return inputHash === config.securityAnswerHash || rawTrimHash === config.securityAnswerHash;
  }

  public async resetPasswordWithSecurityAnswer(
    answer: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const isValid = await this.verifySecurityAnswer(answer);
    if (!isValid) {
      return { success: false, message: 'سیکورٹی سوال کا جواب غلط ہے!' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'نیا پاس ورڈ کم از کم ۴ ہندسوں یا حروف پر مشتمل ہونا چاہیے!' };
    }

    const newHash = await sha256(newPassword);
    const config = this.getAuthConfig();
    const updated: AuthConfig = {
      ...config,
      passwordHash: newHash,
      isCustomPasswordSet: true,
      lastUpdated: new Date().toISOString(),
    };
    this.saveConfig(updated);

    return { success: true, message: 'پاس ورڈ کامیابی سے ری سیٹ ہو گیا!' };
  }

  // Session state (sessionStorage + active timestamp)
  public hasActiveSession(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const active = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return active === 'authenticated';
    } catch {
      return false;
    }
  }

  public setSessionActive(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'authenticated');
      sessionStorage.setItem('madrasa_session_time', Date.now().toString());
    } catch {}
  }

  public clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('madrasa_session_time');
    } catch {}
  }
}

export const authService = new AuthService();
