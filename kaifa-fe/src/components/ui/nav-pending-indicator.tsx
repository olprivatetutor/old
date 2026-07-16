'use client';

import { useLinkStatus } from 'next/link';

export function NavPendingIndicator() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span aria-hidden="true" className="ml-2 inline-grid size-5 place-items-center">
      <span className="kaifa-nav-robot relative size-4 rounded-md bg-[#fff6df]">
        <span className="absolute top-1 left-1 size-1 rounded-full bg-[#49321d]" />
        <span className="absolute top-1 right-1 size-1 rounded-full bg-[#49321d]" />
      </span>
    </span>
  );
}
