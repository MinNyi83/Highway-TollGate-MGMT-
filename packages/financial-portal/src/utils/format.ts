export function formatMMK(amount: number): string {
  return `${amount.toLocaleString('en-US')} MMK`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getFiscalYear(date: Date): {
  year: number;
  quarter: string;
  quarterLabel: string;
} {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  const fiscalYear = month >= 3 ? year : year - 1;

  let quarter: string;
  let quarterLabel: string;

  if (month >= 3 && month <= 5) {
    quarter = 'Q1';
    quarterLabel = 'Q1 (Apr-Jun)';
  } else if (month >= 6 && month <= 8) {
    quarter = 'Q2';
    quarterLabel = 'Q2 (Jul-Sep)';
  } else if (month >= 9 && month <= 11) {
    quarter = 'Q3';
    quarterLabel = 'Q3 (Oct-Dec)';
  } else {
    quarter = 'Q4';
    quarterLabel = 'Q4 (Jan-Mar)';
  }

  return { year: fiscalYear, quarter, quarterLabel };
}
