import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/logo_kaifa.jpeg"
        alt="Logo Kaifa"
        width={64}
        height={64}
        className="ring-rule/70 h-9 w-9 rounded-xl object-cover ring-1"
      />
      <span className="font-display text-ink text-[18px] font-bold tracking-[-0.03em]">Kaifa</span>
    </span>
  );
}
