import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle 
} from 'lucide-react';

function NotificationToast() {
  const { toasts, removeToast } = useAppState();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'error':
        return <XCircle className="text-rose-500" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={18} />;
      default:
        return <Info className="text-sky-500" size={18} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-4 border-l-emerald-500';
      case 'error': return 'border-l-4 border-l-rose-500';
      case 'warning': return 'border-l-4 border-l-amber-500';
      default: return 'border-l-4 border-l-sky-500';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto animate-slide-in-right
            ${getBorderColor(toast.type)}
          `}
        >
          <div className="shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 text-xs font-semibold leading-relaxed pr-2">
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationToast;
