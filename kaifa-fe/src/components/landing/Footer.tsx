import { Instagram, Music2, Send, Youtube } from 'lucide-react';
import { Logo } from './Logo';

const columns = [
  {
    title: 'Navigasi',
    links: [
      { label: 'Beranda', href: '/#top' },
      { label: 'Fitur', href: '/#features' },
      { label: 'Kurikulum', href: '/#kurikulum' },
      { label: 'Blog', href: '#top' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang Kami', href: '/#about' },
      { label: 'Karier', href: '#top' },
      { label: 'Kontak', href: '#top' },
      { label: 'Kebijakan Privasi', href: '#top' },
      { label: 'Syarat & Ketentuan', href: '#top' },
    ],
  },
];

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Music2, label: 'TikTok' },
  { icon: Send, label: 'Telegram' },
  { icon: Youtube, label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="border-rule/70 border-t px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="text-ink-muted mt-4 max-w-xs text-[14px] leading-[1.7]">
              Platform pembelajaran pendamping berbasis AI untuk pelajar Muslim Indonesia. Belajar
              Bahasa Arab dan Bahasa Inggris lebih mudah dan bermakna.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="border-rule/70 text-ink-muted hover:border-secondary/40 hover:text-secondary grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <nav key={c.title}>
              <p className="text-ink text-[11.5px] font-semibold tracking-[0.16em] uppercase">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-ink-muted hover:text-ink text-[14px] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-ink text-[11.5px] font-semibold tracking-[0.16em] uppercase">
              Unduh Aplikasi
            </p>
            <p className="text-ink-muted mt-4 text-[14px] leading-[1.7]">
              Belajar di mana saja, kapan saja.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {['Google Play', 'App Store'].map((store) => (
                <a
                  key={store}
                  href="#top"
                  className="border-rule/70 text-ink hover:border-secondary/40 hover:text-secondary inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-colors"
                >
                  {store}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-rule/70 mt-14 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-ink-muted text-[13px]">
            © {new Date().getFullYear()} Kaifa. Hak cipta dilindungi.
          </p>
          <p className="text-ink-muted text-[13px]">
            Dirancang dan dibangun untuk learner di mana saja.
          </p>
        </div>
      </div>
    </footer>
  );
}
