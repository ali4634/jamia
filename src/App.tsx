/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { DailyBackupPromptModal } from './components/DailyBackupPromptModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrintSlipModal } from './components/PrintSlipModal';
import { SalaryPaymentModal } from './components/SalaryPaymentModal';
import { SettingsModal } from './components/SettingsModal';
import { StaffModal } from './components/StaffModal';
import { TransactionFormModal } from './components/TransactionFormModal';
import { storage } from './services/storage';
import { MadrasaSettings, SalaryPayment, StaffMember, Transaction } from './types/maliyat';
import { DashboardView } from './views/DashboardView';
import { ExpensesView } from './views/ExpensesView';
import { IncomeView } from './views/IncomeView';
import { ReportsView } from './views/ReportsView';
import { RoznamchaView } from './views/RoznamchaView';
import { StaffView } from './views/StaffView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Application Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
  const [settings, setSettings] = useState<MadrasaSettings>(storage.getSettings());

  // Modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<'income' | 'expense'>('income');

  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [salaryStaffId, setSalaryStaffId] = useState<string | undefined>();

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'settings' | 'backup'>('backup');

  // Print Slip Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printTransaction, setPrintTransaction] = useState<Transaction | null>(null);
  const [printSalary, setPrintSalary] = useState<SalaryPayment | null>(null);

  // Daily Backup Prompt Modal
  const [isDailyBackupPromptOpen, setIsDailyBackupPromptOpen] = useState(false);
  const [backupPromptTrigger, setBackupPromptTrigger] = useState<
    'exit' | 'roznamcha_closing' | 'manual'
  >('manual');

  // Load data on mount
  const refreshData = () => {
    setTransactions(storage.getTransactions());
    setStaffList(storage.getStaff());
    setSalaryPayments(storage.getSalaryPayments());
    setSettings(storage.getSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Browser exit warning if backup pending
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        settings.backupConfig?.autoBackupPromptOnExit !== false &&
        storage.isDailyBackupPending()
      ) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings.backupConfig?.autoBackupPromptOnExit]);

  const handleOpenDailyBackup = (
    trigger: 'exit' | 'roznamcha_closing' | 'manual' = 'manual'
  ) => {
    setBackupPromptTrigger(trigger);
    setIsDailyBackupPromptOpen(true);
  };

  // Handlers for Transactions
  const handleOpenNewTransaction = (type: 'income' | 'expense' = 'income') => {
    setTxModalType(type);
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    printAfterSave = false
  ) => {
    const saved = storage.addTransaction(txData);
    refreshData();
    if (printAfterSave) {
      setPrintTransaction(saved);
      setPrintSalary(null);
      setIsPrintModalOpen(true);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    storage.deleteTransaction(id);
    refreshData();
  };

  const handlePrintTransaction = (tx: Transaction) => {
    setPrintTransaction(tx);
    setPrintSalary(null);
    setIsPrintModalOpen(true);
  };

  // Handlers for Staff & Salary
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (staffData: Omit<StaffMember, 'id'>) => {
    if (editingStaff) {
      storage.updateStaffMember({ ...staffData, id: editingStaff.id });
    } else {
      storage.addStaffMember(staffData);
    }
    refreshData();
  };

  const handleDeleteStaff = (id: string) => {
    storage.deleteStaffMember(id);
    refreshData();
  };

  const handleOpenPaySalary = (staffId?: string) => {
    setSalaryStaffId(staffId);
    setIsSalaryModalOpen(true);
  };

  const handleSaveSalaryPayment = (
    paymentData: Omit<SalaryPayment, 'id'>,
    printSlip = false
  ) => {
    const saved = storage.addSalaryPayment(paymentData, true);
    refreshData();
    if (printSlip) {
      setPrintSalary(saved);
      setPrintTransaction(null);
      setIsPrintModalOpen(true);
    }
  };

  const handleDeleteSalaryPayment = (id: string) => {
    storage.deleteSalaryPayment(id);
    refreshData();
  };

  const handlePrintSalarySlip = (payment: SalaryPayment) => {
    setPrintSalary(payment);
    setPrintTransaction(null);
    setIsPrintModalOpen(true);
  };

  // Settings Handlers
  const handleSaveSettings = (newSettings: MadrasaSettings) => {
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Compute next receipt or voucher number
  const nextReceiptNo = (() => {
    const relevant = transactions.filter((t) => t.type === txModalType);
    const prefix = txModalType === 'income' ? 'REC-' : 'EXP-';
    return `${prefix}${1000 + relevant.length + 1}`;
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" dir="rtl">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewTransaction={handleOpenNewTransaction}
        onOpenSettings={(tab) => {
          setSettingsTab(tab || 'backup');
          setIsSettingsModalOpen(true);
        }}
        onOpenDailyBackup={() => handleOpenDailyBackup('manual')}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            settings={settings}
            onOpenNewTransaction={handleOpenNewTransaction}
            onOpenSalaryModal={() => handleOpenPaySalary()}
            onPrintTransaction={handlePrintTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigateTab={setActiveTab}
            onOpenBackup={() => {
              setSettingsTab('backup');
              setIsSettingsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'income' && (
          <IncomeView
            transactions={transactions}
            settings={settings}
            onOpenNewIncome={() => handleOpenNewTransaction('income')}
            onPrintTransaction={handlePrintTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            transactions={transactions}
            settings={settings}
            onOpenNewExpense={() => handleOpenNewTransaction('expense')}
            onOpenSalaryModal={() => handleOpenPaySalary()}
            onPrintTransaction={handlePrintTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'staff' && (
          <StaffView
            staffList={staffList}
            salaryPayments={salaryPayments}
            settings={settings}
            onOpenAddStaff={handleOpenAddStaff}
            onEditStaff={handleEditStaff}
            onOpenPaySalary={handleOpenPaySalary}
            onPrintSalarySlip={handlePrintSalarySlip}
            onDeleteStaff={handleDeleteStaff}
            onDeleteSalaryPayment={handleDeleteSalaryPayment}
          />
        )}

        {activeTab === 'roznamcha' && (
          <RoznamchaView
            transactions={transactions}
            settings={settings}
            onTriggerDailyBackup={() => {
              refreshData();
              handleOpenDailyBackup('roznamcha_closing');
            }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView transactions={transactions} settings={settings} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="font-bold text-slate-800 font-nastaliq">{settings.madrasaName}</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="text-amber-900 font-semibold font-nastaliq text-[11px]">
              {settings.founderName ? `بانی: ${settings.founderName}` : 'بانی: شیخ الحدیث حضرت مولانا عبدالمجید رحمہ اللہ'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>آف لائن محفوظ ڈیٹا (کمپیوٹر بند ہونے پر محفوظ رہتا ہے)</span>
            <button
              onClick={() => handleOpenDailyBackup('exit')}
              className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition cursor-pointer"
            >
              یومیہ کام اختتام و بیک اپ
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* Modals */}
      <DailyBackupPromptModal
        isOpen={isDailyBackupPromptOpen}
        onClose={() => setIsDailyBackupPromptOpen(false)}
        settings={settings}
        transactions={transactions}
        onBackupSuccess={() => {
          refreshData();
        }}
        triggeredBy={backupPromptTrigger}
      />

      <TransactionFormModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        initialType={txModalType}
        defaultReceiver={settings.khazanchiName}
        nextReceiptNo={nextReceiptNo}
      />

      <SalaryPaymentModal
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        staffList={staffList}
        onSave={handleSaveSalaryPayment}
        defaultStaffId={salaryStaffId}
      />

      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSave={handleSaveStaff}
        initialData={editingStaff}
      />

      <SettingsModal
        key={`settings-${settingsTab}-${isSettingsModalOpen}`}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onDataChanged={refreshData}
        initialTab={settingsTab}
      />

      <PrintSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintTransaction(null);
          setPrintSalary(null);
        }}
        transaction={printTransaction}
        salaryPayment={printSalary}
        settings={settings}
      />
    </div>
  );
}
