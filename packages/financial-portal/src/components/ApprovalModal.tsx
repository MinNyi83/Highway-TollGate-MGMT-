import { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
  title: string;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  title,
}: ApprovalModalProps) {
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'textarea, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-card rounded-2xl w-full max-w-lg mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Approve</h3>
            <textarea
              ref={textareaRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Approval notes (optional)"
              rows={3}
              className="input-field w-full resize-none"
            />
            <button
              onClick={() => {
                onApprove(notes);
                setNotes('');
                onClose();
              }}
              className="btn-success mt-2 w-full"
            >
              Approve
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reject</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Rejection reason"
              rows={3}
              className="input-field w-full resize-none"
            />
            <button
              onClick={() => {
                onReject(reason);
                setReason('');
                onClose();
              }}
              className="btn-danger mt-2 w-full"
            >
              Reject
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-secondary w-full mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
