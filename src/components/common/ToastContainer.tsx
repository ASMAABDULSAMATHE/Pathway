import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUniPath } from '../../context/UniPathContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUniPath();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl shadow-lg border text-xs backdrop-blur-md transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}

          <div className="flex-1 leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
