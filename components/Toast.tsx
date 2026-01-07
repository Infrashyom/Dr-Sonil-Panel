
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border transition-all duration-300 animate-slide-up min-w-[300px]
              ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : ''}
              ${toast.type === 'error' ? 'bg-white border-red-100 text-gray-800' : ''}
              ${toast.type === 'info' ? 'bg-white border-blue-100 text-gray-800' : ''}
            `}
          >
            <div className={`
              shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${toast.type === 'success' ? 'bg-green-100 text-green-600' : ''}
              ${toast.type === 'error' ? 'bg-red-100 text-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
            `}>
               {toast.type === 'success' && <CheckCircle size={18} strokeWidth={2.5} />}
               {toast.type === 'error' && <AlertCircle size={18} strokeWidth={2.5} />}
               {toast.type === 'info' && <Info size={18} strokeWidth={2.5} />}
            </div>
            
            <p className="text-sm font-bold flex-grow">{toast.message}</p>
            
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
