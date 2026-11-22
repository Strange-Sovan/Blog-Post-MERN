import React, { createContext, useCallback, useContext } from 'react';
import { ToastContainer, toast as toastify } from 'react-toastify';

type ToastTone = 'success' | 'error';

interface ToastContextValue {
  toast: (title: string, tone?: ToastTone, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useCallback((title: string, tone: ToastTone = 'success', description?: string) => {
    const content = (
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-sm opacity-80">{description}</p>}
      </div>
    );

    if (tone === 'error') {
      toastify.error(content);
    } else {
      toastify.success(content);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer
        className="app-toast-container"
        position="top-right"
        autoClose={4000}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        draggable
        newestOnTop
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
