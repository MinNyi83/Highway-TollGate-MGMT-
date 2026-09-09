import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportColumn {
  header: string;
  key: string;
  format?: (value: any) => string;
}

export function exportToPDF(
  title: string,
  data: any[],
  columns: ExportColumn[],
  filename: string
) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total Records: ${data.length}`, 14, 34);

  const headers = columns.map(c => c.header);
  const rows = data.map(row => 
    columns.map(col => {
      const val = row[col.key];
      return col.format ? col.format(val) : (val != null ? String(val) : '');
    })
  );

  autoTable(doc, {
    startY: 40,
    head: [headers],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
}
