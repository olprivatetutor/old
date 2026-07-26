import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#bahasa', label: 'Bahasa' },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-[#f4dfbd]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="size-9 overflow-hidden rounded-xl shadow-[0_6px_16px_rgba(47,106,67,0.24)]">
            <Image
              src="/kaifa.svg"
              alt="Kaifa"
              width={64}
              height={64}
              className="size-full object-cover"
            />
          </span>
          <span className="text-lg font-black tracking-tight text-[#2f2518]">Kaifa</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#75644f] transition-colors hover:text-[#2f2518]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-[#2f6a43] px-4 py-2 text-sm font-bold text-[#fff6df] shadow-[0_6px_0_#245234] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_0_#245234]"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
