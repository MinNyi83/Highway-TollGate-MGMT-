import { Download, FileDown } from 'lucide-react';
import { useLanguage } from '../i18n';

interface ExportButtonProps {
  onClick: () => void;
  onPDF?: () => void;
  label?: string;
}

export default function ExportButton({ onClick, onPDF, label }: ExportButtonProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick} className="btn-secondary flex items-center gap-2">
        <Download className="w-4 h-4" />
        {label || t('exportExcel') || 'Export Excel'}
      </button>
      {onPDF && (
        <button onClick={onPDF} className="btn-secondary flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      )}
    </div>
  );
}
