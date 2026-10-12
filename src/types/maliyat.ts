export type FundType = 'zakat' | 'general' | 'imdad' | 'taameer';

export type TransactionType = 'income' | 'expense';

export type PaymentMode = 'cash' | 'bank' | 'easypaisa' | 'jazzcash' | 'cheque';

export interface Transaction {
  id: string;
  voucherNumber: string;
  type: TransactionType;
  amount: number;
  category: string;
  fundType: FundType;
  paymentMode: PaymentMode;
  date: string; // YYYY-MM-DD
  personName: string;
  phone?: string;
  city?: string;
  notes?: string;
  receivedBy: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string; // استاد، قاری، خادم، ناظم، باورچی، محاسب
  phone: string;
  monthlySalary: number;
  joinedDate: string;
  isActive: boolean;
  notes?: string;
}

export interface SalaryPayment {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  monthYear: string; // YYYY-MM
  basicSalary: number;
  bonus: number;
  deduction: number;
  netAmount: number;
  paymentDate: string;
  voucherNumber: string;
  paymentMode: PaymentMode;
  notes?: string;
}

export interface BackupConfig {
  autoBackupPromptOnExit: boolean;
  autoDownloadOnDailyClosing: boolean;
  lastBackupTimestamp?: string;
  cloudSyncEnabled: boolean;
}

export interface MadrasaSettings {
  madrasaName: string;
  founderName?: string;
  registrationNumber: string;
  mohtamimName: string;
  khazanchiName: string;
  address: string;
  phone: string;
  currency: string;
  fiscalYear: string;
  backupConfig?: BackupConfig;
}

export const INCOME_CATEGORIES = [
  'عطیات عام',
  'زکوٰۃ',
  'صدقات و خیرات',
  'فطرانہ',
  'قربانی کی کھالیں / گوشت',
  'امداد و تعاون برائے طلبہ',
  'ماہانہ کفالتِ طالب علم',
  'تعمیراتی فنڈ',
  'امتحانی فیس / کتب فروخت',
  'متفرق آمدن',
] as const;

export const EXPENSE_CATEGORIES = [
  'تنخواہیں اساتذہ و ملازمین',
  'مطبخ و راشن طلبہ',
  'یوٹیلٹی بلز (بجلی، گیس، پانی)',
  'مرمت و دیکھ بھال بلڈنگ',
  'کتب و درسی کتب و اسٹیشنری',
  'علاج معالجہ و ادویات طلبہ',
  'سفر و سواری و کرایہ',
  'سالانہ امتحانات و تقریبات',
  'صفائی و متفرق اشیاء',
  'دیگر ضروری اخراجات',
] as const;

export const FUND_TYPE_LABELS: Record<FundType, string> = {
  zakat: 'زکوٰۃ فنڈ (شرعی مصارف)',
  general: 'عام فنڈ (غیر زکوٰۃ)',
  imdad: 'امداد و کفالتِ طلبہ',
  taameer: 'تعمیراتی فنڈ',
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'نقد (کیش)',
  bank: 'بینک اکاؤنٹ',
  easypaisa: 'ایزی پیسہ (Easypaisa)',
  jazzcash: 'جاز کیش (JazzCash)',
  cheque: 'چیک (Cheque)',
};
