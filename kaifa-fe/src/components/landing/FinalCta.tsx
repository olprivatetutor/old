'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail } from 'lucide-react';
import { z } from 'zod';
import { Reveal } from './primitives';

const emailSchema = z.string().min(1, 'Email wajib diisi').email('Format email tidak valid');

export function FinalCta() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Format email tidak valid');
      return;
    }

    setError(null);
    setSubmitting(true);
    router.push(`/login?email=${encodeURIComponent(result.data)}`);
  };

  return (
    <section id="cta" className="relative px-4 py-16 sm:px-6">
      <Reveal>
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 overflow-hidden rounded-[32px] bg-[image:var(--gradient-cta)] p-9 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <Image
            src="/images/landing/ctx-mosque.png"
            alt=""
            aria-hidden
            loading="lazy"
            width={1024}
            height={768}
            sizes="(min-width: 640px) 224px, 160px"
            className="pointer-events-none absolute right-0 -bottom-6 h-40 w-auto opacity-15 sm:h-56"
          />
          <div className="relative max-w-xl">
            <h2 className="font-display text-primary-foreground text-[30px] leading-[1.1] font-extrabold tracking-[-0.035em] text-balance sm:text-[38px]">
              Siap memulai perjalanan belajarmu?
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-[15.5px] leading-[1.75]">
              Bergabung sekarang dan rasakan pengalaman belajar bahasa yang lebih cerdas,
              interaktif, dan bermakna.
            </p>
          </div>
          <div className="relative flex w-full flex-col items-start gap-3 lg:w-auto lg:items-center">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-start"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cta-email" className="sr-only">
                  Alamat email
                </label>
                <div className="flex h-13 w-full items-center gap-2 rounded-full bg-white/95 px-5 sm:w-72">
                  <Mail className="h-4 w-4 shrink-0 text-[#6b7280]" aria-hidden />
                  <input
                    id="cta-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Masukkan email kamu"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError(null);
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'cta-email-error' : undefined}
                    className="h-full w-full bg-transparent text-[14.5px] text-[#1f2937] placeholder-[#9ca3af] outline-none"
                  />
                </div>
                {error ? (
                  <p id="cta-email-error" role="alert" className="text-[12.5px] font-medium text-[#ffd9d9]">
                    {error}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group bg-accent text-accent-foreground inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 text-[15.5px] font-bold whitespace-nowrap shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
            <p className="text-primary-foreground/70 text-[12.5px]">
              Gratis, tanpa kartu kredit. Langsung mulai belajar.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
