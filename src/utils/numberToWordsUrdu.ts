/**
 * Convert numbers to Urdu words for Madrasa receipts and vouchers
 * مثلاً: 15400 -> پندرہ ہزار چار سو روپے فقط
 */

const onesUrdu = [
  '',
  'ایک',
  'دو',
  'تین',
  'چار',
  'پانچ',
  'چھ',
  'سات',
  'آٹھ',
  'نو',
  'دس',
  'گیارہ',
  'بارہ',
  'تیرہ',
  'چودہ',
  'پندرہ',
  'سولہ',
  'سترہ',
  'اٹھارہ',
  'انیس',
  'بیس',
  'اکیس',
  'بائیس',
  'تیئیس',
  'چوبیس',
  'پچیس',
  'چھبیس',
  'ستائیس',
  'اٹھائیس',
  'انتیس',
  'تیس',
  'اکتیس',
  'بتیس',
  'تینتیس',
  'چونتیس',
  'پینتیس',
  'چھتیس',
  'سینتیس',
  'اڑتیس',
  'انتالیس',
  'چالیس',
  'اکتالیس',
  'بیالیس',
  'تینتالیس',
  'چوالیس',
  'پینتالیس',
  'چھیاستھ',
  'سینتالیس',
  'اڑتالیس',
  'انچاس',
  'پچاس',
  'اکیاون',
  'باون',
  'تریپن',
  'چون',
  'پچپن',
  'چھپن',
  'ستاون',
  'اٹاون',
  'انسٹھ',
  'ساٹھ',
  'اکسٹھ',
  'باسٹھ',
  'تریسٹھ',
  'چونسٹھ',
  'پینسٹھ',
  'چھیاسٹھ',
  'سڑسٹھ',
  'اڑسٹھ',
  'انہتر',
  'ستر',
  'اکہتر',
  'بہتر',
  'تہتر',
  'چوہتر',
  'پچہتر',
  'چھہتر',
  'ستتر',
  'اٹھتر',
  'اناسی',
  'اسی',
  'اکیاسی',
  'بیاسی',
  'تراسی',
  'چوراسی',
  'پچاسی',
  'چھیاسی',
  'ستاسی',
  'اٹھاسی',
  'نواسی',
  'نوے',
  'اکیانوے',
  'بانوے',
  'ترانوے',
  'چورانوے',
  'پچانوے',
  'چھیانوے',
  'ستانوے',
  'اٹھانوے',
  'ننانوے',
];

export function numberToWordsUrdu(num: number): string {
  if (num === 0) return 'صفر روپے فقط';
  if (num < 0) return 'منفی ' + numberToWordsUrdu(Math.abs(num));

  let n = Math.floor(num);
  const parts: string[] = [];

  // کروڑ (Crore: 10,000,000)
  if (n >= 10000000) {
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    parts.push(`${convertHundreds(crore)} کروڑ`);
  }

  // لاکھ (Lakh: 100,000)
  if (n >= 100000) {
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    parts.push(`${convertHundreds(lakh)} لاکھ`);
  }

  // ہزار (Thousand: 1,000)
  if (n >= 1000) {
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    parts.push(`${convertHundreds(thousand)} ہزار`);
  }

  // سو (Hundred: 100)
  if (n >= 100) {
    const hundred = Math.floor(n / 100);
    n %= 100;
    parts.push(`${onesUrdu[hundred]} سو`);
  }

  // Remaining 1-99
  if (n > 0) {
    parts.push(onesUrdu[n]);
  }

  return parts.filter(Boolean).join(' ') + ' روپے فقط';
}

function convertHundreds(val: number): string {
  if (val < 100) {
    return onesUrdu[val] || '';
  }
  const h = Math.floor(val / 100);
  const rem = val % 100;
  const hStr = `${onesUrdu[h]} سو`;
  if (rem > 0) {
    return `${hStr} ${onesUrdu[rem]}`;
  }
  return hStr;
}

/**
 * Format currency with PKR commas e.g. 150,000
 */
export function formatCurrencyPKR(amount: number): string {
  return new Intl.NumberFormat('ur-PK').format(amount);
}
