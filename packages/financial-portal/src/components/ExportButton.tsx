import { Download } from 'lucide-react';
import { useLanguage } from '../i18n';

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
}

export default function ExportButton({ onClick, label }: ExportButtonProps) {
  const { t } = useLanguage();

  return (
    <button onClick={onClick} className="btn-secondary flex items-center gap-2">
      <Download className="w-4 h-4" />
      {label || t('exportExcel') || 'Export Excel'}
    </button>
  );
}
