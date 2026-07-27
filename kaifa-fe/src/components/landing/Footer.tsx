import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

const columns = [
  { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
  { title: 'Product', links: ['Features', 'Mobile app', 'Certificates', 'Pricing'] },
  { title: 'Resources', links: ['Blog', 'Guides', 'Changelog', 'Community'] },
  { title: 'Support', links: ['Help center', 'Status', 'Privacy', 'Terms'] },
];

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Github, label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="border-t border-rule/70 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-cta)] text-[13px] font-bold text-primary-foreground">
                K
              </span>
              <span className="font-display text-[17px] font-bold tracking-[-0.03em] text-ink">
                Kaifa
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-ink-muted">
              A modern learning platform for students, professionals, and lifelong learners.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-rule/70 text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/40 hover:text-secondary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <nav key={c.title}>
              <p className="text-[11.5px] font-semibold tracking-[0.16em] text-ink uppercase">
                {c.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-[14px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-rule/70 pt-6 sm:flex-row">
          <p className="text-[13px] text-ink-muted">
            © {new Date().getFullYear()} Kaifa. All rights reserved.
          </p>
          <p className="text-[13px] text-ink-muted">Designed and built for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
