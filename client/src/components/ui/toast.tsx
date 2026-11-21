import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

type ToastTone = 'success' | 'error';
interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (title: string, tone?: ToastTone, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((title: string, tone: ToastTone = 'success', description?: string) => {
    const id = Date.now() + Math.random();
    setMessages((current) => [...current, { id, title, tone, description }]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((message) => message.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {messages.map((message) => {
          const Icon = message.tone === 'success' ? CheckCircle2 : XCircle;
          return (
            <div key={message.id} className={`toast-card toast-${message.tone}`} role="status">
              <Icon size={20} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{message.title}</p>
                {message.description && <p className="mt-0.5 text-sm opacity-80">{message.description}</p>}
              </div>
              <button
                type="button"
                className="rounded p-1 opacity-70 transition hover:opacity-100"
                onClick={() => setMessages((current) => current.filter((item) => item.id !== message.id))}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
