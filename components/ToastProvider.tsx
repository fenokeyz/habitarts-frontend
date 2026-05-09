"use client";

import { createContext, useContext, useState } from "react";

type Toast = {
  id: number;
  message: string;
};

type ToastContextType = {
  addToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string) => {
    const id = Date.now();

    setToasts(prev => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="bg-white shadow-xl rounded-xl p-4 w-80 border border-pink-200 animate-fade-in"
          >
            <div className="flex justify-between items-center">
              <span className="text-black font-medium">
                {toast.message}
              </span>
              <button
                onClick={() =>
                  setToasts(prev => prev.filter(t => t.id !== toast.id))
                }
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-pink-400 animate-progress"></div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}