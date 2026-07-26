import Image from 'next/image';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-white/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
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
          </div>
          <p className="mt-4 text-sm leading-6 text-[#75644f]">
            Belajar Bahasa Arab &amp; Inggris bersama AI, dengan materi yang islami dan ramah anak.
          </p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="text-xs font-black tracking-[0.16em] text-[#2f2518] uppercase">Produk</p>
            <ul className="mt-4 space-y-2 text-sm text-[#75644f]">
              <li>
                <a href="#fitur" className="hover:text-[#2f2518]">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-[#2f2518]">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#bahasa" className="hover:text-[#2f2518]">
                  Bahasa
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black tracking-[0.16em] text-[#2f2518] uppercase">Akun</p>
            <ul className="mt-4 space-y-2 text-sm text-[#75644f]">
              <li>
                <Link href="/login" className="hover:text-[#2f2518]">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/40 px-4 py-6 text-center text-xs text-[#75644f] sm:px-6">
        &copy; {new Date().getFullYear()} Kaifa. Belajar bahasa dengan AI.
      </div>
    </footer>
  );
}
