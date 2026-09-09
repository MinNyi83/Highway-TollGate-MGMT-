import * as XLSX from 'xlsx';

interface Column {
  header: string;
  key: string;
}

export function exportToExcel(
  data: any[],
  columns: Column[],
  filename: string
): void {
  const headers = columns.map((col) => col.header);
  const keys = columns.map((col) => col.key);

  const rows = data.map((row) => keys.map((key) => row[key] ?? ''));

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  worksheet['!cols'] = columns.map(() => ({ wch: 18 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
