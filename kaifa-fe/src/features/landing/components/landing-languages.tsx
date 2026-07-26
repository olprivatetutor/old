import Link from 'next/link';

const languages = [
  {
    name: 'English',
    greeting: 'Hello!',
    description: 'Pelajari percakapan dan kosakata bahasa Inggris.',
    color: 'bg-[#5ba6cf]',
    shadow: 'shadow-[0_7px_0_#347da5]',
    badge: 'EN',
  },
  {
    name: 'Arabic',
    greeting: 'مرحبا',
    description: 'Mulai memahami kosakata dan percakapan bahasa Arab.',
    color: 'bg-[#2f6a43]',
    shadow: 'shadow-[0_7px_0_#245234]',
    badge: 'AR',
  },
];

export function LandingLanguages() {
  return (
    <section id="bahasa" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#2f2518] sm:text-4xl">
          Mau belajar apa hari ini?
        </h2>
        <p className="mt-4 text-base leading-7 text-[#75644f] sm:text-lg">
          Dua bahasa siap dipelajari, dengan pendekatan yang sama menyenangkannya.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {languages.map((language) => (
          <div
            key={language.name}
            className="rounded-3xl border border-white/60 bg-[#fff9e9] p-7 shadow-[0_14px_36px_rgba(91,58,24,0.12)]"
          >
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex size-14 items-center justify-center rounded-2xl text-xl font-black text-[#fff6df] ${language.color} ${language.shadow}`}
              >
                {language.badge}
              </span>
              <div>
                <p className="text-lg font-black tracking-tight text-[#2f2518]">{language.name}</p>
                <p className="text-sm text-[#75644f]">{language.greeting}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#75644f]">{language.description}</p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#2f6a43] hover:text-[#245234]"
            >
              Coba sekarang
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
