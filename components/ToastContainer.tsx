
import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle, Info, Trophy, X, AlertCircle } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-8 md:right-8 z-[150] flex flex-col gap-3 w-full max-w-sm px-4 md:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="bg-[#1a1a1a] text-white p-4 rounded-xl shadow-2xl border border-white/10 flex items-start gap-4 animate-slide-up pointer-events-auto backdrop-blur-md"
        >
          <div className={`p-2 rounded-full shrink-0 ${
             toast.type === 'achievement' ? 'bg-mnac-gold text-black' :
             toast.type === 'success' ? 'bg-green-500 text-white' :
             toast.type === 'error' ? 'bg-red-500 text-white' :
             'bg-blue-500 text-white'
          }`}>
             {toast.type === 'achievement' && <Trophy size={18} fill="currentColor" />}
             {toast.type === 'success' && <CheckCircle size={18} />}
             {toast.type === 'error' && <AlertCircle size={18} />}
             {toast.type === 'info' && <Info size={18} />}
          </div>
          
          <div className="flex-1 pt-0.5">
             <h4 className={`font-bold text-sm leading-tight ${toast.type === 'achievement' ? 'text-mnac-gold' : 'text-white'}`}>
                {toast.message}
             </h4>
             {toast.subMessage && (
                <p className="text-xs text-gray-400 mt-1 font-light">
                   {toast.subMessage}
                </p>
             )}
          </div>

          <button 
             onClick={() => onRemove(toast.id)}
             className="text-gray-500 hover:text-white transition-colors p-1"
          >
             <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
