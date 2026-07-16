'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

interface LogoutButtonProps {
  label?: string;
  loadingLabel?: string;
  subLabel?: string;
  loadingSubLabel?: string;
}

export function LogoutButton({
  label = 'Keluar',
  loadingLabel = 'Keluar...',
  subLabel,
  loadingSubLabel,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex min-h-11 flex-col items-center justify-center rounded-2xl bg-[#fff6df] px-4 py-2.5 text-sm font-black text-[#49321d] shadow-[0_5px_0_#d3aa70] ring-1 ring-[#e8c890] transition hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
    >
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2m-4-4h10m0 0-3-3m3 3-3 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{isLoggingOut ? loadingLabel : label}</span>
      </div>
      {(isLoggingOut ? loadingSubLabel : subLabel) && (
        <span className="text-[10px] leading-4 font-medium text-[#7a664e] italic">
          {isLoggingOut ? loadingSubLabel : subLabel}
        </span>
      )}
    </button>
  );
}
