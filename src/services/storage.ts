import { MadrasaSettings, SalaryPayment, StaffMember, Transaction } from '../types/maliyat';

const STORAGE_KEYS = {
  TRANSACTIONS: 'madrasa_maliyat_transactions_v1',
  STAFF: 'madrasa_maliyat_staff_v1',
  SALARIES: 'madrasa_maliyat_salaries_v1',
  SETTINGS: 'madrasa_maliyat_settings_v1',
};

export const DEFAULT_SETTINGS: MadrasaSettings = {
  madrasaName: 'جامعہ انوارالقرآن پیرپیائی نوشہرہ',
  founderName: 'شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ',
  registrationNumber: 'ملحقہ: وفاق المدارس العربیہ پاکستان',
  mohtamimName: 'مہتمم صاحب مدظلہ العالی',
  khazanchiName: 'ناظم مالیات و محاسب صاحب',
  address: 'پیرپیائی، مین جی ٹی روڈ، ضلع نوشہرہ، خیبر پختونخوا',
  phone: '0300-1234567 / 0312-3456789',
  currency: 'روپے',
  fiscalYear: '۲۰۲۶ء - ۲۰۲۷ء / ۱۴۴۸ھ',
  backupConfig: {
    autoBackupPromptOnExit: true,
    autoDownloadOnDailyClosing: true,
    lastBackupTimestamp: undefined,
    cloudSyncEnabled: false,
  },
};

export const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'مولانا مفتی عبد الرحیم صاحب',
    role: 'شیخ الحدیث و مفتی مدرسہ',
    phone: '0301-4455667',
    monthlySalary: 45000,
    joinedDate: '2023-01-15',
    isActive: true,
    notes: 'تدریس دورہ حدیث و افتاء',
  },
  {
    id: 'staff-2',
    name: 'قاری حافظ محمد اسماعیل',
    role: 'صدر مدرس شعبہ حفظ القرآن',
    phone: '0302-5566778',
    monthlySalary: 35000,
    joinedDate: '2023-03-01',
    isActive: true,
    notes: 'نگران کلاس حفظ نمبر ۱',
  },
  {
    id: 'staff-3',
    name: 'قاری عثمان علی صاحب',
    role: 'استاد تجوید و ناظرہ قرآن',
    phone: '0303-6677889',
    monthlySalary: 30000,
    joinedDate: '2024-02-10',
    isActive: true,
    notes: 'شعبہ ناظرہ و تجوید',
  },
  {
    id: 'staff-4',
    name: 'مولانا حامد حسن صاحب',
    role: 'استاد درجات کتب و عربی زبان',
    phone: '0304-7788990',
    monthlySalary: 32000,
    joinedDate: '2024-05-01',
    isActive: true,
    notes: 'درجہ اولیٰ و ثانیہ',
  },
  {
    id: 'staff-5',
    name: 'منظور حسین صاحب',
    role: 'خادم خاص و نگران مطبخ',
    phone: '0305-8899001',
    monthlySalary: 25000,
    joinedDate: '2022-11-20',
    isActive: true,
    notes: 'طعام طلبہ و صفائی',
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    voucherNumber: 'REC-1041',
    type: 'income',
    amount: 150000,
    category: 'زکوٰۃ',
    fundType: 'zakat',
    paymentMode: 'bank',
    date: '2026-10-02',
    personName: 'چوہدری محمد فاروق صاحب',
    phone: '0300-8451234',
    city: 'لاہور',
    notes: 'سالانہ زکوٰۃ برائے طعام و ضروریات طلبہ مستحقین',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-02T10:00:00').toISOString(),
  },
  {
    id: 'tx-2',
    voucherNumber: 'REC-1042',
    type: 'income',
    amount: 50000,
    category: 'عطیات عام',
    fundType: 'general',
    paymentMode: 'cash',
    date: '2026-10-04',
    personName: 'حاجی محمد اسلم تاجر غلہ منڈی',
    phone: '0321-7654321',
    city: 'گوجرانوالہ',
    notes: 'عطیہ عام برائے جاری اخراجات مدرسہ',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-04T11:30:00').toISOString(),
  },
  {
    id: 'tx-3',
    voucherNumber: 'REC-1043',
    type: 'income',
    amount: 35000,
    category: 'ماہانہ کفالتِ طالب علم',
    fundType: 'imdad',
    paymentMode: 'easypaisa',
    date: '2026-10-05',
    personName: 'ڈاکٹر طارق محمود (برطانیہ)',
    phone: '0333-1122334',
    city: 'لندن / اسلام آباد',
    notes: 'پانچ یتیم طلبہ کی ماہانہ کفالت',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-05T14:15:00').toISOString(),
  },
  {
    id: 'tx-4',
    voucherNumber: 'REC-1044',
    type: 'income',
    amount: 75000,
    category: 'تعمیراتی فنڈ',
    fundType: 'taameer',
    paymentMode: 'bank',
    date: '2026-10-06',
    personName: 'سیٹھ سلیمان سمیع',
    phone: '0302-9988776',
    city: 'فیصل آباد',
    notes: 'تعمیر نئی دار الاقامہ (ہاسٹل ہال)',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-06T16:00:00').toISOString(),
  },
  {
    id: 'tx-5',
    voucherNumber: 'EXP-501',
    type: 'expense',
    amount: 48500,
    category: 'مطبخ و راشن طلبہ',
    fundType: 'zakat',
    paymentMode: 'cash',
    date: '2026-10-07',
    personName: 'المدینہ غلہ و آئل ڈیلرز',
    phone: '0320-3344556',
    city: 'مقامی مارکیٹ',
    notes: 'گندم ۵ بوری، چاول ۳ بوری، گھی ۲۰ کلو اور دالیں برائے مطبخ طلبہ',
    receivedBy: 'منظور حسین (نگران مطبخ)',
    createdAt: new Date('2026-10-07T12:00:00').toISOString(),
  },
  {
    id: 'tx-6',
    voucherNumber: 'EXP-502',
    type: 'expense',
    amount: 19200,
    category: 'یوٹیلٹی بلز (بجلی، گیس، پانی)',
    fundType: 'general',
    paymentMode: 'bank',
    date: '2026-10-08',
    personName: 'واپڈا لیسکو بل',
    city: 'محکمہ بجلی',
    notes: 'ماہ ستمبر کا بجلی کمرشل بل بمع میٹر نمبر 44901',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-08T09:45:00').toISOString(),
  },
  {
    id: 'tx-7',
    voucherNumber: 'EXP-503',
    type: 'expense',
    amount: 8500,
    category: 'علاج معالجہ و ادویات طلبہ',
    fundType: 'zakat',
    paymentMode: 'cash',
    date: '2026-10-09',
    personName: 'الشفا میڈیکل اسٹور',
    city: 'مقامی',
    notes: 'موسمی بخار و الرجی کی ادویات برائے مستحق طلبہ',
    receivedBy: 'قاری عثمان علی',
    createdAt: new Date('2026-10-09T17:20:00').toISOString(),
  },
  {
    id: 'tx-8',
    voucherNumber: 'EXP-504',
    type: 'expense',
    amount: 14000,
    category: 'مرمت و دیکھ بھال بلڈنگ',
    fundType: 'general',
    paymentMode: 'cash',
    date: '2026-10-10',
    personName: 'استاد بشیر پلمبر و سینیٹری',
    city: 'مقامی',
    notes: 'وضو خانہ و موٹر پمپ کی مکمل مرمت و پائپ فٹنگ',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-10-10T15:10:00').toISOString(),
  },
  // September 2026
  {
    id: 'tx-sep-1',
    voucherNumber: 'REC-1035',
    type: 'income',
    amount: 180000,
    category: 'زکوٰۃ',
    fundType: 'zakat',
    paymentMode: 'bank',
    date: '2026-09-08',
    personName: 'شیخ عبد العزیز صاحب',
    notes: 'زکوٰۃ فنڈ برائے طلبہ طعام و کتب',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-09-08T10:00:00').toISOString(),
  },
  {
    id: 'tx-sep-2',
    voucherNumber: 'REC-1036',
    type: 'income',
    amount: 80000,
    category: 'عطیات عام',
    fundType: 'general',
    paymentMode: 'cash',
    date: '2026-09-18',
    personName: 'حاجی محمد امین برادرز',
    notes: 'ماہانہ فنڈ عطیہ عام',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-09-18T11:00:00').toISOString(),
  },
  {
    id: 'tx-sep-3',
    voucherNumber: 'EXP-480',
    type: 'expense',
    amount: 145000,
    category: 'تنخواہیں اساتذہ و ملازمین',
    fundType: 'general',
    paymentMode: 'bank',
    date: '2026-09-30',
    personName: 'اساتذہ و عملہ تنخواہ رجسٹر',
    notes: 'ماہ ستمبر کل مشاہرہ عملہ',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-09-30T17:00:00').toISOString(),
  },
  {
    id: 'tx-sep-4',
    voucherNumber: 'EXP-481',
    type: 'expense',
    amount: 60000,
    category: 'مطبخ و راشن طلبہ',
    fundType: 'zakat',
    paymentMode: 'cash',
    date: '2026-09-15',
    personName: 'غلہ منڈی تاجران',
    notes: 'راشن و آٹا مطبخ',
    receivedBy: 'منظور حسین',
    createdAt: new Date('2026-09-15T12:00:00').toISOString(),
  },
  // August 2026
  {
    id: 'tx-aug-1',
    voucherNumber: 'REC-1025',
    type: 'income',
    amount: 225000,
    category: 'عطیات عام',
    fundType: 'general',
    paymentMode: 'bank',
    date: '2026-08-10',
    personName: 'مخیر حضرات کراچی ویلفیئر',
    notes: 'تعاون عام برائے مدرسہ',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-08-10T10:00:00').toISOString(),
  },
  {
    id: 'tx-aug-2',
    voucherNumber: 'EXP-460',
    type: 'expense',
    amount: 180000,
    category: 'تنخواہیں اساتذہ و ملازمین',
    fundType: 'general',
    paymentMode: 'bank',
    date: '2026-08-31',
    personName: 'اساتذہ و ملازمین',
    notes: 'تنخواہیں ماہ اگست',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-08-31T17:00:00').toISOString(),
  },
  // July 2026
  {
    id: 'tx-jul-1',
    voucherNumber: 'REC-1015',
    type: 'income',
    amount: 240000,
    category: 'تعمیراتی فنڈ',
    fundType: 'taameer',
    paymentMode: 'bank',
    date: '2026-07-12',
    personName: 'حاجی نصیر احمد گوجرانوالہ',
    notes: 'تعمیراتی فنڈ نئی کلاس رومز',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-07-12T10:00:00').toISOString(),
  },
  {
    id: 'tx-jul-2',
    voucherNumber: 'EXP-440',
    type: 'expense',
    amount: 195000,
    category: 'مرمت و دیکھ بھال بلڈنگ',
    fundType: 'taameer',
    paymentMode: 'cash',
    date: '2026-07-25',
    personName: 'الرحمن بلڈرز اینڈ میٹریل',
    notes: 'سیمنٹ، اینٹیں اور مزدور اجرت',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-07-25T14:00:00').toISOString(),
  },
  // June 2026 (Qurbani)
  {
    id: 'tx-jun-1',
    voucherNumber: 'REC-1005',
    type: 'income',
    amount: 290000,
    category: 'قربانی کی کھالیں / گوشت',
    fundType: 'general',
    paymentMode: 'cash',
    date: '2026-06-20',
    personName: 'شعبہ کھالیں و قربانی مہم',
    notes: 'عید الاضحیٰ کھالیں فروخت رقم',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-06-20T16:00:00').toISOString(),
  },
  {
    id: 'tx-jun-2',
    voucherNumber: 'EXP-420',
    type: 'expense',
    amount: 215000,
    category: 'مطبخ و راشن طلبہ',
    fundType: 'zakat',
    paymentMode: 'cash',
    date: '2026-06-28',
    personName: 'قربانی و مطبخ اخراجات',
    notes: 'گاڑیوں کا کرایہ و طعام طلبہ',
    receivedBy: 'منظور حسین',
    createdAt: new Date('2026-06-28T18:00:00').toISOString(),
  },
  // May 2026
  {
    id: 'tx-may-1',
    voucherNumber: 'REC-0995',
    type: 'income',
    amount: 210000,
    category: 'زکوٰۃ',
    fundType: 'zakat',
    paymentMode: 'bank',
    date: '2026-05-15',
    personName: 'سردار وقار احمد تاجر',
    notes: 'زکوٰۃ و امداد طلبہ',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-05-15T11:00:00').toISOString(),
  },
  {
    id: 'tx-may-2',
    voucherNumber: 'EXP-400',
    type: 'expense',
    amount: 165000,
    category: 'تنخواہیں اساتذہ و ملازمین',
    fundType: 'general',
    paymentMode: 'bank',
    date: '2026-05-30',
    personName: 'اساتذہ و عملہ تنخواہیں',
    notes: 'ماہ مئی تنخواہ سلپس ادائیگی',
    receivedBy: 'قاری محمد رضوان',
    createdAt: new Date('2026-05-30T17:00:00').toISOString(),
  },
];

export const DEFAULT_SALARY_PAYMENTS: SalaryPayment[] = [
  {
    id: 'sal-1',
    staffId: 'staff-1',
    staffName: 'مولانا مفتی عبد الرحیم صاحب',
    role: 'شیخ الحدیث و مفتی مدرسہ',
    monthYear: '2026-09',
    basicSalary: 45000,
    bonus: 2000,
    deduction: 0,
    netAmount: 47000,
    paymentDate: '2026-10-01',
    voucherNumber: 'SAL-2026-09-01',
    paymentMode: 'bank',
    notes: 'ماہانہ تنخواہ مع تدریسی انعام',
  },
  {
    id: 'sal-2',
    staffId: 'staff-2',
    staffName: 'قاری حافظ محمد اسماعیل',
    role: 'صدر مدرس شعبہ حفظ القرآن',
    monthYear: '2026-09',
    basicSalary: 35000,
    bonus: 0,
    deduction: 0,
    netAmount: 35000,
    paymentDate: '2026-10-01',
    voucherNumber: 'SAL-2026-09-02',
    paymentMode: 'cash',
    notes: 'تنخواہ ماہ ستمبر نقد ادا شدہ',
  },
];

class StorageService {
  // Transactions
  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= DEFAULT_TRANSACTIONS.length) {
          return parsed;
        }
        // Merge defaults if existing list is smaller
        const existingIds = new Set(parsed.map((p: Transaction) => p.id));
        const merged = [...parsed, ...DEFAULT_TRANSACTIONS.filter((d) => !existingIds.has(d.id))];
        this.saveAllTransactions(merged);
        return merged;
      }
      this.saveAllTransactions(DEFAULT_TRANSACTIONS);
      return DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  }

  saveAllTransactions(txs: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }

  addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const list = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...list];
    this.saveAllTransactions(updated);
    return newTx;
  }

  updateTransaction(tx: Transaction): void {
    const list = this.getTransactions();
    const updated = list.map((item) => (item.id === tx.id ? tx : item));
    this.saveAllTransactions(updated);
  }

  deleteTransaction(id: string): void {
    const list = this.getTransactions();
    const updated = list.filter((item) => item.id !== id);
    this.saveAllTransactions(updated);
  }

  // Staff
  getStaff(): StaffMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (data) return JSON.parse(data);
      this.saveAllStaff(DEFAULT_STAFF);
      return DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  }

  saveAllStaff(staff: StaffMember[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    } catch (e) {
      console.error('Failed to save staff to localStorage', e);
    }
  }

  addStaffMember(staff: Omit<StaffMember, 'id'>): StaffMember {
    const list = this.getStaff();
    const newStaff: StaffMember = {
      ...staff,
      id: 'staff-' + Date.now(),
    };
    const updated = [...list, newStaff];
    this.saveAllStaff(updated);
    return newStaff;
  }

  updateStaffMember(staff: StaffMember): void {
    const list = this.getStaff();
    const updated = list.map((s) => (s.id === staff.id ? staff : s));
    this.saveAllStaff(updated);
  }

  deleteStaffMember(id: string): void {
    const list = this.getStaff();
    const updated = list.filter((s) => s.id !== id);
    this.saveAllStaff(updated);
  }

  // Salary Payments
  getSalaryPayments(): SalaryPayment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALARIES);
      if (data) return JSON.parse(data);
      this.saveAllSalaryPayments(DEFAULT_SALARY_PAYMENTS);
      return DEFAULT_SALARY_PAYMENTS;
    } catch {
      return DEFAULT_SALARY_PAYMENTS;
    }
  }

  saveAllSalaryPayments(salaries: SalaryPayment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(salaries));
    } catch (e) {
      console.error('Failed to save salary payments to localStorage', e);
    }
  }

  addSalaryPayment(
    payment: Omit<SalaryPayment, 'id'>,
    syncAsExpense = true
  ): SalaryPayment {
    const list = this.getSalaryPayments();
    const newPayment: SalaryPayment = {
      ...payment,
      id: 'sal-' + Date.now(),
    };
    this.saveAllSalaryPayments([newPayment, ...list]);

    // Automatically record an expense transaction in the general ledger
    if (syncAsExpense) {
      this.addTransaction({
        voucherNumber: payment.voucherNumber,
        type: 'expense',
        amount: payment.netAmount,
        category: 'تنخواہیں اساتذہ و ملازمین',
        fundType: 'general',
        paymentMode: payment.paymentMode,
        date: payment.paymentDate,
        personName: payment.staffName + ` (${payment.role})`,
        notes: `تنخواہ برائے ماہ: ${payment.monthYear}${payment.notes ? ' - ' + payment.notes : ''}`,
        receivedBy: payment.staffName,
      });
    }

    return newPayment;
  }

  deleteSalaryPayment(id: string): void {
    const list = this.getSalaryPayments();
    const updated = list.filter((p) => p.id !== id);
    this.saveAllSalaryPayments(updated);
  }

  // Settings
  getSettings(): MadrasaSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed: MadrasaSettings = JSON.parse(data);
        let modified = false;

        // Auto-upgrade if using older sample placeholder name
        if (
          !parsed.madrasaName ||
          parsed.madrasaName === 'جامعہ تعلیم القرآن و اسلامک ریسرچ سینٹر'
        ) {
          parsed.madrasaName = DEFAULT_SETTINGS.madrasaName;
          parsed.address = DEFAULT_SETTINGS.address;
          modified = true;
        }

        // Auto-populate founderName if missing
        if (!parsed.founderName) {
          parsed.founderName = DEFAULT_SETTINGS.founderName;
          modified = true;
        }

        if (modified) {
          this.saveSettings(parsed);
        }
        return parsed;
      }
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: MadrasaSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  // Backup & Restore
  exportBackupJSON(): string {
    const data = {
      appName: 'مدرسہ مالیات و محاسبی نظام',
      timestamp: new Date().toISOString(),
      version: '1.0',
      settings: this.getSettings(),
      transactions: this.getTransactions(),
      staff: this.getStaff(),
      salaryPayments: this.getSalaryPayments(),
    };
    return JSON.stringify(data, null, 2);
  }

  downloadBackupFile(): string {
    try {
      const jsonStr = this.exportBackupJSON();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
      const filename = `madrasa_maliyat_backup_${dateStr}_${timeStr}.json`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.recordBackupCompleted();
      return filename;
    } catch (e) {
      console.error('Failed to trigger backup download', e);
      throw e;
    }
  }

  recordBackupCompleted(): void {
    const settings = this.getSettings();
    const nowIso = new Date().toISOString();
    const updated = {
      ...settings,
      backupConfig: {
        ...(settings.backupConfig || {
          autoBackupPromptOnExit: true,
          autoDownloadOnDailyClosing: true,
          cloudSyncEnabled: false,
        }),
        lastBackupTimestamp: nowIso,
      },
    };
    this.saveSettings(updated);
  }

  getLastBackupTimestamp(): string | undefined {
    const settings = this.getSettings();
    return settings.backupConfig?.lastBackupTimestamp;
  }

  isDailyBackupPending(): boolean {
    const lastTimestamp = this.getLastBackupTimestamp();
    if (!lastTimestamp) return true;
    const lastDate = lastTimestamp.split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return lastDate !== today;
  }

  validateBackupJSON(jsonString: string): {
    valid: boolean;
    error?: string;
    preview?: {
      txCount: number;
      staffCount: number;
      salaryCount: number;
      timestamp?: string;
      madrasaName?: string;
    };
  } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { valid: false, error: 'منتخب کردہ فائل درست JSON فارمیٹ میں نہیں ہے۔' };
      }

      if (!Array.isArray(data.transactions)) {
        return {
          valid: false,
          error: 'فائل میں مالیاتی اندراجات (transactions) کا درست ریکارڈ موجود نہیں ہے۔',
        };
      }

      const txCount = data.transactions.length;
      const staffCount = Array.isArray(data.staff) ? data.staff.length : 0;
      const salaryCount = Array.isArray(data.salaryPayments) ? data.salaryPayments.length : 0;
      const timestamp = data.timestamp;
      const madrasaName = data.settings?.madrasaName;

      return {
        valid: true,
        preview: {
          txCount,
          staffCount,
          salaryCount,
          timestamp,
          madrasaName,
        },
      };
    } catch {
      return { valid: false, error: 'فائل کو پڑھنے میں غلطی ہوئی، برائے مہربانی درست JSON فائل منتخب کریں۔' };
    }
  }

  importBackupJSON(jsonString: string): {
    success: boolean;
    message: string;
    details?: {
      txCount: number;
      staffCount: number;
      salaryCount: number;
    };
  } {
    try {
      const validation = this.validateBackupJSON(jsonString);
      if (!validation.valid || !validation.preview) {
        return {
          success: false,
          message: validation.error || 'بیک اپ فائل غیر معتبر ہے۔',
        };
      }

      const data = JSON.parse(jsonString);

      if (data.transactions && Array.isArray(data.transactions)) {
        this.saveAllTransactions(data.transactions);
      }
      if (data.staff && Array.isArray(data.staff)) {
        this.saveAllStaff(data.staff);
      }
      if (data.salaryPayments && Array.isArray(data.salaryPayments)) {
        this.saveAllSalaryPayments(data.salaryPayments);
      }
      if (data.settings && typeof data.settings === 'object') {
        this.saveSettings(data.settings);
      }

      return {
        success: true,
        message: 'بیک اپ فائل سے تمام مالیاتی ریکارڈز کامیابی کے ساتھ بحال کر دیے گئے۔',
        details: {
          txCount: validation.preview.txCount,
          staffCount: validation.preview.staffCount,
          salaryCount: validation.preview.salaryCount,
        },
      };
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      return {
        success: false,
        message: 'ڈیٹا امپورٹ کرتے وقت غیر متوقع خرابی پیش آئی۔',
      };
    }
  }

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.SALARIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.saveAllTransactions(DEFAULT_TRANSACTIONS);
    this.saveAllStaff(DEFAULT_STAFF);
    this.saveAllSalaryPayments(DEFAULT_SALARY_PAYMENTS);
    this.saveSettings(DEFAULT_SETTINGS);
  }

  exportToCSV(): string {
    const txs = this.getTransactions();
    const headers = [
      'رسید/واؤچر نمبر',
      'قسم (آمدن/خرچ)',
      'تاریخ',
      'مد/کیٹیگری',
      'فنڈ کی قسم',
      'رقم (روپے)',
      'نام دہندہ / وصول کنندہ',
      'ادائیگی کا ذریعہ',
      'رابطہ نمبر',
      'تفصیل/وضاحت',
    ];

    const rows = txs.map((tx) => [
      `"${tx.voucherNumber}"`,
      `"${tx.type === 'income' ? 'آمدن' : 'خرچ'}"`,
      `"${tx.date}"`,
      `"${tx.category}"`,
      `"${tx.fundType === 'zakat' ? 'زکوٰۃ فنڈ' : tx.fundType === 'general' ? 'عام فنڈ' : tx.fundType === 'imdad' ? 'امداد طلبہ' : 'تعمیراتی فنڈ'}"`,
      tx.amount,
      `"${tx.personName}"`,
      `"${tx.paymentMode}"`,
      `"${tx.phone || ''}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    // Prepend UTF-8 BOM so Excel opens Urdu characters cleanly
    return '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const storage = new StorageService();
