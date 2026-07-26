const steps = [
  {
    number: '01',
    title: 'Pilih Bahasa & Level',
    description: 'Mulai dari Bahasa Arab atau Inggris, sesuai jenjang dan kebutuhan anak.',
  },
  {
    number: '02',
    title: 'Ikuti Asesmen Singkat',
    description: 'AI mendengarkan jawaban suara untuk menemukan titik awal belajar yang tepat.',
  },
  {
    number: '03',
    title: 'Belajar Sesuai Alur Pribadi',
    description:
      'Ikuti modul dan silabus yang menyesuaikan progres, lengkap dengan pendampingan AI.',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight text-[#2f2518] sm:text-4xl">
          Cara kerjanya
        </h2>
        <p className="mt-4 text-base leading-7 text-[#75644f] sm:text-lg">
          Tiga langkah sederhana sebelum anak mulai belajar dengan Kaifa.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative rounded-3xl border border-white/60 bg-white/50 p-7"
          >
            <span className="text-4xl font-black text-[#2f6a43]/25">{step.number}</span>
            <h3 className="mt-4 text-lg font-black tracking-tight text-[#2f2518]">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#75644f]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
