'use client';

import { useEffect, useRef, useState } from 'react';

const TOAST_EVENT = 'kaifa-toast-message';

export function queueToastMessage(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

export function ToastMessage() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const showToast = (event: Event) => {
      const toastEvent = event as CustomEvent<string>;
      setMessage(toastEvent.detail);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setMessage(null), 3500);
    };

    window.addEventListener(TOAST_EVENT, showToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, showToast);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[max(1rem,env(safe-area-inset-top))] right-3 left-3 z-50 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl bg-[#2f6a43] px-4 py-3.5 text-sm font-bold text-[#fff6df] shadow-[0_10px_30px_rgba(36,82,52,0.35)] ring-1 ring-white/25 sm:top-5 sm:right-6 sm:left-auto sm:mx-0 sm:px-5 sm:py-4"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#fff6df] text-[#2f6a43]">
        <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
          <path
            d="m4 10 4 4 8-8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {message}
    </div>
  );
}
