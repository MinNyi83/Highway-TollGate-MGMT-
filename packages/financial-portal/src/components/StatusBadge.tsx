const statusClasses: Record<string, string> = {
  PENDING: 'status-pending',
  TRANSFERRED: 'status-transferred',
  CONFIRMED: 'status-confirmed',
  DISPUTED: 'status-disputed',
  DRAFT: 'status-draft',
  SUBMITTED: 'status-submitted',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cssClass = statusClasses[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  const display = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cssClass}`}>
      {display}
    </span>
  );
}
