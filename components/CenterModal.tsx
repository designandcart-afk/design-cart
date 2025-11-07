'use client';
import { ReactNode } from 'react';

export default function CenterModal({
  open,
  onClose,
  children,
  title,
  maxWidth = 'max-w-3xl',
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string; // tailwind class like 'max-w-3xl' | 'max-w-4xl'
  hideClose?: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-3xl shadow-xl border border-black/10 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional header (when title provided and not hidden) */}
        {title && !hideClose && (
          <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border hover:bg-black/5 text-sm"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        )}

        {/* Content rendered by caller */}
        {children}
      </div>
    </div>
  );
}
